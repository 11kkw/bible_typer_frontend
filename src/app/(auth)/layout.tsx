// src/app/(auth)/layout.tsx
import { Inter, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";

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
  src: "../fonts/MaterialSymbolsOutlined.ttf",
  variable: "--font-material-symbols",
  display: "swap",
});

export default function AuthLayout({
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
        {/* ✅ 중앙 정렬 Wrapper (너비 보존) */}
        <main className="flex min-h-screen flex-col items-stretch justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
