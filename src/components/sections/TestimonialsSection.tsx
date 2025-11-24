"use client";

import Image from "next/image";
import { useState } from "react";
import type { Testimonial } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: Testimonial[];
};

export function TestimonialsSection({ data }: Props) {
  const [index, setIndex] = useState(0);
  const hasData = data.length > 0;
  const current = hasData ? data[index % data.length] : null;
  const collage = data.slice(0, 4);

  return (
    <section id="testimonials" className="bg-white/70">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Testimoniale"
          title="Ce spun pacienții noștri"
          description="Fotografii reale din clinicile Eurooptik și mesajele care ne motivează zi de zi."
        />

        {current ? (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid grid-cols-2 gap-4">
              {collage.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const newIndex = data.findIndex(
                      (entry) => entry.id === item.id
                    );
                    if (newIndex >= 0) setIndex(newIndex);
                  }}
                  className={`overflow-hidden rounded-3xl border-2 transition ${
                    data[index].id === item.id
                      ? "border-[#e4007f]"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.author}
                    width={400}
                    height={480}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </button>
              ))}
            </div>

            <div className="card-animated flex h-full flex-col justify-between bg-white/95 p-8">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                  Testimonial
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  “{current.quote}”
                </p>
                <p className="text-sm font-semibold text-rose-500">
                  {current.author}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  className="rounded-full border border-[#ffd5ea] px-3 py-2 text-[#e4007f] transition hover:border-[#f7a6cf]"
                  onClick={() =>
                    setIndex((prev) => (prev - 1 + data.length) % data.length)
                  }
                  aria-label="Anterior"
                >
                  ←
                </button>
                <button
                  className="rounded-full border border-[#ffd5ea] px-3 py-2 text-[#e4007f] transition hover:border-[#f7a6cf]"
                  onClick={() => setIndex((prev) => (prev + 1) % data.length)}
                  aria-label="Următor"
                >
                  →
                </button>
                <p className="text-sm text-slate-500">
                  {index + 1} / {data.length}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500">
            Testimonialele vor fi afișate în curând.
          </p>
        )}
      </div>
    </section>
  );
}
