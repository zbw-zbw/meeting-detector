"use client";

import { useState } from "react";
import type { SentenceAnalysis } from "@/types/analysis";
import {
  filterButtons, getFilterActiveClass, getTypeBorderClass, getTypeBadgeClass,
} from "./helpers";
import type { FilterKey } from "./helpers";
import {
  IconSearch, IconDot, IconChevronUp, IconChevronDown,
} from "@/components/Icon";

interface SentenceListProps {
  sentences: SentenceAnalysis[];
  filter: FilterKey;
  setFilter: (f: FilterKey) => void;
  showAll: boolean;
  setShowAll: (v: boolean | ((prev: boolean) => boolean)) => void;
}

/** Highlight matching text within a string */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-text rounded px-0.5">{part}</mark>
    ) : (
      part
    ),
  );
}

export default function SentenceList({ sentences, filter, setFilter, showAll, setShowAll }: SentenceListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (sentences.length === 0) return null;

  const filteredSentences = sentences.filter(
    (s) => (filter === "all" || s.type === filter) &&
      (searchQuery.trim() === "" || s.text.toLowerCase().includes(searchQuery.trim().toLowerCase())),
  );

  const displayedSentences = filteredSentences.slice(0, 20);
  const remainingCount = filteredSentences.length - 20;

  // Mini donut data for stats bar
  const effectiveCount = sentences.filter(s => s.type === "effective").length;
  const repetitiveCount = sentences.filter(s => s.type === "repetitive").length;
  const nonsenseCount = sentences.filter(s => s.type === "nonsense").length;
  const total = sentences.length;

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
      <h2 className="text-lg font-bold text-text">
        <IconSearch size={20} className="inline mr-2 text-primary" />
        逐句分析详情
      </h2>

      {/* Filter bar + search */}
      <div className="flex flex-wrap items-center gap-2 mt-4 mb-4">
        {filterButtons.map((btn) => {
          const isActive = filter === btn.key;
          return (
            <button
              key={btn.key}
              onClick={() => {
                setFilter(btn.key);
                setShowAll(false);
              }}
              className={`px-3 py-1.5 rounded-full text-sm border filter-btn transition-all cursor-pointer ${
                isActive
                  ? getFilterActiveClass(btn.key)
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {btn.key === "all" && "全部"}
              {btn.key === "effective" && (<span className="inline-flex items-center gap-1"><IconDot size={10} className="text-effective" />有效</span>)}
              {btn.key === "repetitive" && (<span className="inline-flex items-center gap-1"><IconDot size={10} className="text-repetitive" />重复</span>)}
              {btn.key === "nonsense" && (<span className="inline-flex items-center gap-1"><IconDot size={10} className="text-nonsense" />废话</span>)}
            </button>
          );
        })}
        <span className="text-sm text-text-muted ml-auto">
          共 {filteredSentences.length} 条
        </span>
      </div>

      {/* Search box */}
      <div className="mb-4">
        <div className="relative">
          <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="搜索句子内容..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-sm bg-bg border border-border rounded-lg text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text text-xs cursor-pointer"
            >
              清除
            </button>
          )}
        </div>
      </div>

      {/* Sentence statistics with mini donut */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-xs text-text-muted bg-bg rounded-lg px-3 py-2">
        <span>共分析 <strong className="text-text">{total}</strong> 句</span>
        <span>有效 <strong className="text-effective">{effectiveCount}</strong> ({total > 0 ? Math.round(effectiveCount / total * 100) : 0}%)</span>
        <span>重复 <strong className="text-repetitive">{repetitiveCount}</strong> ({total > 0 ? Math.round(repetitiveCount / total * 100) : 0}%)</span>
        <span>废话 <strong className="text-nonsense">{nonsenseCount}</strong> ({total > 0 ? Math.round(nonsenseCount / total * 100) : 0}%)</span>
        {/* Mini donut visualization */}
        {total > 0 && (
          <span className="ml-auto flex items-center gap-1">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <circle
                cx="12" cy="12" r="9"
                fill="none"
                stroke="var(--color-border-light)"
                strokeWidth="4"
              />
              <circle
                cx="12" cy="12" r="9"
                fill="none"
                stroke="var(--color-effective)"
                strokeWidth="4"
                strokeDasharray={`${56.55 * (effectiveCount / total)} ${56.55}`}
                strokeDashoffset={0}
                transform="rotate(-90 12 12)"
                strokeLinecap="round"
              />
              <circle
                cx="12" cy="12" r="9"
                fill="none"
                stroke="var(--color-repetitive)"
                strokeWidth="4"
                strokeDasharray={`${56.55 * (repetitiveCount / total)} ${56.55}`}
                strokeDashoffset={-(56.55 * (effectiveCount / total))}
                transform="rotate(-90 12 12)"
                strokeLinecap="butt"
              />
              <circle
                cx="12" cy="12" r="9"
                fill="none"
                stroke="var(--color-nonsense)"
                strokeWidth="4"
                strokeDasharray={`${56.55 * (nonsenseCount / total)} ${56.55}`}
                strokeDashoffset={-(56.55 * ((effectiveCount + repetitiveCount) / total))}
                transform="rotate(-90 12 12)"
                strokeLinecap="butt"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Sentence list with stagger animation */}
      <div className="sentence-list-stagger">
        {displayedSentences.map((s, i) => {
          const isNonsense = s.type === "nonsense";
          const effectiveFillWidth = `${Math.round(s.confidence * 100)}%`;

          return (
            <div
              key={i}
              className={`sentence-card p-4 rounded-xl border-l-4 mb-3 transition-all duration-300 ${
                getTypeBorderClass(s.type)
              } ${isNonsense ? "bg-nonsense-bg" : "bg-surface"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                {/* speaker badge */}
                <div className="flex items-center gap-2 shrink-0">
                  {s.speaker && (
                    <span className="text-xs px-2 py-0.5 rounded bg-bg text-text-muted whitespace-nowrap">
                      {s.speaker}
                    </span>
                  )}
                </div>

                {/* text content with search highlight */}
                <p
                  className={`flex-1 text-sm leading-relaxed ${
                    isNonsense
                      ? "text-text-muted line-through decoration-nonsense/60"
                      : s.type === "effective"
                        ? "text-text font-medium"
                        : "text-text"
                  }`}
                >
                  {highlightText(s.text, searchQuery)}
                </p>

                {/* right side info */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {/* type badge */}
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${getTypeBadgeClass(s.type)}`}
                  >
                    {s.type === "effective"
                      ? "有效"
                      : s.type === "repetitive"
                        ? "重复"
                        : "废话"}
                  </span>

                  {/* confidence bar */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 rounded-full bg-border-light overflow-hidden">
                      <div
                        className={`confidence-bar-fill h-full rounded-full transition-all duration-700 ease-out ${
                          s.type === "effective"
                            ? "bg-effective"
                            : s.type === "repetitive"
                              ? "bg-repetitive"
                              : "bg-nonsense"
                        }`}
                        style={{ width: effectiveFillWidth }}
                      />
                    </div>
                    <span className="text-xs text-text-muted w-8 text-right">
                      {Math.round(s.confidence * 100)}%
                    </span>
                  </div>

                  {/* reason */}
                  <p className="text-xs text-text-muted max-w-[200px] text-right">
                    {s.reason}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more / less */}
      {filteredSentences.length > 20 && (
        <div>
          {/* Extra sentences with accordion animation */}
          <div className={`sentence-list-wrapper ${showAll ? "expanded" : ""}`}>
            <div className="sentence-list-inner">
              {filteredSentences.slice(20).map((s, i) => {
                const isNonsense = s.type === "nonsense";
                const effectiveFillWidth = `${Math.round(s.confidence * 100)}%`;
                const borderColor = s.type === "effective"
                  ? "border-l-effective"
                  : s.type === "repetitive"
                    ? "border-l-repetitive"
                    : "border-l-nonsense";
                const badgeClass = s.type === "effective"
                  ? "bg-effective-bg text-effective"
                  : s.type === "repetitive"
                    ? "bg-repetitive-bg text-repetitive"
                    : "bg-nonsense-bg text-nonsense";
                const typeLabel = s.type === "effective"
                  ? "有效"
                  : s.type === "repetitive"
                    ? "重复"
                    : "废话";
                return (
                  <div
                    key={20 + i}
                    className={`sentence-card p-4 rounded-xl border-l-4 mb-3 transition-all duration-300 ${borderColor} bg-surface`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {s.speaker && (
                          <span className="text-xs font-medium text-text-muted">{s.speaker}</span>
                        )}
                        <p className="text-sm text-text mt-0.5">{highlightText(s.text, searchQuery)}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
                        {typeLabel}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-border-light overflow-hidden">
                        <div
                          className={`confidence-bar-fill h-full rounded-full transition-all duration-700 ease-out ${
                            isNonsense ? "bg-nonsense" : s.type === "repetitive" ? "bg-repetitive" : "bg-effective"
                          }`}
                          style={{ width: effectiveFillWidth }}
                        />
                      </div>
                      <span className="text-xs text-text-muted shrink-0">{s.confidence}%</span>
                      <span className="text-xs text-text-muted hidden sm:inline">{s.reason}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-center mt-4 mb-2">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-sm text-primary hover:underline cursor-pointer"
            >
              {showAll ? (
                <span className="inline-flex items-center gap-1">收起 <IconChevronUp size={14} /></span>
              ) : (
                <span className="inline-flex items-center gap-1">展开更多 ({remainingCount} 条) <IconChevronDown size={14} /></span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
