/**
 * Language support for the site.
 *
 * French is the source of truth: every other dictionary is typed against it,
 * so a missing translation is a build error rather than a blank space on a
 * live page.
 */

export const LOCALES = ["fr", "en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

/** French is what the agency writes first, and what everything falls back to. */
export const DEFAULT_LOCALE: Locale = "fr";

/** Locales that read right to left — drives `dir` and the layout mirroring. */
const RTL: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

export const isLocale = (v: unknown): v is Locale =>
  typeof v === "string" && (LOCALES as readonly string[]).includes(v);

export const isRtl = (locale: Locale): boolean => RTL.has(locale);

export const dirOf = (locale: Locale): "ltr" | "rtl" => (isRtl(locale) ? "rtl" : "ltr");

/**
 * A piece of content that exists in each language.
 *
 * Deliberately applied per field, not per record: a tour's price, image and
 * slug are the same in every language, so they stay written once and a price
 * change remains a single edit.
 */
export type Localized = { fr: string } & Partial<Record<Locale, string>>;

/** Same, for lists — itineraries, inclusions, highlights. */
export type LocalizedList = { fr: string[] } & Partial<Record<Locale, string[]>>;

/** How each language names itself, for the switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

/**
 * Short codes for the compact header switcher.
 *
 * Arabic gets a real word rather than a lone letter: "ع" is a character, not
 * a language name, and it reads as a stray glyph beside two Latin codes.
 */
export const LOCALE_SHORT: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "عربي",
};
