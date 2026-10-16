# Public frontend migration contract

Updated: 2026-10-14

## Evidence and scope

- Machine-readable route/API source: `../munich/apps/backoffice/docs/public-frontend-api-inventory.json`
- Visual baseline: `reference-screenshots.md`
- Source of public page data: `../munich/apps/frontend/src/Controller` and `../munich/packages/domain/src/Entity`
- Destination boundary: `lib/api.ts` and `types/`

This document covers only public read behaviour. Symfony remains responsible for administration, uploads, email, validation, abuse protection, and all writes until a separate secure API contract exists.

## Read API and field coverage

| Resource / endpoint | Public fields required by the current frontend | Current Next coverage | Contract status |
| --- | --- | --- | --- |
| `GET /api/v1/areas`, `/areas/{id}`, `/areas?slug=` | `id`, `name`, `slug`, `orientation`, `rocks`, `routes`, `sequence`, `online`, `image`, `headerImage`, `lat`, `lng`, `zoom`, `travelTimeMinutes`, `rockResponsibility`, `railwayStation`, `kletterkonzeption` | `fetchAreas`, `fetchAreaBySlug`; explicit `Area`, relation, coordinate, and railway-station types | Covered for all currently rendered public fields. |
| `GET /api/v1/rocks?area.id=`, `/rocks?slug=` | `id`, `area`, `name`, `slug`, `nr`, `zone`, `banned`, `height`, `orientation`, `season`, `childFriendly`, `sunny`, `rain`, `train`, `bike`, `image`, `previewImage`, `lat`, `lng`, `pathCoordinates`, `zoom`, `online` | `fetchRocks`, `fetchRocksForArea`; explicit `Rock`, API-reference, and path-coordinate types | Covered for all currently rendered public fields. A direct slug lookup remains an optional loader optimization. |
| `GET /api/v1/routes?area.id=`, `?rock.id=`, `?topoId=` | `id`, `name`, `area`, `rock`, `grade`, `gradeNo`, `scale`, `firstAscent`, `yearFirstAscent`, `protection`, `rating`, `topoId`, `nr`, `rockQuality`, `climbingStyle` | `fetchRoutesForArea`; explicit `Route` model and grade distributions | Covered for all currently rendered public fields. A rock-scoped loader remains an optional loader optimization. |
| `GET /api/v1/topos?rocks.id=` | `id`, `rocks`, `name`, `image`, `withSector`, `number`, `pathCollection`, `updatedAt` | `fetchToposForRock`, `TopoSummary` | Covered for the current topo rendering; validate drawing payload shape before parity sign-off. |
| `GET /api/v1/comments?route.rock.id=` | `id`, `route`, `comment`, `datetime`, author display name | `fetchCommentsForRock`; comments are grouped beneath their route in the rock table | Covered for the German rock page. |
| `GET /api/v1/rock_translations?rock.id=&locale=` | `id`, `rock`, `locale`, `description`, `access`, `nature`, `flowers` | `fetchRockTranslation`, `RockTranslationSummary`, `RockTranslationResult` | German renders its German record. English renders its exact record, deliberately falls back to the German record with a visible notice, or shows an explicit unavailable state. |
| `GET /api/v1/photos?belongsToRock.id=` | `id`, related area/rock/route, `name`, `description`, `photgrapher` | `fetchPhotosForRock` and the rock sheet gallery | Covered for the German rock page. |
| `GET /api/v1/videos?videoRocks.id=` | `id`, related area/rock/route, `videoLink` | `fetchVideosForRock` and the rock sheet video links | Covered for the German rock page. |
| `GET /api/v1/search` | name, grade, first-ascent, and legacy attributes: child-friendly, sun, rain protection, train, bike; pagination metadata | The search dialog proxies the structured `/api/v1/search` endpoint with no-store caching | Covered, pending result-for-result parity testing against Symfony. |
| `GET /api/v1/areas/{id}/top-routes` | Top-100 route rows: route/grade/first-ascent/quality fields plus `rockName`, `rockSlug`, `areaSlug`; selection metadata | `fetchTopRoutesForArea`, `AreaTopRoute`, `AreaTopRoutesDialog` | Covered. Backoffice owns selection: published-rock routes with `gradeNo`, ordered `gradeNo DESC`, then `name ASC`, limited to 100. |
| `GET /api/v1/rocks/{id}/railway-access` | `stationName`, five-minute-rounded `minutes`, `walk`/`bike` mode | `fetchRailwayAccessesForRock`, `RailwayAccess`, `RockInfoSheet` | Covered. Backoffice owns nearest-station selection and the existing Symfony calculation. |
| Computed Symfony data | Gallery image URL variants | `lib/media.ts` | Covered by the shared media utility. |

## Explicit migration work items

