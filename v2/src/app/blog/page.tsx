"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { SITE_URL } from "@/lib/env";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
}

const hardcodedPosts: BlogPost[] = [
  {
    slug: "5-exercices-pilates-mal-de-dos",
    title: "5 exercices de Pilates pour soulager le mal de dos",
    excerpt:
      "Le mal de dos touche 80% des Français. Découvrez 5 mouvements simples issus du Pilates pour renforcer votre dos et retrouver confort au quotidien.",
    date: "2026-04-01",
    readTime: "6 min",
    category: "Conseils",
    image: "/images/illustration-cours-collectif.png",
    featured: true,
  },
  {
    slug: "pilates-prenatal-bienfaits",
    title: "Pilates prénatal : les bienfaits pour maman et bébé",
    excerpt:
      "Pendant la grossesse, le Pilates adapté aide à maintenir le tonus musculaire, soulager les douleurs et préparer le corps à l'accouchement.",
    date: "2026-03-15",
    readTime: "5 min",
    category: "Prénatal",
    image: "/images/illustration-pilates-artistique.png",
    featured: false,
  },
  {
    slug: "reformer-vs-mat-pilates",
    title: "Reformer vs Mat Pilates : lequel choisir ?",
    excerpt:
      "Machine ou tapis ? Chaque méthode a ses avantages. On vous aide à comprendre les différences pour choisir le cours qui vous correspond.",
    date: "2026-03-01",
    readTime: "4 min",
    category: "Guide",
    image: "/images/illustration-cours-machine.png",
    featured: false,
  },
  {
    slug: "nouveau-studio-larmor-plage",
    title: "Notre nouveau studio à Larmor-Plage ouvre ses portes !",
    excerpt:
      "Après des mois de travaux, nous sommes ravis de vous accueillir dans notre espace lumineux face à l'océan. Visite guidée en images.",
    date: "2026-02-15",
    readTime: "3 min",
    category: "Actualités",
    image: "/images/studio-reformer-ocean.jpg",
    featured: false,
  },
  {
    slug: "bienfaits-pilates-seniors",
    title: "Le Pilates après 60 ans : pourquoi c'est essentiel",
    excerpt:
      "Mobilité, équilibre, force douce — le Pilates est l'allié idéal pour vieillir en forme. Témoignages et conseils de notre équipe.",
    date: "2026-02-01",
    readTime: "5 min",
    category: "Senior",
    image: "/images/illustration-studio-ocean.png",
    featured: false,
  },
  {
    slug: "respiration-pilates-guide-debutant",
    title: "La respiration en Pilates : guide pour débutants",
    excerpt:
      "La respiration latérale thoracique est la base du Pilates. Apprenez à la maîtriser pour décupler les bienfaits de chaque exercice.",
    date: "2026-01-15",
    readTime: "4 min",
    category: "Conseils",
    image: "/images/mat-piscine-ocean.jpg",
    featured: false,
  },
];

