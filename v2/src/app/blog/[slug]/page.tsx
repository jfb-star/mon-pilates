import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, Share2, Globe, MessageCircle } from "lucide-react";

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
    image: "/images/illustration-cours-collectif.png",
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
        text: "Au studio Mon Pilates à Larmor-Plage, nos instructeurs intègrent ces exercices dans leurs cours et les adaptent à votre condition. Si vous souffrez de douleurs chroniques, nous vous recommandons de commencer par un cours de Pilates Doux avant de progresser vers des séances plus intenses.",
      },
    ],
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
    content: [
      {
        type: "paragraph" as const,
        text: "La grossesse transforme profondément le corps de la femme. Le Pilates prénatal, pratiqué sous la supervision d'une instructrice certifiée, est l'un des meilleurs alliés pour traverser ces neuf mois en forme et en confiance. Chez Mon Pilates, Marie accompagne les futures mamans avec douceur et expertise depuis plus de 10 ans.",
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
        text: "Nos cours de Pilates prénatal sont proposés le lundi soir, le mercredi matin et le vendredi après-midi. Ils sont accessibles dès le deuxième trimestre, avec un avis médical. Chaque séance est adaptée aux besoins individuels de chaque future maman.",
      },
    ],
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
    content: [
      {
        type: "paragraph" as const,
        text: "C'est la question que nous posent le plus souvent nos nouveaux élèves : faut-il commencer par le Mat Pilates ou le Reformer ? La réponse dépend de vos objectifs, de votre expérience et de vos préférences. Voici notre guide pour vous aider à choisir.",
      },
      {
        type: "heading" as const,
        text: "Le Mat Pilates : la base de tout",
      },
      {
        type: "paragraph" as const,
        text: "Le Pilates au sol (Mat) est la forme originelle créée par Joseph Pilates. Pratiqué sur un simple tapis, il utilise le poids du corps comme résistance. C'est l'idéal pour apprendre les fondamentaux : l'engagement du centre, la respiration latérale thoracique, le contrôle et la précision du mouvement. Le Mat Pilates développe une conscience corporelle profonde et peut se pratiquer n'importe où, même chez soi.",
      },
      {
        type: "heading" as const,
        text: "Le Reformer : la précision par la résistance",
      },
      {
        type: "paragraph" as const,
        text: "Le Reformer est une machine à ressorts qui offre une résistance variable. Le chariot mobile et les sangles permettent de travailler dans des positions variées — allongé, assis, debout, à genoux. La résistance des ressorts offre un feedback tactile qui aide à corriger l'alignement et à cibler les muscles profonds avec une grande précision. Le Reformer est particulièrement efficace pour la rééducation et le travail excentrique.",
      },
      {
        type: "heading" as const,
        text: "Notre conseil",
      },
      {
        type: "paragraph" as const,
        text: "Si vous débutez, nous recommandons de commencer par 4 à 6 séances de Mat Pilates pour acquérir les bases. Ensuite, intégrez progressivement le Reformer pour enrichir votre pratique. La combinaison des deux est idéale : le Mat pour la conscience corporelle, le Reformer pour le travail ciblé et la progression. Chez Mon Pilates, beaucoup de nos élèves alternent les deux toute la semaine.",
      },
      {
        type: "paragraph" as const,
        text: "Envie de tester ? Réservez votre premier cours d'essai — Mat ou Reformer — directement sur notre planning en ligne. Notre équipe se fera un plaisir de vous guider dans votre choix.",
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
    image: "/images/studio-reformer-ocean.jpg",
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
        text: "Situé à quelques pas de la plage de Toulhars, notre studio bénéficie d'une lumière naturelle exceptionnelle grâce à ses grandes baies vitrées. L'espace de 120 m² a été conçu pour offrir une atmosphère apaisante : parquet clair, murs dans des tons de sable et de blanc cassé, et une vue sur la mer qui accompagne chaque séance. Pratiquer le Pilates face à l'océan, c'est l'expérience unique que nous vous proposons.",
      },
      {
        type: "heading" as const,
        text: "Du matériel haut de gamme",
      },
      {
        type: "paragraph" as const,
        text: "Nous avons investi dans six Reformer Balanced Body de dernière génération, des tapis professionnels et un ensemble complet de petit matériel : cercles, ballons, rouleaux et bandes élastiques. Chaque pièce d'équipement a été choisie pour garantir confort, sécurité et fluidité de mouvement. Nous voulions que chaque détail contribue à la qualité de votre pratique.",
      },
      {
        type: "heading" as const,
        text: "Venez nous rendre visite",
      },
      {
        type: "paragraph" as const,
        text: "Le studio est ouvert du lundi au samedi. N'hésitez pas à passer nous voir pour découvrir les lieux, rencontrer Marie et Sophie, et pourquoi pas, réserver votre première séance d'essai. Nous vous accueillons avec un thé chaud et le sourire — c'est la tradition bretonne !",
      },
    ],
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
    content: [
      {
        type: "paragraph" as const,
        text: "Après 60 ans, maintenir son activité physique n'est pas un luxe — c'est une nécessité. La perte de masse musculaire, la diminution de l'équilibre et la raideur articulaire s'accélèrent avec l'âge. Le Pilates, grâce à son approche douce et contrôlée, est l'une des disciplines les plus adaptées pour accompagner le vieillissement en forme.",
      },
      {
        type: "heading" as const,
        text: "Prévenir les chutes par l'équilibre",
      },
      {
        type: "paragraph" as const,
        text: "Les chutes sont la première cause d'accident chez les seniors. Le Pilates travaille en profondeur les muscles stabilisateurs et la proprioception — cette capacité à sentir la position de son corps dans l'espace. Nos exercices de Pilates Senior incluent des mouvements debout et sur chaise qui améliorent l'équilibre et la coordination, réduisant significativement le risque de chute.",
      },
      {
        type: "heading" as const,
        text: "Préserver la mobilité articulaire",
      },
      {
        type: "paragraph" as const,
        text: "Avec l'âge, les articulations perdent en amplitude si elles ne sont pas sollicitées régulièrement. Le Pilates propose des mouvements fluides et contrôlés qui mobilisent chaque articulation dans sa pleine amplitude, sans impact ni à-coups. C'est particulièrement bénéfique pour les épaules, les hanches et la colonne vertébrale — les zones les plus touchées par la raideur liée à l'âge.",
      },
      {
        type: "heading" as const,
        text: "Témoignage : Jacqueline, 72 ans",
      },
      {
        type: "paragraph" as const,
        text: "« Je pratique au studio Mon Pilates depuis l'ouverture. Au début, j'avais peur de ne pas y arriver, mais Marie m'a mise en confiance dès la première séance. Aujourd'hui, je marche plus droite, je monte les escaliers sans essoufflement, et surtout, j'ai retrouvé confiance en mon corps. Le Pilates a changé mon quotidien. » Comme Jacqueline, de nombreux seniors découvrent les bienfaits du Pilates au studio. Les groupes sont petits (8 personnes maximum), ce qui permet à Marie d'adapter chaque exercice.",
      },
      {
        type: "paragraph" as const,
        text: "Nos cours Pilates Senior ont lieu le lundi et le jeudi matin. Aucune expérience préalable n'est nécessaire. Venez comme vous êtes, nous nous adaptons à vous.",
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
    image: "/images/mat-piscine-ocean.jpg",
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
        text: "Au studio Mon Pilates, nous prenons le temps en début de chaque cours de guider la respiration, surtout pour les débutants. N'hésitez pas à rejoindre notre cours Mat Pilates débutant le mercredi matin pour découvrir les bases en douceur.",
      },
    ],
  },
];

