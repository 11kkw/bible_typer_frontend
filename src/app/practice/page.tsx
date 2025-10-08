// app/practice/page.tsx
import { VerseSelectSection } from "@/components/features/practice/VerseSelectSection";
import { ReadingSection } from "@/components/features/practice/ReadingSection";

export default function PracticePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-1 w-full">
        <div className="container-padded py-8 md:py-12 grid grid-cols-1 lg:grid-cols-5 lg:gap-12">
          {/* 왼쪽: 구절 선택 */}
          <VerseSelectSection />

          {/* 오른쪽: 통독 관련 섹션 */}
          <ReadingSection />
        </div>
      </section>
    </div>
  );
}
