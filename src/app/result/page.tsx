"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useFadeUp } from "@/hooks/useFadeUp";
import { useCountUp } from "@/hooks/useCountUp";
import { useState, useEffect, useCallback, Suspense } from "react";
import type { AnalysisResult, ActionItem } from "@/types/analysis";
import { useToast } from "@/components/ToastProvider";
import { normalizeBreakdown } from "@/lib/history";
import {
  IconArrowRight, IconInbox, IconAlert,
} from "@/components/Icon";
import Confetti from "@/components/Confetti";

/* ─── Sub-components (static: above-the-fold) ─── */
import ResultSkeleton from "@/components/result/ResultSkeleton";
import ReportHeader from "@/components/result/ReportHeader";
import ScoreCards from "@/components/result/ScoreCards";
import DonutChart from "@/components/result/DonutChart";
import SentenceList from "@/components/result/SentenceList";

/* ─── Sub-components (lazy: below-the-fold) ─── */
const SpeakerRanking = dynamic(() => import("@/components/result/SpeakerRanking"), { ssr: false });
const ActionItems = dynamic(() => import("@/components/result/ActionItems"), { ssr: false });
const MeetingSummary = dynamic(() => import("@/components/result/MeetingSummary"), { ssr: false });
const ExportActions = dynamic(() => import("@/components/result/ExportActions"), { ssr: false });

/* ─── Helpers ─── */
import { getScoreRawColor, computeSpeakerStats, computeDeepInsights } from "@/components/result/helpers";
import type { FilterKey } from "@/components/result/helpers";

/* ─── Lazy loading fallback ─── */
const LazyFallback = () => (
  <div className="bg-surface rounded-2xl p-6 border border-border mb-6">
    <div className="skeleton h-6 w-40 mb-4" />
    <div className="skeleton h-4 w-full mb-2" />
    <div className="skeleton h-4 w-3/4" />
  </div>
);

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

  /* copy report (sets copied state for ExportActions) */
  const handleCopy = useCallback(() => {
    setCopied(true);
    showToast("报告已复制到剪贴板", "success");
    setTimeout(() => setCopied(false), 2000);
  }, [showToast]);

  /* share report */
  const handleShare = useCallback(() => {
    if (!result) return;
    const bd2 = result.breakdown ?? { effective: 0, repetitive: 0, nonsense: 0 };
    const shareText = [
      "┌──────────────────────────────────┐",
      "│        会议效率报告              │",
      "│                                  │",
      `│  ${result.meetingTitle.padEnd(28)}│`,
      `│  效率评分: ${result.score}分 (${result.levelLabel.padEnd(4)})        │`,
      `│  有效 ${String(bd2.effective).padStart(2)}% | 重复 ${String(bd2.repetitive).padStart(2)}% | 废话 ${String(bd2.nonsense).padStart(2)}%  │`,
      `│  ${String(result.sentences.length).padStart(2)}句分析 | ${String(result.actionItems.length).padStart(2)}个行动项          │`,
      "│                                  │",
      "│  由「会议废话检测器」AI 生成      │",
      "└──────────────────────────────────┘",
    ].join("\n");

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

  /* add action item */
  const handleAddAction = useCallback((item: ActionItem) => {
    setResult(prev => prev ? {
      ...prev,
      actionItems: [...prev.actionItems, item],
    } : null);
  }, []);

  /* ─── loading state (skeleton) ─── */
  if (loading) {
    return <ResultSkeleton />;
  }

  /* ─── empty state ─── */
  if (!result) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
            <div className="mb-8">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-4" fill="none">
                {/* Document outline */}
                <rect x="30" y="15" width="60" height="80" rx="8" stroke="var(--border)" strokeWidth="2" fill="var(--surface)" />
                {/* Magnifying glass */}
                <circle cx="65" cy="50" r="15" stroke="var(--primary)" strokeWidth="2.5" opacity="0.6" />
                <line x1="75" y1="60" x2="85" y2="70" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                {/* Decorative dots */}
                <circle cx="45" cy="80" r="2" fill="var(--effective)" opacity="0.5" />
                <circle cx="55" cy="85" r="2" fill="var(--nonsense)" opacity="0.5" />
                <circle cx="65" cy="80" r="2" fill="var(--repetitive)" opacity="0.5" />
                {/* Question mark */}
                <text x="65" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fill="var(--primary)" opacity="0.6">?</text>
              </svg>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">
                还没有分析结果
              </h1>
              <p className="text-text-secondary mt-3 max-w-sm mx-auto">
                粘贴一场会议的内容，AI 将为你生成详细的效率分析报告
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
  const bd = result.breakdown ?? { effective: 0, repetitive: 0, nonsense: 0 };
  const isHighScore = score >= 80;

  /* speaker efficiency aggregation */
  const speakerStats = computeSpeakerStats(result);

  /* deep insights */
  const deepInsights = computeDeepInsights(result);

  return (
    <>
      <Navbar />
      {isHighScore && <Confetti active={true} />}
      <main className="pt-24 pb-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">

          {/* Region 1: Report Header */}
          <ReportHeader result={result} handleShare={handleShare} shared={shared} />

          {/* Region 2: Core Metric Cards */}
          <ScoreCards
            score={score}
            level={result.level}
            levelLabel={result.levelLabel}
            animScore={animScore}
            animEffective={animEffective}
            animRepetitive={animRepetitive}
            animNonsense={animNonsense}
            mounted={mounted}
            className={isHighScore ? "score-celebrate" : ""}
          />

          {/* Region 3: Content Structure Analysis */}
          <DonutChart
            score={score}
            breakdown={bd}
            mounted={mounted}
            scoreColor={scoreColor}
          />

          {/* Region 4: Sentence-by-Sentence Analysis */}
          {result.sentences.length > 0 ? (
            <SentenceList
              sentences={result.sentences}
              filter={filter}
              setFilter={setFilter}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          ) : (
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up text-center">
              <IconAlert size={20} className="text-text-muted mx-auto mb-2 block" />
              <p className="text-text-muted">AI 未能完成逐句分析</p>
            </div>
          )}

          {/* Speaker Ranking */}
          <Suspense fallback={<LazyFallback />}>
            <SpeakerRanking speakerStats={speakerStats ?? []} />
          </Suspense>

          {/* Region 5: Action Items */}
          <Suspense fallback={<LazyFallback />}>
            <ActionItems
              actionItems={result.actionItems}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              onAddAction={handleAddAction}
              showToast={showToast}
            />
          </Suspense>

          {/* Region 6: Summary & Suggestions */}
          <Suspense fallback={<LazyFallback />}>
            <MeetingSummary
              summary={result.summary}
              keyDecisions={result.keyDecisions}
              suggestions={result.suggestions}
              deepInsights={deepInsights}
            />
          </Suspense>

          {/* Region 7: Bottom Actions */}
          <Suspense fallback={<LazyFallback />}>
            <ExportActions
              result={result}
              copied={copied}
              shared={shared}
              showToast={showToast}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}
