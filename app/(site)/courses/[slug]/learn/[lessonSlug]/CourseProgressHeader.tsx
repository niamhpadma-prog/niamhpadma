"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/courses/ProgressBar";
import { getProgress } from "@/lib/progress";

interface CourseProgressHeaderProps {
  courseSlug: string;
  totalLessons: number;
}

export function CourseProgressHeader({
  courseSlug,
  totalLessons,
}: CourseProgressHeaderProps) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const update = () => setCompleted(getProgress(courseSlug).length);
    update();
    window.addEventListener("progress-update", update);
    return () => window.removeEventListener("progress-update", update);
  }, [courseSlug]);

  return (
    <div className="mb-6">
      <ProgressBar completed={completed} total={totalLessons} />
    </div>
  );
}
