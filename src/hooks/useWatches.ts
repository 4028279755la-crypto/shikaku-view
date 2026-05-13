/**
 * ウォッチリスト管理フック（localStorage 永続化 + CRUD）
 * sub-kyu の useSubscriptions から構造を移植
 */
import { useCallback, useEffect, useState } from "react";
import type { Watch } from "../types/qualification";
import { loadWatches, saveWatches, generateId } from "../utils/storage";
import { nowIso } from "../utils/dates";

export function useWatches() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setWatches(loadWatches());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveWatches(watches);
  }, [watches, loaded]);

  const add = useCallback(
    (input: Omit<Watch, "id" | "createdAt" | "updatedAt" | "status"> & {
      status?: Watch["status"];
    }) => {
      const now = nowIso();
      const w: Watch = {
        ...input,
        id: generateId(),
        status: input.status ?? "watching",
        createdAt: now,
        updatedAt: now,
      };
      setWatches((prev) => [...prev, w]);
      return w.id;
    },
    []
  );

  const update = useCallback((id: string, patch: Partial<Watch>) => {
    setWatches((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, ...patch, id: w.id, updatedAt: nowIso() } : w
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setWatches((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const get = useCallback(
    (id: string) => watches.find((w) => w.id === id),
    [watches]
  );

  const clearAll = useCallback(() => setWatches([]), []);

  return { watches, loaded, add, update, remove, get, clearAll };
}
