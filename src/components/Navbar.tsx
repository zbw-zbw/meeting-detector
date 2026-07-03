"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { IconChart, IconSun, IconMoon, IconPalette, IconSettings } from "@/components/Icon";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { label: "首页", href: "/" },
  { label: "开始分析", href: "/analyze", isPrimary: true },
  { label: "历史记录", href: "/history" },
  { label: "设置", href: "/settings" },
];

/** Reusable theme toggle button (sun/moon). */
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-text"
      aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
      title={isDark ? "切换到浅色模式" : "切换到深色模式"}
    >
      {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
    </button>
  );
}

/** Theme color dot buttons for reuse in desktop and mobile. */
function ThemeColorDots({
  currentTheme,
  onThemeChange,
  size = "sm",
}: {
  currentTheme: string;
  onThemeChange: (key: string) => void;
  size?: "sm" | "lg";
}) {
  const dotSize = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  return (
    <>
      {[
        { key: "", label: "蓝", color: "#2563eb" },
        { key: "purple", label: "紫", color: "#8b5cf6" },
        { key: "green", label: "绿", color: "#059669" },
        { key: "orange", label: "橙", color: "#ea580c" },
      ].map((t) => (
        <button
          key={t.key}
          onClick={() => onThemeChange(t.key)}
          className={`${dotSize} rounded-full border-2 transition-all hover:scale-110 ${
            currentTheme === t.key
              ? "border-text scale-110 ring-2 ring-offset-2 ring-text"
              : "border-transparent"
          }`}
          style={{ backgroundColor: t.color }}
          title={t.label}
          aria-label={`切换到${t.label}色主题`}
        />
      ))}
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("");
  const themePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("themeColor") || "";
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setCurrentTheme(saved);
    }
  }, []);

  /* close theme picker on outside click */
  useEffect(() => {
    if (!showThemePicker) return;
    const handleClick = (e: MouseEvent) => {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target as Node)) {
        setShowThemePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showThemePicker]);

  const handleThemeChange = (key: string) => {
    if (key) {
      document.documentElement.setAttribute("data-theme", key);
      localStorage.setItem("themeColor", key);
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("themeColor");
    }
    setCurrentTheme(key);
    setShowThemePicker(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-text text-lg shrink-0"
        >
          <IconChart size={24} className="text-primary" />
          <span className="hidden sm:inline">会议废话检测器</span>
          <span className="sm:hidden">废话检测</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.isPrimary) {
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary-dark text-white"
                        : "bg-primary text-white hover:bg-primary-light"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive
                      ? "text-primary"
                      : "text-text-secondary hover:text-text hover:bg-surface"
                  }`}
                >
                  {item.label === "设置" && <IconSettings size={14} className="inline mr-1 -mt-0.5" />}
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Theme Toggle */}
        <div className="hidden md:flex items-center gap-1">
          {/* Theme color picker */}
          <div className="relative" ref={themePickerRef}>
            <button
              onClick={() => setShowThemePicker((v) => !v)}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface transition-all"
              title="切换主题色"
            >
              <IconPalette size={18} />
            </button>
            {showThemePicker && (
              <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-xl shadow-lg p-2 z-50 flex gap-1.5">
                <ThemeColorDots currentTheme={currentTheme} onThemeChange={handleThemeChange} size="lg" />
              </div>
            )}
          </div>
          <ThemeToggleButton />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border px-4 pb-4 mobile-menu-animate">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              if (item.isPrimary) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-semibold text-center transition-all ${
                        isActive
                          ? "bg-primary-dark text-white"
                          : "bg-primary text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-text-secondary hover:text-text hover:bg-surface"
                    }`}
                  >
                    {item.label === "设置" && <IconSettings size={14} className="inline mr-1 -mt-0.5" />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Mobile Theme Toggle + Theme Color Dots */}
          <div className="mt-2 pt-3 border-t border-border-light">
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-1.5">
                <ThemeColorDots currentTheme={currentTheme} onThemeChange={handleThemeChange} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
