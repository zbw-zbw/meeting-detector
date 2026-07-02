"use client";

export default function FeatureShowcaseSection() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        {/* Feature 1: 废话检测 */}
        <div className="flex flex-col md:flex-row items-center gap-12 fade-up">
          {/* Left Text */}
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-text">
              逐句分析，精准标注
            </h3>
            <p className="text-text-secondary mt-3">
              AI 对每一句话进行有效性分析，标注废话、重复、跑题内容，让无效信息无处遁形
            </p>
          </div>

          {/* Right Mockup Card */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
              <div className="space-y-3">
                {/* Row 1 - Effective */}
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">🟢</span>
                  <p className="text-sm text-text flex-1">
                    本次会议讨论Q3产品规划方向
                  </p>
                  <span className="text-xs bg-effective-bg text-effective rounded px-2 py-0.5 shrink-0">
                    有效信息
                  </span>
                </div>

                {/* Row 2 - Nonsense */}
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">🔴</span>
                  <p className="text-sm text-text flex-1">
                    我觉得这个事情吧，就是说，怎么讲呢
                  </p>
                  <span className="text-xs bg-nonsense-bg text-nonsense rounded px-2 py-0.5 shrink-0">
                    废话 92%
                  </span>
                </div>

                {/* Row 3 - Repetitive */}
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">🟡</span>
                  <p className="text-sm text-text flex-1">
                    就像刚才说的，Q3要聚焦核心功能
                  </p>
                  <span className="text-xs bg-repetitive-bg text-repetitive rounded px-2 py-0.5 shrink-0">
                    重复内容
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: 行动项提取 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mt-20 fade-up">
          {/* Right Text */}
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-text">
              自动识别 TODO
            </h3>
            <p className="text-text-secondary mt-3">
              从冗长会议中精准提取每一个行动项，明确责任人和截止时间
            </p>
          </div>

          {/* Left Mockup Card */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border space-y-3">
              <div className="flex items-center gap-3 bg-surface rounded-lg p-3 shadow-sm" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="text-effective shrink-0">✅</span>
                <span className="text-sm text-text">
                  <strong className="text-primary">@张三</strong> 本周五前完成竞品分析报告
                </span>
              </div>
              <div className="flex items-center gap-3 bg-surface rounded-lg p-3 shadow-sm" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="text-effective shrink-0">✅</span>
                <span className="text-sm text-text">
                  <strong className="text-primary">@李四</strong> 下周一提交 UI 设计初稿
                </span>
              </div>
              <div className="flex items-center gap-3 bg-surface rounded-lg p-3 shadow-sm" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="text-effective shrink-0">✅</span>
                <span className="text-sm text-text">
                  <strong className="text-primary">@全员</strong> 下周三 14:00 二次评审会
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: 效率评分 */}
        <div className="flex flex-col md:flex-row items-center gap-12 mt-20 fade-up">
          {/* Left Text */}
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-text">
              量化会议质量
            </h3>
            <p className="text-text-secondary mt-3">
              为每场会议生成0-100效率评分，用数据告诉你这个会到底值不值得开
            </p>
          </div>

          {/* Right Mockup */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-center gap-8">
                {/* Ring Score */}
                <svg width="100" height="100" viewBox="0 0 120 120" className="shrink-0">
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
                    fill="var(--nonsense)"
                    fontSize="28"
                    fontWeight="bold"
                  >
                    43
                  </text>
                </svg>

                {/* Stat Bars */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">有效</span>
                      <span className="text-effective font-medium">42%</span>
                    </div>
                    <div className="h-2 bg-border-light rounded-full overflow-hidden">
                      <div className="h-full bg-effective rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">重复</span>
                      <span className="text-repetitive font-medium">28%</span>
                    </div>
                    <div className="h-2 bg-border-light rounded-full overflow-hidden">
                      <div className="h-full bg-repetitive rounded-full" style={{ width: "28%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">废话</span>
                      <span className="text-nonsense font-medium">30%</span>
                    </div>
                    <div className="h-2 bg-border-light rounded-full overflow-hidden">
                      <div className="h-full bg-nonsense rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: 改进建议 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mt-20 fade-up">
          {/* Right Text */}
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-text">
              AI 改进建议
            </h3>
            <p className="text-text-secondary mt-3">
              基于分析结果给出具体的会议改进建议，帮助团队持续提升会议效率
            </p>
          </div>

          {/* Left Mockup */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border space-y-3">
              <div className="bg-bg rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0">💡</span>
                <p className="text-sm text-text">减少会议参与者，控制在5人以内</p>
              </div>
              <div className="bg-bg rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0">💡</span>
                <p className="text-sm text-text">会前发送议题清单，限制讨论范围</p>
              </div>
              <div className="bg-bg rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0">💡</span>
                <p className="text-sm text-text">引入10分钟站立会替代长会</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
