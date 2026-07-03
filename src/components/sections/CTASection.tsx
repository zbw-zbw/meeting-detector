"use client";

import Link from "next/link";
import { IconArrowRight } from "@/components/Icon";

export default function CTASection() {
  return (
    <section className="bg-[var(--text)] cta-grid-bg relative">
      {/* Dark mode grid overlay */}
      <div className="absolute inset-0 cta-grid-bg-dark dark:block hidden" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-20 md:py-24 text-center fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bg)]/60">
          现在开始
        </p>
        <h2 className="text-[var(--bg)] text-3xl sm:text-4xl font-extrabold mt-4 tracking-tight">
          别再开没用的会了
        </h2>
        <p className="text-[var(--bg)]/70 text-base mt-4">
          粘贴会议纪要，10 秒获得效率报告
        </p>
        <div className="mt-10">
          <Link
            href="/analyze"
            className="bg-[var(--bg)] text-[var(--text)] px-8 py-3.5 rounded-xl text-base font-semibold cta-btn inline-flex items-center gap-2 hover:bg-white hover:text-[var(--text)] transition-colors"
          >
            立即分析 <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
