/**
 * localStorage ラッパー（ウォッチリストとユーザー追加資格の永続化）
 *
 * 読み込み時に最小限のスキーマ検証を行い、汚染データで UI が壊れないようにする。
 * sub-kyu の storage.ts から思想を継承。
 */
import type { ExamSchedule, Watch, Qualification } from "../types/qualification";

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

/** ExamSchedule 単体のパース。label が文字列なら採用、他は型チェックで保護 */
function parseExamSchedule(x: unknown): ExamSchedule | undefined {
  if (!x || typeof x !== "object") return undefined;
  const s = x as Record<string, unknown>;
  if (typeof s.label !== "string" || s.label.length === 0) return undefined;
  return {
    label: s.label,
    applicationStart: typeof s.applicationStart === "string" ? s.applicationStart : undefined,
    applicationEnd: typeof s.applicationEnd === "string" ? s.applicationEnd : undefined,
    examDate: typeof s.examDate === "string" ? s.examDate : undefined,
    isYearRound: typeof s.isYearRound === "boolean" ? s.isYearRound : undefined,
    resultDate: typeof s.resultDate === "string" ? s.resultDate : undefined,
    fee: typeof s.fee === "number" ? s.fee : undefined,
  };
}

/** Qualification（カタログエントリ / ユーザー追加）の最小パース */
function parseQualification(x: unknown): Qualification | undefined {
  if (!x || typeof x !== "object") return undefined;
  const o = x as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    o.id.length === 0 ||
    typeof o.name !== "string" ||
    o.name.length === 0 ||
    typeof o.category !== "string" ||
    typeof o.organizer !== "string" ||
    typeof o.officialUrl !== "string" ||
    !Array.isArray(o.schedules)
  ) {
    return undefined;
  }
  const schedules = o.schedules
    .map(parseExamSchedule)
    .filter((s): s is ExamSchedule => s !== undefined);
  return {
    id: o.id,
    name: o.name,
    shortName: typeof o.shortName === "string" ? o.shortName : undefined,
    category: o.category as Qualification["category"],
    organizer: o.organizer,
    officialUrl: o.officialUrl,
    description: typeof o.description === "string" ? o.description : undefined,
    schedules,
  };
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
        userTargetExamDate:
          typeof w.userTargetExamDate === "string"
            ? w.userTargetExamDate
            : undefined,
        completedSchedule: parseExamSchedule(w.completedSchedule),
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
    return parsed
      .map(parseQualification)
      .filter((q): q is Qualification => q !== undefined);
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

/**
 * 新しいユーザー追加資格を localStorage に追記する。
 * `id` は呼び出し側で生成済みのものを使う（`user_` プレフィックス想定）。
 */
export function addCustomQualification(q: Qualification): Qualification[] {
  const list = [...loadCustomQualifications(), q];
  saveCustomQualifications(list);
  return list;
}

/**
 * 一意 ID を生成。`prefix` を指定するとそれを冠する。
 * - `generateId()`: `<uuid>` または `<base36ts>-<random>` を返す（プレフィックスなし）
 * - `generateId("user_")`: `user_<uuid>` または `user_<base36ts>-<random>` を返す
 */
export function generateId(prefix = ""): string {
  const body =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix}${body}`;
}

/** エクスポート JSON のスキーマバージョン（後方互換性のためのマーカー） */
export const EXPORT_SCHEMA_VERSION = "shikaku-view-v1";

export interface ExportPayload {
  version: typeof EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  watches: Watch[];
  customQualifications: Qualification[];
}

/** 現在の localStorage 状態をエクスポート用ペイロードにまとめる */
export function buildExportPayload(): ExportPayload {
  return {
    version: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    watches: loadWatches(),
    customQualifications: loadCustomQualifications(),
  };
}

/**
 * Watch 単体のパース（インポート用）。loadWatches と同じ防御をするが
 * 配列フィルタとして再利用するため関数化。
 */
function parseWatchForImport(x: unknown): Watch | undefined {
  if (!isValidWatch(x)) return undefined;
  const w = x as Record<string, unknown>;
  const status =
    typeof w.status === "string" && VALID_STATUSES.has(w.status)
      ? (w.status as Watch["status"])
      : "watching";
  const now = new Date().toISOString();
  return {
    id: w.id as string,
    qualificationId: w.qualificationId as string,
    targetScheduleLabel:
      typeof w.targetScheduleLabel === "string"
        ? w.targetScheduleLabel
        : undefined,
    userTargetExamDate:
      typeof w.userTargetExamDate === "string"
        ? w.userTargetExamDate
        : undefined,
    completedSchedule: parseExamSchedule(w.completedSchedule),
    notes: typeof w.notes === "string" ? w.notes : undefined,
    status,
    createdAt: typeof w.createdAt === "string" ? w.createdAt : now,
    updatedAt: typeof w.updatedAt === "string" ? w.updatedAt : now,
  };
}

export interface ImportParseStats {
  /** 入力 watches 件数 */
  watchesIn: number;
  /** 入力 customQualifications 件数 */
  customsIn: number;
  /** 採用後 watches 件数 */
  watchesOut: number;
  /** 採用後 customQualifications 件数 */
  customsOut: number;
}

export interface ParsedImport {
  payload: ExportPayload;
  stats: ImportParseStats;
}

/**
 * エクスポート JSON 文字列をパースし、有効なら ExportPayload を返す。
 * 不正な JSON / 不正なバージョン / 配列でない場合は null。
 * 配列内の不正エントリはフィルタで除去し、`stats` に件数差分を返す。
 */
export function parseImportJson(raw: string): ParsedImport | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Record<string, unknown>;
  if (p.version !== EXPORT_SCHEMA_VERSION) return null;
  if (!Array.isArray(p.watches) || !Array.isArray(p.customQualifications)) return null;

  const watchesIn = p.watches.length;
  const customsIn = p.customQualifications.length;
  const watches = p.watches
    .map(parseWatchForImport)
    .filter((w): w is Watch => w !== undefined);
  const customQualifications = p.customQualifications
    .map(parseQualification)
    .filter((q): q is Qualification => q !== undefined);

  return {
    payload: {
      version: EXPORT_SCHEMA_VERSION,
      exportedAt: typeof p.exportedAt === "string" ? p.exportedAt : "",
      watches,
      customQualifications,
    },
    stats: {
      watchesIn,
      customsIn,
      watchesOut: watches.length,
      customsOut: customQualifications.length,
    },
  };
}

/**
 * インポートを適用（既存データを破棄して置き換える）。
 * 入力は `parseImportJson` を通っているのでバリデーション済み。
 * 呼び出し側で確認ダイアログを出してから呼ぶこと。
 */
export function applyImport(payload: ExportPayload): void {
  saveWatches(payload.watches);
  saveCustomQualifications(payload.customQualifications);
}

/** 全データ削除（watches + customQualifications） */
export function clearAllData(): void {
  clearWatches();
  try {
    localStorage.removeItem(CUSTOM_QUALIFICATIONS_KEY);
  } catch {
    // ignore
  }
}
