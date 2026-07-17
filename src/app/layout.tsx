import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aravindhan R — Video Editor & Colorist",
  description: "Award-winning video editor specializing in cinematic storytelling for top-tier brands, creators, and viral content.",
  keywords: ["video editor", "colorist", "youtube editor", "reels editor", "commercial editing"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#0a0a0a] text-[#f0f0f0] antialiased overflow-x-hidden min-h-screen film-grain">
        {children}
      </body>
    </html>
  );
}
