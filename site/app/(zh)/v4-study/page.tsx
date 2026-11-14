import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { V4StudyView } from "@/components/v4/V4StudyView";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Cyano",
  robots: { index: false, follow: false },
};

export default function V4StudyPage() {
  if (process.env.NODE_ENV === "production" && process.env.V4_STUDY !== "1") {
    notFound();
  }
  return <V4StudyView />;
}
