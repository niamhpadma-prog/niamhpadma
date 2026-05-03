"use client";

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/sanity/portableText";
import { markComplete, getProgress } from "@/lib/progress";
import { useState, useEffect } from "react";
import Link from "next/link";

interface LessonContentProps {
  lessonId: string;
  courseSlug: string;
  body?: unknown[];
  resources?: { asset?: { url?: string; originalFilename?: string } }[];
  prevLesson?: { slug: string; title: string } | null;
  nextLesson?: { slug: string; title: string } | null;
}

export function LessonContent({
  lessonId,
  courseSlug,
  body,
  resources,
  prevLesson,
  nextLesson,
}: LessonContentProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(getProgress(courseSlug).includes(lessonId));
  }, [courseSlug, lessonId]);

  const handleMarkComplete = () => {
    markComplete(courseSlug, lessonId);
    setIsComplete(true);
    window.dispatchEvent(new Event("progress-update"));
  };

  return (
    <div className="mt-8">
      {/* Portable text body */}
      {body && body.length > 0 && (
        <div className="max-w-2xl mb-8">
          <PortableText
            value={body as Parameters<typeof PortableText>[0]["value"]}
            components={portableTextComponents}
          />
        </div>
      )}

      {/* Downloadable resources */}
      {resources && resources.length > 0 && (
        <div className="mb-8">
          <h3 className="font-sans text-sm font-medium text-espresso mb-3">Resources</h3>
          <div className="space-y-2">
            {resources.map((res, i) => (
              res.asset?.url && (
                <a
                  key={i}
                  href={res.asset.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-sand/20 rounded-xl hover:bg-sand/30 transition-colors"
                >
                  <svg className="w-4 h-4 text-sage flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-sans text-sm text-espresso/70">
                    {res.asset.originalFilename || "Download"}
                  </span>
                </a>
              )
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-sand/20">
        <button
          onClick={handleMarkComplete}
          disabled={isComplete}
          className={`inline-flex items-center gap-2 font-sans text-sm font-medium px-6 py-3 rounded-full transition-all duration-300 ${
            isComplete
              ? "bg-sage/10 text-sage cursor-default"
              : "border-2 border-espresso text-espresso hover:bg-espresso hover:text-cream"
          }`}
        >
          {isComplete ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </>
          ) : (
            "Mark as Complete"
          )}
        </button>

        <div className="flex items-center gap-3">
          {prevLesson && (
            <Link
              href={`/courses/${courseSlug}/learn/${prevLesson.slug}`}
              className="font-sans text-sm text-espresso/50 hover:text-espresso transition-colors"
            >
              Previous
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/courses/${courseSlug}/learn/${nextLesson.slug}`}
              className="inline-flex items-center gap-1 font-sans text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors"
            >
              Next Lesson
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
