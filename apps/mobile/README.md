# Mobile App

Expo Router runtime shell for delivery MVP-1 mobile flows.

## Scope

- Keeps Android, iOS, and web export paths available for foundation verification.
- Uses `shared-kernel` for shared MVP/foundation constants.
- Separates unit, integration, and web export smoke scripts.

## Commands

```bash
bun run start
bun run android
bun run ios
bun run web
bun run build
bun run lint
bun run typecheck
bun run test
bun run test:e2e
```

Run from the app folder with `bun run <script>` or from the workspace with `bun run --cwd apps/mobile <script>`.
