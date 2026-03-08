import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LogoProvider } from '@/context/LogoContext';
import { SystemsProvider } from '@/context/SystemsContext';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rocha Tec",
  description: "Portal Central do Ecossistema Rocha Tec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LogoProvider>
          <SystemsProvider>
            {children}
          </SystemsProvider>
        </LogoProvider>
      </body>
    </html>
  );
}
