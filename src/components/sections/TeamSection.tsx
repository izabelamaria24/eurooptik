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
          title="Specialiștii Eurooptik în orașul tău"
          description="Selectează locația pentru a vedea echipa dedicată din fiecare clinică."
        />

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              filter === "all"
                ? "border-[#e4007f] bg-[#e4007f] text-white"
                : "border-[#ffd5ea] bg-white text-[#e4007f] hover:border-[#f7a6cf]"
            }`}
          >
            Toată echipa
          </button>
          {data.locations.map((location) => (
            <button
              key={location.filterId}
              onClick={() => setFilter(location.filterId)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                filter === location.filterId
                  ? "border-[#e4007f] bg-[#e4007f] text-white"
                  : "border-[#ffd5ea] bg-white text-[#e4007f] hover:border-[#f7a6cf]"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.slice(0, 12).map((member) => (
            <div key={member.name} className="card-animated overflow-hidden p-5">
              <div className="relative h-64 w-full overflow-hidden rounded-[1.6rem] bg-accent">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-3 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                  {roleTranslations[member.type] ?? member.type}
                </p>
                <h3 className="text-xl font-semibold text-slate-900">
                  {member.name}
                </h3>
                {member.specializations.length > 0 && (
                  <ul className="space-y-1 text-sm text-slate-600">
                    {member.specializations.map((spec) => (
                      <li key={spec}>• {spec}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length > 12 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Vezi toate profilurile în aplicația internă a clinicii.
          </p>
        )}
      </div>
    </section>
  );
}

