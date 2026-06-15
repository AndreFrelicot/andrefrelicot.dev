"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Screenshot = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type ScreenshotGalleryProps = {
  images: Screenshot[];
  caption?: string;
};

export function ScreenshotGallery({ images, caption }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [transform, setTransform] = useState({ zoom: 1, x: 0, y: 0 });
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef(transform);
  const panningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const selectedImage =
    selectedIndex === null ? null : images[selectedIndex] ?? null;

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  const resetTransform = useCallback(() => {
    setTransform({ zoom: 1, x: 0, y: 0 });
  }, []);

  const closeImage = useCallback(() => {
    setSelectedIndex(null);
    resetTransform();
  }, [resetTransform]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeImage, selectedIndex]);

  useEffect(() => {
    const element = zoomContainerRef.current;
    if (!element || selectedIndex === null) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.18 : 0.18;

      setTransform((current) => {
        const zoom = Math.min(Math.max(current.zoom + delta, 1), 5);
        return {
          zoom,
          x: zoom <= 1 ? 0 : current.x,
          y: zoom <= 1 ? 0 : current.y,
        };
      });
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [selectedIndex]);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const current = transformRef.current;
    if (current.zoom <= 1) return;

    panningRef.current = true;
    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: current.x,
      panY: current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!panningRef.current) return;

    setTransform((current) => ({
      ...current,
      x:
        panStartRef.current.panX +
        (event.clientX - panStartRef.current.x) / current.zoom,
      y:
        panStartRef.current.panY +
        (event.clientY - panStartRef.current.y) / current.zoom,
    }));
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    panningRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    setTransform((current) =>
      current.zoom > 1 ? { zoom: 1, x: 0, y: 0 } : { zoom: 2.5, x: 0, y: 0 },
    );
  }, []);

  return (
    <figure className="not-prose mx-auto my-10 w-full max-w-4xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Open image: ${image.alt}`}
            onClick={() => {
              resetTransform();
              setSelectedIndex(index);
            }}
            className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03] text-left transition hover:border-foreground/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 720}
              height={image.height ?? 1485}
              sizes="(min-width: 768px) 360px, 92vw"
              unoptimized
              className="block h-auto w-full cursor-zoom-in transition duration-200 hover:scale-[1.01]"
            />
          </button>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 px-2 text-center text-sm text-foreground/60">
          {caption}
        </figcaption>
      )}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          onClick={closeImage}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 p-4 sm:p-6"
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={closeImage}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xl font-semibold leading-none text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span aria-hidden="true">x</span>
          </button>
          <div
            className="flex max-h-full max-w-full flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              ref={zoomContainerRef}
              className={`select-none ${
                transform.zoom > 1
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-zoom-in"
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleDoubleClick}
              style={{
                transform: `scale(${transform.zoom}) translate(${transform.x}px, ${transform.y}px)`,
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={selectedImage.width ?? 720}
                height={selectedImage.height ?? 1485}
                sizes="100vw"
                unoptimized
                draggable={false}
                className="max-h-[calc(100vh-5rem)] w-auto max-w-full rounded-md object-contain"
              />
            </div>
            <p className="max-w-3xl px-2 text-center text-sm text-white/75">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </figure>
  );
}
