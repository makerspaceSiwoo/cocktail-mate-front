import type { ReactNode } from "react";

interface InfoCardProps {
  children: ReactNode;
  padding?: string;
  outerPadding?: string;
}

export function InfoCard({
  children,
  padding = "18px",
  outerPadding = "14px 18px 0",
}: InfoCardProps) {
  return (
    <div style={{ padding: outerPadding }}>
      <div
        className="rounded-[14px] border border-[color:var(--border-soft)] bg-card"
        style={{ padding }}
      >
        {children}
      </div>
    </div>
  );
}
