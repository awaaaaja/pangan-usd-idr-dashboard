import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Pangan Insight Indonesia",
    default: "Pangan Insight Indonesia",
  },
  description:
    "Dashboard publik hasil penelitian evaluasi USD/IDR dalam backtesting historis perubahan harga pangan bulanan Indonesia.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#0f766e" showSpinner={false} />

          {children}

          <Toaster
            position="bottom-right"
            richColors
            closeButton
            duration={5000}
            toastOptions={{
              className: "dark:bg-gray-dark dark:border-dark-3 dark:text-white",
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
