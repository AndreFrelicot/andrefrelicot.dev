import { ReactNode } from "react";

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-md border border-blue-500/30 bg-blue-500/5 p-4 text-sm">
      {children}
    </div>
  );
}

export default Callout;


