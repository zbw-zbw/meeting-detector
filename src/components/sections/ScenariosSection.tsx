"use client";

import { IconTarget, IconUsers, IconMessageSquare } from "@/components/Icon";

export default function ScenariosSection() {
  const scenarios = [
    {
      icon: <IconTarget size={20} className="text-primary" />,
      role: "项目经理",
      initial: "PM",
      gradient: "from-primary to-primary/60",
      description: "每天 3-5 个会，需要快速提取行动项分发给团队",
      tag: "每日必用",
      tagColor: "bg-primary/10 text-primary",
    },
    {
      icon: <IconUsers size={20} className="text-primary" />,
      role: "普通员工",
      initial: "E",
      gradient: "from-effective to-effective/60",
      description: "被拉进各种会议，只想知道跟自己相关的 TODO",
      tag: "每周使用",
      tagColor: "bg-effective/10 text-effective",
    },
    {
      icon: <IconMessageSquare size={20} className="text-primary" />,
      role: "团队 Leader",
      initial: "L",
      gradient: "from-repetitive to-repetitive/60",
      description: "想用数据推动团队改善会议文化，减少无效会议",
      tag: "按需使用",
      tagColor: "bg-repetitive/10 text-repetitive",
    },
  ];

  return (
    <section className="py-20 border-t border-border-light">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              04 — 人群
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mt-4 leading-tight">
              为这些人设计
            </h2>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-border-light">
              {scenarios.map((scenario, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 py-5 first:pt-0 last:pb-0 rounded-lg px-3 -mx-3 transition-colors duration-200 hover:bg-primary/5"
                >
                  <span className="shrink-0 flex items-center gap-3">
                    {/* Avatar circle with initial */}
                    <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${scenario.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {scenario.initial}
                    </span>
                    <span className="font-bold text-text">{scenario.role}</span>
                    {/* Recommendation tag */}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${scenario.tagColor}`}>
                      {scenario.tag}
                    </span>
                  </span>
                  <span className="hidden sm:block w-px h-5 bg-border-light" />
                  <span className="text-text-secondary text-sm leading-relaxed">
                    {scenario.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
