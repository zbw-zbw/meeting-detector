"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { IconCheckCircle, IconAlert, IconClose } from "@/components/Icon";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Graceful fallback: if no provider, do nothing
    return { showToast: () => {} };
  }
  return ctx;
}

const toastConfig: Record<ToastType, { bg: string; icon: typeof IconCheckCircle }> = {
  success: { bg: "bg-effective", icon: IconCheckCircle },
  error: { bg: "bg-nonsense", icon: IconAlert },
  info: { bg: "bg-primary", icon: IconCheckCircle },
};

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((toast) => {
          const cfg = toastConfig[toast.type];
          const ToastIcon = cfg.icon;
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium pointer-events-auto ${cfg.bg}`}
              style={{
                animation: "toastSlideIn 0.3s ease-out",
              }}
            >
              <ToastIcon size={16} className="shrink-0 opacity-90" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                aria-label="关闭通知"
              >
                <IconClose size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
