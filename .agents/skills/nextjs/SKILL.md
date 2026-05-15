---
name: nextjs
description: Next.js App Router guidance for delivery-app admin-web. Use for apps/admin-web, Next.js 16, Turbopack, routing, Server/Client Components, caching, testing, or production build issues. Always verify version-sensitive facts with Next DevTools MCP official docs before changing code.
---

# Next.js Admin Web

This is a repo-local routing skill for `apps/admin-web`. It does not replace
the official Next.js docs or the Build Web Apps plugin.

## Required Workflow

1. Run `next-devtools.init` at the start of any Next.js work.
2. Read `nextjs-docs://llms-index`, then query the exact official docs path
   with `nextjs_docs`.
3. Use `nextjs_index` and `nextjs_call` when a Next.js dev server is running.
4. Use browser automation for rendered-page verification, hydration issues,
   runtime errors, and user flows.
5. Keep changes aligned with `apps/admin-web/AGENTS.md` and root `AGENTS.md`.

## delivery-app Baseline

- Package manager: Bun.
- Monorepo runner: Nx.
- App: `apps/admin-web`.
- Next.js 16 baseline uses Turbopack. Do not add Webpack overrides without an
  approved ADR.
- Prefer Next.js standard configuration over custom wrappers.
- Keep generated API client usage aligned with `packages/api-client`.
- Treat HTTP/API responses as authoritative; realtime events are assistive only.

## Turbopack Rules

- Next.js 16 official docs state Turbopack is the default bundler.
- This repo keeps explicit `--turbopack` in admin-web scripts for a clear
  monorepo baseline.
- `next.config.ts` must not define a `webpack()` override unless an ADR approves
  the exception.
- If filesystem resolution needs monorepo support, keep the `turbopack.root`
  configuration intentional and documented.

## Verification

Use the narrowest relevant check first, then broader checks when foundation
contracts are touched:

- `bun run --cwd apps/admin-web lint`
- `bun run --cwd apps/admin-web typecheck`
- `bun run --cwd apps/admin-web test`
- `bun run --cwd apps/admin-web build`
- `bun run workspace:conformance`
- Browser/Playwright verification for UI or runtime behavior.

Do not claim Next.js behavior from memory. Query official docs first.
