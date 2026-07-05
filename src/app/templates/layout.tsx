import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会议模板库 - 会议废话检测器",
  description: "选择预设会议场景模板，快速体验 AI 会议效率分析。",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
