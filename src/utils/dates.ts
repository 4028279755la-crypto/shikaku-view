/**
 * 日付処理ユーティリティ（sub-kyu からの転用）
 */
import { format, parseISO, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";

/** ISO日付文字列を「2026/05/15」形式で表示 */
export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "yyyy/MM/dd", { locale: ja });
  } catch {
    return iso;
  }
}

/**
 * 「あと N 日」表記。
 * 不正な ISO 文字列の場合は NaN を返す。呼び出し側で Number.isFinite で除外すること。
 */
export function daysUntil(iso: string): number {
  try {
    const d = parseISO(iso);
    if (isNaN(d.getTime())) return NaN;
    return differenceInDays(d, new Date());
  } catch {
    return NaN;
  }
}

/** 「あと3日」「明日」「今日」等の人間にやさしい表示 */
export function formatDaysUntil(iso: string, label = "日"): string {
  const d = daysUntil(iso);
  if (!Number.isFinite(d)) return "未定";
  if (d < 0) return `${Math.abs(d)}${label}前`;
  if (d === 0) return "今日";
  if (d === 1) return "明日";
  return `あと ${d}${label}`;
}

/** 現在日時の ISO 文字列 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * date input(YYYY-MM-DD) を**ナイーブ形式 ISO**（`"YYYY-MM-DDT00:00:00"`）に変換。
 * カタログ（qualification-catalog.ts）の日付フォーマットと統一するため、
 * タイムゾーン付き ISO（`.toISOString()` の `Z` 付き）を**使わない**。
 *
 * 不正な YYYY-MM-DD が来た場合は空文字を返す。
 */
export function toIsoMidnight(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  return `${value}T00:00:00`;
}

/** ISO 文字列を date input(YYYY-MM-DD) 用の value 文字列に */
export function isoToDateInput(iso: string): string {
  try {
    return format(parseISO(iso), "yyyy-MM-dd");
  } catch {
    return "";
  }
}
