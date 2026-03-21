---
name: hey-api-openapi-ts
description: End-to-end guidance for @hey-api/openapi-ts across configuration, plugin composition, generated artifact usage, migration safety, and runtime integration. Use whenever users mention hey-api, openapi-ts, openapi-ts.config.ts, sdk.gen.ts, client.gen.ts, types.gen.ts, zod.gen.ts, @hey-api/client-fetch, @hey-api/sdk, @tanstack/react-query.gen, or OpenAPI code generation workflows.
---

# Hey API OpenAPI TS

Use this skill to implement, audit, refactor, and troubleshoot projects that generate API layers with `@hey-api/openapi-ts`.

## When to Use This Skill

- User asks to set up or improve `@hey-api/openapi-ts`.
- User asks about generated outputs like `sdk.gen.ts`, `types.gen.ts`, `client.gen.ts`, `zod.gen.ts`, `transformers.gen.ts`, or TanStack output files.
- User needs migration support after version upgrades.
- User reports API typing drift, runtime auth/interceptor issues, or validator/transformer mismatch.
- User wants reusable patterns for Fetch-based generated clients.

## When Not to Use This Skill

- Work is unrelated to OpenAPI code generation.
- User asks for generic API design without codegen/tooling integration.
- Project uses a different generator and user did not request hey-api adoption.

## Core Principles

- Generated artifacts are dependencies: never hand-edit `.gen.ts` files.
- Prefer generated SDK and types over ad-hoc request code.
- Keep runtime config centralized and deterministic.
- Use plugin composition intentionally (client, sdk, validators, transformers, state plugins).
- Run migration checks against official migration notes before and after version bumps.

## Standard Workflow

1. Discover current setup.
2. Validate plugin composition and output contract.
3. Audit runtime integration (`client.setConfig()`, runtime config path, interceptors).
4. Audit consumption patterns (SDK usage, generated query options, query keys, error mapping).
5. Apply minimum necessary changes.
6. Regenerate and verify (types, lint, tests, build).
7. Document migration and maintenance notes.

## Discovery Checklist

- Locate generator config (usually `openapi-ts.config.ts`).
- Identify generator script in `package.json`.
- Identify source specs (`openapi/*.json|yaml` or URL inputs).
- Identify output path and all generated files.
- Detect active plugins and option set.
- Detect runtime wiring location (`main.tsx`, app bootstrap, or API init module).

Detailed checklist: `references/audit-checklist.md`

## Configuration Model (Plugin-First)

At minimum, validate:

- `input`: file path(s), URL(s), or OpenAPI object(s).
- `output.path`: generated destination.
- `plugins`: explicit ordered list.

Common production stack for Fetch + SDK + validation + transforms + TanStack Query:

- `@hey-api/client-fetch`
- `@hey-api/sdk`
- `zod` (or another validator plugin)
- `@hey-api/transformers`
- `@tanstack/react-query` (or framework equivalent)

Reference recipes: `references/config-recipes.md`

## Runtime Integration Patterns

Preferred order of runtime initialization:

1. Configure base URL and auth.
2. Add request/response interceptors.
3. Add error interceptor/mapping.
4. Start app/providers.

Supported patterns:

- `client.setConfig()` at startup.
- `runtimeConfigPath` for initialization-time defaults.
- Override per-call via SDK request options.
- Custom client instance for one-off domain/tenant routes.

Reference runtime patterns: `references/runtime-patterns.md`

## Generated Artifact Contract

Treat these outputs as stable integration surfaces:

- `client.gen.ts`: global client instance setup.
- `sdk.gen.ts`: operation-level SDK functions/classes.
- `types.gen.ts`: canonical request/response types.
- `zod.gen.ts` / validator artifacts: runtime schema validation.
- `transformers.gen.ts`: parse/transform helpers when enabled.
- `@tanstack/...gen.ts`: generated query/mutation option builders.

Never duplicate generated DTOs unless extending with clearly named local view-model types.

## Migration Guardrails

Before upgrading `@hey-api/openapi-ts`:

- Read official migration notes.
- Check runtime version constraints (Node and ESM support changes).
- Check renamed/removed options and plugin API shifts.
- Snapshot generated output or run on a branch.
- Compare generated diffs before merging.

Reference migration watchlist: `references/migration-watchlist.md`

## Verification Requirements

After any generator or config change:

1. Run generation script.
2. Run type-check.
3. Run lint.
4. Run tests (focused then full as needed).
5. Run build.

Reference verification matrix: `references/testing-and-verification.md`

## Anti-Patterns

- Manually editing `.gen.ts` files.
- Replacing generated SDK calls with manual `fetch`/`axios` without explicit reason.
- Mixing generated query keys with unrelated key conventions without a deliberate adapter strategy.
- Enabling transformer plugin but forgetting `sdk.transformer`.
- Enabling validator intent without validator plugin or `sdk.validator` wiring.
- Upgrading versions without reading migration notes.

## Related Skills

- `tanstack-query-best-practices` for cache and mutation strategy.
- `zod` for schema authoring/validation conventions.
- `plan-work` for multi-file design and sequencing.
- `execute-work` for disciplined implementation checkpoints.
- `systematic-debugging` for root-cause investigation.
- `verification-before-completion` before claiming success.

## Templates

- `templates/openapi-ts.config.fetch-react-query.ts`
- `templates/runtime-config.fetch.ts`

## Sources

- Official docs: `https://heyapi.dev/openapi-ts/`
- Migration notes: `https://heyapi.dev/openapi-ts/migrating`
- Fetch client docs: `https://heyapi.dev/openapi-ts/clients/fetch`
- SDK docs: `https://heyapi.dev/openapi-ts/plugins/sdk`
- Repository: `https://github.com/hey-api/openapi-ts`
