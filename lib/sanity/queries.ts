import { groq } from "next-sanity";

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    navigation[] {
      label,
      href,
      children[] { label, href }
    },
    footer {
      tagline,
      links[] { label, href },
      socialLinks[] { platform, url }
    },
    contactInfo {
      email,
      phone,
      address,
      coordinates
    }
  }
`;

// Pages
export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    slug,
    seo,
    pageBuilder[] {
      ...,
      _type == "hero" => {
        headline,
        subheadline,
        image { asset->, alt },
        ctas[] { label, href, style }
      },
      _type == "imageText" => {
        heading,
        body,
        image { asset->, alt },
        imagePosition,
        cta { label, href }
      },
      _type == "testimonials" => {
        heading,
        items[]-> { name, location, quote, service, rating }
      },
      _type == "offerings" => {
        heading,
        subheading,
        items[]-> { title, type, description, image { asset->, alt }, pricing, bookingUrl }
      },
      _type == "stats" => {
        items[] { number, label }
      },
      _type == "faq" => {
        heading,
        items[] { question, answer }
      },
      _type == "newsletter" => {
        heading,
        body,
        buttonLabel,
        resourceUrl
      },
      _type == "richText" => {
        content
      },
      _type == "gallery" => {
        heading,
        images[] { asset->, alt, caption }
      },
      _type == "cta" => {
        heading,
        body,
        ctas[] { label, href, style }
      }
    }
  }
`;

// Services
export const servicesQuery = groq`
  *[_type == "service"] | order(orderRank) {
    _id,
    title,
    type,
    description,
    image { asset->, alt },
    pricing,
    bookingUrl,
    questionnaireType,
    faq[] { question, answer }
  }
`;

// Events
export const eventsQuery = groq`
  *[_type == "event" && dateStart >= now()] | order(dateStart asc) {
    _id,
    title,
    slug,
    type,
    dateStart,
    dateEnd,
    location,
    price,
    capacity,
    status,
    image { asset->, alt },
    excerpt
  }
`;

export const eventQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    ...,
    image { asset->, alt },
    gallery[] { asset->, alt, caption },
    faq[] { question, answer }
  }
`;

// Blog
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    coverImage { asset->, alt },
    categories,
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ...,
    coverImage { asset->, alt },
    body,
    "readingTime": round(length(pt::text(body)) / 5 / 200),
    "relatedPosts": relatedPosts[]-> {
      _id, title, slug, coverImage { asset->, alt }, excerpt, publishedAt
    }
  }
`;

// Testimonials
export const testimonialsQuery = groq`
  *[_type == "testimonial" && isFeatured == true] | order(_createdAt desc) {
    _id, name, location, quote, service, rating
  }
`;

// Questionnaires
export const questionnaireQuery = groq`
  *[_type == "questionnaire" && slug.current == $slug][0] {
    title,
    serviceType,
    slug,
    intro,
    fields[] {
      _key,
      label,
      name,
      type,
      placeholder,
      required,
      options
    },
    submitLabel,
    successMessage
  }
`;

// Location pages
export const locationPageQuery = groq`
  *[_type == "locationPage" && city == $city && service == $service][0] {
    ...,
    relatedServices[]-> { _id, title, slug, type }
  }
`;

export const allLocationPagesQuery = groq`
  *[_type == "locationPage"] { city, service }
`;

// Sitemap
export const sitemapQuery = groq`{
  "pages": *[_type == "page"] { slug, _updatedAt },
  "posts": *[_type == "post"] { slug, _updatedAt },
  "events": *[_type == "event"] { slug, _updatedAt },
  "locationPages": *[_type == "locationPage"] { city, service, _updatedAt }
}`;
