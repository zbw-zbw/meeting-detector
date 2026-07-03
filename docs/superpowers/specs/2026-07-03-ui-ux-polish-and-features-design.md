# 会议废话检测器 - UI/UX 全面打磨与新功能设计

日期：2026-07-03

## 项目现状

基于 Next.js 16 App Router + Tailwind CSS 4 + DeepSeek API 的会议效率分析工具，包含四页结构（首页、分析、结果、历史），暗黑模式、fade-up 动画、Markdown 导出等功能已就绪。

## 改进计划概览

分三个批次（P0/P1/P2）按优先级迭代，每批次包含视觉升级、交互优化、功能增强三个维度。每个批次聚焦高价值低风险改进，确保每次改动立竿见影。

---

## P0：核心体验打磨（立即执行）

### 1. 发言人效率排行（功能增强 - 最高优先级）

**背景**：AI 返回的 `SentenceAnalysis` 已包含 `speaker` 字段，数据已就绪，只需前端聚合。

**实现方案**：

在结果页"逐句分析详情"区域和"行动项清单"之间，新增"发言人效率"面板：

```
┌─────────────────────────────────────────────┐
│ 发言人效率排行                          fade-up │
│                                              │
│ 张总  ████████████████░░░░░  45% 有效  14条   │
│ 赵开发 ████████████████████░░  75% 有效   3条 │
│ 小陈  ██████████████████████  95% 有效   2条   │
│ 李经理 ████████████░░░░░░░░░  35% 有效   7条   │
│ ...                                          │
│                                              │
│ [效率最高的发言人]  [废话最多的发言人]          │
└─────────────────────────────────────────────┘
```

- 聚合逻辑：遍历 `sentences`，按 `speaker` 分组，统计每人 effective/repetitive/nonsense 数量，计算有效率
- 按有效率降序排列
- 每行：发言人名称 + 三色堆叠水平条（有效/重复/废话比例）+ 发言条数 + 有效率百分比
- 面板顶部标注"基于逐句分析数据，仅供参考"
- 如果 AI 未返回 speaker 数据（全部为 undefined），则不显示此面板

**涉及文件**：`src/app/result/page.tsx`（新增渲染区域）

### 2. 分析页输入区增强（交互优化）

**2a. textarea focus 边框动画**

当前 textarea 有 border，focus 时变色。改为 focus 时边框有从左到右的渐变扫描动画（primary 色光带），让用户感受到"输入区已激活"。

- 实现：CSS `@keyframes borderScan`，通过 `background: linear-gradient(...)` + `background-size: 300%` + `animation` 实现
- `globals.css` 新增 `.textarea-focus-ring` class

**2b. 拖拽状态增强**

当前拖拽文件时 textarea 显示变化。改为整个输入区域（包含字数统计和按钮区）变为 primary 色 10% 背景 + 虚线边框 + 居中显示拖拽提示图标，形成明确的视觉反馈。

- 在 `analyze/page.tsx` 中扩展 `isDragging` 时的渲染范围

**2c. 清空按钮反馈**

当前清空后无反馈。改为清空后 textarea 区域短暂（1s）显示一个内联提示"已清空，可重新粘贴"，用淡出动画消失。

### 3. 分析进度条升级（交互优化）

当前三步加载是静态文字切换。改为带进度条的步骤指示器：

```
  ● 文本预处理 ──── ○ 内容分类分析 ──── ○ 生成分析报告

  ● 文本预处理 ──── ● 内容分类分析 ──── ○ 生成分析报告

  ● 文本预处理 ──── ● 内容分类分析 ──── ● 生成分析报告 ✓
```

- 步骤 1 进行中：第一个圆点加脉冲动画，连接线为虚线
- 步骤完成：圆点填充 primary 色 + 勾选图标，连接线变为实线
- 全部完成：最后一步显示勾选，0.5s 后跳转

**涉及文件**：`src/app/analyze/page.tsx`（替换当前加载 UI）、`src/app/globals.css`（新增 step indicator 样式）

### 4. 句子分析卡片 hover 微交互（视觉升级）

当前逐句分析卡片是静态的。添加：

- hover 时卡片 `translateY(-2px)` + `shadow-lg`，过渡 0.2s
- 置信度条在 hover 时宽度微扩展 + 加渐变色
- 当前已选筛选类型的卡片左侧 border 加粗

