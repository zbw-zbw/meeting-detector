"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useFadeUp } from "@/hooks/useFadeUp";
import { useToast } from "@/components/ToastProvider";
import type { ContentBreakdown } from "@/types/analysis";
import {
  IconArrowLeft, IconChart, IconTrendingUp, IconFileText,
} from "@/components/Icon";

interface CompareItem {
  id: string;
  title: string;
  score: number;
  levelLabel: string;
  breakdown: ContentBreakdown;
  sentenceCount: number;
  actionItemCount: number;
  wordCount: number;
  participantCount: number;
  duration: string;
  analyzedAt: string;
}

export default function ComparePage() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [mounted, setMounted] = useState(false);
  useFadeUp();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("compareItems");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("compareItems", JSON.stringify(items));
    }
  }, [items, mounted]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    showToast("已清除对比列表", "info");
  }, [showToast]);

  const maxScore = Math.max(...items.map((i) => i.score), 1);
  const avgScore = items.length > 0
    ? Math.round(items.reduce((s, i) => s + i.score, 0) / items.length)
    : 0;
  const avgEffective = items.length > 0
    ? Math.round(items.reduce((s, i) => s + i.breakdown.effective, 0) / items.length)
    : 0;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="mb-8 fade-up">
            <Link href="/history" className="text-sm text-text-secondary hover:text-primary transition-colors">
              <IconArrowLeft size={14} className="inline" /> 返回历史记录
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text mt-4 flex items-center gap-2">
              <IconChart size={24} className="text-primary" />
              会议对比分析
            </h1>
            <p className="text-text-secondary mt-2">
              选择 2-4 场会议进行并排对比，发现效率变化趋势
            </p>
          </div>

          {/* Empty state */}
          {items.length === 0 && (
            <div className="text-center py-16 fade-up">
              <div className="mb-4">
                <IconChart size={48} className="text-text-muted mx-auto" />
              </div>
              <h2 className="text-xl font-bold text-text mb-2">暂无对比项目</h2>
              <p className="text-text-secondary mb-6">
                在历史记录页面点击&ldquo;加入对比&rdquo;来添加会议
              </p>
              <Link
                href="/history"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold cta-btn"
              >
                去历史记录
              </Link>
            </div>
          )}

          {/* Compare content */}
          {items.length > 0 && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up">
                <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                  <p className="text-sm text-text-secondary">对比会议数</p>
                  <p className="text-3xl font-extrabold text-text mt-1">{items.length}</p>
                </div>
                <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                  <p className="text-sm text-text-secondary">平均效率分</p>
                  <p className={`text-3xl font-extrabold mt-1 ${
                    avgScore >= 70 ? "text-effective" : avgScore >= 50 ? "text-repetitive" : "text-nonsense"
                  }`}>
                    {avgScore}
                  </p>
                </div>
                <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                  <p className="text-sm text-text-secondary">平均有效率</p>
                  <p className="text-3xl font-extrabold text-text mt-1">{avgEffective}%</p>
                </div>
                <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                  <p className="text-sm text-text-secondary">效率差异</p>
                  <p className="text-3xl font-extrabold text-text mt-1">
                    {items.length >= 2 ? Math.max(...items.map((i) => i.score)) - Math.min(...items.map((i) => i.score)) : 0}
                  </p>
                </div>
              </div>

              {/* Comparison table */}
              <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden fade-up">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-text-secondary font-medium">指标</th>
                        {items.map((item) => (
                          <th key={item.id} className="text-center p-4 text-text-secondary font-medium min-w-[120px]">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="float-right text-text-muted hover:text-nonsense transition-colors print-hide"
                              title="移除"
                            >
                              <IconArrowLeft size={12} />
                            </button>
                            {item.title.length > 8 ? item.title.slice(0, 8) + "..." : item.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "效率评分", key: "score", format: (v: number) => v + "分" },
                        { label: "有效率", key: "effective", format: (v: number) => v + "%" },
                        { label: "重复率", key: "repetitive", format: (v: number) => v + "%" },
                        { label: "废话率", key: "nonsense", format: (v: number) => v + "%" },
                        { label: "句数", key: "sentenceCount", format: (v: number) => v + "句" },
                        { label: "行动项", key: "actionItemCount", format: (v: number) => v + "项" },
                        { label: "文字量", key: "wordCount", format: (v: number) => v + "字" },
                        { label: "参会人", key: "participantCount", format: (v: number) => v + "人" },
                      ].map((row) => (
                        <tr key={row.key} className="border-b border-border-light">
                          <td className="p-4 font-medium text-text">{row.label}</td>
                          {items.map((item) => {
                            const val = (() => {
                              if (row.key === "effective" || row.key === "repetitive" || row.key === "nonsense") {
                                return item.breakdown[row.key as keyof ContentBreakdown] as number;
                              }
                              return item[row.key as keyof CompareItem] as number;
                            })();
                            const allVals = items.map((i) => {
                              if (row.key === "effective" || row.key === "repetitive" || row.key === "nonsense") {
                                return i.breakdown[row.key as keyof ContentBreakdown] as number;
                              }
                              return i[row.key as keyof CompareItem] as number;
                            });
                            const best = row.key === "nonsense" || row.key === "repetitive"
                              ? Math.min(...allVals)
                              : Math.max(...allVals);
                            const isBest = items.length > 1 && val === best;
                            return (
                              <td
                                key={item.id}
                                className={`text-center p-4 ${isBest ? "font-bold text-effective" : "text-text-secondary"}`}
                              >
                                {row.format(val)}
                                {isBest && " *"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-muted p-3 border-t border-border">* 标记为该指标最优值</p>
              </div>

              {/* Score comparison bar chart */}
              <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border fade-up">
                <h2 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                  <IconTrendingUp size={16} className="text-primary" />
                  效率评分对比
                </h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    const barWidth = Math.max((item.score / 100) * 100, 2);
                    const color = item.score >= 70 ? "bg-effective" : item.score >= 50 ? "bg-repetitive" : "bg-nonsense";
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-text w-32 shrink-0 truncate" title={item.title}>
                          {item.title.length > 10 ? item.title.slice(0, 10) + "..." : item.title}
                        </span>
                        <div className="flex-1 h-6 rounded-full bg-border-light overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color} transition-all duration-700`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold shrink-0 w-10 text-right ${
                          item.score >= 70 ? "text-effective" : item.score >= 50 ? "text-repetitive" : "text-nonsense"
                        }`}>
                          {item.score}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Breakdown stacked bar */}
              <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border fade-up">
                <h2 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                  <IconFileText size={16} className="text-primary" />
                  内容构成对比
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-text w-32 shrink-0 truncate" title={item.title}>
                        {item.title.length > 10 ? item.title.slice(0, 10) + "..." : item.title}
                      </span>
                      <div className="flex-1 flex h-4 rounded-full overflow-hidden bg-border-light">
                        <div className="bg-effective transition-all duration-700" style={{ width: `${item.breakdown.effective}%` }} />
                        <div className="bg-repetitive transition-all duration-700" style={{ width: `${item.breakdown.repetitive}%` }} />
                        <div className="bg-nonsense transition-all duration-700" style={{ width: `${item.breakdown.nonsense}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2.5 h-2.5 rounded-full bg-effective inline-block" />有效</span>
                  <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2.5 h-2.5 rounded-full bg-repetitive inline-block" />重复</span>
                  <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2.5 h-2.5 rounded-full bg-nonsense inline-block" />废话</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-4 print-hide">
                <Link
                  href="/history"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-all"
                >
                  继续添加
                </Link>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-nonsense hover:text-nonsense transition-all"
                >
                  清除对比
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
