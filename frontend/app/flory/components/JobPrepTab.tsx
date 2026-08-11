"use client";

import { JOB_PREP_GROUPS, JOB_PREP_IDS } from "../data/job-prep-checklist";
import { resetAllFloryProgress, usePersistedChecks } from "../hooks/usePersistedChecks";
import { ChecklistItem, ProgressBar } from "./ChecklistItem";
import { SectionCard } from "./SectionCard";

export function JobPrepTab() {
  const { checked, toggle, reset, doneCount, total } = usePersistedChecks(
    "flory-job-prep",
    JOB_PREP_IDS
  );

  return (
    <div className="space-y-4">
      <SectionCard>
        <ProgressBar done={doneCount} total={total} />
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all Flory prep checklists (courses, ethics, job prep, projects)?")) {
              resetAllFloryProgress();
              reset();
              window.location.reload();
            }
          }}
          className="text-xs text-[#6b8fa8] hover:text-red-400"
        >
          Reset all progress
        </button>
      </SectionCard>

      {JOB_PREP_GROUPS.map((g) => (
        <SectionCard key={g.title} title={g.title}>
          {g.items.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.label}
              detail={item.detail}
              checked={!!checked[item.id]}
              onToggle={toggle}
            />
          ))}
        </SectionCard>
      ))}
    </div>
  );
}
