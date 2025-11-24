import type { Document } from "@contentful/rich-text-types";

export type TeamLocation = {
  name: string;
  filterId: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  specializations: string[];
  categories: string[];
  type: string;
};

export type TeamPayload = {
  members: TeamMember[];
  locations: TeamLocation[];
};

export type ServiceEntry = {
  name: string;
  price: number | string | null;
};

export type ServiceGroup = {
  title: string;
  items: ServiceEntry[];
};

export type ServiceCategory = {
  slug: string;
  name: string;
  groups: ServiceGroup[];
};

export type ServicesPayload = {
  categories: ServiceCategory[];
};

export type Testimonial = {
  id: string;
  author: string;
  quote: string;
  imageUrl: string;
};

export type BlogArticle = {
  title: string;
  slug: string;
  doctors: string[];
  serviceName: string;
  content: Document | null;
};

export type PricingTable = Record<string, Record<string, number>>;

export type SpecializationArticleLink = {
  title: string;
  slug: string;
  categorySlug: string;
};

export type SpecializationCard = {
  slug: string;
  cardTitle: string;
  cardImage: string;
  categorySlug: string;
  articleTitle: string;
  articleDescription: Document | null;
  articleImage: string;
  testimonialId: string | null;
  testimonialQuote: string | null;
  testimonialAuthorImage: string | null;
  articles: SpecializationArticleLink[];
};

export type SpecializationCategory = {
  id: string;
  name: string;
  slug: string;
};

export type SpecializationsPayload = {
  categories: SpecializationCategory[];
  specializations: SpecializationCard[];
};

export type ResearchArticle = {
  title: string;
  slug: string;
  content: Document | null;
};

export type Reel = {
  id: string;
  title: string;
  videoUrl: string;
  doctorName: string;
  doctorSlug: string;
  categoryName: string;
  categorySlug: string;
};

export type OptionItem = {
  name: string;
  slug: string;
};

export type ReelsPayload = {
  reels: Reel[];
  doctors: OptionItem[];
  categories: OptionItem[];
};

export type Sponsor = {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl?: string | null;
};

export type LandingData = {
  team: TeamPayload;
  services: ServicesPayload;
  testimonials: Testimonial[];
  blog: BlogArticle[];
  pricing: PricingTable;
  specializations: SpecializationsPayload;
  research: ResearchArticle[];
  reels: ReelsPayload;
  sponsors: Sponsor[];
};

