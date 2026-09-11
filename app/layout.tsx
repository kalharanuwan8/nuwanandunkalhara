import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Abril_Fatface } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const abril = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuwanandun Kalhara | Full Stack Developer",
  description: "Full-stack developer and software engineering undergraduate in Sri Lanka. Explore web applications, client projects, and AI research by Nuwanandun Kalhara.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${spaceGrotesk.variable} ${abril.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
