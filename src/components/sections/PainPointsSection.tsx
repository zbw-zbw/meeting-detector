"use client";

import { IconClock, IconFileEdit, IconLinkBroken } from "@/components/Icon";

export default function PainPointsSection() {
  return (
    <section className="py-24 border-t border-border-light">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: Section label */}
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              01 — 现状
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mt-4 leading-tight">
              每个打工人
              <br />
              都懂的痛
            </h2>
            <p className="text-text-secondary mt-4 leading-relaxed max-w-xs">
              开了一小时的会，到底说了什么？散会后，谁也记不清。
            </p>
          </div>

          {/* Right: Pain points */}
          <div className="lg:col-span-8">
            {/* Featured pain point */}
            <div className="pb-8 border-b border-border-light">
              <div className="flex items-start gap-4">
                <IconClock size={26} className="text-nonsense mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-text">冗长会议</h3>
                  <p className="text-text-secondary mt-2 leading-relaxed">
                    2 小时的会，有效内容不到
                    <span className="text-nonsense font-bold"> 20 分钟</span>，
                    剩下的全是重复和跑题。
                  </p>
                </div>
              </div>
            </div>

            {/* Two smaller pain points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 pt-8">
              <div className="flex items-start gap-4">
                <IconFileEdit size={24} className="text-repetitive mt-1 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-text">整理纪要</h3>
                  <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                    会后花 30 分钟整理纪要，从一堆废话里捞出 3 条重点。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <IconLinkBroken size={24} className="text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-text">行动项遗失</h3>
                  <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                    会上说了很多&ldquo;下次做&rdquo;，散会后谁也记不清是什么。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
