"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useFadeUp } from "@/hooks/useFadeUp";
import { getHistory, formatHistoryDate, getScoreBgClass } from "@/lib/history";
import type { HistoryItem } from "@/lib/history";
import type { ContentType, SentenceAnalysis } from "@/types/analysis";
import { IconTrophy, IconAlert, IconArrowRight } from "@/components/Icon";

/* ─── Types ─── */

interface StatsSummary {
  totalAnalyses: number;
  avgScore: number;
  totalSentences: number;
  totalActionItems: number;
}

interface ScoreBucket {
  label: string;
  min: number;
  max: number;
  count: number;
}

interface TrendPoint {
  label: string;
  nonsenseRate: number;
}

interface TypeDistribution {
  type: ContentType;
  label: string;
  count: number;
}

interface RankedMeeting {
  rank: number;
  title: string;
  score: number;
  levelLabel: string;
  analyzedAt: string;
  actionItemCount: number;
}

/* ─── Utility ─── */

const TYPE_LABELS: Record<ContentType, string> = {
  effective: "有效内容",
  repetitive: "重复内容",
  nonsense: "废话内容",
};

const TYPE_COLORS: Record<ContentType, string> = {
  effective: "var(--color-effective)",
  repetitive: "var(--color-repetitive)",
  nonsense: "var(--color-nonsense)",
};

/* ─── Sub-components: SVG Charts ─── */

