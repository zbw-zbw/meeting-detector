import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "会议废话检测器 - AI 会议效率分析工具",
  description:
    "AI 帮你揪出会议中的每一句废话，一键提取行动项，生成会议效率报告。让每一场会议都值得开。",
  keywords:
    "会议效率,废话检测,AI分析,行动项提取,会议纪要",
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
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><rect x='7' y='12' width='3' height='6' rx='0.5' fill='%232563eb' stroke='none'/><rect x='12' y='8' width='3' height='10' rx='0.5' fill='%232563eb' stroke='none'/><rect x='17' y='4' width='3' height='14' rx='0.5' fill='%232563eb' stroke='none'/></svg>",
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
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <ToastProvider>
            <KeyboardShortcuts />
            <ScrollToTop />
            <PageTransition>{children}</PageTransition>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
