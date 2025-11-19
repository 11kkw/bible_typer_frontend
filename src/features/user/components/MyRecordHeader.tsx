"use client";

import { BibleVersion } from "@/types/models/bible";
import { ChangeEvent } from "react";
import { useMyRecordFilterStore } from "../stores/useMyRecordFilterStore";

interface MyRecordHeaderProps {
  versions: BibleVersion[];
}

export function MyRecordHeader({ versions }: MyRecordHeaderProps) {
  const { versionId, setVersionId } = useMyRecordFilterStore();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setVersionId(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          나의 기록
        </h2>
        <p className="mt-2 text-gray-500">
          나의 타자 통계와 통독 진행 상황을 확인하세요.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <label
          htmlFor="my-record-version-filter"
          className="text-xs font-semibold uppercase text-gray-500 tracking-wide"
        >
          성경 종류
        </label>
        <select
          id="my-record-version-filter"
          className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition"
          value={versionId || ""}
          onChange={handleChange}
          disabled={versions.length === 0}
        >
          {versions.map((version) => (
            <option key={version.id} value={version.id.toString()}>
              {version.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
