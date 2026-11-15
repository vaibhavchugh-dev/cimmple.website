# Cimmple website

React 19 + Vite company website with 51 pre-rendered routes. Original Cimmple content organized around services, industries, solutions, dedicated teams, and insights. Hospitality is excluded. No product catalogue, invented client logos, testimonials, certifications, or completed-project claims.

## Local setup

Requires Node.js 22.12+ (Node 24 recommended).

```bash
npm ci
npm run dev
```

For the fully rendered production preview:

```bash
npm run build
npm run check
npm run preview
```

Open http://localhost:4173. Development mode uses Vite's client rendering; `dist/` contains the SEO-ready pre-rendered HTML.

## Production deployment

Deploy the contents of `dist/` to a static host with directory index support. Do not configure an SPA fallback to the homepage: unknown URLs must return HTTP 404 using `404.html`. Redirect HTTP to HTTPS and choose one canonical hostname. Redirect paths without trailing slashes to the corresponding slash path with 301/308. A sample Nginx config is included.

Set build environment variables on the hosting platform:

```text
SITE_URL=https://cimmple.com
SEO_INDEXABLE=true
```

Then run `npm ci && npm run build && npm run check`. Environment settings are read from the build process. `.env.example` documents all settings; if using a local `.env` file, explicitly export `SITE_URL` and `SEO_INDEXABLE` before building, since the Node pre-render script does not automatically load `.env`.

For previews, leave `SEO_INDEXABLE` unset or false. All preview pages receive `noindex,follow`. On production, empty resource sections and the draft privacy notice remain noindex. The sitemap lists content pages and excludes empty resource pages, privacy, and 404. Submit `/sitemap.xml` to Google Search Console after deployment and verify indexing and Core Web Vitals. Rankings are not guaranteed.

## SEO included

- Full page content in HTML before JavaScript runs
- Unique page titles and descriptions, one H1 per page
- Canonical URLs and social title/description tags
- Organization, WebSite, WebPage/Article, and BreadcrumbList JSON-LD
- Crawlable links and per-route URLs
- Generated sitemap and robots.txt
- Custom 404 document and production preview server with actual 404 status
- Preview noindex protection and empty-section noindex
- Responsive CSS, keyboard focus, skip link, semantic headings

`public/og-image.svg` is an editable artwork source. Export it as a 1200×630 PNG/JPEG and add `og:image` and `twitter:image` in `scripts/prerender.mjs` before launch for reliable image previews; social cards currently use text metadata only.

## Editing content

- `src/content.js`: service/industry descriptions, route definitions, articles
- `src/App.jsx`: reusable page templates, navigation, form
- `src/styles.css`: styling and responsive breakpoints
- `scripts/prerender.mjs`: HTML metadata, JSON-LD, sitemap, robots
- `scripts/check.mjs`: generated HTML and link checks

Rebuild after editing content. Industry and solution pages describe potential capabilities, not verified past engagements. Solutions and industry pages should be enriched with distinct approved business detail as the company content matures. Case studies, events, webinars, and news have honest empty states until approved material exists.

## Contact form

The form is disabled until `VITE_CONTACT_ENDPOINT` is configured at build time. The endpoint must accept JSON `{name,email,company,message,website}` and return a successful 2xx response only after accepting an enquiry. No API keys belong in VITE variables: these are public client values. The backend must implement input validation, rate limits, appropriate CORS, spam protection, and privacy/retention handling. The hidden website field is only a basic honeypot.

Before accepting enquiries, replace the draft privacy notice with business-approved information and publish verified company contact details. The project does not invent an email address or postal address. No backend service, database, email delivery, or analytics is included.

## Verification

`npm run check` validates all generated routes for unique metadata, one H1, canonical tags, structured data presence, internal links, sitemap entries, and Hospitality exclusion. CI builds both preview and production indexing configurations. Browser layout and accessibility should also be checked on target devices before launch.

## Scope

Home; About; six service pages; eight industry pages; eight solution pages; nine dedicated-team pages; technology ecosystem; three original articles; blog and insights hubs; resource sections; careers; contact; privacy; and 404. No live domain changes are made by this repository.
