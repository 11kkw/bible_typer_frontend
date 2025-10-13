import VerseSelectForm from "./VerseSelectForm";

interface BibleVersion {
  id: number;
  code: string;
  name: string;
  language: string;
  publisher: string;
}

export default function VerseSelectSection({
  versions,
}: {
  versions: BibleVersion[];
}) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <section>
        <h2 className="text-3xl font-bold tracking-tight">구절 선택</h2>
        <p className="mt-2 text-md text-[var(--subtle-text-color)]">
          타자하고 싶은 성경 구절을 선택하세요.
        </p>
      </section>

      <VerseSelectForm versions={versions} />
    </div>
  );
}
