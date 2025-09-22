import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { getValidLocale } from "@/lib/mdx";

const brandSans = Space_Grotesk({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  display: "swap",
});

const brandMono = JetBrains_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://andrefrelicot.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "André Frélicot - TechLead & Solopreneur",
    template: "%s · André Frélicot - TechLead & Solopreneur",
  },
  description: "André Frélicot - TechLead & Solopreneur",
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

type RootLayoutParams = Promise<{ locale?: string }>;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: RootLayoutParams;
}>) {
  const resolved = await params;
  const locale = getValidLocale(resolved?.locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${brandSans.variable} ${brandMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
