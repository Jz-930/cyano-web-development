export type Locale = "zh" | "en";
export const t = (locale:Locale, zh:string, en:string) => locale === "zh" ? zh : en;
export const href = (locale:Locale,path="") => (locale === "en" ? "/en" : "") + (path || "/");
