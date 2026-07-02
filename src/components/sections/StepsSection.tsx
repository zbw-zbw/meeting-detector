"use client";

export default function StepsSection() {
  const steps = [
    {
      number: 1,
      emoji: "📋",
      title: "粘贴文本",
      description: "粘贴会议纪要或文字稿，支持任意长度",
      borderColor: "border-primary",
    },
    {
      number: 2,
      emoji: "🤖",
      title: "AI 分析",
      description: "DeepSeek AI 逐句分析，10秒出报告",
      borderColor: "border-effective",
    },
    {
      number: 3,
      emoji: "📊",
      title: "查看报告",
      description: "废话标红、重点标绿、行动项一键提取",
      borderColor: "border-nonsense",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-text">
          三步搞定会议分析
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`bg-surface rounded-2xl p-6 shadow-sm border-b-4 ${step.borderColor}`}
            >
              {/* Circle Number */}
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>
              <div className="text-3xl mt-3">{step.emoji}</div>
              <h3 className="font-semibold mt-3 text-text">{step.title}</h3>
              <p className="text-text-secondary text-sm mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
