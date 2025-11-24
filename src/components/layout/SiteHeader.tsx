"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Acasă", href: "#hero" },
  { label: "Servicii", href: "#services" },
  { label: "Echipă", href: "#team" },
  { label: "Testimoniale", href: "#testimonials" },
  { label: "Contact", href: "#locations" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[#fdfafc]/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="#hero" className="flex items-center gap-4">
          <Image
            src="/images/logo-small.png"
            alt="Eurooptik logo"
            width={130}
            height={36}
            priority
            className="hidden h-9 w-auto sm:block"
          />
          <Image
            src="/images/logo-small.png"
            alt="Eurooptik logo"
            width={110}
            height={30}
            priority
            className="sm:hidden"
          />
        </Link>

        <nav className="hidden items-center gap-4 rounded-full border border-rose-50 bg-white/90 px-5 py-2 shadow-sm lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="#appointment"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:bg-primary-strong"
          >
            Programări online
          </Link>
        </div>

        <button
          className="rounded-full border border-rose-200 p-2 text-rose-500 lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open navigation"
        >
          <span className="block h-0.5 w-5 bg-rose-500" />
          <span className="mt-1 block h-0.5 w-5 bg-rose-500" />
          <span className="mt-1 block h-0.5 w-5 bg-rose-500" />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#appointment"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-primary px-5 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-strong"
            >
              Programează-te
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

