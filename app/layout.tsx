import type { Metadata } from "next";
import "../styles/main.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NextTopLoader from "nextjs-toploader";

import { siteInfo } from "@/lib/data";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata: Metadata = {
  title: siteInfo.title,
  description: siteInfo.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="Body">
        <AppRouterCacheProvider>
        <NextTopLoader color="#d1d5db" />
        <div >{children}</div>
        </AppRouterCacheProvider> 
        <ToastContainer/>     
      </body>
    </html>
  );
}
