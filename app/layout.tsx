"use client";
import { Poppins } from "next/font/google";

import { SessionProvider } from 'next-auth/react'
import './globals.css'
import LoadingPage from "./components/LoadingPage";
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"] })
const queryClient = new QueryClient();

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
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools />
            </QueryClientProvider>
          </SessionProvider>
        </LoadingPage>
      </body>
    </html>
  )
}
