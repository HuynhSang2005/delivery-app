# delivery-app — Agent Rules

## Project Overview
Full-stack delivery application:
- **Web**: Next.js 16+ (App Router) — `apps/web/`
- **Mobile**: React Native with Expo SDK — `apps/mobile/`
- **API**: NestJS 11+ — `apps/api/`
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


### Available MCP Servers

| Server | Type | Purpose |
| :--- | :--- | :--- |
| `serena` | local (uvx) | Semantic code analysis — symbol search, find references, LSP tools |
| `tavily` | local (mcp-remote) | Real-time web search for research and troubleshooting |
| `mobile-mcp` | local (npx) | Mobile automation — interact with Android/iOS devices and emulators |
| `exa` | remote | Web and code search — GitHub examples, documentation, StackOverflow |
| `chrome-devtools` | local (npx) | Browser DevTools — debugging, performance profiling, network inspection |
| `tanstack` | local (npx) | TanStack library docs — Query, Router, Table, Form via dedicated MCP |

> **TanStack libraries** (Query, Router, Table, Form): Use the `tanstack` MCP for official TanStack library documentation. Context7 MCP (bundled with oh-my-opencode) also provides TanStack docs as a fallback.

### Agent → MCP Mapping

| Agent | Primary MCPs | Why |
| :--- | :--- | :--- |
| `dv-backend-dev` | `serena`, `tavily`, `exa` | Code analysis across large codebases; research NestJS patterns |
| `dv-frontend-dev` | `serena`, `chrome-devtools`, `exa`, `tanstack` | Symbol navigation; debug Next.js in browser; find React patterns; TanStack library docs |
| `dv-mobile-dev` | `mobile-mcp`, `serena`, `exa` | Automate Android device interactions; Expo/RN code analysis |
| `dv-db-architect` | `serena`, `exa` | Analyze existing schema; research SQL and Prisma patterns |
| `dv-test-engineer` | `serena`, `exa`, `chrome-devtools` | Navigate test files; find testing patterns; Playwright debugging |
| `dv-code-reviewer` | `serena` | Read-only symbol search and reference analysis |
| `dv-devops-engineer` | `tavily`, `exa` | Research Docker/CI patterns and best practices |
| `dv-docs-writer` | `exa`, `tavily` | Find documentation examples and current best practices |

