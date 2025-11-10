"use client";

import { ReactNode } from "react";

interface SessionCompleteModalProps {
  open: boolean;
  onClose?: () => void;
  onRetry?: () => void;
  onNewVerse?: () => void;
  onSave?: () => void;
  title?: string;
  description?: string;
  stats: {
    cpm: number;
    accuracy: number;
    time: string;
  };
  footer?: ReactNode;
}

export function SessionCompleteModal({
  open,
  onClose,
  onRetry,
  onNewVerse,
  onSave,
  title = "세션 완료",
  description = "참고 구절을 모두 입력했어요. 기록을 저장할까요?",
  stats,
  footer,
}: SessionCompleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-8 text-center shadow-2xl">
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <p className="text-sm font-semibold uppercase tracking-wide text-teal-500">
          Session Complete
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-base text-gray-600">{description}</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { label: "CPM", value: `${stats.cpm}` },
            { label: "Accuracy", value: `${stats.accuracy}%` },
            { label: "Time", value: stats.time || "00:00" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-inset ring-gray-200"
            >
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <button
            className="w-full rounded-xl bg-teal-300/80 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-teal-300 sm:w-auto"
            onClick={onSave ?? onClose}
          >
            타자 기록 저장
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-300 sm:w-auto"
            onClick={onRetry}
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            다시 연습
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-300 sm:w-auto"
            onClick={onNewVerse}
          >
            <span className="material-symbols-outlined text-base">
              menu_book
            </span>
            새 말씀
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-teal-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            진행 상황을 저장하세요
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            계정을 만들고 로그인하면 기록을 보관하고 성장 곡선을 확인할 수
            있어요.
          </p>
          {footer ?? (
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="w-full rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 sm:w-auto">
                회원가입
              </button>
              <button className="w-full rounded-lg bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50 sm:w-auto">
                로그인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
