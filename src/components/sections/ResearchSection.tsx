"use client";

import { useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { ResearchArticle } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: ResearchArticle[];
};

export function ResearchSection({ data }: Props) {
  const [activeSlug, setActiveSlug] = useState(data[0]?.slug ?? "");
  const activeArticle =
    data.find((article) => article.slug === activeSlug) ?? data[0];

  return (
    <section id="research" className="bg-white/60">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Cercetare"
          title="Studiile științifice Eurooptik"
          description="Proiecte dezvoltate împreună cu societăți oftalmologice și centre universitare din țară."
        />

        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-2">
            {data.map((article) => (
              <button
                key={article.slug}
                onClick={() => setActiveSlug(article.slug)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition hover:border-primary ${
                  article.slug === activeSlug
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                {article.title}
              </button>
            ))}
          </div>

          <div className="card max-h-[420px] overflow-y-auto p-6 soft-scroll">
            {activeArticle ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {activeArticle.title}
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                  {activeArticle.content
                    ? documentToReactComponents(activeArticle.content)
                    : "Conținut indisponibil."}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Selectează un articol de cercetare pentru a-l parcurge.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

