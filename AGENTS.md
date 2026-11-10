<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Frontend component conventions

- Use the shared shadcn/ui-style primitives under `components/ui` for interactive controls.
- Use shadcn/ui Tabs for tab menus and section navigation, adapting the shared primitives to Next.js while preserving their visual states and keyboard behavior.
- For topo section navigation, follow the current implementation in `../munich/apps/frontend/templates/components/page/rock-topo-tabs.html.twig`: transparent default Tabs list, black active tab with white text, black bottom border, visible keyboard focus, and horizontally scrollable tabs on narrow screens.
- Preserve the existing client/server component boundary: keep page data and markup server-rendered, and isolate scroll state or event handlers in a small Client Component.
