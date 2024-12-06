"use client";

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Todo List",
//   description: "A to-do list is a simple, organized tool to track tasks, prioritize responsibilities, and stay productive.",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient  = new QueryClient()
  return (
    <html lang="en" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <SessionProvider>
           <QueryClientProvider client={queryClient}>
            <Navbar />
            <div className="container mx-auto px-4 flex flex-col min-h-screen">
              {children}
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
           </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
