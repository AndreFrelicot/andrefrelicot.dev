import clsx from "clsx";
import type { ReactNode } from "react";

type CalloutType = "info" | "tip" | "warning";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  type?: CalloutType;
};

const calloutStyles: Record<CalloutType, string> = {
  info: "border-blue-500/30 bg-blue-500/5",
  tip: "border-emerald-500/30 bg-emerald-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
};

export function Callout({ children, title, type = "info" }: CalloutProps) {
  return (
    <aside
      className={clsx(
        "my-6 rounded-md border p-4 text-sm leading-6",
        calloutStyles[type] ?? calloutStyles.info,
      )}
    >
      {title && <p className="mb-2 font-semibold text-foreground">{title}</p>}
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

export default Callout;

