"use client";

export default function PainPointsSection() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 fade-up">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-text">
          每个打工人都懂的痛
        </h2>
        <p className="text-center text-text-secondary mt-3">
          开了一小时的会，到底说了什么？
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Card 1 */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm" style={{ borderTop: "3px solid #ef4444" }}>
            <div className="text-3xl mb-3">🕐</div>
            <h3 className="text-lg font-semibold text-text">冗长会议</h3>
            <p className="text-text-secondary text-sm mt-2">
              2小时的会，有效内容不到20分钟，剩下全是重复和跑题
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm" style={{ borderTop: "3px solid #f59e0b" }}>
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-text">整理纪要</h3>
            <p className="text-text-secondary text-sm mt-2">
              会后花30分钟整理纪要，从一堆废话里提取3条重点
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm" style={{ borderTop: "3px solid #2563eb" }}>
            <div className="text-3xl mb-3">🤷</div>
            <h3 className="text-lg font-semibold text-text">行动项遗失</h3>
            <p className="text-text-secondary text-sm mt-2">
              会上说了很多&lsquo;下次做&rsquo;，但散会后谁也记不清是什么
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
