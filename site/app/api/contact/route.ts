import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
export const runtime = "nodejs";
const schema = z.object({
  name: z.string().trim().min(1).max(160),
  company: z.string().trim().min(1).max(160),
  email: z.email().max(254),
  role: z.string().max(160).optional(),
  phone: z.string().max(160).optional(),
  inquiry: z.enum(["custom", "pilot", "managed", "demo", "evaluate"]),
  message: z.string().trim().min(10).max(5000),
  start: z.string().max(50).optional(),
  consent: z.literal("yes"),
  website: z.string().max(200).optional(),
  locale: z.enum(["zh", "en"]),
});
const limits = new Map<string, { count: number; expires: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  let allowedOrigin = !origin;
  if (origin) {
    try {
      allowedOrigin = new URL(origin).host === (request.headers.get("host") || new URL(request.url).host);
    } catch { allowedOrigin = false; }
  }
  if (!allowedOrigin)
    return NextResponse.json(
      { error: "Request origin not allowed." },
      { status: 403 },
    );
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 16000)
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body === null || typeof body !== "object" || Array.isArray(body))
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const locale = body.locale === "en" ? "en" : "zh";
  if (body.website)
    return NextResponse.json(
      {
        error:
          locale === "zh"
            ? "提交未通过验证，请重试。"
            : "Unable to verify this submission.",
      },
      { status: 400 },
    );
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      {
        error:
          locale === "zh"
            ? "请检查必填项、邮箱格式及业务描述（至少 10 个字符）。"
            : "Check the required fields, email and description (at least 10 characters).",
      },
      { status: 400 },
    );
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = createHash("sha256").update(ip).digest("hex");
  const now = Date.now();
  for (const [k, v] of limits) {
    if (v.expires <= now) limits.delete(k);
  }
  const prev = limits.get(key);
  if (prev && prev.count >= 5)
    return NextResponse.json(
      {
        error:
          locale === "zh"
            ? "提交次数较多，请一小时后再试。"
            : "Too many requests. Please try again in an hour.",
      },
      { status: 429 },
    );
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.LEAD_INBOX ||
    !process.env.LEAD_FROM
  )
    return NextResponse.json(
      {
        error:
          locale === "zh"
            ? "咨询发送暂未开通，请稍后再试。你的信息尚未发送。"
            : "Inquiry delivery is not available yet. Please try again later. Your information has not been sent.",
      },
      { status: 503 },
    );
  limits.set(key, {
    count: (prev?.count || 0) + 1,
    expires: prev?.expires || now + 3600000,
  });
  const data = parsed.data;
  const safe = (s: string) =>
    s.replace(
      /[<>&"']/g,
      (c) =>
        ({
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]!,
    );
  try {
    const payload = [
      {
        from: process.env.LEAD_FROM,
        to: [process.env.LEAD_INBOX],
        reply_to: data.email,
        subject: "Cyano inquiry — " + data.company,
        html: `<h1>New inquiry</h1><p>${safe(data.name)} · ${safe(data.company)}</p><p>${safe(data.email)}</p><p>Role: ${safe(data.role || "—")}</p><p>Phone / WeChat: ${safe(data.phone || "—")}</p><p>Preferred start: ${safe(data.start || "—")}</p><p>${safe(data.inquiry)}</p><p>${safe(data.message).replaceAll("\n", "<br>")}</p>`,
      },
      {
        from: process.env.LEAD_FROM,
        to: [data.email],
        subject:
          locale === "zh"
            ? "Cyano 已收到你的咨询"
            : "Cyano received your inquiry",
        html:
          locale === "zh"
            ? "<p>谢谢你的咨询。我们的资深顾问将在 1 个工作日内回复。</p><p>Cyano Intelligence · 澜屿智创</p>"
            : "<p>Thank you. A senior consultant will reply within one business day.</p><p>Cyano Intelligence</p>",
      },
    ];
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Delivery failed");
    if (process.env.LEAD_WEBHOOK) {
      try {
        await fetch(process.env.LEAD_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            msg_type: "text",
            content: {
              text: `New Cyano inquiry: ${data.company} · ${data.name} · ${data.email}`,
            },
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        console.error("Lead notification unavailable");
      }
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          locale === "zh"
            ? "发送暂时失败，请稍后重试。"
            : "Unable to send right now. Please try again later.",
      },
      { status: 502 },
    );
  }
}
