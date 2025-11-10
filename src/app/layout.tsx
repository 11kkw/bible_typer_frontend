import { Toaster } from "@/components/ui/sonner";
import { TypingProgressResetter } from "@/features/typing/components/TypingProgressResetter";
import { AuthProvider } from "@/providers/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/* === 폰트 설정 === */
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

const materialSymbols = localFont({
  src: "./fonts/MaterialSymbolsOutlined.ttf",
  variable: "--font-material-symbols",
  display: "swap",
  preload: true,
});

/* === 메타데이터 === */
export const metadata: Metadata = {
  title: "성경 타자",
  description: "성경 구절 타자 연습 서비스",
};

/* === Root Layout === */
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
        <ReactQueryProvider>
          <AuthProvider>
            <TypingProgressResetter />
            {children}
            <Toaster richColors closeButton />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
