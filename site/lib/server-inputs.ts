import fs from "fs";
import path from "path";
import type { Bilingual } from "./schema";

export type ClientLogoItem = { name: string; logoSrc: string };
export type TestimonialItem = {
  quote: Bilingual;
  authorTitle: Bilingual;
  companyType: Bilingual;
};

export function getOptionalClients(): ClientLogoItem[] {
  try {
    const p = path.resolve(process.cwd(), "../content/inputs/clients.json");
    if (!fs.existsSync(p)) return [];
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getOptionalTestimonials(): TestimonialItem[] {
  try {
    const p = path.resolve(process.cwd(), "../content/inputs/testimonials.json");
    if (!fs.existsSync(p)) return [];
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function hasOptionalWechatQr(): boolean {
  try {
    const pub = path.resolve(process.cwd(), "public/media/wechat-qr.png");
    return fs.existsSync(pub);
  } catch {
    return false;
  }
}
