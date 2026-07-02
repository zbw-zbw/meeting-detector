import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "分析报告 - 会议废话检测器",
  description: "会议效率可视化报告，包含逐句分析、行动项提取和改进建议。",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
