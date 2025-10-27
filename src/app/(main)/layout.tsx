// src/app/(main)/layout.tsx
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header/Header";
import "../globals.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased">
      {/* === 공통 헤더 === */}
      <Header />

      {/* === 메인 콘텐츠 === */}
      <main className="flex-grow pt-4 pb-8 md:pt-6 md:pb-12">{children}</main>

      {/* === 공통 푸터 === */}
      <Footer />
    </div>
  );
}
