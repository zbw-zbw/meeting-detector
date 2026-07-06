"use client";

import type { SpeakerStat } from "./helpers";
import { IconUsers } from "@/components/Icon";

interface SpeakerRankingProps {
  speakerStats: SpeakerStat[];
}

export default function SpeakerRanking({ speakerStats }: SpeakerRankingProps) {
  if (speakerStats.length <= 1) return null;

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
      <h2 className="text-lg font-bold text-text mb-1">
        <IconUsers size={20} className="inline mr-2 text-primary" />
        发言人效率排行
      </h2>
      <p className="text-xs text-text-muted mb-5">基于逐句分析数据，按有效率降序排列</p>

      <div className="space-y-4">
        {speakerStats.map((sp) => (
          <div key={sp.name} className="row-highlight flex items-center gap-4">
            {/* Name */}
            <span className="text-sm font-medium text-text w-16 shrink-0 truncate">{sp.name}</span>

            {/* Stacked bar */}
            <div
              className="tooltip flex-1"
              data-tooltip={`有效 ${sp.effective}% · 重复 ${sp.repetitive}% · 废话 ${sp.nonsense}%`}
            >
              <div className="flex h-3 rounded-full overflow-hidden bg-border-light">
                <div
                  className="bg-effective transition-all duration-700"
                  style={{ width: `${sp.effective}%` }}
                />
                <div
                  className="bg-repetitive transition-all duration-700"
                  style={{ width: `${sp.repetitive}%` }}
                />
                <div
                  className="bg-nonsense transition-all duration-700"
                  style={{ width: `${sp.nonsense}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <span className={`text-sm font-bold shrink-0 w-12 text-right ${
              sp.effectiveRate >= 80 ? "text-effective" : sp.effectiveRate >= 50 ? "text-repetitive" : "text-nonsense"
            }`}>
              {sp.effectiveRate}%
            </span>
            <span className="text-xs text-text-muted shrink-0 w-10 text-right">{sp.total}条</span>
          </div>
        ))}
      </div>

      {/* Legend + highlights */}
      <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2.5 h-2.5 rounded-full bg-effective inline-block" />有效</span>
          <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2.5 h-2.5 rounded-full bg-repetitive inline-block" />重复</span>
          <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2.5 h-2.5 rounded-full bg-nonsense inline-block" />废话</span>
        </div>
        <span className="text-xs text-text-muted ml-auto">
          最高效: <strong className="text-effective">{speakerStats[0].name}</strong>
          {" / "}
          最需改进: <strong className="text-nonsense">{speakerStats[speakerStats.length - 1].name}</strong>
        </span>
      </div>
    </div>
  );
}
