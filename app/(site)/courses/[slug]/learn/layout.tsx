import Link from "next/link";

export default function CoursePlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-cream overflow-auto flex flex-col">
      {/* Slim header */}
      <header className="border-b border-sand/20 bg-cream/95 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <Link
            href="/courses"
            className="flex items-center gap-2 font-sans text-sm text-espresso/70 hover:text-espresso transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Link>
          <Link
            href="/"
            className="font-serif text-sm font-semibold text-espresso tracking-[0.06em] uppercase"
          >
            Niamh Padma
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
