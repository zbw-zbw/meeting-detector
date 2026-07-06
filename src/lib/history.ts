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
}

const STORAGE_KEY = "analysisHistory";
const MAX_ITEMS = 50;

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

/** Read all history items, newest first */
export function getHistory(): HistoryItem[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryItem[];
  } catch {
    return [];
  }
}

/** Persist history array to localStorage */
function saveHistory(history: HistoryItem[]): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

/** Save a new analysis result to history */
export function saveToHistory(result: AnalysisResult): boolean {
  if (!isStorageAvailable()) return false;
  try {
    const history = getHistory();
    const item: HistoryItem = {
      id: crypto.randomUUID(),
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
