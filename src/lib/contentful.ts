/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";
import { createClient } from "contentful";
import type { Document } from "@contentful/rich-text-types";
import type {
  BlogArticle,
  LandingData,
  PricingTable,
  Reel,
  ReelsPayload,
  ResearchArticle,
  ServiceCategory,
  ServiceGroup,
  ServicesPayload,
  SpecializationArticleLink,
  SpecializationCard,
  SpecializationsPayload,
  Sponsor,
  TeamPayload,
  Testimonial,
} from "./types";
import {
  mockBlogArticles,
  mockLandingData,
  mockPricing,
  mockReels,
  mockResearchArticles,
  mockServices,
  mockSpecializations,
  mockSponsors,
  mockTeam,
  mockTestimonials,
} from "./mockData";

const hasContentfulCredentials =
  Boolean(process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN);

const getClient = cache(() => {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!space || !token) {
    throw new Error(
      "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN environment variables.",
    );
  }

  return createClient({
    space,
    accessToken: token,
  });
});

const assetUrl = (asset?: { fields?: { file?: { url?: string } } }) =>
  asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : "";

const slugify = (value?: string | number | null) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

const isRichTextDocument = (content: Document | undefined): content is Document =>
  Boolean(content && content.nodeType === "document");

export async function fetchTeam(locale = "ro"): Promise<TeamPayload> {
  if (!hasContentfulCredentials) {
    return mockTeam;
  }
  const client = getClient();

  const [teamRes, locationRes] = await Promise.all([
    client.getEntries({
      content_type: "team",
      include: 3,
      locale,
    }),
    client.getEntries({
      content_type: "locatie",
      order: "fields.idFiltru",
      locale,
    }),
  ]);

  const teamFields = teamRes.items[0]?.fields as any;

  const collectMembers = (list: any[] | undefined, type: string) =>
    (list || [])
      .map((entry) => {
        const fields = entry?.fields;
        if (!fields) return null;
        const categories = []
          .concat(fields.categorie)
          .filter(Boolean)
          .map((item: any) => item.fields?.idFiltru?.toString())
          .filter(Boolean);
        return {
          name: fields.nume || "",
          role: fields.titlu || "",
          image: assetUrl(fields.fotografie),
          specializations: fields.specializari || [],
          categories,
          type,
        };
      })
      .filter(Boolean);

  const members = [
    ...collectMembers(teamFields?.listaDoctori, "doctor"),
    ...collectMembers(teamFields?.listaAsistenteMedicale, "asistenta-medicala"),
    ...collectMembers(teamFields?.listaInfirmiere, "infirmiera"),
    ...collectMembers(teamFields?.listaConsilieri, "consilier"),
    ...collectMembers(teamFields?.listaManageri, "manager"),
    ...collectMembers(teamFields?.listaOptometristi, "optometrist"),
  ];

  const locations =
    locationRes.items.map((item) => ({
      name: (item.fields as any).numeLocatie,
      filterId: (item.fields as any).idFiltru?.toString(),
    })) ?? [];

  return {
    members,
    locations,
  };
}

export async function fetchServices(locale = "ro"): Promise<ServicesPayload> {
  if (!hasContentfulCredentials) {
    return mockServices;
  }
  const client = getClient();

  const [servicesRes, categoriesRes] = await Promise.all([
    client.getEntries({
      content_type: "serviciu",
      include: 2,
      limit: 1000,
      locale,
    }),
    client.getEntries({
      content_type: "categorieServiciu",
      order: "fields.idServiciu",
      locale,
    }),
  ]);

  const categoryMeta = new Map<
    string,
    {
      slug: string;
      name: string;
      groups: Map<string, ServiceGroup>;
    }
  >();

  categoriesRes.items.forEach((item) => {
    const fields = item.fields as any;
    const slug = fields.idServiciu?.toString();
    if (!slug) return;
    categoryMeta.set(slug, {
      slug,
      name: fields.numeCategorieServiciu,
      groups: new Map(),
    });
  });

  servicesRes.items.forEach((item) => {
    const fields = item.fields as any;
    const categorySlug = fields.categorie?.fields?.idServiciu?.toString();
    if (!categorySlug) return;
    const category = categoryMeta.get(categorySlug);
    if (!category) return;

    const groupName =
      fields.subcategorie?.fields?.numeSubcategorieServiciu || "Servicii";
    const currentGroup =
      category.groups.get(groupName) ||
      ({ title: groupName, items: [] } as ServiceGroup);
    currentGroup.items.push({
      name: fields.numeServiciu,
      price: fields.pretServiciu ?? null,
    });
    category.groups.set(groupName, currentGroup);
  });

  const categories: ServiceCategory[] = Array.from(categoryMeta.values()).map(
    ({ slug, name, groups }) => ({
      slug,
      name,
      groups: Array.from(groups.values()).map((group) => ({
        ...group,
        items: group.items.sort((a, b) => a.name.localeCompare(b.name)),
      })),
    }),
  );

  return { categories };
}

