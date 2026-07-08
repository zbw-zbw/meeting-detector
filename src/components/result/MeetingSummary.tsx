"use client";

import type { DeepInsight } from "./helpers";
import {
  IconBook, IconLightbulb, IconCheck,
} from "@/components/Icon";

interface MeetingSummaryProps {
  summary: string;
  keyDecisions: string[];
  suggestions: string[];
  deepInsights: DeepInsight[];
}

export default function MeetingSummary({
  summary, keyDecisions, suggestions, deepInsights,
}: MeetingSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* Left -- Summary */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border fade-up">
        <h2 className="text-lg font-bold text-text mb-4">
          <IconBook size={20} className="inline mr-2 text-primary" />
          会议摘要
        </h2>
        <div className="section-divider mb-4" />
        <p className="text-text-secondary leading-relaxed">
          {summary}
        </p>

        {/* Deep Insights */}
        {deepInsights.length > 0 && (
          <div className="bg-primary/5 rounded-2xl p-5 sm:p-6 border border-primary/10 mb-6 fade-up">
            <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
              <IconLightbulb size={16} className="text-primary" />
              深度洞察
            </h3>
            <div className="space-y-3">
              {deepInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`text-sm font-medium shrink-0 mt-0.5 ${insight.color}`}>
                    {insight.icon === "talk" ? "对话" : insight.icon === "zap" ? "高效" : insight.icon === "alert" ? "警示" : ""}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text">{insight.label}</p>
                    <p className={`text-sm ${insight.color}`}>{insight.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {keyDecisions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text mb-3">
              关键决策
            </h3>
            <ul>
              {keyDecisions.map((decision, i) => (
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

      {/* Right -- Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border fade-up">
          <h2 className="text-lg font-bold text-text mb-4">
            <IconLightbulb size={20} className="inline mr-2 text-primary" />
            改进建议
          </h2>
          <div className="section-divider mb-4" />
          <div>
            {suggestions.map((suggestion, i) => (
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
  );
}
