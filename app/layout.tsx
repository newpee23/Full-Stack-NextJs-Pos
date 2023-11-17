"use client";
import { Poppins } from "next/font/google";

import { SessionProvider } from 'next-auth/react'
import './globals.css'
import LoadingPage from "./components/LoadingPage";
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"] })
const queryClient = new QueryClient();

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <title>หน้าแรก</title>
      <link rel="icon" href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Ffood_333344&psig=AOvVaw0A5HOR6PS_hafzfXtZNuuz&ust=1700279152036000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMiD_siPyoIDFQAAAAAdAAAAABAE" />
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
