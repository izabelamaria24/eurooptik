import Image from "next/image";
import Link from "next/link";
import { GoogleReviewBadge } from "./GoogleReviewBadge";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden min-h-[80vh] py-28"
    >
      <div className="hero-grid-bg" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-10 mx-auto h-[520px] w-[520px] rounded-full bg-rose-200/35 blur-[200px]" />
        <div className="absolute inset-x-0 bottom-10 mx-auto h-[520px] w-[520px] rounded-full bg-secondary/30 blur-[180px]" />
      </div>

      <div className="section-shell relative z-10 flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center fade-slide">
        <Image
          src="/images/logo-full.png"
          alt="Clinica Eurooptik"
          width={920}
          height={253}
          priority
          className="w-full max-w-[920px]"
        />

        <div className="flex w-full max-w-[820px] flex-col items-center gap-3 sm:hidden">
          <Link
            href="#appointment"
            className="w-full rounded-full bg-primary px-6 py-2.5 text-center text-base font-semibold text-white shadow-xl shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-strong"
          >
            Programează-te Online
          </Link>
          <Link
            href="#specializations"
            className="w-full rounded-full border border-rose-200 bg-white/80 px-6 py-2.5 text-center text-base font-semibold text-rose-500 transition hover:border-rose-400 hover:text-rose-600"
          >
            Specialitățile Noastre
          </Link>
          <div className="w-full">
            <GoogleReviewBadge variant="card" />
          </div>
        </div>

        <div className="hidden w-full max-w-[820px] sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <Link
            href="#appointment"
            className="rounded-full bg-primary px-8 py-3 text-center text-lg font-semibold text-white shadow-xl shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-strong"
          >
            Programează-te Online
          </Link>
          <div className="shrink-0">
            <GoogleReviewBadge variant="chip" />
          </div>
          <Link
            href="#specializations"
            className="rounded-full border border-rose-200 bg-white/80 px-8 py-3 text-center text-lg font-semibold text-rose-500 transition hover:border-rose-400 hover:text-rose-600"
          >
            Specialitățile Noastre
          </Link>
        </div>
      </div>
    </section>
  );
}
