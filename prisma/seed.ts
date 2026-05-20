// @ts-nocheck
// This file is only used for local database seeding, not part of the Next.js build.
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  JoinStatus,
  NotificationType,
} from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_EMAIL_DOMAIN = "@beemate.demo";

const demoUsers = [
  {
    email: `admin${SEED_EMAIL_DOMAIN}`,
    name: "Ayu Admin",
    role: UserRole.ADMIN,
    title: "Hustler",
    bio: "Admin BeeMate. Membantu mahasiswa menemukan tim dan kompetisi kampus.",
    skills: ["Product", "Community", "Events"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayu-admin",
    portfolioUrl: "https://github.com",
  },
  {
    email: `budi${SEED_EMAIL_DOMAIN}`,
    name: "Budi Santoso",
    role: UserRole.USER,
    title: "Hacker",
    bio: "Full-stack dev. Suka hackathon dan membangun MVP dalam 48 jam.",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
    portfolioUrl: "https://github.com",
  },
  {
    email: `citra${SEED_EMAIL_DOMAIN}`,
    name: "Citra Dewi",
    role: UserRole.USER,
    title: "Hipster",
    bio: "UI/UX designer fokus mobile-first dan design system.",
    skills: ["Figma", "UI Design", "Prototyping", "Design Systems"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=citra",
    portfolioUrl: "https://dribbble.com",
  },
  {
    email: `doni${SEED_EMAIL_DOMAIN}`,
    name: "Doni Pratama",
    role: UserRole.USER,
    title: "Hustler",
    bio: "Business development & pitch deck untuk startup kampus.",
    skills: ["Pitching", "Marketing", "Business Model", "Sales"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=doni",
  },
  {
    email: `eka${SEED_EMAIL_DOMAIN}`,
    name: "Eka Putri",
    role: UserRole.USER,
    title: "Hacker",
    bio: "ML engineer pemula. Tertarik AI untuk edukasi.",
    skills: ["Python", "TensorFlow", "Data Analysis"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=eka",
  },
  {
    email: `fajar${SEED_EMAIL_DOMAIN}`,
    name: "Fajar Nugroho",
    role: UserRole.USER,
    title: "Hacker",
    bio: "Mobile dev Flutter & React Native.",
    skills: ["Flutter", "Dart", "Firebase", "REST API"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fajar",
  },
  {
    email: `gita${SEED_EMAIL_DOMAIN}`,
    name: "Gita Maharani",
    role: UserRole.USER,
    title: "Hipster",
    bio: "Brand designer & ilustrator untuk produk digital.",
    skills: ["Illustration", "Branding", "Motion Graphics"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=gita",
  },
  {
    email: `hadi${SEED_EMAIL_DOMAIN}`,
    name: "Hadi Wijaya",
    role: UserRole.USER,
    title: "Hustler",
    bio: "Project manager tim kompetisi. Organisasi adalah kunci.",
    skills: ["Agile", "Scrum", "Leadership", "Communication"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=hadi",
  },
  {
    email: `indra${SEED_EMAIL_DOMAIN}`,
    name: "Indra Kusuma",
    role: UserRole.USER,
    title: "Hacker",
    bio: "DevOps & cloud. Deploy cepat, sleep cukup.",
    skills: ["Docker", "AWS", "CI/CD", "Linux"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=indra",
  },
  {
    email: `julia${SEED_EMAIL_DOMAIN}`,
    name: "Julia Sari",
    role: UserRole.USER,
    title: "Hipster",
    bio: "Content creator & social media untuk startup.",
    skills: ["Content Strategy", "Copywriting", "Social Media"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=julia",
  },
];

async function clearSeedData() {
  const seedUsers = await prisma.user.findMany({
    where: { email: { endsWith: SEED_EMAIL_DOMAIN } },
    select: { id: true },
  });
  const seedUserIds = seedUsers.map((u) => u.id);

  if (seedUserIds.length === 0) return;

  await prisma.notification.deleteMany({
    where: {
      OR: [
        { recipientId: { in: seedUserIds } },
        { senderId: { in: seedUserIds } },
      ],
    },
  });
  await prisma.teamMember.deleteMany({
    where: { userId: { in: seedUserIds } },
  });
  await prisma.team.deleteMany({
    where: { leaderId: { in: seedUserIds } },
  });
  await prisma.competition.deleteMany({
    where: { authorId: { in: seedUserIds } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: seedUserIds } },
  });
}

async function main() {
  console.log("🐝 BeeMate — seeding dummy data...\n");

  await clearSeedData();

  const users = await Promise.all(
    demoUsers.map((u) =>
      prisma.user.create({
        data: {
          email: u.email,
          name: u.name,
          role: u.role,
          title: u.title,
          bio: u.bio,
          skills: u.skills,
          image: u.image,
          portfolioUrl: u.portfolioUrl ?? null,
          emailVerified: new Date(),
        },
      })
    )
  );

  const byEmail = Object.fromEntries(users.map((u) => [u.email!, u]));
  const admin = byEmail[`admin${SEED_EMAIL_DOMAIN}`];
  const budi = byEmail[`budi${SEED_EMAIL_DOMAIN}`];
  const citra = byEmail[`citra${SEED_EMAIL_DOMAIN}`];
  const doni = byEmail[`doni${SEED_EMAIL_DOMAIN}`];
  const eka = byEmail[`eka${SEED_EMAIL_DOMAIN}`];
  const fajar = byEmail[`fajar${SEED_EMAIL_DOMAIN}`];
  const gita = byEmail[`gita${SEED_EMAIL_DOMAIN}`];
  const hadi = byEmail[`hadi${SEED_EMAIL_DOMAIN}`];
  const indra = byEmail[`indra${SEED_EMAIL_DOMAIN}`];
  const julia = byEmail[`julia${SEED_EMAIL_DOMAIN}`];

  const now = new Date();

  const teamHiveMinds = await prisma.team.create({
    data: {
      name: "HiveMinds",
      description:
        "Tim hackathon untuk membangun solusi edtech kampus. Stack: Next.js + AI.",
      leaderId: budi.id,
      members: {
        create: [
          { userId: budi.id, role: "ADMIN_TIM", joinStatus: JoinStatus.ACCEPTED },
          { userId: citra.id, role: "MEMBER", joinStatus: JoinStatus.ACCEPTED },
          { userId: doni.id, role: "MEMBER", joinStatus: JoinStatus.ACCEPTED },
          { userId: eka.id, role: "MEMBER", joinStatus: JoinStatus.PENDING },
        ],
      },
    },
  });

  const teamPixelPioneers = await prisma.team.create({
    data: {
      name: "Pixel Pioneers",
      description: "Fokus UI/UX dan frontend. Mencari 1 backend developer.",
      leaderId: citra.id,
      members: {
        create: [
          { userId: citra.id, role: "ADMIN_TIM", joinStatus: JoinStatus.ACCEPTED },
          { userId: gita.id, role: "MEMBER", joinStatus: JoinStatus.ACCEPTED },
          { userId: julia.id, role: "MEMBER", joinStatus: JoinStatus.ACCEPTED },
        ],
      },
    },
  });

  const teamCloudCrafters = await prisma.team.create({
    data: {
      name: "Cloud Crafters",
      description: "DevOps & infrastruktur untuk startup kampus.",
      leaderId: indra.id,
      members: {
        create: [
          { userId: indra.id, role: "ADMIN_TIM", joinStatus: JoinStatus.ACCEPTED },
          { userId: fajar.id, role: "MEMBER", joinStatus: JoinStatus.ACCEPTED },
          { userId: hadi.id, role: "MEMBER", joinStatus: JoinStatus.ACCEPTED },
        ],
      },
    },
  });

  const teamStartupSprint = await prisma.team.create({
    data: {
      name: "Startup Sprint",
      description: "Tim bisnis + tech untuk kompetisi entrepreneurship.",
      leaderId: doni.id,
      members: {
        create: [
          { userId: doni.id, role: "ADMIN_TIM", joinStatus: JoinStatus.ACCEPTED },
          { userId: hadi.id, role: "MEMBER", joinStatus: JoinStatus.ACCEPTED },
        ],
      },
    },
  });

  const competitions = await Promise.all([
    prisma.competition.create({
      data: {
        title: "National Hackathon 2026",
        description:
          "Hackathon nasional 48 jam. Tema: AI for Good. Hadiah total Rp 100 juta. Tim 3-5 orang.",
        imageUrl: "https://picsum.photos/seed/hackathon2026/1200/600",
        registrationLink: "https://example.com/register/hackathon-2026",
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
      },
    }),
    prisma.competition.create({
      data: {
        title: "Kampus Innovation Challenge",
        description:
          "Kompetisi inovasi produk kampus. Submit MVP + pitch deck. Deadline registrasi 2 minggu lagi.",
        imageUrl: "https://picsum.photos/seed/innovation/1200/600",
        registrationLink: "https://example.com/register/innovation",
        deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
      },
    }),
    prisma.competition.create({
      data: {
        title: "UI/UX Design Sprint",
        description:
          "Kompetisi desain 24 jam. Buat prototype Figma untuk masalah sosial lokal.",
        imageUrl: "https://picsum.photos/seed/uxsprint/1200/600",
        registrationLink: "https://example.com/register/ux-sprint",
        deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
      },
    }),
    prisma.competition.create({
      data: {
        title: "Startup Weekend Bandung",
        description:
          "54 jam membangun startup dari ide ke pitch. Mentor dari industri tersedia.",
        imageUrl: "https://picsum.photos/seed/startup-wknd/1200/600",
        registrationLink: "https://example.com/register/startup-weekend",
        deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
      },
    }),
    prisma.competition.create({
      data: {
        title: "CodeFest Regional 2025 (Ended)",
        description: "Kompetisi pemrograman regional — sudah berakhir.",
        imageUrl: "https://picsum.photos/seed/codefest/1200/600",
        deadline: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
      },
    }),
  ]);

  await prisma.notification.createMany({
    data: [
      {
        recipientId: eka.id,
        senderId: budi.id,
        type: NotificationType.INVITE,
        message: `Kamu diundang bergabung ke tim "${teamHiveMinds.name}"`,
        isRead: false,
      },
      {
        recipientId: citra.id,
        senderId: budi.id,
        type: NotificationType.ACCEPT,
        message: "Doni Pratama menerima undangan tim HiveMinds",
        isRead: true,
      },
      {
        recipientId: fajar.id,
        senderId: indra.id,
        type: NotificationType.INVITE,
        message: `Undangan ke tim "${teamCloudCrafters.name}" — Cloud Crafters butuh mobile dev`,
        isRead: false,
      },
      {
        recipientId: budi.id,
        senderId: admin.id,
        type: NotificationType.ALERT,
        message: `Kompetisi baru: "${competitions[0].title}" — deadline 30 hari lagi`,
        isRead: false,
      },
      {
        recipientId: doni.id,
        senderId: admin.id,
        type: NotificationType.ALERT,
        message: `Kompetisi baru: "${competitions[1].title}" — daftar sekarang!`,
        isRead: false,
      },
      {
        recipientId: gita.id,
        senderId: citra.id,
        type: NotificationType.ACCEPT,
        message: "Julia Sari bergabung ke tim Pixel Pioneers",
        isRead: true,
      },
    ],
  });

  // Enrich real OAuth users (if any) so dashboard mereka juga terisi
  const realUsers = await prisma.user.findMany({
    where: {
      email: { not: { endsWith: SEED_EMAIL_DOMAIN } },
      accounts: { some: {} },
    },
    take: 5,
  });

  for (const realUser of realUsers) {
    await prisma.user.update({
      where: { id: realUser.id },
      data: {
        bio: realUser.bio ?? "BeeMate member — sedang mencari tim kompetisi.",
        title: realUser.title ?? "Hacker",
        skills:
          realUser.skills.length > 0
            ? realUser.skills
            : ["Collaboration", "Problem Solving"],
      },
    });

    const alreadyMember = await prisma.teamMember.findFirst({
      where: { userId: realUser.id },
    });
    if (!alreadyMember) {
      await prisma.teamMember.create({
        data: {
          teamId: teamPixelPioneers.id,
          userId: realUser.id,
          role: "MEMBER",
          joinStatus: JoinStatus.ACCEPTED,
        },
      });
      await prisma.teamMember.create({
        data: {
          teamId: teamHiveMinds.id,
          userId: realUser.id,
          role: "MEMBER",
          joinStatus: JoinStatus.PENDING,
        },
      });
      await prisma.notification.create({
        data: {
          recipientId: realUser.id,
          senderId: budi.id,
          type: NotificationType.INVITE,
          message: `Kamu diundang ke tim "${teamHiveMinds.name}" oleh Budi Santoso`,
          isRead: false,
        },
      });
    }
  }

  console.log(`✅ ${users.length} users`);
  console.log(`✅ 4 teams`);
  console.log(`✅ ${competitions.length} competitions`);
  console.log(`✅ 6+ notifications`);
  if (realUsers.length > 0) {
    console.log(`✅ Linked ${realUsers.length} real account(s) to teams & notifications`);
  }
  console.log("\n🎉 Seed selesai! Refresh /people, /teams, /competitions");
  console.log(`   Demo admin: admin${SEED_EMAIL_DOMAIN} (role ADMIN — hanya tampil di DB, login tetap pakai Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
