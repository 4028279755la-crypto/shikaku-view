/**
 * 資格カタログ（組み込み）
 *
 * 目標: MVP で 50 件（IT10 / 経理8 / 士業10 / 英語6 / 医療6 / 法務5 / その他5）
 * 現状: サンプル 3 件で UI 確認用。明日以降に WebSearch で公式情報を集めて埋める。
 *
 * 各エントリの schedules は「直近〜将来の開催回」を保持。年度替わりで更新。
 * ID 規約: 組み込みは `q_<slug>`、ユーザー追加は storage 側で `id_*` を使う。
 */
import type { Qualification } from "../types/qualification";

export const QUALIFICATION_CATALOG: Qualification[] = [
  {
    id: "q_ap",
    name: "応用情報技術者試験",
    shortName: "応用情報",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/ap.html",
    description: "IT技術者の応用的知識・技能を問う国家試験。年2回（春・秋）。",
    schedules: [
      // TODO: 公式情報に基づいて 2026 年度のスケジュールを埋める
      {
        label: "2026年春期",
        applicationStart: "2026-01-15T00:00:00",
        applicationEnd: "2026-02-04T00:00:00",
        examDate: "2026-04-19T00:00:00",
        resultDate: "2026-06-25T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_boki2",
    name: "日商簿記検定 2級",
    shortName: "簿記2級",
    category: "経理・財務",
    organizer: "日本商工会議所",
    officialUrl: "https://www.kentei.ne.jp/bookkeeping",
    description: "経理事務に必要な商業簿記と工業簿記の基礎を問う民間検定。",
    schedules: [
      // TODO: 統一試験・ネット試験ともに更新
      {
        label: "2026年11月（第N回）",
        applicationStart: "2026-09-01T00:00:00",
        applicationEnd: "2026-10-31T00:00:00",
        examDate: "2026-11-15T00:00:00",
        fee: 4720,
      },
    ],
  },
  {
    id: "q_toeic",
    name: "TOEIC Listening & Reading",
    shortName: "TOEIC L&R",
    category: "英語・語学",
    organizer: "国際ビジネスコミュニケーション協会（IIBC）",
    officialUrl: "https://www.iibc-global.org/toeic/test/lr.html",
    description: "英語コミュニケーション能力を測る世界的検定。日本では毎月複数回開催。",
    schedules: [
      // TODO: 公開テスト・IPテストの日程を埋める
      {
        label: "第N回 公開テスト",
        applicationStart: "2026-04-01T00:00:00",
        applicationEnd: "2026-05-10T00:00:00",
        examDate: "2026-06-15T00:00:00",
        fee: 7810,
      },
    ],
  },
];

/** ID で資格を検索 */
export function findQualificationById(
  id: string,
  catalog: Qualification[] = QUALIFICATION_CATALOG
): Qualification | undefined {
  return catalog.find((q) => q.id === id);
}
