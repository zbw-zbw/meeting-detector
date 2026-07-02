"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
      <span className="font-semibold text-text-secondary">会议废话检测器</span>
      <span>TRAE AI 创造力大赛 · 学习工作赛道 · 2026</span>
      <Link href="#" className="hover:text-primary transition-colors">
        GitHub ↗
      </Link>
    </footer>
  );
}
