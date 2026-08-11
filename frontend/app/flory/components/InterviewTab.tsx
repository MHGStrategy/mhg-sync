"use client";

import { useState } from "react";
import { INTERVIEW_QA } from "../data/interview-qa";
import { SectionCard } from "./SectionCard";

export function InterviewTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#6b8fa8]">
        60-90 seconds per answer. Result first. Mechanism second. See Conversation and Apply It tabs for strategic and inventory questions.
      </p>
      {INTERVIEW_QA.map((q) => (
        <SectionCard key={q.id}>
          <button
            type="button"
            className="w-full text-left"
            onClick={() => setOpen(open === q.id ? null : q.id)}
          >
            <div className="flex justify-between gap-2">
              <span className="text-[#e0f4ff] font-medium text-sm">{q.question}</span>
              <span className="text-[#6b8fa8] text-xs shrink-0">{open === q.id ? "▲" : "▼"}</span>
            </div>
          </button>
          {open === q.id && (
            <div className="mt-3 space-y-3 border-t border-[#1e3a50] pt-3">
              <p className="text-sm text-[#e0f4ff] leading-relaxed">{q.answer}</p>
              {q.proof && (
                <p className="text-xs text-[#00e5ff]">Proof: {q.proof}</p>
              )}
            </div>
          )}
        </SectionCard>
      ))}
    </div>
  );
}
