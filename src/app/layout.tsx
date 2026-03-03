import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

export const metadata: Metadata = {
  title: "HireSignal Platform",
  description: "A professional platform built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
