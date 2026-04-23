import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, List } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/env";

// ISR — revalidate each article page at most once per hour.
export const revalidate = 3600;

/* ----------------------------------------------------------
   BLOG POSTS DATA (with full article content)
   ---------------------------------------------------------- */
export const posts = [
  {
    slug: "5-exercices-pilates-mal-de-dos",
    title: "5 exercices de Pilates pour soulager le mal de dos",
    excerpt:
      "Le mal de dos touche 80% des Français. Découvrez 5 mouvements simples issus du Pilates pour renforcer votre dos et retrouver confort au quotidien.",
    date: "2026-04-01",
    readTime: "6 min",
    category: "Conseils",
    image: "/images/illustration-cours-collectif.webp",
    featured: true,
    content: [
      {
        type: "paragraph" as const,
        text: "Le mal de dos est souvent qualifié de « mal du siècle ». Sédentarité, mauvaises postures au bureau, stress chronique : les causes sont multiples. Le Pilates, grâce à son approche douce et centrée sur le renforcement profond, offre des solutions concrètes et durables pour soulager ces douleurs.",
      },
      {
        type: "heading" as const,
        text: "1. Le Cat-Cow (Chat-Vache)",
      },
      {
        type: "paragraph" as const,
        text: "À quatre pattes, alternez entre la flexion et l'extension de la colonne vertébrale en synchronisant le mouvement avec votre respiration. En inspirant, creusez doucement le dos et levez la tête. En expirant, arrondissez le dos en rentrant le menton vers la poitrine. Répétez 8 à 10 fois. Cet exercice mobilise chaque segment vertébral et soulage les tensions accumulées dans le bas du dos.",
      },
      {
        type: "heading" as const,
        text: "2. Le Pelvic Curl (Pont)",
      },
      {
        type: "paragraph" as const,
        text: "Allongé sur le dos, genoux pliés, pieds au sol, déroulez lentement votre colonne du coccyx jusqu'aux omoplates. Maintenez la position haute quelques secondes en engageant vos abdominaux profonds, puis redescendez vertèbre par vertèbre. Le Pelvic Curl renforce les fessiers, les ischio-jambiers et les muscles stabilisateurs du dos, tout en étirant la colonne.",
      },
      {
        type: "heading" as const,
        text: "3. Le Swimming (Nage)",
      },
      {
        type: "paragraph" as const,
        text: "Sur le ventre, bras et jambes tendus, soulevez le bras droit et la jambe gauche simultanément, puis alternez. Gardez le regard vers le sol et le ventre engagé. Cet exercice renforce les muscles paravertébraux qui soutiennent votre colonne au quotidien. Commencez par 10 répétitions de chaque côté.",
      },
      {
        type: "heading" as const,
        text: "4. Le Spine Twist",
      },
      {
        type: "paragraph" as const,
        text: "Assis jambes tendues devant vous, bras ouverts en croix, tournez doucement le buste vers la droite en expirant, puis revenez au centre en inspirant. Alternez les côtés. Cette rotation contrôlée assouplit la colonne thoracique et soulage les raideurs souvent responsables des douleurs entre les omoplates.",
      },
      {
        type: "heading" as const,
        text: "5. Le Child's Pose (Posture de l'enfant)",
      },
      {
        type: "paragraph" as const,
        text: "Assis sur vos talons, penchez-vous en avant et étirez les bras devant vous, front posé au sol. Respirez profondément pendant 30 secondes à une minute. Cette position d'étirement et de relâchement décomprime les disques vertébraux et permet aux muscles du dos de se détendre complètement.",
      },
      {
        type: "paragraph" as const,
        text: "Au studio Mon Pilates à Larmor-Plage, Violette intègre ces exercices dans ses cours et les adapte à votre condition. Si vous souffrez de douleurs chroniques, nous vous recommandons de commencer par un cours Pilates doux — Tapis avant de progresser vers des séances plus intenses.",
      },
    ],
  },
  {
    slug: "pilates-prenatal-bienfaits",
    title: "Pilates pré & post-natal : les bienfaits pour maman et bébé",
    excerpt:
      "Avant, pendant et après la grossesse, le Pilates adapté aide à maintenir le tonus musculaire, soulager les douleurs et préparer le corps.",
    date: "2026-03-15",
    readTime: "5 min",
    category: "Pré & post-natal",
    image: "/images/illustration-pilates-artistique.webp",
    featured: false,
    content: [
      {
        type: "paragraph" as const,
        text: "La grossesse transforme profondément le corps de la femme. Le Pilates prénatal, pratiqué sous la supervision d'une instructrice certifiée, est l'un des meilleurs alliés pour traverser ces neuf mois en forme et en confiance. Chez Mon Pilates, Violette accompagne les futures mamans avec douceur et expertise.",
      },
      {
        type: "heading" as const,
        text: "Renforcer le plancher pelvien",
      },
      {
        type: "paragraph" as const,
        text: "Le plancher pelvien est mis à rude épreuve pendant la grossesse. Le poids du bébé, les changements hormonaux et la pression abdominale le fragilisent progressivement. Les exercices de Pilates prénatal ciblent spécifiquement cette zone, avec des contractions douces et contrôlées qui renforcent la musculature profonde. Un plancher pelvien tonique facilite l'accouchement et accélère la récupération post-partum.",
      },
      {
        type: "heading" as const,
        text: "Soulager les douleurs lombaires",
      },
      {
        type: "paragraph" as const,
        text: "Avec la prise de poids et le déplacement du centre de gravité, les douleurs lombaires sont quasi inévitables. Le Pilates prénatal propose des exercices qui renforcent les muscles profonds du tronc sans solliciter les grands droits (pour éviter le diastasis), tout en étirant les muscles contracturés du bas du dos. Résultat : moins de douleurs et une meilleure posture au fil des trimestres.",
      },
      {
        type: "heading" as const,
        text: "Un moment de connexion avec bébé",
      },
      {
        type: "paragraph" as const,
        text: "Au-delà des bienfaits physiques, le Pilates prénatal est un véritable moment de pause dans le quotidien des futures mamans. La respiration consciente, le mouvement doux et l'attention portée au corps créent un espace de connexion avec le bébé. Beaucoup de nos participantes décrivent ces séances comme le moment le plus apaisant de leur semaine.",
      },
      {
        type: "paragraph" as const,
        text: "Nos cours de Pilates pré & post-natal sont proposés le lundi soir, le mercredi matin et le vendredi après-midi. Ils sont accessibles dès le deuxième trimestre (avec un avis médical) et après l'accouchement, avec une adaptation post-partum. Chaque séance est personnalisée.",
      },
    ],
  },
  {
    slug: "reformer-vs-mat-pilates",
    title: "Tapis ou cours privé sur appareil : lequel choisir ?",
    excerpt:
      "Cours collectif au tapis ou séance privée sur appareil ? Chaque format a ses avantages. On vous aide à comprendre les différences.",
    date: "2026-03-01",
    readTime: "4 min",
    category: "Guide",
    image: "/images/illustration-cours-machine.webp",
    featured: false,
    content: [
      {
        type: "paragraph" as const,
        text: "C'est la question que nous posent le plus souvent nos nouveaux élèves : faut-il commencer par un cours collectif au tapis ou par une séance privée sur appareil ? La réponse dépend de vos objectifs, de votre expérience et de vos préférences. Voici notre guide pour vous aider à choisir.",
      },
      {
        type: "heading" as const,
        text: "Le Pilates au tapis : la base de tout",
      },
      {
        type: "paragraph" as const,
        text: "Le Pilates au sol est la forme originelle créée par Joseph Pilates. Pratiqué sur un simple tapis en petit groupe (5 personnes max), il utilise le poids du corps comme résistance. C'est l'idéal pour apprendre les fondamentaux : l'engagement du centre, la respiration latérale thoracique, le contrôle et la précision du mouvement. Vous choisissez votre intensité — doux, classique ou avancé — selon votre niveau.",
      },
      {
        type: "heading" as const,
        text: "Le cours privé sur appareil : le sur-mesure",
      },
      {
        type: "paragraph" as const,
        text: "Les séances privées se déroulent en individuel sur notre Reformer Cadillac premium — un appareil à résistance variable. Le chariot mobile et les sangles permettent de travailler dans des positions variées — allongé, assis, debout, à genoux. L'accompagnement en tête-à-tête est particulièrement efficace pour la rééducation, les douleurs ciblées et le travail excentrique précis.",
      },
      {
        type: "heading" as const,
        text: "Notre conseil",
      },
      {
        type: "paragraph" as const,
        text: "Si vous débutez, nous recommandons de commencer par 4 à 6 séances au tapis pour acquérir les bases. Ensuite, intégrez progressivement des cours privés sur appareil pour un travail ciblé. La combinaison des deux est idéale : le tapis pour la conscience corporelle, l'appareil pour la précision et la progression.",
      },
      {
        type: "paragraph" as const,
        text: "Envie de tester ? Réservez votre premier cours d'essai directement sur notre planning en ligne. Notre équipe se fera un plaisir de vous guider dans votre choix.",
      },
    ],
  },
  {
    slug: "nouveau-studio-larmor-plage",
    title: "Notre nouveau studio à Larmor-Plage ouvre ses portes !",
    excerpt:
      "Après des mois de travaux, nous sommes ravis de vous accueillir dans notre espace lumineux face à l'océan. Visite guidée en images.",
    date: "2026-02-15",
    readTime: "3 min",
    category: "Actualités",
    image: "/images/studio-reformer-ocean.webp",
    featured: false,
    content: [
      {
        type: "paragraph" as const,
        text: "C'est avec une immense joie que nous vous annonçons l'ouverture de notre nouveau studio Mon Pilates à Larmor-Plage ! Après six mois de travaux minutieux, notre espace est prêt à vous accueillir dans un cadre pensé pour le bien-être et la sérénité.",
      },
      {
        type: "heading" as const,
        text: "Un espace lumineux face à l'océan",
      },
      {
        type: "paragraph" as const,
        text: "Situé à quelques pas de la plage de Toulhars, notre studio bénéficie d'une lumière naturelle exceptionnelle grâce à ses grandes baies vitrées. L'espace intérieur de 50 m² — prolongé d'une terrasse face à l'océan où nous installons les cours en été, bercés par le bruit des vagues — a été conçu pour offrir une atmosphère apaisante : parquet clair, murs dans des tons de sable et de blanc cassé, et une vue sur la mer qui accompagne chaque séance. Pratiquer le Pilates face à l'océan, c'est l'expérience unique que nous vous proposons.",
      },
      {
        type: "heading" as const,
        text: "Du matériel haut de gamme",
      },
      {
        type: "paragraph" as const,
        text: "Nous avons choisi un Reformer Cadillac premium pour les cours privés, des tapis professionnels et un ensemble complet de petit matériel : cercles, ballons, rouleaux et bandes élastiques. Chaque pièce d'équipement a été sélectionnée pour garantir confort, sécurité et fluidité de mouvement. Deux Reformer supplémentaires viendront prochainement compléter l'équipement pour les cours collectifs sur machine.",
      },
      {
        type: "heading" as const,
        text: "Venez nous rendre visite",
      },
      {
        type: "paragraph" as const,
        text: "Le studio est ouvert du lundi au vendredi (et le samedi ponctuellement). N'hésitez pas à passer nous voir pour découvrir les lieux, rencontrer Violette, et pourquoi pas, réserver votre première séance Découverte. Nous vous accueillons avec le sourire — c'est la tradition bretonne !",
      },
    ],
  },
  {
    slug: "respiration-pilates-guide-debutant",
    title: "La respiration en Pilates : guide pour débutants",
    excerpt:
      "La respiration latérale thoracique est la base du Pilates. Apprenez à la maîtriser pour décupler les bienfaits de chaque exercice.",
    date: "2026-01-15",
    readTime: "4 min",
    category: "Conseils",
    image: "/images/mat-piscine-ocean.webp",
    featured: false,
    content: [
      {
        type: "paragraph" as const,
        text: "Si le Pilates devait se résumer à un seul principe, ce serait la respiration. Joseph Pilates lui-même disait : « Avant tout, apprenez à respirer correctement. » La respiration latérale thoracique, spécifique au Pilates, est le moteur de chaque mouvement. Voici comment la maîtriser.",
      },
      {
        type: "heading" as const,
        text: "Qu'est-ce que la respiration latérale thoracique ?",
      },
      {
        type: "paragraph" as const,
        text: "Contrairement à la respiration abdominale classique (où le ventre se gonfle), la respiration Pilates dirige l'air vers les côtes latéralement et vers l'arrière. L'objectif est de pouvoir maintenir l'engagement des abdominaux profonds tout en respirant pleinement. L'inspiration élargit la cage thoracique sur les côtés, l'expiration la referme tout en activant le transverse de l'abdomen.",
      },
      {
        type: "heading" as const,
        text: "Exercice pratique : apprendre la respiration Pilates",
      },
      {
        type: "paragraph" as const,
        text: "Asseyez-vous confortablement, le dos droit. Placez vos mains de chaque côté de votre cage thoracique, doigts pointés vers l'avant. Inspirez par le nez en sentant vos côtes s'écarter sous vos doigts — le ventre reste plat et engagé. Expirez par la bouche en sentant les côtes se refermer, comme si vous portiez un corset. Répétez 10 fois. Au début, c'est contre-intuitif, mais avec la pratique, cette respiration devient naturelle.",
      },
      {
        type: "heading" as const,
        text: "Pourquoi cette respiration change tout",
      },
      {
        type: "paragraph" as const,
        text: "La respiration latérale thoracique permet de maintenir la stabilité du centre (le « powerhouse ») pendant les exercices. Sans cette stabilité, les mouvements de Pilates perdent leur efficacité et le risque de compensation augmente. De plus, cette respiration profonde active le système nerveux parasympathique, favorisant la relaxation et la concentration. C'est pour cela que l'on sort d'un cours de Pilates à la fois tonifié et apaisé.",
      },
      {
        type: "paragraph" as const,
        text: "Au studio Mon Pilates, nous prenons le temps en début de chaque cours de guider la respiration, surtout pour les débutants. N'hésitez pas à rejoindre notre cours Pilates classique — Tapis le mercredi matin pour découvrir les bases en douceur.",
      },
    ],
  },
];

