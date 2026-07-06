import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "会议废话检测器 - AI 会议效率分析工具",
    template: "%s - 会议废话检测器",
  },
  description:
    "用 AI 分析会议内容，识别有效信息、重复内容和废话，生成效率报告与行动项。让每一场会议都值得开。",
  keywords: [
    "会议效率",
    "会议分析",
    "AI会议",
    "废话检测",
    "会议纪要",
    "行动项追踪",
    "会议质量",
  ],
  authors: [{ name: "Meeting Detector" }],
  creator: "Meeting Detector",
  openGraph: {
    title: "会议废话检测器 - AI 会议效率分析工具",
    description:
      "用 AI 分析会议内容，识别废话，生成效率报告。让每一场会议都值得开。",
    type: "website",
    locale: "zh_CN",
    siteName: "会议废话检测器",
  },
  twitter: {
    card: "summary_large_image",
    title: "会议废话检测器",
    description: "AI 驱动的会议效率分析工具",
  },
  robots: {
    index: true,
    follow: true,
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
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "会议废话检测器",
              description:
                "AI 驱动的会议效率分析工具，识别会议中的有效信息、重复内容和废话",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
              },
              featureList: [
                "AI 会议内容分析",
                "效率评分",
                "逐句分析",
                "行动项识别",
                "发言人效率排行",
                "多会议对比",
                "数据统计仪表盘",
                "Markdown/CSV/JSON 导出",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          跳转到主要内容
        </a>
        <ThemeProvider>
          <ToastProvider>
            <PageTransition>{children}</PageTransition>
            <KeyboardShortcuts />
            <ScrollToTop />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
