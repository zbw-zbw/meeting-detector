import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "历史记录 - 会议废话检测器",
  description: "查看你的所有会议分析记录和效率趋势。",
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
