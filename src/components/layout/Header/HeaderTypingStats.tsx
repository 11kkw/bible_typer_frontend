"use client";

interface HeaderTypingStatsProps {
  progress?: number;
  currentRef?: string;
  elapsedTime?: string;
  accuracy?: number;
  cpm?: number;
  errorCount?: number;
  visible?: boolean;
}

export function HeaderTypingStats({
  progress = 0,
  currentRef = "",
  elapsedTime = "00:00",
  accuracy = 100,
  cpm = 0,
  errorCount = 0,
  visible = false,
}: HeaderTypingStatsProps) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));
  const isComplete = clampedProgress >= 99.9;
  if (!visible) return null;
  return (
    <div
      className={`
        w-full animate-fade-in
        bg-background/80 backdrop-blur-lg
      `}
    >
      <div className="container-wide">
        {/* 진행률 바 */}
        <div className="w-full h-[8px] bg-gray-200 rounded-full relative overflow-hidden">
          <div
            className="absolute inset-y-0 bg-primary transition-all duration-500 ease-out"
            style={
              isComplete
                ? { left: 0, right: 0 }
                : { left: 0, width: `${clampedProgress}%` }
            }
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

          {/* 우측: 타이머 + 정확도 + CPM */}
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
              <span
                className={`material-symbols-outlined text-[15px] translate-y-[1px] ${
                  errorCount > 0
                    ? "text-red-500"
                    : "text-muted-foreground/80"
                }`}
              >
                {errorCount > 0 ? "error" : "check_circle"}
              </span>
              <span
                className={`font-semibold ${
                  errorCount > 0 ? "text-red-500" : "text-foreground"
                }`}
              >
                {accuracy}%
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-muted-foreground/80 translate-y-[1px]">
                speed
              </span>
              <span className="text-foreground font-semibold">
                {Math.max(0, Math.round(cpm))}
              </span>
              <span className="text-xs text-muted-foreground/70">CPM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
