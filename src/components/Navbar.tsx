"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IconChart, IconSun, IconMoon } from "@/components/Icon";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { label: "首页", href: "/" },
  { label: "开始分析", href: "/analyze", isPrimary: true },
  { label: "历史记录", href: "/history" },
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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <span>会议废话检测器</span>
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
        <div className="hidden md:flex items-center">
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
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Mobile Theme Toggle */}
          <div className="mt-2 pt-3 border-t border-border-light flex items-center">
            <ThemeToggleButton />
          </div>
        </div>
      )}
    </header>
  );
}
