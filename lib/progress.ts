const STORAGE_KEY = "course_progress";

function getStore(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getProgress(courseSlug: string): string[] {
  return getStore()[courseSlug] || [];
}

export function markComplete(courseSlug: string, lessonId: string): string[] {
  const store = getStore();
  const completed = store[courseSlug] || [];
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    store[courseSlug] = completed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
  return completed;
}

export function getLastAccessed(courseSlug: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`course_last_${courseSlug}`);
}

export function setLastAccessed(courseSlug: string, lessonSlug: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`course_last_${courseSlug}`, lessonSlug);
}
