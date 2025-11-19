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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bible-typer.vercel.app";

/* === 메타데이터 === */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "말씀 타자",
    template: "%s | 말씀 타자",
  },
  description: "성경 구절 타자 연습 서비스",
  keywords: ["성경 타자", "성경 통독", "말씀 묵상", "타자 연습", "bible typing"],
  authors: [{ name: "말씀 타자 팀" }],
  creator: "말씀 타자 팀",
  publisher: "말씀 타자",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "말씀 타자",
    description: "성경 구절을 따라 타자 연습하고 통독을 이어가세요.",
    siteName: "말씀 타자",
    images: [
      {
        url: "/fish-symbol.svg",
        alt: "말씀 타자 로고",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "말씀 타자",
    description: "성경 구절을 타자하며 통독을 이어가 보세요.",
    images: ["/fish-symbol.svg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/fish-symbol.svg",
    shortcut: "/fish-symbol.svg",
    apple: "/fish-symbol.svg",
  },
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
