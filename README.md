# Eurooptik Web Platform

Production marketing and editorial platform for Eurooptik, built with Next.js App Router.

The application renders a data-driven homepage plus article detail pages from Contentful, and enriches social proof content using Google Places.

## 1. Technical Overview

- Framework: Next.js 16 (App Router) + React 19 + TypeScript
- Styling: Tailwind CSS 4
- CMS: Contentful Content Delivery API
- External integrations: Google Places API (ratings + optional review text import)
- Rendering model: hybrid SSR/ISR/static generation depending on route

Core capabilities:
- Data-driven homepage sections (team, services, pricing, blog, research, reels, sponsors, testimonials)
- Static article routes for blog and research pages
- Server-only API endpoint for Google review badge data
- Graceful fallback to local mock data when Contentful credentials are not configured

## 2. Architecture

High-level flow:

1. App routes in src/app call server-side data functions from src/lib/contentful.ts.
2. Contentful responses are transformed into strongly typed UI payloads from src/lib/types.ts.
3. Homepage sections in src/components/sections consume those payloads.
4. Google Places data is fetched server-side:
	 - src/app/api/google-reviews/route.ts returns best-location rating snapshot.
	 - src/lib/googleReviews.ts can replace testimonial text with fresh 5-star review text.

Important behavior:
- If CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN is missing, homepage/article data comes from src/lib/mockData.ts.
- If GOOGLE_PLACES_API_KEY is missing, the Google reviews endpoint returns null values (non-breaking fallback).
- If GOOGLE_TESTIMONIALS_PLACE_ID is missing, testimonial text enrichment is skipped.

## 3. Routing and Rendering Strategy

| Route | Purpose | Rendering strategy |
| --- | --- | --- |
| / | Main marketing landing page | ISR with revalidate = 3600s |
| /blog/[slug] | Blog article detail | Pre-generated static params via Contentful, dynamicParams = false |
| /research/[slug] | Research article detail | Pre-generated static params via Contentful, dynamicParams = false |
| /programare-confirmata | Appointment confirmation page | Static route |
| /api/google-reviews | Google rating/review count endpoint | Server route, external API fetch cached with revalidate = 86400s |

Notes:
- Blog and research detail pages call notFound() for unknown slugs.
- Layout metadata is configured centrally in src/app/layout.tsx (Open Graph included).

## 4. Contentful Data Contracts

Primary content types currently consumed:
- team
- locatie
- serviciu
- categorieServiciu
- testimonial
- articol
- tarif
- categorieSpecialitate
- specialitate
- articolCercetareStiintifica
- reel
- sponsor

Transformation layer:
- src/lib/contentful.ts maps raw Contentful fields to strict app-level models.
- src/lib/types.ts defines domain payloads used by section components.

Key payload groups:
- TeamPayload
- ServicesPayload
- PricingTable
- SpecializationsPayload
- ReelsPayload
- LandingData (aggregate homepage payload)

## 5. Google Places Integration

There are two separate integrations:

1. Homepage review badge endpoint
- File: src/app/api/google-reviews/route.ts
- Reads a fixed list of Eurooptik location Place IDs.
- Fetches rating + userRatingCount and returns the highest-ranked location.
- Returns status 200 with null fields when API key is missing or fetch fails.

2. Testimonial text enrichment
- File: src/lib/googleReviews.ts
- Reads reviews for one configurable place (GOOGLE_TESTIMONIALS_PLACE_ID).
- Filters only 5-star reviews with text.
- Replaces testimonial quote text when Contentful testimonials are rendered.
- Cached for 30 days via Next fetch revalidation.

## 6. Project Structure

Top-level:
- src/app: routes, layouts, API handlers
- src/components/layout: global header/footer
- src/components/sections: homepage section components
- src/components/ui: shared UI primitives
- src/lib: data fetching, typed contracts, static helper datasets
- public/images: static assets

Entry points:
- src/app/page.tsx: homepage composition and section ordering
- src/app/layout.tsx: global metadata, base styles, root layout
- src/lib/contentful.ts: data access and transformation layer

## 7. Environment Configuration

Create .env.local in project root:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_cda_token
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_TESTIMONIALS_PLACE_ID=your_place_id_for_testimonial_texts
```

Variable reference:

| Variable | Required | Used by | Behavior if missing |
| --- | --- | --- | --- |
| CONTENTFUL_SPACE_ID | Yes for live CMS | src/lib/contentful.ts | Uses local mock data |
| CONTENTFUL_ACCESS_TOKEN | Yes for live CMS | src/lib/contentful.ts | Uses local mock data |
| GOOGLE_PLACES_API_KEY | Optional | src/app/api/google-reviews/route.ts and src/lib/googleReviews.ts | Badge endpoint returns nulls; testimonial enrichment disabled |
| GOOGLE_TESTIMONIALS_PLACE_ID | Optional | src/lib/googleReviews.ts | Testimonial enrichment disabled |

Security guidance:
- Use Contentful CDA read-only token.
- Do not expose private keys in client-side code.
- Configure environment variables in hosting platform settings for production.

## 8. Local Development

Prerequisites:
- Node.js 20+
- npm 10+

Install and run:

```bash
npm install
npm run dev
```

App URL: http://localhost:3000

## 9. Available Scripts

| Command | Description |
| --- | --- |
| npm run dev | Start local Next.js development server |
| npm run build | Build production bundle |
| npm run start | Run production server from build output |
| npm run lint | Run ESLint checks |

## 10. Build, Deploy, and Operations

Build command:

```bash
npm run build
```

Deployment targets:
- Vercel (recommended)
- Any Node.js runtime compatible with Next.js 16

Repository-specific deployment note:
- vercel.json defines redirects for /cpanel and /webmail.

Operational checks before deploy:
1. Confirm all required environment variables are set.
2. Run npm run lint.
3. Run npm run build.
4. Verify homepage, blog slug pages, research slug pages, and /api/google-reviews response.

## 11. Caching and Revalidation Summary

- Homepage ISR interval: 3600 seconds
- Google reviews route fetch interval: 86400 seconds
- Google testimonials review text fetch interval: 30 days

This balances content freshness with reduced API load.

## 12. Troubleshooting

Symptoms and likely causes:

- Empty or mocked homepage content in production:
	- CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN is missing/invalid.

- Review badge shows no rating:
	- GOOGLE_PLACES_API_KEY missing, invalid, or API quota issue.

- Testimonials do not include Google review text:
	- GOOGLE_TESTIMONIALS_PLACE_ID missing or place has no valid 5-star text reviews.

- Images not loading from CMS:
	- Ensure remote hosts are allowed in next.config.ts (images.ctfassets.net and related domains).
