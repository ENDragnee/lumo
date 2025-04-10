// /src/app/layout.tsx
import "./globals.css";
import Providers from "@/components/Providers";
import { ReactNode } from "react";
export { metadata } from "@/components/Metadata";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-[#383c4a] text-black dark:text-white">
        <Providers>
            <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
