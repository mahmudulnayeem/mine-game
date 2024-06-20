import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mine game",
  description: "Mine game made with React and TypeScript",
  keywords: [
    "minesweeper",
    "game",
    "react",
    "typescript",
    "next",
    "mine game",
    "minesweeper game",
  ],
  creator: "Mahmudul Hasan Nayeem",
  category: "Game",
  openGraph: {
    type: "website",
    phoneNumbers: ["+8801780064264"],
    emails: ["hasan@basikmarketing.in", "mahmudulnayeem71@gmail.com"],
    images: [{ url: "/preview.webp" }],
    title: "Mine game",
    description: "Find all the diamonds without stepping on a mine",
    siteName: "Mine game",
    url: "https://mine-diamond.vercel.app/",
  },
  icons:
    '[{"src":"/favicon.ico","sizes":"64x64 32x32 24x24 16x16","type":"image/x-icon"}]',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-13M313N5LR" />
    </html>
  );
}
