import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会议对比 - 会议废话检测器",
  description: "多场会议效率对比分析",
};

export default function CompareLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
