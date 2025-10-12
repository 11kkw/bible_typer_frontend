// src/app/(main)/layout.tsx
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="bg-background text-foreground font-sans antialiased">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-4 pb-8 md:pt-6 md:pb-12">
          {children}
        </main>
        <Footer />
      </div>
    </body>
  );
}
