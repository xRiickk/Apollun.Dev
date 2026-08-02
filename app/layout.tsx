import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "apollun.dev";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: "Apollun.Dev — Transformando ideias em experiências digitais",
    description: "Desenvolvimento web, landing pages, UX/UI, SEO, sistemas e lojas virtuais com estratégia, performance e design premium.",
    openGraph: {
      title: "Apollun.Dev — Transformando ideias em experiências digitais",
      description: "Estratégia, design e tecnologia para criar negócios digitais mais fortes.",
      type: "website",
      locale: "pt_BR",
      images: [{ url: new URL("/og.png", base).toString(), width: 1200, height: 630, alt: "Apollun.Dev" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Apollun.Dev — Transformando ideias em experiências digitais",
      description: "Estratégia, design e tecnologia para criar negócios digitais mais fortes.",
      images: [new URL("/og.png", base).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
