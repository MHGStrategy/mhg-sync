"use client";

import { ABOUT_SECTIONS } from "../data/about-flory";
import { Callout, SectionCard } from "./SectionCard";

export function AboutFloryTab() {
  return (
    <div className="space-y-4">
      <Callout>
        Full role evolution (GP to D365, AI/service future) lives in the{" "}
        <span className="text-[#00e5ff]">Conversation</span> tab.
      </Callout>
      {ABOUT_SECTIONS.map((s) => (
        <SectionCard key={s.title} title={s.title}>
          <ul className="space-y-2">
            {s.bullets.map((b) => (
              <li key={b} className="text-sm text-[#e0f4ff] flex gap-2">
                <span className="text-[#00e5ff] shrink-0">·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      ))}
    </div>
  );
}
