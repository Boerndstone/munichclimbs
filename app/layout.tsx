import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteNavigation } from "@/components/site-navigation"
import { SiteFooter } from "@/components/site-footer"

const inter = localFont({
  variable: "--font-ui",
  display: "swap",
  src: [
    { path: "./fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const chelseaMarket = localFont({
  variable: "--font-munich-brand",
  display: "swap",
  src: [
    {
      path: "./fonts/ChelseaMarket-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.munichclimbs.de"),
  title: {
    default: "Munichclimbs",
    template: "%s | Munichclimbs",
  },
  description: "Klettern rund um München – Klettergebiete, Felsen und Touren.",
  applicationName: "Munichclimbs",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Munichclimbs",
    title: "Munichclimbs",
    description: "Klettern rund um München – Klettergebiete, Felsen und Touren.",
    url: "/",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "https://www.munichclimbs.de/build/images/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${inter.variable} ${chelseaMarket.variable} flex min-h-svh flex-col antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only fixed left-3 top-3 z-[100] rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground shadow-md ring-2 ring-ring focus:not-sr-only focus:outline-none"
        >
          Zum Inhalt springen
        </a>
        <SiteNavigation />
        <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col px-4 pb-8 pt-[66px] text-[1.05rem] sm:text-[15px]">
          <div className="flex w-full flex-1 flex-col">
            {children}
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
