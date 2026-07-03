import type { AnalysisResult } from "@/types/analysis";

/* ─── Types ─── */

export type FilterKey = "all" | "effective" | "repetitive" | "nonsense";

export interface DeepInsight {
  icon: string;
  label: string;
  value: string;
  color: string;
}

export interface SpeakerStat {
  name: string;
  total: number;
  effective: number;
  repetitive: number;
  nonsense: number;
  effectiveRate: number;
}

/* ─── Score Color Helpers ─── */

export function getScoreBarColor(score: number): string {
  if (score >= 90) return "bg-effective";
  if (score >= 70) return "bg-primary";
  if (score >= 50) return "bg-repetitive";
  return "bg-nonsense";
}

export function getScoreTextColor(score: number): string {
  if (score >= 90) return "text-effective";
  if (score >= 70) return "text-primary";
  if (score >= 50) return "text-repetitive";
  return "text-nonsense";
}

export function getScoreRawColor(score: number): string {
  if (score >= 90) return "var(--color-effective)";
  if (score >= 70) return "var(--color-primary)";
  if (score >= 50) return "var(--color-repetitive)";
  return "var(--color-nonsense)";
}

/* ─── Level Maps ─── */

export const levelBgs: Record<string, string> = {
  excellent: "bg-effective-bg",
  good: "bg-primary/10",
  fair: "bg-repetitive-bg",
  poor: "bg-nonsense-bg",
};

export const levelTextColors: Record<string, string> = {
  excellent: "text-effective",
  good: "text-primary",
  fair: "text-repetitive",
  poor: "text-nonsense",
};

/* ─── Priority Maps ─── */

export const priorityLabels: Record<string, string> = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
};

export const priorityBgs: Record<string, string> = {
  high: "bg-nonsense-bg text-nonsense",
  medium: "bg-repetitive-bg text-repetitive",
  low: "bg-effective-bg text-effective",
};

/* ─── Filter ─── */

export const filterButtons = [
  { key: "all", label: "全部" },
  { key: "effective", label: "有效" },
  { key: "repetitive", label: "重复" },
  { key: "nonsense", label: "废话" },
] as const;

export function getFilterActiveClass(key: FilterKey): string {
  switch (key) {
    case "all":
      return "bg-bg text-text font-semibold border-border";
    case "effective":
      return "bg-effective-bg text-effective border-effective";
    case "repetitive":
      return "bg-repetitive-bg text-repetitive border-repetitive";
    case "nonsense":
      return "bg-nonsense-bg text-nonsense border-nonsense";
  }
}

/* ─── Sentence Type Helpers ─── */

export function getTypeBorderClass(type: string): string {
  switch (type) {
    case "effective":
      return "border-l-effective";
    case "repetitive":
      return "border-l-repetitive";
    case "nonsense":
      return "border-l-nonsense";
    default:
      return "border-l-border";
  }
}

export function getTypeBadgeClass(type: string): string {
  switch (type) {
    case "effective":
      return "bg-effective-bg text-effective";
    case "repetitive":
      return "bg-repetitive-bg text-repetitive";
    case "nonsense":
      return "bg-nonsense-bg text-nonsense";
    default:
      return "bg-bg text-text-muted";
  }
}

/* ─── Date Formatting ─── */

export function formatAnalyzedAt(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}年${m}月${day}日 ${h}:${min}`;
}

/* ─── Donut Chart Constants ─── */

export const CHART_RADIUS = 80;
export const CHART_CIRCUMFERENCE = 2 * Math.PI * CHART_RADIUS;

/* ─── Data Aggregation Helpers ─── */

export function computeSpeakerStats(result: AnalysisResult): SpeakerStat[] | null {
  const hasSpeakers = result.sentences.some((s) => s.speaker);
  if (!hasSpeakers) return null;

  const map = new Map<string, { total: number; effective: number; repetitive: number; nonsense: number }>();
  for (const s of result.sentences) {
    const name = s.speaker || "未知";
    if (!map.has(name)) map.set(name, { total: 0, effective: 0, repetitive: 0, nonsense: 0 });
    const entry = map.get(name)!;
    entry.total++;
    if (s.type === "effective") entry.effective++;
    else if (s.type === "repetitive") entry.repetitive++;
    else entry.nonsense++;
  }
  const arr = Array.from(map.entries()).map(([name, stats]) => ({
    name,
    ...stats,
    effectiveRate: Math.round((stats.effective / stats.total) * 100),
  }));
  arr.sort((a, b) => b.effectiveRate - a.effectiveRate);
  return arr;
}

export function computeDeepInsights(result: AnalysisResult): DeepInsight[] {
  const insights: DeepInsight[] = [];

  // Most verbose speaker (most sentences, lowest effective rate)
  const speakerMap = new Map<string, { total: number; effective: number }>();
  for (const s of result.sentences) {
    const name = s.speaker || "未知";
    if (!speakerMap.has(name)) speakerMap.set(name, { total: 0, effective: 0 });
    const entry = speakerMap.get(name)!;
    entry.total++;
    if (s.type === "effective") entry.effective++;
  }
  const speakers = Array.from(speakerMap.entries())
    .map(([name, stats]) => ({ name, ...stats, rate: stats.total > 0 ? stats.effective / stats.total : 0 }))
    .filter((s) => s.total >= 2);

  if (speakers.length > 0) {
    const mostVerbose = [...speakers].sort((a, b) => b.total - a.total)[0];
    const mostConcise = [...speakers].sort((a, b) => a.total - b.total)[0];

    if (mostVerbose.total > 3 && mostVerbose.rate < 0.5) {
      insights.push({
        icon: "talk",
        label: "发言最多但效率最低",
        value: `${mostVerbose.name}（${mostVerbose.total}句，有效率 ${Math.round(mostVerbose.rate * 100)}%）`,
        color: "text-nonsense",
      });
    }

    if (mostConcise !== mostVerbose && mostConcise.rate > 0.8) {
      insights.push({
        icon: "zap",
        label: "发言最少但效率最高",
        value: `${mostConcise.name}（${mostConcise.total}句，有效率 ${Math.round(mostConcise.rate * 100)}%）`,
        color: "text-effective",
      });
    }
  }

  // Nonsense rate
  const nonsenseCount = result.sentences.filter((s) => s.type === "nonsense").length;
  const nonsenseRate = result.sentences.length > 0 ? nonsenseCount / result.sentences.length : 0;
  if (nonsenseRate > 0.4) {
    insights.push({
      icon: "alert",
      label: "废话率过高",
      value: `${Math.round(nonsenseRate * 100)}% 的发言为废话，建议精简会议流程`,
      color: "text-nonsense",
    });
  }

  return insights;
}
