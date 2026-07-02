"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { IconAlert, IconArrowRight } from "@/components/Icon";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6">
            <div className="mb-4">
              <IconAlert size={48} className="text-nonsense mx-auto" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
              页面出了点问题
            </h1>
            <p className="text-text-secondary mt-3">
              可能是数据格式异常，请重新分析一次
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="px-6 py-3 bg-surface border border-border rounded-xl font-semibold text-text hover:bg-bg transition-colors"
            >
              重试
            </button>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold cta-btn"
            >
              重新分析 <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
