import Link from "next/link";
import { IconArrowLeft } from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-primary/20">404</h1>
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
