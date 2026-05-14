/**
 * マイ資格カード一覧。
 *
 * 各カードに：
 *  - 通年バッジ（M-2 D-12 のとき）
 *  - 合格 / 不合格時の completedSchedule 情報表示（M-5 D-15）
 *  - userTargetExamDate 入力（通年型 + 終了前のみ・M-2 D-12）
 *  - ステータス変更 select
 */
import {
  WATCH_STATUS_OPTIONS,
  type Qualification,
  type Watch,
  type WatchStatus,
} from "../types/qualification";
import { findQualificationById } from "../data/qualification-catalog";
import { getTargetSchedule } from "../utils/calendar";
import { toIsoMidnight, isoToDateInput } from "../utils/dates";

interface Props {
  watches: Watch[];
  qualifications: Qualification[];
  onUpdate: (id: string, patch: Partial<Watch>) => void;
  onSetStatus: (id: string, status: WatchStatus, currentSchedule?: ReturnType<typeof getTargetSchedule>) => void;
  onRemove: (id: string) => void;
}

export function WatchList({
  watches,
  qualifications,
  onUpdate,
  onSetStatus,
  onRemove,
}: Props) {
  return (
    <section>
      <h2 className="section-title">マイ資格（{watches.length}件）</h2>
      {watches.length === 0 ? (
        <p className="empty">
          まだ何も追加されていません。
          <br />
          「カタログ」から狙っている資格を追加してください。
        </p>
      ) : (
        <ul className="watch-list">
          {watches.map((w) => {
            const q = findQualificationById(w.qualificationId, qualifications);
            if (!q) return null;
            const schedule = getTargetSchedule(w, q);
            const isYearRound = !!schedule?.isYearRound;
            const userDateValue = w.userTargetExamDate
              ? isoToDateInput(w.userTargetExamDate)
              : "";
            const isPassed = w.status === "passed";
            const isFailed = w.status === "failed";
            const completedLabel = w.completedSchedule?.label;
            return (
              <li
                key={w.id}
                className={`watch-card watch-card-status-${w.status}`}
              >
                <div className="watch-card-main">
                  <div className="watch-card-header">
                    <strong>{q.name}</strong>
                    <span className="category">{q.category}</span>
                    {isYearRound && (
                      <span
                        className="badge-yearround"
                        title="通年で受験可能なCBT/IBT等"
                      >
                        通年受験可
                      </span>
                    )}
                  </div>

                  {isPassed && completedLabel && (
                    <div className="status-info status-info-passed">
                      <span className="status-info-icon" aria-hidden="true">🎉</span>
                      <span>合格: {completedLabel}</span>
                    </div>
                  )}
                  {isFailed && (
                    <div className="status-info status-info-failed">
                      <span className="status-info-icon" aria-hidden="true">🔁</span>
                      <span>
                        {completedLabel
                          ? `前回: ${completedLabel}`
                          : "前回の受験回情報なし"}
                        {schedule && schedule.label !== completedLabel && (
                          <> / 再挑戦予定: {schedule.label}</>
                        )}
                      </span>
                    </div>
                  )}

                  {isYearRound && !isPassed && !isFailed && (
                    <label className="user-target-date">
                      <span className="user-target-date-label">受験予定日：</span>
                      <input
                        type="date"
                        value={userDateValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdate(w.id, {
                            userTargetExamDate: val
                              ? toIsoMidnight(val) || undefined
                              : undefined,
                          });
                        }}
                        aria-label={`${q.name} の受験予定日`}
                      />
                      {userDateValue && (
                        <button
                          type="button"
                          className="btn-link btn-link-small"
                          onClick={() =>
                            onUpdate(w.id, { userTargetExamDate: undefined })
                          }
                          aria-label="受験予定日をクリア"
                        >
                          クリア
                        </button>
                      )}
                    </label>
                  )}

                  <label className="watch-status-select">
                    <span className="watch-status-label">ステータス：</span>
                    <select
                      value={w.status}
                      onChange={(e) =>
                        onSetStatus(
                          w.id,
                          e.target.value as WatchStatus,
                          schedule
                        )
                      }
                      aria-label={`${q.name} のステータス`}
                    >
                      {WATCH_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  onClick={() => onRemove(w.id)}
                  className="btn-link"
                  aria-label={`${q.name} をマイ資格から削除`}
                >
                  削除
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
