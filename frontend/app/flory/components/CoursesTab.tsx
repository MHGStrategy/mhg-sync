"use client";

import {
  COURSES_FRAMING,
  LEARNING_STACK,
  MS_COURSE_IDS,
  MS_COURSES,
  PHASES,
} from "../data/courses";
import { usePersistedChecks } from "../hooks/usePersistedChecks";
import { ChecklistItem, ProgressBar } from "./ChecklistItem";
import { Callout, SectionCard } from "./SectionCard";

function PriorityBadge({ p }: { p: "essential" | "high" }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border ${
        p === "essential"
          ? "border-red-700/60 text-red-300 bg-red-950/30"
          : "border-amber-700/60 text-amber-300 bg-amber-950/30"
      }`}
    >
      {p === "essential" ? "Essential" : "High"}
    </span>
  );
}

export function CoursesTab() {
  const { checked, toggle, doneCount, total } = usePersistedChecks(
    "flory-ms-courses",
    MS_COURSE_IDS
  );

  return (
    <div className="space-y-4">
      <Callout>{COURSES_FRAMING}</Callout>

      <SectionCard title="Microsoft Learn checklist">
        <ProgressBar done={doneCount} total={total} />
        <div className="space-y-1">
          {MS_COURSES.map((c) => (
            <div key={c.id} className="border-b border-[#1e3a50]/40 last:border-0 py-2">
              <ChecklistItem
                id={c.id}
                label={`#${c.n} ${c.title}`}
                detail={`${c.learn}${c.time ? ` · ${c.time}` : ""}`}
                checked={!!checked[c.id]}
                onToggle={toggle}
              />
              <div className="flex flex-wrap gap-2 mt-1 ml-7">
                <PriorityBadge p={c.priority} />
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00e5ff] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open on Learn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="8 phases">
        {PHASES.map((p) => (
          <div key={p.title} className="mb-4 last:mb-0">
            <h4 className="text-[#00e5ff] text-sm font-medium mb-1">{p.title}</h4>
            <p className="text-sm text-[#e0f4ff] mb-2">{p.body}</p>
            {p.diagram && (
              <pre className="text-xs text-[#6b8fa8] bg-[#050b14] p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {p.diagram}
              </pre>
            )}
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Learning stack">
        <pre className="text-xs text-[#6b8fa8] overflow-x-auto whitespace-pre">
          {LEARNING_STACK}
        </pre>
      </SectionCard>
    </div>
  );
}
