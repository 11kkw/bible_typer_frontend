import TypingSetupForm from "./TypingSetupForm";

interface BibleVersion {
  id: number;
  code: string;
  name: string;
  language: string;
  publisher: string;
}

export default function TypingSetupSection({
  versions,
}: {
  versions: BibleVersion[];
}) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <section>
        <h2 className="text-3xl font-bold tracking-tight">말씀 선택</h2>
        <p className="mt-2 text-md text-[var(--subtle-text-color)]">
          타자할 말씀의 범위를 선택하세요.
        </p>
      </section>

      <TypingSetupForm versions={versions} />
    </div>
  );
}
