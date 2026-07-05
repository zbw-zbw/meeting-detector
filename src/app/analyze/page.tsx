"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFadeUp } from "@/hooks/useFadeUp";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { saveToHistory } from "@/lib/history";
import { IconClipboard, IconCalendar, IconLightbulb, IconSearch, IconAlert, IconFileText, IconClose, IconCheckCircle, IconCheck, IconClock, IconUsers, IconBook } from "@/components/Icon";

const EXAMPLES: Record<string, string> = {
  planning: `会议主题：Q3产品规划讨论会
时间：2024年7月15日 14:00-15:32
参会人：张总、李经理、王设计、赵开发、小陈、小刘

张总：好，大家都到齐了吧？那我们开始吧。今天主要是讨论一下Q3的产品规划，嗯，这个事情其实之前也提过几次了，但是一直没有一个明确的结论。我觉得吧，我们还是要好好讨论讨论。

李经理：对对对，张总说得对，这个事情确实需要好好讨论一下。我之前也在想这个问题，就是说，怎么讲呢，Q3的方向到底是什么？其实我觉得吧，还是要从用户需求出发。

王设计：我插一句啊，其实用户调研的数据我们上周已经出了，核心发现是：60%的用户希望增加数据导出功能，45%的用户觉得现在的界面太复杂。

张总：嗯嗯，对对对，数据导出这个事情，我记得去年Q4就有人提过，是不是？

赵开发：是的张总，去年Q4确实讨论过，当时因为排期紧没做。从技术角度看，数据导出功能大概需要2周开发时间。

小陈：我补充一下，竞品分析显示，市面上80%的同类产品都支持数据导出，这确实是我们的短板。我建议Q3把这个作为P0优先级。

李经理：嗯，小陈说的有道理。不过话说回来，我们还得考虑其他方面，就是说，不能只看这一个功能。我觉得界面简化也很重要，大家觉得呢？其实这个事情吧，就是那个意思，大家懂的。

张总：好好好，那这样，数据导出和界面简化都做，优先做数据导出。还有其他的吗？

小刘：我提一下，上个月客户反馈最多的bug是登录偶尔失败的问题，这个需要Q3修复。

赵开发：这个bug我查过了，是token刷新的逻辑问题，修复大概需要3天。我建议7月底之前修掉。

张总：行行行，那就这样定了。还有别的事情吗？没有的话就散会吧。嗯，大家辛苦了，好好干。

李经理：好的张总，那我回去整理一下会议纪要。大家加油！`,

  weekly: `会议主题：产品团队周会
时间：2024年7月18日 10:00-10:45
参会人：王总监、前端组-小李、后端组-老张、测试组-小赵、产品-小林

王总监：开始吧，按顺序汇报各组本周进展和下周计划。前端先来。

小李：好的。本周完成了用户中心页面重构，已提测。遇到一个问题：设计稿中的动效在低端机上卡顿，和王设计沟通后简化了动画方案。下周计划：完成订单列表页开发。

老张：后端这边，本周完成了支付接口的联调，和第三方支付平台的对接测试通过。另外，数据库慢查询优化也做完了，首页加载速度从3.2秒降到了1.1秒。下周计划：完成数据导出API开发。

小赵：测试组本周完成了V2.3版本的全量回归测试，发现3个P2级别bug，已提给开发。用户中心的测试预计下周三完成。

小林：产品侧，本周完成了Q3需求文档的评审，和运营确认了7月底的营销活动方案。有一个需求变更需要同步：数据导出功能需要增加"按时间范围筛选"的能力，@老张 评估下工期影响。

老张：收到，我评估后今天下班前回复。

王总监：很好。总结一下本周各组都按计划推进，没有阻塞问题。注意事项：7月底是V2.3版本的发布节点，请各组确保本周内不要引入新需求。散会。`,

  brainstorm: `会议主题：新功能头脑风暴
时间：2024年7月20日 15:00-16:15
参会人：产品经理-小王、设计师-阿花、前端-大刘、后端-老李、运营-小美

小王：今天的目的是脑暴一下接下来可以做的创新功能。大家随便说，不设限制。

阿花：我先来！我觉得我们可以做一个AI助手功能，就是那种，用户可以跟AI对话，然后AI帮他完成操作。现在这个很火的，各家都在做。

大刘：AI助手确实可以做，但是工程量很大。我之前调研过，光是对话界面就需要至少两周。不过话说回来，如果只做一个简单版本的话，也许可以先上一个FAQ机器人？

老李：说到AI，其实我们的推荐算法也可以优化。目前推荐的点击率才3%，行业平均是8%。不过这个跟AI助手是两码事。

小美：从运营角度，我觉得社区功能更重要。用户留存率一直上不去，如果有社区让用户互相交流，DAU肯定能涨。上次我看竞品做了社区，效果特别好。

小王：嗯嗯，这些想法都不错。其实吧，我之前也想过很多方案，就是一直没确定下来。AI助手、推荐优化、社区，都是好方向。

阿花：对了我还想到一个，暗黑模式！用户反馈里提了很多次了。

大刘：暗黑模式技术上倒是不难，一周就能搞定。

老李：那我们到底先做哪个？感觉什么都想做，但资源有限啊。

小王：要不这样，AI助手和社区都先做个简单的调研报告，下周再定优先级？

小美：那推荐优化呢？这个ROI应该最高吧？

小王：推荐优化也做调研。行，那就这样，@阿花 下周出AI助手的竞品分析，@小美 出社区功能的用户调研，@老李 出推荐优化的技术评估。下周三再开一次会定优先级。散了吧。

大刘：等等，暗黑模式呢？

小王：暗黑模式先放着，不着急。`,
};