export async function fetchArticles(locale = "ro"): Promise<BlogArticle[]> {
  if (!hasContentfulCredentials) {
    return mockBlogArticles;
  }
  const client = getClient();
  const articleRes = await client.getEntries({
    content_type: "articol",
    include: 3,
    locale,
  });

  const articles: BlogArticle[] = articleRes.items
    .map((entry) => {
      const fields = entry.fields as any;
      const serviceName = fields.serviciu?.fields?.numeServiciu;
      if (!serviceName) return null;
      const content = fields.continutArticol as Document | undefined;
      return {
        title: fields.denumireArticol,
        slug: fields.slug,
        doctors: (fields.doctori || []).map((doc: any) => doc.fields?.nume),
        serviceName,
        content: isRichTextDocument(content) ? content : null,
      };
    })
    .filter(Boolean);

  return articles;
}

export async function fetchTestimonials(locale = "ro"): Promise<Testimonial[]> {
  if (!hasContentfulCredentials) {
    return mockTestimonials;
  }
  const client = getClient();
  const res = await client.getEntries({
    content_type: "testimonial",
    limit: 12,
    order: "-sys.createdAt",
    locale,
  });

  return res.items
    .map((item) => {
      const fields = item.fields as any;
      const imageUrl = fields.pozaTestimonial?.fields?.file?.url
        ? `https:${fields.pozaTestimonial.fields.file.url}?w=500&h=500&fit=thumb`
        : "";
      if (!fields.numeClient || !fields.continutTestimonial || !imageUrl) {
        return null;
      }
      return {
        id: item.sys.id,
        author: fields.numeClient,
        quote: fields.continutTestimonial,
        imageUrl,
      };
    })
    .filter(Boolean);
}

export async function fetchPricing(locale = "ro"): Promise<PricingTable> {
  if (!hasContentfulCredentials) {
    return mockPricing;
  }
  const client = getClient();
  const res = await client.getEntries({
    content_type: "tarif",
    include: 2,
    limit: 1000,
    locale,
  });

  return res.items.reduce<PricingTable>((acc, item) => {
    const fields = item.fields as any;
    const locationName = fields.locatie?.fields?.numeLocatie;
    const consultationType = fields.tipConsultatie?.fields?.tipConsultatie;
    const price = fields.pret;
    const locationKey = slugify(locationName);
    const consultKey = slugify(consultationType);
    if (!locationKey || !consultKey) return acc;
    if (!acc[locationKey]) acc[locationKey] = {};
    acc[locationKey][consultKey] = price;
    return acc;
  }, {});
}

export async function fetchSpecializations(
  locale = "ro",
): Promise<SpecializationsPayload> {
  if (!hasContentfulCredentials) {
    return mockSpecializations;
  }
  const client = getClient();

  const [categoryRes, specRes] = await Promise.all([
    client.getEntries({
      content_type: "categorieSpecialitate",
      order: "fields.idFiltru",
      locale,
    }),
    client.getEntries({
      content_type: "specialitate",
      include: 3,
      order: "sys.createdAt",
      locale,
    }),
  ]);

  const categories = categoryRes.items.map((item) => {
    const fields = item.fields as any;
    return {
      id: fields.idFiltru?.toString(),
      name: fields.numeCategorieSpecialitate,
      slug: slugify(fields.numeCategorieSpecialitate),
    };
  });

  const specializations = specRes.items
    .map((item) => {
      const fields = item.fields as any;
      if (!fields.numeSpecialitate || !fields.categorieSpecialitate?.fields) {
        return null;
      }
      const articles: SpecializationArticleLink[] = (fields.articles || [])
        .map((article: any) => {
          if (
            !article?.fields?.denumireArticol ||
            !article?.fields?.slug ||
            !article?.fields?.serviciu?.fields?.categorie?.fields?.idServiciu
          ) {
            return null;
          }
          return {
            title: article.fields.denumireArticol,
            slug: article.fields.slug,
            categorySlug:
              article.fields.serviciu.fields.categorie.fields.idServiciu.toString(),
          };
        })
        .filter(Boolean);

      const articleDescription = fields.descriereSpecialitate as Document;

      return {
        slug: slugify(fields.numeSpecialitate),
        cardTitle: fields.numeSpecialitate,
        cardImage: assetUrl(fields.pozaSpecialitate),
        categorySlug: slugify(
          fields.categorieSpecialitate.fields.numeCategorieSpecialitate,
        ),
        articleTitle: fields.titluSpecialitate,
        articleDescription: isRichTextDocument(articleDescription)
          ? articleDescription
          : null,
        articleImage: assetUrl(fields.pozaSpecialitate),
        testimonialId: fields.testimonial?.sys?.id ?? null,
        testimonialQuote: fields.testimonial?.fields?.continutTestimonial ?? null,
        testimonialAuthorImage: assetUrl(
          fields.testimonial?.fields?.pozaTestimonial,
        ),
        articles,
      } as SpecializationCard;
    })
    .filter(Boolean);

  return { categories, specializations };
}

