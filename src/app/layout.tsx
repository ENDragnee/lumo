// /src/app/layout.tsx
import "./globals.css";
import Providers from "@/components/Providers";
import { ReactNode } from "react";
export { metadata } from "@/components/Metadata";
import { Roboto } from 'next/font/google'; // Import the Roboto font function

const roboto = Roboto({
  weight: ['400', '700'], // Specify the weights you need
  style: ['normal', 'italic'], // Specify the styles you need
  subsets: ['latin'], // Specify the subsets you need (e.g., 'latin', 'latin-ext')
  display: 'swap', // Recommended font-display value for performance
  variable: '--font-roboto', // Optional: Define a CSS variable name
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} font-sans`} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-[#383c4a] text-black dark:text-white">
        <Providers>
            <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
