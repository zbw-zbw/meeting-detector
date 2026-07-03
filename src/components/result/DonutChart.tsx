"use client";

import type { ContentBreakdown } from "@/types/analysis";
import { IconTrendingUp } from "@/components/Icon";
import { CHART_RADIUS, CHART_CIRCUMFERENCE } from "./helpers";

interface DonutChartProps {
  score: number;
  breakdown: ContentBreakdown;
  mounted: boolean;
  scoreColor: string;
}

export default function DonutChart({ score, breakdown, mounted, scoreColor }: DonutChartProps) {
  const effectiveLen = CHART_CIRCUMFERENCE * (breakdown.effective / 100);
  const repetitiveLen = CHART_CIRCUMFERENCE * (breakdown.repetitive / 100);
  const nonsenseLen = CHART_CIRCUMFERENCE * (breakdown.nonsense / 100);
  const bd = breakdown;

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
      <h2 className="text-lg font-bold text-text mb-6">
        <IconTrendingUp size={20} className="inline mr-2 text-primary" />
        内容结构分析
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left -- SVG Donut Chart */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-[200px] h-[200px]">
            <svg viewBox="0 0 200 200" width="200" height="200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={CHART_RADIUS}
                fill="none"
                stroke="var(--color-border-light)"
                strokeWidth="20"
              />

              {/* Effective segment */}
              <circle
                cx="100"
                cy="100"
                r={CHART_RADIUS}
                fill="none"
                stroke="var(--color-effective)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${effectiveLen} ${CHART_CIRCUMFERENCE - effectiveLen}`}
                strokeDashoffset={mounted ? 0 : CHART_CIRCUMFERENCE}
                transform="rotate(-90 100 100)"
                style={{
                  transition:
                    "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0s",
                }}
              />

              {/* Repetitive segment */}
              <circle
                cx="100"
                cy="100"
                r={CHART_RADIUS}
                fill="none"
                stroke="var(--color-repetitive)"
                strokeWidth="20"
                strokeLinecap="butt"
                strokeDasharray={`${repetitiveLen} ${CHART_CIRCUMFERENCE - repetitiveLen}`}
                strokeDashoffset={mounted ? -(effectiveLen) : CHART_CIRCUMFERENCE}
                transform="rotate(-90 100 100)"
                style={{
                  transition:
                    "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
                }}
              />

              {/* Nonsense segment */}
              <circle
                cx="100"
                cy="100"
                r={CHART_RADIUS}
                fill="none"
                stroke="var(--color-nonsense)"
                strokeWidth="20"
                strokeLinecap="butt"
                strokeDasharray={`${nonsenseLen} ${CHART_CIRCUMFERENCE - nonsenseLen}`}
                strokeDashoffset={mounted ? -(effectiveLen + repetitiveLen) : CHART_CIRCUMFERENCE}
                transform="rotate(-90 100 100)"
                style={{
                  transition:
                    "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
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

        {/* Right -- Progress Bars */}
        <div className="lg:w-1/2 flex flex-col justify-center gap-6">

          {/* Effective progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-effective inline-block" />
                <span className="text-sm font-medium text-text">有效信息</span>
              </div>
              <span className="text-sm font-semibold text-effective">
                {bd.effective}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-border-light overflow-hidden">
              <div
                className="h-full rounded-full bg-effective transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${bd.effective}%` : "0%",
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
                {bd.repetitive}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-border-light overflow-hidden">
              <div
                className="h-full rounded-full bg-repetitive transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${bd.repetitive}%` : "0%",
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
                {bd.nonsense}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-border-light overflow-hidden">
              <div
                className="h-full rounded-full bg-nonsense transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${bd.nonsense}%` : "0%",
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
  );
}
