"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  title: string;
  slug: string;
  tagline?: string;
  thumbnail?: { asset?: { url?: string }; alt?: string };
  price?: number;
  currency?: string;
  level?: string;
  totalDuration?: string;
  moduleCount?: number;
  lessonCount?: number;
  index?: number;
}

const currencySymbol: Record<string, string> = {
  GBP: "\u00a3",
  EUR: "\u20ac",
  USD: "$",
};

export function CourseCard({
  title,
  slug,
  tagline,
  thumbnail,
  price,
  currency = "GBP",
  level,
  totalDuration,
  moduleCount,
  lessonCount,
  index = 0,
}: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Link href={`/courses/${slug}`} className="group block">
        <div className="relative aspect-[16/9] bg-sand/30 rounded-2xl overflow-hidden mb-4">
          {thumbnail?.asset?.url && (
            <Image
              src={thumbnail.asset.url}
              alt={thumbnail.alt || title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
          {level && (
            <span className="absolute top-4 left-4 font-sans text-xs uppercase tracking-widest bg-sage/90 text-white px-3 py-1 rounded-full">
              {level}
            </span>
          )}
        </div>
        <h3 className="font-serif text-2xl mb-1 group-hover:text-terracotta transition-colors">
          {title}
        </h3>
        {tagline && (
          <p className="font-sans text-sm text-espresso/60 leading-relaxed mb-3 line-clamp-2">
            {tagline}
          </p>
        )}
        <div className="flex items-center gap-4 font-sans text-sm">
          {price != null && (
            <span className="font-semibold text-terracotta">
              {currencySymbol[currency] || currency}{price}
            </span>
          )}
          {totalDuration && (
            <span className="text-espresso/40">{totalDuration}</span>
          )}
          {moduleCount != null && (
            <span className="text-espresso/40">
              {moduleCount} modules
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
