export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  duration: string;
  role: string;
  summary: string;
  tech: string[];
  liveUrl?: string;
  images: string[];
};

export const projects: Project[] = [
  {
    slug: "happy-camera",
    title: "Happy Camera",
    category: "E-commerce · Full-stack development",
    year: "2026",
    duration: "2 months (Aug–Oct 2026)",
    role: "Sole developer",
    summary:
      "A complete online store for a Kuala Lumpur camera retailer, with secure payments and a private admin dashboard.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "NextAuth",
      "CHIP payments",
      "Resend",
      "Tailwind CSS",
      "Playwright",
      "Vercel",
    ],
    liveUrl: "https://www.happycamera.com.my",
    images: [
      "/images/projects/happy-camera/01-cover.png",
      "/images/projects/happy-camera/02-shop.png",
      "/images/projects/happy-camera/03-browse.png",
    ],
  },
  {
    slug: "hexagon-game",
    title: "Hexagon Games 2026",
    category: "Event website · Web development",
    year: "2026",
    duration: "1 day (Jul 2026)",
    role: "Web developer (implementation of the organizer's design)",
    summary:
      "A one-day build of the official promotional site for Malaysia's first mall-integrated functional fitness competition.",
    tech: [
      "TanStack Start",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
      "Vercel",
    ],
    liveUrl: "https://hexagon-game2026.vercel.app",
    images: [
      "/images/projects/hexagon-game/01-cover.png",
      "/images/projects/hexagon-game/02-race-course.png",
      "/images/projects/hexagon-game/03-tickets.png",
    ],
  },
  {
    slug: "plastify-app",
    title: "Plastify",
    category: "Web app · Design and development",
    year: "2026",
    duration: "1 month (Jun 2026)",
    role: "Designer and developer",
    summary:
      "Winner at TI NATUREX 3.0: a recycling awareness app for Malaysia with an AI waste scanner and a map of nearby recycling centres.",
    tech: [
      "React",
      "Tailwind CSS",
      "GSAP",
      "Lenis",
      "Three.js",
      "TensorFlow.js",
      "Teachable Machine",
      "Leaflet",
      "OpenStreetMap",
      "Vercel",
    ],
    liveUrl: "https://plastify-app.vercel.app",
    images: [
      "/images/projects/plastify-app/01-cover.png",
      "/images/projects/plastify-app/02-scanner.png",
      "/images/projects/plastify-app/03-map.png",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
