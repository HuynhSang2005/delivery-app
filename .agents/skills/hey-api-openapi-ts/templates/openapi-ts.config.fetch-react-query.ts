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
