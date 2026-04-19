import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import {
  buildBookingConfirmHtml,
  buildBookingReminderHtml,
  buildBookingCancelledHtml,
  buildResetPasswordHtml,
  buildWelcomeHtml,
} from "../src/lib/email-templates";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Users ──────────────────────────────────────────────
  const adminHash = await hash("admin123", 12);
  const userHash = await hash("user123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@mon-pilates.bzh",
      passwordHash: adminHash,
      name: "Marie Dupont",
      phone: "06 12 34 56 78",
      role: "ADMIN",
      referralCode: "MP-MDU-A1B2",
      createdAt: new Date("2025-09-01"),
    },
  });

  const instrSophie = await prisma.user.create({
    data: {
      email: "sophie@mon-pilates.bzh",
      passwordHash: userHash,
      name: "Sophie Laurent",
      phone: "06 23 45 67 89",
      role: "INSTRUCTOR",
      createdAt: new Date("2025-09-15"),
    },
  });

  const instrCamille = await prisma.user.create({
    data: {
      email: "camille@mon-pilates.bzh",
      passwordHash: userHash,
      name: "Camille Martin",
      phone: "06 34 56 78 90",
      role: "INSTRUCTOR",
      createdAt: new Date("2025-10-01"),
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "lea.moreau@gmail.com",
        passwordHash: userHash,
        name: "Léa Moreau",
        referralCode: "MP-LMO-C3D4",
        createdAt: new Date("2025-11-10"),
      },
    }),
    prisma.user.create({
      data: {
        email: "julie.bernard@gmail.com",
        passwordHash: userHash,
        name: "Julie Bernard",
        referralCode: "MP-JBE-E5F6",
        createdAt: new Date("2025-12-05"),
      },
    }),
    prisma.user.create({
      data: {
        email: "nathalie.petit@gmail.com",
        passwordHash: userHash,
        name: "Nathalie Petit",
        createdAt: new Date("2026-01-15"),
      },
    }),
    prisma.user.create({
      data: {
        email: "claire.durand@gmail.com",
        passwordHash: userHash,
        name: "Claire Durand",
        createdAt: new Date("2026-02-20"),
      },
    }),
    prisma.user.create({
      data: {
        email: "isabelle.roux@gmail.com",
        passwordHash: userHash,
        name: "Isabelle Roux",
        createdAt: new Date("2026-03-10"),
      },
    }),
  ]);

  console.log("✓ 8 utilisateurs créés (1 admin, 2 instructeurs, 5 membres)");

  // ── Instructors ────────────────────────────────────────
  const sophie = await prisma.instructor.create({
    data: {
      userId: instrSophie.id,
      bio: "Certifiée Stott Pilates depuis 2018, Sophie enseigne avec douceur et précision. Spécialisée dans la rééducation posturale et le Pilates doux.",
      specialties: JSON.stringify(["Pilates Mat", "Pilates Doux", "Stretching"]),
      slug: "sophie-laurent",
      certifications: "Stott Pilates, BPJEPS",
    },
  });

  const camille = await prisma.instructor.create({
    data: {
      userId: instrCamille.id,
      bio: "Passionnée de mouvement, Camille est formée au Pilates Reformer et au Pilates prénatal. Elle accompagne chaque élève avec bienveillance.",
      specialties: JSON.stringify(["Reformer", "Prénatal", "Dynamique"]),
      slug: "camille-martin",
      certifications: "Balanced Body, CQP ALS",
    },
  });

  console.log("✓ 2 profils instructeurs");

  // ── Course Types ───────────────────────────────────────
  const courseTypes = await Promise.all([
    prisma.courseType.create({
      data: {
        name: "Pilates Mat",
        slug: "mat",
        description:
          "Le Pilates Mat (au sol) est la forme originale du Pilates. Sur un simple tapis, vous travaillez en profondeur vos muscles stabilisateurs, améliorez votre posture et développez votre conscience corporelle. Idéal pour tous les niveaux.",
        shortDescription: "Renforcement au sol, tous niveaux",
        duration: 55,
        level: "ALL_LEVELS",
        intensity: 3,
        maxParticipants: 12,
        color: "#0077B6",
        benefits: JSON.stringify(["Posture", "Souplesse", "Renforcement", "Conscience corporelle"]),
        equipment: JSON.stringify(["Tapis", "Balle", "Élastique"]),
      },
    }),
    prisma.courseType.create({
      data: {
        name: "Reformer",
        slug: "reformer",
        description:
          "Le Pilates Reformer utilise une machine à ressorts qui offre une résistance variable. Ce cours permet un travail plus ciblé et intense, avec un feedback proprioceptif unique. Places limitées pour un suivi personnalisé.",
        shortDescription: "Machine à ressorts, travail ciblé",
        duration: 55,
        level: "INTERMEDIATE",
        intensity: 4,
        maxParticipants: 6,
        color: "#8FAE8F",
        benefits: JSON.stringify(["Force", "Alignement", "Précision", "Tonicité"]),
        equipment: JSON.stringify(["Reformer"]),
      },
    }),
    prisma.courseType.create({
      data: {
        name: "Pilates Doux",
        slug: "doux",
        description:
          "Un cours adapté aux débutants et aux personnes recherchant une pratique en douceur. Mouvements lents et contrôlés, respiration guidée, parfait pour la récupération ou les seniors.",
        shortDescription: "Mouvements doux, idéal débutants",
        duration: 50,
        level: "BEGINNER",
        intensity: 2,
        maxParticipants: 14,
        color: "#D4A574",
        benefits: JSON.stringify(["Détente", "Mobilité", "Respiration", "Équilibre"]),
        equipment: JSON.stringify(["Tapis", "Coussin"]),
      },
    }),
    prisma.courseType.create({
      data: {
        name: "Prénatal",
        slug: "prenatal",
        description:
          "Spécialement conçu pour les futures mamans, ce cours adapte les exercices de Pilates aux besoins de la grossesse. Renforcement du périnée, soulagement des douleurs dorsales, préparation à l'accouchement.",
        shortDescription: "Adapté à la grossesse",
        duration: 50,
        level: "ALL_LEVELS",
        intensity: 2,
        maxParticipants: 8,
        color: "#E8B4B8",
        benefits: JSON.stringify(["Périnée", "Dos", "Respiration", "Bien-être"]),
        equipment: JSON.stringify(["Tapis", "Ballon", "Coussin"]),
      },
    }),
    prisma.courseType.create({
      data: {
        name: "Pilates Dynamique",
        slug: "dynamique",
        description:
          "Un Pilates challengeant qui combine les fondamentaux avec des séquences plus intenses et rythmées. Cardio léger, enchaînements fluides, pour ceux qui veulent se dépasser.",
        shortDescription: "Intense et rythmé, niveau avancé",
        duration: 55,
        level: "ADVANCED",
        intensity: 5,
        maxParticipants: 10,
        color: "#C44536",
        benefits: JSON.stringify(["Cardio", "Endurance", "Force", "Coordination"]),
        equipment: JSON.stringify(["Tapis", "Poids légers", "Cercle"]),
      },
    }),
    prisma.courseType.create({
      data: {
        name: "Stretching Postural",
        slug: "stretching",
        description:
          "Un cours focalisé sur l'étirement en profondeur et le relâchement des tensions. Travail sur les chaînes musculaires, postures tenues, respiration consciente. Le complément idéal du Pilates.",
        shortDescription: "Étirements profonds, anti-tensions",
        duration: 45,
        level: "ALL_LEVELS",
        intensity: 1,
        maxParticipants: 14,
        color: "#7B68EE",
        benefits: JSON.stringify(["Souplesse", "Détente", "Anti-douleur", "Récupération"]),
        equipment: JSON.stringify(["Tapis", "Sangle"]),
      },
    }),
  ]);

  const [mat, reformer, doux, prenatal, dynamique, stretching] = courseTypes;

  console.log("✓ 6 types de cours");

  // ── Schedules (weekly recurring) ───────────────────────
  const scheduleData = [
    { day: 1, start: "09:00", end: "09:55", course: mat, instr: sophie },
    { day: 1, start: "10:30", end: "11:25", course: reformer, instr: camille },
    { day: 1, start: "18:00", end: "18:55", course: dynamique, instr: camille },
    { day: 2, start: "09:30", end: "10:20", course: doux, instr: sophie },
    { day: 2, start: "12:15", end: "13:05", course: mat, instr: sophie },
    { day: 2, start: "19:00", end: "19:55", course: reformer, instr: camille },
    { day: 3, start: "10:00", end: "10:50", course: prenatal, instr: camille },
    { day: 3, start: "14:00", end: "14:55", course: mat, instr: sophie },
    { day: 3, start: "17:30", end: "18:15", course: stretching, instr: sophie },
    { day: 4, start: "09:00", end: "09:55", course: reformer, instr: camille },
    { day: 4, start: "11:00", end: "11:55", course: doux, instr: sophie },
    { day: 4, start: "18:30", end: "19:25", course: dynamique, instr: camille },
    { day: 5, start: "09:30", end: "10:25", course: mat, instr: sophie },
    { day: 5, start: "10:30", end: "11:25", course: reformer, instr: camille },
    { day: 6, start: "10:00", end: "10:55", course: mat, instr: sophie },
  ];

  const schedules = await Promise.all(
    scheduleData.map((s) =>
      prisma.schedule.create({
        data: {
          courseTypeId: s.course.id,
          instructorId: s.instr.id,
          dayOfWeek: s.day,
          startTime: s.start,
          endTime: s.end,
          isRecurring: true,
          startDate: new Date("2025-09-01"),
          maxParticipants: s.course.maxParticipants,
        },
      })
    )
  );

  console.log(`✓ ${schedules.length} créneaux hebdomadaires`);

  // ── Sessions (past 2 weeks + next 4 weeks) ────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessions: Awaited<ReturnType<typeof prisma.session.create>>[] = [];

  for (let weekOffset = -2; weekOffset <= 4; weekOffset++) {
    for (const schedule of schedules) {
      const baseDate = new Date(today);
      const currentDay = baseDate.getDay() || 7;
      const diff = schedule.dayOfWeek - currentDay + weekOffset * 7;
      const sessionDate = new Date(baseDate);
      sessionDate.setDate(baseDate.getDate() + diff);

      const isPast = sessionDate < today;
      const maxP =
        schedule.maxParticipants ??
        scheduleData.find((s) => s.course.id === schedule.courseTypeId)!.course.maxParticipants;

      const currentP = isPast
        ? Math.floor(maxP * (0.4 + Math.random() * 0.5))
        : Math.floor(maxP * (0.2 + Math.random() * 0.6));

      const session = await prisma.session.create({
        data: {
          scheduleId: schedule.id,
          courseTypeId: schedule.courseTypeId,
          instructorId: schedule.instructorId,
          date: sessionDate,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          status: isPast ? "COMPLETED" : "SCHEDULED",
          maxParticipants: maxP,
          currentParticipants: currentP,
        },
      });
      sessions.push(session);
    }
  }

  console.log(`✓ ${sessions.length} sessions générées`);

  // ── Bookings ───────────────────────────────────────────
  let bookingCount = 0;

  const leaSessions = sessions.filter((_, i) => i % 3 === 0).slice(0, 15);
  for (const session of leaSessions) {
    const isPast = new Date(session.date) < today;
    await prisma.booking.create({
      data: {
        userId: users[0].id,
        sessionId: session.id,
        status: isPast ? "ATTENDED" : "CONFIRMED",
        paymentMethod: "CARD",
        paymentStatus: "PAID",
        createdAt: new Date(new Date(session.date).getTime() - 3 * 86400000),
      },
    });
    bookingCount++;
  }

  const julieSessions = sessions.filter((_, i) => i % 4 === 1).slice(0, 12);
  for (const session of julieSessions) {
    const isPast = new Date(session.date) < today;
    await prisma.booking.create({
      data: {
        userId: users[1].id,
        sessionId: session.id,
        status: isPast ? "ATTENDED" : "CONFIRMED",
        paymentMethod: "SUBSCRIPTION",
        paymentStatus: "PAID",
        createdAt: new Date(new Date(session.date).getTime() - 2 * 86400000),
      },
    });
    bookingCount++;
  }

  const nathSessions = sessions.filter((_, i) => i % 5 === 2).slice(0, 8);
  for (const session of nathSessions) {
    const isPast = new Date(session.date) < today;
    await prisma.booking.create({
      data: {
        userId: users[2].id,
        sessionId: session.id,
        status: isPast ? "ATTENDED" : "CONFIRMED",
        paymentMethod: isPast ? "CARD" : "ON_SITE",
        paymentStatus: isPast ? "PAID" : "PENDING",
        createdAt: new Date(new Date(session.date).getTime() - 86400000),
      },
    });
    bookingCount++;
  }

  // Claire: 1 paid online + 2 on-site pending
  const claireSessions = sessions.filter((s) => new Date(s.date) >= today).slice(0, 3);
  for (let i = 0; i < claireSessions.length; i++) {
    const session = claireSessions[i];
    await prisma.booking.create({
      data: {
        userId: users[3].id,
        sessionId: session.id,
        status: "CONFIRMED",
        paymentMethod: i === 0 ? "UNIT" : "ON_SITE",
        paymentStatus: i === 0 ? "PAID" : "PENDING",
      },
    });
    bookingCount++;
  }

  // Isabelle: 1 recurring (pending) + 1 on-site (pending)
  const isabelleSessions = sessions.filter((s) => new Date(s.date) >= today).slice(2, 4);
  for (let i = 0; i < isabelleSessions.length; i++) {
    const session = isabelleSessions[i];
    await prisma.booking.create({
      data: {
        userId: users[4].id,
        sessionId: session.id,
        status: "CONFIRMED",
        paymentMethod: i === 0 ? "RECURRING" : "ON_SITE",
        paymentStatus: "PENDING",
      },
    });
    bookingCount++;
  }

  console.log(`✓ ${bookingCount} réservations`);

  // ── Payments + Course Cards ────────────────────────────
  const payLea = await prisma.payment.create({
    data: {
      userId: users[0].id,
      amount: 16000,
      status: "SUCCEEDED",
      type: "COURSE_CARD",
      metadata: JSON.stringify({ sessions: 10 }),
      createdAt: new Date("2026-01-15"),
    },
  });
  await prisma.courseCard.create({
    data: {
      userId: users[0].id,
      paymentId: payLea.id,
      type: "10_SESSIONS",
      totalSessions: 10,
      remainingSessions: 3,
      purchasedAt: new Date("2026-01-15"),
      expiresAt: new Date("2026-05-15"),
    },
  });

  const payJulie = await prisma.payment.create({
    data: {
      userId: users[1].id,
      amount: 30000,
      status: "SUCCEEDED",
      type: "COURSE_CARD",
      metadata: JSON.stringify({ sessions: 20 }),
      createdAt: new Date("2026-03-01"),
    },
  });
  await prisma.courseCard.create({
    data: {
      userId: users[1].id,
      paymentId: payJulie.id,
      type: "20_SESSIONS",
      totalSessions: 20,
      remainingSessions: 14,
      purchasedAt: new Date("2026-03-01"),
      expiresAt: new Date("2026-09-01"),
    },
  });

  const payNathExpired = await prisma.payment.create({
    data: {
      userId: users[2].id,
      amount: 8500,
      status: "SUCCEEDED",
      type: "COURSE_CARD",
      metadata: JSON.stringify({ sessions: 5 }),
      createdAt: new Date("2025-10-01"),
    },
  });
  await prisma.courseCard.create({
    data: {
      userId: users[2].id,
      paymentId: payNathExpired.id,
      type: "5_SESSIONS",
      totalSessions: 5,
      remainingSessions: 0,
      purchasedAt: new Date("2025-10-01"),
      expiresAt: new Date("2025-12-01"),
    },
  });

  const payClaire = await prisma.payment.create({
    data: {
      userId: users[3].id,
      amount: 16000,
      status: "SUCCEEDED",
      type: "COURSE_CARD",
      metadata: JSON.stringify({ sessions: 10 }),
      createdAt: new Date("2026-04-01"),
    },
  });
  await prisma.courseCard.create({
    data: {
      userId: users[3].id,
      paymentId: payClaire.id,
      type: "10_SESSIONS",
      totalSessions: 10,
      remainingSessions: 10,
      purchasedAt: new Date("2026-04-01"),
      expiresAt: new Date("2026-08-01"),
    },
  });

  console.log("✓ 4 cartes de cours (1 expirée, 3 actives)");

  // ── Subscription ───────────────────────────────────────
  await prisma.subscription.create({
    data: {
      userId: users[1].id,
      status: "ACTIVE",
      currentPeriodStart: new Date("2026-04-01"),
      currentPeriodEnd: new Date("2026-05-01"),
    },
  });

  console.log("✓ 1 abonnement actif");

  // ── Reviews ────────────────────────────────────────────
  const reviewData = [
    { user: users[0], course: mat, rating: 5, comment: "Super cours ! Sophie est très pédagogue, elle corrige chaque posture avec attention. Je recommande à 100% !" },
    { user: users[0], course: reformer, rating: 5, comment: "Le Reformer a littéralement transformé mon dos. Après 3 mois, plus aucune douleur." },
    { user: users[1], course: mat, rating: 4, comment: "Très bon cours, ambiance chaleureuse. Parfait pour se vider la tête après le travail." },
    { user: users[1], course: doux, rating: 5, comment: "Idéal pour reprendre en douceur. Les exercices sont bien adaptés et progressifs." },
    { user: users[2], course: mat, rating: 4, comment: "J'adore l'atmosphère du studio. Les cours sont variés et on ne s'ennuie jamais." },
    { user: users[2], course: stretching, rating: 5, comment: "Le stretching postural est un vrai moment de détente. On ressort détendu et grandi !" },
    { user: users[3], course: prenatal, rating: 5, comment: "Camille est formidable avec les futures mamans. Les exercices m'ont beaucoup aidée pendant ma grossesse." },
    { user: users[4], course: dynamique, rating: 4, comment: "Intense mais gratifiant ! On sent vraiment qu'on a travaillé. Pour les sportifs qui veulent un vrai défi." },
    { user: users[4], course: mat, rating: 5, comment: "Première expérience en Pilates et je suis conquise. Le studio est magnifique et l'équipe au top." },
  ];

  for (const r of reviewData) {
    await prisma.review.create({
      data: {
        userId: r.user.id,
        courseTypeId: r.course.id,
        rating: r.rating,
        comment: r.comment,
      },
    });
  }

  console.log(`✓ ${reviewData.length} avis`);

  // ── Gift Cards ─────────────────────────────────────────
  await prisma.giftCard.create({
    data: {
      code: "GIFT-MP2X-K8R4-N5VW",
      purchaserEmail: "marc.lefevre@gmail.com",
      recipientEmail: "lea.moreau@gmail.com",
      recipientName: "Léa",
      message: "Joyeux anniversaire ! Profite bien de tes cours",
      sessions: 5,
      remainingSessions: 0,
      status: "REDEEMED",
      purchasedAt: new Date("2025-12-20"),
      expiresAt: new Date("2026-06-20"),
      redeemedAt: new Date("2025-12-25"),
      redeemedByUserId: users[0].id,
    },
  });

  await prisma.giftCard.create({
    data: {
      code: "GIFT-AB7T-W3PQ-J9KL",
      purchaserEmail: "paul.garcia@gmail.com",
      recipientEmail: "sarah.leroy@gmail.com",
      recipientName: "Sarah",
      message: "Un peu de bien-être pour toi",
      amount: 5000,
      remainingAmount: 5000,
      status: "ACTIVE",
      purchasedAt: new Date("2026-04-10"),
      expiresAt: new Date("2026-10-10"),
    },
  });

  console.log("✓ 2 cartes cadeaux");

  // ── Blog Posts ─────────────────────────────────────────
  await prisma.blogPost.create({
    data: {
      title: "5 exercices de Pilates pour soulager le mal de dos",
      slug: "5-exercices-pilates-mal-de-dos",
      excerpt: "Découvrez les meilleurs exercices de Pilates pour renforcer votre dos et dire adieu aux douleurs chroniques.",
      content: "Le mal de dos touche 80% des Français au moins une fois dans leur vie. Le Pilates, grâce à son approche douce et ciblée, est l'une des méthodes les plus efficaces pour soulager et prévenir ces douleurs. Voici 5 exercices essentiels...",
      published: true,
      publishedAt: new Date("2026-03-15"),
      authorId: admin.id,
      tags: JSON.stringify(["dos", "exercices", "santé", "débutant"]),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Pilates prénatal : bienfaits et précautions",
      slug: "pilates-prenatal-bienfaits",
      excerpt: "Le Pilates pendant la grossesse offre de nombreux bienfaits. Voici tout ce qu'il faut savoir avant de commencer.",
      content: "La pratique du Pilates pendant la grossesse est non seulement possible mais fortement recommandée par de nombreux professionnels de santé. Découvrez pourquoi et comment pratiquer en toute sécurité...",
      published: true,
      publishedAt: new Date("2026-02-20"),
      authorId: admin.id,
      tags: JSON.stringify(["prénatal", "grossesse", "bien-être"]),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Reformer vs Mat Pilates : lequel choisir ?",
      slug: "reformer-vs-mat-pilates",
      excerpt: "Mat ou Reformer ? Découvrez les différences et trouvez la pratique qui vous correspond le mieux.",
      content: "C'est la question que se posent tous les débutants : vaut-il mieux commencer par le Pilates Mat ou le Reformer ? La réponse dépend de vos objectifs, de votre condition physique et de vos préférences...",
      published: true,
      publishedAt: new Date("2026-01-10"),
      authorId: admin.id,
      tags: JSON.stringify(["reformer", "mat", "comparatif", "débutant"]),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Les bienfaits insoupçonnés du Pilates sur le mental",
      slug: "pilates-bienfaits-mental",
      excerpt: "Au-delà du physique, le Pilates transforme votre mental. Concentration, gestion du stress, confiance en soi...",
      content: "On connaît les bienfaits physiques du Pilates — posture, souplesse, renforcement musculaire. Mais saviez-vous que cette discipline transforme aussi profondément votre santé mentale ?",
      published: false,
      authorId: admin.id,
      tags: JSON.stringify(["mental", "bien-être", "stress"]),
    },
  });

  console.log("✓ 4 articles de blog (3 publiés, 1 brouillon)");

  // ── Notifications ──────────────────────────────────────
  for (const user of users) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Bienvenue chez Mon Pilates !",
        message: "Votre compte a été créé avec succès. Découvrez nos cours et réservez votre première séance.",
        read: true,
      },
    });
  }

  await prisma.notification.create({
    data: {
      userId: users[0].id,
      type: "CARD_EXPIRING",
      title: "Votre carte expire bientôt",
      message: "Il vous reste 3 séances sur votre carte de 10 cours. Elle expire le 15 mai 2026.",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: users[1].id,
      type: "BOOKING_CONFIRMED",
      title: "Réservation confirmée",
      message: "Votre place pour le cours de Pilates Mat de lundi 9h est confirmée !",
      read: false,
    },
  });

  console.log("✓ 7 notifications");

  // ── Email templates ────────────────────────────────────
  // Upsert only on create: admin edits in /admin/emails/templates must NOT
  // be overwritten when the seed is re-run.
  const emailTemplates: Array<{
    key: string;
    name: string;
    subject: string;
    html: string;
    variables: string[];
  }> = [
    {
      key: "booking_confirm",
      name: "Confirmation de réservation",
      subject: "Réservation confirmée — {{courseName}}",
      html: buildBookingConfirmHtml(),
      variables: ["courseName", "date", "time", "instructor"],
    },
    {
      key: "booking_reminder",
      name: "Rappel de cours J-1",
      subject: "Rappel : {{courseName}} demain",
      html: buildBookingReminderHtml(),
      variables: ["courseName", "date", "time", "instructor"],
    },
    {
      key: "booking_cancelled",
      name: "Annulation de séance",
      subject: "Annulation — {{courseName}}",
      html: buildBookingCancelledHtml(),
      variables: ["userName", "courseName", "date", "time"],
    },
    {
      key: "reset_password",
      name: "Réinitialisation de mot de passe",
      subject: "Réinitialisation de votre mot de passe",
      html: buildResetPasswordHtml(),
      variables: ["name", "resetUrl"],
    },
    {
      key: "welcome",
      name: "Bienvenue après inscription",
      subject: "Bienvenue chez Mon Pilates !",
      html: buildWelcomeHtml(),
      variables: ["name"],
    },
  ];

  for (const t of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { key: t.key },
      create: {
        key: t.key,
        name: t.name,
        subject: t.subject,
        mjmlSource: t.html,
        htmlCompiled: t.html,
        variables: JSON.stringify(t.variables),
      },
      update: {},
    });
  }

  console.log(`✓ ${emailTemplates.length} templates d'email`);

  // ── Summary ────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Base de données peuplée avec succès !\n");
  console.log("  Admin:  admin@mon-pilates.bzh / admin123");
  console.log("  Membre: lea.moreau@gmail.com / user123");
  console.log("  Membre: julie.bernard@gmail.com / user123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
