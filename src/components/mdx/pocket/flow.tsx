import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import styles from "./pocket.module.css";
import type { Tone } from "./frame";

type FlowProps = { count: number; children: ReactNode };

// Stations on a rail: a horizontal line on wide screens, with a token that
// travels through each station while the card below it lifts.
export function Flow({ count, children }: FlowProps) {
  return (
    <div className={styles.flow} role="list" style={{ "--n": count } as CSSProperties}>
      <div className={styles.flowRail} aria-hidden="true">
        <span className={styles.token} />
      </div>
      {children}
    </div>
  );
}

type FlowStepProps = {
  index: number;
  tone: Tone;
  inferred?: boolean;
  children: ReactNode;
};

export function FlowStep({ index, tone, inferred, children }: FlowStepProps) {
  return (
    <div
      role="listitem"
      className={clsx(styles.step, styles[tone], inferred && styles.stepInferred)}
      style={{ "--i": index } as CSSProperties}
    >
      <span className={styles.station}>{index + 1}</span>
      {children}
    </div>
  );
}
