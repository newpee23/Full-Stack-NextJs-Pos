"use client";
import { Poppins } from "next/font/google";

import { SessionProvider } from 'next-auth/react'
import './globals.css'
import LoadingPage from "./components/LoadingPage";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <title>
        NextJs-Pos
      </title>
      <body className={poppins.className}>
        <LoadingPage>
          <SessionProvider>
            {children}
          </SessionProvider>
        </LoadingPage>
      </body>
    </html>
  )
}
