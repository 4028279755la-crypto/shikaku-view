/**
 * カレンダー表示用ユーティリティ（資格の視覚化用）
 *
 * sub-kyu のロジックを「申込期間バー + 試験日マーカー」に拡張。
 *  - 申込期間: 開始日〜締切日の範囲を「期間として」描画
 *  - 試験日: 特定の日に発生する単発イベント
 */
import {
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
  isBefore,
  isAfter,
} from "date-fns";
import type { Qualification, Watch, ExamSchedule } from "../types/qualification";

/** ウォッチが指している「対象の開催回」を取り出す */
export function getTargetSchedule(
  watch: Watch,
  q: Qualification
): ExamSchedule | undefined {
  if (q.schedules.length === 0) return undefined;
  if (watch.targetScheduleLabel) {
    const found = q.schedules.find((s) => s.label === watch.targetScheduleLabel);
    if (found) return found;
  }
  // 指定がなければ最も近い未来の開催回（無ければ最新）
  const now = new Date();
  const upcoming = q.schedules
    .filter((s) => {
      // 通年型は常に「現在も受験可能」とみなして候補に含める
      if (s.isYearRound) return true;
      try {
        if (s.applicationStart && isAfter(parseISO(s.applicationStart), now)) return true;
        if (s.examDate && isAfter(parseISO(s.examDate), now)) return true;
        return false;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      // 通年型は最後（ソート順は applicationStart 基準、無いものは末尾）
      const aKey = a.applicationStart ?? "9999-99-99";
      const bKey = b.applicationStart ?? "9999-99-99";
      return aKey.localeCompare(bKey);
    });
  return upcoming[0] ?? q.schedules[q.schedules.length - 1];
}

/**
 * 1日に発生する単発イベント。
 *
 * - `application-start` / `application-end` / `exam` / `result`: カタログのスケジュール由来
 * - `user-target-exam`: 通年型試験でユーザーが個人的に設定した受験予定日（Watch.userTargetExamDate）
 */
export type DayEventKind =
  | "application-start"
  | "application-end"
  | "exam"
  | "result"
  | "user-target-exam";

export interface DayEvent {
  watchId: string;
  qualificationId: string;
  qualificationName: string;
  scheduleLabel: string;
  kind: DayEventKind;
}

/** 指定日に発生するイベント（申込開始/締切/試験日/結果発表）を返す */
export function eventsOnDate(
  watches: Watch[],
  qualifications: Qualification[],
  date: Date
): DayEvent[] {
  const result: DayEvent[] = [];
  for (const w of watches) {
    if (w.status === "passed" || w.status === "failed" || w.status === "skipped") {
      continue; // 終了済みウォッチはカレンダーに出さない
    }
    const q = qualifications.find((x) => x.id === w.qualificationId);
    if (!q) continue;
    const s = getTargetSchedule(w, q);
    if (!s) continue;
    const checks: Array<[DayEventKind, string | undefined]> = [
      ["application-start", s.applicationStart],
      ["application-end", s.applicationEnd],
      ["exam", s.examDate],
      ["result", s.resultDate],
      // 通年型のユーザー個人受験予定日
      ["user-target-exam", s.isYearRound ? w.userTargetExamDate : undefined],
    ];
    for (const [kind, iso] of checks) {
      if (!iso) continue;
      try {
        if (isSameDay(parseISO(iso), date)) {
          result.push({
            watchId: w.id,
            qualificationId: q.id,
            qualificationName: q.shortName ?? q.name,
            scheduleLabel: s.label,
            kind,
          });
        }
      } catch {
        // ignore parse error
      }
    }
  }
  return result;
}

export interface ApplicationSpan {
  watchId: string;
  qualificationId: string;
  qualificationName: string;
  scheduleLabel: string;
  /** 申込期間の開始/終了 (Date) */
  start: Date;
  end: Date;
}

/** その日付が申込期間に含まれるウォッチ（バー描画用） */
export function applicationSpansOnDate(
  watches: Watch[],
  qualifications: Qualification[],
  date: Date
): ApplicationSpan[] {
  const result: ApplicationSpan[] = [];
  for (const w of watches) {
    if (w.status === "passed" || w.status === "failed" || w.status === "skipped") continue;
    const q = qualifications.find((x) => x.id === w.qualificationId);
    if (!q) continue;
    const s = getTargetSchedule(w, q);
    if (!s) continue;
    // 通年型 or 申込期間が定義されていないスケジュールはバー描画対象外
    if (!s.applicationStart || !s.applicationEnd) continue;
    try {
      const start = parseISO(s.applicationStart);
      const end = parseISO(s.applicationEnd);
      if (isBefore(date, start) || isAfter(date, end)) continue;
      result.push({
        watchId: w.id,
        qualificationId: q.id,
        qualificationName: q.shortName ?? q.name,
        scheduleLabel: s.label,
        start,
        end,
      });
    } catch {
      // ignore
    }
  }
  return result;
}

/** カレンダーグリッド（6週分） */
export function calendarDays(monthDate: Date): Date[] {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function nextMonth(d: Date): Date {
  return addMonths(d, 1);
}
export function prevMonth(d: Date): Date {
  return subMonths(d, 1);
}

export function formatMonthHeader(d: Date): string {
  return format(d, "yyyy年M月");
}

export function formatDayShort(d: Date): string {
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()]!;
  return `${format(d, "M/d")}(${weekday})`;
}
