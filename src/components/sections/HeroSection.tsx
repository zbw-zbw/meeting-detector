"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-28 pb-20 fade-up">
      {/* Badge */}
      <div className="flex justify-center">
        <span className="bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
          TRAE AI 创造力大赛 · 学习工作赛道
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
        {/* Left Column - Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-text">
            会议废话检测器
          </h1>
          <p className="text-xl text-text-secondary mt-4">
            AI 帮你揪出每一句废话，一键提取所有 TODO
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-surface rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">8.2h</div>
              <div className="text-sm text-text-secondary mt-1">每周会议时长</div>
            </div>
            <div className="bg-surface rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">50%+</div>
              <div className="text-sm text-text-secondary mt-1">无效时间占比</div>
            </div>
            <div className="bg-surface rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">10s</div>
              <div className="text-sm text-text-secondary mt-1">AI 分析速度</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/analyze"
              className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold cta-btn inline-flex items-center gap-2"
            >
              开始分析会议 →
            </Link>
          </div>
        </div>

        {/* Right Column - Dashboard Mockup */}
        <div className="flex-shrink-0 max-w-sm w-full">
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="text-sm font-semibold text-text">会议效率报告</h3>

            {/* Ring Progress Chart */}
            <div className="flex justify-center mt-4">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="var(--border-light)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="var(--nonsense)"
                  strokeWidth="10"
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
                  className="text-3xl font-bold"
                  fill="var(--nonsense)"
                  fontSize="28"
                  fontWeight="bold"
                >
                  43
                </text>
              </svg>
            </div>

            {/* Colored Indicators */}
            <div className="flex justify-center gap-3 mt-4">
              <span className="text-xs bg-effective-bg text-effective rounded px-2 py-1">
                🟢 有效 42%
              </span>
              <span className="text-xs bg-repetitive-bg text-repetitive rounded px-2 py-1">
                🟡 重复 28%
              </span>
              <span className="text-xs bg-nonsense-bg text-nonsense rounded px-2 py-1">
                🔴 废话 30%
              </span>
            </div>

            {/* Mock Action Items */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="text-effective">✅</span>
                <span>@张三 本周五前完成竞品分析报告</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="text-effective">✅</span>
                <span>@全员 下周三 14:00 二次评审会</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
