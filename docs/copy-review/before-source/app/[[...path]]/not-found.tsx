"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function NotFound() {
  const en = usePathname().startsWith("/en");
  return (
    <section className="page-hero dark">
      <div className="page-hero-shade" />
      <div
        className="container page-hero-inner"
        style={{ paddingTop: 180, paddingBottom: 130 }}
      >
        <div className="eyebrow eyebrow-light">
          <span />
          404
        </div>
        <h1>{en ? "This page could not be found." : "没有找到这个页面。"}</h1>
        <p>
          {en
            ? "The page you're looking for doesn't exist or has moved."
            : "你要找的页面不存在或已经移动。"}
        </p>
        <div className="hero-buttons">
          <Link className="button" href={en ? "/en" : "/"}>
            {en ? "Back to home" : "返回首页"} ↗
          </Link>
          <Link
            className="button button-outline"
            href={en ? "/en/cases" : "/cases"}
          >
            {en ? "See our work" : "查看案例"} ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