| ID | Priority | Work item | Completion condition |
| --- | --- | --- | --- |
| API-01 | P0 | **Complete.** Typed public models and loaders for comments, photos, and videos. | `types/public-content.ts` models their published fields and relationships; a rock page renders comments, gallery captions, and video links from API data. |
| API-02 | P0 | **Complete.** Explicit `Area`, `Rock`, and `Route` models with no `[key: string]: unknown` escape hatches. | Page components compile against explicit fields only. |
| API-03 | P0 | **Complete.** Defined locale fallback for rock translations. | German renders the German record; English prefers English, visibly falls back to German, or shows an explicit unavailable state. |
| API-04 | P0 | Adopt `GET /api/v1/search` for the client search dialog and return structured results only. | Implemented; result and pagination parity remains a route-level verification task. No `routesHtml` is consumed. |
| API-05 | P1 | **Complete.** Defined area Top-100 and rock railway-access contracts. | Backoffice endpoints delegate to the legacy selection/calculation services; Next renders the Top-100 list in that order and consumes typed railway estimates. |
| API-06 | P1 | Create a shared media URL utility for headers, previews, topo drawings, and gallery variants. | No page component builds upload URLs directly. |
| API-07 | P2 | **Complete.** Retain protected Symfony write flows during the transition. | [Protected write contract](protected-write-contract.md) assigns CSRF, anonymous-contribution limits, validation, moderation, and future API ownership; Next remains read-only. |

## Route and metadata parity

The complete route/status/canonical/title/description/JSON-LD inventory is maintained in the machine-readable JSON file named above. The Next route strategy must preserve the following P0 families before cutover:

| Current public route | Required Next outcome |
| --- | --- |
| `/`, `/en` | 200, locale-aware canonical/alternates, `WebSite` and `ItemList` JSON-LD |
| `/{area}`, `/en/{area}` | 200 or 404, locale-aware canonical, title and description from area/page content |
| `/{area}/{rock}`, `/en/{area}/{rock}` | 200 or 404, locale-aware canonical, title and description from rock/page content |
| `/search` | Interactive, not indexed, structured JSON response only |

## Acceptance criteria

These are the Phase 0 acceptance criteria for the later route-family checks. A check is complete only after comparison with the recorded desktop/mobile, light/dark Symfony baseline.

### Shared implementation status

- [x] Canonical URLs and Open Graph metadata are generated for the German home, area, rock, and legal routes.
- [x] `app/robots.ts` disallows API/search crawling and advertises the generated sitemap.
- [x] `app/sitemap.ts` publishes the home, legal, published-area, and published-rock URLs from the public API.
- [x] `app/not-found.tsx` and `app/error.tsx` provide accessible recovery states for unknown routes and rendering/API failures.
- [x] The German home emits the documented `WebSite` and `ItemList` JSON-LD.
- [x] Page data has a five-minute tagged revalidation policy; the interactive search proxy intentionally uses `no-store` and returns an explicit `503` response if its upstream is unavailable.
- [x] The local development loaders use the backoffice public API on port `8083`; port `8080` remains the Symfony visual baseline only.
- [x] Legacy `/Datenschutz` and `/Impressum` return verified permanent (`308`) redirects to their lower-case canonical URLs.
- [x] German and English P0 pages publish reciprocal `hreflang` links and localized sitemap alternates. English-only static/legal routes remain outside the current P0 route family and are not advertised as alternates.

- [x] Every known public route family, redirect, expected status, canonical behaviour, title/description source, and JSON-LD type is recorded.
- [x] Home, area, and rock desktop/mobile visual references exist for light and dark themes.
- [x] Every public read resource used by the current templates is mapped to current Next coverage or an explicit work item.
- [x] Unsupported content is recorded above; no field may be omitted silently during a page migration.
- [x] Static responsive smoke check: the German home, `/konstein`, and `/konstein/Burgstein` have no document horizontal overflow at `390 × 844` or `1440 × 900` in the local Next preview (2026-10-14).
- [x] Visual parity: intended layout, typography, imagery, theme colours, cards, and responsive hierarchy match the approved reference for each P0 route.
- [x] Keyboard/accessibility: landmarks, heading order, focus order, visible focus, dialogs/sheets, tabs, filters, maps, and search work with keyboard and screen readers. Verified on the German home, area, and rock P0 routes with the browser accessibility tree and keyboard interactions (2026-10-14).
- [x] Responsive: the P0 routes work at 390 px and 1440 px without horizontal overflow, clipped controls, or inaccessible off-screen content. Verified on the German home, `/konstein`, and `/konstein/burgstein` (2026-10-14); the horizontally scrollable topo rail keeps the focused tab in view.
- [x] Link integrity: all internal links resolve, external links have safe target semantics, and legacy URL changes use permanent redirects. Verified by crawling the rendered German home, `/konstein`, and `/konstein/burgstein` links; every new-window link has `noopener` or `noreferrer`, and `/Datenschutz` and `/Impressum` each return a single `308` to their lower-case canonical URL (2026-10-14).
- [x] SEO: title, meta description, canonical, `hreflang`, robots, Open Graph, sitemap, and JSON-LD match the documented public contract. German and English P0 home, area, and rock routes were verified on 2026-10-14, including reciprocal `hreflang`, Open Graph locale alternates, localized sitemap entries, and home `WebSite`/`ItemList` JSON-LD.
- [x] Performance: representative mobile Lighthouse comparisons against the Symfony baseline show no material LCP, CLS, JavaScript, or image-payload regression. See `performance-baseline.md` (2026-10-14).
- [x] Reliability: API failures have an intentional error/empty state; cached content revalidates within five minutes or via a later authenticated on-demand invalidation hook. All public page loaders now propagate transport and non-2xx failures to the retryable route error boundary; genuine empty API collections retain an explicit empty state. Fetches use a tagged five-minute (`300` second) revalidation policy, while search remains uncached and returns a visible `503` state on upstream failure (verified 2026-10-14).

## Phase 0 sign-off

Items 1–4 are complete. The criteria above are the proposed sign-off contract for item 5; route-level checks remain intentionally open until the relevant implementation phases are finished.
