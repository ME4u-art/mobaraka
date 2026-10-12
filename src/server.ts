import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { agency, defaultLocale } from "./config/agency";
import { isLocale, type Locale } from "./i18n/types";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Send `/`, and any page path that carries no language, to a language.
 *
 * The first public build had no language prefix (`/a-propos`,
 * `/voyages/<slug>`, `/omra`), and those links are already out on WhatsApp.
 * Rather than 404 them, `/a-propos` goes to `/fr/a-propos` (or `/en/…`,
 * `/ar/…` per the visitor's browser). Paths that look like files (a dot in
 * the last segment) or internals (`/_serverFn`, `/@vite`) are left alone.
 *
 * `routes/index.tsx` does this too, but only the Worker can see who is
 * asking — inside the router the request is gone. An earlier attempt read
 * `navigator.languages`, which on a Worker describes the SERVER, so every
 * visitor was redirected to the same place whatever their browser asked for.
 *
 * Unrecognised and absent headers fall back to `defaultLocale()`, which is
 * what the `x-default` hreflang already claims — so a crawler, which usually
 * sends no Accept-Language at all, lands where the markup says it should.
 */
function redirectToLocale(request: Request): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  const path = url.pathname;
  const first = path.split("/")[1] ?? "";
  if (path !== "/") {
    if (isLocale(first)) return null;
    if (first.startsWith("_") || first.startsWith("@")) return null;
    if (path.split("/").pop()?.includes(".")) return null;
  }

  // Search is preserved: the root URL is what goes on flyers and ads, so it
  // arrives carrying utm_* more often than it arrives bare.
  //
  // `cache-control` is the load-bearing header here, not `vary`. Cloudflare
  // honours `Vary` only for `Accept-Encoding` — every other `Vary` is ignored
  // for caching — so a cached redirect would hand the first visitor's
  // language to everyone behind them. `vary` is still sent for the browser's
  // own cache and for proxies that do respect it.
  return new Response(null, {
    status: 307,
    headers: {
      location: `/${preferredLocale(request)}${path === "/" ? "" : path}${url.search}`,
      vary: "Accept-Language",
      "cache-control": "no-store",
    },
  });
}

/**
 * First language the visitor asks for that this agency actually publishes.
 *
 * Quality values are honoured, so `fr;q=0.9, en;q=0.8` prefers French and a
 * `q=0` entry means "explicitly not this". Tags match on their base subtag:
 * `fr-MA`, `fr-FR` and `fr` all select `fr`, which matters because Moroccan
 * browsers send `fr-MA` and `ar-MA` far more often than the bare tags.
 */
function preferredLocale(request: Request): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale();

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((entry) => entry.tag !== "" && Number.isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base) && agency.languages.includes(base)) return base;
  }
  return defaultLocale();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const localeRedirect = redirectToLocale(request);
      if (localeRedirect) return localeRedirect;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
