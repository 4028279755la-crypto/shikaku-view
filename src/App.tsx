import { useEffect, useMemo, useRef, useState } from "react";
import { useWatches } from "./hooks/useWatches";
import { QUALIFICATION_CATALOG, findQualificationById } from "./data/qualification-catalog";
import { loadCustomQualifications } from "./utils/storage";
import { loadNotificationSettings, notifyUpcoming } from "./utils/notifications";
import { Calendar } from "./components/Calendar";
import "./App.css";

type Mode = "list" | "catalog" | "calendar" | "settings";

function App() {
  const { watches, loaded, add, remove } = useWatches();
  const [mode, setMode] = useState<Mode>("list");
  const notifiedRef = useRef(false);

  const qualifications = useMemo(() => {
    return [...QUALIFICATION_CATALOG, ...loadCustomQualifications()];
  }, []);

  useEffect(() => {
    if (!loaded || notifiedRef.current) return;
    notifiedRef.current = true;
    const settings = loadNotificationSettings();
    notifyUpcoming(watches, qualifications, settings);
  }, [loaded, watches, qualifications]);

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
        <button className={`tab ${mode === "list" ? "active" : ""}`} onClick={() => setMode("list")}>
          マイ資格
        </button>
        <button className={`tab ${mode === "calendar" ? "active" : ""}`} onClick={() => setMode("calendar")}>
          🗓 カレンダー
        </button>
        <button className={`tab ${mode === "catalog" ? "active" : ""}`} onClick={() => setMode("catalog")}>
          📚 カタログ
        </button>
        <button className={`tab ${mode === "settings" ? "active" : ""}`} onClick={() => setMode("settings")}>
          ⚙️ 設定
        </button>
      </nav>

      <main className="main">
        {mode === "list" && (
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
                  return (
                    <li key={w.id} className="watch-card">
                      <div>
                        <strong>{q.name}</strong>
                        <span className="category">{q.category}</span>
                      </div>
                      <button onClick={() => remove(w.id)} className="btn-link">
                        削除
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {mode === "calendar" && (
          <Calendar watches={watches} qualifications={qualifications} />
        )}

        {mode === "catalog" && (
          <section>
            <h2 className="section-title">📚 カタログ（{qualifications.length}件）</h2>
            <ul className="catalog-list">
              {qualifications.map((q) => {
                const watched = watches.some((w) => w.qualificationId === q.id);
                return (
                  <li key={q.id} className="catalog-card">
                    <div>
                      <strong>{q.name}</strong>
                      <div className="meta">
                        <span className="category">{q.category}</span>
                        <span>{q.organizer}</span>
                      </div>
                    </div>
                    {watched ? (
                      <span className="watched">追加済</span>
                    ) : (
                      <button className="btn-primary" onClick={() => add({ qualificationId: q.id })}>
                        追加
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {mode === "settings" && (
          <section>
            <h2 className="section-title">⚙️ 設定（実装予定）</h2>
            <p className="empty">通知 ON/OFF、JSON エクスポート、全削除 などを実装予定。</p>
          </section>
        )}
      </main>

      <footer className="footer">
        <small>資格の視覚化 v0.0.1 · データはお使いのデバイスから出ません</small>
      </footer>
    </div>
  );
}

export default App;
