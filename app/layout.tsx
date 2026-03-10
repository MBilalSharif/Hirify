import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI CV Builder — Create Professional Resumes in Minutes",
  description:
    "Build ATS-friendly, professional CVs powered by AI. Simply enter your details, and our AI crafts a polished resume ready for download.",
  keywords: ["CV builder", "resume builder", "AI resume", "ATS-friendly CV"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