const exampleLabels: { key: string; label: string; icon: React.ReactNode; colorClass: string; dotColorClass: string }[] = [
  { key: "planning", label: "Q3产品规划会", icon: <IconClipboard size={14} />, colorClass: "hover:border-primary hover:text-primary hover:bg-primary/5", dotColorClass: "bg-primary" },
  { key: "weekly", label: "周会同步", icon: <IconCalendar size={14} />, colorClass: "hover:border-effective hover:text-effective hover:bg-effective/5", dotColorClass: "bg-effective" },
  { key: "brainstorm", label: "头脑风暴会", icon: <IconLightbulb size={14} />, colorClass: "hover:border-repetitive hover:text-repetitive hover:bg-repetitive/5", dotColorClass: "bg-repetitive" },
];

// 加载步骤
const LOADING_STEPS = [
  { label: "AI 正在阅读会议内容...", description: "解析文本结构和发言人", delay: 2000 },
  { label: "AI 正在分析每句话的价值...", description: "识别有效信息、重复内容和废话", delay: 5000 },
  { label: "AI 正在生成报告...", description: "汇总评分、行动项和改进建议", delay: Infinity },
];

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedStep, setCompletedStep] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [clearedFeedback, setClearedFeedback] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useFadeUp();

  const fillExample = useCallback((key: string) => {
    if (loading) return;
    setText(EXAMPLES[key]);
    // Adjust height after content changes
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const newHeight = Math.min(textareaRef.current.scrollHeight, window.innerHeight * 0.6);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    });
    textareaRef.current?.focus();
  }, [loading]);

  const charCount = text.length;
  const canAnalyze = text.trim().length >= 10 && !loading;

  // 检测到的发言人列表
  const detectedSpeakers = useMemo<string[]>(() => {
    if (charCount < 10) return [];
    // Match patterns like "张总：" "李经理：" "小陈：" etc.
    const speakerPattern = /([^\s:：]{2,4})[：:]/g;
    const speakers = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = speakerPattern.exec(text)) !== null) {
      // Filter out common false positives
      const name = match[1];
      if (name.length >= 2 && name.length <= 4 && /[\u4e00-\u9fff]/.test(name)) {
        speakers.add(name);
      }
    }
    return Array.from(speakers).slice(0, 10); // max 10 speakers
  }, [text, charCount]);

  // 加载步骤动画
  useEffect(() => {
    if (!loading) {
      setCompletedStep(-1);
      return;
    }
    setCompletedStep(-1);

    const timers: ReturnType<typeof setTimeout>[] = [];
    LOADING_STEPS.forEach((step, i) => {
      if (step.delay < Infinity) {
        timers.push(
          setTimeout(() => setCompletedStep(i), step.delay)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error, showToast]);

  // Check if coming from template library (?from=template)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "template") {
      const templateText = localStorage.getItem("templateText");
      if (templateText) {
        setText(templateText);
        // Adjust textarea height after content is set
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = Math.min(
              textareaRef.current.scrollHeight,
              window.innerHeight * 0.6
            );
            textareaRef.current.style.height = `${newHeight}px`;
          }
        });
        // Clean up the flag and stored text
        localStorage.removeItem("templateText");
        window.history.replaceState({}, "", "/analyze");
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "分析失败，请重试");
        setLoading(false);
        return;
      }

      setCompletedStep(2);

      // Save to localStorage
      try {
        localStorage.setItem("lastAnalysis", JSON.stringify(data));
      } catch {
        // ignore storage errors
      }

      // Save to history
      const saved = saveToHistory(data);
      if (!saved) {
        showToast("隐私模式下不支持保存历史记录", "info");
      }

      setTimeout(() => {
        router.push("/result");
      }, 800);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("分析超时，请缩短文本后重试");
      } else {
        setError("网络错误，请检查网络后重试");
      }
      setLoading(false);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading && !isDragging) setIsDragging(true);
  }, [loading, isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (loading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".txt") || file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          if (content) {
            setText(content);
            // Adjust height after content changes
            requestAnimationFrame(() => {
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                const newHeight = Math.min(textareaRef.current.scrollHeight, window.innerHeight * 0.6);
                textareaRef.current.style.height = `${newHeight}px`;
              }
            });
            showToast("文件内容已加载", "success");
          }
        };
        reader.readAsText(file);
      } else {
        showToast("仅支持 .txt 文本文件", "error");
      }
    }
  }, [loading, showToast]);

  const handlePasteFromClipboard = useCallback(async () => {
    if (loading) return;
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
        // Adjust height
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = Math.min(textareaRef.current.scrollHeight, window.innerHeight * 0.6);
            textareaRef.current.style.height = `${newHeight}px`;
          }
        });
        showToast("已粘贴剪贴板内容", "success");
        textareaRef.current?.focus();
      } else {
        showToast("剪贴板为空", "info");
      }
    } catch {
      showToast("无法读取剪贴板，请手动粘贴", "error");
    }
  }, [loading, showToast]);

  const handleClear = useCallback(() => {
    if (loading) return;
    setText("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    textareaRef.current?.focus();
    setClearedFeedback(true);
    setTimeout(() => setClearedFeedback(false), 1500);
  }, [loading]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (canAnalyze) {
        handleAnalyze();
      }
    }
  }, [canAnalyze]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6 fade-up">
            <Link href="/" className="hover:text-primary transition-colors">
              首页
            </Link>
            <span>/</span>
            <span className="text-text-secondary">会议分析</span>
          </nav>

          {/* Title */}
          <div className="mb-8 fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text">
              粘贴你的会议内容
            </h1>
            <div className="mt-3 mb-3 h-px w-20 bg-gradient-to-r from-primary via-primary-light to-transparent rounded-full" />
            <p className="text-text-secondary text-lg">
              支持会议纪要、文字记录、聊天记录等任意格式
            </p>
          </div>

          {/* Textarea + Loading Overlay */}
          <div
            className="relative fade-up"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                const textarea = e.target;
                textarea.style.height = "auto";
                const newHeight = Math.min(textarea.scrollHeight, window.innerHeight * 0.6);
                textarea.style.height = `${newHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="会议内容输入框"
              placeholder={`在这里粘贴会议纪要或文字记录...\n\n支持任意格式，建议包含发言人标注以获得更准确的分析。`}
              className="w-full min-h-[300px] sm:min-h-[400px] bg-surface rounded-2xl border border-border p-5 sm:p-6 text-text text-base leading-relaxed resize-none placeholder:text-text-muted textarea-glow focus:border-primary transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {isDragging && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-2xl drag-active-border flex items-center justify-center z-20 pointer-events-none">
                <div className="text-center">
                  <div className="mb-2 text-primary">
                    <IconFileText size={28} />
                  </div>
                  <p className="text-primary font-semibold">拖拽 .txt 文件到此处</p>
                  <p className="text-primary/60 text-sm mt-1">释放鼠标即可加载文件内容</p>
                </div>
              </div>
            )}

            {/* Loading Overlay */}
            {loading && (
              <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-surface rounded-2xl border border-border p-8 max-w-md w-full mx-4 shadow-2xl">
                  {/* Completion checkmark animation */}
                  {completedStep === 2 ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle
                          cx="32" cy="32" r="28"
                          stroke="var(--color-effective)"
                          strokeWidth="3"
                          className="checkmark-circle"
                        />
                        <path
                          d="M20 32l8 8 16-16"
                          stroke="var(--color-effective)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="checkmark-check"
                        />
                      </svg>
                      <p className="text-sm font-medium text-effective">分析完成</p>
                    </div>
                  ) : (
                    <>
                      {/* Progress bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-xs text-text-muted mb-2">
                          <span>分析进度</span>
                          <span className="number-highlight">{Math.min(95, (completedStep + 1) * 33)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-border-light overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(95, (completedStep + 1) * 33)}%` }}
                          />
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="space-y-4">
                        {LOADING_STEPS.map((step, i) => {
                          const done = completedStep > i;
                          const active = completedStep === i || (completedStep === -1 && i === 0);
                          const reached = completedStep >= i || (completedStep === -1 && i === 0);
                          return (
                            <div
                              key={step.label}
                              className={`flex items-center gap-3 transition-opacity duration-300 ${reached ? "opacity-100" : "opacity-40"}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                                  done
                                    ? "bg-effective text-white"
                                    : active
                                      ? "bg-primary text-white"
                                      : "bg-border text-text-muted"
                                }`}
                              >
                                {done ? (
                                  <IconCheck size={14} />
                                ) : (
                                  <span className="text-xs font-bold">{i + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm font-medium transition-colors duration-300 ${
                                    reached ? "text-text" : "text-text-muted"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                <p className="text-xs text-text-muted">{step.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-xs text-text-muted mt-6 text-center">
                        分析通常需要 10-30 秒
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Real-time estimation panel */}
          {charCount > 10 && !loading && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-muted fade-up">
              {/* Estimated analysis time */}
              <span className="flex items-center gap-1">
                <IconClock size={12} className="text-primary" />
                预计分析时长 {Math.max(10, Math.min(30, Math.round(charCount / 50)))}s
              </span>
              {/* Estimated sentence count */}
              <span className="flex items-center gap-1">
                <IconFileText size={12} className="text-primary" />
                预计 {Math.max(1, Math.round(charCount / 35))} 句分析
              </span>
              {/* Speaker detection */}
              {detectedSpeakers.length > 0 && (
                <span className="flex items-center gap-1">
                  <IconUsers size={12} className="text-primary" />
                  检测到 {detectedSpeakers.length} 位发言人
                </span>
              )}
              {/* Reading time */}
              <span className="flex items-center gap-1">
                <IconBook size={12} className="text-primary" />
                阅读时长 {Math.max(1, Math.round(charCount / 400))}min
              </span>
            </div>
          )}

          {/* Toolbar */}
          <div className="mt-3 flex items-center justify-between fade-up">
            <div className="inline-flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
              <button
                onClick={handlePasteFromClipboard}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconClipboard size={14} /> 粘贴
                <kbd className="px-1 py-0.5 rounded bg-bg border border-border text-text-muted text-[10px] font-mono leading-none">Ctrl+V</kbd>
              </button>
              <div className="w-px h-4 bg-border mx-0.5" />
              {text.length > 0 && (
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-nonsense hover:bg-nonsense/5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconClose size={14} /> 清空
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm transition-colors flex items-center gap-1.5 ${charCount > 0 ? "text-text-secondary" : "text-text-muted"}`}>
                <span className={`w-2 h-2 rounded-full ${
                  charCount === 0 ? "bg-border" :
                  charCount < 10 ? "bg-nonsense" :
                  charCount < 200 ? "bg-repetitive" : "bg-effective"
                }`} />
                {charCount} 字
              </span>
              {charCount > 200 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-1.5 rounded-full bg-border-light overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(100, (charCount / 500) * 100)}%`,
                        backgroundColor: charCount < 10
                          ? "var(--nonsense)"
                          : charCount < 200
                            ? "var(--repetitive)"
                            : "var(--effective)",
                      }}
                    />
                  </div>
                  <span className="text-xs text-effective">内容充足</span>
                </div>
              )}
            </div>
          </div>

          {/* Example Buttons */}
          <div className="mt-4 flex flex-wrap gap-3 fade-up">
            <span className="text-sm text-text-muted self-center mr-1">
              示例数据：
            </span>
            {exampleLabels.map((ex) => (
              <button
                key={ex.key}
                onClick={() => fillExample(ex.key)}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed ${ex.colorClass}`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${ex.dotColorClass}`} />
                  {ex.label}
                </span>
              </button>
            ))}
          </div>

          {/* Hint / Clear Feedback / Smart Tips */}
          <div className="mt-3 fade-up">
            {clearedFeedback ? (
              <p className="text-sm text-primary flex items-center gap-1.5 clear-feedback-enter">
                <IconCheckCircle size={14} className="text-primary" /> 已清空，可重新粘贴内容
              </p>
            ) : charCount > 0 && charCount < 10 ? (
              <p className="text-sm text-nonsense flex items-center gap-1.5">
                <IconAlert size={14} className="text-nonsense" /> 至少需要 10 字才能开始分析
              </p>
            ) : charCount >= 10 && charCount < 200 ? (
              <div className="space-y-1">
                <p className="text-sm text-repetitive flex items-center gap-1.5">
                  <IconAlert size={14} className="text-repetitive" /> 内容较短，分析结果可能不够准确
                </p>
                <p className="text-xs text-text-muted">
                  {text.includes("会议") || text.includes("讨论")
                    ? "建议包含至少 3 位发言人的对话以获得更准确的发言人分析"
                    : "建议粘贴会议记录格式的文本，包含发言人标注效果更佳"}
                </p>
              </div>
            ) : charCount >= 200 && !/[一-龥\u4e00-\u9fff]/.test(text) ? (
              <p className="text-sm text-repetitive flex items-center gap-1.5">
                <IconAlert size={14} className="text-repetitive" /> 检测到非中文文本，当前模型对中文会议分析更准确
              </p>
            ) : (
              <p className="text-sm text-text-muted">
                建议粘贴 200 字以上的会议内容以获得更准确的分析结果
              </p>
            )}
          </div>

          {/* Analyze Button */}
          <div className="mt-8 fade-up">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-semibold transition-all ${
                loading
                  ? "bg-primary/60 text-white cursor-wait"
                  : canAnalyze
                    ? "bg-primary text-white cta-btn ripple-btn hover:bg-primary-light analyze-btn-ready"
                    : "bg-border text-text-muted cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  AI 正在分析...
                </>
              ) : (
                <><IconSearch size={18} /> 开始分析</>
              )}
            </button>
            {canAnalyze && !loading && (
              <p className="text-xs text-text-muted mt-3">
                按 <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary text-xs font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary text-xs font-mono">Enter</kbd> 快速开始分析
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
