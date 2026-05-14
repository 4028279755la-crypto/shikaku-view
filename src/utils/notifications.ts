/**
 * 通知（ローカル Notification API）
 *
 * Web Push（サーバー必須）は v0.2+ で検討。
 * v0.1 は「アプリ起動時に近いイベント（申込開始/締切/試験）を検出してローカル通知」を提供。
 *
 * 重複抑制: 同じ日（YYYY-MM-DD）の2回目以降は通知しない。
 *
 * sub-kyu の notifications.ts から概念を移植。「予定」を「申込/試験」に置換。
 */
import type { Watch, Qualification } from "../types/qualification";
import { daysUntil } from "./dates";
import { getTargetSchedule } from "./calendar";

const SETTINGS_KEY = "shikaku-view:notification-settings:v1";
const LAST_NOTIFIED_KEY = "shikaku-view:last-notified-date:v1";

export interface NotificationSettings {
  enabled: boolean;
  daysBefore: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  daysBefore: 3,
};

export function loadNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveNotificationSettings(s: NotificationSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function isNotificationPermitted(): boolean {
  return "Notification" in window && Notification.permission === "granted";
}

export type EventKind = "application-start" | "application-end" | "exam" | "user-target-exam";

export interface UpcomingEvent {
  watchId: string;
  qualificationId: string;
  qualificationName: string;
  scheduleLabel: string;
  kind: EventKind;
  daysUntil: number;
  iso: string;
}

const KIND_LABEL: Record<EventKind, string> = {
  "application-start": "申込開始",
  "application-end": "締切",
  exam: "試験",
  "user-target-exam": "受験予定日",
};

export function eventLabel(kind: EventKind): string {
  return KIND_LABEL[kind];
}

/** 近い「申込開始 / 申込締切 / 試験日」を抽出。終了済みウォッチは対象外 */
export function findUpcomingEvents(
  watches: Watch[],
  qualifications: Qualification[],
  daysBefore: number
): UpcomingEvent[] {
  const result: UpcomingEvent[] = [];
  for (const w of watches) {
    if (w.status === "passed" || w.status === "failed" || w.status === "skipped") continue;
    const q = qualifications.find((x) => x.id === w.qualificationId);
    if (!q) continue;
    const s = getTargetSchedule(w, q);
    if (!s) continue;
    const pushIf = (kind: EventKind, iso: string | undefined) => {
      if (!iso) return;
      const d = daysUntil(iso);
      if (!Number.isFinite(d) || d < 0 || d > daysBefore) return;
      result.push({
        watchId: w.id,
        qualificationId: q.id,
        qualificationName: q.shortName ?? q.name,
        scheduleLabel: s.label,
        kind,
        daysUntil: d,
        iso,
      });
    };
    if (s.isYearRound) {
      // 通年型: 申込通知はスキップ、個人受験予定日があれば前日のみ通知
      if (w.userTargetExamDate) {
        const d = daysUntil(w.userTargetExamDate);
        if (Number.isFinite(d) && d >= 0 && d <= 1) {
          result.push({
            watchId: w.id,
            qualificationId: q.id,
            qualificationName: q.shortName ?? q.name,
            scheduleLabel: s.label,
            kind: "user-target-exam",
            daysUntil: d,
            iso: w.userTargetExamDate,
          });
        }
      }
    } else {
      pushIf("application-start", s.applicationStart);
      pushIf("application-end", s.applicationEnd);
      pushIf("exam", s.examDate);
    }
  }
  return result.sort((a, b) => a.daysUntil - b.daysUntil);
}

function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isAlreadyNotifiedToday(): boolean {
  try {
    return localStorage.getItem(LAST_NOTIFIED_KEY) === todayKey();
  } catch {
    return false;
  }
}

function markNotifiedToday(): void {
  try {
    localStorage.setItem(LAST_NOTIFIED_KEY, todayKey());
  } catch {
    // ignore
  }
}

/**
 * アプリ起動時に通知をトリガー。
 * - 設定OFFや権限なしなら何もしない
 * - 同日2回目以降はスキップ
 * - 多件数の場合は先頭3件 + 「他N件」に短縮
 */
export function notifyUpcoming(
  watches: Watch[],
  qualifications: Qualification[],
  settings: NotificationSettings
): void {
  if (!settings.enabled || !isNotificationPermitted()) return;
  if (isAlreadyNotifiedToday()) return;

  const upcoming = findUpcomingEvents(watches, qualifications, settings.daysBefore);
  if (upcoming.length === 0) return;

  const visible = upcoming.slice(0, 3);
  const lines = visible.map(
    (e) => `・${e.qualificationName}（${KIND_LABEL[e.kind]}まであと${e.daysUntil}日）`
  );
  if (upcoming.length > 3) {
    lines.push(`・他 ${upcoming.length - 3}件`);
  }

  new Notification("📅 もうすぐ資格イベントがあります", {
    body: lines.join("\n"),
    // 注意: Chrome の Notification API は SVG icon を表示しないことがある（OS native へ
    // ラスタライズが必要なため）。v0.1 は SVG のまま、表示されない場合は OS デフォルト
    // アイコンにフォールバック。v0.2 で 192x192 PNG を public/ に追加予定。
    icon: "/icon-192.svg",
    tag: "shikaku-view-upcoming",
  });
  markNotifiedToday();
}
