import { useParams } from "@tanstack/react-router";
import { agency, defaultLocale } from "@/config/agency";
import { fr, type Dictionary, type TranslationKey } from "./fr";
import { en } from "./en";
import { ar } from "./ar";
import { DEFAULT_LOCALE, isLocale, type Locale, type Localized, type LocalizedList } from "./types";

export * from "./types";
export type { TranslationKey } from "./fr";

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, ar };

/**
 * Is this a language the CLIENT publishes, not merely one the template can
 * render?
 *
 * The two differ on every monolingual site: the code knows Arabic, a
 * French-only agency does not publish it, and /ar must 404 there rather than
 * serve a page whose content has never been translated.
 */
export const isPublishedLocale = (v: unknown): v is Locale =>
  isLocale(v) && agency.languages.includes(v);

/* Written as escapes on purpose: invisible characters in source invite a "cleanup". */
const NBSP = "\u00a0"; // no-break space
const LRI = "\u2066"; // left-to-right isolate
const PDI = "\u2069"; // pop directional isolate

/**
 * Make a number survive an Arabic paragraph. Two separate bugs:
 *
 * 1. "19 500" — a plain space is whitespace, and whitespace takes the
 *    paragraph's direction, so the number splits into two runs that then
 *    swap and the price renders "500 19". A no-break space is a bidi Common
 *    Separator instead, which keeps the digits one run.
 *
 * 2. "+1 000" — a sign beside a number still gets reordered and the plus
 *    lands on the wrong end: "1 000+". Isolating the signed number pins it
 *    left-to-right whatever surrounds it.
 *
 * Both checked in a browser rather than reasoned about — the bidi algorithm
 * is not something to take on trust. Only signed numbers are isolated; a
 * bare number is fine once its digits are bound.
 *
 * Applied in every language, not only Arabic: elsewhere the no-break space is
 * the correct thousands separator anyway, and it stops a price breaking
 * across two lines.
 */
const SIGNED_NUMBER = new RegExp(`[+−-][0-9][0-9${NBSP}]*`, "g");

const bindDigits = (s: string): string =>
  s.replace(/(\d) (?=\d)/g, `$1${NBSP}`).replace(SIGNED_NUMBER, (m) => `${LRI}${m}${PDI}`);

/**
 * Put the client's name into a shared string.
 *
 * The dictionaries are the template's, reused by every agency, so they must
 * never contain one client's name — otherwise onboarding means hunting the
 * previous client's name through three languages. Strings say "{agency}" and
 * the name arrives from the config at render time.
 *
 * Deliberately not a general interpolation system: one placeholder, filled
 * centrally, because it appears in a couple of dozen keys. Call sites that
 * need a value only they know (a programme title, an amount) still do their
 * own `.replace("{program}", …)`.
 */
const withAgency = (s: string): string =>
  s.includes("{agency}") ? s.replaceAll("{agency}", agency.identity.name) : s;

const render = (s: string): string => bindDigits(withAgency(s));

/**
 * Look a key up in `locale`, falling back to French.
 *
 * A half-translated page still sells; a page full of blanks does not. The
 * fallback is loud in dev so gaps get noticed during the work, not by a
 * client six months later.
 *
 * This is what lets a client enable a feature the template has not been fully
 * translated for yet: the page renders in French rather than breaking.
 */
export function translate(locale: Locale, key: TranslationKey): string {
  const value = DICTIONARIES[locale]?.[key];
  if (value) return render(value);
  if (import.meta.env.DEV && locale !== DEFAULT_LOCALE) {
    console.warn(`[i18n] missing ${locale} translation for "${key}" — showing French`);
  }
  return render(fr[key]);
}

/**
 * Translator for `head()` and loaders, which run outside React and so cannot
 * call `useT`. Give it the raw `params.lang`; anything unrecognised is French.
 */
export function tFor(lang: unknown): (key: TranslationKey) => string {
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return (key) => translate(locale, key);
}

/** Same, for localised content outside React. */
export function pickFor(lang: unknown): (value: Localized) => string {
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return (value) => pick(locale, value);
}

/** The active locale, read from the `/$lang` route segment.
 *
 * `strict: false` because this is called from shared components (header,
 * footer, cards) that are not tied to one route. Anything unrecognised falls
 * back to French rather than throwing.
 */
export function useLocale(): Locale {
  const params = useParams({ strict: false }) as { lang?: string };
  // Falls back to the CLIENT's first language, not French: a component
  // rendered outside the /$lang tree (the root 404, say) should still link
  // into the language that agency actually publishes.
  return isPublishedLocale(params.lang) ? params.lang : defaultLocale();
}

/** Translator bound to the active locale: `const t = useT(); t("nav.contact")`. */
export function useT(): (key: TranslationKey) => string {
  const locale = useLocale();
  return (key) => translate(locale, key);
}

/** Pick the active language out of a piece of localised content. */
export function pick(locale: Locale, value: Localized): string {
  // value.fr, not value[DEFAULT_LOCALE]: French is the one key the type
  // guarantees, so reading it by name is what keeps this total.
  return bindDigits(value[locale] || value.fr);
}

export function pickList(locale: Locale, value: LocalizedList): string[] {
  const list = value[locale];
  return (list && list.length ? list : value.fr).map(bindDigits);
}

/** Hook form of `pick`, for use inside components. */
export function useLocalized(): {
  locale: Locale;
  pick: (value: Localized) => string;
  pickList: (value: LocalizedList) => string[];
} {
  const locale = useLocale();
  return {
    locale,
    pick: (value) => pick(locale, value),
    pickList: (value) => pickList(locale, value),
  };
}

/**
 * Attach the reader's currency word to a bare amount.
 *
 * Prices in client data are digits only ("20.500"). A currency baked into the
 * data would follow it into every language - an Arabic "درهم" showing up on
 * the French page, which is exactly what happened before this existed.
 *
 * Anything with no digit in it (a "—" placeholder, an empty cell) is left
 * alone, so a missing price does not become "— DH".
 */
export function money(amount: string, t: (key: TranslationKey) => string): string {
  return /[0-9]/.test(amount) ? `${amount} ${t("price.currency")}` : amount;
}

/** True when a tour carries no price and must be sold as a quote, not a product. */
export const isQuoteOnly = (amount: string): boolean => !/[0-9]/.test(amount);

/**
 * A tour's headline price, or "Sur devis" when it has none.
 *
 * money() leaves a priceless string alone, which is right for an Omra table
 * cell ("—" must stay "—") and wrong for a tour card, where the gap reads as
 * a broken page rather than a deliberate "ask us". So tour call sites use
 * this and Omra's keep money().
 */
export const priceOrQuote = (amount: string, t: (key: TranslationKey) => string): string =>
  isQuoteOnly(amount) ? t("tour.onRequest") : money(amount, t);
