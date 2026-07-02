"use client";

export default function ScenariosSection() {
  const scenarios = [
    {
      emoji: "👨‍💼",
      role: "项目经理",
      description: "每天3-5个会，需要快速提取行动项分发给团队",
    },
    {
      emoji: "👩‍💻",
      role: "普通员工",
      description: "被拉进各种会议，只想知道跟自己相关的 TODO",
    },
    {
      emoji: "👨‍💼",
      role: "团队 Leader",
      description: "想用数据推动团队改善会议文化，减少无效会议",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-text">
          谁需要会议废话检测器？
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className="bg-surface rounded-2xl p-6 shadow-sm"
            >
              <div className="text-4xl mb-3">{scenario.emoji}</div>
              <h3 className="font-semibold text-text text-lg">{scenario.role}</h3>
              <p className="text-text-secondary text-sm mt-2">
                {scenario.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
