"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { asset?: { url?: string }; alt?: string };
  categories?: string[];
  publishedAt?: string;
  readingTime?: number;
  index?: number;
  featured?: boolean;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  categories,
  publishedAt,
  readingTime,
  index = 0,
  featured = false,
}: BlogCardProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Link href={`/journal/${slug}`} className="group block">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden">
            <div className="relative aspect-[4/3] md:aspect-auto bg-sand/30 overflow-hidden">
              {coverImage?.asset?.url && (
                <Image
                  src={coverImage.asset.url}
                  alt={coverImage.alt || title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                {categories?.[0] && (
                  <span className="font-sans text-xs uppercase tracking-widest text-sage">
                    {categories[0]}
                  </span>
                )}
                {readingTime && (
                  <span className="font-sans text-xs text-espresso/30">
                    {readingTime} min read
                  </span>
                )}
              </div>
              <h3 className="font-serif text-3xl mb-3 group-hover:text-terracotta transition-colors">
                {title}
              </h3>
              {excerpt && (
                <p className="font-sans text-base text-espresso/60 leading-relaxed mb-4 line-clamp-3">
                  {excerpt}
                </p>
              )}
              {publishedAt && (
                <p className="font-sans text-xs text-espresso/30">
                  {formatDate(publishedAt)}
                </p>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Link href={`/journal/${slug}`} className="group block">
        <div className="relative aspect-[4/3] bg-sand/30 rounded-2xl overflow-hidden mb-4">
          {coverImage?.asset?.url && (
            <Image
              src={coverImage.asset.url}
              alt={coverImage.alt || title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </div>
        <div className="flex items-center gap-3 mb-2">
          {categories?.[0] && (
            <span className="font-sans text-xs uppercase tracking-widest text-sage">
              {categories[0]}
            </span>
          )}
          {readingTime && (
            <span className="font-sans text-xs text-espresso/30">
              {readingTime} min read
            </span>
          )}
        </div>
        <h3 className="font-serif text-xl mb-2 group-hover:text-terracotta transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="font-sans text-sm text-espresso/60 leading-relaxed line-clamp-2 mb-2">
            {excerpt}
          </p>
        )}
        {publishedAt && (
          <p className="font-sans text-xs text-espresso/30">
            {formatDate(publishedAt)}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
