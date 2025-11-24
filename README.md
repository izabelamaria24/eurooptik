## Eurooptik – Next.js rebuild

Modernized version of the Eurooptik landing experience built with the App Router in Next.js 16, Tailwind CSS v4 and live data pulled straight from Contentful. The legacy HTML/CSS/JS bundle has been removed entirely – this project is now the canonical source of truth for the marketing site and article pages.

### Tech stack

- **Next.js 16** with the app directory, React Server Components and TypeScript
- **Tailwind CSS 4 beta** for design tokens and utility-first styling
- **Contentful Delivery API** for services, team, blog, specializations, research, reels, sponsors etc.
- **Next API route** that proxies Google Places ratings so secrets stay on the server

### Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to preview the site locally. All sections (hero, specialități, servicii, echipă, tarife, blog, cercetare, reels, sponsori, locații, programări) are rendered via React components fed with server-fetched data.

### Environment variables

Create a `.env.local` file in the project root with the following values:

```
CONTENTFUL_SPACE_ID=xxxx
CONTENTFUL_ACCESS_TOKEN=xxxx
GOOGLE_PLACES_API_KEY=optional-but-recommended
```

- The Contentful credentials should use a CDA token with read access only.
- `GOOGLE_PLACES_API_KEY` is optional; without it the hero review badge simply hides itself.

### Available scripts

| Command         | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Starts the Next.js dev server                  |
| `npm run build` | Creates a production build                     |
| `npm run start` | Serves the production build                    |
| `npm run lint`  | Lints the project with the default Next config |

### Content model expectations

The rebuild mirrors the previous Contentful structure:

- `team`, `locatie`, `serviciu`, `categorieServiciu`, `testimonial`, `articol`, `tarif`, `categorieSpecialitate`, `specialitate`, `articolCercetareStiintifica`, `reel`, `sponsor`
- Rich text fields are rendered with `@contentful/rich-text-react-renderer`
- Image assets are loaded via the built-in `next/image` optimizer

If a locale is missing data the respective section gracefully hides itself.

### Deployment

`npm run build` produces a static/SSR hybrid bundle compatible with Vercel or any Node.js host. Make sure the Contentful + Google env vars are configured in your hosting provider before deploying.
