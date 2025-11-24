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

      <div className="section-shell relative z-10 flex min-h-[70vh] flex-col items-center justify-center gap-10 text-center fade-slide">
        <Image
          src="/images/logo-full.png"
          alt="Clinica Eurooptik"
          width={560}
          height={160}
          priority
          className="w-full max-w-[640px]"
        />

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="#appointment"
            className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-white shadow-xl shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-strong"
          >
            Rezervă o consultație
          </Link>
          <Link
            href="#specializations"
            className="rounded-full border border-rose-200 bg-white/80 px-8 py-3 text-base font-semibold text-rose-500 transition hover:border-rose-400 hover:text-rose-600"
          >
            Specialitățile noastre
          </Link>
        </div>

        <GoogleReviewBadge variant="card" />
      </div>
    </section>
  );
}
