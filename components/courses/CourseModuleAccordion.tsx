"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Lesson {
  _id: string;
  title: string;
  duration?: string;
  isFreePreview?: boolean;
}

interface Module {
  _id: string;
  title: string;
  description?: string;
  order?: number;
  lessons?: Lesson[];
}

interface CourseModuleAccordionProps {
  modules: Module[];
}

export function CourseModuleAccordion({ modules }: CourseModuleAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!modules?.length) return null;

  return (
    <div className="divide-y divide-sand/40">
      {modules.map((mod, i) => (
        <div key={mod._id}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left py-6 flex items-center justify-between gap-4 group"
          >
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-sage mb-1 block">
                Module {mod.order || i + 1}
              </span>
              <span className="font-serif text-xl font-medium text-espresso group-hover:text-terracotta transition-colors">
                {mod.title}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-sans text-xs text-espresso/40">
                {mod.lessons?.length || 0} lessons
              </span>
              <span
                className={`text-xl text-espresso/40 transition-transform duration-300 ${
                  openIndex === i ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </div>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {mod.description && (
                  <p className="font-sans text-sm text-espresso/60 mb-4">
                    {mod.description}
                  </p>
                )}
                <ul className="space-y-1 pb-6">
                  {mod.lessons?.map((lesson, j) => (
                    <li
                      key={lesson._id}
                      className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-sand/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs text-espresso/30 w-5">
                          {j + 1}
                        </span>
                        <span className="font-sans text-sm text-espresso/80">
                          {lesson.title}
                        </span>
                        {lesson.isFreePreview && (
                          <span className="font-sans text-[10px] uppercase tracking-widest text-sage bg-sage/10 px-2 py-0.5 rounded-full">
                            Preview
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.duration && (
                          <span className="font-sans text-xs text-espresso/30">
                            {lesson.duration}
                          </span>
                        )}
                        {!lesson.isFreePreview && (
                          <svg className="w-3.5 h-3.5 text-espresso/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
