"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IconDot,
  IconCheckCircle,
  IconArrowRight,
  IconUsers,
  IconClock,
  IconAlert,
  IconZap,
} from "@/components/Icon";

const dataCards = [
  {
    icon: <IconClock size={18} className="text-primary" />,
    value: "8.2h",
    label: "每周开会",
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    icon: <IconAlert size={18} className="text-nonsense" />,
    value: "52%",
    label: "是无效时间",
    color: "text-nonsense",
    bg: "bg-nonsense/5",
  },
  {
    icon: <IconZap size={18} className="text-effective" />,
    value: "10s",
    label: "报告只需",
    color: "text-effective",
    bg: "bg-effective/5",
  },
];

export default function HeroSection() {
  const [analyzedCount, setAnalyzedCount] = useState(1000);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem("analysisHistory") || "[]");
      if (history.length > 0) {
        setAnalyzedCount(Math.max(1000, history.length * 3 + 847));
      }
    } catch {
      // use default
    }
  }, []);

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 pb-24 fade-up hero-glow">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text */}
        <div className="lg:col-span-7">
          {/* Tagline */}
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
            AI 会议效率分析工具
          </p>

          {/* Title with special "废话" treatment */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-text mt-5 leading-[1.05] tracking-tight">
            会议<span className="hero-nonsense-word">废话</span>检测器
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-text-secondary mt-5 max-w-md leading-relaxed">
            粘贴会议纪要，AI 逐句标注废话与重点，自动提取行动项。
            让每一场会议都值得开。
          </p>

          {/* 3 Data Cards */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {dataCards.map((card) => (
              <div
                key={card.label}
                className={`${card.bg} rounded-xl px-3 py-3 text-center`}
              >
                <div className="flex justify-center mb-1.5">{card.icon}</div>
                <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                <p className="text-[11px] text-text-muted mt-0.5 leading-tight">
                  {card.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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

          {/* Social Proof */}
          <p className="mt-5 text-xs text-text-muted flex items-center gap-1.5">
            <span className="text-primary">&#10022;</span>
            已帮助分析 {analyzedCount.toLocaleString()}+ 场会议
          </p>
        </div>

        {/* Right Column - Report Mockup */}
        <div className="lg:col-span-5">
          <div className="hero-mockup-breathe hero-mockup-glow bg-surface rounded-2xl border border-border shadow-sm overflow-hidden stagger-bar">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border-light flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text">Q3 产品规划评审会</p>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                  <IconUsers size={12} /> 2024.03.15 &middot; 1h 42min &middot; 6 人参与
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

              {/* Distribution bars with stagger animation */}
              <div className="mt-5 space-y-2.5 hero-stagger-bar">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <IconDot size={9} className="text-effective" /> 有效信息
                    </span>
                    <span className="text-effective font-medium">42%</span>
                  </div>
                  <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                    <div className="h-full bg-effective rounded-full hero-stagger-bar" style={{ width: "42%" }} />
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
                    <div className="h-full bg-repetitive rounded-full hero-stagger-bar" style={{ width: "28%" }} />
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
                    <div className="h-full bg-nonsense rounded-full hero-stagger-bar" style={{ width: "30%" }} />
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
