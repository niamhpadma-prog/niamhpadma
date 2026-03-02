"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FilterBar } from "@/components/sections/FilterBar";
import { BlogCard } from "@/components/cards/BlogCard";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { asset?: { url?: string }; alt?: string };
  categories?: string[];
  publishedAt?: string;
  readingTime?: number;
}

const categoryFilters = ["All", "Yoga", "Breathwork", "Somatic", "Nutrition"];

export function BlogListing({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? posts
      : posts.filter((p) => p.categories?.includes(filter));

  const [featured, ...rest] = filtered;

  return (
    <Section background="cream">
      <Container>
        <FilterBar filters={categoryFilters} active={filter} onChange={setFilter} />

        {featured && (
          <div className="mb-12">
            <BlogCard {...featured} featured />
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <BlogCard key={post._id} {...post} index={i} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif text-2xl text-espresso/40 mb-2">No posts found</p>
            <p className="font-sans text-sm text-espresso/30">
              Check back soon for new {filter.toLowerCase()} articles.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
