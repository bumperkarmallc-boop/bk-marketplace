import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bumper Karma",
  description: "A marketplace for real creators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />

        <main>
          {children}
        </main>

        <footer className="mt-12 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Bumper Karma. Built loud.
        </footer>
      </body>
    </html>
  );
}
