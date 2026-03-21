import type { CreateClientConfig } from "@/api/client.gen"

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  auth: async () => {
    // Replace this with your token provider.
    const token = window.localStorage.getItem("access_token")
    return token ? `Bearer ${token}` : ""
  },
})
