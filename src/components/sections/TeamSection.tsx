"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { TeamPayload } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: TeamPayload;
};

const roleTranslations: Record<string, string> = {
  doctor: "Medic",
  "asistenta-medicala": "Asistentă",
  infirmiera: "Infirmieră",
  consilier: "Consilier",
  manager: "Manager",
  optometrist: "Optometrist",
};

export function TeamSection({ data }: Props) {
  const [filter, setFilter] = useState("all");

  const filteredMembers = useMemo(() => {
    if (filter === "all") return data.members;
    return data.members.filter((member) => member.categories.includes(filter));
  }, [data.members, filter]);

  return (
    <section id="team">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Echipă"
          title="Echipa noastră"
          description="Selectați orașul pentru a vedea echipa noastră de profesioniști din fiecare locație."
        />

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              filter === "all"
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary"
            }`}
          >
            Toată echipa
          </button>
          {data.locations.map((location) => (
            <button
              key={location.filterId}
              onClick={() => setFilter(location.filterId)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                filter === location.filterId
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.slice(0, 12).map((member) => (
            <div key={member.name} className="card-animated overflow-hidden p-6 text-center">
              <div className="relative mx-auto h-60 w-60 overflow-hidden bg-accent">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="160px"
                  className="object-cover object-[center_15%] transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-2 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                  {roleTranslations[member.type] ?? member.type}
                </p>
                <h3 className="text-xl font-semibold text-slate-900">
                  {member.name}
                </h3>
                {member.specializations.length > 0 && (
                  <ul className="space-y-1 text-base text-slate-600">
                    {member.specializations.map((spec) => (
                      <li key={spec}>• {spec}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

