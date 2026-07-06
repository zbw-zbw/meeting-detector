"use client";

import {
  getScoreBarColor, getScoreTextColor,
  levelBgs, levelTextColors,
} from "./helpers";

interface ScoreCardsProps {
  score: number;
  level: string;
  levelLabel: string;
  animScore: number;
  animEffective: number;
  animRepetitive: number;
  animNonsense: number;
  mounted: boolean;
  className?: string;
}

export default function ScoreCards({
  score, level, levelLabel,
  animScore, animEffective, animRepetitive, animNonsense,
  mounted,
  className,
}: ScoreCardsProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${className ?? ""}`}>

      {/* Card 1 -- Efficiency Score */}
      <div className={`relative bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up score-pulse interactive-card ${
        score >= 90 ? "score-pulse-excellent" : score >= 70 ? "score-pulse-good" : score >= 50 ? "score-pulse-fair" : "score-pulse-poor"
      } score-flash`}>
        <div className={`h-1 -mx-6 -mt-6 mb-4 ${getScoreBarColor(score)} score-bar-animated`} />
        <div className={`text-5xl font-extrabold number-highlight ${getScoreTextColor(score)}`}>
          {animScore}
        </div>
        <div className="mt-2">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-semibold ${levelBgs[level]} ${levelTextColors[level]}`}
          >
            {levelLabel}
          </span>
        </div>
        <p className="text-sm text-text-secondary mt-2">效率评分</p>
      </div>

      {/* Card 2 -- Effective */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up interactive-card">
        <div className="h-1 -mx-6 -mt-6 mb-4 bg-effective score-bar-animated" />
        <div className="text-5xl font-extrabold text-effective number-highlight">
          {animEffective}%
        </div>
        <p className="text-sm text-text-secondary mt-3">有效信息占比</p>
      </div>

      {/* Card 3 -- Repetitive */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up interactive-card">
        <div className="h-1 -mx-6 -mt-6 mb-4 bg-repetitive score-bar-animated" />
        <div className="text-5xl font-extrabold text-repetitive number-highlight">
          {animRepetitive}%
        </div>
        <p className="text-sm text-text-secondary mt-3">重复内容占比</p>
      </div>

      {/* Card 4 -- Nonsense */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden fade-up interactive-card">
        <div className="h-1 -mx-6 -mt-6 mb-4 bg-nonsense score-bar-animated" />
        <div className="text-5xl font-extrabold text-nonsense number-highlight">
          {animNonsense}%
        </div>
        <p className="text-sm text-text-secondary mt-3">废话/跑题占比</p>
      </div>
    </div>
  );
}
