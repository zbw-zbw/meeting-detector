import type { Metadata } from "next";
export const metadata: Metadata = { title: "设置 - 会议废话检测器" };
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
