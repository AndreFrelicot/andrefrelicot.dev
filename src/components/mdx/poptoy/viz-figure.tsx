"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "./cx";
import { poptoyMono, poptoySans } from "./fonts";
import styles from "./viz.module.css";

// The plate every figure is printed on. Its animations only run while it is on
// screen (data-inview), and never with prefers-reduced-motion.
type VizFigureProps = {
  eyebrow: string;
  title: string;
  caption?: ReactNode;
  children: ReactNode;
  /** Overflows the reading column on large screens. */
  wide?: boolean;
};

export function VizFigure({ eyebrow, title, caption, children, wide = false }: VizFigureProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      // A pixel threshold, not a ratio: a figure taller than the screen must
      // start too.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <figure
      ref={ref}
      className={cx("not-prose", styles.viz, poptoySans.variable, poptoyMono.variable, wide && "wide")}
      data-inview={inView ? "true" : "false"}
    >
      <div className={styles.head}>
        <span className={styles.figNo}>Fig.</span>
        <span>{eyebrow}</span>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{children}</div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
