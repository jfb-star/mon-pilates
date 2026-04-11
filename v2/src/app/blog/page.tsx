import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conseils Pilates, bien-être, actualités du studio Mon Pilates à Larmor-Plage.",
};

const posts = [
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

const categories = ["Tous", "Conseils", "Guide", "Prénatal", "Senior", "Actualités"];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function FeaturedPost({ post }: { post: (typeof posts)[0] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="mp-card overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-64 lg:h-auto overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
          <Image
            src={post.image || "/images/illustration-pilates-artistique.png"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-semibold">
              {post.category}
            </span>
            <span className="text-xs text-mp-text-light">
              {formatDate(post.date)}
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-3 group-hover:text-mp-ocean transition-colors">
            {post.title}
          </h2>
          <p className="font-body text-mp-text-light leading-relaxed mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-mp-text-light">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} de lecture
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function PostCard({ post }: { post: (typeof posts)[0] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="mp-card h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <Image
            src={post.image || "/images/illustration-pilates-artistique.png"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-medium">
              {post.category}
            </span>
            <span className="text-xs text-mp-text-light">
              {formatDate(post.date)}
            </span>
          </div>
          <h3 className="font-heading text-lg font-semibold text-mp-charcoal mb-2 group-hover:text-mp-ocean transition-colors">
            {post.title}
          </h3>
          <p className="font-body text-sm text-mp-text-light leading-relaxed mb-4 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-mp-text-light">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-mp-ocean font-heading font-medium group-hover:gap-2 transition-all">
              Lire
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const others = posts.filter((p) => !p.featured);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-mp-cream">
        <div className="mp-container">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Blog
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Conseils & actualités
          </h1>
          <p className="font-body text-lg text-mp-text-light max-w-xl">
            Bien-être, exercices, témoignages — tout pour enrichir votre pratique du
            Pilates.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-mp-sand-dark/30 bg-mp-white sticky top-20 z-30">
        <div className="mp-container">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-heading font-medium whitespace-nowrap transition-colors ${
                  cat === "Tous"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mp-section bg-mp-ocean/5">
        <div className="mp-container text-center max-w-lg mx-auto">
          <Tag className="w-8 h-8 text-mp-ocean mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-3">
            Restez informé(e)
          </h2>
          <p className="font-body text-mp-text-light mb-6">
            Recevez nos conseils Pilates et les actualités du studio directement
            dans votre boîte mail.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-full border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus:border-mp-ocean focus:ring-2 focus:ring-mp-ocean/20"
              aria-label="Adresse email pour la newsletter"
            />
            <button className="mp-btn mp-btn-primary text-sm whitespace-nowrap">
              S&apos;abonner
            </button>
          </div>
          <p className="text-xs text-mp-text-light mt-3">
            Pas de spam. Désinscription en un clic.
          </p>
        </div>
      </section>
    </>
  );
}
