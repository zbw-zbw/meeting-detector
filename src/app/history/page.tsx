"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFadeUp } from "@/hooks/useFadeUp";
import { useToast } from "@/components/ToastProvider";
import {
  getHistory,
  toggleFavorite,
  clearHistory,
  formatHistoryDate,
  getScoreBgClass,
  PRESET_TAGS,
  addTag,
  removeTag,
  getAllTags,
  type HistoryItem,
} from "@/lib/history";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IconBook, IconTrash, IconInbox, IconArrowRight, IconSearch, IconX, IconTrendingUp, IconChart, IconDownload, IconClipboard, IconZap, IconAlert, IconCheck, IconStar, IconRefresh, IconTag } from "@/components/Icon";

export default function HistoryPage() {
  useFadeUp();
  const { showToast } = useToast();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "favorite" | "high" | "medium" | "low">("all");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [taggingItem, setTaggingItem] = useState<string | null>(null);

  useEffect(() => {
    const data = getHistory();
    setHistory(data);
    setAllTags(getAllTags());
    setLoading(false);
  }, []);

  const viewReport = (item: HistoryItem) => {
    localStorage.setItem("lastAnalysis", JSON.stringify(item.fullResult));
    router.push("/result");
  };

  // Stats calculations
  const avgScore =
    history.length > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.score, 0) / history.length
        )
      : "—";
  const totalActionItems = history.reduce(
    (sum, item) => sum + item.actionItemCount,
    0
  );
  const maxScore =
    history.length > 0 ? Math.max(...history.map((item) => item.score)) : "—";
  const minScore =
    history.length > 0 ? Math.min(...history.map((item) => item.score)) : "—";

  // Trend: compare last item with second-to-last
  const lastScore = history.length >= 2 ? history[0].score : null;
  const prevScore = history.length >= 2 ? history[1].score : null;
  const scoreTrend = lastScore !== null && prevScore !== null ? lastScore - prevScore : null;

  // Filter history
  const filteredHistory = history.filter((item) => {
    // Search filter
    if (searchQuery && !item.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Favorite filter
    if (scoreFilter === "favorite" && !item.favorite) return false;
    // Score filter
    if (scoreFilter === "high" && item.score < 70) return false;
    if (scoreFilter === "medium" && (item.score < 50 || item.score >= 70)) return false;
    if (scoreFilter === "low" && item.score >= 50) return false;
    // Tag filter
    if (selectedTag && !(item.tags || []).includes(selectedTag)) return false;
    return true;
  });

  /* keyboard navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // don't intercept search input
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredHistory.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        viewReport(filteredHistory[highlightedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredHistory, highlightedIndex]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Title */}
          <div className="mb-8 fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text flex items-center gap-3">
              <IconBook size={28} className="text-primary" /> 分析历史
            </h1>
            <p className="text-text-secondary mt-3 text-lg">
              查看你的所有会议分析记录
            </p>
            {/* Compare prompt */}
            <ComparePrompt />
          </div>

          {/* Loading State */}
          {loading && <HistorySkeleton />}

          {/* Empty State */}
          {!loading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center fade-up">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-4" fill="none">
                {/* Clock outline */}
                <circle cx="60" cy="55" r="30" stroke="var(--border)" strokeWidth="2" />
                <line x1="60" y1="55" x2="60" y2="38" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="60" y1="55" x2="72" y2="60" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
                {/* Base */}
                <line x1="40" y1="95" x2="80" y2="95" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
                {/* Plus button */}
                <circle cx="60" cy="55" r="38" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
              </svg>
              <h2 className="text-2xl font-extrabold text-text mt-4">
                还没有分析记录
              </h2>
              <p className="text-text-secondary mt-2">
                开始分析你的第一场会议吧
              </p>
              <Link
                href="/analyze"
                className="px-8 py-3 bg-primary text-white rounded-xl font-semibold cta-btn inline-flex items-center gap-2 mt-6"
              >
                去分析第一场会议 <IconArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* History content */}
          {!loading && history.length > 0 && (
            <>
              {/* Stats Overview Card */}
              <div className="bg-primary/5 rounded-2xl p-6 mb-6 fade-up border border-primary/10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center bg-surface/50 rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                      <IconClipboard size={14} />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {history.length}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      分析总次数
                    </div>
                  </div>
                  <div className="text-center bg-surface/50 rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                      <IconZap size={14} />
                    </div>
                    <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                      {avgScore}
                      {scoreTrend !== null && (
                        <span className={`text-xs font-medium ${scoreTrend >= 0 ? "text-effective" : "text-nonsense"} flex items-center`}>
                          {scoreTrend >= 0 ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                          )}
                          {Math.abs(scoreTrend)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      平均效率分
                    </div>
                  </div>
                  <div className="text-center bg-surface/50 rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                      <IconCheck size={14} />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {totalActionItems}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      行动项总计
                    </div>
                  </div>
                  <div className="text-center bg-surface/50 rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                      <IconAlert size={14} />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {minScore}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      最低效会议
                    </div>
                  </div>
                </div>
              </div>

              {/* Efficiency Trend Chart */}
              {history.length >= 2 && (() => {
                const recentHistory = history.slice(0, 10).reverse(); // last 10, chronological
                const chartW = 600;
                const chartH = 145;
                const padX = 36;
                const padY = 16;
                const padBottom = 22;
                const plotW = chartW - padX * 2;
                const plotH = chartH - padY - padBottom;
                const points = recentHistory.map((item, i) => ({
                  x: padX + (i / Math.max(recentHistory.length - 1, 1)) * plotW,
                  y: padY + plotH - (item.score / 100) * plotH,
                  score: item.score,
                  title: item.meetingTitle,
                  date: item.analyzedAt,
                }));
                const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

                // Gradient color based on average score
                const avg = recentHistory.reduce((s, h) => s + h.score, 0) / recentHistory.length;
                const strokeColor = avg >= 70 ? "var(--effective)" : avg >= 50 ? "var(--repetitive)" : "var(--nonsense)";

                return (
                  <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border mb-6 fade-up">
                    <h2 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                      <IconTrendingUp size={16} className="text-primary" />
                      效率趋势（最近 {recentHistory.length} 次）
                    </h2>
                    <div className="w-full overflow-x-auto">
                      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((val) => {
                          const y = padY + plotH - (val / 100) * plotH;
                          return (
                            <g key={val}>
                              <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="var(--border-light)" strokeWidth="1" />
                              <text x={padX - 6} y={y + 3} textAnchor="end" fill="var(--text-muted)" fontSize="9">{val}</text>
                            </g>
                          );
                        })}
                        {/* Area fill with gradient */}
                        <path d={`${pathD} L ${points[points.length - 1].x} ${padY + plotH} L ${points[0].x} ${padY + plotH} Z`} fill="url(#areaGradient)" />
                        {/* Line */}
                        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Dots with tooltip */}
                        {points.map((p, i) => {
                          const d = new Date(p.date);
                          const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
                          return (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="5" fill="var(--surface)" stroke={strokeColor} strokeWidth="2" className="transition-all duration-200 hover:r-7" style={{ cursor: "pointer" }} />
                              <title>{p.title}: {p.score}分 ({dateLabel})</title>
                              {/* Date label on axis */}
                              <text x={p.x} y={chartH - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                                {i % 2 === 0 || points.length <= 5 ? dateLabel : ""}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                );
              })()}

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5 fade-up">
                {/* Search input */}
                <div className="relative flex-1">
                  <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="搜索会议标题..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="搜索会议标题"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                    >
                      <IconX size={14} />
                    </button>
                  )}
                </div>

                {/* Score filter buttons */}
                <div className="flex items-center gap-1.5">
                  {([
                    { key: "all", label: "全部" },
                    { key: "favorite", label: "收藏" },
                    { key: "high", label: "高效" },
                    { key: "medium", label: "中等" },
                    { key: "low", label: "低效" },
                  ] as const).map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setScoreFilter(f.key)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium filter-btn transition-all ${
                        scoreFilter === f.key
                          ? "bg-primary text-white"
                          : "bg-surface border border-border text-text-secondary hover:bg-border-light"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Export all button */}
                <button
                  onClick={() => {
                    const exportData = filteredHistory.map((item) => ({
                      id: item.id,
                      title: item.meetingTitle,
                      score: item.score,
                      levelLabel: item.levelLabel,
                      breakdown: item.breakdown,
                      actionItemCount: item.actionItemCount,
                      wordCount: item.wordCount,
                      analyzedAt: item.analyzedAt,
                    }));
                    const json = JSON.stringify(exportData, null, 2);
                    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `会议分析历史_${new Date().toISOString().slice(0, 10)}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showToast(`已导出 ${filteredHistory.length} 条记录`, "success");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shrink-0"
                >
                  <IconDownload size={14} /> 导出全部
                </button>
              </div>

              {/* Tag filter */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-text-muted self-center mr-1">标签:</span>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all filter-btn ${
                        selectedTag === tag
                          ? "bg-accent text-white"
                          : "bg-surface border border-border text-text-secondary hover:border-accent"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Empty filter result */}
              {filteredHistory.length === 0 && history.length > 0 && (
                <div className="text-center py-12 fade-up">
                  <p className="text-text-muted text-sm">没有匹配的记录</p>
                  <button
                    onClick={() => { setSearchQuery(""); setScoreFilter("all"); setSelectedTag(""); }}
                    className="text-sm text-primary hover:underline mt-2"
                  >
                    清除筛选条件
                  </button>
                </div>
              )}

              {filteredHistory.map((item, idx) => {
                const total =
                  item.breakdown.effective +
                  item.breakdown.repetitive +
                  item.breakdown.nonsense;
                const effPct =
                  total > 0 ? (item.breakdown.effective / total) * 100 : 0;
                const repPct =
                  total > 0 ? (item.breakdown.repetitive / total) * 100 : 0;
                const nonPct =
                  total > 0 ? (item.breakdown.nonsense / total) * 100 : 0;

                // Min/Max indicators
                const allScores = history.map((h) => h.score);
                const historicalMax = Math.max(...allScores);
                const historicalMin = Math.min(...allScores);
                const isHighest = item.score === historicalMax && history.length > 1;
                const isLowest = item.score === historicalMin && history.length > 1;

                return (
                  <div
                    key={item.id}
                    className={`bg-surface rounded-2xl p-5 shadow-sm mb-4 fade-up interactive-card row-highlight transition-all duration-150 group relative ${
                      highlightedIndex === idx ? "border-2 border-primary ring-2 ring-primary/20" : "border-l-[3px] border-t-0 border-r-0 border-b-0"
                    } ${isHighest ? "border-l-effective" : isLowest ? "border-l-nonsense" : "border-l-border hover:border-l-primary"}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Left: Score badge */}
                      <div className="shrink-0">
                        <div
                          className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${getScoreBgClass(
                            item.score
                          )}`}
                        >
                          <div className="text-2xl font-bold">{item.score}</div>
                          <div className="text-[10px] mt-0.5">
                            {item.levelLabel}
                          </div>
                        </div>
                        {/* Min/Max tag */}
                        {isHighest && (
                          <div className="text-[10px] text-effective font-bold text-center mt-1 flex items-center justify-center gap-0.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                            历史最高
                          </div>
                        )}
                        {isLowest && (
                          <div className="text-[10px] text-nonsense font-bold text-center mt-1 flex items-center justify-center gap-0.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                            历史最低
                          </div>
                        )}
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text truncate">
                          {item.meetingTitle}
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {formatHistoryDate(item.analyzedAt)}
                        </div>
                        <div className="text-xs text-text-muted flex gap-3 mt-1">
                          <span>{item.wordCount}字</span>
                          <span>·</span>
                          <span>{item.actionItemCount}个行动项</span>
                        </div>
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2 mt-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Mini bar chart + actions */}
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <div className="w-[120px] h-2 rounded-full overflow-hidden flex">
                          <div
                            className="bg-effective"
                            style={{ width: `${effPct}%` }}
                          />
                          <div
                            className="bg-repetitive"
                            style={{ width: `${repPct}%` }}
                          />
                          <div
                            className="bg-nonsense"
                            style={{ width: `${nonPct}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                        {/* Tag button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaggingItem(taggingItem === item.id ? null : item.id);
                          }}
                          className="p-1.5 rounded-lg text-text-muted hover:text-accent transition-colors tooltip"
                          data-tooltip="管理标签"
                          aria-label="管理标签"
                          title="管理标签"
                        >
                          <IconTag size={16} />
                        </button>
                        {/* Tag management panel */}
                        {taggingItem === item.id && (
                          <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-xl shadow-lg p-3 z-20 w-48">
                            <p className="text-xs text-text-muted mb-2">选择标签</p>
                            <div className="flex flex-wrap gap-1.5">
                              {PRESET_TAGS.map((tag) => {
                                const isActive = item.tags?.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isActive) {
                                        removeTag(item.id, tag);
                                      } else {
                                        addTag(item.id, tag);
                                      }
                                      setHistory(getHistory());
                                      setAllTags(getAllTags());
                                    }}
                                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                                      isActive
                                        ? "bg-accent text-white"
                                        : "bg-bg border border-border text-text-secondary hover:border-accent"
                                    }`}
                                  >
                                    {tag}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                            // 重新加载历史以反映收藏状态变化
                            setHistory(getHistory());
                          }}
                          className={`tooltip p-1.5 rounded-lg transition-colors ${
                            item.favorite
                              ? "text-amber-500 hover:text-amber-600"
                              : "text-text-muted hover:text-amber-500"
                          }`}
                          aria-label={item.favorite ? "取消收藏" : "收藏"}
                          data-tooltip={item.favorite ? "取消收藏" : "收藏会议"}
                        >
                          <IconStar size={16} fill={item.favorite} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // HistoryItem 未存储原始文本(rawText)，
                            // 因此使用已有的完整分析结果直接跳转到结果页重新查看
                            localStorage.setItem("lastAnalysis", JSON.stringify(item.fullResult));
                            router.push("/result");
                          }}
                          className="tooltip px-3 py-1.5 text-xs text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center"
                          data-tooltip="用相同内容重新分析"
                        >
                          <IconRefresh size={12} className="mr-1" /> 重分析
                        </button>
                        <button
                          onClick={() => viewReport(item)}
                          className="tooltip text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                          data-tooltip="查看详细分析报告"
                        >
                          查看报告 <IconArrowRight size={12} />
                        </button>
                        <Link
                          href="/compare"
                          onClick={(e) => {
                            const existing = JSON.parse(localStorage.getItem("compareItems") || "[]");
                            if (existing.length >= 4) {
                              e.preventDefault();
                              showToast("最多对比 4 场会议", "info");
                              return;
                            }
                            if (existing.find((c: { id: string }) => c.id === item.id)) {
                              e.preventDefault();
                              showToast("该会议已在对比列表中", "info");
                              return;
                            }
                            existing.push({
                              id: item.id,
                              title: item.meetingTitle,
                              score: item.score,
                              levelLabel: item.levelLabel,
                              breakdown: item.breakdown,
                              sentenceCount: 0,
                              actionItemCount: item.actionItemCount,
                              wordCount: item.wordCount,
                              participantCount: 0,
                              duration: "",
                              analyzedAt: item.analyzedAt,
                            });
                            localStorage.setItem("compareItems", JSON.stringify(existing));
                          }}
                          className="tooltip inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-all"
                          data-tooltip="加入对比列表"
                        >
                          <IconChart size={12} /> 对比
                        </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear All button */}
              <button
                onClick={() => setShowConfirm(true)}
                className="text-sm text-nonsense hover:text-nonsense/80 transition-colors mt-4 mx-auto block"
              >
                <span className="inline-flex items-center gap-1.5"><IconTrash size={14} /> 清除所有记录</span>
              </button>
            </>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirm(false);
          }}
        >
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-text">确认清除</h3>
            <p className="text-sm text-text-secondary mt-2">
              将删除所有分析历史记录，此操作不可恢复
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg bg-bg text-text-secondary font-medium hover:bg-border-light transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setHistory([]);
                  setShowConfirm(false);
                  showToast("历史记录已清除", "success");
                }}
                className="flex-1 py-2.5 rounded-lg bg-nonsense text-white font-medium hover:bg-nonsense/90 transition-colors"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function ComparePrompt() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const items = JSON.parse(localStorage.getItem("compareItems") || "[]");
        setCount(items.length);
      } catch { /* ignore */ }
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 mt-4 fade-up">
      <IconChart size={16} className="text-primary shrink-0" />
      <p className="text-sm text-text flex-1">
        已选择 <strong className="text-primary">{count}</strong> 场会议进行对比
      </p>
      <Link href="/compare" className="text-sm text-primary font-medium hover:underline">
        查看对比
      </Link>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats overview skeleton */}
      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center bg-surface/50 rounded-xl p-3">
              <div className="skeleton h-8 w-12 mx-auto mb-2" />
              <div className="skeleton h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
      {/* History card skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface rounded-2xl p-5 border-l-[3px] border-l-border">
          <div className="flex items-center gap-4">
            <div className="skeleton w-16 h-16 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-3 w-32" />
              <div className="skeleton h-3 w-24" />
            </div>
            <div className="skeleton w-[120px] h-2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
