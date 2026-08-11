"use client";

import { useCallback, useEffect, useState } from "react";

export function usePersistedChecks(storageKey: string, ids: string[]) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      setChecked({});
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, loaded, storageKey]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const reset = useCallback(() => {
    const empty: Record<string, boolean> = {};
    ids.forEach((id) => {
      empty[id] = false;
    });
    setChecked(empty);
  }, [ids]);

  const doneCount = ids.filter((id) => checked[id]).length;

  return { checked, toggle, reset, doneCount, total: ids.length, loaded };
}

export function resetAllFloryProgress() {
  [
    "flory-ms-courses",
    "flory-ethics-mooc",
    "flory-job-prep",
    "flory-apply-it-projects",
  ].forEach((key) => localStorage.removeItem(key));
}
