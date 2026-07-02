"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-20 fade-up">
      <div className="bg-[#0f172a] rounded-3xl p-12 md:p-16 text-center">
        <h2 className="text-white text-4xl md:text-5xl font-extrabold">
          别再开没用的会了
        </h2>
        <p className="text-text-muted text-lg mt-4">
          粘贴会议纪要，10秒获得效率报告
        </p>
        <div className="mt-8">
          <Link
            href="/analyze"
            className="bg-white text-[#0f172a] px-8 py-4 rounded-xl text-lg font-semibold cta-btn inline-flex items-center gap-2"
          >
            立即分析 →
          </Link>
        </div>
      </div>
    </div>
  );
}
