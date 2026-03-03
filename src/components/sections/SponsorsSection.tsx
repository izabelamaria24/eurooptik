 "use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Sponsor } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: Sponsor[];
};

const CHUNK_SIZE = 4;

export function SponsorsSection({ data }: Props) {
  const groups = useMemo(() => {
    const result: Sponsor[][] = [];
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      result.push(data.slice(i, i + CHUNK_SIZE));
    }
    return result.length ? result : [data];
  }, [data]);

  const [slide, setSlide] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const visiblePartners = groups[slide] ?? [];

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section
      id="sponsors"
      className="overflow-x-hidden bg-gradient-to-b from-white to-[#fce3ef]/40"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow="Parteneri"
          title="Comunitatea noastră"
          description="Partenerii noștri care ne sprijină în oferirea celor mai bune servicii."
        />

        <div className="overflow-hidden rounded-2xl bg-white/90 p-4 shadow-2xl fade-slide sm:rounded-[2.5rem] sm:p-8">
          <div className="grid gap-8 sm:gap-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
                Rețea strategică
              </p>
              <p className="text-xl font-semibold text-slate-900 sm:text-3xl">
                +{data.length} parteneri medicali și ONG-uri
              </p>
              <p className="text-base text-slate-600">
                De la campanii de screeninguri oftalmologice până la proiecte
                educaționale, parteneriatele noastre accelerează prevenția și
                accesul la tratamente oftalmologice moderne.
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                <div className="rounded-2xl bg-[#fce3ef]/70 p-3 text-center sm:p-4">
                  <p className="text-xl text-primary sm:text-2xl">15+</p>
                  <p>campanii anuale</p>
                </div>
                <div className="rounded-2xl bg-[#d9f5ee]/70 p-3 text-center sm:p-4">
                  <p className="text-xl text-secondary sm:text-2xl">6</p>
                  <p>orașe implicate</p>
                </div>
              </div>

              {/* Logo scroll — flex on desktop, 2-col grid on mobile */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:overflow-x-auto sm:pb-2 soft-scroll">
                {data.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="flex items-center justify-center rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow sm:min-w-[140px] sm:px-4 sm:py-3"
                  >
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      width={180}
                      height={80}
                      className="h-12 w-auto object-contain sm:h-16"
                    />
                  </div>
                ))}
              </div>

              {groups.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSlide((prev) => Math.max(prev - 1, 0))}
                    disabled={slide === 0}
                    className="rounded-full border border-[#ffd5ea] px-4 py-2 text-sm font-semibold text-[#e4007f] disabled:opacity-30"
                  >
                    ←
                  </button>
                  <div className="flex gap-2">
                    {groups.map((_, idx) => (
                      <button
                        key={`partner-dot-${idx}`}
                        onClick={() => setSlide(idx)}
                        className={`h-2.5 w-2.5 rounded-full ${
                          slide === idx ? "bg-[#e4007f]" : "bg-[#ffd5ea]"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setSlide((prev) => Math.min(prev + 1, groups.length - 1))
                    }
                    disabled={slide === groups.length - 1}
                    className="rounded-full border border-[#ffd5ea] px-4 py-2 text-sm font-semibold text-[#e4007f] disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {visiblePartners.map((sponsor) => {
                const fullText =
                  sponsor.description || "Partener strategic Eurooptik.";
                const truncated =
                  fullText.length > 220 && !expanded[sponsor.id]
                    ? `${fullText.slice(0, 220)}…`
                    : fullText;
                return (
                  <div
                    key={`desc-${sponsor.id}`}
                    className="fade-slide rounded-2xl border border-white/60 bg-white/95 p-5 text-sm text-slate-600 shadow"
                  >
                    <div className="mb-3 flex flex-col gap-2">
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        width={80}
                        height={40}
                        className="h-10 w-auto object-contain"
                      />
                      <p className="text-base font-semibold text-slate-900">
                        {sponsor.name}
                      </p>
                    </div>
                    <p>{truncated}</p>
                    {fullText.length > 220 && (
                      <button
                        className="mt-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                        onClick={() => toggleExpanded(sponsor.id)}
                      >
                        {expanded[sponsor.id] ? "Vezi mai puțin" : "Vezi mai mult"}
                      </button>
                    )}
                    {sponsor.websiteUrl && (
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        Vizitează website-ul
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