**涉及文件**：`src/app/globals.css`（新增 `.sentence-card` hover 样式）、`src/app/result/page.tsx`（添加 class）

### 5. Toast 通知增强（交互优化）

当前 Toast 是纯文字 + 类型颜色。增强：

- success 类型：左侧加一个绿色勾选圆圈图标（SVG stroke-dashoffset 绘制动画）
- error 类型：左侧加红色感叹号图标 + 入场时微抖动（shake）
- info 类型：左侧加蓝色信息图标
- 图标组件新增：`IconCheckCircle`、`IconAlert` 已存在，复用即可

**涉及文件**：`src/components/ToastProvider.tsx`

### 6. 环形图动画升级（视觉升级）

当前结果页的 SVG 环形图是静态渲染的。增加绘制动画：

- 三段弧线在面板进入视口（fade-up visible）时，从 0 到目标长度的 stroke-dashoffset 动画
- 动画时长 1.2s，ease-out，三段弧线有 0.1s 的错开延迟
- 已有 `ringDraw` keyframe 可复用

**涉及文件**：`src/app/result/page.tsx`（环形图 SVG 部分）

### 7. 指标卡片状态指示（视觉升级）

效率评分卡片中，根据分数值显示不同视觉指示：

- >=90：绿色背景 + 微妙的光晕脉冲（暗示"优秀"）
- 70-89：蓝色背景，无脉冲
- 50-69：黄色背景 + 黄色脉冲点（暗示"需关注"）
- <50：红色背景 + 红色脉冲点（暗示"需改进"）

脉冲指示器用 CSS `@keyframes pulse` 实现，`::after` 伪元素。

**涉及文件**：`src/app/globals.css`（新增 `.score-pulse` 动画）、`src/app/result/page.tsx`

### 8. 分享结果优化（功能增强）

当前分享是纯文本。优化为生成结构化文本卡片：

- 重新格式化分享文本，加入 ASCII 框线、对齐的效率分数和百分比
- 保留当前 Web Share API 和 clipboard fallback 逻辑
- 分享文本示例：

```
┌─────────────────────────────────┐
│     会议效率报告                  │
│                                 │
│  Q3产品规划讨论会                │
│  效率评分: 65分 (一般)           │
│  有效 60% | 重复 20% | 废话 20% │
│  26句分析 | 3个行动项           │
│                                 │
│  由「会议废话检测器」AI 生成     │
└─────────────────────────────────┘
```

**涉及文件**：`src/app/result/page.tsx`（handleShare 函数）

---

## P1：深度打磨（第二批）

### 9. 历史页搜索和筛选（功能增强）

- 顶部新增搜索框：按会议标题模糊搜索，实时过滤
- 分数筛选：三个标签按钮（高效/中等/低效），点击切换
- 筛选为空时显示"没有匹配的记录"

**涉及文件**：`src/app/history/page.tsx`

### 10. 会议效率趋势图（功能增强）

在历史页统计卡片下方新增 SVG 折线图：

- X 轴：分析时间（最近 10 次）
- Y 轴：效率分数（0-100）
- 折线颜色随分数变化（绿->蓝->黄->红）
- 每个数据点 hover 显示详细信息

**涉及文件**：`src/app/history/page.tsx`（新增组件区域）、可能新增 `src/components/TrendChart.tsx`

### 11. 键盘导航增强（交互优化）

- 结果页：`Esc` 返回分析页
- 历史页：上下箭头切换记录高亮，`Enter` 查看报告
- 全局：`Ctrl/Cmd + K` 跳转到分析页（如果不在分析页）

**涉及文件**：`src/app/result/page.tsx`、`src/app/history/page.tsx`

### 12. 行动项面板升级（交互优化）

- 勾选完成时：文字加 `line-through` + 淡化 opacity，勾选动画
- 底部新增"添加行动项"按钮：展开内联输入框（内容 + 责任人 + 截止时间），保存到当前 result 数据中（但不影响 localStorage 的原始分析结果）
- 新增的行动项仅存在于当前页面会话中（sessionStorage 或 state）

**涉及文件**：`src/app/result/page.tsx`

### 13. 首页 Hero Mockup 动画（视觉升级）

