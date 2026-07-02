// 内容类型
export type ContentType = "effective" | "repetitive" | "nonsense";

// 逐句分析
export interface SentenceAnalysis {
  text: string;
  type: ContentType;
  confidence: number;
  reason: string;
  speaker?: string;
}

// 行动项
export interface ActionItem {
  id: string;
  content: string;
  assignee: string;
  deadline: string;
  priority: "high" | "medium" | "low";
}

// 内容占比
export interface ContentBreakdown {
  effective: number;
  repetitive: number;
  nonsense: number;
}

// 完整分析结果
export interface AnalysisResult {
  meetingTitle: string;
  duration: string;
  participantCount: number;

  score: number;
  level: "excellent" | "good" | "fair" | "poor";
  levelLabel: string;

  breakdown: ContentBreakdown;
  sentences: SentenceAnalysis[];

  actionItems: ActionItem[];

  summary: string;
  keyDecisions: string[];

  suggestions: string[];

  analyzedAt: string;
  wordCount: number;
}
