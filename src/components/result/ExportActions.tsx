"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { AnalysisResult } from "@/types/analysis";
import { downloadMarkdown, downloadCSV, downloadJSON } from "@/lib/export";
import {
  IconCopy, IconDownload, IconChevronDown, IconRefresh,
  IconFileText, IconLayers, IconBook, IconCheck, IconPrinter,
} from "@/components/Icon";

interface ExportActionsProps {
  result: AnalysisResult;
  copied: boolean;
  shared: boolean;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
  onCopy?: () => void;
}

export default function ExportActions({ result, copied, shared, showToast, onCopy }: ExportActionsProps) {
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
      if (onCopy) {
        onCopy();
      } else {
        showToast("报告已复制到剪贴板", "success");
      }
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

  /* export as PDF via print */
  const handleExportPDF = () => {
    setShowExportMenu(false);
    window.print();
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-8 mb-8 fade-up">
      {/* Button Group: Copy + Share */}
      <div className="inline-flex rounded-full border border-border bg-surface p-1 shadow-sm">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary font-medium hover:text-primary hover:bg-primary/5 rounded-full transition-all cursor-pointer"
        >
          {copied ? (<><IconCheck size={14} /> 已复制</>) : (<><IconCopy size={14} /> 复制报告</>)}
        </button>
        <div className="w-px h-5 bg-border self-center" />
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href).then(() => {
              showToast("结果链接已复制", "success");
            }).catch(() => {
              showToast("复制链接失败", "error");
            });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary font-medium hover:text-primary hover:bg-primary/5 rounded-full transition-all cursor-pointer"
        >
          <IconLayers size={14} /> 分享结果
        </button>
      </div>

      {/* Button Group: Export Dropdown + Print */}
      <div className="inline-flex rounded-full border border-border bg-surface p-1 shadow-sm">
        <div className="relative" ref={exportDropdownRef}>
          <button
            onClick={() => setShowExportMenu((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary font-medium hover:text-primary hover:bg-primary/5 rounded-full transition-all cursor-pointer"
          >
            <IconDownload size={14} />
            导出
            <IconChevronDown size={12} />
          </button>
          {showExportMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-20 min-w-[180px] print-hide">
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
              <div className="h-px bg-border" />
              <button
                onClick={handleExportPDF}
                className="w-full px-4 py-2.5 text-sm text-left text-text hover:bg-bg transition-colors flex items-center gap-2"
              >
                <IconPrinter size={14} className="text-text-muted" /> PDF 文档
              </button>
            </div>
          )}
        </div>
        <div className="w-px h-5 bg-border self-center" />
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary font-medium hover:text-primary hover:bg-primary/5 rounded-full transition-all cursor-pointer"
        >
          <IconPrinter size={14} />
          打印
        </button>
      </div>

      {/* Re-analyze (CTA, standalone) */}
      <Link
        href="/analyze"
        className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold cta-btn ripple-btn inline-flex items-center gap-2 shadow-sm"
      >
        <IconRefresh size={16} />
        重新分析
      </Link>
    </div>
  );
}
