import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import PageHeader from "@/components/page-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "use-animated-canvas samples",
  description: "A collection of usage examples for the use-animated-canvas library.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen min-w-96 md:w-full md:max-w-5xl mx-auto flex-col items-center md:px-18 px-2 py-16 caret-transparent gap-4">
          <PageHeader />
          {children}
        </main>
      </body>
    </html>
  )
}
