import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://apollundev.com"),
    title: "Apollun.Dev — Transformando ideias em experiências digitais",
    description: "Desenvolvimento web, landing pages, UX/UI, SEO e sistemas personalizados com estratégia, performance e design premium.",
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/brand/apollun-submarca.png", type: "image/png" }],
      shortcut: "/brand/apollun-submarca.png",
      apple: "/brand/apollun-submarca.png",
    },
    openGraph: {
      title: "Apollun.Dev — Transformando ideias em experiências digitais",
      description: "Estratégia, design e tecnologia para criar negócios digitais mais fortes.",
      type: "website",
      locale: "pt_BR",
      url: "https://apollundev.com",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Apollun.Dev" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Apollun.Dev — Transformando ideias em experiências digitais",
      description: "Estratégia, design e tecnologia para criar negócios digitais mais fortes.",
      images: ["/og.png"],
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
