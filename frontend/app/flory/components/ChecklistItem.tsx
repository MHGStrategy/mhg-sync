"use client";

export function ChecklistItem({
  id,
  label,
  detail,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  detail?: string;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <label className="flex gap-3 items-start cursor-pointer group py-2 border-b border-[#1e3a50]/60 last:border-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(id)}
        className="mt-1 accent-[#00e5ff] shrink-0"
      />
      <span className="flex-1 min-w-0">
        <span
          className={`text-sm block ${checked ? "text-[#6b8fa8] line-through" : "text-[#e0f4ff] group-hover:text-[#00e5ff]"}`}
        >
          {label}
        </span>
        {detail && (
          <span className="text-xs text-[#6b8fa8] block mt-0.5">{detail}</span>
        )}
      </span>
    </label>
  );
}

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-[#6b8fa8] mb-1">
        <span>
          {done} of {total} complete
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-[#050b14] rounded-full overflow-hidden border border-[#1e3a50]">
        <div
          className="h-full bg-[#00e5ff]/70 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
