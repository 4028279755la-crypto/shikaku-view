/**
 * カタログのカテゴリ別アコーディオン一覧。
 *
 * M-3 D-13: state ベース仮想化。`<details open={isOpen}>` でカテゴリ open 状態を
 * React state で制御し、open=false のときは `<ul>` 子要素を render しない。
 * 200件規模で初期 DOM をカテゴリサマリだけに抑える。
 *
 * onToggle の早期 return は `open={isOpen}` 制御との無限ループ防止のために必須。
 */
import { useEffect, useState } from "react";
import { CATEGORIES, type Qualification, type Watch } from "../types/qualification";

const OPEN_CATS_KEY = "shikaku-view:catalog-open-cats:v1";

function loadOpenCats(): Set<string> {
  try {
    const raw = sessionStorage.getItem(OPEN_CATS_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function saveOpenCats(set: Set<string>): void {
  try {
    sessionStorage.setItem(OPEN_CATS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // sessionStorage 不可（プライベートブラウジング等）→ 永続化スキップ
  }
}

interface Props {
  qualifications: Qualification[];
  watches: Watch[];
  onAdd: (input: { qualificationId: string }) => void;
  onOpenAddForm: () => void;
}

export function CatalogAccordion({
  qualifications,
  watches,
  onAdd,
  onOpenAddForm,
}: Props) {
  // タブ間で open 状態を保持するため sessionStorage に永続化（D-13 改善 / 第4ラウンド m-1）
  const [openCats, setOpenCats] = useState<Set<string>>(() => loadOpenCats());

  useEffect(() => {
    saveOpenCats(openCats);
  }, [openCats]);

  return (
    <section>
      <div className="catalog-header">
        <h2 className="section-title">📚 カタログ（{qualifications.length}件）</h2>
        <button
          type="button"
          className="btn-primary btn-small"
          onClick={onOpenAddForm}
        >
          ＋ 独自に追加
        </button>
      </div>
      <p className="catalog-notice">
        ⚠️ 日程は2026年5月時点の概算です。実際の申込期間・試験日は各資格の公式サイト（カードからリンク）で必ずご確認ください。
      </p>
      {CATEGORIES.map((cat) => {
        const items = qualifications.filter((q) => q.category === cat);
        if (items.length === 0) return null;
        const watchedCount = items.filter((q) =>
          watches.some((w) => w.qualificationId === q.id)
        ).length;
        const isOpen = openCats.has(cat);
        return (
          <details
            key={cat}
            className="catalog-category"
            open={isOpen}
            onToggle={(e) => {
              const nowOpen = e.currentTarget.open;
              setOpenCats((prev) => {
                // DOM 側 open 状態と React state が一致していたら再描画スキップ。
                // 一致時に setState すると `open={isOpen}` 制御と onToggle で
                // 無限ループになる可能性があるため必須
                if (nowOpen === prev.has(cat)) return prev;
                const next = new Set(prev);
                if (nowOpen) next.add(cat);
                else next.delete(cat);
                return next;
              });
            }}
          >
            <summary className="catalog-category-summary">
              <span className="catalog-category-name">{cat}</span>
              <span className="catalog-category-count">
                {items.length}件
                {watchedCount > 0 && (
                  <span className="catalog-category-watched">
                    （{watchedCount}件追加済）
                  </span>
                )}
              </span>
            </summary>
            {isOpen && (
              <ul className="catalog-list">
                {items.map((q) => {
                  const watched = watches.some((w) => w.qualificationId === q.id);
                  const hasYearRoundSchedule = q.schedules.some(
                    (s) => s.isYearRound
                  );
                  return (
                    <li key={q.id} className="catalog-card">
                      <div className="catalog-card-main">
                        <div className="catalog-card-header">
                          <strong>{q.name}</strong>
                          {q.shortName && q.shortName !== q.name && (
                            <span className="short-name">（{q.shortName}）</span>
                          )}
                          {hasYearRoundSchedule && (
                            <span
                              className="badge-yearround"
                              title="通年で受験可能なCBT/IBT等"
                            >
                              通年受験可
                            </span>
                          )}
                        </div>
                        <div className="meta">
                          <span>{q.organizer}</span>
                        </div>
                        {q.description && (
                          <p className="catalog-card-description">
                            {q.description}
                          </p>
                        )}
                        <a
                          href={q.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="official-link"
                        >
                          公式サイト →
                        </a>
                      </div>
                      {watched ? (
                        <span className="watched">追加済</span>
                      ) : (
                        <button
                          className="btn-primary"
                          onClick={() => onAdd({ qualificationId: q.id })}
                        >
                          追加
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </details>
        );
      })}
    </section>
  );
}
