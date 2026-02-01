import AppLayout from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitTrackr",
  description: "Personal Trainer & Weight-Loss Tracking PWA",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Make it feel like an app
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FitTrackr" />
      </head>
      <body className={inter.className}>
        <AuthGuard>
          <AppLayout>
            {children}
          </AppLayout>
        </AuthGuard>
        <script src="/pwa-register.js"></script>
      </body>
    </html>
  );
}
