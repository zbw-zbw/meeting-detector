"use client";

import { IconClipboard, IconBot, IconChart } from "@/components/Icon";

export default function StepsSection() {
  const steps = [
    {
      number: "01",
      icon: <IconClipboard size={22} className="text-primary" />,
      title: "粘贴文本",
      description: "粘贴会议纪要或文字稿，支持任意长度",
    },
    {
      number: "02",
      icon: <IconBot size={22} className="text-effective" />,
      title: "AI 分析",
      description: "DeepSeek 逐句分析，10 秒出报告",
    },
    {
      number: "03",
      icon: <IconChart size={22} className="text-nonsense" />,
      title: "查看报告",
      description: "废话标红、重点标绿、行动项一键提取",
    },
  ];

  return (
    <section className="py-24 border-t border-border-light">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              02 — 流程
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mt-4 leading-tight">
              三步搞定会议分析
            </h2>
          </div>
          <p className="text-text-secondary max-w-xs leading-relaxed">
            从粘贴到报告，整个过程不超过一分钟。
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-6 left-[16.66%] right-[16.66%] h-px bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center md:px-4">
                {/* Number node */}
                <div className="w-12 h-12 mx-auto rounded-full bg-bg border border-border flex items-center justify-center text-sm font-bold text-text relative z-10">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  {step.icon}
                  <h3 className="text-lg font-bold text-text">{step.title}</h3>
                </div>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed md:max-w-[220px] md:mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
