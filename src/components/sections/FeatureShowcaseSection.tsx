"use client";

import { IconDot, IconCheckCircle, IconLightbulb } from "@/components/Icon";

export default function FeatureShowcaseSection() {
  return (
    <section className="py-24 border-t border-border-light" id="features">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
            03 — 功能
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text mt-4 leading-tight">
            不只是检测废话
          </h2>
        </div>

        {/* Feature 1: Analysis + Quantification (integrated panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center fade-up">
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-bold text-text">逐句分析，量化效率</h3>
            <p className="text-text-secondary mt-3 leading-relaxed">
              AI 对每一句话标注有效性，识别废话、重复与跑题。为整场会议生成
              0-100 效率评分，用数据告诉你这个会到底值不值得开。
            </p>
          </div>

          {/* Integrated analysis panel */}
          <div className="lg:col-span-8">
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Sentences */}
                <div className="md:col-span-3 p-5 space-y-3.5 md:border-r md:border-border-light">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center shrink-0 pt-1">
                      <IconDot size={9} className="text-effective" />
                    </span>
                    <p className="text-sm text-text flex-1 leading-relaxed">
                      本次会议讨论 Q3 产品规划方向
                    </p>
                    <span className="text-xs bg-effective-bg text-effective rounded px-2 py-0.5 shrink-0">
                      有效信息
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center shrink-0 pt-1">
                      <IconDot size={9} className="text-nonsense" />
                    </span>
                    <p className="text-sm text-text flex-1 leading-relaxed">
                      我觉得这个事情吧，就是说，怎么讲呢
                    </p>
                    <span className="text-xs bg-nonsense-bg text-nonsense rounded px-2 py-0.5 shrink-0">
                      废话 92%
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center shrink-0 pt-1">
                      <IconDot size={9} className="text-repetitive" />
                    </span>
                    <p className="text-sm text-text flex-1 leading-relaxed">
                      就像刚才说的，Q3 要聚焦核心功能
                    </p>
                    <span className="text-xs bg-repetitive-bg text-repetitive rounded px-2 py-0.5 shrink-0">
                      重复内容
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="md:col-span-2 p-5 bg-bg flex flex-col justify-center">
                  <div className="flex items-center gap-4">
                    <svg width="76" height="76" viewBox="0 0 120 120" className="shrink-0">
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
                        fontSize="32"
                        fontWeight="bold"
                      >
                        43
                      </text>
                    </svg>
                    <div className="space-y-2 flex-1">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary">有效</span>
                          <span className="text-effective font-medium">42%</span>
                        </div>
                        <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                          <div className="h-full bg-effective rounded-full" style={{ width: "42%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary">重复</span>
                          <span className="text-repetitive font-medium">28%</span>
                        </div>
                        <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                          <div className="h-full bg-repetitive rounded-full" style={{ width: "28%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary">废话</span>
                          <span className="text-nonsense font-medium">30%</span>
                        </div>
                        <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                          <div className="h-full bg-nonsense rounded-full" style={{ width: "30%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: TODO extraction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mt-20 fade-up">
          {/* Mockup */}
          <div className="lg:col-span-7 lg:order-1">
            <div className="bg-surface border border-border rounded-2xl p-5">
              <p className="text-xs font-semibold text-text-secondary mb-3">
                提取到 3 项行动项
              </p>
              <div className="space-y-2.5">
                <div
                  className="flex items-center gap-3 bg-bg rounded-lg p-3"
                  style={{ borderLeft: "4px solid var(--primary)" }}
                >
                  <IconCheckCircle size={15} className="text-primary shrink-0" />
                  <span className="text-sm text-text">
                    <strong className="text-primary">@张三</strong> 本周五前完成竞品分析报告
                  </span>
                </div>
                <div
                  className="flex items-center gap-3 bg-bg rounded-lg p-3"
                  style={{ borderLeft: "4px solid var(--primary)" }}
                >
                  <IconCheckCircle size={15} className="text-primary shrink-0" />
                  <span className="text-sm text-text">
                    <strong className="text-primary">@李四</strong> 下周一提交 UI 设计初稿
                  </span>
                </div>
                <div
                  className="flex items-center gap-3 bg-bg rounded-lg p-3"
                  style={{ borderLeft: "4px solid var(--primary)" }}
                >
                  <IconCheckCircle size={15} className="text-primary shrink-0" />
                  <span className="text-sm text-text">
                    <strong className="text-primary">@全员</strong> 下周三 14:00 二次评审会
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 lg:order-2">
            <h3 className="text-2xl font-bold text-text">自动识别 TODO</h3>
            <p className="text-text-secondary mt-3 leading-relaxed">
              从冗长会议中精准提取每一个行动项，明确责任人和截止时间，散会即落地。
            </p>
            <p className="text-sm text-text-muted mt-4 flex items-start gap-2 leading-relaxed">
              <IconLightbulb size={16} className="text-repetitive mt-0.5 shrink-0" />
              <span>
                还会基于分析结果给出会议改进建议，帮助团队持续提升效率。
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
