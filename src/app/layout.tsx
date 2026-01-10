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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://andrefrelicot.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "André Frélicot - TechLead & Entrepreneur",
    template: "%s · André Frélicot - TechLead & Entrepreneur",
  },
  description: "André Frélicot - TechLead & Entrepreneur",
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
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="682271ce-8738-436c-a03d-0b285b3e8341"
        ></script>
      </head>
      <body
        className={`${brandSans.variable} ${brandMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
