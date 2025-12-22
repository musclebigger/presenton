import { NextResponse } from "next/server";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  const userConfigPath = process.env.USER_CONFIG_PATH;

  let cfg: Record<string, string> = {};
  if (userConfigPath && fs.existsSync(userConfigPath)) {
    try {
      const raw = fs.readFileSync(userConfigPath, "utf-8");
      cfg = JSON.parse(raw || "{}");
    } catch { }
  }

  // 检查各种 LLM 配置是否有效
  const llmProvider = cfg?.LLM || process.env.LLM || "";
  
  let hasKey = false;
  
  switch (llmProvider.toLowerCase()) {
    case "openai":
      hasKey = Boolean((cfg?.OPENAI_API_KEY || process.env.OPENAI_API_KEY || "").trim());
      break;
    case "google":
      hasKey = Boolean((cfg?.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || "").trim());
      break;
    case "anthropic":
      hasKey = Boolean((cfg?.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || "").trim());
      break;
    case "ollama":
      hasKey = Boolean((cfg?.OLLAMA_URL || process.env.OLLAMA_URL || "").trim());
      break;
    case "custom":
      hasKey = Boolean((cfg?.CUSTOM_LLM_URL || process.env.CUSTOM_LLM_URL || "").trim());
      break;
    default:
      // 兼容旧逻辑：如果没有设置 LLM，检查 OPENAI_API_KEY
      hasKey = Boolean((cfg?.OPENAI_API_KEY || process.env.OPENAI_API_KEY || "").trim());
  }

  return NextResponse.json({ hasKey });
} 