import type { AnalysisResult, ContentBreakdown } from "@/types/analysis";

export interface HistoryItem {
  id: string;
  analyzedAt: string;
  meetingTitle: string;
  score: number;
  level: string;
  levelLabel: string;
  breakdown: ContentBreakdown;
  actionItemCount: number;
  wordCount: number;
  fullResult: AnalysisResult;
  favorite?: boolean;
  tags?: string[];
}

/** Preset tag list for meeting classification */
export const PRESET_TAGS = [
  "重要",
  "紧急",
  "周会",
  "项目",
  "客户",
  "复盘",
  "脑暴",
  "评审",
] as const;

export type PresetTag = typeof PRESET_TAGS[number];

const STORAGE_KEY = "analysisHistory";
const MAX_ITEMS = 50;

/** Generate a unique id, falling back when crypto.randomUUID is unavailable (e.g. HTTP) */
function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Check if localStorage is available (privacy mode may block it) */
function isStorageAvailable(): boolean {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/** Validate the shape of a single history item parsed from storage */
function isValidHistoryItem(item: unknown): item is HistoryItem {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.meetingTitle === "string" &&
    typeof obj.score === "number" &&
    typeof obj.analyzedAt === "string" &&
    typeof obj.fullResult === "object" && obj.fullResult !== null
  );
}

/** Read all history items, newest first */
export function getHistory(): HistoryItem[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidHistoryItem);
  } catch {
    return [];
  }
}

/** Persist history array to localStorage */
function saveHistory(history: HistoryItem[]): boolean {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      // 配额满,尝试删除最旧的非收藏项后重试
      const trimmed = history.filter((_, i) => i < MAX_ITEMS - 5);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

/** Save a new analysis result to history */
export function saveToHistory(result: AnalysisResult): boolean {
  if (!isStorageAvailable()) return false;
  try {
    const history = getHistory();
    const item: HistoryItem = {
      id: genId(),
      analyzedAt: result.analyzedAt,
      meetingTitle: result.meetingTitle,
      score: result.score,
      level: result.level,
      levelLabel: result.levelLabel,
      breakdown: result.breakdown,
      actionItemCount: result.actionItems.length,
      wordCount: result.wordCount,
      fullResult: result,
    };
    history.unshift(item);
    // Trim to max items
    if (history.length > MAX_ITEMS) {
      history.length = MAX_ITEMS;
    }
    saveHistory(history);
    return true;
  } catch {
    return false;
  }
}

/** Clear all history */
export function clearHistory(): boolean {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Toggle the favorite flag of a history item */
export function toggleFavorite(id: string): void {
  if (!isStorageAvailable()) return;
  try {
    const history = getHistory();
    const item = history.find((h) => h.id === id);
    if (item) {
      item.favorite = !item.favorite;
      saveHistory(history);
    }
  } catch {
    // ignore
  }
}

/** Get all favorited history items */
export function getFavorites(): HistoryItem[] {
  return getHistory().filter((h) => h.favorite);
}

/** Add a tag to a history item (idempotent) */
export function addTag(id: string, tag: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const item = history.find((h) => h.id === id);
    if (item) {
      if (!item.tags) item.tags = [];
      if (!item.tags.includes(tag)) {
        item.tags.push(tag);
        saveHistory(history);
      }
    }
  } catch {
    // ignore
  }
}

/** Remove a tag from a history item */
export function removeTag(id: string, tag: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const item = history.find((h) => h.id === id);
    if (item && item.tags) {
      item.tags = item.tags.filter((t) => t !== tag);
      saveHistory(history);
    }
  } catch {
    // ignore
  }
}

/** Get all unique tags used across the history */
export function getAllTags(): string[] {
  const history = getHistory();
  const tagSet = new Set<string>();
  history.forEach((h) => {
    if (h.tags) h.tags.forEach((t) => tagSet.add(t));
  });
  return Array.from(tagSet);
}

/** Normalize breakdown percentages so they sum to 100 */
export function normalizeBreakdown(breakdown: ContentBreakdown): ContentBreakdown {
  const sum = breakdown.effective + breakdown.repetitive + breakdown.nonsense;
  if (sum === 0) return { effective: 33, repetitive: 34, nonsense: 33 };
  if (sum === 100) return breakdown;
  return {
    effective: Math.round((breakdown.effective / sum) * 100),
    repetitive: Math.round((breakdown.repetitive / sum) * 100),
    nonsense: 100 - Math.round((breakdown.effective / sum) * 100) - Math.round((breakdown.repetitive / sum) * 100),
  };
}

/** Format ISO date to "7月15日 14:32" */
export function formatHistoryDate(iso: string): string {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${m}月${day}日 ${h}:${min}`;
}

/** Get score-based background color class */
export function getScoreBgClass(score: number): string {
  if (score >= 90) return "bg-effective-bg text-effective";
  if (score >= 70) return "bg-primary/10 text-primary";
  if (score >= 50) return "bg-repetitive-bg text-repetitive";
  return "bg-nonsense-bg text-nonsense";
}
