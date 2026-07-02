import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "会议废话检测器 - AI 会议效率分析工具",
  description:
    "AI 帮你揪出会议中的每一句废话，一键提取行动项，生成会议效率报告。让每一场会议都值得开。",
  keywords:
    "会议效率,废话检测,AI分析,行动项提取,会议纪要,TRAE AI创造力大赛",
  authors: [{ name: "Meeting Detector" }],
  openGraph: {
    title: "会议废话检测器 - AI 会议效率分析工具",
    description:
      "AI 帮你揪出会议中的每一句废话，一键提取行动项，生成会议效率报告。",
    type: "website",
    locale: "zh_CN",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="antialiased">
      <body className="min-h-screen flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
