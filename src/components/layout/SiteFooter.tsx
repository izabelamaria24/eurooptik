import Link from "next/link";
import Image from "next/image";
import { clinicLocations, footerLinks } from "@/lib/locations";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/60 bg-white/80">
      <div className="section-shell py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo-full.png"
                alt="Eurooptik"
                width={220}
                height={60}
                className="w-full max-w-[220px]"
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              O echipă multidisciplinară care acoperă atât servicii clinice, cât
              și programe de cercetare și educație medicală.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Locații
            </p>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              {clinicLocations.map((location) => (
                <div key={location.id}>
                  <p className="font-semibold text-slate-800">
                    {location.name}
                  </p>
                  <p>{location.address}</p>
                  <p>{location.schedule}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Navigație rapidă
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-medium text-slate-700 transition hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="#appointment"
                className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-strong"
              >
                Programează-te online
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Eurooptik. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
}
