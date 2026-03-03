"use client";

import { useMemo, useState } from "react";
import type { ReelsPayload } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: ReelsPayload;
};

const filterButtonClasses = (isActive: boolean) =>
  `rounded-full border px-5 py-2 text-sm font-semibold transition ${
    isActive
      ? "border-primary bg-primary text-white"
      : "border-slate-200 bg-white text-slate-700 hover:border-primary"
  }`;

function VideoPlayer({ src }: { src: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-white">
        <p className="text-xs text-red-300">Nu s-a putut încărca videoclipul.</p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white underline-offset-2 hover:bg-white/30 hover:underline"
        >
          Deschide direct ↗
        </a>
        <p className="break-all px-2 text-[10px] text-white/50">{src}</p>
      </div>
    );
  }

  return (
    <video
      src={src}
      controls
      playsInline
      className="h-full w-full object-cover"
      onError={() => setError(true)}
    />
  );
}

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
          title="Reels"
          description="Selectați medicul oftalmolog sau subiectul medical pentru a viziona videoclipurile Eurooptik."
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
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                className="card-animated fade-slide w-full space-y-3 p-4 transition hover:-translate-y-1"
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] bg-black">
                  <VideoPlayer src={reel.videoUrl} />
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
                  <p className="text-base text-slate-600">
                    Videoclipuri educaționale despre sănătatea ochilor, proceduri
                    oftalmologice și sfaturi de prevenție.
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
