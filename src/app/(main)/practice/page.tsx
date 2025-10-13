import { fetchBibleVersions } from "@/api/bible";
import { ReadingSection } from "@/components/features/practice/ReadingSection";
import VerseSelectSection from "@/components/features/practice/VerseSelectSection";

export default async function PracticePage() {
  const versions = await fetchBibleVersions();

  return (
    <main className="w-full min-h-screen bg-background text-foreground">
      <div className="container-wide py-12 grid grid-cols-[2fr_3fr] gap-12">
        <div className="space-y-8">
          <VerseSelectSection versions={versions.results} />
        </div>

        <div className="space-y-8">
          <ReadingSection />
        </div>
      </div>
    </main>
  );
}
