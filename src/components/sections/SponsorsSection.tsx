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
      className="bg-gradient-to-b from-white to-[#fce3ef]/40"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow="Parteneri"
          title="Comunitatea care susține Eurooptik"
          description="Organizații medicale, ONG-uri și startup-uri cu care dezvoltăm programe educaționale și sociale."
        />

        <div className="rounded-[2.5rem] bg-white/90 p-8 shadow-2xl fade-slide">
          <div className="grid gap-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
                Rețea strategică
              </p>
              <p className="text-3xl font-semibold text-slate-900">
                +{data.length} parteneri medicali și ONG-uri
              </p>
              <p className="text-sm text-slate-600">
                De la campanii de donare de sânge până la screeninguri
                itinerante, parteneriatele noastre accelerează prevenția și
                accesul la tratamente moderne.
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                <div className="rounded-2xl bg-[#fce3ef]/70 p-4 text-center">
                  <p className="text-2xl text-primary">15+</p>
                  <p>campanii anuale</p>
                </div>
                <div className="rounded-2xl bg-[#d9f5ee]/70 p-4 text-center">
                  <p className="text-2xl text-secondary">6</p>
                  <p>orașe implicate</p>
                </div>
              </div>

              <div className="soft-scroll mt-6 flex gap-4 overflow-x-auto">
                {data.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="flex min-w-[160px] items-center justify-center rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow"
                  >
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      width={180}
                      height={80}
                      className="h-16 w-auto object-contain"
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

            <div className="grid gap-4 md:grid-cols-2">
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
                    <div className="mb-3 flex items-center gap-3">
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
