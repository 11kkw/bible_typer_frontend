"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BibleVersion } from "@/types/models/bible";
import { useMyRecordFilterStore } from "../stores/useMyRecordFilterStore";
import { useTypingVersionSummary } from "../hooks/useTypingVersionSummary";
import { useTypingBibleProgress } from "../hooks/useTypingBibleProgress";
import { useTypingVersionSessions } from "../hooks/useTypingVersionSessions";
import { MyRecordHeader } from "./MyRecordHeader";
import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { toast } from "sonner";
import { TypingVersionSessionSummary } from "@/types/api/typing";
import {
  prepareTypingSelection,
  resolveChapterIds,
} from "@/features/typing/utils/prepareTypingSelection";

interface MyRecordContentProps {
  versions: BibleVersion[];
}

function formatDuration(seconds?: number) {
  if (!seconds || seconds <= 0) return "0분";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0 || hours === 0) parts.push(`${minutes}분`);

  return parts.join(" ");
}

export function MyRecordContent({ versions }: MyRecordContentProps) {
  const router = useRouter();
  const { versionId, setVersionId } = useMyRecordFilterStore();
  const [resumingId, setResumingId] = useState<number | null>(null);
  const setCurrentChapter = useVerseSelectStore((state) => state.setCurrentChapter);

  useEffect(() => {
    if (!versions.length) return;
    const firstId = versions[0].id.toString();
    if (!versionId || !versions.find((v) => v.id.toString() === versionId)) {
      setVersionId(firstId);
    }
  }, [versions, versionId, setVersionId]);

  const numericVersionId = versionId ? Number(versionId) : undefined;
  const { summary, loading, error } = useTypingVersionSummary(numericVersionId);
  const {
    progress: bibleProgress,
    loading: progressLoading,
    error: progressError,
  } = useTypingBibleProgress(numericVersionId);
  const {
    data: sessionsResponse,
    loading: sessionsLoading,
    error: sessionsError,
  } = useTypingVersionSessions(numericVersionId);

  const stats = {
    totalTime: formatDuration(summary?.total_time),
    avgSpeed:
      summary?.avg_speed != null
        ? Math.round(summary.avg_speed * 10) / 10
        : undefined,
    avgAccuracy:
      summary?.avg_accuracy != null
        ? Math.round(summary.avg_accuracy * 10) / 10
        : undefined,
  };

  const sessions = sessionsResponse?.results ?? [];

  const percentFrom = (value?: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    return Math.round(Math.max(0, Math.min(1, value)) * 1000) / 10; // 한 자리 소수
  };

  const progressData = [
    {
      label: "성경 전체",
      percent: percentFrom(bibleProgress?.overall?.progress),
      heightClass: "h-4",
      barClass: "bg-emerald-500",
    },
    {
      label: "구약",
      percent: percentFrom(bibleProgress?.ot?.progress),
      heightClass: "h-2",
      barClass: "bg-blue-500",
    },
    {
      label: "신약",
      percent: percentFrom(bibleProgress?.nt?.progress),
      heightClass: "h-2",
      barClass: "bg-blue-400",
    },
  ];

  const handleResume = async (session: TypingVersionSessionSummary) => {
    if (resumingId) return;
    const resumeChapter = session.next_start_chapter ?? session.start_chapter;
    const resumeEnd = session.next_end_chapter ?? session.end_chapter;
    if (!resumeChapter) return;
    const selectionStart = session.start_chapter ?? resumeChapter;
    const selectionEnd = session.end_chapter ?? resumeEnd ?? selectionStart;
    const resolvedEnd = resumeEnd ?? selectionEnd;
    const resumeVerse =
      session.next_start_verse ??
      session.start_verse ??
      1;

    setResumingId(session.session_id);
    try {
      const versionMeta = versions.find((v) => v.id === session.version_id);
      setVersionId(session.version_id.toString());
      const chapterIds = await resolveChapterIds(
        session.book_id,
        selectionStart,
        selectionEnd
      );

      await prepareTypingSelection({
        versionId: session.version_id,
        versionName: versionMeta?.name ?? null,
        bookId: session.book_id,
        bookTitle: session.book_title ?? null,
        startChapterNumber: selectionStart,
        endChapterNumber: selectionEnd,
        startVerseNumber: resumeVerse,
        session: {
          id: session.session_id,
          version: session.version_id,
          book: session.book_id,
          start_chapter: chapterIds.startChapterId,
          end_chapter: chapterIds.endChapterId,
          status: "in_progress",
          last_unfinished_verse: 0,
        },
        resolvedChapterIds: chapterIds,
      });

      setCurrentChapter(resumeChapter);
      await router.push("/");
    } catch (error) {
      toast.error("타자 세션을 준비하지 못했어요.");
    } finally {
      setResumingId(null);
    }
  };

  if (!versions.length) {
    return (
      <section>
        <MyRecordHeader versions={[]} />
        <p className="mt-6 text-sm text-gray-500">
          표시할 성경 버전 데이터를 불러올 수 없습니다.
        </p>
      </section>
    );
  }

  return (
    <>
      <section>
        <MyRecordHeader versions={versions} />
        {error && (
          <p className="mt-2 text-sm text-red-500">
            데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}
        {progressError && (
          <p className="mt-1 text-sm text-red-500">
            통독 진행 정보를 불러오는 데 실패했습니다.
          </p>
        )}
        {sessionsError && (
          <p className="mt-1 text-sm text-red-500">
            세션 기록을 불러오는 데 실패했습니다.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">총 타자 시간</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalTime ?? "-"}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">평균 속도</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.avgSpeed != null ? stats.avgSpeed : "-"}
              <span className="ml-1 text-lg font-medium text-gray-500">
                타/분
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">총 정확도</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.avgAccuracy != null ? stats.avgAccuracy : "-"}
              <span className="ml-1 text-lg font-medium text-gray-500">%</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            타자 기록
          </h3>

          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                    구절
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    진행률
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                    속도 (타/분)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                    정확도 (%)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessionsLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      데이터를 불러오는 중입니다...
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      아직 진행 중인 세션 기록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => {
                    const rangeLabel =
                      session.start_chapter === session.end_chapter
                        ? `${session.start_chapter}장`
                        : `${session.start_chapter}장 ~ ${session.end_chapter}장`;
                    const bookLabel = session.book_title
                      ? session.book_title.trim()
                      : `책 #${session.book_id}`;
                    const progressPercent = percentFrom(session.progress);
                    const speedText =
                      session.avg_speed != null
                        ? (Math.round(session.avg_speed * 10) / 10).toString()
                        : "-";
                    const accuracyText =
                      session.avg_accuracy != null
                        ? `${(Math.round(session.avg_accuracy * 10) / 10).toString()}%`
                        : "-";
                    const isCompleted =
                      progressPercent >= 100 ||
                      session.completed >= session.total_verses;

                    return (
                      <tr key={session.session_id}>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                          {bookLabel} · {rangeLabel}
                        </td>
                        <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                          <div className="max-w-xs">
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {progressPercent}% ({session.completed}/{session.total_verses})
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-center">
                          {speedText}
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-center">
                          {accuracyText}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {isCompleted ? (
                            <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-semibold text-gray-500">
                              <span className="material-symbols-outlined text-base">
                                task_alt
                              </span>
                              완료됨
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                void handleResume(session);
                              }}
                              disabled={resumingId === session.session_id}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-100 hover:border-emerald-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-base">
                                play_arrow
                              </span>
                              이어하기
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            통독 진행 상황
          </h3>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            {progressLoading ? (
              <p className="text-sm text-gray-500">진행률을 불러오는 중...</p>
            ) : (
              progressData.map((item, idx) => (
                <div key={`${item.label}-${idx}`}>
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-gray-700">{item.label}</p>
                    <p className="font-medium text-gray-500">
                      {item.percent}%
                    </p>
                  </div>
                  <div
                    className={`mt-3 w-full rounded-full bg-gray-200 ${item.heightClass}`}
                  >
                    <div
                      className={`${item.barClass} rounded-full transition-all ${item.heightClass}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
