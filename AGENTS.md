# delivery-app — Agent Rules

## Project Overview
Full-stack delivery application:
- **Web**: Next.js 14+ (App Router) — `apps/web/`
- **Mobile**: React Native with Expo SDK — `apps/mobile/`
- **API**: NestJS 10+ — `apps/api/`
- **Shared**: Types and utilities — `packages/shared/`, `packages/ui/`

## TypeScript
- **Strict mode required** everywhere. No `any`. No `@ts-ignore`.
- All props, parameters, and return types must be explicitly typed.
- Use `unknown` instead of `any` when type is uncertain.

## Monorepo Structure
```
apps/
  web/       → Next.js frontend
  mobile/    → React Native / Expo
  api/       → NestJS backend
packages/
  shared/    → Shared types, utils, constants
  ui/        → Shared React components
  database/  → Prisma schema (or apps/api/prisma/)
```

## NestJS (Backend)
- Module-based architecture: modules, controllers, services, providers
- Always create DTOs for request/response validation (class-validator + class-transformer)
- Use built-in exception filters: NotFoundException, BadRequestException, etc.
- JWT authentication via @nestjs/jwt and Passport.js
- Never expose passwords or sensitive fields in responses
- RESTful design with correct HTTP status codes

## Next.js (Frontend)
- **App Router only** — no Pages Router
- Server Components by default; use `'use client'` only when needed
- Use `next/image` for all images (never raw `<img>`)
- Use `next/link` for all internal links
- TailwindCSS for styling — no inline styles

## React Native (Mobile)
- Expo SDK (latest stable) with Expo Router for navigation
- `StyleSheet.create()` for styles — no inline style objects
- Handle loading AND error states on every screen
- Functional components with React hooks only

## Database
- PostgreSQL with Prisma ORM
- UUID primary keys, `created_at` + `updated_at` timestamps on all tables
- Never drop columns without a migration plan
- Schema lives in `packages/database/` or `apps/api/prisma/`

## API Design
- RESTful endpoints, JWT authentication
- DTO validation on every endpoint
- Unit tests (Jest), API tests (Supertest), E2E (Playwright)

## Git
- Conventional commits: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- No hardcoded secrets or credentials in any file

## Memory & Context
- This project uses claude-mem for persistent memory across sessions
- Previous session context is automatically available via MCP search tools
- Web UI: http://localhost:37777 (when claude-mem worker is active)
