import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ReduxProvider } from "@/redux/provider"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Grouple",
  description: "Grouple LMS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} bg-black`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
