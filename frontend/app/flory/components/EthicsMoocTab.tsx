"use client";

import {
  ETHICS_COURSE_URL,
  ETHICS_MODULE_IDS,
  ETHICS_MODULES,
} from "../data/ethics-mooc";
import { usePersistedChecks } from "../hooks/usePersistedChecks";
import { ChecklistItem, ProgressBar } from "./ChecklistItem";
import { SectionCard } from "./SectionCard";

export function EthicsMoocTab() {
  const { checked, toggle, doneCount, total } = usePersistedChecks(
    "flory-ethics-mooc",
    ETHICS_MODULE_IDS
  );

  return (
    <div className="space-y-4">
      <SectionCard title="UNESCO Global MOOC on the Ethics of AI">
        <p className="text-sm text-[#e0f4ff] mb-3">
          Free Coursera course. 10 modules. Ethics-by-design for AI systems you build, deploy, or govern.
        </p>
        <a
          href={ETHICS_COURSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-[#00e5ff] hover:underline mb-4"
        >
          Open course on Coursera
        </a>
        <ProgressBar done={doneCount} total={total} />
        <div>
          {ETHICS_MODULES.map((m) => (
            <div key={m.id} className="py-1">
              <ChecklistItem
                id={m.id}
                label={`Module ${m.n}: ${m.title}`}
                detail={`Flory: ${m.floryApp}`}
                checked={!!checked[m.id]}
                onToggle={toggle}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
