"use client";

import Link from "next/link";
import { IconExternal, IconChart } from "@/components/Icon";

export default function Footer() {
  return (
    <footer className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 border-t border-border-light">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <span className="font-bold text-text-secondary flex items-center gap-2">
            <IconChart size={16} className="text-primary" /> 会议废话检测器
          </span>
          <p className="text-xs text-text-muted mt-2">
            让每一场会议都值得开
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          <Link
            href="/analyze"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            开始分析
          </Link>
          <Link
            href="/history"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            历史记录
          </Link>
          <Link
            href="/settings"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            设置
          </Link>
          <Link
            href="#"
            className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            GitHub <IconExternal size={12} />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-text-muted md:text-right">
          &copy; 2024-2026 Meeting Detector. Built with AI.
        </div>
      </div>
    </footer>
  );
}
