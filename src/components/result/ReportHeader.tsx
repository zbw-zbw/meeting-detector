"use client";

import Link from "next/link";
import type { AnalysisResult } from "@/types/analysis";
import { formatAnalyzedAt } from "./helpers";
import {
  IconArrowLeft, IconChart, IconPin, IconClock, IconUsers, IconFileText,
  IconShare, IconCheck,
} from "@/components/Icon";

interface ReportHeaderProps {
  result: AnalysisResult;
  handleShare: () => void;
  shared: boolean;
}

export default function ReportHeader({ result, handleShare, shared }: ReportHeaderProps) {
  return (
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
      <h1 className="text-2xl sm:text-3xl font-extrabold text-text mt-4 font-display">
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
  );
}