function BarChart({ buckets }: { buckets: ScoreBucket[] }) {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const barWidth = 48;
  const gap = 24;
  const chartWidth = buckets.length * (barWidth + gap) - gap;
  const chartHeight = 200;
  const topPad = 30;

  return (
    <svg
      viewBox={`0 0 ${chartWidth + 40} ${chartHeight + topPad + 20}`}
      className="w-full"
      style={{ maxHeight: 280 }}
    >
      {/* Y-axis guide lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = chartHeight * (1 - ratio) + topPad;
        const val = Math.round(maxCount * ratio);
        return (
          <g key={ratio}>
            <line
              x1={30}
              y1={y}
              x2={chartWidth + 30}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={26}
              y={y + 4}
              textAnchor="end"
              fill="var(--color-text-muted)"
              fontSize={11}
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {buckets.map((bucket, i) => {
        const x = 30 + i * (barWidth + gap);
        const barH = maxCount > 0 ? (bucket.count / maxCount) * chartHeight : 0;
        const y = chartHeight - barH + topPad;
        const fillColor =
          bucket.max <= 40
            ? "var(--color-effective)"
            : bucket.max <= 60
              ? "var(--color-primary)"
              : bucket.max <= 80
                ? "var(--color-repetitive)"
                : "var(--color-nonsense)";

        return (
          <g key={bucket.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barH, 2)}
              rx={6}
              ry={6}
              fill={fillColor}
              opacity={0.85}
              className="chart-bar-animated"
            />
            {/* Count on top */}
            {bucket.count > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fill="var(--color-text)"
                fontSize={12}
                fontWeight={600}
              >
                {bucket.count}
              </text>
            )}
            {/* Label */}
            <text
              x={x + barWidth / 2}
              y={chartHeight + topPad + 16}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize={11}
            >
              {bucket.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TrendLine({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) {
    return (
      <p className="text-sm text-text-muted text-center py-8">暂无趋势数据</p>
    );
  }

  const chartWidth = 400;
  const chartHeight = 180;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const innerW = chartWidth - padL - padR;
  const innerH = chartHeight - padT - padB;

  const minVal = 0;
  const maxVal = 100;

  const coords = points.map((p, i) => ({
    x: padL + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW),
    y: padT + innerH - ((p.nonsenseRate - minVal) / (maxVal - minVal)) * innerH,
    ...p,
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="w-full"
      style={{ maxHeight: 260 }}
    >
      {/* Y-axis guide lines */}
      {[0, 25, 50, 75, 100].map((val) => {
        const y = padT + innerH - ((val - minVal) / (maxVal - minVal)) * innerH;
        return (
          <g key={val}>
            <line
              x1={padL}
              y1={y}
              x2={chartWidth - padR}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={padL - 6}
              y={y + 4}
              textAnchor="end"
              fill="var(--color-text-muted)"
              fontSize={11}
            >
              {val}%
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path
        d={`${linePath} L ${coords[coords.length - 1].x} ${padT + innerH} L ${coords[0].x} ${padT + innerH} Z`}
        fill="var(--color-nonsense)"
        opacity={0.1}
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="var(--color-nonsense)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chart-line-animated"
      />

      {/* Data points + labels */}
      {coords.map((c, i) => (
        <g key={i}>
          <circle
            cx={c.x}
            cy={c.y}
            r={4}
            fill="var(--color-nonsense)"
            stroke="var(--color-surface)"
            strokeWidth={2}
            className="chart-dot-animated"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          />
          {c.nonsenseRate > 0 && (
            <text
              x={c.x}
              y={c.y - 10}
              textAnchor="middle"
              fill="var(--color-text)"
              fontSize={10}
              fontWeight={600}
            >
              {Math.round(c.nonsenseRate)}%
            </text>
          )}
          <text
            x={c.x}
            y={chartHeight - 8}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize={9}
            transform={points.length > 6 ? `rotate(-35 ${c.x} ${chartHeight - 8})` : undefined}
          >
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PieChart({ distribution }: { distribution: TypeDistribution[] }) {
  const total = distribution.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return <p className="text-sm text-text-muted text-center py-4">暂无数据</p>;
  }

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;

  let currentAngle = -Math.PI / 2;
  const slices = distribution
    .filter((d) => d.count > 0)
    .map((d) => {
      const angle = (d.count / total) * Math.PI * 2;
      const slice = {
        ...d,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        percentage: Math.round((d.count / total) * 100),
      };
      currentAngle += angle;
      return slice;
    });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-40 h-40 shrink-0">
        {slices.map((s, i) => {
          const x1 = cx + r * Math.cos(s.startAngle);
          const y1 = cy + r * Math.sin(s.startAngle);
          const x2 = cx + r * Math.cos(s.endAngle);
          const y2 = cy + r * Math.sin(s.endAngle);
          const largeArc = s.endAngle - s.startAngle > Math.PI ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={TYPE_COLORS[s.type]}
              opacity={0.85}
              stroke="var(--color-surface)"
              strokeWidth={2}
              className="chart-pie-animated"
            />
          );
        })}
      </svg>
      <div className="flex flex-col gap-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: TYPE_COLORS[s.type] }}
            />
            <span className="text-text-secondary">
              {TYPE_LABELS[s.type]}
            </span>
            <span className="text-text font-medium">{s.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankedCard({
  meeting,
  icon,
  variant,
}: {
  meeting: RankedMeeting;
  icon: React.ReactNode;
  variant: "best" | "worst";
}) {
  const bgClass =
    variant === "best"
      ? "border-l-4 border-l-effective"
      : "border-l-4 border-l-nonsense";

  return (
    <div className={`filter-item bg-surface rounded-xl p-4 border border-border ${bgClass} flex items-start gap-3`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text truncate text-sm">{meeting.title}</p>
        <p className="text-xs text-text-muted mt-1">
          {formatHistoryDate(meeting.analyzedAt)} &middot; {meeting.actionItemCount} 个行动项
        </p>
      </div>
      <span className={`text-lg font-bold shrink-0 ${getScoreBgClass(meeting.score)} px-2.5 py-0.5 rounded-lg`}>
        {meeting.score}
      </span>
    </div>
  );
}

/* ─── Main Page ─── */

export default function StatsPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useFadeUp();

  useEffect(() => {
    const data = getHistory();
    setHistory(data);
    setMounted(true);
  }, []);

  const summary = useMemo<StatsSummary>(() => {
    if (history.length === 0)
      return { totalAnalyses: 0, avgScore: 0, totalSentences: 0, totalActionItems: 0 };

    const totalScore = history.reduce((s, h) => s + h.score, 0);
    const totalSentences = history.reduce(
      (s, h) => s + (h.fullResult?.sentences?.length ?? 0),
      0
    );
    const totalActionItems = history.reduce(
      (s, h) => s + (h.fullResult?.actionItems?.length ?? 0),
      0
    );

    return {
      totalAnalyses: history.length,
      avgScore: Math.round(totalScore / history.length),
      totalSentences,
      totalActionItems,
    };
  }, [history]);

  const scoreBuckets = useMemo<ScoreBucket[]>(() => {
    const buckets: ScoreBucket[] = [
      { label: "0-20", min: 0, max: 20, count: 0 },
      { label: "20-40", min: 20, max: 40, count: 0 },
      { label: "40-60", min: 40, max: 60, count: 0 },
      { label: "60-80", min: 60, max: 80, count: 0 },
      { label: "80-100", min: 80, max: 100, count: 0 },
    ];
    history.forEach((h) => {
      for (const b of buckets) {
        if (h.score > b.min && h.score <= b.max) {
          b.count++;
          break;
        }
      }
    });
    return buckets;
  }, [history]);

  const trendPoints = useMemo<TrendPoint[]>(() => {
    const sorted = [...history]
      .filter((h) => h.analyzedAt)
      .sort((a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime())
      .slice(-10);

    return sorted.map((h) => {
      const nonsenseRate = h.breakdown?.nonsense ?? 0;
      const d = new Date(h.analyzedAt);
      return {
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        nonsenseRate,
      };
    });
  }, [history]);

  const typeDistribution = useMemo<TypeDistribution[]>(() => {
    const counts: Record<ContentType, number> = {
      effective: 0,
      repetitive: 0,
      nonsense: 0,
    };
    history.forEach((h) => {
      h.fullResult?.sentences?.forEach((s: SentenceAnalysis) => {
        counts[s.type] = (counts[s.type] ?? 0) + 1;
      });
    });
    return (["effective", "repetitive", "nonsense"] as ContentType[]).map((type) => ({
      type,
      label: TYPE_LABELS[type],
      count: counts[type],
    }));
  }, [history]);

  const rankedMeetings = useMemo(() => {
    const sorted = [...history]
      .filter((h) => h.fullResult)
      .sort((a, b) => b.score - a.score);

    const best: RankedMeeting[] = sorted.slice(0, 3).map((h, i) => ({
      rank: i + 1,
      title: h.meetingTitle,
      score: h.score,
      levelLabel: h.levelLabel,
      analyzedAt: h.analyzedAt,
      actionItemCount: h.fullResult?.actionItems?.length ?? 0,
    }));

    const worst: RankedMeeting[] = sorted
      .slice(-3)
      .reverse()
      .map((h, i) => ({
        rank: i + 1,
        title: h.meetingTitle,
        score: h.score,
        levelLabel: h.levelLabel,
        analyzedAt: h.analyzedAt,
        actionItemCount: h.fullResult?.actionItems?.length ?? 0,
      }));

    return { best, worst };
  }, [history]);

  const tagStats = useMemo(() => {
    const tagCount = new Map<string, number>();
    history.forEach((h) => {
      if (h.tags) {
        h.tags.forEach((t) => {
          tagCount.set(t, (tagCount.get(t) || 0) + 1);
        });
      }
    });
    return Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [history]);

  /* ─── Empty state ─── */
  if (mounted && history.length === 0) {
    return (
      <>
        <Navbar />
        <main id="main-content" className="pt-24 pb-20">
          <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
            <div className="mb-8">
              <div className="mb-4">
                <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-4" fill="none">
                  {/* Bar chart outline */}
                  <rect x="25" y="60" width="14" height="35" rx="3" stroke="var(--border)" strokeWidth="2" fill="var(--surface)" />
                  <rect x="45" y="40" width="14" height="55" rx="3" stroke="var(--border)" strokeWidth="2" fill="var(--surface)" />
                  <rect x="65" y="25" width="14" height="70" rx="3" stroke="var(--primary)" strokeWidth="2" fill="var(--primary)" fillOpacity="0.1" />
                  <rect x="85" y="50" width="14" height="45" rx="3" stroke="var(--border)" strokeWidth="2" fill="var(--surface)" />
                  {/* Base line */}
                  <line x1="20" y1="95" x2="105" y2="95" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
                  {/* Decorative dots */}
                  <circle cx="72" cy="20" r="3" fill="var(--primary)" opacity="0.4" />
                  <circle cx="55" cy="15" r="2" fill="var(--effective)" opacity="0.3" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">
                暂无统计数据
              </h1>
              <p className="text-text-secondary mt-3">
                完成至少一次会议分析后，这里将展示你的全局统计
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6 fade-up">
            <Link href="/" className="hover:text-primary transition-colors">
              首页
            </Link>
            <span>/</span>
            <span className="text-text-secondary">数据统计</span>
          </nav>

          {/* Title */}
          <div className="mb-8 fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text font-display">
              数据统计总览
            </h1>
            <div className="mt-3 mb-3 h-px w-20 bg-gradient-to-r from-primary via-primary-light to-transparent rounded-full" />
            <p className="text-text-secondary text-lg">
              基于所有历史分析数据生成的全局统计视图
            </p>
          </div>

          {/* ─── Overview Cards ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up">
            {/* Total analyses */}
            <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm card-enter interactive-card" style={{ animationDelay: "0s" }}>
              <p className="text-sm text-text-secondary mb-1">总分析次数</p>
              <p className="text-3xl font-extrabold text-primary number-highlight">
                {summary.totalAnalyses}
              </p>
              <p className="text-xs text-text-muted mt-1">场会议已分析</p>
            </div>

            {/* Average score */}
            <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm card-enter interactive-card" style={{ animationDelay: "0.08s" }}>
              <p className="text-sm text-text-secondary mb-1">平均效率分</p>
              <p className="text-3xl font-extrabold text-text number-highlight">
                {summary.avgScore}
                <span className="text-base font-medium text-text-muted ml-1">分</span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                {summary.avgScore >= 70
                  ? "整体效率良好"
                  : summary.avgScore >= 50
                    ? "仍有优化空间"
                    : "需要提升效率"}
              </p>
            </div>

            {/* Total sentences */}
            <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm card-enter interactive-card" style={{ animationDelay: "0.16s" }}>
              <p className="text-sm text-text-secondary mb-1">总分析句数</p>
              <p className="text-3xl font-extrabold text-text number-highlight">
                {summary.totalSentences.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted mt-1">句逐句分析</p>
            </div>

            {/* Total action items */}
            <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm card-enter interactive-card" style={{ animationDelay: "0.24s" }}>
              <p className="text-sm text-text-secondary mb-1">总行动项数</p>
              <p className="text-3xl font-extrabold text-effective number-highlight">
                {summary.totalActionItems}
              </p>
              <p className="text-xs text-text-muted mt-1">个待办事项</p>
            </div>
          </div>

          {/* ─── Charts Row 1: Distribution + Trend ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 fade-up">
            {/* Score Distribution Bar Chart */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text font-display mb-4">效率分布</h2>
              <p className="text-sm text-text-secondary mb-4">
                按分数区间统计会议效率分布情况
              </p>
              <div className="overflow-x-auto">
                <BarChart buckets={scoreBuckets} />
              </div>
            </div>

            {/* Nonsense Rate Trend */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text font-display mb-4">废话率趋势</h2>
              <p className="text-sm text-text-secondary mb-4">
                最近 {trendPoints.length} 次分析的废话率变化
              </p>
              <TrendLine points={trendPoints} />
            </div>
          </div>

          {/* ─── Charts Row 2: Type Distribution ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 fade-up">
            {/* Content Type Pie Chart */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text font-display mb-4">内容类型分布</h2>
              <p className="text-sm text-text-secondary mb-4">
                所有分析句子的内容类型占比
              </p>
              <PieChart distribution={typeDistribution} />
            </div>

            {/* Placeholder / additional info */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text font-display mb-4">数据洞察</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-effective/10 flex items-center justify-center shrink-0">
                    <IconTrophy size={16} className="text-effective" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">最高效率会议</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {rankedMeetings.best[0]
                        ? `${rankedMeetings.best[0].title}（${rankedMeetings.best[0].score}分）`
                        : "暂无数据"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-nonsense/10 flex items-center justify-center shrink-0">
                    <IconAlert size={16} className="text-nonsense" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">最低效率会议</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {rankedMeetings.worst[0]
                        ? `${rankedMeetings.worst[0].title}（${rankedMeetings.worst[0].score}分）`
                        : "暂无数据"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                      <path d="M2 12h12M2 8h12M2 4h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">平均每次会议</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {summary.totalAnalyses > 0
                        ? `${Math.round(summary.totalSentences / summary.totalAnalyses)} 句分析，${(summary.totalActionItems / summary.totalAnalyses).toFixed(1)} 个行动项`
                        : "暂无数据"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Tag distribution ─── */}
          {tagStats.length > 0 && (
            <div className="bg-surface rounded-2xl p-5 border border-border card-enter mb-8 fade-up">
              <h2 className="text-lg font-bold text-text mb-4 font-display">标签分布</h2>
              <div className="space-y-2">
                {tagStats.map(({ tag, count }) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      <span className="inline-block w-2 h-2 rounded-full bg-accent mr-2" />
                      {tag}
                    </span>
                    <span className="text-sm font-semibold text-text number-highlight">{count}次</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Top 3 Best / Worst ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 fade-up">
            {/* Top 3 Best */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IconTrophy size={18} className="text-effective" />
                <h2 className="text-lg font-bold text-text font-display">最佳会议 Top 3</h2>
              </div>
              <div className="space-y-3">
                {rankedMeetings.best.length > 0 ? (
                  rankedMeetings.best.map((m) => (
                    <RankedCard
                      key={m.analyzedAt}
                      meeting={m}
                      icon={
                        <span className="w-6 h-6 rounded-full bg-effective/10 text-effective text-xs font-bold flex items-center justify-center">
                          {m.rank}
                        </span>
                      }
                      variant="best"
                    />
                  ))
                ) : (
                  <p className="text-sm text-text-muted text-center py-4">暂无数据</p>
                )}
              </div>
            </div>

            {/* Top 3 Worst */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IconAlert size={18} className="text-nonsense" />
                <h2 className="text-lg font-bold text-text font-display">最差会议 Top 3</h2>
              </div>
              <div className="space-y-3">
                {rankedMeetings.worst.length > 0 ? (
                  rankedMeetings.worst.map((m) => (
                    <RankedCard
                      key={m.analyzedAt}
                      meeting={m}
                      icon={
                        <span className="w-6 h-6 rounded-full bg-nonsense/10 text-nonsense text-xs font-bold flex items-center justify-center">
                          {m.rank}
                        </span>
                      }
                      variant="worst"
                    />
                  ))
                ) : (
                  <p className="text-sm text-text-muted text-center py-4">暂无数据</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
