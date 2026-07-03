"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { AnalysisResult } from "@/types/analysis";
import { downloadMarkdown, downloadCSV, downloadJSON } from "@/lib/export";
import {
  IconCopy, IconDownload, IconChevronDown, IconRefresh,
  IconFileText, IconLayers, IconBook, IconCheck,
} from "@/components/Icon";

interface ExportActionsProps {
  result: AnalysisResult;
  copied: boolean;
  shared: boolean;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function ExportActions({ result, copied, shared, showToast }: ExportActionsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  /* close export menu on outside click */
  useEffect(() => {
    if (!showExportMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showExportMenu]);

  /* copy report */
  const handleCopy = () => {
    if (!result) return;
    const lines: string[] = [];
    lines.push(`[会议效率报告] - ${result.meetingTitle}`);
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push(
      `效率评分：${result.score}分（${result.levelLabel}）`,
    );
    lines.push(
      `有效信息：${result.breakdown?.effective ?? 0}% | 重复内容：${result.breakdown?.repetitive ?? 0}% | 废话占比：${result.breakdown?.nonsense ?? 0}%`,
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
      showToast("报告已复制到剪贴板", "success");
    });
  };

  /* export report as Markdown */
  const handleExport = () => {
    try {
      downloadMarkdown(result);
      showToast("报告已导出为 Markdown", "success");
    } catch {
      showToast("导出失败，请重试", "error");
    }
  };

  /* print report */
  const handlePrint = () => {
    window.print();
  };

  /* export report as CSV */
  const handleExportCSV = () => {
    try {
      downloadCSV(result);
      showToast("逐句数据已导出为 CSV", "success");
    } catch {
      showToast("导出失败，请重试", "error");
    }
  };

  /* export report as JSON */
  const handleExportJSON = () => {
    try {
      downloadJSON(result);
      showToast("分析结果已导出为 JSON", "success");
    } catch {
      showToast("导出失败，请重试", "error");
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8 mb-8 fade-up">
      {/* Copy Report */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-all cursor-pointer"
      >
        {copied ? (<><IconCheck size={16} /> 已复制</>) : (<><IconCopy size={16} /> 复制报告</>)}
      </button>

      {/* Export Dropdown */}
      <div className="relative" ref={exportDropdownRef}>
        <button
          onClick={() => setShowExportMenu((v) => !v)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-all cursor-pointer"
        >
          <IconDownload size={16} />
          导出报告
          <IconChevronDown size={14} />
        </button>
        {showExportMenu && (
          <div className="absolute bottom-full mb-2 left-0 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-20 min-w-[160px] print-hide">
            <button
              onClick={() => { handleExport(); setShowExportMenu(false); }}
              className="w-full px-4 py-2.5 text-sm text-left text-text hover:bg-bg transition-colors flex items-center gap-2"
            >
              <IconFileText size={14} className="text-text-muted" /> Markdown
            </button>
            <button
              onClick={() => { handleExportCSV(); setShowExportMenu(false); }}
              className="w-full px-4 py-2.5 text-sm text-left text-text hover:bg-bg transition-colors flex items-center gap-2"
            >
              <IconLayers size={14} className="text-text-muted" /> CSV 逐句数据
            </button>
            <button
              onClick={() => { handleExportJSON(); setShowExportMenu(false); }}
              className="w-full px-4 py-2.5 text-sm text-left text-text hover:bg-bg transition-colors flex items-center gap-2"
            >
              <IconBook size={14} className="text-text-muted" /> JSON 结构化数据
            </button>
          </div>
        )}
      </div>

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
  );
}
