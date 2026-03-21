# Configuration Recipes

## Baseline Config (Fetch + SDK)

```ts
import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "./openapi.json",
  output: {
    path: "./src/api",
  },
  plugins: ["@hey-api/client-fetch", "@hey-api/sdk"],
})
```

## Fetch + SDK + Zod + Transformers + TanStack React Query

```ts
import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: ["./openapi/service-a.json", "./openapi/service-b.json"],
  output: {
    path: "./src/api",
    lint: "eslint",
    format: "prettier",
  },
  plugins: [
    "@hey-api/client-fetch",
    "zod",
    {
      name: "@hey-api/transformers",
      dates: true,
      exportFromIndex: true,
    },
    {
      name: "@hey-api/typescript",
      enums: "javascript",
      exportFromIndex: true,
    },
    {
      name: "@hey-api/sdk",
      auth: true,
      transformer: true,
      validator: true,
      exportFromIndex: true,
    },
    {
      name: "@tanstack/react-query",
      queryOptions: true,
      mutationOptions: true,
      queryKeys: true,
      infiniteQueryOptions: true,
      infiniteQueryKeys: true,
      transformer: true,
    },
  ],
})
```

## Validator Granularity

```ts
{
  name: "@hey-api/sdk",
  validator: {
    request: "zod",
    response: "zod",
  },
}
```

## Class-Based SDK (Larger Bundle, OOP Style)

```ts
{
  name: "@hey-api/sdk",
  operations: {
    strategy: "single",
    containerName: "ApiClient",
  },
}
```

## Flat SDK (Tree-shakeable Default)

```ts
{
  name: "@hey-api/sdk",
  operations: {
    strategy: "flat",
  },
}
```

## Runtime Config at Generation Time

```ts
{
  name: "@hey-api/client-fetch",
  runtimeConfigPath: "./src/hey-api-runtime.ts",
}
```

## Important Notes

- In modern releases, plugin-first configuration is the canonical model.
- If you explicitly define `plugins`, keep required plugins in the list.
- Keep plugin options close to the plugin object that owns them.
- For multi-input projects, ensure naming strategy avoids collisions.
