import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash, randomUUID } from "crypto";
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
  if (
    !process.env.LEAD_GATEWAY_URL ||
    !process.env.LEAD_GATEWAY_TOKEN
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
  const data = parsed.data;
  // The gateway must atomically enforce the quota and persist the inquiry before
  // acknowledging it. Mail delivery is a retryable notification after persistence.
  // No visitor auto-reply is sent. This service is deliberately not wired in preview.
  const inquiryId=randomUUID();
  try {
    const response=await fetch(process.env.LEAD_GATEWAY_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.LEAD_GATEWAY_TOKEN}`},
      body:JSON.stringify({id:inquiryId,rateLimit:{key,max:5,windowSeconds:3600},inquiry:data,createdAt:new Date().toISOString()}),
      signal:AbortSignal.timeout(15000),
    });
    if(response.status===429)return NextResponse.json({error:locale==="zh"?"提交次数较多，请一小时后再试。":"Too many requests. Please try again in an hour."},{status:429});
    const receipt=await response.json();
    if(!response.ok||receipt.persisted!==true||receipt.id!==inquiryId)throw new Error("Inquiry was not persisted");
    return NextResponse.json({ok:true,id:inquiryId});
  } catch {
    return NextResponse.json({error:locale==="zh"?"暂时无法确认提交结果，请保留表单内容并稍后重试。":"We could not confirm submission. Keep your form details and try again later."},{status:502});
  }
}
