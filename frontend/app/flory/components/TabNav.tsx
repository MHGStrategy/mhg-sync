"use client";

export type FloryTabId =
  | "glossary"
  | "about"
  | "courses"
  | "ethics"
  | "jobprep"
  | "interview"
  | "conversation"
  | "applyit";

export const TABS: { id: FloryTabId; label: string; short: string }[] = [
  { id: "glossary", label: "Glossary", short: "Terms" },
  { id: "about", label: "About Flory", short: "About" },
  { id: "courses", label: "Courses", short: "Learn" },
  { id: "ethics", label: "AI Ethics MOOC", short: "Ethics" },
  { id: "jobprep", label: "Job Prep", short: "Prep" },
  { id: "interview", label: "Interview Q&A", short: "Q&A" },
  { id: "conversation", label: "Conversation", short: "Evolve" },
  { id: "applyit", label: "Apply It", short: "Apply" },
];

export function TabNav({
  active,
  onChange,
}: {
  active: FloryTabId;
  onChange: (id: FloryTabId) => void;
}) {
  return (
    <div className="sticky top-0 z-20 bg-[#050b14]/95 backdrop-blur border-b border-[#1e3a50] -mx-4 px-4 md:-mx-8 md:px-8 py-2 mb-6">
      <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              onChange(t.id);
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", `#${t.id}`);
              }
            }}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              active === t.id
                ? "bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40"
                : "text-[#6b8fa8] hover:text-[#e0f4ff] border border-transparent"
            }`}
          >
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
