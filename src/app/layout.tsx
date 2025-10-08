import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Inter, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

// ✅ Material Symbols Outlined (Variable Font)
const materialSymbols = localFont({
  src: "./fonts/MaterialSymbolsOutlined.ttf", // ✅ 수정됨
  variable: "--font-material-symbols",
  display: "swap",
});

export const metadata: Metadata = {
  title: "성경 타자",
  description: "성경 구절 타자 연습 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${noto.variable} ${materialSymbols.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <div className="container-padded pt-4 pb-8 md:pt-6 md:pb-12">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
