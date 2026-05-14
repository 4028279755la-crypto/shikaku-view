/**
 * ウォッチリスト管理フック（localStorage 永続化 + CRUD）
 * sub-kyu の useSubscriptions から構造を移植
 */
import { useCallback, useEffect, useState } from "react";
import type { ExamSchedule, Watch, WatchStatus } from "../types/qualification";
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

  /**
   * ステータス変更 + スナップショット保存（D-15）
   *
   * `status === "passed"` または `"failed"` への **新規遷移時のみ**、
   * 現在の対象スケジュール（`currentSchedule`）を `completedSchedule` に
   * スプレッドコピーで保存する。
   * カタログ側で年度替わりに schedule が上書きされても履歴が残るようにする目的。
   *
   * - 既に同じ完了ステータス（passed→passed 等）への呼び出しでは snapshot しない
   *   （過去の合格回情報を新しい年度のもので上書きしないため）
   * - passed/failed → 他のステータスへ戻した場合、completedSchedule は保持（履歴として残す）
   * - currentSchedule が undefined（対象スケジュール無し）の場合はスナップショットを取らない
   */
  const setStatus = useCallback(
    (id: string, status: WatchStatus, currentSchedule?: ExamSchedule) => {
      setWatches((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          const isTransitionToCompleted =
            (status === "passed" || status === "failed") && w.status !== status;
          const shouldSnapshot = isTransitionToCompleted && currentSchedule;
          return {
            ...w,
            status,
            updatedAt: nowIso(),
            ...(shouldSnapshot
              ? { completedSchedule: { ...currentSchedule } }
              : {}),
          };
        })
      );
    },
    []
  );

  const remove = useCallback((id: string) => {
    setWatches((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const get = useCallback(
    (id: string) => watches.find((w) => w.id === id),
    [watches]
  );

  const clearAll = useCallback(() => setWatches([]), []);

  /**
   * localStorage から再読み込み（インポート後 / 全削除後の同期に使用）。
   * 通常は不要だが、永続化レイヤーを外部から変更した場合に呼ぶ。
   */
  const reload = useCallback(() => {
    setWatches(loadWatches());
  }, []);

  return { watches, loaded, add, update, setStatus, remove, get, clearAll, reload };
}