/* ----------------------------------------------------------
   HELPERS
   ---------------------------------------------------------- */
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
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return { title: "Article introuvable" };
  }
  return {
    title: post.title,
    description: post.excerpt,
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
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-20 mp-section">
        <div className="mp-container text-center">
          <h1 className="font-heading text-3xl font-bold text-mp-charcoal mb-4">
            Article introuvable
          </h1>
          <Link href="/blog" className="mp-btn mp-btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedPosts(post.slug, post.category);

  return (
    <div className="pt-20">
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

          {/* Category badge + date */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-semibold">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-mp-text-light">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
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
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
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
              {post.content.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={i}
                      className="font-heading text-2xl font-bold text-mp-charcoal mt-10 mb-4"
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
                {/* Article info */}
                <div className="bg-mp-cream rounded-2xl p-6">
                  <h3 className="font-heading text-sm font-bold text-mp-charcoal uppercase tracking-wider mb-4">
                    Informations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-mp-text">
                      <Clock className="w-4 h-4 text-mp-ocean shrink-0" />
                      <span className="font-body">
                        {post.readTime} de lecture
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mp-text">
                      <Tag className="w-4 h-4 text-mp-ocean shrink-0" />
                      <span className="font-body">{post.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mp-text">
                      <Calendar className="w-4 h-4 text-mp-ocean shrink-0" />
                      <span className="font-body">
                        {formatDate(post.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="bg-mp-cream rounded-2xl p-6">
                  <h3 className="font-heading text-sm font-bold text-mp-charcoal uppercase tracking-wider mb-4">
                    Partager
                  </h3>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-mp-ocean/10 text-mp-ocean hover:bg-mp-ocean hover:text-white transition-colors"
                      aria-label="Partager sur Facebook"
                    >
                      <Globe className="w-4 h-4" />
                    </button>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-mp-ocean/10 text-mp-ocean hover:bg-mp-ocean hover:text-white transition-colors"
                      aria-label="Partager sur Twitter"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-mp-ocean/10 text-mp-ocean hover:bg-mp-ocean hover:text-white transition-colors"
                      aria-label="Copier le lien"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
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
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="block group">
                <article className="mp-card h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden rounded-t-2xl">
                    {rp.image ? (
                      <Image
                        src={rp.image}
                        alt={rp.title}
                        fill
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
                      <span className="text-xs text-mp-text-light">
                        {formatDate(rp.date)}
                      </span>
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
