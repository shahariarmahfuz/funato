import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "ভ্রাতৃত্ব ফাউন্ডেশন | Bhratritto Foundation — মানবতার সেবায়",
  description:
    "ভ্রাতৃত্ব ফাউন্ডেশন একটি অলাভজনক মানবিক দাতব্য সংস্থা। এতিমখানা, ইসলামিক শেল্টারহোম কমপ্লেক্স, মেহমানখানা, যাকাত স্বাবলম্বীকরণ ও জরুরি দুর্যোগ মোকাবিলায় অনুদান দিন।",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        {/* Preload critical Bangla fonts for instant rendering */}
        <link
          rel="preload"
          href="/fonts/July/July-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Kalpurush/kalpurush.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
