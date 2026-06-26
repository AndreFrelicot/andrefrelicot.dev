"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DIST = 40;
const TAP_MOVE_TOLERANCE = 8;

type Point = { x: number; y: number };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const midpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

const clampScale = (value: number) =>
  Math.min(Math.max(value, MIN_SCALE), MAX_SCALE);

type ImageLightboxProps = {
  active: boolean;
  onClose: () => void;
  caption?: string;
  ariaLabel?: string;
  /** The full-resolution image node(s) to display inside the zoom stage. */
  children: ReactNode;
};

/**
 * Shared full-screen image viewer with robust touch/trackpad/mouse gestures:
 * pinch-to-zoom and one-finger pan (with `touch-action: none` so Android stops
 * stealing the gesture), focal-anchored wheel zoom, reliable double-tap toggle,
 * and pan bounds that keep the image locked to the viewport. Used by every
 * article image so the experience is identical everywhere.
 */
export function ImageLightbox({
  active,
  onClose,
  caption,
  ariaLabel,
  children,
}: ImageLightboxProps) {
  const [zoomed, setZoomed] = useState(false);

  // Live gesture state lives in refs so pointer handlers never read stale
  // values and we can write the transform straight to the DOM at 60fps.
  const stageRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ scale: 1, x: 0, y: 0 });
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const baseCenterRef = useRef<Point>({ x: 0, y: 0 });
  const baseSizeRef = useRef({ w: 0, h: 0 });
  const pinchRef = useRef<{ dist: number; mid: Point } | null>(null);
  const movedRef = useRef(false);
  const downPointRef = useRef<Point>({ x: 0, y: 0 });
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(
    null,
  );

  const applyTransform = useCallback(() => {
    const element = stageRef.current;
    if (!element) return;
    const { scale, x, y } = stateRef.current;
    element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  // Keep the image inside the viewport: when it is larger than the screen it
  // may pan up to the point its edges meet the screen edges, otherwise it
  // stays centred. This is what makes the zoom feel anchored instead of loose.
  const clampPan = useCallback(() => {
    const state = stateRef.current;
    const { w, h } = baseSizeRef.current;
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;
    const maxX = Math.max(0, (w * state.scale - viewW) / 2);
    const maxY = Math.max(0, (h * state.scale - viewH) / 2);
    state.x = Math.min(maxX, Math.max(-maxX, state.x));
    state.y = Math.min(maxY, Math.max(-maxY, state.y));
  }, []);

  // Snapshot the untransformed geometry once per gesture so focal-point math
  // never has to read layout mid-drag. rendered-center === base-center + pan,
  // independent of scale, so we can recover base-center by subtracting pan.
  const captureGeometry = useCallback(() => {
    const element = stageRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    baseCenterRef.current = {
      x: rect.left + rect.width / 2 - stateRef.current.x,
      y: rect.top + rect.height / 2 - stateRef.current.y,
    };
    baseSizeRef.current = { w: element.offsetWidth, h: element.offsetHeight };
  }, []);

  // Zoom to `nextScale` while keeping the point under (focalX, focalY) fixed.
  const zoomTo = useCallback(
    (nextScale: number, focalX: number, focalY: number) => {
      const state = stateRef.current;
      const clamped = clampScale(nextScale);
      const ratio = clamped / state.scale;
      const centerX = baseCenterRef.current.x + state.x;
      const centerY = baseCenterRef.current.y + state.y;
      state.x += (focalX - centerX) * (1 - ratio);
      state.y += (focalY - centerY) * (1 - ratio);
      state.scale = clamped;
    },
    [],
  );

  // Ref-only reset (no React state) so it is safe to run inside an effect.
  const resetGesture = useCallback(() => {
    stateRef.current = { scale: 1, x: 0, y: 0 };
    pointersRef.current.clear();
    pinchRef.current = null;
    lastTapRef.current = null;
    applyTransform();
  }, [applyTransform]);

  useEffect(() => {
    if (!active) return;

    // Reset the imperative gesture refs/DOM on open. No setState here: the
    // `zoomed` flag is cleared in this effect's cleanup when the viewer closes.
    resetGesture();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      setZoomed(false);
    };
  }, [active, onClose, resetGesture]);

  // Wheel / trackpad zoom, anchored at the cursor.
  useEffect(() => {
    const element = stageRef.current;
    if (!element || !active) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      captureGeometry();
      const factor = Math.exp(-event.deltaY * 0.0015);
      zoomTo(stateRef.current.scale * factor, event.clientX, event.clientY);
      clampPan();
      applyTransform();
      setZoomed(stateRef.current.scale > 1);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [active, applyTransform, captureGeometry, clampPan, zoomTo]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const pointers = pointersRef.current;
      event.currentTarget.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size === 1) {
        captureGeometry();
        movedRef.current = false;
        downPointRef.current = { x: event.clientX, y: event.clientY };
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchRef.current = { dist: distance(a, b), mid: midpoint(a, b) };
        // Two fingers down can never be a tap.
        lastTapRef.current = null;
      }
    },
    [captureGeometry],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const pointers = pointersRef.current;
      const previous = pointers.get(event.pointerId);
      if (!previous) return;

      const current = { x: event.clientX, y: event.clientY };
      pointers.set(event.pointerId, current);

      if (distance(current, downPointRef.current) > TAP_MOVE_TOLERANCE) {
        movedRef.current = true;
      }

      const state = stateRef.current;

      if (pointers.size >= 2 && pinchRef.current) {
        const [a, b] = [...pointers.values()];
        const newDist = distance(a, b);
        const newMid = midpoint(a, b);
        const previousMid = pinchRef.current.mid;

        // Pan by how far the pinch midpoint travelled...
        state.x += newMid.x - previousMid.x;
        state.y += newMid.y - previousMid.y;

        // ...then scale around the (now moved) midpoint.
        const factor = newDist / pinchRef.current.dist;
        zoomTo(state.scale * factor, newMid.x, newMid.y);

        pinchRef.current = { dist: newDist, mid: newMid };
        clampPan();
        applyTransform();
        return;
      }

      if (pointers.size === 1 && state.scale > 1) {
        state.x += current.x - previous.x;
        state.y += current.y - previous.y;
        clampPan();
        applyTransform();
      }
    },
    [applyTransform, clampPan, zoomTo],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const pointers = pointersRef.current;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      pointers.delete(event.pointerId);

      if (pointers.size < 2) {
        pinchRef.current = null;
      }

      if (pointers.size === 0) {
        const wasTap = !movedRef.current;
        const point = { x: event.clientX, y: event.clientY };

        if (wasTap) {
          const last = lastTapRef.current;
          const now = event.timeStamp;
          if (
            last &&
            now - last.time < DOUBLE_TAP_MS &&
            distance(point, last) < DOUBLE_TAP_DIST
          ) {
            captureGeometry();
            if (stateRef.current.scale > 1) {
              resetGesture();
              setZoomed(false);
            } else {
              zoomTo(DOUBLE_TAP_SCALE, point.x, point.y);
              clampPan();
              applyTransform();
              setZoomed(true);
            }
            lastTapRef.current = null;
            return;
          }
          lastTapRef.current = { time: now, x: point.x, y: point.y };
        }

        setZoomed(stateRef.current.scale > 1);
      }
    },
    [applyTransform, captureGeometry, clampPan, resetGesture, zoomTo],
  );

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close image"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xl font-semibold leading-none text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span aria-hidden="true">x</span>
      </button>
      <div
        className="flex max-h-full max-w-full flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          ref={stageRef}
          className={clsx(
            "touch-none select-none overscroll-contain",
            zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transformOrigin: "center center",
            willChange: "transform",
            touchAction: "none",
          }}
        >
          {children}
        </div>
        {caption && (
          <p className="max-w-3xl px-2 text-center text-sm text-white/75">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

export default ImageLightbox;
