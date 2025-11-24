import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eurooptik.ro"),
  title: {
    default: "Eurooptik | Clinici oftalmologice integrate",
    template: "%s | Eurooptik",
  },
  description:
    "Rețea de clinici oftalmologice moderne din Moldova. Servicii premium, echipă multidisciplinară și programe de cercetare medicală.",
  openGraph: {
    title: "Eurooptik | Clinici oftalmologice integrate",
    description:
      "Servicii oftalmologice complete, echipă multidisciplinară și programe de cercetare medicală.",
    url: "https://eurooptik.ro",
    siteName: "Eurooptik",
    images: [
      {
        url: "/images/website-image.png",
        width: 1200,
        height: 630,
        alt: "Eurooptik branding",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sand text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
