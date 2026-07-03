"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { IconX } from "@/components/Icon";

const SHORTCUTS = [
  {
    keys: ["Ctrl", "Enter"],
    description: "开始分析",
    scope: "分析页面",
  },
  {
    keys: ["?"],
    description: "显示快捷键帮助",
    scope: "全局",
  },
  {
    keys: ["Esc"],
    description: "关闭弹窗 / 帮助面板",
    scope: "全局",
  },
  {
    keys: ["↑", "↓"],
    description: "历史记录中导航",
    scope: "历史页面",
  },
  {
    keys: ["Enter"],
    description: "查看选中的历史记录",
    scope: "历史页面",
  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary text-xs font-mono shadow-sm">
      {children}
    </kbd>
  );
}

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, toggle, close]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="键盘快捷键"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        onKeyDown={close}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md p-6 animate-modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text">键盘快捷键</h2>
          <button
            onClick={close}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-border-light transition-colors"
            aria-label="关闭"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-border-light/50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text">
                  {shortcut.description}
                </span>
                <span className="text-xs text-text-muted mt-0.5">
                  {shortcut.scope}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={key} className="flex items-center gap-1">
                    <Kbd>{key}</Kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span className="text-text-muted text-xs">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-xs text-text-muted mt-5 text-center">
          按 <Kbd>Esc</Kbd> 或点击遮罩关闭此面板
        </p>
      </div>
    </div>
  );
}
