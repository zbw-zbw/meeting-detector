import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body as { apiKey?: string };

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "请输入 API Key" },
        { status: 400 }
      );
    }

    // Use the provided API key to call DeepSeek with a minimal request
    const client = new OpenAI({
      apiKey: apiKey.trim(),
      baseURL: "https://api.deepseek.com",
    });

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0,
      max_tokens: 5,
      messages: [
        { role: "user", content: "Hi" },
      ],
    });

    const reply = completion.choices[0]?.message?.content;
    if (reply) {
      return NextResponse.json({ success: true, message: "API Key 有效，连接成功" });
    }

    return NextResponse.json(
      { success: false, message: "API 返回异常，请检查 Key 是否正确" },
      { status: 502 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    // Common error: invalid API key
    if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("auth")) {
      return NextResponse.json(
        { success: false, message: "API Key 无效，请检查后重试" },
        { status: 401 }
      );
    }
    if (msg.includes("rate") || msg.includes("429")) {
      return NextResponse.json(
        { success: false, message: "请求频率超限，请稍后再试" },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { success: false, message: `连接失败: ${msg}` },
      { status: 502 }
    );
  }
}
