import { ReactNode } from "react";

export function SectionCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0d1b2a] border border-[#1e3a50] rounded-xl p-4 md:p-5 ${className}`}
    >
      {title && (
        <h3 className="text-[#e0f4ff] font-semibold text-sm md:text-base mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function Callout({
  tone = "info",
  children,
}: {
  tone?: "info" | "warn" | "success";
  children: ReactNode;
}) {
  const border =
    tone === "warn"
      ? "border-amber-700/60 bg-amber-950/20"
      : tone === "success"
        ? "border-emerald-700/60 bg-emerald-950/20"
        : "border-[#00e5ff]/30 bg-[#00e5ff]/5";
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm text-[#e0f4ff] ${border}`}>
      {children}
    </div>
  );
}
