import type { Document } from "@contentful/rich-text-types";
import type {
  BlogArticle,
  LandingData,
  PricingTable,
  ReelsPayload,
  ResearchArticle,
  ServicesPayload,
  SpecializationsPayload,
  Sponsor,
  TeamPayload,
  Testimonial,
} from "./types";

const richText = (text: string): Document => ({
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
      data: {},
      content: [
        {
          nodeType: "text",
          value: text,
          marks: [],
          data: {},
        },
      ],
    },
  ],
});

export const mockTeam: TeamPayload = {
  members: [
    {
      name: "Dr. Oana Ionescu",
      role: "Chirurg oftalmolog",
      image: "/images/hero.png",
      specializations: ["Chirurgie cataractă", "Lentile intraoculare"],
      categories: ["bacau-clinica"],
      type: "doctor",
    },
    {
      name: "Dr. Vlad Stoica",
      role: "Oftalmolog pediatric",
      image: "/images/website-image.png",
      specializations: ["Screening copii", "Ortokeratologie"],
      categories: ["bacau", "moinesti"],
      type: "doctor",
    },
    {
      name: "Alexandra Radu",
      role: "Optometrist",
      image: "/images/logo-full.png",
      specializations: ["Adaptare lentile de contact", "Plusoptix"],
      categories: ["bacau"],
      type: "optometrist",
    },
    {
      name: "Irina Marinescu",
      role: "Manager clinică",
      image: "/images/logo-small.png",
      specializations: ["Coordonare echipe", "Experiență pacienți"],
      categories: ["bacau-clinica", "moinesti"],
      type: "manager",
    },
  ],
  locations: [
    { name: "Clinica Bacău", filterId: "bacau-clinica" },
    { name: "Cabinet Bacău", filterId: "bacau" },
    { name: "Cabinet Moinești", filterId: "moinesti" },
  ],
};

export const mockServices: ServicesPayload = {
  categories: [
    {
      slug: "chirurgie",
      name: "Chirurgie oculară",
      groups: [
        {
          title: "Operații cataractă",
          items: [
            { name: "Facoemulsificare cu LIO premium", price: 4800 },
            { name: "Control post-operator complet", price: 350 },
          ],
        },
        {
          title: "Laser terapeutic",
          items: [
            { name: "Iridotomie laser", price: 1200 },
            { name: "Capsulotomie YAG", price: 950 },
          ],
        },
      ],
    },
    {
      slug: "pediatrie",
      name: "Oftalmologie pediatrică",
      groups: [
        {
          title: "Consultații copii",
          items: [
            { name: "Consultație completă pediatrie", price: 280 },
            { name: "Control miopie progresivă", price: 220 },
          ],
        },
        {
          title: "Ortokeratologie",
          items: [
            { name: "Adaptare lentile orto-k", price: 900 },
            { name: "Monitorizare trimestrială", price: 320 },
          ],
        },
      ],
    },
  ],
};

export const mockTestimonials: Testimonial[] = [
  {
    id: "mock-testimonial-1",
    author: "Maria Bălan",
    quote:
      "După operația de cataractă am revenit la activitățile zilnice în doar câteva zile. Echipa a fost impecabilă.",
    imageUrl: "/images/logo-small.png",
  },
  {
    id: "mock-testimonial-2",
    author: "George Petrescu",
    quote:
      "Echipa Eurooptik m-a ajutat să îmi țin sub control glaucomul și mi-a explicat fiecare pas din tratament.",
    imageUrl: "/images/logo-full.png",
  },
];

export const mockBlogArticles: BlogArticle[] = [
  {
    title: "Protocol modern pentru chirurgia cataractei",
    slug: "protocol-cataracta",
    doctors: ["Dr. Oana Ionescu"],
    serviceName: "Chirurgie oculară",
    content: richText(
      "Explicăm etapele pregătirii preoperatorii, alegerea lentilei intraoculare și monitorizarea postoperatorie pentru pacienții cu cataractă.",
    ),
  },
  {
    title: "Cum controlăm miopia în adolescență",
    slug: "controlul-miopiei",
    doctors: ["Dr. Vlad Stoica"],
    serviceName: "Oftalmologie pediatrică",
    content: richText(
      "Educație vizuală, lentile speciale și ortokeratologie pentru a încetini progresia miopiei la pacienții tineri.",
    ),
  },
];

export const mockPricing: PricingTable = {
  "bacau-clinica": {
    "consultatie-standard": 250,
    "consultatie-complexa": 320,
    "consultatie-premium": 420,
  },
  bacau: {
    "consultatie-standard": 220,
    premium: 380,
  },
  moinesti: {
    standard: 200,
    complexa: 290,
  },
};

