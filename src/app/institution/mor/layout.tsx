import type React from "react"
import type { Metadata } from "next"
import "./globals.css"


export const metadata: Metadata = {
  title: "Ethiopian Tax Education Portal - Ministry of Revenue",
  description: "Learn taxation for small businesses - Free online course by the Ethiopian Ministry of Revenue",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
