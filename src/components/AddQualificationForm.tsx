/**
 * ユーザー追加資格フォーム（モーダル）
 *
 * カタログにない資格をユーザー自身で追加するための入力フォーム。
 * 親（App.tsx）から `onSubmit` を受け取り、結果が ok のときに自身を閉じる。
 *
 * M-1 D-11: カテゴリ select では `"その他"` を最下位に配置（CATEGORIES が既にその順序）。
 * M-2 D-12: 通年型試験のとき `isYearRound: true` を立て、日付3点は省略。
 */
import { useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  type QualificationCategory,
} from "../types/qualification";

export interface AddFormData {
  name: string;
  shortName: string;
  /**
   * カテゴリ。`""` は未選択（ユーザーに明示的選択を促す）。
   * 親側のバリデーションで `""` を弾く。
   */
  category: QualificationCategory | "";
  organizer: string;
  officialUrl: string;
  description: string;
  scheduleLabel: string;
  isYearRound: boolean;
  applicationStart: string;
  applicationEnd: string;
  examDate: string;
  fee: string;
}

export const INITIAL_ADD_FORM: AddFormData = {
  name: "",
  shortName: "",
  category: "",
  organizer: "",
  officialUrl: "",
  description: "",
  scheduleLabel: "",
  isYearRound: false,
  applicationStart: "",
  applicationEnd: "",
  examDate: "",
  fee: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddFormData) => { ok: true } | { ok: false; error: string };
}

export function AddQualificationForm({ open, onClose, onSubmit }: Props) {
  const [data, setData] = useState<AddFormData>(INITIAL_ADD_FORM);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 第4ラウンド m-2 対応: Esc キーで閉じる + 開いたら最初の入力欄に focus + Tab トラップ
  useEffect(() => {
    if (!open) return;
    // 初期 focus（描画完了を待つため queueMicrotask 経由）
    queueMicrotask(() => firstFieldRef.current?.focus());

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // 親側 close は handleCancel と同等の挙動
        setData(INITIAL_ADD_FORM);
        setError(null);
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Tab トラップ: モーダル内の focusable をループさせる
      const root = modalRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = <K extends keyof AddFormData>(key: K, val: AddFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSubmit(data);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setData(INITIAL_ADD_FORM);
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    setData(INITIAL_ADD_FORM);
    setError(null);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-form-title"
    >
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h2 id="add-form-title" className="modal-title">📝 資格を追加</h2>
          <button
            type="button"
            className="modal-close"
            onClick={handleCancel}
            aria-label="フォームを閉じる"
          >
            ✕
          </button>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          <p className="add-form-help">
            カタログにない資格を独自に追加できます。データはこの端末の localStorage に保存されます。
          </p>

          {error && <div className="add-form-error">⚠️ {error}</div>}

          <label className="add-form-row">
            <span className="add-form-label">
              資格名 <span className="required">*</span>
            </span>
            <input
              ref={firstFieldRef}
              type="text"
              required
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="例: 危険物取扱者乙種4類"
            />
          </label>

          <label className="add-form-row">
            <span className="add-form-label">略称</span>
            <input
              type="text"
              value={data.shortName}
              onChange={(e) => update("shortName", e.target.value)}
              placeholder="例: 乙4"
            />
          </label>

          <label className="add-form-row">
            <span className="add-form-label">
              カテゴリ <span className="required">*</span>
            </span>
            <select
              required
              value={data.category}
              onChange={(e) =>
                update("category", e.target.value as QualificationCategory | "")
              }
            >
              <option value="" disabled>
                -- 選択してください --
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="add-form-row">
            <span className="add-form-label">
              主催団体 <span className="required">*</span>
            </span>
            <input
              type="text"
              required
              value={data.organizer}
              onChange={(e) => update("organizer", e.target.value)}
              placeholder="例: 一般財団法人 消防試験研究センター"
            />
          </label>

          <label className="add-form-row">
            <span className="add-form-label">
              公式URL <span className="required">*</span>
            </span>
            <input
              type="url"
              required
              value={data.officialUrl}
              onChange={(e) => update("officialUrl", e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="add-form-row">
            <span className="add-form-label">簡易説明</span>
            <textarea
              rows={2}
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="どんな資格か、誰向けかなど（1〜2行）"
            />
          </label>

          <h3 className="add-form-section-title">📅 開催回</h3>

          <label className="add-form-row">
            <span className="add-form-label">
              開催回ラベル <span className="required">*</span>
            </span>
            <input
              type="text"
              required
              value={data.scheduleLabel}
              onChange={(e) => update("scheduleLabel", e.target.value)}
              placeholder="例: 2026年春期 / 第1回 / 2026年 通年CBT"
            />
          </label>

          <label className="add-form-row add-form-checkbox-row">
            <input
              type="checkbox"
              checked={data.isYearRound}
              onChange={(e) => update("isYearRound", e.target.checked)}
            />
            <span>通年型（CBT・IBT 等で常時受験可能）</span>
          </label>

          {!data.isYearRound && (
            <>
              <label className="add-form-row">
                <span className="add-form-label">申込開始日</span>
                <input
                  type="date"
                  value={data.applicationStart}
                  onChange={(e) => update("applicationStart", e.target.value)}
                />
              </label>
              <label className="add-form-row">
                <span className="add-form-label">申込締切日</span>
                <input
                  type="date"
                  value={data.applicationEnd}
                  onChange={(e) => update("applicationEnd", e.target.value)}
                />
              </label>
              <label className="add-form-row">
                <span className="add-form-label">試験日</span>
                <input
                  type="date"
                  value={data.examDate}
                  onChange={(e) => update("examDate", e.target.value)}
                />
              </label>
            </>
          )}

          <label className="add-form-row">
            <span className="add-form-label">受験料（円）</span>
            <input
              type="number"
              min={0}
              max={9999999}
              value={data.fee}
              onChange={(e) => update("fee", e.target.value)}
              placeholder="例: 4600"
            />
          </label>

          <div className="add-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
            >
              キャンセル
            </button>
            <button type="submit" className="btn-primary">
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
