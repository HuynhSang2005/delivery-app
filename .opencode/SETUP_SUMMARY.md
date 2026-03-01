# OpenCode Setup Summary — delivery-app
Date: 2026-03-01

## Project Stack
- **Web**: Next.js 14+ (App Router)
- **Mobile**: React Native / Expo SDK
- **API**: NestJS 10+
- **Database**: PostgreSQL with Prisma ORM

## Config Files
| File Path | Purpose |
| :--- | :--- |
| `opencode.json` | Main config: LSP, watcher ignores, and tool permissions |
| `AGENTS.md` | Global instructions and tech stack rules for all agents |
| `.opencode/oh-my-opencode.jsonc` | OMO settings: truncation and background task timeouts |

## Custom Agents
| Agent Name | Role |
| :--- | :--- |
| `dv-backend-dev` | NestJS API, modules, services, and DTO implementation |
| `dv-frontend-dev` | Next.js web portal, React components, and Tailwind styling |
| `dv-mobile-dev` | React Native/Expo mobile app screens and navigation |
| `dv-db-architect` | PostgreSQL schema, Prisma models, and migrations |
| `dv-test-engineer` | Unit, integration, and E2E tests (Jest, Playwright) |
| `dv-code-reviewer` | Read-only quality, security, and best practice reviews |
| `dv-devops-engineer` | Docker, CI/CD workflows, and deployment configs |
| `dv-docs-writer` | READMEs, API documentation, and architecture records |

## Monorepo Structure
- `apps/web`: Next.js frontend application
- `apps/mobile`: React Native / Expo mobile application
- `apps/api`: NestJS backend API
- `packages/shared`: Shared TypeScript types and utilities
- `packages/ui`: Shared React component library
- `packages/database`: Prisma schema and database migrations

## Environment Variables
Refer to `.env.example` for all required variables.
Set `CONTEXT7_API_KEY` following `docs/CONTEXT7_SETUP.md`.

## claude-mem
Persistent memory across sessions. Web UI at http://localhost:37777

## Quick Start
1. Copy `.env.example` to `.env`
2. Set `CONTEXT7_API_KEY` in `.env`
3. Run `opencode`
