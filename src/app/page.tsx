import { getLandingData } from "@/lib/contentful";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { SpecializationsSection } from "@/components/sections/SpecializationsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { ReelsSection } from "@/components/sections/ReelsSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { AppointmentSection } from "@/components/sections/AppointmentSection";

export const revalidate = 60 * 60;

export default async function Home() {
  const data = await getLandingData();

  return (
    <div className="min-h-screen bg-sand text-slate-900">
      <SiteHeader />
      <main>
        <HeroSection />
        <SpecializationsSection data={data.specializations} />
        <ServicesSection data={data.services} />
        <TeamSection data={data.team} />
        <PricingSection data={data.pricing} />
        <TestimonialsSection data={data.testimonials} />
        <BlogSection data={data.blog} />
        <ResearchSection data={data.research} />
        <ReelsSection data={data.reels} />
        <SponsorsSection data={data.sponsors} />
        <LocationsSection />
        <AppointmentSection />
      </main>
      <SiteFooter />
    </div>
  );
}
