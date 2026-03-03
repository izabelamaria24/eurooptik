import { SectionHeading } from "@/components/ui/SectionHeading";

export function AppointmentSection() {
  return (
    <section id="appointment" className="bg-white">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Programări"
          title="Programează-te online"
          description="Conectează-te la platforma noastră și alege ziua potrivită pentru consultația oftalmologică dorită."
        />

        <div className="card overflow-hidden">
          <iframe
            src="https://eurooptik.ro.programarionline.sophtha.com/"
            title="Programare online Eurooptik"
            className="h-[600px] w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

