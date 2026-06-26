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
        image { asset->, alt, caption, creditUrl, captionPosition },
        ctas[] { label, href, style }
      },
      _type == "imageText" => {
        heading,
        body,
        image { asset->, alt, caption, creditUrl, captionPosition },
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
        items[]-> { title, type, description, image { asset->, alt, caption, creditUrl, captionPosition }, pricing, bookingUrl }
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
        images[] { asset->, alt, caption, creditUrl, captionPosition }
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
    image { asset->, alt, caption, creditUrl, captionPosition },
    pricing,
    bookingUrl,
    questionnaireType,
    faq[] { question, answer }
  }
`;

// Events
// Upcoming events that are NOT retreats (Workshop / Class / Online + untyped).
export const eventsQuery = groq`
  *[_type == "event" && type != "Retreat" && defined(dateStart) && dateStart >= now()] | order(dateStart asc) {
    _id,
    title,
    "slug": slug.current,
    type,
    dateStart,
    dateEnd,
    location,
    price,
    capacity,
    status,
    image { asset->, alt, caption, creditUrl, captionPosition },
    excerpt
  }
`;

export const eventQuery = groq`
  *[_type == "event" && type != "Retreat" && slug.current == $slug][0] {
    ...,
    image { asset->, alt, caption, creditUrl, captionPosition },
    gallery[] { asset->, alt, caption, creditUrl, captionPosition },
    faq[] { question, answer }
  }
`;

// Retreats = events tagged "Retreat". Card fields for the /events listing.
export const retreatsQuery = groq`
  *[_type == "event" && type == "Retreat"] | order(coalesce(dateStart, _updatedAt) asc) {
    _id,
    title,
    slug,
    subtitle,
    tagline,
    locationLine,
    dateStart,
    dateEnd,
    status,
    heroImage { asset->, alt, caption, creditUrl, captionPosition }
  }
`;

export const retreatSlugsQuery = groq`
  *[_type == "event" && type == "Retreat" && defined(slug.current)][].slug.current
`;

// Retreat-tagged events that are still selling or still upcoming, for the homepage.
// "Upcoming" = status is "upcoming" or unset, AND (no end date OR end date >= today).
export const upcomingRetreatsQuery = groq`
  *[
    _type == "event"
    && type == "Retreat"
    && defined(slug.current)
    && coalesce(status, "upcoming") == "upcoming"
    && (!defined(dateEnd) || dateEnd >= now())
  ] | order(coalesce(dateStart, _createdAt) asc) [0...3] {
    _id,
    title,
    slug,
    subtitle,
    tagline,
    locationLine,
    dateStart,
    dateEnd,
    status,
    "cardImage": coalesce(cardImage, heroImage) { asset->, alt }
  }
`;

export const retreatQuery = groq`
  *[_type == "event" && type == "Retreat" && slug.current == $slug][0] {
    ...,
    heroImage { asset->, alt, caption, creditUrl, captionPosition },
    conceptImage { asset->, alt, caption, creditUrl, captionPosition },
    whoImage { asset->, alt, caption, creditUrl, captionPosition },
    experienceImage { asset->, alt, caption, creditUrl, captionPosition },
    venueImage { asset->, alt, caption, creditUrl, captionPosition },
    includedImage { asset->, alt, caption, creditUrl, captionPosition },
    guideImage { asset->, alt, caption, creditUrl, captionPosition },
    whatIsImage { asset->, alt, caption, creditUrl, captionPosition },
    gallery[] { asset->, alt, caption, creditUrl, captionPosition },
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
    coverImage { asset->, alt, caption, creditUrl, captionPosition },
    coverVideo { asset->{ url, mimeType }, alt },
    categories,
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ...,
    coverImage { asset->, alt, caption, creditUrl, captionPosition },
    coverVideo { asset->{ url, mimeType }, alt },
    body,
    "readingTime": round(length(pt::text(body)) / 5 / 200),
    "relatedPosts": relatedPosts[]-> {
      _id, title, slug,
      coverImage { asset->, alt, caption, creditUrl, captionPosition },
      coverVideo { asset->{ url, mimeType }, alt },
      excerpt, publishedAt
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

// Courses
export const coursesQuery = groq`
  *[_type == "course" && status == "published"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    tagline,
    thumbnail { asset->, alt, caption, creditUrl, captionPosition },
    price,
    currency,
    level,
    totalDuration,
    "moduleCount": count(modules),
    "lessonCount": count(modules[]->lessons[])
  }
`;

export const courseQuery = groq`
  *[_type == "course" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    tagline,
    description,
    price,
    currency,
    stripePriceId,
    thumbnail { asset->, alt, caption, creditUrl, captionPosition },
    previewVideoUrl,
    level,
    totalDuration,
    whatYoullLearn,
    faq[] { question, answer },
    testimonials[]-> { _id, name, location, quote, rating },
    seo,
    modules[]-> {
      _id,
      title,
      description,
      order,
      lessons[]-> {
        _id,
        title,
        duration,
        order,
        isFreePreview
      }
    } | order(order asc)
  }
`;

export const courseLearnQuery = groq`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    modules[]-> {
      _id,
      title,
      order,
      lessons[]-> {
        _id,
        title,
        slug,
        duration,
        order,
        isFreePreview,
        videoUrl,
        resources[] { asset-> { url, originalFilename } },
        body
      } | order(order asc)
    } | order(order asc)
  }
`;

export const courseLessonQuery = groq`
  *[_type == "courseLesson" && slug.current == $lessonSlug][0] {
    _id,
    title,
    slug,
    description,
    videoUrl,
    duration,
    body,
    isFreePreview,
    resources[] { asset-> { url, originalFilename } }
  }
`;

export const enrollmentQuery = groq`
  *[_type == "courseEnrollment" && email == $email && course->slug.current == $courseSlug && status == "active"][0] {
    _id
  }
`;

// Sitemap
export const sitemapQuery = groq`{
  "posts": *[_type == "post" && defined(slug.current)] { slug, _updatedAt },
  "events": *[_type == "event" && type != "Retreat" && defined(slug.current)] { slug, _updatedAt },
  "courses": *[_type == "course" && status == "published" && defined(slug.current)] { slug, _updatedAt },
  "retreats": *[_type == "event" && type == "Retreat" && defined(slug.current)] { slug, _updatedAt },
  "locationPages": *[_type == "locationPage"] { city, service, _updatedAt }
}`;
