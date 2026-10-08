import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PortalProvider } from "@/context/PortalContext";
import ClientShell from "@/components/layout/ClientShell";

export const metadata: Metadata = {
  title: "VICEVERSE // TEAM LEADER PORTAL",
  description: "Team Leader Portal for ViceVerse Ideathon - IVC Club, VVCE.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#070B14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: "#070B14", minHeight: "100dvh" }}>
        <PortalProvider>
          <ClientShell>{children}</ClientShell>
        </PortalProvider>
      </body>
    </html>
  );
}