import { NextRequest, NextResponse } from "next/server";
import { aiClient } from "@/lib/ai";
import type { AnalysisResult } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `你是一个专业的会议效率分析师。你的任务是分析会议内容，评估会议效率，识别废话和重复内容，提取行动项。

请严格按照以下JSON格式输出分析结果，不要输出任何其他内容：

{
  "meetingTitle": "AI识别的会议主题",
  "duration": "识别的会议时长，如无法识别则写'未知'",
  "participantCount": 参会人数（数字），
  "score": 效率评分0-100的整数,
  "level": "excellent/good/fair/poor四选一",
  "levelLabel": "优秀/良好/一般/较差四选一",
  "breakdown": {
    "effective": 有效信息百分比0-100,
    "repetitive": 重复内容百分比0-100,
    "nonsense": 废话跑题百分比0-100
  },
  "sentences": [
    {
      "text": "原句内容",
      "type": "effective/repetitive/nonsense三选一",
      "confidence": 0.0到1.0的置信度,
      "reason": "简短分类原因",
      "speaker": "发言人姓名或null"
    }
  ],
  "actionItems": [
    {
      "content": "行动项内容",
      "assignee": "责任人",
      "deadline": "截止时间",
      "priority": "high/medium/low三选一"
    }
  ],
  "summary": "一段话总结会议核心内容（50-100字）",
  "keyDecisions": ["关键决策1", "关键决策2"],
  "suggestions": ["改进建议1", "改进建议2", "改进建议3"]
}

分析规则：
1. 废话判定：语气词堆砌（"就是说、怎么讲呢、那个"）、无信息量的附和（"对对对、嗯嗯"）、空洞表态（"大家加油、好好干"）
2. 重复判定：与前文内容语义重复的发言、重新提起已讨论过的话题
3. 有效判定：包含具体数据、明确结论、新信息、明确任务分配
4. 评分标准：90-100优秀 70-89良好 50-69一般 0-49较差
5. 三个百分比之和必须等于100
6. 行动项必须包含具体的执行内容，尽量识别责任人和截止时间
7. sentences 数组中，将原文按发言拆分成句子，每句不超过80字，太长的句子要拆分`;

// AI 分析结果为动态内容，禁止缓存以保证每次分析结果最新
const responseHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body as { text?: string };

    // 校验文本
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "请输入会议内容", code: "EMPTY_TEXT" },
        { status: 400, headers: responseHeaders }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: "文本过短，请至少输入 10 个字符", code: "TEXT_TOO_SHORT" },
        { status: 400, headers: responseHeaders }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: "文本长度超过限制（最多50000字）", code: "TEXT_TOO_LONG" },
        { status: 400, headers: responseHeaders }
      );
    }

    // 检查 API Key
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "API 密钥未配置，请联系管理员", code: "NO_API_KEY" },
        { status: 500, headers: responseHeaders }
      );
    }

    // 调用 DeepSeek API
    const completion = await aiClient.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.1,
      max_tokens: 8000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `请分析以下会议内容：\n\n${text}` },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "AI 分析服务暂时不可用", code: "EMPTY_RESPONSE" },
        { status: 502, headers: responseHeaders }
      );
    }

    // 解析 AI 返回的 JSON
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "分析结果解析失败，请重试", code: "PARSE_ERROR" },
        { status: 500, headers: responseHeaders }
      );
    }

    // 补充前端需要的字段
    const result: AnalysisResult = {
      meetingTitle: String(parsed.meetingTitle || "未知会议"),
      duration: String(parsed.duration || "未知"),
      participantCount: Math.max(0, Math.floor(Number(parsed.participantCount) || 0)),
      score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
      level: (["excellent", "good", "fair", "poor"].includes(
        String(parsed.level)
      )
        ? parsed.level
        : "fair") as AnalysisResult["level"],
      levelLabel: String(parsed.levelLabel || "一般"),
      breakdown: {
        effective: Math.min(100, Math.max(0, Number((parsed.breakdown as Record<string, unknown>)?.effective) || 0)),
        repetitive: Math.min(100, Math.max(0, Number((parsed.breakdown as Record<string, unknown>)?.repetitive) || 0)),
        nonsense: Math.min(100, Math.max(0, Number((parsed.breakdown as Record<string, unknown>)?.nonsense) || 0)),
      },
      sentences: Array.isArray(parsed.sentences)
        ? (parsed.sentences as Record<string, unknown>[]).map((s) => ({
            text: String(s.text || ""),
            type: (["effective", "repetitive", "nonsense"].includes(
              String(s.type)
            )
              ? s.type
              : "effective") as "effective" | "repetitive" | "nonsense",
            confidence: Math.min(1, Math.max(0, Number(s.confidence) || 0)),
            reason: String(s.reason || ""),
            speaker: s.speaker ? String(s.speaker) : undefined,
          }))
        : [],
      actionItems: Array.isArray(parsed.actionItems)
        ? (parsed.actionItems as Record<string, unknown>[]).map((a) => ({
            id: crypto.randomUUID(),
            content: String(a.content || ""),
            assignee: String(a.assignee || "未指定"),
            deadline: String(a.deadline || "未指定"),
            priority: (["high", "medium", "low"].includes(String(a.priority))
              ? a.priority
              : "medium") as "high" | "medium" | "low",
          }))
        : [],
      summary: String(parsed.summary || ""),
      keyDecisions: Array.isArray(parsed.keyDecisions)
        ? (parsed.keyDecisions as string[]).map(String)
        : [],
      suggestions: Array.isArray(parsed.suggestions)
        ? (parsed.suggestions as string[]).map(String)
        : [],
      analyzedAt: new Date().toISOString(),
      wordCount: text.length,
    };

    return NextResponse.json(result, { headers: responseHeaders });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "AI 分析服务暂时不可用，请稍后重试", code: "SERVICE_ERROR" },
      { status: 502, headers: responseHeaders }
    );
  }
}
