import type React from "react"
import type { Metadata } from "next"
import { Space_Mono } from "next/font/google"
import "./globals.css"
import "../styles/animations.css"

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/app.js" defer></script>
      </head>
      <body className={`${spaceMono.className} bg-[#111111]`}>{children}</body>
    </html>
  )
}



import './globals.css'