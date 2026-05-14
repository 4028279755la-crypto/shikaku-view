import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWatches } from "./hooks/useWatches";
import { QUALIFICATION_CATALOG } from "./data/qualification-catalog";
import {
  addCustomQualification,
  generateId,
  loadCustomQualifications,
} from "./utils/storage";
import { loadNotificationSettings, notifyUpcoming } from "./utils/notifications";
import { toIsoMidnight } from "./utils/dates";
import { Calendar } from "./components/Calendar";
import { WatchList } from "./components/WatchList";
import { CatalogAccordion } from "./components/CatalogAccordion";
import { SettingsPanel } from "./components/SettingsPanel";
import {
  AddQualificationForm,
  type AddFormData,
} from "./components/AddQualificationForm";
import type {
  ExamSchedule,
  Qualification,
} from "./types/qualification";
import "./App.css";

type Mode = "list" | "catalog" | "calendar" | "settings";

/**
 * 追加フォームの最終バリデーション（データレイヤー）。
 * フォーム側の UI バリデーションを通った後の最終チェック用。
 */
function validateAddForm(f: AddFormData): string | null {
  if (!f.name.trim()) return "資格名を入力してください";
  if (!f.category) return "カテゴリを選択してください";
  if (!f.organizer.trim()) return "主催団体を入力してください";
  if (!f.officialUrl.trim()) return "公式URLを入力してください";
  try {
    new URL(f.officialUrl.trim());
  } catch {
    return "公式URLが正しい形式ではありません（例: https://example.com/）";
  }
  if (!f.scheduleLabel.trim()) {
    return "開催回ラベルを入力してください（例: 2026年春期）";
  }
  if (f.fee.trim() && !Number.isFinite(Number(f.fee))) {
    return "受験料は数値で入力してください";
  }
  return null;
}

function App() {
  const { watches, loaded, add, update, setStatus, remove } = useWatches();
  const [mode, setMode] = useState<Mode>("list");
  const [customQuals, setCustomQuals] = useState<Qualification[]>(() =>
    loadCustomQualifications()
  );
  const [addFormOpen, setAddFormOpen] = useState(false);
  const notifiedRef = useRef(false);

  const qualifications = useMemo(
    () => [...QUALIFICATION_CATALOG, ...customQuals],
    [customQuals]
  );

  useEffect(() => {
    if (!loaded || notifiedRef.current) return;
    notifiedRef.current = true;
    const settings = loadNotificationSettings();
    notifyUpcoming(watches, qualifications, settings);
  }, [loaded, watches, qualifications]);

  const handleAddCustom = useCallback(
    (input: AddFormData): { ok: true } | { ok: false; error: string } => {
      const err = validateAddForm(input);
      if (err) return { ok: false, error: err };
      const schedule: ExamSchedule = {
        label: input.scheduleLabel.trim(),
        ...(input.isYearRound
          ? { isYearRound: true }
          : {
              applicationStart: input.applicationStart
                ? toIsoMidnight(input.applicationStart) || undefined
                : undefined,
              applicationEnd: input.applicationEnd
                ? toIsoMidnight(input.applicationEnd) || undefined
                : undefined,
              examDate: input.examDate
                ? toIsoMidnight(input.examDate) || undefined
                : undefined,
            }),
        ...(input.fee.trim() ? { fee: Number(input.fee) } : {}),
      };
      // validateAddForm で category が空文字でないことを保証済み
      if (!input.category) return { ok: false, error: "カテゴリを選択してください" };
      const q: Qualification = {
        id: generateId("user_"),
        name: input.name.trim(),
        shortName: input.shortName.trim() || undefined,
        category: input.category,
        organizer: input.organizer.trim(),
        officialUrl: input.officialUrl.trim(),
        description: input.description.trim() || undefined,
        schedules: [schedule],
      };
      const newList = addCustomQualification(q);
      setCustomQuals(newList);
      return { ok: true };
    },
    []
  );

  if (!loaded) {
    return (
      <div className="app">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="brand">
          <span className="brand-icon">📅</span>
          <span className="brand-text">資格の視覚化</span>
        </h1>
        <p className="tagline">申込期間を、見逃さない。</p>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${mode === "list" ? "active" : ""}`}
          onClick={() => setMode("list")}
        >
          マイ資格
        </button>
        <button
          className={`tab ${mode === "calendar" ? "active" : ""}`}
          onClick={() => setMode("calendar")}
        >
          🗓 カレンダー
        </button>
        <button
          className={`tab ${mode === "catalog" ? "active" : ""}`}
          onClick={() => setMode("catalog")}
        >
          📚 カタログ
        </button>
        <button
          className={`tab ${mode === "settings" ? "active" : ""}`}
          onClick={() => setMode("settings")}
        >
          ⚙️ 設定
        </button>
      </nav>

      <main className="main">
        {mode === "list" && (
          <WatchList
            watches={watches}
            qualifications={qualifications}
            onUpdate={update}
            onSetStatus={setStatus}
            onRemove={remove}
          />
        )}

        {mode === "calendar" && (
          <Calendar watches={watches} qualifications={qualifications} />
        )}

        {mode === "catalog" && (
          <CatalogAccordion
            qualifications={qualifications}
            watches={watches}
            onAdd={add}
            onOpenAddForm={() => setAddFormOpen(true)}
          />
        )}

        {mode === "settings" && <SettingsPanel />}
      </main>

      <footer className="footer">
        <small>資格の視覚化 v0.0.1 · データはお使いのデバイスから出ません</small>
      </footer>

      <AddQualificationForm
        open={addFormOpen}
        onClose={() => setAddFormOpen(false)}
        onSubmit={handleAddCustom}
      />
    </div>
  );
}

export default App;
