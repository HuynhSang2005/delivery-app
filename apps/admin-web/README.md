# Admin Web App

Next.js App Router runtime shell for delivery operations and foundation checks.

## Scope

- Uses `api-client` for generated API calls.
- Uses `shared-kernel` for shared MVP/foundation constants.
- Builds with the Next.js 16 Turbopack production path: `next build --turbopack`.

## Commands

```bash
bun run dev
bun run build
bun run typecheck
bun run lint
bun run test
bun run test:e2e
```

Set `API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL` to point the health pilot at a non-default API endpoint.
