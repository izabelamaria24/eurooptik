"use client";

import { useMemo, useState } from "react";
import type { PricingTable } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { clinicLocations } from "@/lib/locations";

type Props = {
  data: PricingTable;
};

const consultations = [
  {
    label: "Consultație Standard",
    priceKeys: ["consultatie-standard", "standard"],
    features: ["stabilire dioptrii", "tensiune oculară", "fund de ochi"],
  },
  {
    label: "Consultație Complexă",
    priceKeys: ["consultatie-complexa", "consultatie-complexă", "complexa"],
    features: [
      "stabilire dioptrii",
      "tensiune oculară",
      "fund de ochi",
      "screening glaucom",
    ],
  },
  {
    label: "Consultație Premium",
    priceKeys: ["consultatie-premium", "premium"],
    features: [
      "stabilire dioptrii",
      "tensiune oculară",
      "fund de ochi",
      "screening glaucom",
      "monitorizare cataractă",
    ],
  },
];

export function PricingSection({ data }: Props) {
  const availableLocations = Object.keys(data);
  const [activeLocation, setActiveLocation] = useState(
    availableLocations[0] ?? "bacau-clinica",
  );

  const activePrices = useMemo(() => data[activeLocation] ?? {}, [data, activeLocation]);

  return (
    <section id="pricing">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Tarife"
          title="Planuri transparente pentru fiecare clinică"
          description="Selectează locația pentru a vedea tarifele practicate de echipa locală."
        />

        <div className="mb-8 flex flex-wrap gap-3">
          {clinicLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => setActiveLocation(location.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeLocation === location.id
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {consultations.map((consultation) => {
            const price =
              consultation.priceKeys
                .map((key) => activePrices[key])
                .find((value) => typeof value !== "undefined") ?? null;
            return (
              <div key={consultation.label} className="card flex flex-col p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                {activeLocation.replace("-", " ")}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {consultation.label}
              </h3>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                    {price ? `RON ${price}` : "La cerere"}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {consultation.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <div className="mt-auto pt-4">
                <a
                  href="#appointment"
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-primary hover:text-primary"
                >
                  Programează-te
                </a>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

