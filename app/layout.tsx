import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sachin Saini — Software Engineer",
  description: "Backend / Full-Stack Developer. 3+ years building Java, Spring Boot, React, and Next.js applications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
