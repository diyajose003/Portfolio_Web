import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import client from "@/tina/__generated__/client";
import { hasText } from "@/lib/visibility";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await client.queries.settings({ relativePath: "site.json" });
  const { name, tagline, seoDescription } = data.settings;
  const title = hasText(tagline) ? `${name} | ${tagline}` : name;
  const description = hasText(seoDescription) ? seoDescription : `Portfolio of ${name}.`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { type: "profile", title, description, url: "/", siteName: name },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