/* ----------------------------------------------------------
   HELPERS
   ---------------------------------------------------------- */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getRelatedPosts(currentSlug: string, category: string) {
  // First try same category, then fill with other posts
  const sameCategory = posts.filter(
    (p) => p.slug !== currentSlug && p.category === category
  );
  const others = posts.filter(
    (p) => p.slug !== currentSlug && p.category !== category
  );
  return [...sameCategory, ...others].slice(0, 3);
}

/* ----------------------------------------------------------
   DB FETCH HELPER
   ---------------------------------------------------------- */
async function getPostFromDb(slug: string) {
  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: { author: { select: { name: true } } },
    });
    if (!dbPost) return null;
    const tags = JSON.parse(dbPost.tags) as string[];
    const content = JSON.parse(dbPost.content) as { type: string; text: string }[];
    const wordCount = content
      .filter((b) => b.type === "paragraph")
      .reduce((acc, b) => acc + (b.text?.split(/\s+/).length || 0), 0);
    return {
      slug: dbPost.slug,
      title: dbPost.title,
      excerpt: dbPost.excerpt || "",
      date: dbPost.publishedAt?.toISOString().split("T")[0] || "",
      readTime: `${Math.max(1, Math.round(wordCount / 200))} min`,
      category: tags[0] || "Conseils",
      image: dbPost.coverImage || "/images/illustration-pilates-artistique.webp",
      featured: false,
      content,
    };
  } catch {
    return null;
  }
}

