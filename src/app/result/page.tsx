"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useFadeUp } from "@/hooks/useFadeUp";
import { useCountUp } from "@/hooks/useCountUp";
import { useState, useEffect, useCallback } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { useToast } from "@/components/ToastProvider";
import { normalizeBreakdown } from "@/lib/history";
import { downloadMarkdown } from "@/lib/export";
import {
  IconArrowLeft, IconArrowRight, IconPin, IconClock, IconUsers, IconFileText,
  IconTrendingUp, IconCheckCircle, IconCheck, IconLightbulb,
  IconShare, IconCopy, IconRefresh, IconCalendar, IconUser,
  IconBook, IconLayers, IconAlert, IconInbox, IconClipboard,
  IconSearch, IconChart, IconDot, IconChevronUp, IconChevronDown,
  IconDownload
} from "@/components/Icon";

/* ─── helpers ─── */

function getScoreBarColor(score: number): string {
  if (score >= 90) return "bg-effective";
  if (score >= 70) return "bg-primary";
  if (score >= 50) return "bg-repetitive";
  return "bg-nonsense";
}

function getScoreTextColor(score: number): string {
  if (score >= 90) return "text-effective";
  if (score >= 70) return "text-primary";
  if (score >= 50) return "text-repetitive";
  return "text-nonsense";
}

function getScoreRawColor(score: number): string {
  if (score >= 90) return "var(--color-effective)";
  if (score >= 70) return "var(--color-primary)";
  if (score >= 50) return "var(--color-repetitive)";
  return "var(--color-nonsense)";
}

const levelBgs: Record<string, string> = {
  excellent: "bg-effective-bg",
  good: "bg-primary/10",
  fair: "bg-repetitive-bg",
  poor: "bg-nonsense-bg",
};

const levelTextColors: Record<string, string> = {
  excellent: "text-effective",
  good: "text-primary",
  fair: "text-repetitive",
  poor: "text-nonsense",
};

const priorityLabels: Record<string, string> = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
};

const priorityBgs: Record<string, string> = {
  high: "bg-nonsense-bg text-nonsense",
  medium: "bg-repetitive-bg text-repetitive",
  low: "bg-effective-bg text-effective",
};

const filterButtons = [
  { key: "all", label: "全部" },
  { key: "effective", label: "有效" },
  { key: "repetitive", label: "重复" },
  { key: "nonsense", label: "废话" },
] as const;

type FilterKey = "all" | "effective" | "repetitive" | "nonsense";

