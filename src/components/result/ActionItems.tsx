"use client";

import { useState } from "react";
import type { ActionItem } from "@/types/analysis";
import { priorityLabels, priorityBgs } from "./helpers";
import {
  IconCheckCircle, IconAlert, IconUser, IconCalendar, IconPlus,
} from "@/components/Icon";

/** Generate a unique id, falling back when crypto.randomUUID is unavailable (e.g. HTTP) */
function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

interface ActionItemsProps {
  actionItems: ActionItem[];
  checkedItems: Set<string>;
  setCheckedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  onAddAction: (item: ActionItem) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function ActionItems({
  actionItems, checkedItems, setCheckedItems, onAddAction, showToast,
}: ActionItemsProps) {
  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionContent, setNewActionContent] = useState("");
  const [newActionAssignee, setNewActionAssignee] = useState("");
  const [newActionDeadline, setNewActionDeadline] = useState("");

  if (actionItems.length === 0) {
    return (
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up text-center">
        <IconAlert size={20} className="text-text-muted mx-auto mb-2 block" />
        <p className="text-text-muted">未识别到明确的行动项</p>
      </div>
    );
  }

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6 fade-up">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-text">
          <IconCheckCircle size={20} className="inline mr-2 text-primary" />
          行动项清单
        </h2>
        <span className="text-sm bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
          {actionItems.length}
        </span>
      </div>

      <div>
        {actionItems.map((item) => {
          const checked = checkedItems.has(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-4 rounded-xl border mb-3 transition-all ${
                checked
                  ? "border-effective/30 bg-effective-bg/50"
                  : "border-border hover:border-border-light"
              }`}
            >
              {/* checkbox */}
              <button
                onClick={() => toggleCheck(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 mt-0.5 ${
                  checked
                    ? "bg-effective border-effective"
                    : "border-border hover:border-primary"
                }`}
                aria-label={
                  checked ? "取消完成" : "标记完成"
                }
              >
                {checked && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 7l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium transition-all ${
                    checked
                      ? "line-through opacity-50 text-text-muted"
                      : "text-text"
                  }`}
                >
                  {item.content}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-2 py-0.5 rounded">
                    <IconUser size={12} className="text-primary" />
                    {item.assignee}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-bg text-text-secondary px-2 py-0.5 rounded">
                    <IconCalendar size={12} className="text-text-muted" />
                    {item.deadline}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${priorityBgs[item.priority]}`}
                  >
                    {priorityLabels[item.priority]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-text-muted mt-4 text-right">
        共 {actionItems.length} 项，已完成{" "}
        {checkedItems.size} 项
      </p>
        {/* Add Action Item */}
        <div className="mt-4">
          {showAddAction ? (
            <div className="space-y-2 p-3 rounded-xl bg-bg border border-border">
              <input
                type="text"
                placeholder="行动项内容"
                maxLength={200}
                value={newActionContent}
                onChange={(e) => setNewActionContent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text placeholder:text-text-muted focus:border-primary outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="责任人"
                  maxLength={50}
                  value={newActionAssignee}
                  onChange={(e) => setNewActionAssignee(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text placeholder:text-text-muted focus:border-primary outline-none"
                />
                <input
                  type="text"
                  placeholder="截止时间"
                  maxLength={50}
                  value={newActionDeadline}
                  onChange={(e) => setNewActionDeadline(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text placeholder:text-text-muted focus:border-primary outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowAddAction(false); setNewActionContent(""); setNewActionAssignee(""); setNewActionDeadline(""); }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-surface border border-border text-text-secondary hover:bg-border-light transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (!newActionContent.trim()) return;
                    const newAction: ActionItem = {
                      id: genId(),
                      content: newActionContent.trim(),
                      assignee: newActionAssignee.trim() || "未指定",
                      deadline: newActionDeadline.trim() || "未指定",
                      priority: "medium",
                    };
                    onAddAction(newAction);
                    setNewActionContent("");
                    setNewActionAssignee("");
                    setNewActionDeadline("");
                    setShowAddAction(false);
                    showToast("行动项已添加", "success");
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddAction(true)}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <IconPlus size={12} /> 添加行动项
            </button>
          )}
        </div>
    </div>
  );
}
