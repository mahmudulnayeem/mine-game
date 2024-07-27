import { GoogleAnalytics } from "@next/third-parties/google";
import { Github } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mine-diamond.vercel.app/"),
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
  twitter: {
    card: "summary_large_image",
    title: "Mine game",
    images: [{ url: "/preview.webp" }],
    description: "Find all the diamonds without stepping on a mine",
    site: "@mine-diamond",
    creator: "@yay_nayeem",
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
      <body className={inter.className}>
        <main className="h-[90vh] overflow-scroll ">{children}</main>
        <footer className="flex sm:flex-row flex-col item-center justify-center sm:space-x-5 mt-8 ">
          <Link
            href="https://github.com/mahmudulnayeem"
            target="_blank"
            className="flex items-center gap-1 hover:underline"
          >
            <Github size={24} /> <span>mahmudulnayeem</span>
          </Link>
          <div className="flex items-center space-x-5">
            <Link href="/" className="hover:underline">
              Mine game
            </Link>
            <Link href="/grid-lights" className="hover:underline">
              Grid lights
            </Link>
          </div>
        </footer>
      </body>
      <GoogleAnalytics gaId="G-13M313N5LR" />
    </html>
  );
}
