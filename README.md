# 資格の視覚化（shikaku-view）

> **申込期間を、見逃さない。**

狙ってる資格の **申込期間** と **試験日** を、ひとつのカレンダーで見えるようにして
申込忘れをなくす PWA。React 18 + TypeScript 5 + Vite 6 + localStorage。

## 主な機能（v0.1）

- 資格カタログ閲覧 + ウォッチリスト登録（200件、13カテゴリ）
- マイ資格一覧（申込まで N 日 / 試験まで N 日）
- 月カレンダー視覚化（申込期間バー + 試験日マーカー）
- ローカル通知（申込開始 / 締切3日前 / 試験前日）
- ユーザーによる資格追加

## カタログ運用ルール

### 「その他」カテゴリの位置付け（2026-05-14 D-11 決定）

`QualificationCategory` は 13 の専門カテゴリ + `"その他"` で構成されます。

- **`"その他"` は組み込みカタログでは使用しない**
  `data/qualification-catalog.ts` に追加する組み込み資格は、必ず13カテゴリのいずれかを選択してください
- **`"その他"` はユーザー追加カスタム資格専用**
  どの専門カテゴリにも当てはまらない場合の逃げ道として残しています
- **ユーザー追加フォーム** では `"その他"` を選択肢の **最下位** に配置し、
  既存13カテゴリへ誘導するUX とします

新規組み込み資格を追加する際は、まず以下の13カテゴリへの割当を検討してください:

> IT / 経理・財務 / 士業 / 不動産 / 建築・測量 / 電気・通信 / 機械・運転 / 観光・サービス / 安全・防災 / 物流・貿易 / 英語・語学 / 医療・福祉 / 法務・労務

### 通年型試験の表現（2026-05-14 D-12 決定）

CBT・IBT 等の通年で受験可能な試験は、`ExamSchedule` に **`isYearRound: true`** を設定し、
`applicationStart` / `applicationEnd` / `examDate` を **省略** します。

```ts
// 通年型の例
schedules: [
  { label: "2026年 通年CBT（概算）", isYearRound: true, fee: 7500 },
]

// 通常型の例（年X回開催）
schedules: [
  {
    label: "2026年春期（概算）",
    applicationStart: "2026-01-15T00:00:00",
    applicationEnd: "2026-02-04T00:00:00",
    examDate: "2026-04-19T00:00:00",
    fee: 7500,
  },
]
```

UI 側は `isYearRound: true` を検出すると以下のように振る舞います:

- カレンダーの申込期間バー・試験日マーカーを描画しない
- マイ資格カードに「通年受験可」バッジを表示
- ユーザーが個人受験予定日を `Watch.userTargetExamDate` に設定したときのみ
  カレンダーに個人マーカーを描画
- 通知は申込関連をスキップし、`userTargetExamDate` の前日のみ通知

## 開発

```bash
npm install
npm run dev       # 開発サーバー
npm run build     # 本番ビルド
npm run preview   # ビルド後のプレビュー
npx tsc --noEmit  # 型チェック
```

## 参考リンク

- 仕様: `.company/game-lab/projects/shikaku-view/spec-v0.1.md`
- 決定事項ログ: `.company/game-lab/projects/shikaku-view/decisions.md`
- 初回コードレビュー: `.company/code-review/reports/shikaku-view/2026-05-14-initial-review.md`
