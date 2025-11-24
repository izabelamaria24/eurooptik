"use client";

import { useMemo, useState } from "react";
import type { ReelsPayload } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: ReelsPayload;
};

const filterButtonClasses = (isActive: boolean) =>
  `rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
    isActive
      ? "border-[#e4007f] bg-[#e4007f] text-white"
      : "border-[#ffd5ea] bg-white text-[#e4007f] hover:border-[#f7a6cf]"
  }`;

export function ReelsSection({ data }: Props) {
  const [doctorFilter, setDoctorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredReels = useMemo(() => {
    return data.reels.filter((reel) => {
      const matchesDoctor = doctorFilter
        ? reel.doctorSlug === doctorFilter
        : true;
      const matchesCategory = categoryFilter
        ? reel.categorySlug === categoryFilter
        : true;
      return matchesDoctor && matchesCategory;
    });
  }, [data.reels, doctorFilter, categoryFilter]);

  return (
    <section id="reels">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Studio Reels"
          title="Clipuri educaționale filmate direct în cabinete"
          description="Selectează medicul sau categoria pentru a urmări protocoalele chirurgicale, exercițiile de recuperare și sfaturile pentru pacienți."
        />

        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={filterButtonClasses(doctorFilter === "")}
              onClick={() => setDoctorFilter("")}
            >
              Toți medicii
            </button>
            {data.doctors.map((doctor) => (
              <button
                key={doctor.slug}
                className={filterButtonClasses(doctorFilter === doctor.slug)}
                onClick={() => setDoctorFilter(doctor.slug)}
              >
                {doctor.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={filterButtonClasses(categoryFilter === "")}
              onClick={() => setCategoryFilter("")}
            >
              Toate subiectele
            </button>
            {data.categories.map((category) => (
              <button
                key={category.slug}
                className={filterButtonClasses(
                  categoryFilter === category.slug
                )}
                onClick={() => setCategoryFilter(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {filteredReels.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nu există clipuri pentru filtrele selectate. Selectează alt medic
            sau subiect.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                className="card-animated fade-slide w-full max-w-[320px] space-y-3 p-4 transition hover:-translate-y-1"
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] bg-black">
                  <video
                    src={reel.videoUrl}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                    {reel.categoryName}
                  </span>
                </div>
                <div className="space-y-2 px-1 pb-1 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                    {reel.doctorName}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {reel.title || "Clip educațional"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Analizăm procedurile și pașii de recuperare pentru pacienții
                    Eurooptik.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
