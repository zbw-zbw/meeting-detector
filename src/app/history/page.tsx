"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFadeUp } from "@/hooks/useFadeUp";
import { useToast } from "@/components/ToastProvider";
import {
  getHistory,
  clearHistory,
  formatHistoryDate,
  getScoreBgClass,
  type HistoryItem,
} from "@/lib/history";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IconBook, IconTrash, IconInbox, IconArrowRight } from "@/components/Icon";

export default function HistoryPage() {
  useFadeUp();
  const { showToast } = useToast();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const data = getHistory();
    setHistory(data);
    setLoading(false);
  }, []);

  const viewReport = (item: HistoryItem) => {
    localStorage.setItem("lastAnalysis", JSON.stringify(item.fullResult));
    router.push("/result");
  };

  // Stats calculations
  const avgScore =
    history.length > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.score, 0) / history.length
        )
      : "—";
  const totalActionItems = history.reduce(
    (sum, item) => sum + item.actionItemCount,
    0
  );
  const minScore =
    history.length > 0 ? Math.min(...history.map((item) => item.score)) : "—";

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Title */}
          <div className="mb-8 fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text flex items-center gap-3">
              <IconBook size={28} className="text-primary" /> 分析历史
            </h1>
            <p className="text-text-secondary mt-3 text-lg">
              查看你的所有会议分析记录
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-border-light border-t-primary animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center fade-up">
              <div className="text-text-muted mx-auto">
                <IconInbox size={48} />
              </div>
              <h2 className="text-2xl font-extrabold text-text mt-4">
                还没有分析记录
              </h2>
              <p className="text-text-secondary mt-2">
                开始分析你的第一场会议吧
              </p>
              <Link
                href="/analyze"
                className="px-8 py-3 bg-primary text-white rounded-xl font-semibold cta-btn inline-flex items-center gap-2 mt-6"
              >
                去分析第一场会议 <IconArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* History content */}
          {!loading && history.length > 0 && (
            <>
              {/* Stats Overview Card */}
              <div className="bg-primary/5 rounded-2xl p-6 mb-6 fade-up border border-primary/10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {history.length}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      分析总次数
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {avgScore}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      平均效率分
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {totalActionItems}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      行动项总计
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {minScore}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      最低效会议
                    </div>
                  </div>
                </div>
              </div>

              {/* History List */}
              {history.map((item) => {
                const total =
                  item.breakdown.effective +
                  item.breakdown.repetitive +
                  item.breakdown.nonsense;
                const effPct =
                  total > 0 ? (item.breakdown.effective / total) * 100 : 0;
                const repPct =
                  total > 0 ? (item.breakdown.repetitive / total) * 100 : 0;
                const nonPct =
                  total > 0 ? (item.breakdown.nonsense / total) * 100 : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-surface rounded-2xl p-5 shadow-sm border border-border mb-4 fade-up"
                  >
                    <div className="flex items-center gap-4">
                      {/* Left: Score badge */}
                      <div
                        className={`shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${getScoreBgClass(
                          item.score
                        )}`}
                      >
                        <div className="text-2xl font-bold">{item.score}</div>
                        <div className="text-[10px] mt-0.5">
                          {item.levelLabel}
                        </div>
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text truncate">
                          {item.meetingTitle}
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {formatHistoryDate(item.analyzedAt)}
                        </div>
                        <div className="text-xs text-text-muted flex gap-3 mt-1">
                          <span>{item.wordCount}字</span>
                          <span>·</span>
                          <span>{item.actionItemCount}个行动项</span>
                        </div>
                      </div>

                      {/* Right: Mini bar chart + View button */}
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <div className="w-[120px] h-2 rounded-full overflow-hidden flex">
                          <div
                            className="bg-effective"
                            style={{ width: `${effPct}%` }}
                          />
                          <div
                            className="bg-repetitive"
                            style={{ width: `${repPct}%` }}
                          />
                          <div
                            className="bg-nonsense"
                            style={{ width: `${nonPct}%` }}
                          />
                        </div>
                        <button
                          onClick={() => viewReport(item)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                        >
                          查看报告 <IconArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear All button */}
              <button
                onClick={() => setShowConfirm(true)}
                className="text-sm text-nonsense hover:text-nonsense/80 transition-colors mt-4 mx-auto block"
              >
                <span className="inline-flex items-center gap-1.5"><IconTrash size={14} /> 清除所有记录</span>
              </button>
            </>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirm(false);
          }}
        >
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-text">确认清除</h3>
            <p className="text-sm text-text-secondary mt-2">
              将删除所有分析历史记录，此操作不可恢复
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg bg-bg text-text-secondary font-medium hover:bg-border-light transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setHistory([]);
                  setShowConfirm(false);
                  showToast("历史记录已清除", "success");
                }}
                className="flex-1 py-2.5 rounded-lg bg-nonsense text-white font-medium hover:bg-nonsense/90 transition-colors"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
