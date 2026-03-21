# Runtime Integration Patterns

## Pattern A: Startup setConfig

Use when app bootstrap can run before any API call.

```ts
import { client } from "@/api/client.gen"

client.setConfig({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  auth: async () => `Bearer ${await getAccessToken()}`,
})
```

Pros:

- Simple and explicit
- Easy to override later

Risk:

- If API calls happen before bootstrap config, defaults may be used unexpectedly.

## Pattern B: runtimeConfigPath

Use when you need deterministic initialization before client instance is used.

Config:

```ts
{
  name: "@hey-api/client-fetch",
  runtimeConfigPath: "./src/hey-api-runtime.ts",
}
```

Runtime file:

```ts
import type { CreateClientConfig } from "@/api/client.gen"

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: import.meta.env.VITE_API_BASE_URL,
})
```

## Pattern C: Interceptors for Auth and Observability

```ts
import { client } from "@/api/client.gen"

client.interceptors.request.use(async (request) => {
  const token = await getAccessToken()
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`)
  }
  return request
})

client.interceptors.response.use(async (response) => response)

client.interceptors.error.use(async (error) => {
  // Normalize and rethrow app-level error shape.
  throw mapApiError(error)
})
```

## Pattern D: Per-request Override Without New Client

```ts
const result = await getUsers({
  baseUrl: "https://tenant-b.example.com",
})
```

## Pattern E: Dedicated Custom Client Instance

```ts
import { createClient } from "@/api/client"

const tenantClient = createClient({
  baseUrl: "https://tenant-b.example.com",
})

const result = await getUsers({ client: tenantClient })
```

## Error Mapping Guidance

- Treat generated client errors as transport-level errors first.
- Map to app contract once, centrally.
- Keep UI-specific translations outside transport layer when possible.

## Common Runtime Mistakes

- Configuring auth in multiple places with conflicting behavior.
- Mixing `auth` callback and header interceptor in inconsistent ways.
- Throwing raw transport errors in UI components instead of normalized app errors.
