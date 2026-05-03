"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProgress } from "@/lib/progress";

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  duration?: string;
  order?: number;
}

interface Module {
  _id: string;
  title: string;
  order?: number;
  lessons?: Lesson[];
}

interface CourseSidebarProps {
  courseSlug: string;
  modules: Module[];
  currentLessonSlug: string;
}

export function CourseSidebar({
  courseSlug,
  modules,
  currentLessonSlug,
}: CourseSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getProgress(courseSlug));
  }, [courseSlug]);

  // Listen for progress updates
  useEffect(() => {
    const handleStorage = () => setCompleted(getProgress(courseSlug));
    window.addEventListener("storage", handleStorage);
    window.addEventListener("progress-update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("progress-update", handleStorage);
    };
  }, [courseSlug]);

  const sidebar = (
    <nav className="py-4">
      {modules.map((mod) => (
        <div key={mod._id} className="mb-4">
          <p className="font-sans text-[10px] uppercase tracking-widest text-espresso/30 px-4 mb-1">
            Module {mod.order}
          </p>
          <p className="font-sans text-sm font-medium text-espresso px-4 mb-2">
            {mod.title}
          </p>
          <ul>
            {mod.lessons?.map((lesson) => {
              const isCurrent = lesson.slug.current === currentLessonSlug;
              const isComplete = completed.includes(lesson._id);
              return (
                <li key={lesson._id}>
                  <Link
                    href={`/courses/${courseSlug}/learn/${lesson.slug.current}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isCurrent
                        ? "bg-terracotta/10 border-l-2 border-terracotta text-espresso font-medium"
                        : "text-espresso/70 hover:bg-sand/20 border-l-2 border-transparent"
                    }`}
                  >
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      {isComplete ? (
                        <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-sand/60" />
                      )}
                    </span>
                    <span className="flex-1 line-clamp-1">{lesson.title}</span>
                    {lesson.duration && (
                      <span className="text-xs text-espresso/30 flex-shrink-0">
                        {lesson.duration}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 border-r border-sand/20 overflow-y-auto h-full bg-cream">
        {sidebar}
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-[110] bg-espresso text-cream w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[105] bg-espresso/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-[106] w-72 bg-cream overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-sand/20">
                <span className="font-sans text-sm font-medium">Lessons</span>
                <button onClick={() => setIsOpen(false)} className="p-1">
                  <svg className="w-5 h-5 text-espresso/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
