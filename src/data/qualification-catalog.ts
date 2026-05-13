/**
 * 資格カタログ（組み込み）
 *
 * v0.1 MVP: 50件（IT11 / 経理8 / 士業10 / 英語6 / 医療6 / 法務5 / その他4）
 *
 * ⚠️ 注意:
 * 各 schedule の日程は **2026年5月時点の典型値・概算**です。実際の日程は
 * 公式サイト（officialUrl）で必ず確認してください。年度替わりで更新が必要。
 * 「label」に「2026年予定」「概算」等を明記して暫定であることを示しています。
 *
 * ID 規約: 組み込みは `q_<slug>`、ユーザー追加は `id_*` プレフィックス（storage 側）
 */
import type { Qualification } from "../types/qualification";

export const QUALIFICATION_CATALOG: Qualification[] = [
  // =========================================================================
  // === IT系（11件） ========================================================
  // =========================================================================
  {
    id: "q_fe",
    name: "基本情報技術者試験",
    shortName: "基本情報",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/fe.html",
    description: "IT技術者の基礎的知識・技能を問う国家試験。通年CBT。",
    schedules: [
      {
        label: "2026年 通年CBT（概算）",
        applicationStart: "2026-01-01T00:00:00",
        applicationEnd: "2026-12-15T00:00:00",
        examDate: "2026-06-15T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_ap",
    name: "応用情報技術者試験",
    shortName: "応用情報",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/ap.html",
    description: "IT技術者の応用的知識・技能を問う国家試験。年2回（春・秋）。",
    schedules: [
      {
        label: "2026年春期（概算）",
        applicationStart: "2026-01-15T00:00:00",
        applicationEnd: "2026-02-04T00:00:00",
        examDate: "2026-04-19T00:00:00",
        resultDate: "2026-06-25T00:00:00",
        fee: 7500,
      },
      {
        label: "2026年秋期（概算）",
        applicationStart: "2026-07-15T00:00:00",
        applicationEnd: "2026-08-05T00:00:00",
        examDate: "2026-10-18T00:00:00",
        resultDate: "2026-12-25T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_ip",
    name: "ITパスポート試験",
    shortName: "ITパスポート",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/ip.html",
    description: "ITを利活用する全ての社会人向けの基礎的国家試験。通年CBT。",
    schedules: [
      {
        label: "2026年 通年CBT（概算）",
        applicationStart: "2026-01-01T00:00:00",
        applicationEnd: "2026-12-15T00:00:00",
        examDate: "2026-06-15T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_sg",
    name: "情報セキュリティマネジメント試験",
    shortName: "情報セキュマネ",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/sg.html",
    description: "情報セキュリティ管理の基礎を問う国家試験。通年CBT。",
    schedules: [
      {
        label: "2026年 通年CBT（概算）",
        applicationStart: "2026-01-01T00:00:00",
        applicationEnd: "2026-12-15T00:00:00",
        examDate: "2026-06-15T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_sc",
    name: "情報処理安全確保支援士試験",
    shortName: "セキスペ",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/sc.html",
    description: "サイバーセキュリティの高度国家資格。年2回（春・秋）。",
    schedules: [
      {
        label: "2026年春期（概算）",
        applicationStart: "2026-01-15T00:00:00",
        applicationEnd: "2026-02-04T00:00:00",
        examDate: "2026-04-19T00:00:00",
        fee: 7500,
      },
      {
        label: "2026年秋期（概算）",
        applicationStart: "2026-07-15T00:00:00",
        applicationEnd: "2026-08-05T00:00:00",
        examDate: "2026-10-18T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_nw",
    name: "ネットワークスペシャリスト試験",
    shortName: "ネスペ",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/nw.html",
    description: "ネットワーク技術の高度国家試験。年1回（春期）。",
    schedules: [
      {
        label: "2026年春期（概算）",
        applicationStart: "2026-01-15T00:00:00",
        applicationEnd: "2026-02-04T00:00:00",
        examDate: "2026-04-19T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_db",
    name: "データベーススペシャリスト試験",
    shortName: "DBスペ",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/db.html",
    description: "データベース技術の高度国家試験。年1回（秋期）。",
    schedules: [
      {
        label: "2026年秋期（概算）",
        applicationStart: "2026-07-15T00:00:00",
        applicationEnd: "2026-08-05T00:00:00",
        examDate: "2026-10-18T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_pm",
    name: "プロジェクトマネージャ試験",
    shortName: "PM",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/pm.html",
    description: "プロジェクト管理の高度国家試験。年1回（秋期）。",
    schedules: [
      {
        label: "2026年秋期（概算）",
        applicationStart: "2026-07-15T00:00:00",
        applicationEnd: "2026-08-05T00:00:00",
        examDate: "2026-10-18T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_st",
    name: "ITストラテジスト試験",
    shortName: "ST",
    category: "IT",
    organizer: "IPA（情報処理推進機構）",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/st.html",
    description: "IT戦略策定の最高位国家試験。年1回（春期）。",
    schedules: [
      {
        label: "2026年春期（概算）",
        applicationStart: "2026-01-15T00:00:00",
        applicationEnd: "2026-02-04T00:00:00",
        examDate: "2026-04-19T00:00:00",
        fee: 7500,
      },
    ],
  },
  {
    id: "q_g_kentei",
    name: "G検定（JDLA Deep Learning for GENERAL）",
    shortName: "G検定",
    category: "IT",
    organizer: "日本ディープラーニング協会（JDLA）",
    officialUrl: "https://www.jdla.org/certificate/general/",
    description: "ディープラーニングを事業活用するための基礎知識を問う民間検定。年6回程度。",
    schedules: [
      {
        label: "2026年 第3回（概算）",
        applicationStart: "2026-04-01T00:00:00",
        applicationEnd: "2026-05-15T00:00:00",
        examDate: "2026-05-30T00:00:00",
        fee: 13200,
      },
    ],
  },
  {
    id: "q_e_shikaku",
    name: "E資格（JDLA Deep Learning for ENGINEER）",
    shortName: "E資格",
    category: "IT",
    organizer: "日本ディープラーニング協会（JDLA）",
    officialUrl: "https://www.jdla.org/certificate/engineer/",
    description: "ディープラーニング実装能力を問う民間検定。年2回。",
    schedules: [
      {
        label: "2026年 第1回（概算）",
        applicationStart: "2026-01-15T00:00:00",
        applicationEnd: "2026-02-15T00:00:00",
        examDate: "2026-02-21T00:00:00",
        fee: 33000,
      },
    ],
  },

  // =========================================================================
  // === 経理・財務（8件） ===================================================
  // =========================================================================
  {
    id: "q_boki3",
    name: "日商簿記検定 3級",
    shortName: "簿記3級",
    category: "経理・財務",
    organizer: "日本商工会議所",
    officialUrl: "https://www.kentei.ne.jp/bookkeeping",
    description: "商業簿記の基礎を問う民間検定。統一試験は年3回、ネット試験は通年。",
    schedules: [
      {
        label: "2026年6月 統一試験（概算）",
        applicationStart: "2026-04-21T00:00:00",
        applicationEnd: "2026-05-22T00:00:00",
        examDate: "2026-06-14T00:00:00",
        fee: 3300,
      },
      {
        label: "2026年11月 統一試験（概算）",
        applicationStart: "2026-09-22T00:00:00",
        applicationEnd: "2026-10-23T00:00:00",
        examDate: "2026-11-15T00:00:00",
        fee: 3300,
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
    description: "商業簿記・工業簿記を問う民間検定。経理事務の入口。",
    schedules: [
      {
        label: "2026年6月 統一試験（概算）",
        applicationStart: "2026-04-21T00:00:00",
        applicationEnd: "2026-05-22T00:00:00",
        examDate: "2026-06-14T00:00:00",
        fee: 5500,
      },
      {
        label: "2026年11月 統一試験（概算）",
        applicationStart: "2026-09-22T00:00:00",
        applicationEnd: "2026-10-23T00:00:00",
        examDate: "2026-11-15T00:00:00",
        fee: 5500,
      },
    ],
  },
  {
    id: "q_boki1",
    name: "日商簿記検定 1級",
    shortName: "簿記1級",
    category: "経理・財務",
    organizer: "日本商工会議所",
    officialUrl: "https://www.kentei.ne.jp/bookkeeping",
    description: "商業簿記・会計学・工業簿記・原価計算を網羅する最高位検定。年2回。",
    schedules: [
      {
        label: "2026年6月（概算）",
        applicationStart: "2026-04-21T00:00:00",
        applicationEnd: "2026-05-22T00:00:00",
        examDate: "2026-06-14T00:00:00",
        fee: 8800,
      },
      {
        label: "2026年11月（概算）",
        applicationStart: "2026-09-22T00:00:00",
        applicationEnd: "2026-10-23T00:00:00",
        examDate: "2026-11-15T00:00:00",
        fee: 8800,
      },
    ],
  },
  {
    id: "q_fp3",
    name: "FP技能検定 3級",
    shortName: "FP3級",
    category: "経理・財務",
    organizer: "金融財政事情研究会 / 日本FP協会",
    officialUrl: "https://www.jafp.or.jp/exam/",
    description: "ファイナンシャル・プランニングの基礎国家技能検定。CBT通年。",
    schedules: [
      {
        label: "2026年 CBT通年（概算）",
        applicationStart: "2026-01-01T00:00:00",
        applicationEnd: "2026-12-15T00:00:00",
        examDate: "2026-06-30T00:00:00",
        fee: 8000,
      },
    ],
  },
  {
    id: "q_fp2",
    name: "FP技能検定 2級",
    shortName: "FP2級",
    category: "経理・財務",
    organizer: "金融財政事情研究会 / 日本FP協会",
    officialUrl: "https://www.jafp.or.jp/exam/",
    description: "FP実務レベルの国家技能検定。CBT通年。",
    schedules: [
      {
        label: "2026年 CBT通年（概算）",
        applicationStart: "2026-01-01T00:00:00",
        applicationEnd: "2026-12-15T00:00:00",
        examDate: "2026-06-30T00:00:00",
        fee: 11700,
      },
    ],
  },
  {
    id: "q_fp1",
    name: "FP技能検定 1級",
    shortName: "FP1級",
    category: "経理・財務",
    organizer: "金融財政事情研究会 / 日本FP協会",
    officialUrl: "https://www.jafp.or.jp/exam/",
    description: "FP上級者向け国家技能検定。学科+実技で年1〜2回。",
    schedules: [
      {
        label: "2026年9月 学科（概算）",
        applicationStart: "2026-07-01T00:00:00",
        applicationEnd: "2026-08-04T00:00:00",
        examDate: "2026-09-13T00:00:00",
        fee: 8900,
      },
    ],
  },
  {
    id: "q_kaikeishi",
    name: "公認会計士",
    shortName: "公認会計士",
    category: "経理・財務",
    organizer: "公認会計士・監査審査会（金融庁）",
    officialUrl: "https://www.fsa.go.jp/cpaaob/kouninkaikeishi-shiken/",
    description: "会計監査の独占国家資格。短答式（5月・12月）/論文式（8月）。",
    schedules: [
      {
        label: "2026年第I回 短答式（概算）",
        applicationStart: "2025-08-29T00:00:00",
        applicationEnd: "2025-09-18T00:00:00",
        examDate: "2025-12-14T00:00:00",
      },
      {
        label: "2026年第II回 短答式（概算）",
        applicationStart: "2026-02-06T00:00:00",
        applicationEnd: "2026-02-26T00:00:00",
        examDate: "2026-05-24T00:00:00",
      },
      {
        label: "2026年 論文式（概算）",
        applicationStart: "2026-04-01T00:00:00",
        applicationEnd: "2026-06-30T00:00:00",
        examDate: "2026-08-21T00:00:00",
      },
    ],
  },
  {
    id: "q_zeirishi",
    name: "税理士",
    shortName: "税理士",
    category: "経理・財務",
    organizer: "国税審議会（国税庁）",
    officialUrl: "https://www.nta.go.jp/taxes/shiraberu/shikaku/zeirishi/",
    description: "税務の独占国家資格。年1回（8月初旬3日間）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-05-07T00:00:00",
        applicationEnd: "2026-05-21T00:00:00",
        examDate: "2026-08-04T00:00:00",
        resultDate: "2026-11-30T00:00:00",
      },
    ],
  },

  // =========================================================================
  // === 士業（10件） ========================================================
  // =========================================================================
  {
    id: "q_gyousei",
    name: "行政書士",
    shortName: "行政書士",
    category: "士業",
    organizer: "行政書士試験研究センター",
    officialUrl: "https://gyosei-shiken.or.jp/",
    description: "官公庁への書類作成・代理の国家資格。年1回（11月第2日曜）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-07-27T00:00:00",
        applicationEnd: "2026-08-25T00:00:00",
        examDate: "2026-11-08T00:00:00",
        resultDate: "2027-01-27T00:00:00",
        fee: 10400,
      },
    ],
  },
  {
    id: "q_shihou_shoshi",
    name: "司法書士",
    shortName: "司法書士",
    category: "士業",
    organizer: "法務省",
    officialUrl: "https://www.moj.go.jp/MINJI/minji06_00029.html",
    description: "登記・供託・訴訟書類作成の国家資格。年1回（7月第1日曜）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-05-01T00:00:00",
        applicationEnd: "2026-05-15T00:00:00",
        examDate: "2026-07-05T00:00:00",
        fee: 8000,
      },
    ],
  },
  {
    id: "q_benrishi",
    name: "弁理士",
    shortName: "弁理士",
    category: "士業",
    organizer: "工業所有権審議会（特許庁）",
    officialUrl: "https://www.jpo.go.jp/news/benrishi/shiken/index.html",
    description: "特許・商標等の知的財産権の独占国家資格。短答（5月）/論文（7月）/口述（10月）。",
    schedules: [
      {
        label: "2026年 短答式（概算）",
        applicationStart: "2026-03-15T00:00:00",
        applicationEnd: "2026-04-10T00:00:00",
        examDate: "2026-05-17T00:00:00",
        fee: 12000,
      },
    ],
  },
  {
    id: "q_sharoushi",
    name: "社会保険労務士",
    shortName: "社労士",
    category: "士業",
    organizer: "全国社会保険労務士会連合会",
    officialUrl: "https://www.sharosi-siken.or.jp/",
    description: "労働・社会保険の専門家国家資格。年1回（8月第4日曜）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-04-13T00:00:00",
        applicationEnd: "2026-05-31T00:00:00",
        examDate: "2026-08-23T00:00:00",
        resultDate: "2026-10-02T00:00:00",
        fee: 15000,
      },
    ],
  },
  {
    id: "q_shindanshi",
    name: "中小企業診断士",
    shortName: "診断士",
    category: "士業",
    organizer: "中小企業診断協会",
    officialUrl: "https://www.j-smeca.jp/",
    description: "経営コンサルティングの国家資格。1次（8月）/2次（10月+12月口述）。",
    schedules: [
      {
        label: "2026年 1次試験（概算）",
        applicationStart: "2026-04-23T00:00:00",
        applicationEnd: "2026-05-30T00:00:00",
        examDate: "2026-08-01T00:00:00",
        fee: 14500,
      },
      {
        label: "2026年 2次筆記（概算）",
        applicationStart: "2026-08-23T00:00:00",
        applicationEnd: "2026-09-17T00:00:00",
        examDate: "2026-10-25T00:00:00",
        fee: 17800,
      },
    ],
  },
  {
    id: "q_takken",
    name: "宅地建物取引士",
    shortName: "宅建士",
    category: "士業",
    organizer: "不動産適正取引推進機構",
    officialUrl: "https://www.retio.or.jp/exam/",
    description: "不動産取引の独占国家資格。年1回（10月第3日曜）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-07-01T00:00:00",
        applicationEnd: "2026-07-31T00:00:00",
        examDate: "2026-10-18T00:00:00",
        resultDate: "2026-12-02T00:00:00",
        fee: 8200,
      },
    ],
  },
  {
    id: "q_mansion",
    name: "マンション管理士",
    shortName: "マン管",
    category: "士業",
    organizer: "マンション管理センター",
    officialUrl: "https://www.mankan.or.jp/",
    description: "マンション管理の専門国家資格。年1回（11月最終日曜）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-09-01T00:00:00",
        applicationEnd: "2026-09-30T00:00:00",
        examDate: "2026-11-29T00:00:00",
        fee: 9400,
      },
    ],
  },
  {
    id: "q_kanri",
    name: "管理業務主任者",
    shortName: "管業",
    category: "士業",
    organizer: "マンション管理業協会",
    officialUrl: "https://www.kanrikyo.or.jp/k_kanri/",
    description: "マンション管理業の国家資格。年1回（12月第1日曜）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-09-01T00:00:00",
        applicationEnd: "2026-09-30T00:00:00",
        examDate: "2026-12-06T00:00:00",
        fee: 8900,
      },
    ],
  },
  {
    id: "q_fudosan_kantei",
    name: "不動産鑑定士",
    shortName: "鑑定士",
    category: "士業",
    organizer: "国土交通省",
    officialUrl: "https://www.mlit.go.jp/totikensangyo/totikensangyo_fr5_000002.html",
    description: "不動産価値評価の独占国家資格。短答（5月）/論文（7月）。",
    schedules: [
      {
        label: "2026年 短答式（概算）",
        applicationStart: "2026-02-20T00:00:00",
        applicationEnd: "2026-03-15T00:00:00",
        examDate: "2026-05-10T00:00:00",
        fee: 13000,
      },
    ],
  },
  {
    id: "q_chosashi",
    name: "土地家屋調査士",
    shortName: "調査士",
    category: "士業",
    organizer: "法務省",
    officialUrl: "https://www.moj.go.jp/MINJI/minji03_00006.html",
    description: "不動産表示登記の独占国家資格。年1回（10月）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-07-22T00:00:00",
        applicationEnd: "2026-08-09T00:00:00",
        examDate: "2026-10-18T00:00:00",
        fee: 8300,
      },
    ],
  },

  // =========================================================================
  // === 英語・語学（6件） ===================================================
  // =========================================================================
  {
    id: "q_toeic",
    name: "TOEIC Listening & Reading",
    shortName: "TOEIC L&R",
    category: "英語・語学",
    organizer: "国際ビジネスコミュニケーション協会（IIBC）",
    officialUrl: "https://www.iibc-global.org/toeic/test/lr.html",
    description: "英語コミュニケーション能力を測る世界的検定。日本では毎月1〜2回開催。",
    schedules: [
      {
        label: "2026年6月公開テスト（概算）",
        applicationStart: "2026-04-01T00:00:00",
        applicationEnd: "2026-05-10T00:00:00",
        examDate: "2026-06-21T00:00:00",
        fee: 7810,
      },
    ],
  },
  {
    id: "q_eiken",
    name: "実用英語技能検定（英検）",
    shortName: "英検",
    category: "英語・語学",
    organizer: "日本英語検定協会",
    officialUrl: "https://www.eiken.or.jp/eiken/",
    description: "日本最大の英語検定。年3回（第1回:5-6月 / 第2回:10月 / 第3回:1月）。",
    schedules: [
      {
        label: "2026年度 第1回（概算）",
        applicationStart: "2026-03-31T00:00:00",
        applicationEnd: "2026-05-12T00:00:00",
        examDate: "2026-06-07T00:00:00",
        fee: 7900,
      },
      {
        label: "2026年度 第2回（概算）",
        applicationStart: "2026-07-15T00:00:00",
        applicationEnd: "2026-09-15T00:00:00",
        examDate: "2026-10-11T00:00:00",
        fee: 7900,
      },
    ],
  },
  {
    id: "q_toefl",
    name: "TOEFL iBT",
    shortName: "TOEFL",
    category: "英語・語学",
    organizer: "ETS",
    officialUrl: "https://www.ets.org/jp/toefl.html",
    description: "海外大学留学で求められる英語試験。通年複数回開催。",
    schedules: [
      {
        label: "2026年 通年（概算）",
        applicationStart: "2026-01-01T00:00:00",
        applicationEnd: "2026-12-15T00:00:00",
        examDate: "2026-06-15T00:00:00",
        fee: 35000,
      },
    ],
  },
  {
    id: "q_ielts",
    name: "IELTS",
    shortName: "IELTS",
    category: "英語・語学",
    organizer: "British Council / IDP / 日本英語検定協会",
    officialUrl: "https://www.eiken.or.jp/ielts/",
    description: "留学・移住で世界的に通用する英語試験。毎月複数回開催。",
    schedules: [
      {
        label: "2026年 月次（概算）",
        applicationStart: "2026-04-01T00:00:00",
        applicationEnd: "2026-06-01T00:00:00",
        examDate: "2026-06-13T00:00:00",
        fee: 27500,
      },
    ],
  },
  {
    id: "q_chuken",
    name: "中国語検定",
    shortName: "中検",
    category: "英語・語学",
    organizer: "日本中国語検定協会",
    officialUrl: "https://www.chuken.gr.jp/",
    description: "中国語運用能力を測る民間検定。年3回（3月/6月/11月）。",
    schedules: [
      {
        label: "2026年6月（概算）",
        applicationStart: "2026-04-15T00:00:00",
        applicationEnd: "2026-05-13T00:00:00",
        examDate: "2026-06-28T00:00:00",
        fee: 6800,
      },
    ],
  },
  {
    id: "q_hsk",
    name: "HSK 中国政府公認 漢語水平考試",
    shortName: "HSK",
    category: "英語・語学",
    organizer: "HSK日本実施委員会",
    officialUrl: "https://www.hskj.jp/",
    description: "中国政府公認の中国語検定。月複数回開催。",
    schedules: [
      {
        label: "2026年6月（概算）",
        applicationStart: "2026-04-01T00:00:00",
        applicationEnd: "2026-05-13T00:00:00",
        examDate: "2026-06-14T00:00:00",
        fee: 6500,
      },
    ],
  },

  // =========================================================================
  // === 医療・福祉（6件） ===================================================
  // =========================================================================
  {
    id: "q_kangoshi",
    name: "看護師国家試験",
    shortName: "看護師",
    category: "医療・福祉",
    organizer: "厚生労働省",
    officialUrl: "https://www.mhlw.go.jp/kouseiroudoushou/shikaku_shiken/kangoshi/",
    description: "看護師の国家資格。年1回（2月中旬）。",
    schedules: [
      {
        label: "2026年（第115回・概算）",
        applicationStart: "2025-11-04T00:00:00",
        applicationEnd: "2025-11-25T00:00:00",
        examDate: "2026-02-15T00:00:00",
        resultDate: "2026-03-26T00:00:00",
      },
    ],
  },
  {
    id: "q_yakuzaishi",
    name: "薬剤師国家試験",
    shortName: "薬剤師",
    category: "医療・福祉",
    organizer: "厚生労働省",
    officialUrl: "https://www.mhlw.go.jp/kouseiroudoushou/shikaku_shiken/yakuzaishi/",
    description: "薬剤師の国家資格。年1回（2月下旬）。",
    schedules: [
      {
        label: "2026年（第111回・概算）",
        applicationStart: "2026-01-05T00:00:00",
        applicationEnd: "2026-01-21T00:00:00",
        examDate: "2026-02-21T00:00:00",
        resultDate: "2026-03-25T00:00:00",
        fee: 6800,
      },
    ],
  },
  {
    id: "q_kaigo",
    name: "介護福祉士国家試験",
    shortName: "介護福祉士",
    category: "医療・福祉",
    organizer: "社会福祉振興・試験センター",
    officialUrl: "http://www.sssc.or.jp/kaigo/",
    description: "介護福祉士の国家資格。筆記（1月）+実技（3月）。",
    schedules: [
      {
        label: "2026年（第38回・概算）",
        applicationStart: "2025-08-07T00:00:00",
        applicationEnd: "2025-09-05T00:00:00",
        examDate: "2026-01-25T00:00:00",
        resultDate: "2026-03-25T00:00:00",
        fee: 18380,
      },
    ],
  },
  {
    id: "q_shafuku",
    name: "社会福祉士国家試験",
    shortName: "社会福祉士",
    category: "医療・福祉",
    organizer: "社会福祉振興・試験センター",
    officialUrl: "http://www.sssc.or.jp/shakai/",
    description: "社会福祉士の国家資格。年1回（2月）。",
    schedules: [
      {
        label: "2026年（第38回・概算）",
        applicationStart: "2025-09-04T00:00:00",
        applicationEnd: "2025-10-06T00:00:00",
        examDate: "2026-02-01T00:00:00",
        resultDate: "2026-03-04T00:00:00",
        fee: 19370,
      },
    ],
  },
  {
    id: "q_rinshou",
    name: "臨床心理士",
    shortName: "臨床心理士",
    category: "医療・福祉",
    organizer: "日本臨床心理士資格認定協会",
    officialUrl: "http://fjcbcp.or.jp/",
    description: "臨床心理士の民間資格。一次（10月）+二次（11月）。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-07-01T00:00:00",
        applicationEnd: "2026-07-31T00:00:00",
        examDate: "2026-10-10T00:00:00",
        fee: 30000,
      },
    ],
  },
  {
    id: "q_kounin_shinrishi",
    name: "公認心理師",
    shortName: "公認心理師",
    category: "医療・福祉",
    organizer: "厚生労働省・文部科学省",
    officialUrl: "https://shinri-kenshu.jp/",
    description: "心理職唯一の国家資格。年1回（3月）。",
    schedules: [
      {
        label: "2026年（第9回・概算）",
        applicationStart: "2025-12-08T00:00:00",
        applicationEnd: "2026-01-09T00:00:00",
        examDate: "2026-03-08T00:00:00",
        resultDate: "2026-04-10T00:00:00",
        fee: 28700,
      },
    ],
  },

  // =========================================================================
  // === 法務・労務（5件） ===================================================
  // =========================================================================
  {
    id: "q_houmu",
    name: "ビジネス実務法務検定",
    shortName: "ビジ法",
    category: "法務・労務",
    organizer: "東京商工会議所",
    officialUrl: "https://kentei.tokyo-cci.or.jp/houmu/",
    description: "ビジネスの法律知識を問う民間検定。年2回（6-7月/10-12月）。",
    schedules: [
      {
        label: "2026年6月IBT/CBT期（概算）",
        applicationStart: "2026-05-08T00:00:00",
        applicationEnd: "2026-06-19T00:00:00",
        examDate: "2026-06-20T00:00:00",
        fee: 5500,
      },
    ],
  },
  {
    id: "q_kojin_jouhou",
    name: "個人情報保護士",
    shortName: "個人情報",
    category: "法務・労務",
    organizer: "全日本情報学習振興協会",
    officialUrl: "https://www.joho-gakushu.or.jp/piip/",
    description: "個人情報保護法・マイナンバー法の専門民間資格。年4回。",
    schedules: [
      {
        label: "2026年6月（概算）",
        applicationStart: "2026-03-01T00:00:00",
        applicationEnd: "2026-05-20T00:00:00",
        examDate: "2026-06-14T00:00:00",
        fee: 11000,
      },
    ],
  },
  {
    id: "q_chiteki",
    name: "知的財産管理技能検定",
    shortName: "知財検定",
    category: "法務・労務",
    organizer: "知的財産教育協会",
    officialUrl: "https://www.kentei-info-ip-edu.org/",
    description: "知的財産管理の国家技能検定。年3回（3月/7月/11月）。",
    schedules: [
      {
        label: "2026年7月（概算）",
        applicationStart: "2026-04-01T00:00:00",
        applicationEnd: "2026-05-12T00:00:00",
        examDate: "2026-07-12T00:00:00",
        fee: 8900,
      },
    ],
  },
  {
    id: "q_eisei",
    name: "第一種衛生管理者",
    shortName: "衛生管理者",
    category: "法務・労務",
    organizer: "安全衛生技術試験協会",
    officialUrl: "https://www.exam.or.jp/",
    description: "労働安全衛生の国家資格。月数回開催。",
    schedules: [
      {
        label: "2026年6月（概算）",
        applicationStart: "2026-04-15T00:00:00",
        applicationEnd: "2026-05-15T00:00:00",
        examDate: "2026-06-15T00:00:00",
        fee: 8800,
      },
    ],
  },
  {
    id: "q_mental",
    name: "メンタルヘルス・マネジメント検定",
    shortName: "メンタルヘルス",
    category: "法務・労務",
    organizer: "大阪商工会議所",
    officialUrl: "https://www.mental-health.ne.jp/",
    description: "職場のメンタルヘルス知識を問う民間検定。年2回（3月/11月）。",
    schedules: [
      {
        label: "2026年11月（概算）",
        applicationStart: "2026-08-25T00:00:00",
        applicationEnd: "2026-09-25T00:00:00",
        examDate: "2026-11-01T00:00:00",
        fee: 7480,
      },
    ],
  },

  // =========================================================================
  // === その他（4件） =======================================================
  // =========================================================================
  {
    id: "q_kikenbutsu",
    name: "危険物取扱者 乙種第4類",
    shortName: "危険物乙4",
    category: "その他",
    organizer: "消防試験研究センター",
    officialUrl: "https://www.shoubo-shiken.or.jp/",
    description: "ガソリン等の取扱に必要な国家資格。月数回開催。",
    schedules: [
      {
        label: "2026年6月（概算）",
        applicationStart: "2026-04-15T00:00:00",
        applicationEnd: "2026-05-15T00:00:00",
        examDate: "2026-06-21T00:00:00",
        fee: 5300,
      },
    ],
  },
  {
    id: "q_denki2",
    name: "第二種電気工事士",
    shortName: "電工2種",
    category: "その他",
    organizer: "電気技術者試験センター",
    officialUrl: "https://www.shiken.or.jp/",
    description: "一般用電気工作物の工事に必要な国家資格。年2回（上期/下期）。",
    schedules: [
      {
        label: "2026年上期 学科（概算）",
        applicationStart: "2026-03-17T00:00:00",
        applicationEnd: "2026-04-07T00:00:00",
        examDate: "2026-05-30T00:00:00",
        fee: 9300,
      },
      {
        label: "2026年下期 学科（概算）",
        applicationStart: "2026-08-17T00:00:00",
        applicationEnd: "2026-09-04T00:00:00",
        examDate: "2026-10-31T00:00:00",
        fee: 9300,
      },
    ],
  },
  {
    id: "q_tsukan",
    name: "通関士",
    shortName: "通関士",
    category: "その他",
    organizer: "税関（財務省）",
    officialUrl: "https://www.customs.go.jp/tsukanshi/",
    description: "貿易・通関業務の独占国家資格。年1回（10月）。",
    schedules: [
      {
        label: "2026年（第60回・概算）",
        applicationStart: "2026-07-22T00:00:00",
        applicationEnd: "2026-08-08T00:00:00",
        examDate: "2026-10-04T00:00:00",
        resultDate: "2026-11-27T00:00:00",
        fee: 3000,
      },
    ],
  },
  {
    id: "q_tsuyaku",
    name: "全国通訳案内士",
    shortName: "通訳案内士",
    category: "その他",
    organizer: "観光庁 / JNTO",
    officialUrl: "https://www.jnto.go.jp/jpn/projects/visitor_support/interpreter_guide_exams/",
    description: "外国人観光客の通訳ガイドの独占国家資格。年1回。",
    schedules: [
      {
        label: "2026年（概算）",
        applicationStart: "2026-05-22T00:00:00",
        applicationEnd: "2026-06-12T00:00:00",
        examDate: "2026-08-23T00:00:00",
        resultDate: "2026-11-06T00:00:00",
        fee: 11700,
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
