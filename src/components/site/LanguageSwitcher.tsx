import { useRouterState } from "@tanstack/react-router";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { agency, isMultilingual } from "@/config/agency";
import { LOCALE_LABELS, LOCALE_SHORT, useLocale, useT } from "@/i18n";

/**
 * Swaps the language segment of the current path, so switching keeps you on
 * the page you were reading instead of bouncing you home — the usual annoyance
 * with language switchers.
 *
 * Offers the languages THIS client publishes, and renders nothing at all for a
 * monolingual one: a lone "FR" button invites a click that can go nowhere.
 *
 * The menu items stay plain anchors rather than router links, deliberately:
 * the href is built by string surgery on the current path, so it works for
 * every route including detail pages, with no per-route mapping to keep in
 * sync. The full reload it causes is a fair price — and it guarantees `lang`
 * and `dir` are re-rendered from the server rather than patched on the client.
 * Keeping real hrefs also leaves the other languages crawlable.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const current = useLocale();
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!isMultilingual()) return null;

  const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
  const hrefFor = (locale: string) => `/${locale}${rest ? `/${rest}` : ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("header.langLabel")}
        className={`inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground outline-none transition hover:bg-secondary/70 focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
      >
        <Globe className="h-3.5 w-3.5" />
        <span lang={current}>{LOCALE_SHORT[current]}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {agency.languages.map((locale) => {
          const active = locale === current;
          return (
            <DropdownMenuItem key={locale} asChild>
              <a
                href={hrefFor(locale)}
                hrefLang={locale}
                lang={locale}
                aria-current={active ? "true" : undefined}
                className="flex cursor-pointer items-center justify-between gap-3"
              >
                <span>{LOCALE_LABELS[locale]}</span>
                {active && <Check className="h-3.5 w-3.5 text-primary" />}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
