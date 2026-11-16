# Cimmple website

React 19 + Vite company website with 47 pre-rendered routes. Original Cimmple content organized around services, industries, solutions, dedicated teams, and insights. Hospitality is excluded. No product catalogue, invented client logos, testimonials, certifications, or completed-project claims.

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

Then run `npm ci && npm run build && npm run check`. Environment settings are read from the build process and Vite production environment files. Copy `.env.example` to `.env` for local configuration. Process environment values take precedence.

For previews, leave `SEO_INDEXABLE` unset or false. All preview pages receive `noindex,follow`. On production, empty resource sections and the draft privacy notice remain noindex. The sitemap lists content pages and excludes empty resource pages, privacy, and 404. Submit the sitemap for the final canonical deployment to Google Search Console after deployment and verify indexing and Core Web Vitals. Rankings are not guaranteed.

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

The supplied Cimmple logo is included as the social preview image, with matching 525×476 Open Graph dimensions and Twitter image metadata. Fonts and illustrations are bundled locally; no external image or font service is needed at runtime.

## Editing content

- `src/content.js`: route definitions, summary descriptions, articles
- `src/serviceDetails.js`: service-specific overview, challenges, capabilities, approach, outcomes, FAQs
- `src/industryDetails.js`: industry context, sector needs, challenges, and related solution links
- `src/solutions.js`: independent business-system capabilities, workflows, integrations, and FAQs
- `src/teamDetails.js`: focused team scope, roles, and use cases
- `src/App.jsx`: reusable page templates, navigation, form
- `src/styles.css`: styling and responsive breakpoints
- `scripts/prerender.mjs`: HTML metadata, JSON-LD, sitemap, robots
- `scripts/check.mjs`: generated HTML and link checks

Rebuild after editing content. Industry and solution pages describe potential capabilities, not verified past engagements. Industry pages explain the business context and capabilities; solution pages explain distinct workflows, scope, and how records move through the process. Resource pages include editorial context and clear current publication status. Client-specific stories, schedules, and announcements require approved factual material.

## Contact form

The form is disabled until `VITE_CONTACT_ENDPOINT` is configured at build time. The endpoint must accept JSON `{name,email,company,message,website}` and return a successful 2xx response only after accepting an enquiry. No API keys belong in VITE variables: these are public client values. The backend must implement input validation, rate limits, appropriate CORS, spam protection, and privacy/retention handling. The hidden website field is only a basic honeypot.

Before accepting enquiries, replace the draft privacy notice with business-approved information and publish verified company contact details. The project does not invent an email address or postal address. No backend service, database, email delivery, or analytics is included.

## Verification

`npm run check` validates all generated routes for unique metadata, one H1, canonical tags, parseable structured data, social image metadata, internal links and anchor targets, local assets, detailed page sections, noindex exclusions, sitemap entries, and Hospitality exclusion. CI builds both preview and production indexing configurations. Browser layout and accessibility should also be checked on target devices before launch.

## Scope

Home; About; six service pages; six industry pages; six solution pages; nine dedicated-team pages; technology ecosystem; three original articles; blog and insights hubs; resource sections; careers; contact; privacy; and 404. No live domain changes are made by this repository.


## Visual direction and content depth

The revised design uses a black hero, cyan-to-purple accents, original particle artwork, a five-column desktop mega-menu, rounded framework panels, a service matrix, focused team sections, technology groups, industry cards, solution examples, and editorial cards. Detail pages include a sticky section menu, overview, challenges, approach, capabilities or solution workflows, delivery principles, intended outcomes, related insights, and FAQs. All text and vector artwork are original to this project; reference-company logos, client histories, copied articles, and proprietary images are not included.

Responsive layouts are implemented for desktop, tablet, and mobile breakpoints. Desktop pages and menu interactions were inspected in the browser. A physical mobile-device review and a complete accessibility audit remain recommended before public launch.

The contact backend, verified company email/address, approved privacy policy, client evidence, and confirmed event details remain deployment inputs. No live-domain deployment is included.


## Industries and Solutions

Industries describe who the website serves: Manufacturing; Healthcare; Retail & E-commerce; Logistics & Transportation; Financial Services & Insurance; SaaS. Each sector page explains business context and links to relevant system capabilities.

Solutions describe what Cimmple builds: ERP & Business Management; Inventory & Warehouse Management; E-commerce Platforms; Logistics Management System; Reporting & Analytics; Workflow Automation & System Integration. Each solution has its own overview, capabilities, workflow, integration points, intended business value, FAQs, and links back to relevant industries. Solution pages are no longer generated from industry records.

The menu, homepage, collection pages, internal links, metadata, and sitemap use these separate content models. Superseded local routes are removed from the build and return the normal 404 when served. No live-domain redirect rules are added because this project has not been deployed to that domain. Medical / Pharma ERP, Optical, Jewellery, and Hospitality are excluded.


## Cimmple logo

`public/brand/cimmple-logo.png` is the supplied transparent PNG, preserved without recoloring or modification. Header and footer use the logo alongside the company name. A white badge keeps the navy mark visible on the dark header. The same asset is used for the favicon, touch icon, Organization structured-data logo, and social preview image. Change displayed dimensions in CSS rather than changing the original asset.


## Deploying to cimmple.com/newdesign/

The build must match the deployment folder. A build for `/` references root-level assets and cannot simply be moved into `/newdesign/`.

```bash
npm ci
npm run build:newdesign
npm run preview
```

Open `http://localhost:4173/newdesign/` for the built preview. Upload **everything inside `dist/`** into the existing server folder `newdesign/`. The supplied archive also contains a top-level `newdesign/` directory with those files already built. Do not create `newdesign/dist/`, and do not upload only `index.html`: assets, brand, visuals, page directories, and other build files must travel together.

`build:newdesign` sets `SITE_BASE_PATH=/newdesign/` and disables indexing for this preview copy. CSS, fonts, logos, image URLs, links, client route resolution, metadata, and the sitemap all respect the same prefix. The `robots.txt` in this folder is only a generated copy; robots directives are read at the domain root. Do not overwrite the existing root site's robots file as part of a preview upload.

When the new website is ready to replace the root site, use `npm run build:root` and upload the resulting `dist/` contents to the domain root. This profile uses `/` and enables production indexing, retaining page-specific exclusions. Any other folder can be configured through `SITE_BASE_PATH` followed by `npm run build`. Root and `/newdesign/` are separate builds: never mix their generated assets or HTML.

The host must serve static CSS/JS/image/font files with the correct MIME types, resolve nested directories to `index.html`, and return a real 404 for unknown URLs. Clear stale HTML caches or use a hard refresh after replacing the files. A server-wide rewrite must not intercept existing files in the newdesign folder. No FTP or server changes have been performed by this project update.
