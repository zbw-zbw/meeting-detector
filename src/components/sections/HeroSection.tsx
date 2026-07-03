"use client";

import Link from "next/link";
import { IconDot, IconCheckCircle, IconArrowRight, IconUsers } from "@/components/Icon";

export default function HeroSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 pb-24 fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text */}
        <div className="lg:col-span-7">
          {/* Tagline */}
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
            AI 会议效率分析工具
          </p>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-text mt-5 leading-[1.05] tracking-tight">
            会议<span className="text-nonsense">废话</span>检测器
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-text-secondary mt-5 max-w-md leading-relaxed">
            粘贴会议纪要，AI 逐句标注废话与重点，自动提取行动项。
            让每一场会议都值得开。
          </p>

          {/* Inline data point */}
          <p className="mt-8 text-text-secondary border-l-2 border-primary pl-4 max-w-md leading-relaxed">
            职场人每周平均开会
            <span className="text-text font-bold"> 8.2 小时</span>，其中
            <span className="text-nonsense font-bold"> 过半是无效时间</span>。
            而拿到一份分析报告，只需要 <span className="text-text font-bold">10 秒</span>。
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/analyze"
              className="bg-primary text-white px-7 py-3.5 rounded-xl text-base font-semibold cta-btn inline-flex items-center gap-2"
            >
              开始分析会议 <IconArrowRight size={16} />
            </Link>
            <span className="text-sm text-text-muted">
              无需注册，粘贴即用
            </span>
          </div>
        </div>

        {/* Right Column - Report Mockup */}
        <div className="lg:col-span-5">
          <div className="hero-mockup-breathe hero-mockup-glow bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border-light flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text">Q3 产品规划评审会</p>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                  <IconUsers size={12} /> 2024.03.15 · 1h 42min · 6 人参与
                </p>
              </div>
              <span className="text-xs font-medium text-nonsense bg-nonsense-bg rounded px-2 py-1 shrink-0">
                效率偏低
              </span>
            </div>

            {/* Score */}
            <div className="p-5">
              <div className="flex items-center gap-5">
                <svg width="88" height="88" viewBox="0 0 120 120" className="shrink-0">
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="var(--border-light)"
                    strokeWidth="11"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="var(--nonsense)"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray="282.7"
                    strokeDashoffset="161.1"
                    transform="rotate(-90 60 60)"
                    className="ring-animated"
                  />
                  <text
                    x="60"
                    y="60"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--nonsense)"
                    fontSize="30"
                    fontWeight="bold"
                  >
                    43
                  </text>
                </svg>
                <div>
                  <p className="text-xs text-text-muted">会议效率评分</p>
                  <p className="text-sm text-text-secondary mt-1">
                    <span className="text-2xl font-bold text-nonsense">43</span>
                    <span className="text-text-muted"> / 100</span>
                  </p>
                </div>
              </div>

              {/* Distribution bars */}
              <div className="mt-5 space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <IconDot size={9} className="text-effective" /> 有效信息
                    </span>
                    <span className="text-effective font-medium">42%</span>
                  </div>
                  <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                    <div className="h-full bg-effective rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <IconDot size={9} className="text-repetitive" /> 重复内容
                    </span>
                    <span className="text-repetitive font-medium">28%</span>
                  </div>
                  <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                    <div className="h-full bg-repetitive rounded-full" style={{ width: "28%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <IconDot size={9} className="text-nonsense" /> 废话
                    </span>
                    <span className="text-nonsense font-medium">30%</span>
                  </div>
                  <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                    <div className="h-full bg-nonsense rounded-full" style={{ width: "30%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Action items */}
            <div className="px-5 py-4 bg-bg border-t border-border-light">
              <p className="text-xs font-semibold text-text-secondary mb-2.5">
                自动提取 3 项行动项
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-text">
                  <IconCheckCircle size={14} className="text-primary shrink-0" />
                  <span>
                    <strong className="text-primary">@张三</strong> 本周五前完成竞品分析报告
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text">
                  <IconCheckCircle size={14} className="text-primary shrink-0" />
                  <span>
                    <strong className="text-primary">@全员</strong> 下周三 14:00 二次评审会
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
