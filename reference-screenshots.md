# Symfony frontend visual baseline

Captured on 2026-10-13 from the current local Symfony frontend at `http://localhost:8080`.

These references are the visual acceptance baseline for the Next.js migration. They intentionally show the current frontend as it behaves today, including the compact mobile navigation, card layouts, grade strips, and topo tab overflow. The Symfony debug toolbar and browser-only cookie prompt are excluded from the acceptance criteria.

## Capture matrix

| ID | Route | Theme | Viewport | Primary reference points |
| --- | --- | --- | --- | --- |
| `home-desktop-light` | `/` | light | desktop default | Header with menu/search/settings; two-column area cards; sidebar topo and recent-routes cards. |
| `home-desktop-dark` | `/` | dark | desktop default | Same desktop structure; black page/card surfaces with preserved chart colours and image contrast. |
| `area-desktop-light` | `/Konstein` | light | desktop default | Area hero, compact title/info control, filter row, rock cards and grade strips. |
| `area-desktop-dark` | `/Konstein` | dark | desktop default | Dark area list, filter controls, card borders, and grade-strip contrast. |
| `rock-desktop-light` | `/Konstein/Burgstein` | light | desktop default | Rock hero and breadcrumb, topo navigation, drawn topo image, route list. |
| `rock-desktop-dark` | `/Konstein/Burgstein` | dark | desktop default | Dark rock surface while retaining image/topo legibility. |
| `home-mobile-light` | `/` | light | `390 × 844` | Compact menu/search/settings header; one-column image-first area cards. |
| `home-mobile-dark` | `/` | dark | `390 × 844` | Same mobile card hierarchy and readable chart/metadata colours. |
| `area-mobile-light` | `/Konstein` | light | `390 × 844` | Area title/info over hero, compact filters beneath, image-left rock cards. |
| `area-mobile-dark` | `/Konstein` | dark | `390 × 844` | Dark filter/card/grade-strip treatment. |
| `rock-mobile-light` | `/Konstein/Burgstein` | light | `390 × 844` | Mobile hero, breadcrumb, horizontally scrollable topo tabs, topo image and routes. |
| `rock-mobile-dark` | `/Konstein/Burgstein` | dark | `390 × 844` | Same mobile rock hierarchy in dark mode. |

## Notes for implementation

- Treat the desktop capture viewport as the browser’s normal desktop window, not a fixed design breakpoint. Use the `390 × 844` capture for mobile regression checks.
- Hero images, topo drawings, and grade colours are content-bearing; preserve their crop, aspect ratio, and contrast in both themes.
- On mobile, the controls must remain touch-sized and the topo tabs must scroll horizontally instead of wrapping or truncating route sectors.
- The Next.js implementation should not reproduce local-only UI such as Symfony’s debug toolbar or the cookie prompt as part of page layout.
- The visual goal is parity of hierarchy and behaviour, not reproducing accidental whitespace, image-loading glitches, or development-only artefacts.
