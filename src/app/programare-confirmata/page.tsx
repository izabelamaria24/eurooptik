import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { clinicLocations } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Programare Confirmată",
  description:
    "Programarea dumneavoastră a fost înregistrată cu succes. Vă așteptăm cu drag la clinica Eurooptik!",
};

export default function ProgramareConfirmata() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Minimal navbar – logo only */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-[90px] max-w-6xl items-center px-4 md:h-[90px]">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-full.png"
              alt="Eurooptik"
              width={200}
              height={50}
              priority
              className="h-[45px] w-auto max-sm:h-[35px]"
            />
          </Link>
        </div>
      </header>

      {/* Success message */}
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 pb-20 pt-16 text-center">
        <div className="mb-8 text-[80px] leading-none text-green-500 max-sm:text-[60px]">
          ✓
        </div>

        <h1 className="mb-8 text-[32px] font-bold leading-tight text-slate-800 max-sm:text-2xl">
          Programare Confirmată!
        </h1>

        <p className="mx-auto mb-12 max-w-[700px] text-lg leading-relaxed text-slate-500 max-sm:text-base">
          Vă mulțumim! Programarea dumneavoastră a fost înregistrată cu succes.
          <br />
          Vă așteptăm cu drag la clinică!
        </p>

        <Link
          href="/"
          className="border-2 border-primary px-10 py-4 text-sm font-semibold uppercase tracking-[1.5px] text-primary transition-all hover:bg-primary hover:text-white hover:shadow-[0_5px_15px_rgba(228,0,127,0.4)] max-sm:px-4 max-sm:py-3 max-sm:text-xs"
        >
          Înapoi la Pagina Principală
        </Link>
      </main>

      {/* Simplified footer – locations + logo */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-wrap justify-center gap-8 text-center text-sm text-slate-600 md:justify-between md:text-left">
            {clinicLocations.map((location) => (
              <div key={location.id}>
                <p className="font-bold text-slate-800">{location.name}</p>
                <p>{location.schedule}</p>
                <p>{location.address}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center pb-10">
          <Image
            src="/images/logo-small.png"
            alt="Eurooptik logo"
            width={180}
            height={50}
            className="h-auto w-[180px]"
          />
        </div>
      </footer>
    </div>
  );
}
