import { type NextRequest, NextResponse } from "next/server"
import type { Provider } from "@/lib/council"

export const runtime = "nodejs"
export const maxDuration = 60

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  provider: Provider
  model: string
  system: string
  messages: ChatMessage[]
  maxTokens?: number
}

interface ProviderConfig {
  envKey: string
  run: (cfg: {
    apiKey: string
    model: string
    system: string
    messages: ChatMessage[]
    maxTokens: number
  }) => Promise<string>
}

/** Call an OpenAI-compatible chat completions endpoint (OpenAI, xAI, DeepSeek). */
async function openAICompatible(baseUrl: string) {
  return async ({
    apiKey,
    model,
    system,
    messages,
    maxTokens,
  }: {
    apiKey: string
    model: string
    system: string
    messages: ChatMessage[]
    maxTokens: number
  }) => {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    })
    if (!res.ok) {
      throw new Error(`${res.status} ${await res.text()}`)
    }
    const data = await res.json()
    return data?.choices?.[0]?.message?.content ?? ""
  }
}

const PROVIDERS: Record<Provider, ProviderConfig> = {
  anthropic: {
    envKey: "ANTHROPIC_API_KEY",
    run: async ({ apiKey, model, system, messages, maxTokens }) => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
      })
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
      const data = await res.json()
      return Array.isArray(data?.content)
        ? data.content
            .filter((b: { type: string }) => b.type === "text")
            .map((b: { text: string }) => b.text)
            .join("\n")
        : ""
    },
  },
  openai: {
    envKey: "OPENAI_API_KEY",
    run: async (args) => (await openAICompatible("https://api.openai.com/v1"))(args),
  },
  xai: {
    envKey: "XAI_API_KEY",
    run: async (args) => (await openAICompatible("https://api.x.ai/v1"))(args),
  },
  deepseek: {
    envKey: "DEEPSEEK_API_KEY",
    run: async (args) => (await openAICompatible("https://api.deepseek.com"))(args),
  },
  perplexity: {
    envKey: "PERPLEXITY_API_KEY",
    run: async (args) => (await openAICompatible("https://api.perplexity.ai"))(args),
  },
  gemini: {
    envKey: "GEMINI_API_KEY",
    run: async ({ apiKey, model, system, messages, maxTokens }) => {
      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }))
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: { maxOutputTokens: maxTokens },
          }),
        },
      )
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
      const data = await res.json()
      return (
        data?.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? "")
          .join("\n") ?? ""
      )
    },
  },
}

export async function POST(req: NextRequest) {
  let body: ChatRequest
  try {
    body = (await req.json()) as ChatRequest
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { provider, model, system, messages, maxTokens = 1024 } = body

  if (!provider || !PROVIDERS[provider]) {
    return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
  }
  if (!model || !system || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Request must include model, system, and at least one message." },
      { status: 400 },
    )
  }

  const cfg = PROVIDERS[provider]
  const apiKey = process.env[cfg.envKey]
  if (!apiKey) {
    return NextResponse.json(
      { error: `${cfg.envKey} is not configured on the server.` },
      { status: 500 },
    )
  }

  try {
    const text = await cfg.run({ apiKey, model, system, messages, maxTokens })
    return NextResponse.json({ text })
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    console.log(`[v0] ${provider} API error:`, detail)
    return NextResponse.json(
      { error: `The ${provider} request failed.` },
      { status: 502 },
    )
  }
}
