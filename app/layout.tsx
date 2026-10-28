import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      icon: [{ url: "/apollun-icon.png", type: "image/png" }],
      shortcut: "/apollun-icon.png",
      apple: "/apollun-icon.png",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("apollun-theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}catch(e){document.documentElement.dataset.theme="dark"}`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
