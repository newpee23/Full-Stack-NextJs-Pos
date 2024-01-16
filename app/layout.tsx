"use client";

import { SessionProvider } from 'next-auth/react'
import './globals.css'

import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from "./store/store";
// Import Css
import "@/app/auth/auth.css"
import LoadingPage from './components/LoadingPage';
const queryClient = new QueryClient();

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <title>หน้าแรก</title>
      <body>

          <SessionProvider>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <LoadingPage>
                  {children}
                </LoadingPage>
                <ReactQueryDevtools />
              </QueryClientProvider>
            </Provider>
          </SessionProvider>
    
      </body>
    </html>
  )
}
