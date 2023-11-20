"use client";
import { Kanit } from "next/font/google";

import { SessionProvider } from 'next-auth/react'
import './globals.css'
import LoadingPage from "./components/LoadingPage";
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from "./store/store";

const kanits = Kanit({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"] })
const queryClient = new QueryClient();

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <title>หน้าแรก</title>
      <body className={kanits.className}>
        <LoadingPage>
          <SessionProvider>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
              </QueryClientProvider>
            </Provider>
          </SessionProvider>
        </LoadingPage>
      </body>
    </html>
  )
}
