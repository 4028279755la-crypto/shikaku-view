/**
 * localStorage ラッパー（ウォッチリストとユーザー追加資格の永続化）
 *
 * 読み込み時に最小限のスキーマ検証を行い、汚染データで UI が壊れないようにする。
 * sub-kyu の storage.ts から思想を継承。
 */
import type { Watch, Qualification } from "../types/qualification";

const WATCHES_KEY = "shikaku-view:watches:v1";
const CUSTOM_QUALIFICATIONS_KEY = "shikaku-view:custom-qualifications:v1";

const VALID_STATUSES = new Set([
  "watching",
  "applied",
  "passed",
  "failed",
  "skipped",
]);

function isValidWatch(x: unknown): x is Partial<Watch> & {
  id: string;
  qualificationId: string;
} {
  if (!x || typeof x !== "object") return false;
  const w = x as Record<string, unknown>;
  return (
    typeof w.id === "string" &&
    w.id.length > 0 &&
    typeof w.qualificationId === "string" &&
    w.qualificationId.length > 0
  );
}

export function loadWatches(): Watch[] {
  try {
    const raw = localStorage.getItem(WATCHES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const now = new Date().toISOString();
    return parsed.filter(isValidWatch).map((w) => {
      const status =
        typeof w.status === "string" && VALID_STATUSES.has(w.status)
          ? w.status
          : "watching";
      return {
        id: w.id,
        qualificationId: w.qualificationId,
        targetScheduleLabel:
          typeof w.targetScheduleLabel === "string"
            ? w.targetScheduleLabel
            : undefined,
        notes: typeof w.notes === "string" ? w.notes : undefined,
        status: status as Watch["status"],
        createdAt: typeof w.createdAt === "string" ? w.createdAt : now,
        updatedAt: typeof w.updatedAt === "string" ? w.updatedAt : now,
      };
    });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn("[shikaku-view] failed to load watches:", e);
    }
    return [];
  }
}

export function saveWatches(watches: Watch[]): void {
  try {
    localStorage.setItem(WATCHES_KEY, JSON.stringify(watches));
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn("[shikaku-view] failed to save watches:", e);
    }
  }
}

export function clearWatches(): void {
  try {
    localStorage.removeItem(WATCHES_KEY);
  } catch {
    // ignore
  }
}

/** ユーザー追加資格（カタログにない独自資格） */
export function loadCustomQualifications(): Qualification[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUALIFICATIONS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((q): q is Qualification => {
      if (!q || typeof q !== "object") return false;
      const o = q as Record<string, unknown>;
      return (
        typeof o.id === "string" &&
        typeof o.name === "string" &&
        Array.isArray(o.schedules)
      );
    });
  } catch {
    return [];
  }
}

export function saveCustomQualifications(list: Qualification[]): void {
  try {
    localStorage.setItem(CUSTOM_QUALIFICATIONS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
