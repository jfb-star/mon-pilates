import { SITE_URL } from "@/lib/env";

const BASE_URL = SITE_URL;

export function getFAQSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getCourseSchema(course: {
  name: string;
  slug: string;
  description: string;
  level: string;
  duration: number;
  price?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    url: `${BASE_URL}/cours/${course.slug}`,
    provider: {
      "@type": "Organization",
      name: "Mon Pilates",
      url: BASE_URL,
    },
    courseMode: "onsite",
    educationalLevel: course.level === "BEGINNER" ? "Beginner" : course.level === "ADVANCED" ? "Advanced" : "All Levels",
    timeRequired: `PT${course.duration}M`,
    ...(course.price && {
      offers: {
        "@type": "Offer",
        price: course.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

export function getBlogPostSchema(post: {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Mon Pilates",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.png` },
    },
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
  };
}

export function getCourseListSchema(courses: { name: string; slug: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cours de Pilates",
    itemListElement: courses.map((course, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/cours/${course.slug}`,
      name: course.name,
      description: course.description,
    })),
  };
}

export function getProductSchema(name: string, description: string, price: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Organization", name: "Mon Pilates" },
    offers: {
      "@type": "Offer",
      price: (price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/carte-cadeau`,
    },
  };
}
