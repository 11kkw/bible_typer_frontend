import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Inter, Noto_Sans_KR } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400","500","700"],
  variable: "--font-inter",
  display: "swap",
})

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400","500","700"],
  variable: "--font-noto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "성경 타자",
  description: "성경 구절 타자 연습 서비스",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${noto.variable}`}>
      <head>
        {/* Material Symbols (아이콘 폰트) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-base text-text-dark font-sans">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
