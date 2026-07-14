import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timesheets",
  description: "Submit and review contractor timesheets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <Nav />
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
        <footer className="border-t border-gray-200 py-6">
          <div className="mx-auto w-full max-w-5xl px-6 flex items-center gap-2 text-xs text-gray-400 tracking-label">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Timesheets
          </div>
        </footer>
      </body>
    </html>
  );
}
