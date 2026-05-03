"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-sand/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-terracotta rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="font-sans text-xs text-espresso/50 whitespace-nowrap">
        {completed}/{total} lessons
      </span>
    </div>
  );
}
