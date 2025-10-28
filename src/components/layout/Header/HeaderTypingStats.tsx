"use client";

interface HeaderTypingStatsProps {
  progress?: number;
  currentRef?: string;
  elapsedTime?: string;
  accuracy?: number;
  visible?: boolean;
}

export function HeaderTypingStats({
  progress = 0,
  currentRef = "",
  elapsedTime = "00:00",
  accuracy = 100,
  visible = false,
}: HeaderTypingStatsProps) {
  if (!visible) return null;
  console.log(progress);
  return (
    <div
      className={`
        w-full animate-fade-in
        bg-background/80 backdrop-blur-lg
      `}
    >
      <div className="container-wide">
        {/* 진행률 바 */}
        <div className="w-full h-[8px] bg-gray-200 rounded-full relative">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(progress, 100)}%`,
              borderRadius: progress >= 100 ? "inherit" : "9999px 0 0 9999px",
            }}
          />
        </div>

        {/* 하단 정보줄 */}
        <div className="flex items-center justify-between py-1.5 text-[13px] text-muted-foreground font-medium select-none">
          {/* 좌측: 구절 */}
          <div className="truncate">
            {currentRef && (
              <span className="text-foreground/85 font-semibold tracking-tight">
                {currentRef}
              </span>
            )}
          </div>

          {/* 우측: 타이머 + 정확도 */}
          <div className="flex items-center gap-4 text-muted-foreground/90">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-muted-foreground/80 translate-y-[1px]">
                timer
              </span>
              <span className="text-foreground font-semibold">
                {elapsedTime}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-muted-foreground/80 translate-y-[1px]">
                check_circle
              </span>
              <span className="text-foreground font-semibold">{accuracy}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
