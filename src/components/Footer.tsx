"use client";

import Link from "next/link";
import { IconExternal } from "@/components/Icon";

export default function Footer() {
  return (
    <footer className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted border-t border-border-light">
      <span className="font-semibold text-text-secondary">会议废话检测器</span>
      <span>会议废话检测器 · 让每一场会议都值得开</span>
      <Link href="#" className="hover:text-primary transition-colors">
        <span className="flex items-center gap-1">GitHub <IconExternal size={12} /></span>
      </Link>
    </footer>
  );
}
