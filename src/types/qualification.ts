/**
 * 資格管理のドメイン型定義
 */

export type QualificationCategory =
  | "IT"
  | "経理・財務"
  | "士業"
  | "不動産"
  | "英語・語学"
  | "医療・福祉"
  | "法務・労務"
  | "建築・測量"
  | "電気・通信"
  | "機械・運転"
  | "観光・サービス"
  | "安全・防災"
  | "物流・貿易"
  | "その他";

export const CATEGORIES: QualificationCategory[] = [
  "IT",
  "経理・財務",
  "士業",
  "不動産",
  "建築・測量",
  "電気・通信",
  "機械・運転",
  "観光・サービス",
  "安全・防災",
  "物流・貿易",
  "英語・語学",
  "医療・福祉",
  "法務・労務",
  "その他",
];

/** 試験の1回分の日程 */
export interface ExamSchedule {
  /** 開催名・例: "2026年春期" "第N回" */
  label: string;
  /** 申込開始日（ISO 8601 yyyy-mm-ddT00:00:00）*/
  applicationStart: string;
  /** 申込締切日（ISO 8601） */
  applicationEnd: string;
  /** 試験日（ISO 8601） */
  examDate: string;
  /** 結果発表日（任意） */
  resultDate?: string;
  /** 受験料（任意・整数円） */
  fee?: number;
}

/**
 * 資格カタログのエントリ。
 * 組み込みカタログ（qualification-catalog.ts）とユーザー追加（CustomQualification）
 * の両方がこの形を満たす。
 */
export interface Qualification {
  /** 一意ID。組み込みは `q_<slug>`、ユーザー追加は `user_<uuid>` のプレフィックス規約 */
  id: string;
  /** 正式名称・例: "応用情報技術者試験" */
  name: string;
  /** 略称・例: "応用情報" */
  shortName?: string;
  category: QualificationCategory;
  /** 主催団体・例: "IPA" "日本商工会議所" */
  organizer: string;
  /** 公式の申込・案内ページ */
  officialUrl: string;
  /** 簡易説明（1〜2行） */
  description?: string;
  /** 直近〜将来の開催回（過去のものは適宜削除する運用） */
  schedules: ExamSchedule[];
}

/** ウォッチリスト（オーナーが「狙っている」資格） */
export type WatchStatus =
  | "watching"   // 受験予定で監視中
  | "applied"    // 申込済
  | "passed"     // 合格
  | "failed"     // 不合格
  | "skipped";   // スキップ（今回は受けない）

export interface Watch {
  id: string;
  /** Qualification.id への参照 */
  qualificationId: string;
  /** どの開催回を狙うか（ExamSchedule.label） */
  targetScheduleLabel?: string;
  status: WatchStatus;
  /** ユーザーメモ（受験動機・目標スコアなど） */
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
