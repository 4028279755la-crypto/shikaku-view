/**
 * カレンダー: 月表示 + 申込期間バー + 試験日マーカー
 *
 * デザイン:
 *  - 日セル: 数字 + イベントドット最大3個 + 「+N」
 *  - 申込期間中: セル背景を薄ブルーで塗る（バー風）
 *  - 申込開始: 緑ドット / 申込締切: オレンジ / 試験: 赤
 *  - 日タップで詳細リスト表示
 */
import { useMemo, useState } from "react";
import {
  applicationSpansOnDate,
  calendarDays,
  eventsOnDate,
  formatDayShort,
  formatMonthHeader,
  nextMonth,
  prevMonth,
  type DayEvent,
} from "../utils/calendar";
import type { Qualification, Watch } from "../types/qualification";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const KIND_COLOR: Record<DayEvent["kind"], string> = {
  "application-start": "#5DB378",
  "application-end": "#E5B547",
  exam: "#FF6B47",
  result: "#9B7CC9",
  "user-target-exam": "#3DB0E0",
};

const KIND_LABEL: Record<DayEvent["kind"], string> = {
  "application-start": "申込開始",
  "application-end": "申込締切",
  exam: "試験",
  result: "結果",
  "user-target-exam": "受験予定日",
};

interface Props {
  watches: Watch[];
  qualifications: Qualification[];
  onEventClick?: (watchId: string) => void;
}

export function Calendar({ watches, qualifications, onEventClick }: Props) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(() => new Date());

  const days = useMemo(() => calendarDays(cursor), [cursor]);
  const currentMonth = cursor.getMonth();
  const today = new Date();

  const selectedEvents = useMemo(
    () => (selected ? eventsOnDate(watches, qualifications, selected) : []),
    [selected, watches, qualifications]
  );
  const selectedSpans = useMemo(
    () =>
      selected ? applicationSpansOnDate(watches, qualifications, selected) : [],
    [selected, watches, qualifications]
  );

  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  const isSelected = (d: Date) =>
    !!selected &&
    d.getFullYear() === selected.getFullYear() &&
    d.getMonth() === selected.getMonth() &&
    d.getDate() === selected.getDate();

  return (
    <section className="calendar">
      <div className="calendar-header">
        <button
          className="cal-nav"
          onClick={() => setCursor(prevMonth(cursor))}
          aria-label="前の月"
        >
          ‹
        </button>
        <h2 className="cal-title">{formatMonthHeader(cursor)}</h2>
        <button
          className="cal-nav"
          onClick={() => setCursor(nextMonth(cursor))}
          aria-label="次の月"
        >
          ›
        </button>
      </div>

      <div className="cal-legend">
        <span><i className="dot" style={{ background: KIND_COLOR["application-start"] }} /> 申込開始</span>
        <span><i className="dot" style={{ background: KIND_COLOR["application-end"] }} /> 申込締切</span>
        <span><i className="dot" style={{ background: KIND_COLOR.exam }} /> 試験</span>
        <span><i className="bar" /> 申込期間</span>
      </div>

      <div className="cal-grid" role="grid" aria-label="月間カレンダー">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`cal-weekday ${i === 0 ? "sun" : ""} ${i === 6 ? "sat" : ""}`}
            role="columnheader"
          >
            {w}
          </div>
        ))}
        {days.map((d) => {
          const events = eventsOnDate(watches, qualifications, d);
          const spans = applicationSpansOnDate(watches, qualifications, d);
          const inMonth = d.getMonth() === currentMonth;
          const dow = d.getDay();
          return (
            <button
              type="button"
              key={d.toISOString()}
              className={
                `cal-day ${inMonth ? "" : "out-month"} ${isToday(d) ? "today" : ""} ` +
                `${isSelected(d) ? "selected" : ""} ${dow === 0 ? "sun" : ""} ${dow === 6 ? "sat" : ""} ` +
                `${spans.length > 0 ? "in-app-period" : ""}`
              }
              onClick={() => setSelected(d)}
              aria-pressed={isSelected(d)}
            >
              <span className="cal-day-num">{d.getDate()}</span>
              {events.length > 0 && (
                <span className="cal-dots">
                  {events.slice(0, 3).map((e, i) => (
                    <i
                      key={`${e.watchId}-${e.kind}-${i}`}
                      className="dot"
                      style={{ background: KIND_COLOR[e.kind] }}
                      title={`${e.qualificationName} - ${KIND_LABEL[e.kind]}`}
                    />
                  ))}
                  {events.length > 3 && (
                    <span className="cal-more">+{events.length - 3}</span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="cal-detail">
          <h3 className="cal-detail-title">{formatDayShort(selected)} の予定</h3>
          {selectedEvents.length === 0 && selectedSpans.length === 0 ? (
            <p className="empty">この日の予定はありません</p>
          ) : (
            <ul className="cal-detail-list">
              {selectedEvents.map((e, i) => (
                <li
                  key={`e-${e.watchId}-${e.kind}-${i}`}
                  className="cal-detail-item"
                  onClick={() => onEventClick?.(e.watchId)}
                  role="button"
                  tabIndex={0}
                >
                  <i className="dot" style={{ background: KIND_COLOR[e.kind] }} />
                  <span className="cal-detail-kind">{KIND_LABEL[e.kind]}</span>
                  <span className="cal-detail-name">{e.qualificationName}</span>
                  <span className="cal-detail-schedule">{e.scheduleLabel}</span>
                </li>
              ))}
              {selectedSpans.map((s, i) => (
                <li
                  key={`s-${s.watchId}-${i}`}
                  className="cal-detail-item cal-detail-span"
                  onClick={() => onEventClick?.(s.watchId)}
                  role="button"
                  tabIndex={0}
                >
                  <i className="bar" />
                  <span className="cal-detail-kind">申込期間中</span>
                  <span className="cal-detail-name">{s.qualificationName}</span>
                  <span className="cal-detail-schedule">{s.scheduleLabel}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