/* ----------------------------------------------------------
   STATIC PARAMS
   ---------------------------------------------------------- */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/* ----------------------------------------------------------
   DYNAMIC METADATA
   ---------------------------------------------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPostFromDb(slug)) || posts.find((p) => p.slug === slug);
  if (!post) {
    return { title: "Article introuvable" };
  }

  // Keywords derived from category + title tokens (stopwords filtered, max 12)
  const stopwords = new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "et", "à", "a", "au",
    "aux", "en", "pour", "par", "sur", "dans", "avec", "sans", "ou", "où",
    "que", "qui", "quoi", "ce", "cet", "cette", "ces", "mon", "ma", "mes",
    "ton", "ta", "tes", "son", "sa", "ses", "est", "sont", "se", "vs", "votre",
  ]);
  const titleKeywords = post.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
  const keywords = Array.from(
    new Set(["pilates", "larmor-plage", "studio", post.category.toLowerCase(), ...titleKeywords])
  ).slice(0, 12);

  const absoluteImage = post.image
    ? (post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`)
    : undefined;
  const ogImages = absoluteImage
    ? [{ url: absoluteImage, width: 1200, height: 630, alt: post.title }]
    : undefined;

  // Publication date as ISO 8601 (post.date is "YYYY-MM-DD" → expand to full ISO)
  const publishedISO = new Date(`${post.date}T00:00:00.000Z`).toISOString();

  // Title: keep post.title as-is (it's the H1), but hint location via the
  // template (RootLayout appends " | Mon Pilates"). For SEO we append a
  // discrete locality hint when the title doesn't already mention Larmor / Lorient.
  const titleMentionsLocality = /larmor|lorient|morbihan|bretagne/i.test(post.title);
  const seoTitle = titleMentionsLocality
    ? post.title
    : `${post.title} — Pilates Larmor-Plage`;
  // Description: append a locality CTA when the excerpt doesn't already carry one
  // (and when there's room under ~160 chars).
  const excerpt = post.excerpt.trim();
  const localityTail = " Studio Pilates à Larmor-Plage (Lorient).";
  const descriptionMentionsLocality = /larmor|lorient|morbihan|bretagne/i.test(excerpt);
  const seoDescription =
    descriptionMentionsLocality || excerpt.length + localityTail.length > 160
      ? excerpt
      : `${excerpt}${localityTail}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    authors: [{ name: "Violette Derumigny" }],
    openGraph: {
      title: `${seoTitle} | Mon Pilates`,
      description: seoDescription,
      type: "article",
      locale: "fr_FR",
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "Mon Pilates",
      publishedTime: publishedISO,
      modifiedTime: publishedISO,
      authors: ["Violette Derumigny"],
      section: post.category,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | Mon Pilates`,
      description: seoDescription,
      images: absoluteImage ? [{ url: absoluteImage, alt: post.title }] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
      languages: {
        "fr-FR": `${SITE_URL}/blog/${slug}`,
      },
    },
  };
}

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getPostFromDb(slug)) || posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(post.slug, post.category);
  const headings = post.content
    .filter((b) => b.type === "heading")
    .map((b) => ({ text: b.text, id: slugify(b.text) }));

  const wordCount = post.content
    .filter((b) => b.type === "paragraph")
    .reduce((acc, b) => acc + b.text.split(/\s+/).length, 0);

  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  const publishedISO = new Date(`${post.date}T00:00:00.000Z`).toISOString();
  const absoluteImage = post.image
    ? (post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`)
    : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedISO,
    dateModified: publishedISO,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    author: {
      "@type": "Person",
      name: "Violette Derumigny",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Mon Pilates",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.webp`,
        width: 512,
        height: 512,
      },
    },
    image: absoluteImage
      ? {
          "@type": "ImageObject",
          url: absoluteImage,
          width: 1200,
          height: 630,
        }
      : undefined,
    articleSection: post.category,
    wordCount,
    inLanguage: "fr-FR",
  };

  return (
    <div className="pt-20">
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: post.title, href: `/blog/${post.slug}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/10 py-16 sm:py-20">
        <div className="mp-container max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-heading text-mp-text-light hover:text-mp-ocean transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          {/* Category badge + date + reading time */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-semibold">
              {post.category}
            </span>
            <time dateTime={post.date} className="flex items-center gap-1 text-sm text-mp-text-light">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </time>
            <span className="flex items-center gap-1 text-sm text-mp-text-light">
              <Clock className="w-4 h-4" />
              {readingTimeMinutes} min de lecture
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-mp-charcoal leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="font-body text-lg text-mp-text-light mt-4 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Hero image */}
          {post.image && (
            <div className="relative w-full h-64 sm:h-80 lg:h-96 mt-8 rounded-2xl overflow-hidden">
              <Image
                src={post.image}
                alt={`Illustration de l'article : ${post.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
                fetchPriority="high"
              />
            </div>
          )}
        </div>
      </section>

      {/* Article body */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main content */}
            <article className="lg:col-span-8 max-w-none">
              {/* Mobile-only Table of contents (desktop version lives in the sidebar) */}
              {headings.length >= 3 && (
                <nav
                  className="lg:hidden bg-mp-cream rounded-2xl p-5 mb-8"
                  aria-label="Table des matières"
                >
                  <h2 className="font-heading text-sm font-bold text-mp-charcoal uppercase tracking-wider mb-3 flex items-center gap-2">
                    <List className="w-4 h-4 text-mp-ocean" />
                    Sommaire
                  </h2>
                  <ol className="space-y-2">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="font-body text-sm text-mp-text-light hover:text-mp-ocean transition-colors leading-snug block"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              {post.content.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={i}
                      id={slugify(block.text)}
                      className="font-heading text-2xl font-bold text-mp-charcoal mt-10 mb-4 scroll-mt-28"
                    >
                      {block.text}
                    </h2>
                  );
                }
                return (
                  <p
                    key={i}
                    className="font-body text-mp-text leading-relaxed text-base mb-5"
                  >
                    {block.text}
                  </p>
                );
              })}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Table of contents — desktop sticky sidebar (only when >= 3 headings) */}
                {headings.length >= 3 && (
                  <nav className="bg-mp-cream rounded-2xl p-6" aria-label="Table des matières">
                    <h3 className="font-heading text-sm font-bold text-mp-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                      <List className="w-4 h-4 text-mp-ocean" />
                      Sommaire
                    </h3>
                    <ol className="space-y-2">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className="font-body text-sm text-mp-text-light hover:text-mp-ocean transition-colors leading-snug block"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                {/* Article info */}
                <div className="bg-mp-cream rounded-2xl p-6">
                  <h3 className="font-heading text-sm font-bold text-mp-charcoal uppercase tracking-wider mb-4">
                    Informations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-mp-text">
                      <Clock className="w-4 h-4 text-mp-ocean shrink-0" />
                      <span className="font-body">
                        {readingTimeMinutes} min de lecture
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mp-text">
                      <Tag className="w-4 h-4 text-mp-ocean shrink-0" />
                      <span className="font-body">{post.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mp-text">
                      <Calendar className="w-4 h-4 text-mp-ocean shrink-0" />
                      <time dateTime={post.date} className="font-body">
                        {formatDate(post.date)}
                      </time>
                    </div>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="bg-mp-cream rounded-2xl p-6">
                  <h3 className="font-heading text-sm font-bold text-mp-charcoal uppercase tracking-wider mb-4">
                    Partager
                  </h3>
                  <ShareButtons title={post.title} slug={post.slug} />
                </div>

                {/* Newsletter CTA */}
                <div className="bg-gradient-to-br from-mp-ocean to-mp-ocean-dark rounded-2xl p-6 text-white">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-2">
                    Newsletter
                  </h3>
                  <p className="text-white/80 text-sm font-body mb-4">
                    Recevez nos conseils Pilates et offres exclusives.
                  </p>
                  <form action="/api/newsletter" method="POST" className="space-y-2">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-2.5 rounded-full bg-white/15 border border-white/20 text-sm text-white placeholder:text-white/50 font-body focus:outline-none focus:ring-2 focus:ring-white/40"
                      aria-label="Votre adresse email"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 rounded-full bg-white text-mp-ocean text-sm font-heading font-semibold hover:bg-mp-cream transition-colors"
                    >
                      S&apos;inscrire
                    </button>
                  </form>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-mp-ocean to-mp-ocean-dark">
        <div className="mp-container text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
            Envie de passer à la pratique ?
          </h2>
          <p className="font-body text-white/80 mb-6 max-w-lg mx-auto">
            Réservez votre cours d&apos;essai à 10€ et venez découvrir le Pilates face à l&apos;océan.
          </p>
          <Link href="/planning" className="mp-btn bg-white text-mp-ocean hover:bg-mp-cream font-semibold shadow-lg">
            Réserver mon cours d&apos;essai
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Related posts */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-8">
            Articles similaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="block group" aria-label={`Lire l'article : ${rp.title}`}>
                <article className="mp-card h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden rounded-t-2xl">
                    {rp.image ? (
                      <Image
                        src={rp.image}
                        alt={`Illustration de l'article : ${rp.title}`}
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-mp-sand to-mp-cream h-full" />
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-medium">
                        {rp.category}
                      </span>
                      <time dateTime={rp.date} className="text-xs text-mp-text-light">
                        {formatDate(rp.date)}
                      </time>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-2 group-hover:text-mp-ocean transition-colors">
                      {rp.title}
                    </h3>
                    <p className="font-body text-sm text-mp-text-light leading-relaxed flex-1">
                      {rp.excerpt}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-sm text-mp-ocean font-heading font-medium group-hover:gap-2 transition-all">
                      Lire
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
