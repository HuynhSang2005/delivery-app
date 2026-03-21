# Hey API Audit Checklist

Use this checklist before modifying any hey-api setup.

## 1) Setup Discovery

- Find generator script in `package.json` (for example: `openapi-ts`).
- Locate config file (`openapi-ts.config.ts|mjs|cjs|js`).
- Capture generator package version (`@hey-api/openapi-ts`).
- Identify package manager command (`bun`, `npm`, `pnpm`, or `yarn`).

## 2) Input Surface

- List all OpenAPI inputs:
  - Local spec files
  - Remote URLs
  - Programmatic object inputs
- Verify OpenAPI version(s) across inputs.
- Confirm spec fetch/update workflow (if any script exists).

## 3) Output Surface

- Confirm `output.path` and clean policy.
- Inventory generated artifacts:
  - `client.gen.ts`
  - `sdk.gen.ts`
  - `types.gen.ts`
  - validator outputs (`zod.gen.ts` or equivalent)
  - `transformers.gen.ts` (if enabled)
  - state-management outputs (TanStack plugin files)
- Verify generated files are documented as immutable in project docs.

## 4) Plugin Composition

- Confirm explicit `plugins` order and options.
- Confirm client plugin exists when SDK uses client.
- Confirm optional integrations are intentionally enabled:
  - `sdk.transformer`
  - `sdk.validator`
  - TanStack options (`queries`, `mutations`, `queryOptions`, `queryKeys`, etc.)

## 5) Runtime Wiring

- Locate startup configuration (`client.setConfig()` or runtime config file).
- Verify base URL source and environment mapping.
- Verify auth behavior (`auth` or interceptor strategy).
- Verify request/response/error interceptors and ordering.
- Verify custom fetch override if used.

## 6) Consumption Pattern Audit

- SDK imports come from generated SDK module.
- DTOs/types imported from generated types module.
- Validators imported from generated validator module.
- Generated query options consumed consistently with app query-key strategy.
- Error mapping normalizes generated/client error shape to app error contract.

## 7) Migration Risk Audit

- Compare current version against migration notes.
- Check for breaking categories:
  - ESM/CJS support
  - Node version minimum
  - plugin option renames/removals
  - output/import shape changes
  - parser and structure API changes

## 8) Verification Gate

- Run generation command.
- Run type-check.
- Run lint.
- Run tests.
- Run build.
- Review generated diff for unexpected output churn.
