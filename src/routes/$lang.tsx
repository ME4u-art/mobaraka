import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { absoluteUrl, agency, defaultLocale } from "@/config/agency";
import { dirOf, isPublishedLocale, type Locale } from "@/i18n";

/** Open Graph wants a full locale, not a bare language code. */
const OG_LOCALE: Record<string, string> = {
  fr: "fr_MA",
  ar: "ar_MA",
  en: "en_US",
};

/**
 * Every page hangs off this segment, so the language is settled before any
 * component renders — SSR included. That is the point of putting it in the
 * URL: the first paint is already in the right language and direction, with
 * no flash of French before Arabic arrives.
 *
 * An unrecognised code is a 404 rather than a silent fallback, otherwise
 * /de/voyages would quietly serve French and Google would index it.
 *
 * "Unrecognised" means unpublished by THIS client, not unknown to the code.
 * A French-only agency must 404 on /ar: the template supports Arabic, but
 * that client has no Arabic content and an indexed half-Arabic page is worse
 * than no page.
 */
export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isPublishedLocale(params.lang)) throw notFound();
    return { locale: params.lang as Locale };
  },
  /**
   * Tell crawlers the same page exists in the other languages.
   *
   * Only the languages this client actually publishes — listing an alternate
   * that 404s is worse than listing none.
   */
  head: ({ params, matches }) => {
    // The layout's own match only knows "/fr" — the deepest match carries the
    // full path, which is what the alternate URLs have to point at.
    const pathname = matches[matches.length - 1]?.pathname ?? "";
    const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
    // Absolute, via agency.seo.url: Google ignores a relative hreflang or
    // canonical outright, and three language trees with no alternates between
    // them read as three duplicates of one page.
    const urlFor = (l: string) => absoluteUrl(`/${l}${rest ? `/${rest}` : ""}`);
    const self = urlFor(params.lang);
    return {
      links: [
        // Each language is its own canonical page, not a duplicate of the
        // others — that is what the alternates below are for.
        { rel: "canonical", href: self },
        ...agency.languages.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: urlFor(l),
        })),
        { rel: "alternate", hrefLang: "x-default", href: urlFor(defaultLocale()) },
      ],
      meta: [
        { property: "og:url", content: self },
        // No og:locale:alternate — the router dedupes meta by `property`, so
        // a list of them collapses to one entry, and half a list misinforms
        // worse than none. The hreflang links above carry the full set.
        { property: "og:locale", content: OG_LOCALE[params.lang] ?? params.lang },
      ],
    };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { lang } = Route.useParams();
  const locale = lang as Locale;

  // The shell renders <html> on the server; this keeps the attributes correct
  // after a client-side language switch, which never re-renders the shell.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = dirOf(locale);
  }, [locale]);

  return <Outlet />;
}
