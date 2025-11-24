import { clinicLocations } from "@/lib/locations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import Image from "next/image";

export function LocationsSection() {
  return (
    <section id="locations">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Contact"
          title="Alege cea mai apropiată clinică"
          description="Cabinetele noastre sunt localizate în Bacău, Comănești, Onești și Moinești."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {clinicLocations.map((location) => (
            <div key={location.id} className="card overflow-hidden">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                  {location.name}
                </p>
              </div>
              <div className="space-y-2 px-5 py-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{location.address}</p>
                <p>{location.schedule}</p>
                <p>
                  Telefon:{" "}
                  <a
                    href={`tel:${location.phone}`}
                    className="font-semibold text-primary"
                  >
                    {location.phone}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${location.email}`}
                    className="font-semibold text-primary"
                  >
                    {location.email}
                  </a>
                </p>
                <Link
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Deschide în Google Maps →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

