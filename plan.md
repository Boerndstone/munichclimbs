# Munichclimbs frontend migration plan

## Purpose

Move the public frontend from `munich/apps/frontend` to this Next.js project while preserving the current Munichclimbs look, URLs, content, behaviour, accessibility, and search visibility.

This plan is intentionally limited to the public frontend. Symfony remains the source of truth and continues to provide its API, uploads, administration, image processing, email, and any backend-only jobs. We will not delete or alter `munich/apps/frontend` until the Next.js replacement is live and verified.

## Current position

### Source: `munich/apps/frontend`

The current frontend provides:

- home page with area cards, map, latest topo/routes, closures, and support content;
- area list pages (`/{area}`) with area information, map, rock filters, grade bars, and rock cards;
- rock pages (`/{area}/{rock}`) with hero, topo drawings, route lists, route comments, gallery, maps, access/nature content, and contribution flows;
- global navigation, search, themes, locale switching, footer, privacy/legal pages, grade comparisons, and latest-routes page;
- canonical URLs, metadata, JSON-LD, translations, redirects, and sitemap support.

### Destination: `munichclimbs`

The project already has Next.js App Router, TypeScript, Tailwind 4, shadcn-compatible primitives, Lucide, Leaflet/React Leaflet, and initial implementations for home, area, rock, navigation, maps, search, cards, topoes, and legal pages. It already reads the public Symfony API at `https://www.munichclimbs.de/api/v1`.

This means the work is a controlled parity migration and refinement—not a blank rebuild.

## Principles and decisions

1. **API first.** Next.js consumes public Symfony API endpoints; it does not connect directly to the Symfony database.
2. **Route parity before redesign.** Existing public URLs must resolve in Next.js before a production switch. Visual improvements can follow only when they do not reduce parity.
3. **Reuse the current design system.** Keep the existing Inter and Chelsea Market brand fonts, theme colours, spacing, card style, Lucide icons, and shadcn primitives. Do not copy Symfony Twig or Stimulus code into React.
4. **Server-render data by default.** Use React Server Components and Next cache/revalidation for page data. Use client components only for interaction: dialogs, filters, maps, tabs, gallery, theme, and search.
5. **No big-bang launch.** Implement, compare, test, and release one route family at a time. Keep the Symfony frontend available as rollback until the cutover has settled.
6. **German and English remain first-class.** The migration must model locale routes and translated metadata/content explicitly rather than treating English as a later feature.

## Route and feature inventory

| Current route family | Next.js target | Priority | Notes |
| --- | --- | --- | --- |
| `/`, `/en` | `app/page.tsx`, locale route strategy | P0 | Existing home page is a useful base but needs visual/data parity review. |
| `/{area}`, `/en/{area}` | `app/[slug]/page.tsx` plus locale equivalent | P0 | Existing area page is the first candidate for parity work. |
| `/{area}/{rock}`, `/en/{area}/{rock}` | `app/[slug]/[rockSlug]/page.tsx` plus locale equivalent | P0 | Existing rock page needs the broadest parity audit. |
| `/search` | `app/api/search/route.ts` and search dialog | P0 | Preserve name, grade, first-ascent, and attribute searches. |
| `/neuesteRouten`, `/en/latest-routes` | dedicated route | P1 | Preserve table, filters/pagination, metadata. |
| `/Impressum`, `/en/impressum` | existing legal route, locale equivalent | P1 | Port locale content exactly. |
| `/Datenschutz`, `/en/privacy` | existing legal route, locale equivalent | P1 | Port locale content exactly. |
| grade comparisons | dedicated static routes | P2 | Preserve redirects from old URLs. |
| gallery data, photo upload, improvements/contact | API-backed flow or temporary Symfony endpoint | P2 | Define ownership before moving forms. |

## Implementation phases

### Phase 0 — Establish the migration contract

**Progress:** Route/API inventory and the desktop/mobile light/dark visual baseline are complete. See `../munich/apps/backoffice/docs/public-frontend-api-inventory.json` and `reference-screenshots.md`.

