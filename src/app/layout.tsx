import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${inter.variable} antialiased bg-sand text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