export async function fetchResearch(locale = "ro"): Promise<ResearchArticle[]> {
  if (!hasContentfulCredentials) {
    return mockResearchArticles;
  }
  const client = getClient();
  const res = await client.getEntries({
    content_type: "articolCercetareStiintifica",
    include: 1,
    locale,
  });

  return res.items
    .map((item) => {
      const fields = item.fields as any;
      if (!fields.titlu || !fields.slug) return null;
      return {
        title: fields.titlu,
        slug: fields.slug,
        content: isRichTextDocument(fields.continutArticol)
          ? fields.continutArticol
          : null,
      };
    })
    .filter(Boolean);
}

export async function fetchReels(locale = "ro"): Promise<ReelsPayload> {
  if (!hasContentfulCredentials) {
    return mockReels;
  }
  const client = getClient();
  const res = await client.getEntries({
    content_type: "reel",
    include: 2,
    locale,
  });

  const reels: Reel[] = res.items
    .map((item) => {
      const fields = item.fields as any;
      const videoUrl = assetUrl(fields.linkVideo);
      if (
        !videoUrl ||
        !fields.doctor?.fields?.nume ||
        !fields.categorie?.fields?.slug
      ) {
        return null;
      }
      const doctorName = fields.doctor.fields.nume;
      const doctorSlug = slugify(doctorName);
      return {
        id: item.sys.id,
        title: fields.titlu || "",
        videoUrl,
        doctorName,
        doctorSlug,
        categoryName: fields.categorie.fields.numeCategorieReel,
        categorySlug: fields.categorie.fields.slug,
      };
    })
    .filter(Boolean);

  const unique = <T extends { slug: string }>(items: T[]) =>
    Array.from(new Map(items.map((item) => [item.slug, item])).values());

  return {
    reels,
    doctors: unique(
      reels.map((reel) => ({
        name: reel.doctorName,
        slug: reel.doctorSlug,
      })),
    ),
    categories: unique(
      reels.map((reel) => ({
        name: reel.categoryName,
        slug: reel.categorySlug,
      })),
    ),
  };
}

export async function fetchSponsors(locale = "ro"): Promise<Sponsor[]> {
  if (!hasContentfulCredentials) {
    return mockSponsors;
  }
  const client = getClient();
  const res = await client.getEntries({
    content_type: "sponsor",
    include: 1,
    locale,
    order: "sys.createdAt",
  });

  return res.items
    .map((item) => {
      const fields = item.fields as any;
      if (!fields.nume || !fields.logo?.fields?.file?.url) return null;
      return {
        id: item.sys.id,
        name: fields.nume,
        description: fields.descriere || "",
        logoUrl: assetUrl(fields.logo),
        websiteUrl: fields.linkWebsite || null,
      };
    })
    .filter(Boolean);
}

export async function getLandingData(locale = "ro"): Promise<LandingData> {
  if (!hasContentfulCredentials) {
    return mockLandingData;
  }
  const [
    team,
    services,
    testimonials,
    blog,
    pricing,
    specializations,
    research,
    reels,
    sponsors,
  ] = await Promise.all([
    fetchTeam(locale),
    fetchServices(locale),
    fetchTestimonials(locale),
    fetchArticles(locale),
    fetchPricing(locale),
    fetchSpecializations(locale),
    fetchResearch(locale),
    fetchReels(locale),
    fetchSponsors(locale),
  ]);

  return {
    team,
    services,
    testimonials,
    blog,
    pricing,
    specializations,
    research,
    reels,
    sponsors,
  };
}

export async function getArticleBySlug(
  slug: string,
  locale = "ro",
): Promise<BlogArticle | null> {
  if (!hasContentfulCredentials) {
    return mockBlogArticles.find((article) => article.slug === slug) ?? null;
  }
  const client = getClient();
  const res = await client.getEntries({
    content_type: "articol",
    "fields.slug": slug,
    include: 3,
    limit: 1,
    locale,
  });

  const item = res.items[0];
  if (!item) return null;
  const fields = item.fields as any;
  return {
    title: fields.denumireArticol,
    slug: fields.slug,
    doctors: (fields.doctori || []).map((doc: any) => doc.fields?.nume),
    serviceName: fields.serviciu?.fields?.numeServiciu || "",
    content: isRichTextDocument(fields.continutArticol)
      ? fields.continutArticol
      : null,
  };
}

export async function getResearchBySlug(
  slug: string,
  locale = "ro",
): Promise<ResearchArticle | null> {
  if (!hasContentfulCredentials) {
    return mockResearchArticles.find((article) => article.slug === slug) ?? null;
  }
  const client = getClient();
  const res = await client.getEntries({
    content_type: "articolCercetareStiintifica",
    "fields.slug": slug,
    include: 1,
    limit: 1,
    locale,
  });
  const item = res.items[0];
  if (!item) return null;
  const fields = item.fields as any;
  return {
    title: fields.titlu,
    slug: fields.slug,
    content: isRichTextDocument(fields.continutArticol)
      ? fields.continutArticol
      : null,
  };
}

