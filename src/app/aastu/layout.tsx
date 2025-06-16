import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AASTU Course Navigator",
  description: "Find and explore courses at Addis Ababa Science and Technology University",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={inter.className}>      
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
    </div>
  )
}
