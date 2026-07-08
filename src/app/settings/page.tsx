"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ToastProvider";
import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconSettings,
  IconTrash,
  IconCheckCircle,
  IconAlert,
  IconSun,
  IconMoon,
  IconPalette,
} from "@/components/Icon";

const THEME_COLORS = [
  { key: "", label: "蓝", color: "#2563eb" },
  { key: "purple", label: "紫", color: "#8b5cf6" },
  { key: "green", label: "绿", color: "#059669" },
  { key: "orange", label: "橙", color: "#ea580c" },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // API Key state
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [savedKey, setSavedKey] = useState(false);

  // Test connection state
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Theme color state
  const [currentTheme, setCurrentTheme] = useState("");

  // Clear data confirm state
  const [clearConfirm, setClearConfirm] = useState(false);

  // Load saved values on mount
  useEffect(() => {
    const stored = localStorage.getItem("deepseekApiKey") || "";
    setApiKey(stored);

    const themeColor = localStorage.getItem("themeColor") || "";
    setCurrentTheme(themeColor);
  }, []);

  // Save API key to localStorage
  const handleSaveKey = useCallback(() => {
    try {
      if (apiKey.trim()) {
        localStorage.setItem("deepseekApiKey", apiKey.trim());
        setSavedKey(true);
        showToast("API Key 已保存", "success");
      } else {
        localStorage.removeItem("deepseekApiKey");
        setSavedKey(false);
        showToast("API Key 已移除", "info");
      }
    } catch {
      showToast("保存失败，浏览器可能不支持 localStorage", "error");
    }
  }, [apiKey, showToast]);

  // Test API key connection
  const handleTestKey = useCallback(async () => {
    if (!apiKey.trim()) {
      showToast("请先输入 API Key", "error");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      setTestResult({ success: data.success, message: data.message });
      if (data.success) {
        showToast("API Key 有效", "success");
      } else {
        showToast(data.message, "error");
      }
    } catch {
      setTestResult({ success: false, message: "网络错误，请检查网络后重试" });
      showToast("网络错误", "error");
    } finally {
      setTesting(false);
    }
  }, [apiKey, showToast]);

  // Set theme color
  const handleSetThemeColor = useCallback((key: string) => {
    if (key) {
      document.documentElement.setAttribute("data-theme", key);
      localStorage.setItem("themeColor", key);
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("themeColor");
    }
    setCurrentTheme(key);
  }, []);

  // Clear all data
  const handleClearData = useCallback(() => {
    if (!clearConfirm) {
      setClearConfirm(true);
      return;
    }
    try {
      localStorage.removeItem("deepseekApiKey");
      localStorage.removeItem("analysisHistory");
      localStorage.removeItem("lastAnalysis");
      localStorage.removeItem("compareItems");
      setApiKey("");
      setSavedKey(false);
      setClearConfirm(false);
      showToast("所有数据已清除", "success");
    } catch {
      showToast("清除失败", "error");
    }
  }, [clearConfirm, showToast]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6">
          {/* Back link */}
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <IconArrowLeft size={14} /> 返回首页
            </Link>
            <span>/</span>
            <span className="text-text-secondary">设置</span>
          </nav>

          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <IconSettings size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text">设置</h1>
                <p className="text-sm text-text-muted mt-0.5">管理 API Key、主题偏好和数据</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Card: API Key */}
            <section className="bg-surface rounded-2xl border border-border p-5 sm:p-6 transition-colors">
              <h2 className="text-lg font-bold text-text mb-4">API Key 配置</h2>

              <div className="space-y-3">
                {/* Input */}
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setSavedKey(false);
                      setTestResult(null);
                    }}
                    aria-label="DeepSeek API Key"
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 pr-12 bg-bg border border-border rounded-xl text-text text-sm placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    aria-label={showKey ? "隐藏 API Key" : "显示 API Key"}
                    type="button"
                  >
                    {showKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-text-muted leading-relaxed">
                  使用自己的 API Key 可以避免服务端限流。Key 仅存储在浏览器本地。测试连接时将临时发送到服务端进行验证，分析过程使用服务端配置的 Key。
                </p>

                {/* Actions row */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSaveKey}
                    disabled={apiKey.trim().length === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <IconCheckCircle size={14} /> 保存
                  </button>
                  <button
                    onClick={handleTestKey}
                    disabled={testing || apiKey.trim().length === 0}
                    aria-label="测试 API Key 连接"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-bg border border-border text-text-secondary text-sm font-medium rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {testing ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    ) : (
                      <IconPalette size={14} />
                    )}
                    {testing ? "测试中..." : "测试连接"}
                  </button>
                </div>

                {/* Test result */}
                {testResult && (
                  <div
                    className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg ${
                      testResult.success
                        ? "bg-effective-bg text-effective"
                        : "bg-nonsense-bg text-nonsense"
                    }`}
                  >
                    {testResult.success ? (
                      <IconCheckCircle size={14} />
                    ) : (
                      <IconAlert size={14} />
                    )}
                    {testResult.message}
                  </div>
                )}
              </div>
            </section>

            {/* Card: Theme Color */}
            <section className="bg-surface rounded-2xl border border-border p-5 sm:p-6 transition-colors">
              <h2 className="text-lg font-bold text-text mb-4">主题色</h2>
              <div className="flex items-center gap-3">
                {THEME_COLORS.map((t) => (
                  <button
                    key={t.key || "default"}
                    onClick={() => handleSetThemeColor(t.key)}
                    className={`w-10 h-10 rounded-full border-[3px] transition-all hover:scale-110 ${
                      currentTheme === t.key
                        ? "border-text scale-110 ring-2 ring-offset-2 ring-text"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: t.color }}
                    title={t.label}
                    aria-label={`切换到${t.label}色主题`}
                  />
                ))}
              </div>
            </section>

            {/* Card: Dark/Light Mode */}
            <section className="bg-surface rounded-2xl border border-border p-5 sm:p-6 transition-colors">
              <h2 className="text-lg font-bold text-text mb-4">外观模式</h2>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-4 py-3 bg-bg border border-border rounded-xl hover:border-primary transition-colors text-left"
              >
                {theme === "dark" ? (
                  <IconSun size={20} className="text-primary shrink-0" />
                ) : (
                  <IconMoon size={20} className="text-primary shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">
                    当前: {theme === "dark" ? "深色模式" : "浅色模式"}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    点击切换到{theme === "dark" ? "浅色" : "深色"}模式
                  </p>
                </div>
                <span className="text-xs text-text-muted">切换</span>
              </button>
            </section>

            {/* Card: Clear Data */}
            <section className="bg-surface rounded-2xl border border-border p-5 sm:p-6 transition-colors">
              <h2 className="text-lg font-bold text-text mb-4">数据管理</h2>
              <p className="text-sm text-text-secondary mb-4">
                清除浏览器中存储的所有历史记录、对比项和 API Key。此操作不可撤销。
              </p>
              <button
                onClick={handleClearData}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  clearConfirm
                    ? "bg-nonsense text-white hover:bg-nonsense/80"
                    : "bg-nonsense-bg text-nonsense hover:bg-nonsense/10 border border-nonsense/20"
                }`}
              >
                <IconTrash size={14} />
                {clearConfirm ? "确认清除所有数据" : "清除所有数据"}
              </button>
              {clearConfirm && (
                <button
                  onClick={() => setClearConfirm(false)}
                  className="ml-3 inline-flex items-center px-4 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  取消
                </button>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
