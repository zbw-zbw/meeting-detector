import Link from "next/link";
import { IconArrowLeft } from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Subtle background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, var(--primary) 0%, transparent 70%)",
          opacity: 0.03,
        }}
      />

      <div className="text-center card-gradient-border bg-surface rounded-3xl p-12 sm:p-16 border border-border shadow-sm max-w-md mx-4">
        <h1 className="text-[10rem] sm:text-[12rem] font-extrabold leading-none number-highlight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, var(--primary), var(--effective))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
        >
          404
        </h1>
        <p className="text-xl font-bold text-text mt-4">页面不存在</p>
        <p className="text-text-secondary mt-2">你访问的页面可能已被移除或不存在</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold cta-btn mt-8"
        >
          <IconArrowLeft size={16} /> 返回首页
        </Link>
      </div>
    </div>
  );
}