1. Make a machine-readable route inventory from the Symfony controllers, including every German/English URL, redirect, HTTP status, canonical URL, title, description, and JSON-LD type.
2. Capture desktop and mobile reference screenshots for the home page, one area page, and one rock page in both themes.
3. List every public API endpoint and field used by the Symfony templates, then compare it with `lib/api.ts` and the current TypeScript types.
4. Record unsupported fields or endpoints as explicit API work items; do not silently omit content.
5. Agree on acceptance criteria: visual parity where intentional, keyboard usability, responsive layouts, no broken links, equivalent metadata, and acceptable performance budgets.

**Deliverable:** `docs/migration-inventory.md` and a checked list of parity requirements.

### Phase 1 — Make the shared shell visually identical

1. Port the Inter and Chelsea Market font files/licensing configuration into `public/fonts` or a suitable Next font setup.
2. Align `app/globals.css` tokens with the current frontend’s `app.css` and `global.scss`: colours, radii, shadows, typography, dark theme, and the scoped `.typeset` treatment for long-form content.
3. Finish the site header: home link, menu/sheet, search trigger, theme switch, language switch, settings controls, and focus handling.
4. Implement the footer and shared legal/navigation links.
5. Replace any remaining placeholder assets, default Next icons, and hard-coded sample text.

**Acceptance:** Every route can use the common shell without global CSS collisions or layout shifts.

### Phase 2 — Stabilise the data layer and content model

1. Split `lib/api.ts` into focused modules for areas, rocks, routes, topoes, search, content, and media.
2. Validate API responses at the boundary (for example with Zod) and normalise API Platform/Hydra collections in one place.
3. Complete TypeScript types for all fields rendered on home, area, and rock pages: translations, closures, facilities, maps, comments, topoes, galleries, route grades, and access information.
4. Set deliberate caching and revalidation per resource. Use tags and on-demand revalidation when the backend can notify Next; otherwise retain short, safe revalidation windows.
5. Make image URL construction a single utility so image sizes, fallbacks, and Next image configuration remain consistent.

**Acceptance:** Page components never parse raw Hydra responses or construct media URLs ad hoc.

### Phase 3 — Complete the home page

1. Compare the existing `app/page.tsx` and components against `templates/frontend/index.html.twig` feature by feature.
2. Bring area cards, grade charts, map dialog, closures, latest topo, latest routes, support card, responsive grid, and loading states to parity.
3. Add route metadata, JSON-LD, canonical/alternate locale links, and sitemap entries.
4. Optimise images and map loading so the map is deferred until requested where possible.

**Acceptance:** The home page matches the current public site’s content and interaction on desktop/mobile, without requiring Symfony-rendered HTML.

### Phase 4 — Complete area pages

1. Finalise the compact area header introduced in the current Symfony frontend: area title, information menu, map access, Kletterkonzeption, Top 100 routes, and filter controls in one responsive card.
2. Port the filter behaviour as a small client component: child-friendly, sun, rain shelter, train, and train+bike. Keep filtering local to already-rendered rock data unless data size proves that server filtering is necessary.
3. Match rock list cards, previews, grade strips, seasonal closure indicators, links, and accessible live result count.
4. Port the area map, including custom Lucide-derived parking/rock markers and the red dotted parking-to-rock path.
5. Add empty, loading, error, and no-result states.

**Acceptance:** `/{area}` is visually and functionally equivalent to the Symfony version at all breakpoints, including keyboard and touch use.

### Phase 5 — Complete rock pages

1. Match the rock hero, breadcrumb, rock information sheet, information sections, and mobile navigation behaviour.
2. Port topoes, drawing overlays, route grouping/tabs, grade display preference, route parameter icons, route information dialogs, comments, video links, and accessibility semantics.
3. Port rock/parking maps and their custom markers. Ensure Leaflet is client-only and does not affect server rendering.
4. Port gallery/lightbox behaviour with a React-compatible library or a small, accessible dialog implementation; do not carry over old browser-global gallery code.
5. Implement seasonal closure, access/nature/flower content, map, and contribution sections.

