import { fetchRandomVerses } from "@/api/bible";
import { TypingArea } from "@/components/features/typing/TypingArea";

export default async function Page() {
  const verses = await fetchRandomVerses(4);

  return (
    <main className="flex items-center justify-center min-h-screen p-8">
      <TypingArea initialVerses={verses} />
    </main>
  );
}
