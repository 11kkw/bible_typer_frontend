// src/app/(auth)/layout.tsx
import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground font-sans antialiased">
      <main className="flex min-h-screen flex-col items-stretch justify-center">
        {children}
      </main>
    </div>
  );
}
