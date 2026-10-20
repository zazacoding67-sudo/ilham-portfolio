import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { projects, getProject } from "@/data/projects";
import { getCaseStudy } from "@/data/caseStudies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  const caseStudy = getCaseStudy(slug);
  if (!project || !caseStudy) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const [firstImage, ...restImages] = project.images;

  const meta: Array<[string, string]> = [
    ["Category", project.category],
    ["Year", project.year],
    ["Duration", project.duration],
    ["Role", project.role],
  ];

  return (
    <>
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-8 pt-[160px]">
        <Link
          href="/#work"
          data-cursor="hover"
          className="text-sm text-muted transition-colors hover:text-text"
        >
          ← All work
        </Link>

        <h1 className="mt-10 font-semibold leading-[0.95] tracking-[-0.03em] text-[clamp(48px,9vw,144px)]">
          {project.title}
        </h1>

        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 md:grid-cols-4">
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[13px] uppercase tracking-[0.12em] text-muted">
                {label}
              </dt>
              <dd className="mt-2 text-[16px] text-text">{value}</dd>
            </div>
          ))}
        </dl>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="mt-12 inline-block rounded-full bg-accent px-7 py-3.5 text-white"
          >
            Visit live site ↗
          </a>
        )}

        <div className="mt-24 grid gap-6 md:grid-cols-[160px_1fr]">
          <p className="text-[13px] uppercase tracking-[0.12em] text-muted">
            Overview
          </p>
          <p className="max-w-[900px] text-[20px] leading-[1.6] text-text">
            {caseStudy.overview}
          </p>
        </div>

        {firstImage && (
          <div className="mt-16 aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={firstImage}
              alt={`${project.title} screenshot 1`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <section className="mt-20">
          <h2 className="text-[24px] font-semibold">What I built</h2>
          <ul className="mt-8">
            {caseStudy.built.map((item, itemIndex) => {
              const colonIndex = item.indexOf(":");
              return (
                <li key={itemIndex} className="border-t border-border py-5">
                  {colonIndex !== -1 ? (
                    <>
                      <strong className="font-semibold text-text">
                        {item.slice(0, colonIndex + 1)}
                      </strong>
                      {item.slice(colonIndex + 1)}
                    </>
                  ) : (
                    item
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {restImages.length > 0 && (
          <div className="mt-12 space-y-6">
            {restImages.map((src, imageIndex) => (
              <div
                key={src}
                className="aspect-video w-full overflow-hidden rounded-xl"
              >
                <img
                  src={src}
                  alt={`${project.title} screenshot ${imageIndex + 2}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <section className="mt-20">
          <h2 className="text-[24px] font-semibold">The challenge</h2>
          <h3 className="mt-4 font-serif italic text-[40px] text-text">
            {caseStudy.challenge.title}
          </h3>
          <div className="mt-6 max-w-[900px] space-y-5">
            {caseStudy.challenge.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="text-[18px] leading-[1.7] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {caseStudy.challenge.bullets && (
            <ul className="mt-6 max-w-[900px] space-y-4">
              {caseStudy.challenge.bullets.map((bullet, bulletIndex) => (
                <li
                  key={bulletIndex}
                  className="flex gap-3 text-[18px] leading-[1.7] text-muted"
                >
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {(caseStudy.note || caseStudy.result) && (
          <div className="mt-12 space-y-6">
            {caseStudy.note && (
              <div className="rounded-xl border border-border bg-surface p-6">
                <p className="text-[13px] uppercase tracking-[0.12em] text-muted">
                  Role note
                </p>
                <p className="mt-3 text-[16px] leading-[1.7] text-text">
                  {caseStudy.note}
                </p>
              </div>
            )}
            {caseStudy.result && (
              <div className="rounded-xl border border-border bg-surface p-6">
                <p className="text-[13px] uppercase tracking-[0.12em] text-muted">
                  Result
                </p>
                <p className="mt-3 text-[16px] leading-[1.7] text-text">
                  {caseStudy.result}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-20 flex flex-wrap gap-3">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <Link
          href={`/work/${next.slug}`}
          data-cursor="hover"
          className="mt-24 block border-t border-border py-16"
        >
          <p className="text-[13px] uppercase tracking-[0.12em] text-muted">
            Next project
          </p>
          <p className="mt-4 font-semibold tracking-[-0.03em] text-[clamp(36px,6vw,88px)]">
            {next.title}
          </p>
        </Link>
      </main>

      <Footer />
    </>
  );
}
