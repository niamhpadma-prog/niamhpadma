"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  title: string;
  slug: string;
  type?: string;
  dateStart?: string;
  dateEnd?: string;
  location?: { name?: string; city?: string; country?: string };
  price?: string;
  status?: string;
  image?: { asset?: { url?: string }; alt?: string };
  excerpt?: string;
  index?: number;
}

export function EventCard({
  title,
  slug,
  type,
  dateStart,
  location,
  price,
  status,
  image,
  excerpt,
  index = 0,
}: EventCardProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/events/${slug}`} className="group block">
        <div className="bg-white rounded-3xl overflow-hidden">
          <div className="relative aspect-[16/10] bg-sand/30 overflow-hidden">
            {image?.asset?.url && (
              <Image
                src={image.asset.url}
                alt={image.alt || title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            {status === "sold-out" && (
              <span className="absolute top-4 right-4 bg-terracotta text-white font-sans text-xs font-semibold px-3 py-1 rounded-full">
                Sold Out
              </span>
            )}
            {type && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-espresso font-sans text-xs font-medium px-3 py-1 rounded-full">
                {type}
              </span>
            )}
          </div>
          <div className="p-6">
            {dateStart && (
              <p className="font-sans text-xs uppercase tracking-widest text-sage mb-2">
                {formatDate(dateStart)}
              </p>
            )}
            <h3 className="font-serif text-2xl mb-2 group-hover:text-terracotta transition-colors">
              {title}
            </h3>
            {location?.city && (
              <p className="font-sans text-sm text-espresso/50 mb-2">
                {[location.name, location.city, location.country].filter(Boolean).join(", ")}
              </p>
            )}
            {excerpt && (
              <p className="font-sans text-sm text-espresso/60 leading-relaxed mb-3 line-clamp-2">
                {excerpt}
              </p>
            )}
            {price && (
              <p className="font-sans text-sm font-semibold text-terracotta">
                {price}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
