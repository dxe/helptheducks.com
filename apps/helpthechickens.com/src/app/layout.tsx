import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const description =
  "Multiple investigations have exposed Reichardt Duck Farm for rampant disease and criminal animal cruelty.";
const title = "Help the Ducks";
export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    images: "https://helptheducks.com/og-image.jpeg",
    url: "https://helptheducks.com",
    description,
    siteName: title,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        {children}
        <GoogleAnalytics gaId="G-2WJVQ0EX4G" />
      </body>
    </html>
  );
}
