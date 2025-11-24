"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { SpecializationsPayload } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: SpecializationsPayload;
};

const richTextOptions = {
  renderText: (text: string) => text,
};

export function SpecializationsSection({ data }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(
    data.categories[0]?.slug ?? ""
  );
  const filteredSpecializations = useMemo(() => {
    return data.specializations.filter(
      (spec) => spec.categorySlug === selectedCategory
    );
  }, [data.specializations, selectedCategory]);

  const [activeSlug, setActiveSlug] = useState(
    filteredSpecializations[0]?.slug ?? ""
  );

  const activeSpecialization =
    filteredSpecializations.find((spec) => spec.slug === activeSlug) ??
    filteredSpecializations[0];

  const handleArticleClick = (slug: string) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("select-article", { detail: slug }));
    document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="specializations">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Specialități"
          title="Selectează categoria pentru a vedea echipele dedicate"
          description="Planurile chirurgicale, pediatrice și de recuperare sunt grupate pe clinici, astfel încât să găsești rapid specializarea potrivită."
        />

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {data.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.slug);
                const firstSpec = data.specializations.find(
                  (spec) => spec.categorySlug === category.slug
                );
                if (firstSpec) setActiveSlug(firstSpec.slug);
              }}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                selectedCategory === category.slug
                  ? "border-[#e4007f] bg-[#e4007f] text-white"
                  : "border-[#ffd5ea] bg-white text-[#e4007f] hover:border-[#f7a6cf]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-3">
            {filteredSpecializations.map((spec) => (
              <button
                key={spec.slug}
                onClick={() => setActiveSlug(spec.slug)}
                className={`flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow transition hover:-translate-y-1 ${
                  spec.slug === activeSlug
                    ? "border-[#e4007f] shadow-rose-200"
                    : "border-transparent"
                }`}
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                  <Image
                    src={spec.cardImage}
                    alt={spec.cardTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
                    {data.categories.find(
                      (cat) => cat.slug === spec.categorySlug
                    )?.name ?? ""}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {spec.cardTitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {activeSpecialization && (
            <aside className="space-y-6 rounded-[2rem] bg-gradient-to-br from-white to-[#fce3ef]/80 p-8 shadow-xl">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
                  Focus
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  {activeSpecialization.articleTitle}
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                  {activeSpecialization.articleDescription
                    ? documentToReactComponents(
                        activeSpecialization.articleDescription,
                        richTextOptions
                      )
                    : null}
                </div>
              </div>

              {activeSpecialization.testimonialQuote && (
                <div className="rounded-2xl border border-white/60 bg-white/80 p-4 text-sm text-slate-600 shadow-inner">
                  <p className="font-semibold uppercase tracking-[0.3em] text-primary">
                    Vocea pacienților
                  </p>
                  <p className="mt-2 italic">
                    “{activeSpecialization.testimonialQuote}”
                  </p>
                </div>
              )}

              {activeSpecialization.articles.length > 0 && (
                <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
                    Articole recomandate
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeSpecialization.articles.map((article) => (
                      <button
                        key={article.slug}
                        type="button"
                        onClick={() => handleArticleClick(article.slug)}
                        className="rounded-full border border-[#ffd5ea] px-4 py-1.5 text-sm font-semibold text-[#e4007f] transition hover:border-[#f7a6cf]"
                      >
                        {article.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
