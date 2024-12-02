"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";
import Navbar from "@/components/Navbar";


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
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <ApolloProvider client={client}>
        
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
          >
            <Navbar />
              <div className="container mx-auto px-4 flex flex-col min-h-screen">
                {children}
              </div>
          </body>
        </ApolloProvider>
      </SessionProvider>
    </html>
  );
}
