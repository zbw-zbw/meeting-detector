import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "开始分析 - 会议废话检测器",
  description: "粘贴会议纪要或文字记录，AI 帮你逐句分析废话、提取行动项。",
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
