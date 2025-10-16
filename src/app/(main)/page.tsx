// app/typing/page.tsx
import { TypingArea } from "@/features/typing/components/TypingArea";
import { fetchRandomVerses } from "@/features/typing/services/bible.service";

export default async function Page() {
  const verses = await fetchRandomVerses(4);

  return (
    <main className="flex items-center justify-center min-h-screen p-8">
      <TypingArea initialVerses={verses} /> {/* SSR 데이터 전달 */}
    </main>
  );
}
