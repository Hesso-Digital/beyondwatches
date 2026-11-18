import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/lib/theme";
import { SITE_URL } from "@/lib/config";
import { ThemeProvider } from "@/components/ThemeProvider";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-sans", display: "swap" });

const description =
  "JUHU 08-26 by BEYOND: 300 numbered automatic watches. The sky over Juhu Aerodrome, Runway 08/26, where JRD Tata landed the first commercial flight in 1932. Claim your number.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BEYOND · JUHU 08-26 · Look Up.",
  description,
  openGraph: {
    title: "BEYOND · JUHU 08-26 · Look Up.",
    description,
    url: SITE_URL,
    siteName: "BEYOND",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BEYOND" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: "BEYOND · JUHU 08-26 · Look Up.", description, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050506",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="night" data-bar="media" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
