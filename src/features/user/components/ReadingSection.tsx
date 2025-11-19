"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BibleVersion } from "@/types/models/bible";
import { useTypingBibleProgress } from "@/features/user/hooks/useTypingBibleProgress";
import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { fetchNextUntypedVerse } from "@/features/typing/services/typing.service";
import { useAuthStore } from "@/features/auth/stores/authStore";
import {
  prepareTypingSelection,
  resolveChapterIds,
} from "@/features/typing/utils/prepareTypingSelection";
import { toast } from "sonner";

interface ReadingSectionProps {
  versions: BibleVersion[];
  completionPercentOverride?: number;
  dailyVerse?: string;
  dailyReference?: string;
  onQuickStart?: (versionId: number) => void;
  onResumeUnfinished?: (versionId: number) => void;
}

export function ReadingSection({
  versions,
  completionPercentOverride,
  dailyVerse = "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라",
  dailyReference = "마태복음 11:28",
  onQuickStart,
  onResumeUnfinished,
}: ReadingSectionProps) {
  const router = useRouter();
  const selectedVersionId = useVerseSelectStore(
    (state) => state.selectedVersionId
  );
  const setVersion = useVerseSelectStore((state) => state.setVersion);
  const [resumeLoading, setResumeLoading] = useState(false);
  const isLoggedIn = useAuthStore((state) => Boolean(state.access));

  useEffect(() => {
    if (!selectedVersionId && versions[0]) {
      setVersion(versions[0].id, { name: versions[0].name });
    }
  }, [selectedVersionId, versions, setVersion]);

  const activeVersionId = selectedVersionId ?? versions[0]?.id ?? null;
  const { progress, loading } = useTypingBibleProgress(
    activeVersionId ?? undefined
  );

  const derivedPercent = useMemo(() => {
    if (typeof completionPercentOverride === "number") {
      return Math.max(0, Math.min(100, completionPercentOverride));
    }
    const raw = progress?.overall?.progress;
    if (typeof raw === "number") {
      return Math.round(Math.max(0, Math.min(1, raw)) * 1000) / 10;
    }
    return 0;
  }, [progress?.overall?.progress, completionPercentOverride]);


  const startTypingFrom = async (
    versionId?: number,
    override?: {
      bookId?: number;
      chapterNumber?: number;
      verseNumber?: number;
      bookTitle?: string | null;
    }
  ) => {
    if (!versionId) {
      toast.error("먼저 성경 종류를 선택해주세요.");
      return;
    }
    if (resumeLoading) return;

    const needsNextVerse = !override?.bookId || !override?.chapterNumber || !override?.verseNumber;
    if (needsNextVerse && !isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    setResumeLoading(true);
    try {
      let target = { ...override };

      if (needsNextVerse) {
        const next = await fetchNextUntypedVerse(versionId);
        if (!next || (next as any).detail) {
          toast.info(next?.detail ?? "해당 번역의 모든 절을 이미 완료했어요.");
          return;
        }
        target = {
          bookId: next.book_id,
          chapterNumber: next.chapter_number,
          verseNumber: next.verse_number,
          bookTitle: next.book_title ?? null,
        };
      }

      const chapterIds = await resolveChapterIds(
        target.bookId!,
        target.chapterNumber!,
        target.chapterNumber!
      );

      await prepareTypingSelection({
        versionId,
        versionName: versions.find((v) => v.id === versionId)?.name,
        bookId: target.bookId!,
        bookTitle: target.bookTitle ?? null,
        startChapterNumber: target.chapterNumber!,
        endChapterNumber: target.chapterNumber!,
        startVerseNumber: target.verseNumber!,
        resolvedChapterIds: chapterIds,
      });

      router.push("/");
    } catch (error) {
      toast.error("진행할 절을 찾지 못했어요.");
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <div className="lg:col-span-3 space-y-8 mt-12 lg:mt-0">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            통독 시작
          </h2>
          <p className="mt-2 text-md text-muted-foreground">
            진행 상황을 확인하고 통독을 이어가세요.
          </p>
        </div>
        <div className="w-full sm:w-56">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            htmlFor="reading-version-select-header"
          >
            성경 종류
          </label>
          <select
            id="reading-version-select-header"
            className="mt-1 w-full rounded-lg border border-border/70 bg-white py-2 px-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
            value={activeVersionId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return;
              const id = Number(value);
              const meta = versions.find((v) => v.id === id);
              setVersion(id, { name: meta?.name ?? null });
            }}
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="space-y-4">
        {/* 진행 현황 카드 */}
        <div className="rounded-xl border border-border/80 bg-white p-5 shadow-sm relative">
          <h3 className="font-semibold text-lg mb-3">내 통독 진행 상황</h3>
          <div className="w-full bg-gray-200/70 rounded-full h-3.5 mb-2 overflow-hidden">
            <div
              className="bg-primary h-3.5 rounded-full transition-all duration-300"
              style={{ width: `${derivedPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {activeVersionId ? "신·구약 전체" : "버전을 선택해주세요"}
            </span>
            <span className="font-medium text-foreground">
              {loading && activeVersionId ? "로딩 중..." : `${derivedPercent}% 완료`}
            </span>
          </div>
          {!isLoggedIn && (
            <div className="absolute inset-0 rounded-xl bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl text-gray-400">
                lock
              </span>
              <p className="text-sm font-medium text-gray-600">
                로그인 후 이용 가능합니다
              </p>
            </div>
          )}
        </div>


        {/* 오늘의 통독 추천 구절 */}
        <div className="rounded-xl border border-border/80 bg-white p-5 shadow-sm space-y-4 relative overflow-hidden">
          <h3 className="font-semibold text-lg">오늘의 통독 추천 구절</h3>
          <blockquote className="border-l-4 border-primary/80 pl-4 text-base text-foreground/90">
            <p className="italic">&quot;{dailyVerse}&quot;</p>
            <p className="text-right text-sm text-muted-foreground mt-3">
              - {dailyReference}
            </p>
          </blockquote>
          <button
            type="button"
            onClick={() => {
              if (onQuickStart) {
                activeVersionId && onQuickStart(activeVersionId);
              } else {
                void startTypingFrom(activeVersionId);
              }
            }}
            disabled
            className="w-full rounded-lg bg-primary/90 py-2.5 px-5 text-sm font-bold text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-60"
          >
            바로 타자 시작
          </button>
          <div className="absolute inset-0 rounded-xl bg-white/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-center px-6">
            <span className="material-symbols-outlined text-3xl text-gray-400">
              engineering
            </span>
            <p className="text-sm font-semibold text-gray-700">
              추후 업데이트 예정입니다
            </p>
            <p className="text-xs text-gray-500">
              오늘의 추천 구절 기능이 준비되는 대로 알려드릴게요.
            </p>
          </div>
        </div>

        {/* 이어하기 버튼 */}
        <div className="rounded-xl border border-border/80 bg-white p-5 shadow-sm relative">
          <button
            type="button"
            onClick={() => {
              if (onResumeUnfinished) {
                activeVersionId && onResumeUnfinished(activeVersionId);
              } else {
                void startTypingFrom(activeVersionId);
              }
            }}
            disabled={resumeLoading || !isLoggedIn}
            className="w-full rounded-lg bg-primary/80 py-3.5 px-6 text-base font-bold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:cursor-not-allowed"
          >
            {resumeLoading ? "준비 중..." : "내가 아직 못 한 부분 타자하기"}
          </button>
          {(!isLoggedIn || resumeLoading) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/80 backdrop-blur-[1px]">
              <span className="material-symbols-outlined text-2xl text-gray-500">
                lock
              </span>
              <p className="text-xs font-medium text-gray-600">
                로그인 후 이용 가능합니다
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
