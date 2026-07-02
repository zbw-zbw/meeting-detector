# 📊 会议废话检测器

> AI 帮你揪出会议中的每一句废话，一键提取行动项，生成会议效率报告。

参加 **TRAE AI 创造力大赛 · 学习工作赛道** 的全栈 AI 应用。

## ✨ 功能特性

### 🤖 AI 智能分析
- 接入 **DeepSeek API**，逐句分析会议内容
- 精准标注 **废话**（语气词堆砌、空洞附和）、**重复内容**（语义重复）、**有效信息**（数据、结论、任务分配）
- 自动提取行动项，识别责任人和截止时间
- 生成 0-100 效率评分和改进建议

### 📊 可视化报告
- SVG 环形图展示内容结构占比
- 四大核心指标卡片（带数字计数动画）
- 逐句分析详情（支持按类型筛选、展开收起）
- 行动项清单（可勾选标记完成）
- 一键复制报告 / 分享结果

### 📚 历史记录
- 自动保存每次分析结果（最多 50 条）
- 统计概览（总次数、平均分、行动项总计、最低效会议）
- 点击查看历史报告详情

### 🎨 设计亮点
- 浅灰蓝网格点阵背景 + 白色卡片设计系统
- 响应式适配（1024px / 768px / 480px 三断点）
- 滚动渐入动画 + 数字计数动画 + 环形图绘制动画
- `prefers-reduced-motion` 无障碍支持
- 全局 Toast 通知系统

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 14+ (App Router) | 全栈框架，SSG + API Routes |
| TypeScript | 类型安全 |
| Tailwind CSS v4 | 自定义主题色板 |
| DeepSeek API | AI 分析引擎（deepseek-chat 模型） |
| localStorage | 历史记录持久化 |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或其他包管理器

### 安装

```bash
git clone https://github.com/zbw-zbw/meeting-detector.git
cd meeting-detector
npm install
```

### 配置环境变量

创建 `.env.local` 文件：

```bash
# DeepSeek API Key
# 在 https://platform.deepseek.com 获取
DEEPSEEK_API_KEY=your_api_key_here
```

### 运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm run start

# 代码检查
npm run lint
```

访问 [http://localhost:3000](http://localhost:3000) 即可使用。

## 📖 使用指南

1. **粘贴会议内容** — 在分析页粘贴会议纪要、文字记录或聊天记录
2. **点击开始分析** — AI 逐句分析，约 10-30 秒出报告
3. **查看可视化报告** — 效率评分、内容占比、逐句标注、行动项、改进建议
4. **复制/分享报告** — 一键复制纯文本报告或分享链接
5. **查看历史记录** — 所有分析记录自动保存，可随时回看

## 📂 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页落地页
│   ├── analyze/page.tsx      # 分析输入页
│   ├── result/page.tsx       # 可视化结果页
│   ├── history/page.tsx      # 历史记录页
│   ├── api/analyze/route.ts  # DeepSeek API 路由
│   ├── layout.tsx            # 根布局 + SEO
│   └── globals.css           # 全局样式 + 设计系统
├── components/
│   ├── Navbar.tsx            # 导航栏
│   ├── Footer.tsx            # 页脚
│   ├── ToastProvider.tsx     # 全局通知
│   └── sections/             # 首页各区域组件
├── hooks/
│   ├── useFadeUp.ts          # 滚动渐入动画
│   └── useCountUp.ts         # 数字计数动画
├── lib/
│   ├── ai.ts                 # DeepSeek 客户端
│   └── history.ts            # 历史记录工具函数
└── types/
    └── analysis.ts           # 分析结果类型定义
```

## 🎨 设计系统

| 色彩 | 用途 |
|------|------|
| `#2563eb` 科技蓝 | 主色调、有效信息链接 |
| `#10b981` 绿色 | 有效信息、成功状态 |
| `#f59e0b` 橙色 | 重复内容、警告提示 |
| `#ef4444` 红色 | 废话标注、错误状态 |
| `#f8fafc` 浅灰蓝 | 全局背景 |

## ☁️ 部署到 Vercel

1. Fork 本仓库到你的 GitHub
2. 在 [Vercel](https://vercel.com) 导入该仓库
3. 在项目设置中添加环境变量：
   - `DEEPSEEK_API_KEY` = 你的 DeepSeek API Key
4. 部署完成

## 📄 License

MIT

---

**TRAE AI 创造力大赛 · 学习工作赛道 · 2026**
