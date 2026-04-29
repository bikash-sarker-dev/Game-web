import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import ReduxProvider from "@/redux/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dating Game",
  description: "this is a Game app",
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
      <body cz-shortcut-listen="true" className="min-h-full flex flex-col">
        <ReduxProvider>
          <Navbar />
          <main className="bg-[url('/p-bg.png')] bg-cover  bg-no-repeat min-h-screen">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