function getFilterActiveClass(key: FilterKey): string {
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

function getTypeBorderClass(type: string): string {
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

function getTypeBadgeClass(type: string): string {
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

function formatAnalyzedAt(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}年${m}月${day}日 ${h}:${min}`;
}

/* ─── page component ─── */

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showAll, setShowAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useFadeUp();
  const { showToast } = useToast();

  /* count-up values — must be called unconditionally (before any early returns) */
  const animScore = useCountUp(result?.score ?? 0, 1000, 200);
  const animEffective = useCountUp(result?.breakdown?.effective ?? 0, 1000, 300);
  const animRepetitive = useCountUp(result?.breakdown?.repetitive ?? 0, 1000, 400);
  const animNonsense = useCountUp(result?.breakdown?.nonsense ?? 0, 1000, 500);

  /* load data — runs only on client after hydration */
  useEffect(() => {
    let settled = false;
    try {
      const stored = localStorage.getItem("lastAnalysis");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.breakdown) {
          parsed.breakdown = normalizeBreakdown(parsed.breakdown);
        }
        if (!settled) setResult(parsed);
      }
    } catch {
      // ignore parse errors
    }
    if (!settled) setLoading(false);
    return () => { settled = true; };
  }, []);

  /* mount trigger for chart / progress bar animations */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* sentence filter + pagination */
  const filteredSentences = result
    ? result.sentences.filter(
        (s) => filter === "all" || s.type === filter,
      )
    : [];

  const displayedSentences = showAll
    ? filteredSentences
    : filteredSentences.slice(0, 20);
  const remainingCount = filteredSentences.length - 20;

  /* action item toggle */
  const toggleCheck = useCallback((id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  /* copy report */
  const handleCopy = useCallback(() => {
    if (!result) return;
    const lines: string[] = [];
    lines.push(`[会议效率报告] - ${result.meetingTitle}`);
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push(
      `效率评分：${result.score}分（${result.levelLabel}）`,
    );
    lines.push(
      `有效信息：${result.breakdown.effective}% | 重复内容：${result.breakdown.repetitive}% | 废话占比：${result.breakdown.nonsense}%`,
    );
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push("行动项：");
    result.actionItems.forEach((item) => {
      lines.push(
        `• ${item.content} (@${item.assignee}, ${item.deadline})`,
      );
    });
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push("改进建议：");
    result.suggestions.forEach((s, i) => {
      lines.push(`${i + 1}. ${s}`);
    });
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      showToast("报告已复制到剪贴板", "success");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, showToast]);

  /* share report */
  const handleShare = useCallback(() => {
    if (!result) return;
    const shareText = `[会议效率报告] - ${result.meetingTitle}\n效率评分：${result.score}分（${result.levelLabel}）\n有效信息：${result.breakdown.effective}% | 重复：${result.breakdown.repetitive}% | 废话：${result.breakdown.nonsense}%`;

    if (navigator.share) {
      navigator.share({
        title: "会议效率报告",
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // User cancelled share, do nothing
      });
    } else {
      navigator.clipboard.writeText(shareText + "\n" + window.location.href).then(() => {
        setShared(true);
        showToast("报告链接已复制", "success");
        setTimeout(() => setShared(false), 2000);
      });
    }
  }, [result, showToast]);

  /* export report as Markdown */
  const handleExport = useCallback(() => {
    if (!result) return;
    try {
      downloadMarkdown(result);
      showToast("报告已导出为 Markdown", "success");
    } catch {
      showToast("导出失败，请重试", "error");
    }
  }, [result, showToast]);

  /* print report */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /* donut chart math */
  const RADIUS = 80;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~502.65
  const effectiveLen = result ? CIRCUMFERENCE * (result.breakdown.effective / 100) : 0;
  const repetitiveLen = result ? CIRCUMFERENCE * (result.breakdown.repetitive / 100) : 0;
  const nonsenseLen = result ? CIRCUMFERENCE * (result.breakdown.nonsense / 100) : 0;

  /* ─── loading state ─── */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-border-light" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        </main>
      </>
    );
  }

  /* ─── empty state ─── */
  if (!result) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
            <div className="mb-8">
              <div className="mb-4">
                <IconInbox size={48} className="text-text-muted mx-auto" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
                还没有分析结果
              </h1>
              <p className="text-text-secondary mt-3">
                请先去分析一场会议内容
              </p>
            </div>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-semibold cta-btn"
            >
              开始分析 <IconArrowRight size={16} />
            </Link>
          </div>
        </main>
      </>
    );
  }

  const score = result.score;
  const scoreColor = getScoreRawColor(score);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">

          {/* ═══════════════════════════════════════════
              Region 1: Report Header
          ═══════════════════════════════════════════ */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
            {/* top row */}
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/analyze"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <IconArrowLeft size={14} /> 返回分析
              </Link>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  {shared ? (<><IconCheck size={14} /> 已分享</>) : (<><IconShare size={14} /> 分享结果</>)}
                </button>
                <span className="text-sm text-text-muted">
                  {formatAnalyzedAt(result.analyzedAt)}
                </span>
              </div>
            </div>
            {/* title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text mt-4">
              <IconChart size={24} className="inline text-primary mr-2" />
              会议效率报告
            </h1>
            {/* info row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1"><IconPin size={14} className="text-text-muted" />会议主题：{result.meetingTitle}</span>
              <span className="flex items-center gap-1"><IconClock size={14} className="text-text-muted" />时长：{result.duration}</span>
              <span className="flex items-center gap-1"><IconUsers size={14} className="text-text-muted" />参会人数：{result.participantCount} 人</span>
              <span className="flex items-center gap-1"><IconFileText size={14} className="text-text-muted" />文字量：{result.wordCount} 字</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Region 2: Core Metric Cards
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Card 1 — Efficiency Score */}
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up">
              <div className={`h-1 -mx-6 -mt-6 mb-4 ${getScoreBarColor(score)}`} />
              <div className={`text-5xl font-extrabold ${getScoreTextColor(score)}`}>
                {animScore}
              </div>
              <div className="mt-2">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-semibold ${levelBgs[result.level]} ${levelTextColors[result.level]}`}
                >
                  {result.levelLabel}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-2">效率评分</p>
            </div>

            {/* Card 2 — Effective */}
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up">
              <div className="h-1 -mx-6 -mt-6 mb-4 bg-effective" />
              <div className="text-5xl font-extrabold text-effective">
                {animEffective}%
              </div>
              <p className="text-sm text-text-secondary mt-3">有效信息占比</p>
            </div>

            {/* Card 3 — Repetitive */}
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up">
              <div className="h-1 -mx-6 -mt-6 mb-4 bg-repetitive" />
              <div className="text-5xl font-extrabold text-repetitive">
                {animRepetitive}%
              </div>
              <p className="text-sm text-text-secondary mt-3">重复内容占比</p>
            </div>

            {/* Card 4 — Nonsense */}
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up">
              <div className="h-1 -mx-6 -mt-6 mb-4 bg-nonsense" />
              <div className="text-5xl font-extrabold text-nonsense">
                {animNonsense}%
              </div>
              <p className="text-sm text-text-secondary mt-3">废话/跑题占比</p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Region 3: Content Structure Analysis
          ═══════════════════════════════════════════ */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
            <h2 className="text-lg font-bold text-text mb-6">
              <IconTrendingUp size={20} className="inline mr-2 text-primary" />
              内容结构分析
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left — SVG Donut Chart */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-[200px] h-[200px]">
                  <svg viewBox="0 0 200 200" width="200" height="200">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-border-light)"
                      strokeWidth="20"
                    />

                    {/* Effective segment */}
                    <circle
                      cx="100"
                      cy="100"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-effective)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray={`${effectiveLen} ${CIRCUMFERENCE - effectiveLen}`}
                      strokeDashoffset={mounted ? 0 : CIRCUMFERENCE}
                      transform="rotate(-90 100 100)"
                      style={{
                        transition:
                          "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />

                    {/* Repetitive segment */}
                    <circle
                      cx="100"
                      cy="100"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-repetitive)"
                      strokeWidth="20"
                      strokeLinecap="butt"
                      strokeDasharray={`${repetitiveLen} ${CIRCUMFERENCE - repetitiveLen}`}
                      strokeDashoffset={mounted ? -(effectiveLen) : CIRCUMFERENCE}
                      transform="rotate(-90 100 100)"
                      style={{
                        transition:
                          "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />

                    {/* Nonsense segment */}
                    <circle
                      cx="100"
                      cy="100"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-nonsense)"
                      strokeWidth="20"
                      strokeLinecap="butt"
                      strokeDasharray={`${nonsenseLen} ${CIRCUMFERENCE - nonsenseLen}`}
                      strokeDashoffset={mounted ? -(effectiveLen + repetitiveLen) : CIRCUMFERENCE}
                      transform="rotate(-90 100 100)"
                      style={{
                        transition:
                          "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />

                    {/* Center text */}
                    <text
                      x="100"
                      y="92"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="36"
                      fontWeight="bold"
                      fill={scoreColor}
                    >
                      {score}
                    </text>
                    <text
                      x="100"
                      y="120"
                      textAnchor="middle"
                      fontSize="13"
                      fill="var(--color-text-secondary)"
                    >
                      效率评分
                    </text>
                  </svg>
                </div>
              </div>

              {/* Right — Progress Bars */}
              <div className="lg:w-1/2 flex flex-col justify-center gap-6">

                {/* Effective progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-effective inline-block" />
                      <span className="text-sm font-medium text-text">有效信息</span>
                    </div>
                    <span className="text-sm font-semibold text-effective">
                      {result.breakdown.effective}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-border-light overflow-hidden">
                    <div
                      className="h-full rounded-full bg-effective transition-all duration-1000 ease-out"
                      style={{
                        width: mounted ? `${result.breakdown.effective}%` : "0%",
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    包含具体数据、明确结论、新信息
                  </p>
                </div>

                {/* Repetitive progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-repetitive inline-block" />
                      <span className="text-sm font-medium text-text">重复内容</span>
                    </div>
                    <span className="text-sm font-semibold text-repetitive">
                      {result.breakdown.repetitive}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-border-light overflow-hidden">
                    <div
                      className="h-full rounded-full bg-repetitive transition-all duration-1000 ease-out"
                      style={{
                        width: mounted ? `${result.breakdown.repetitive}%` : "0%",
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    与前文语义重复的发言
                  </p>
                </div>

                {/* Nonsense progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-nonsense inline-block" />
                      <span className="text-sm font-medium text-text">废话/跑题</span>
                    </div>
                    <span className="text-sm font-semibold text-nonsense">
                      {result.breakdown.nonsense}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-border-light overflow-hidden">
                    <div
                      className="h-full rounded-full bg-nonsense transition-all duration-1000 ease-out"
                      style={{
                        width: mounted ? `${result.breakdown.nonsense}%` : "0%",
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    语气词堆砌、空洞表态、跑题闲聊
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Region 4: Sentence-by-Sentence Analysis
          ═══════════════════════════════════════════ */}
          {result.sentences.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
              <h2 className="text-lg font-bold text-text">
                <IconSearch size={20} className="inline mr-2 text-primary" />
                逐句分析详情
              </h2>

              {/* Filter bar */}
              <div className="flex flex-wrap items-center gap-2 mt-4 mb-4">
                {filterButtons.map((btn) => {
                  const isActive = filter === btn.key;
                  return (
                    <button
                      key={btn.key}
                      onClick={() => {
                        setFilter(btn.key);
                        setShowAll(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer ${
                        isActive
                          ? getFilterActiveClass(btn.key)
                          : "border-transparent text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {btn.key === "all" && "全部"}
                      {btn.key === "effective" && (<span className="inline-flex items-center gap-1"><IconDot size={10} className="text-effective" />有效</span>)}
                      {btn.key === "repetitive" && (<span className="inline-flex items-center gap-1"><IconDot size={10} className="text-repetitive" />重复</span>)}
                      {btn.key === "nonsense" && (<span className="inline-flex items-center gap-1"><IconDot size={10} className="text-nonsense" />废话</span>)}
                    </button>
                  );
                })}
                <span className="text-sm text-text-muted ml-auto">
                  共 {filteredSentences.length} 条
                </span>
              </div>

              {/* Sentence statistics */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-text-muted bg-bg rounded-lg px-3 py-2">
                <span>共分析 <strong className="text-text">{result.sentences.length}</strong> 句</span>
                <span>其中有效 <strong className="text-effective">{result.sentences.filter(s => s.type === 'effective').length}</strong> 句 ({result.sentences.length > 0 ? Math.round(result.sentences.filter(s => s.type === 'effective').length / result.sentences.length * 100) : 0}%)</span>
                <span>重复 <strong className="text-repetitive">{result.sentences.filter(s => s.type === 'repetitive').length}</strong> 句 ({result.sentences.length > 0 ? Math.round(result.sentences.filter(s => s.type === 'repetitive').length / result.sentences.length * 100) : 0}%)</span>
                <span>废话 <strong className="text-nonsense">{result.sentences.filter(s => s.type === 'nonsense').length}</strong> 句 ({result.sentences.length > 0 ? Math.round(result.sentences.filter(s => s.type === 'nonsense').length / result.sentences.length * 100) : 0}%)</span>
              </div>

              {/* Sentence list */}
              <div>
                {displayedSentences.map((s, i) => {
                  const isNonsense = s.type === "nonsense";
                  const effectiveFillWidth = `${Math.round(s.confidence * 100)}%`;

                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border-l-4 mb-3 transition-all duration-300 ${
                        getTypeBorderClass(s.type)
                      } ${isNonsense ? "bg-nonsense-bg" : "bg-surface"}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                        {/* speaker badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          {s.speaker && (
                            <span className="text-xs px-2 py-0.5 rounded bg-bg text-text-muted whitespace-nowrap">
                              {s.speaker}
                            </span>
                          )}
                        </div>

                        {/* text content */}
                        <p
                          className={`flex-1 text-sm leading-relaxed ${
                            isNonsense
                              ? "text-text-muted line-through decoration-nonsense/60"
                              : s.type === "effective"
                                ? "text-text font-medium"
                                : "text-text"
                          }`}
                        >
                          {s.text}
                        </p>

                        {/* right side info */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {/* type badge */}
                          <span
                            className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${getTypeBadgeClass(s.type)}`}
                          >
                            {s.type === "effective"
                              ? "有效"
                              : s.type === "repetitive"
                                ? "重复"
                                : "废话"}
                          </span>

                          {/* confidence bar */}
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 rounded-full bg-border-light overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${
                                  s.type === "effective"
                                    ? "bg-effective"
                                    : s.type === "repetitive"
                                      ? "bg-repetitive"
                                      : "bg-nonsense"
                                }`}
                                style={{ width: effectiveFillWidth }}
                              />
                            </div>
                            <span className="text-xs text-text-muted w-8 text-right">
                              {Math.round(s.confidence * 100)}%
                            </span>
                          </div>

                          {/* reason */}
                          <p className="text-xs text-text-muted max-w-[200px] text-right">
                            {s.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show more / less */}
              {filteredSentences.length > 20 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    {showAll ? (
                      <span className="inline-flex items-center gap-1">收起 <IconChevronUp size={14} /></span>
                    ) : (
                      <span className="inline-flex items-center gap-1">展开更多 ({remainingCount} 条) <IconChevronDown size={14} /></span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {result.sentences.length === 0 && (
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up text-center">
              <IconAlert size={20} className="text-text-muted mx-auto mb-2 block" />
              <p className="text-text-muted">AI 未能完成逐句分析</p>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              Region 5: Action Items
          ═══════════════════════════════════════════ */}
          {result.actionItems.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-text">
                  <IconCheckCircle size={20} className="inline mr-2 text-primary" />
                  行动项清单
                </h2>
                <span className="text-sm bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                  {result.actionItems.length}
                </span>
              </div>

              <div>
                {result.actionItems.map((item) => {
                  const checked = checkedItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border mb-3 transition-all ${
                        checked
                          ? "border-effective/30 bg-effective-bg/50"
                          : "border-border hover:border-border-light"
                      }`}
                    >
                      {/* checkbox */}
                      <button
                        onClick={() => toggleCheck(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 mt-0.5 ${
                          checked
                            ? "bg-effective border-effective"
                            : "border-border hover:border-primary"
                        }`}
                        aria-label={
                          checked ? "取消完成" : "标记完成"
                        }
                      >
                        {checked && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M3 7l3 3 5-5"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium transition-all ${
                            checked
                              ? "line-through text-text-muted"
                              : "text-text"
                          }`}
                        >
                          {item.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-2 py-0.5 rounded">
                            <IconUser size={12} className="text-primary" />
                            {item.assignee}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs bg-bg text-text-secondary px-2 py-0.5 rounded">
                            <IconCalendar size={12} className="text-text-muted" />
                            {item.deadline}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${priorityBgs[item.priority]}`}
                          >
                            {priorityLabels[item.priority]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-text-muted mt-4 text-right">
                共 {result.actionItems.length} 项，已完成{" "}
                {checkedItems.size} 项
              </p>
            </div>
          )}

          {result.actionItems.length === 0 && (
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up text-center">
              <IconAlert size={20} className="text-text-muted mx-auto mb-2 block" />
              <p className="text-text-muted">未识别到明确的行动项</p>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              Region 6: Summary & Suggestions
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Left — Summary */}
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border fade-up">
              <h2 className="text-lg font-bold text-text mb-4">
                <IconBook size={20} className="inline mr-2 text-primary" />
                会议摘要
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {result.summary}
              </p>

              {result.keyDecisions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-text mb-3">
                    关键决策
                  </h3>
                  <ul>
                    {result.keyDecisions.map((decision, i) => (
                      <li
                        key={i}
                        className="text-text-secondary text-sm mb-2 flex items-start gap-1.5"
                      >
                        <IconCheck size={12} className="text-primary shrink-0 mt-0.5" />
                        {decision}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right — Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border fade-up">
                <h2 className="text-lg font-bold text-text mb-4">
                  <IconLightbulb size={20} className="inline mr-2 text-primary" />
                  改进建议
                </h2>
                <div>
                  {result.suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-3 last:mb-0"
                    >
                      <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-text">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════
              Region 7: Bottom Actions
          ═══════════════════════════════════════════ */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 mb-8 fade-up">
            {/* Copy Report */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              {copied ? (<><IconCheck size={16} /> 已复制</>) : (<><IconCopy size={16} /> 复制报告</>)}
            </button>

            {/* Export as Markdown */}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <IconDownload size={16} />
              导出报告
            </button>

            {/* Print Report */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              打印报告
            </button>

            {/* Re-analyze */}
            <Link
              href="/analyze"
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold cta-btn inline-flex items-center gap-2"
            >
              <IconRefresh size={16} />
              重新分析
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
