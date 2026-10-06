import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultLocale } from "@/config/agency";

/**
 * `/` carries no language, so it sends the visitor to one and never renders.
 *
 * The redirect happens in `beforeLoad`, so a crawler and a browser both land
 * on a real URL — /fr/, /en/ or /ar/ — instead of an empty page that only
 * resolves once JavaScript runs.
 *
 * It goes to the client's FIRST published language, unconditionally. There
 * used to be browser-preference sniffing here, reading `navigator.languages`
 * behind a `typeof navigator === "undefined"` guard. That guard is wrong on a
 * Worker: `nodejs_compat` defines `navigator`, and `navigator.languages` there
 * is the SERVER's locale ("en-US"), not the visitor's — so on Cloudflare every
 * visitor was redirected to /en no matter what their browser asked for, which
 * on an Arabic-first agency is the worst possible landing.
 *
 * Guessing is not worth fixing, it is worth dropping: the redirect runs during
 * SSR, Googlebot sends no Accept-Language at all, and a response that varies
 * per visitor cannot be cached at the edge. One stable target also keeps this
 * agreeing with the `x-default` alternate, which is this same locale. Readers
 * who want another language have the switcher in the header.
 */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/$lang", params: { lang: defaultLocale() }, replace: true });
  },
});
