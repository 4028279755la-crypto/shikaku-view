/**
 * 資格管理のドメイン型定義
 */

/**
 * 資格カテゴリ。
 *
 * **「その他」の運用方針**（2026-05-14 D-11 決定）:
 * - 「その他」は **ユーザー追加カスタム資格専用**のカテゴリとして残す
 * - 組み込みカタログ（qualification-catalog.ts）では「その他」を**使わない**。
 *   組み込み資格は必ず13カテゴリのいずれかに割り当てる
 * - ユーザー追加フォームでは「その他」を選択肢の最下位に配置し、
 *   既存13カテゴリへ誘導するUXとする
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

/**
 * 試験の1回分の日程。
 *
 * **通年型（CBT等）の表現**（2026-05-14 D-12 決定）:
 * - 通年で受験可能な試験（CBT, IBT 等）は `isYearRound: true` を立て、
 *   `applicationStart` / `applicationEnd` / `examDate` を **省略する**
 * - UI 側は `isYearRound` のとき申込期間バーや試験日マーカーを描画せず、
 *   代わりに「通年受験可」バッジを出す
 * - ユーザーが「自分はこの日に受ける」と決めている場合は `Watch.userTargetExamDate` を使う
 */
export interface ExamSchedule {
  /** 開催名・例: "2026年春期" "第N回" "2026年 通年CBT（概算）" */
  label: string;
  /** 申込開始日（ISO 8601 yyyy-mm-ddT00:00:00）通年型は省略 */
  applicationStart?: string;
  /** 申込締切日（ISO 8601）通年型は省略 */
  applicationEnd?: string;
  /** 試験日（ISO 8601）通年型は省略 */
  examDate?: string;
  /** 通年で受験可能なフラグ（CBT, IBT等）*/
  isYearRound?: boolean;
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

/** UI 表示用の status ラベル（select / カード表示で再利用） */
export const WATCH_STATUS_LABEL: Record<WatchStatus, string> = {
  watching: "監視中",
  applied: "申込済",
  passed: "合格",
  failed: "不合格",
  skipped: "スキップ",
};

/** select option として並べる順序を固定した配列 */
export const WATCH_STATUS_OPTIONS: ReadonlyArray<{
  value: WatchStatus;
  label: string;
}> = (["watching", "applied", "passed", "failed", "skipped"] as const).map(
  (value) => ({ value, label: WATCH_STATUS_LABEL[value] })
);

export interface Watch {
  id: string;
  /** Qualification.id への参照 */
  qualificationId: string;
  /** どの開催回を狙うか（ExamSchedule.label） */
  targetScheduleLabel?: string;
  /**
   * 通年型試験における「自分の受験予定日」（ISO 8601）
   * 通年型は schedule.examDate が無いため、ユーザーが個人的に決めた受験日をここに保持し、
   * カレンダーの個人マーカー描画に使う。通常型では未使用。（2026-05-14 D-12）
   */
  userTargetExamDate?: string;
  status: WatchStatus;
  /**
   * 合格・不合格時にスナップショット保存される受験回情報。
   * カタログ側で年度替わりにスケジュールが上書きされても、
   * ウォッチ側に「いつ何の回を受けたか」が履歴として残る。（2026-05-14 D-15）
   */
  completedSchedule?: ExamSchedule;
  /** ユーザーメモ（受験動機・目標スコアなど） */
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
