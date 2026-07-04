import type { Metadata } from "next";

export const metadata: Metadata = { title: "数据统计 - 会议废话检测器" };

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
