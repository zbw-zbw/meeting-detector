import type { AnalysisResult } from "@/types/analysis";

/** Concise Chinese labels for action-item priority in the exported report */
const priorityLabels: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

/** Format an ISO date string to "2025年7月15日 14:32" */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}年${m}月${day}日 ${h}:${min}`;
}

/** Format an ISO date string to "2025-07-15" for use in a filename */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Strip filesystem-unsafe characters so titles can be used in a filename */
function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim() || "未命名";
}

/**
 * Generate a well-formatted Markdown report from an analysis result.
 */
export function generateMarkdown(result: AnalysisResult): string {
  const lines: string[] = [];

  /* Title */
  lines.push(`# 会议效率报告：${result.meetingTitle}`);
  lines.push("");
  lines.push(
    `> 生成时间：${formatDateTime(result.analyzedAt)} | 分析字数：${result.wordCount}字 | 参会人数：${result.participantCount}人`,
  );
  lines.push("");

  /* Efficiency score */
  lines.push("## 效率评分");
  lines.push("");
  lines.push(`**${result.score}分** (${result.levelLabel})`);
  lines.push("");
  lines.push("| 指标 | 占比 |");
  lines.push("|------|------|");
  lines.push(`| 有效信息 | ${result.breakdown.effective}% |`);
  lines.push(`| 重复内容 | ${result.breakdown.repetitive}% |`);
  lines.push(`| 废话占比 | ${result.breakdown.nonsense}% |`);
  lines.push("");

  /* Action items */
  lines.push("## 行动项");
  lines.push("");
  if (result.actionItems.length > 0) {
    result.actionItems.forEach((item, i) => {
      const priority = priorityLabels[item.priority] ?? item.priority;
      lines.push(
        `${i + 1}. [ ] ${item.content} — @${item.assignee}，截止 ${item.deadline} [优先级：${priority}]`,
      );
    });
  } else {
    lines.push("（暂无行动项）");
  }
  lines.push("");

  /* Key decisions */
  lines.push("## 关键决策");
  lines.push("");
  if (result.keyDecisions.length > 0) {
    result.keyDecisions.forEach((decision) => {
      lines.push(`- ${decision}`);
    });
  } else {
    lines.push("（暂无关键决策）");
  }
  lines.push("");

  /* Sentence-by-sentence analysis */
  lines.push("## 逐句分析");
  lines.push("");

  const effectiveSentences = result.sentences.filter((s) => s.type === "effective");
  const repetitiveSentences = result.sentences.filter((s) => s.type === "repetitive");
  const nonsenseSentences = result.sentences.filter((s) => s.type === "nonsense");

  lines.push("### 有效信息");
  lines.push("");
  if (effectiveSentences.length > 0) {
    effectiveSentences.forEach((s) => {
      lines.push(`- ${s.text}`);
    });
  } else {
    lines.push("（无）");
  }
  lines.push("");

  lines.push("### 重复内容");
  lines.push("");
  if (repetitiveSentences.length > 0) {
    repetitiveSentences.forEach((s) => {
      lines.push(`- ${s.text}（${s.reason}）`);
    });
  } else {
    lines.push("（无）");
  }
  lines.push("");

  lines.push("### 废话");
  lines.push("");
  if (nonsenseSentences.length > 0) {
    nonsenseSentences.forEach((s) => {
      lines.push(`- ${s.text}（${s.reason}）`);
    });
  } else {
    lines.push("（无）");
  }
  lines.push("");

  /* Summary */
  lines.push("## 会议摘要");
  lines.push("");
  lines.push(result.summary || "（暂无摘要）");
  lines.push("");

  /* Suggestions */
  lines.push("## 改进建议");
  lines.push("");
  if (result.suggestions.length > 0) {
    result.suggestions.forEach((s, i) => {
      lines.push(`${i + 1}. ${s}`);
    });
  } else {
    lines.push("（暂无建议）");
  }
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate a Markdown report from the analysis result and trigger a browser
 * download of the resulting `.md` file.
 */
export function downloadMarkdown(result: AnalysisResult): void {
  const content = generateMarkdown(result);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const filename = `会议效率报告_${sanitizeFilename(result.meetingTitle)}_${formatDate(result.analyzedAt)}.md`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
