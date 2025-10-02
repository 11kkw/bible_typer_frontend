export default function Home() {
  return (
    <div className="mx-auto max-w-4xl text-center px-4 py-16 sm:py-24">
      <div className="flex justify-center mb-8">
        <div className="p-5 rounded-full bg-white shadow-lg">
          <span className="material-symbols-outlined text-6xl text-pastel-green">
            keyboard
          </span>
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
        말씀을 타이핑하며 마음에 새기세요
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-lg text-text-light leading-8">
        성경 구절 타자 연습을 통해 믿음을 키우고, 진행 상황을 추적하며,
        하나님의 말씀과 더 깊이 연결되세요. 오늘 당신의 영적 여정을 시작하세요.
      </p>

      <div className="mt-10">
        <a
          href="/start"
          className="inline-flex items-center justify-center h-14 px-8 text-lg font-bold text-white bg-pastel-green rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#97c7b8]"
        >
          시작하기
        </a>
      </div>
    </div>
  )
}
