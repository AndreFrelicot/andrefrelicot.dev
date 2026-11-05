"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ai.module.css";

// A scene drawn at a fixed size (in design px), scaled to its column. SVG paths
// and HTML node positions share one coordinate system, so a CSS token
// (offset-path) follows the edges exactly.
export function Stage({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setScale(Math.min(1, entry.contentRect.width / width));
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [width]);

  return (
    <div ref={ref} className={styles.stageOuter} style={{ height: height * scale }}>
      <div className={styles.stage} style={{ width, height, transform: `scale(${String(scale)})` }}>
        {children}
      </div>
    </div>
  );
}
