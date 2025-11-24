"use client";

import { useState } from "react";
import type { ServicesPayload } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: ServicesPayload;
};

export function ServicesSection({ data }: Props) {
  const [activeSlug, setActiveSlug] = useState(data.categories[0]?.slug ?? "");
  const activeCategory =
    data.categories.find((category) => category.slug === activeSlug) ??
    data.categories[0];

  return (
    <section id="services" className="bg-white/70">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Servicii"
          title="Selectează categoria pentru a vedea tarifele și intervențiile"
          description="Colectăm toate serviciile medicale în funcție de complexitate pentru a-ți fi ușor să găsești investigațiile potrivite."
        />

        <div className="mb-8 flex flex-wrap gap-3">
          {data.categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveSlug(category.slug)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeSlug === category.slug
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {activeCategory ? (
          <div className="space-y-6">
            {activeCategory.groups.map((group) => (
              <div key={group.title} className="card overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {group.title}
                  </p>
                </div>
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-wrap items-center justify-between px-5 py-3"
                    >
                      <p className="text-base font-medium text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {item.price ? `RON ${item.price}` : "La cerere"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">
            Nu există servicii pentru categoria selectată.
          </p>
        )}
      </div>
    </section>
  );
}

