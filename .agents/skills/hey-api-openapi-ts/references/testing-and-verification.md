# Testing and Verification

## Minimum Validation Pipeline

Run after any generator config/plugin/version change:

1. Regenerate API output.
2. Type-check.
3. Lint.
4. Run tests.
5. Build.

## Suggested Commands (Adapt to Repo)

```bash
bun run openapi-ts
bun run type-check
bun run lint
bun run test:run
bun run build
```

## What to Review in Generated Diffs

- New/removed files in output directory.
- Breaking import path changes.
- SDK function signature changes.
- Type renames or enum naming changes.
- Validator schema shape changes.
- TanStack query option function name changes.

## Behavioral Smoke Tests

- Authenticated endpoint request still sends expected auth header/token.
- Error mapping still extracts status/message/code from generated client errors.
- Date or other transformers still map runtime payloads as expected.
- Query invalidation still targets intended query keys.

## Failure Triage

If verification fails, classify quickly:

- Config mismatch: plugin missing, wrong option location, incompatible option values.
- Version migration breakage: renamed options, output shape drift.
- Runtime wiring issue: config called too late, interceptor order regression.
- Type-level drift: generated type changed due schema or parser behavior.

Then apply focused fix and rerun the full pipeline.
