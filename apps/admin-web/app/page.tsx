import { createClient, createConfig, healthControllerLive, healthControllerReady } from "api-client";
import { DELIVERY_MVP_SEQUENCE, FOUNDATION_CAPABILITIES, SHARED_KERNEL_VERSION } from "shared-kernel";

type HealthCheckResult = {
  endpoint: string;
  ok: boolean;
  status: number;
  errorMessage?: string;
};

function createAdminApiClient() {
  const baseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

  return createClient(createConfig({ baseUrl }));
}

async function runHealthCheck(
  endpoint: string,
  request: ReturnType<typeof healthControllerLive> | ReturnType<typeof healthControllerReady>,
): Promise<HealthCheckResult> {
  try {
    const result = await request;
    return {
      endpoint,
      ok: result.response.ok,
      status: result.response.status,
    };
  } catch (error: unknown) {
    return {
      endpoint,
      ok: false,
      status: 0,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

export default async function Home() {
  const apiClient = createAdminApiClient();
  const [live, ready] = await Promise.all([
    runHealthCheck("GET /health/live", healthControllerLive({ client: apiClient, throwOnError: true })),
    runHealthCheck("GET /health/ready", healthControllerReady({ client: apiClient, throwOnError: true })),
  ]);

  const checks = [live, ready];
  const allHealthy = checks.every((check) => check.ok);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Delivery Foundation Console</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Runtime shell dang dung <code>packages/api-client</code> va <code>packages/shared-kernel</code>.
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              allHealthy ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {allHealthy ? "healthy" : "degraded"}
          </span>
        </div>

        <ul className="space-y-3">
          {checks.map((check) => (
            <li key={check.endpoint} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-sm text-zinc-800">{check.endpoint}</p>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    check.ok ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {check.ok ? `ok (${check.status})` : `fail (${check.status || "n/a"})`}
                </p>
              </div>
              {check.errorMessage ? <p className="mt-2 text-xs text-rose-700">{check.errorMessage}</p> : null}
            </li>
          ))}
        </ul>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase text-zinc-500">Delivery path</p>
            <p className="mt-2 text-sm font-medium text-zinc-900">{DELIVERY_MVP_SEQUENCE.join(" -> ")}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase text-zinc-500">Shared kernel</p>
            <p className="mt-2 text-sm font-medium text-zinc-900">v{SHARED_KERNEL_VERSION}</p>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase text-zinc-500">Foundation ownership</p>
          <ul className="mt-3 space-y-2">
            {FOUNDATION_CAPABILITIES.map((capability) => (
              <li key={capability.key} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-zinc-800">{capability.label}</span>
                <span className="font-mono text-xs text-zinc-500">{capability.owner}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
          <p>
            API base URL: <code>{process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1"}</code>
          </p>
          <p className="mt-2">Set <code>API_BASE_URL</code> hoac <code>NEXT_PUBLIC_API_BASE_URL</code> de doi endpoint.</p>
        </div>
      </main>
    </div>
  );
}
