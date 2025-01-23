import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ReduxProvider } from "@/redux/provider"
import { ReactQueryProvider } from "@/react-query/provider"
import { Toaster } from "sonner"
import "./globals.css"
import { ThemeProvider } from "@/components/theme"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Grouple",
  description:
    "Grouple is a cutting-edge learning management system that revolutionizes online education. With advanced features for course creation, student engagement, and progress tracking, it empowers educators and learners alike. Experience seamless collaboration, interactive content delivery, and data-driven insights in one comprehensive SaaS platform.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${jakarta.className} bg-black`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </ReduxProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