const defaultCategories = ["Tous", "Conseils", "Guide", "Prénatal", "Senior", "Actualités"];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article aria-label={`Article à la une : ${post.title}`} className="mp-card overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-64 lg:h-auto overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
          <Image
            src={post.image || "/images/illustration-pilates-artistique.png"}
            alt={`Illustration de l'article : ${post.title}`}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-mp-gold text-white text-xs font-heading font-semibold shadow-sm">
            &Agrave; la une
          </span>
        </div>

        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-semibold">
              {post.category}
            </span>
            <time dateTime={post.date} className="text-xs text-mp-text-light">
              {formatDate(post.date)}
            </time>
          </div>
          <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-3 group-hover:text-mp-ocean transition-colors">
            {post.title}
          </h2>
          <p className="font-body text-mp-text-light leading-relaxed mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-mp-text-light">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {post.readTime} de lecture
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="mp-card h-full flex flex-col hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <Image
            src={post.image || "/images/illustration-pilates-artistique.png"}
            alt={`Illustration de l'article : ${post.title}`}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-medium">
              {post.category}
            </span>
            <time dateTime={post.date} className="text-xs text-mp-text-light">
              {formatDate(post.date)}
            </time>
          </div>
          <h3 className="font-heading text-lg font-semibold text-mp-charcoal mb-2 group-hover:text-mp-ocean transition-colors">
            {post.title}
          </h3>
          <p className="font-body text-sm text-mp-text-light leading-relaxed mb-4 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-mp-text-light">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-mp-ocean font-heading font-medium group-hover:gap-2 transition-all">
              Lire
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function mapApiPost(p: Record<string, unknown>): BlogPost {
  const tags = (p.tags as string[]) || [];
  const publishedAt = p.publishedAt as string | null;
  const content = (p.content as { type: string; text: string }[]) || [];
  const wordCount = content
    .filter((b) => b.type === "paragraph")
    .reduce((acc, b) => acc + (b.text?.split(/\s+/).length || 0), 0);
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min`;
  return {
    slug: p.slug as string,
    title: p.title as string,
    excerpt: (p.excerpt as string) || "",
    date: publishedAt || (p.createdAt as string) || "",
    readTime,
    category: tags[0] || "Conseils",
    image: (p.coverImage as string) || "/images/illustration-pilates-artistique.png",
    featured: false,
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(hardcodedPosts);
  const [activeCategory, setActiveCategory] = useState("Tous");

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          const mapped = data.posts.map(mapApiPost);
          // Mark first as featured
          if (mapped.length > 0) mapped[0].featured = true;
          setPosts(mapped);
        }
      })
      .catch(() => {
        // Keep hardcoded fallback
      });
  }, []);

  // Derive categories from posts
  const postCategories = Array.from(new Set(posts.map((p) => p.category)));
  const categories = ["Tous", ...postCategories.filter((c) => c !== "Tous")];
  // Fallback to defaults if no API categories
  const displayCategories = categories.length > 1 ? categories : defaultCategories;

  const filtered = activeCategory === "Tous"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);
  const others = filtered.filter((p) => !p.featured);

  const blogItemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog — Mon Pilates",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogItemListJsonLd) }}
      />
      {/* Hero */}
      <section className="pt-32 pb-12 bg-mp-cream">
        <div className="mp-container">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Blog
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-4">
            Conseils & actualités
          </h1>
          <p className="font-body text-lg text-mp-text-light max-w-xl">
            Bien-être, exercices, témoignages — tout pour enrichir votre pratique du
            Pilates.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-mp-sand-dark/30 bg-mp-white sticky top-[72px] z-30">
        <div className="mp-container">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide" role="tablist" aria-label="Filtrer par catégorie">
            {displayCategories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-heading font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-mp-ocean text-white"
                    : "bg-mp-sand/50 text-mp-text-light hover:bg-mp-ocean/10 hover:text-mp-ocean"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results count */}
      {activeCategory !== "Tous" && (
        <div className="bg-mp-white border-b border-mp-sand-dark/20">
          <div className="mp-container py-3">
            <p className="text-sm font-body text-mp-text-light" role="status" aria-live="polite">
              {filtered.length} article{filtered.length > 1 ? "s" : ""} dans la catégorie <strong className="text-mp-charcoal">{activeCategory}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Featured */}
      {featured && (
        <section className="mp-section bg-mp-white">
          <div className="mp-container">
            <FeaturedPost post={featured} />
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          {others.length === 0 && !featured ? (
            <p className="text-center font-body text-mp-text-light py-12">
              Aucun article dans cette catégorie pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container text-center max-w-lg mx-auto">
          <Tag className="w-8 h-8 text-mp-ocean mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-3">
            Restez informé(e)
          </h2>
          <p className="font-body text-mp-text-light mb-6">
            Recevez notre guide gratuit : 7 exercices Pilates à faire chez soi,
            et les actualités du studio directement dans votre boîte mail.
          </p>
          <NewsletterForm />
          <p className="text-xs text-mp-text-light mt-3">
            Pas de spam. Désinscription en un clic.
          </p>
        </div>
      </section>
    </>
  );
}
