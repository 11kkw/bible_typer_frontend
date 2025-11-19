import { fetchBibleVersions } from "@/features/typing/services/bible.service";
import { MyRecordContent } from "@/features/user/components/MyRecordContent";

export default async function MyRecordPage() {
  let versionResponse;
  try {
    versionResponse = await fetchBibleVersions();
  } catch (error) {
  }

  const bibleVersions = versionResponse?.results ?? [];

  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-900">
      <div className="container-wide py-12">
        {/* === 상단: 나의 기록 + 통계 카드 === */}
        <MyRecordContent versions={bibleVersions} />
      </div>
    </main>
  );
}
