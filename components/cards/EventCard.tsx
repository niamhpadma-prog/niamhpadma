"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getBookingTarget } from "@/lib/booking";

interface EventCardProps {
  title: string;
  slug: string;
  type?: string;
  dateStart?: string;
  dateEnd?: string;
  location?: { name?: string; city?: string; country?: string };
  price?: string;
  status?: string;
  bookingUrl?: string;
  paidOnline?: boolean;
  image?: { asset?: { url?: string }; alt?: string };
  excerpt?: string;
  index?: number;
}

const bookButtonClasses =
  "inline-flex items-center justify-center font-sans font-medium text-sm px-5 py-2.5 rounded-full bg-espresso text-cream hover:bg-espresso-light transition-colors duration-300 whitespace-nowrap";

export function EventCard({
  title,
  slug,
  type,
  dateStart,
  location,
  price,
  status,
  bookingUrl,
  paidOnline,
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

  const booking = getBookingTarget({ title, slug, bookingUrl, status, paidOnline });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="bg-white rounded-3xl overflow-hidden flex flex-col h-full">
        <Link href={`/events/${slug}`} className="group block">
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
            {status === "cancelled" && (
              <span className="absolute top-4 right-4 bg-espresso/80 text-cream font-sans text-xs font-semibold px-3 py-1 rounded-full">
                Cancelled
              </span>
            )}
            {type && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-espresso font-sans text-xs font-medium px-3 py-1 rounded-full">
                {type}
              </span>
            )}
          </div>
          <div className="px-6 pt-6">
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
              <p className="font-sans text-sm text-espresso/60 leading-relaxed line-clamp-2">
                {excerpt}
              </p>
            )}
          </div>
        </Link>

        {(price || booking) && (
          <div className="mt-auto px-6 pb-6 pt-4 flex items-center justify-between gap-3">
            {price ? (
              <span className="font-sans text-sm font-semibold text-terracotta">{price}</span>
            ) : (
              <span />
            )}
            {booking &&
              (booking.external ? (
                <a
                  href={booking.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={bookButtonClasses}
                >
                  {booking.label}
                </a>
              ) : (
                <Link href={booking.href} className={bookButtonClasses}>
                  {booking.label}
                </Link>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