export const mockSpecializations: SpecializationsPayload = {
  categories: [
    { id: "cat-chirurgie", name: "Chirurgie", slug: "chirurgie" },
    { id: "cat-pediatrie", name: "Pediatrie", slug: "pediatrie" },
  ],
  specializations: [
    {
      slug: "cataracta",
      cardTitle: "Cataractă & LIO premium",
      cardImage: "/images/specializations/cataracta.jpg",
      categorySlug: "chirurgie",
      articleTitle: "Ce înseamnă operația personalizată",
      articleDescription: richText(
        "Selectăm lentila intraoculară în funcție de stilul de viață și folosim topografie pentru a calcula dioptriile finale cu precizie.",
      ),
      articleImage: "/images/specializations/cataracta-article.jpg",
      testimonialId: mockTestimonials[0].id,
      testimonialQuote: mockTestimonials[0].quote,
      testimonialAuthorImage: mockTestimonials[0].imageUrl,
      articles: [
        {
          title: mockBlogArticles[0].title,
          slug: mockBlogArticles[0].slug,
          categorySlug: "chirurgie",
        },
      ],
    },
    {
      slug: "pediatrie",
      cardTitle: "Oftalmologie pediatrică",
      cardImage: "/images/specializations/ortokeratologie.jpg",
      categorySlug: "pediatrie",
      articleTitle: "Controlul miopiei la copii",
      articleDescription: richText(
        "Programul include consultații trimestriale, ateliere pentru părinți și tehnologii de monitorizare a refracției.",
      ),
      articleImage: "/images/specializations/ortokeratologie-article.jpg",
      testimonialId: mockTestimonials[1].id,
      testimonialQuote: mockTestimonials[1].quote,
      testimonialAuthorImage: mockTestimonials[1].imageUrl,
      articles: [
        {
          title: mockBlogArticles[1].title,
          slug: mockBlogArticles[1].slug,
          categorySlug: "pediatrie",
        },
      ],
    },
  ],
};

export const mockResearchArticles: ResearchArticle[] = [
  {
    title: "Impactul luminii albastre asupra somnului la elevi",
    slug: "lumina-albastra-somn",
    content: richText(
      "Studiul analizează 120 de elevi și arată că filtrarea luminii albastre reduce oboseala oculară cu 36% după două săptămâni.",
    ),
  },
  {
    title: "Compararea lentilelor EDOF și monofocale",
    slug: "edof-vs-monofocale",
    content: richText(
      "În cadrul Eurooptik am comparat recuperarea vizuală la 80 de pacienți, iar rezultatele favorizează lentilele EDOF pentru activități digitale.",
    ),
  },
];

export const mockReels: ReelsPayload = {
  reels: [
    {
      id: "reel-1",
      title: "Recuperarea după operația de cataractă",
      videoUrl:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      doctorName: "Dr. Oana Ionescu",
      doctorSlug: "oana-ionescu",
      categoryName: "Chirurgie",
      categorySlug: "chirurgie",
    },
    {
      id: "reel-2",
      title: "Exerciții pentru controlul miopiei",
      videoUrl:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      doctorName: "Dr. Vlad Stoica",
      doctorSlug: "vlad-stoica",
      categoryName: "Pediatrie",
      categorySlug: "pediatrie",
    },
  ],
  doctors: [
    { name: "Dr. Oana Ionescu", slug: "oana-ionescu" },
    { name: "Dr. Vlad Stoica", slug: "vlad-stoica" },
  ],
  categories: [
    { name: "Chirurgie", slug: "chirurgie" },
    { name: "Pediatrie", slug: "pediatrie" },
  ],
};

export const mockSponsors: Sponsor[] = [
  {
    id: "sponsor-1",
    name: "Zeiss Vision",
    description: "Partener tehnologic pentru implanturi intraoculare premium.",
    logoUrl: "/images/logo-full.png",
    websiteUrl: "https://www.zeiss.com/",
  },
  {
    id: "sponsor-2",
    name: "EssilorLuxottica",
    description: "Susține programele de screening pediatric și ortokeratologie.",
    logoUrl: "/images/logo-small.png",
    websiteUrl: "https://www.essilorluxottica.com/",
  },
];

export const mockLandingData: LandingData = {
  team: mockTeam,
  services: mockServices,
  testimonials: mockTestimonials,
  blog: mockBlogArticles,
  pricing: mockPricing,
  specializations: mockSpecializations,
  research: mockResearchArticles,
  reels: mockReels,
  sponsors: mockSponsors,
};


