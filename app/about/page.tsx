import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About · Ilham Ammar",
};

const SKILLS = [
  "Next.js",
  "React",
  "TypeScript",
  "Prisma",
  "PostgreSQL",
  "Supabase",
  "Tailwind CSS",
  "GSAP",
  "Flutter",
  "Git",
];

export default function AboutPage() {
  const portraitExists = fs.existsSync(
    path.join(process.cwd(), "public", "images", "ilham-portrait.jpg")
  );

  return (
    <>
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-8 pt-[160px]">
        <Link
          href="/"
          data-cursor="hover"
          className="text-sm text-muted transition-colors hover:text-text"
        >
          ← Home
        </Link>

        <h1 className="mt-10 font-semibold tracking-[-0.03em] text-[clamp(48px,9vw,128px)]">
          About me
        </h1>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border">
            {portraitExists ? (
              <>
                <Image
                  src="/images/ilham-portrait.jpg"
                  alt="Ilham Ammar"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--glow) 25%, transparent) 0%, transparent 100%)",
                  }}
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface font-semibold text-[clamp(48px,12vw,120px)]">
                IA
              </div>
            )}
          </div>

          <div className="space-y-6 text-[18px] leading-[1.7]">
            <p>
              I’m Ilham Ammar, a Computer Science student at Universiti
              Teknikal Malaysia Melaka (UTeM). I build websites and apps from
              design to deployment.
            </p>
            <p>
              My first project was an app for a friend’s university team. Since
              then I have built a full online store for a camera retailer and
              an event website for a national fitness competition.
            </p>
            <p>
              I enjoy projects where real people use the result, and I am
              always learning something new, from payments to maps to 3D.
            </p>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-[24px] font-semibold">Education</h2>
          <ul className="mt-8">
            {site.education.map((entry) => (
              <li
                key={entry.program}
                className="flex flex-wrap items-baseline justify-between gap-4 border-t border-border py-6"
              >
                <div>
                  <p className="text-[18px] text-text">{entry.school}</p>
                  <p className="mt-1 text-[16px] text-muted">{entry.program}</p>
                </div>
                <p className="text-sm text-muted">{entry.status}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24">
          <h2 className="text-[24px] font-semibold">Skills</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-24 pb-24">
          <Link
            href="/#contact"
            data-cursor="hover"
            className="inline-block rounded-full bg-accent px-7 py-3.5 text-white"
          >
            Get in touch
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