右侧 Mockup 报告卡片添加微妙的"呼吸"动画：
- 卡片整体微妙的 scale(1.01) -> scale(1) 循环（4s）
- 环形图区域有旋转的渐变光晕
- 使用 CSS animation 实现，不影响性能

**涉及文件**：`src/components/sections/HeroSection.tsx`、`src/app/globals.css`

### 14. 暗色模式过渡动画（视觉升级）

当前切换主题时颜色瞬间变化。添加 0.3s 的过渡：

- `<html>` 标签添加 `transition: background-color 0.3s, color 0.3s`
- 所有使用 CSS 变量的元素自动继承过渡效果

**涉及文件**：`src/app/globals.css`

### 15. 分数区域 Signature Moment（视觉升级）

效率评分区域入场时做组合动画：

- 数字 countUp 动画（已有）
- 环形图围绕分数绘制（P0 的第 6 项）
- 分数卡片背景有一个从中心向外扩散的 radial-gradient 闪光（0.6s）
- 三个动画同步启动，错开 0.2s

**涉及文件**：`src/app/globals.css`（新增 `.score-flash` 动画）、`src/app/result/page.tsx`

### 16. 深度洞察模块（功能增强）

在结果页"会议摘要"下方新增"深度洞察"区域，纯前端计算：

- 最啰嗦的发言人（发言最多但有效率最低）
- 最简洁的发言人（发言最少但有效率最高）
- 重复率最高的短语（提取 reason 中提及重复的关键词）

数据均来自已有的 sentences 数组，无需 AI 额外计算。

**涉及文件**：`src/app/result/page.tsx`

---

## P2：锦上添花（第三批）

### 17. 自定义主题色（功能增强）

设置面板（齿轮图标触发底部抽屉），4 个预设色板：蓝/紫/绿/橙。

- 通过修改 `<html>` 上的 data attribute（如 `data-theme="purple"`）切换 CSS 变量
- 选择存储到 localStorage
- `globals.css` 中定义 4 组变量覆盖

**涉及文件**：新增 `src/components/ThemeCustomizer.tsx`、`src/app/globals.css`、`src/components/Navbar.tsx`

### 18. 打印样式优化（视觉升级）

`@media print` 样式表：
- 隐藏导航栏、Footer、操作按钮
- 结果页全宽显示，优化纸张排版
- 环形图和图表确保打印友好

**涉及文件**：`src/app/globals.css`

### 19. 智能输入提示（交互优化）

分析页的智能提示：
- 当粘贴文本包含"会议"、"讨论"等关键词时，显示"检测到会议记录格式"
- 当字数在 10-200 之间时，显示具体改善建议（如"建议包含至少 3 位发言人的对话以获得更准确的发言人分析"）
- 当粘贴纯英文文本时，提示"当前模型对中文会议分析更准确"

**涉及文件**：`src/app/analyze/page.tsx`

### 20. 展开更多手风琴动画（交互优化）

逐句分析的"展开更多"改为平滑手风琴展开：
- 使用 CSS `max-height` + `overflow: hidden` + `transition`
- 或使用 `grid-template-rows: 0fr -> 1fr` 技巧

**涉及文件**：`src/app/globals.css`、`src/app/result/page.tsx`

### 21. 多会议对比（功能增强）

历史页新增"对比"功能：
- 复选框选择 2-3 条记录
- 点击"对比"进入对比视图
- 并排展示效率分数、废话比例、行动项数量
- 差异高亮显示

**涉及文件**：`src/app/history/page.tsx`（可能新增 `src/app/compare/page.tsx`）

### 22. 数据导出增强（功能增强）

除 Markdown 外新增：
- CSV 导出：逐句数据（发言人、内容、类型、置信度、原因）
- JSON 导出：完整结构化分析结果

**涉及文件**：`src/lib/export.ts`（新增 `downloadCSV`、`downloadJSON` 函数）、`src/app/result/page.tsx`

---

## 技术约束

- 所有新增动画需尊重 `prefers-reduced-motion: reduce`
- 新增组件需适配暗色模式（使用 CSS 变量，非硬编码颜色）
- 移动端响应式：所有新增面板需在移动端正常显示
- 无外部动画库依赖（纯 CSS + React hooks 实现）
- localStorage 容量限制：历史记录保持 50 条上限
