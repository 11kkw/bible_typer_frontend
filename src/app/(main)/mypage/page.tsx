export default function MyRecordPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-900">
      <div className="container-wide py-12">
        {/* === 상단: 나의 기록 + 통계 카드 === */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            나의 기록
          </h2>
          <p className="mt-2 text-gray-500">
            나의 타자 통계와 통독 진행 상황을 확인하세요.
          </p>

          {/* 통계 카드 */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">총 타자 시간</p>
              <p className="text-3xl font-bold text-gray-900">12시간 34분</p>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">평균 속도</p>
              <p className="text-3xl font-bold text-gray-900">
                45{" "}
                <span className="text-lg font-medium text-gray-500">타/분</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">총 정확도</p>
              <p className="text-3xl font-bold text-gray-900">
                98.5
                <span className="text-lg font-medium text-gray-500">%</span>
              </p>
            </div>
          </div>
        </section>

        {/* === 하단: 2단 레이아웃 === */}
        <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* --- 왼쪽: 타자 기록 테이블 --- */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              타자 기록
            </h3>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      구절
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      날짜
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      속도 (타/분)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      정확도 (%)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {
                      verse: "창세기 1:1 - 1:5",
                      date: "2024-07-26",
                      speed: 50,
                      acc: 99,
                    },
                    {
                      verse: "시편 23:1 - 23:6",
                      date: "2024-07-25",
                      speed: 42,
                      acc: 97,
                    },
                    {
                      verse: "요한복음 3:16 - 3:21",
                      date: "2024-07-24",
                      speed: 48,
                      acc: 98,
                    },
                  ].map((r) => (
                    <tr
                      key={r.verse}
                      className="hover:bg-gray-50/60 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {r.verse}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {r.speed}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {r.acc}%
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                          상세 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- 오른쪽: 통독 진행 상황 --- */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              통독 진행 상황
            </h3>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900">성경 전체</p>
                  <p className="text-lg font-bold text-emerald-600">35%</p>
                </div>
                <div className="mt-3 h-4 w-full rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-emerald-400"
                    style={{ width: "35%" }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-gray-700">구약</p>
                    <p className="font-medium text-gray-500">40%</p>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-400"
                      style={{ width: "40%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-gray-700">신약</p>
                    <p className="font-medium text-gray-500">25%</p>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-400"
                      style={{ width: "25%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
