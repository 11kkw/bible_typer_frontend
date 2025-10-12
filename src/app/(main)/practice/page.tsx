import { VerseSelectSection } from "@/components/features/practice/VerseSelectSection";
import { ReadingSection } from "@/components/features/practice/ReadingSection";

export default function PracticePage() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground">
      {/* 전체 컨텐츠 래퍼 */}
      <div className="container-wide py-12 grid grid-cols-[2fr_3fr] gap-12">
        {/* 왼쪽: 구절 선택 */}
        <div className="space-y-8">
          <VerseSelectSection />
        </div>

        {/* 오른쪽: 통독 섹션 */}
        <div className="space-y-8">
          <ReadingSection />
        </div>
      </div>
    </main>
  );
}
