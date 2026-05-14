/**
 * 設定パネル: 通知 / データ管理 / 危険な操作 / アプリ情報
 *
 * 内部に state を持ち、App.tsx から見た副作用は localStorage への書き込みのみ。
 * インポート / 全削除後は `window.location.reload()` で React state を再同期する。
 */
import { useCallback, useRef, useState } from "react";
import {
  applyImport,
  buildExportPayload,
  clearAllData,
  parseImportJson,
} from "../utils/storage";

/** 成功メッセージを認知させるために 0.8 秒待ってからリロードする */
const RELOAD_DELAY_MS = 800;
import {
  isNotificationPermitted,
  loadNotificationSettings,
  requestNotificationPermission,
  saveNotificationSettings,
  type NotificationSettings,
} from "../utils/notifications";

type MessageKind = "info" | "warning" | "success" | "error";

interface Message {
  kind: MessageKind;
  text: string;
}

export function SettingsPanel() {
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(
    () => loadNotificationSettings()
  );
  const [notifPermitted, setNotifPermitted] = useState<boolean>(() =>
    isNotificationPermitted()
  );
  const [message, setMessage] = useState<Message | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const updateNotifSettings = useCallback(
    (patch: Partial<NotificationSettings>) => {
      setNotifSettings((prev) => {
        const next = { ...prev, ...patch };
        saveNotificationSettings(next);
        return next;
      });
    },
    []
  );

  const handleNotifToggle = useCallback(async () => {
    if (notifSettings.enabled) {
      updateNotifSettings({ enabled: false });
      setMessage({ kind: "info", text: "通知をオフにしました" });
      return;
    }
    const granted = await requestNotificationPermission();
    setNotifPermitted(granted);
    if (!granted) {
      setMessage({
        kind: "warning",
        text: "ブラウザ側で通知が許可されていません。ブラウザ設定から許可してください。",
      });
      return;
    }
    updateNotifSettings({ enabled: true });
    setMessage({ kind: "success", text: "通知をオンにしました" });
  }, [notifSettings.enabled, updateNotifSettings]);

  const handleExport = useCallback(() => {
    const payload = buildExportPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `shikaku-view-export-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage({
      kind: "success",
      text: `エクスポートしました（マイ資格 ${payload.watches.length}件 / 追加資格 ${payload.customQualifications.length}件）`,
    });
  }, []);

  const handleImportFile = useCallback(async (file: File) => {
    let text: string;
    try {
      text = await file.text();
    } catch {
      setMessage({
        kind: "error",
        text: "ファイルの読み込みに失敗しました。別のファイルでお試しください。",
      });
      return;
    }
    const parsed = parseImportJson(text);
    if (!parsed) {
      setMessage({
        kind: "error",
        text: "JSON ファイルが不正です（バージョン違い or 形式違い）",
      });
      return;
    }
    const { payload, stats } = parsed;
    const droppedWatches = stats.watchesIn - stats.watchesOut;
    const droppedCustoms = stats.customsIn - stats.customsOut;
    const droppedNote =
      droppedWatches > 0 || droppedCustoms > 0
        ? `\n\n⚠️ 不正データを除去: マイ資格 ${droppedWatches}件 / 追加資格 ${droppedCustoms}件`
        : "";
    const ok = window.confirm(
      `現在のデータを破棄して、インポートで置き換えます。\n\nインポート内容: マイ資格 ${stats.watchesOut}件 / 追加資格 ${stats.customsOut}件${droppedNote}\n\n続行しますか？`
    );
    if (!ok) return;
    applyImport(payload);
    setMessage({
      kind: "success",
      text: "インポートが完了しました。ページを再読み込みします…",
    });
    setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
  }, []);

  const handleClearAll = useCallback(() => {
    const ok = window.confirm(
      "マイ資格・追加資格をすべて削除します。\nこの操作は取り消せません。続行しますか？"
    );
    if (!ok) return;
    clearAllData();
    setMessage({
      kind: "success",
      text: "全データを削除しました。ページを再読み込みします…",
    });
    setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
  }, []);

  return (
    <section className="settings">
      <h2 className="section-title">⚙️ 設定</h2>

      {message && (
        <div className={`settings-message settings-message-${message.kind}`}>
          {message.text}
        </div>
      )}

      <div className="settings-block">
        <h3 className="settings-block-title">🔔 通知</h3>
        <p className="settings-block-help">
          申込開始 / 締切 / 試験日が近づくとブラウザ通知でお知らせします。アプリを開いたとき判定する仕組みのため、定期的に開いてください。
        </p>
        <label className="settings-row">
          <span className="settings-row-label">通知を有効にする</span>
          <button
            type="button"
            className={`toggle ${notifSettings.enabled ? "on" : "off"}`}
            onClick={handleNotifToggle}
            role="switch"
            aria-checked={notifSettings.enabled}
            aria-label="通知の有効/無効"
          >
            <span className="toggle-knob" aria-hidden="true" />
          </button>
        </label>
        {notifSettings.enabled && !notifPermitted && (
          <p className="settings-warning">
            ⚠️ ブラウザの通知許可が確認できません。ブラウザ設定でこのサイトの通知を許可してください。
          </p>
        )}
        <label className="settings-row">
          <span className="settings-row-label">何日前から通知するか</span>
          <input
            type="number"
            min={1}
            max={30}
            value={notifSettings.daysBefore}
            onChange={(e) => {
              const val = Math.max(1, Math.min(30, Number(e.target.value) || 1));
              updateNotifSettings({ daysBefore: val });
            }}
            className="settings-number"
            aria-label="通知開始日数"
          />
          <span className="settings-row-suffix">日前</span>
        </label>
      </div>

      <div className="settings-block">
        <h3 className="settings-block-title">💾 データ</h3>
        <p className="settings-block-help">
          マイ資格・追加した独自資格・通知設定はこの端末の localStorage に保存されています。バックアップや別端末への移行に JSON を活用できます。
        </p>
        <div className="settings-actions">
          <button type="button" className="btn-primary" onClick={handleExport}>
            📤 エクスポート（JSON ダウンロード）
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => importInputRef.current?.click()}
          >
            📥 インポート（JSON 読み込み）
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="settings-file-input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = "";
            }}
            aria-label="インポートする JSON ファイル"
          />
        </div>
        <p className="settings-block-help">
          インポートすると現在のマイ資格・追加資格は <strong>すべて上書き</strong>されます。事前にエクスポートしてバックアップを取ることを推奨します。
        </p>
      </div>

      <div className="settings-block settings-block-danger">
        <h3 className="settings-block-title">🗑 危険な操作</h3>
        <button type="button" className="btn-danger" onClick={handleClearAll}>
          マイ資格・追加資格をすべて削除
        </button>
        <p className="settings-block-help">
          通知設定とブラウザ通知許可は削除されません。データのみ消えます。
        </p>
      </div>

      <div className="settings-block settings-block-info">
        <h3 className="settings-block-title">ℹ️ アプリ情報</h3>
        <p className="settings-info">
          資格の視覚化 v0.0.1 — データはこの端末に保存され、外部送信はありません。
        </p>
      </div>
    </section>
  );
}
