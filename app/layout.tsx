import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { UserProvider } from "@auth0/nextjs-auth0/client"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/app/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Student Profile Management System",
  description: "Manage your student profile easily",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}



import './globals.css'