**Acceptance:** A representative rock with multiple topoes, comments, gallery images, closure data, and maps has no missing content or broken interaction.

### Phase 6 — Search, navigation, locale, and preferences

1. Rebuild the global search dialog and API route with the current modes: name, grades, first ascent, and attribute filters, including pagination where needed.
2. Implement lazy area/rock navigation using API data and React state/cache instead of the Symfony HTML endpoint.
3. Implement a locale strategy (`/en/...` parity or a locale segment architecture with redirects) and locale-aware route helpers.
4. Persist theme and grade-display preferences with accessible controls and no flash of the incorrect theme.
5. Add prefetching only where it improves real navigation; avoid eager prefetching of image-heavy rock pages.

**Acceptance:** Search and navigation have the same results, routes, preferences, and keyboard behaviour as the current frontend.

### Phase 7 — Static, form, and integration pages

1. Port latest routes, legal pages, grade comparisons, and static informational pages.
2. Decide each interactive form’s temporary owner:
   - keep Symfony as a dedicated API/form endpoint;
   - expose a secure backend API designed for Next; or
   - defer the frontend until the backend contract is ready.
3. Preserve CSRF, upload validation, rate limiting, email delivery, and spam protection. Never move these concerns into browser-only code.
4. Implement cookie consent with the same privacy choices and document any legal wording changes for review.

**Acceptance:** All public links and essential contribution flows work or redirect deliberately, with no hidden dependency on Twig pages.

### Phase 8 — SEO, accessibility, performance, and quality

1. Generate `sitemap.xml`, robots rules, canonical URLs, `hreflang` alternates, Open Graph/Twitter metadata, and JSON-LD from Next.js.
2. Audit headings, landmarks, dialogs, menu buttons, focus traps, contrast, reduced motion, keyboard navigation, and screen-reader announcements.
3. Set image `sizes`, priority only for LCP images, lazy-load maps/gallery code, and measure JavaScript/image payloads.
4. Add automated coverage for URL helpers, API normalisation, grade/filter logic, and critical route rendering; add browser checks for home/area/rock/search paths.
5. Compare Lighthouse/mobile performance with the production Symfony frontend and resolve regressions before launch.

**Acceptance:** No critical accessibility issues, no broken structured data, and no material performance regression on representative mobile connections.

### Phase 9 — Cutover and retirement

1. Deploy Next.js to a staging hostname with production API read access and noindex protection.
2. Run a route-by-route parity checklist, crawl internal links, and test real devices and browsers.
3. Configure hosting/reverse-proxy routing so public frontend requests reach Next.js while `/api`, admin/backoffice, uploads, and backend jobs continue to reach Symfony.
4. Add permanent redirects for every changed route; monitor 404s, API errors, Web Vitals, search-console reports, and user feedback.
5. Keep the Symfony frontend rollback path for an agreed observation period. Only then remove obsolete Symfony frontend templates, assets, controllers, and build tooling in a separate, reviewed cleanup change.

**Acceptance:** Next.js serves all public frontend routes in production; Symfony continues to serve only backend/API responsibilities required by the product.

## Suggested execution order

1. Phase 0: inventory and acceptance criteria.
2. Phases 1–2: shell and dependable data layer.
3. Phase 4: area pages first, since this is the page currently being refined and most of its destination structure already exists.
4. Phase 5: rock pages.
5. Phase 3: home-page parity refinements.
6. Phases 6–8: cross-cutting features and hardening.
7. Phase 9: staged release and only then legacy cleanup.

## Definition of complete

The Next.js project is the public frontend only when every P0 route has parity, all public URLs and SEO signals are preserved, no client-side interaction depends on Symfony-rendered HTML, backend responsibilities remain secure and owned by Symfony/API services, monitoring shows a stable cutover, and a tested rollback path has expired.
