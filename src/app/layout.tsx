import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Hanken_Grotesk } from "next/font/google";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Hello World",
};

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-hanken-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={hankenGrotesk.variable}>
      <body className="flex flex-col">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
