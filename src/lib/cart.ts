/**
 * CART — several programmes in one enquiry, instead of one form per page.
 *
 * What this is NOT: an online checkout. Nothing here takes a payment, and no
 * card details are ever collected by this site. Moroccan agencies take a
 * deposit at the counter or by transfer, and taking money online needs a
 * merchant account (Payzone/CMI) held by the agency itself — a contract per
 * client, not code. The cart therefore ends where every other form on the
 * site ends: `submitBooking`, which records the order server-side and hands
 * the visitor a pre-filled WhatsApp message. Add the payment step the day a
 * client has a merchant ID, and it slots in after `checkoutFields`.
 *
 * State lives in localStorage so a visitor can browse three programmes and
 * still have the first one when they reach the cart. It is deliberately NOT
 * read during render on the server: this runs SSR on a Cloudflare Worker,
 * where touching a browser global is the exact mistake that sent every
 * visitor to /en (see src/routes/index.tsx). `getServerSnapshot` returns a
 * frozen empty cart, so the server renders an empty cart and the client
 * fills it on hydration.
 */

import { useSyncExternalStore } from "react";
import type { Localized, LocalizedList, TranslationKey } from "@/i18n";

/**
 * One line of detail under a cart item.
 *
 * The label is always a translation key. The value is EITHER a key (room
 * type — "Sextuple" is our word, and an Arabic reader should see سداسية)
 * or literal text (a hotel name, a departure date — the agency's own data,
 * which we do not translate and must not mangle).
 */
export type CartDetail = {
  label: TranslationKey;
  value: string;
  /** True when `value` is a translation key rather than literal text. */
  translate?: boolean;
  /**
   * Agency data that exists in several languages — a departure line, say.
   * Takes precedence over `value`, which stays as the fallback for a
   * language the agency did not fill in.
   */
  localized?: Localized;
};

/**
 * One entry of a LocalizedList, kept Localized so the cart can re-pick it
 * after a language switch instead of freezing the language it was added in.
 */
export function localizedAt(list: LocalizedList, index: number): Localized {
  // Iterates the list's OWN keys rather than importing LOCALES: this file is
  // also run directly by cart.check.ts, where the "@/" alias does not resolve,
  // and a type-only import costs nothing at runtime.
  const out = { fr: list.fr?.[index] ?? "" } as Localized;
  for (const [lang, values] of Object.entries(list)) {
    const v = values?.[index];
    if (v) out[lang as keyof Localized] = v;
  }
  return out;
}

export type CartLine = {
  /** Stable key: same programme + same hotel + same room merges, not duplicates. */
  id: string;
  slug: string;
  kind: "omra" | "tour";
  /**
   * Localized, not a rendered string: a cart filled in French has to read
   * correctly after the visitor switches to Arabic. Storing the translated
   * text freezes it in whichever language it was added in.
   */
  title: Localized;
  details: CartDetail[];
  people: number;
  /**
   * Per-person price EXACTLY as the agency wrote it ("20.500"), not a number.
   * Prices on this site are strings with a dot as thousands separator, and a
   * programme sold "sur devis" has no digits at all — both must survive a
   * round trip through the cart untouched.
   */
  unitPrice: string;
};

// v2: titles became Localized and details became keyed. A v1 cart cannot
// be read as v2 and is dropped rather than half-rendered.
const KEY = "cart.v2";
const MAX_LINES = 20;
const MAX_PEOPLE = 20;

/** Referentially stable: a new [] each call makes useSyncExternalStore loop. */
const EMPTY: CartLine[] = Object.freeze([] as CartLine[]) as CartLine[];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

function load(): void {
  if (loaded || !isBrowser()) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    lines = Array.isArray(parsed) ? parsed.filter(isLine).slice(0, MAX_LINES) : EMPTY;
  } catch {
    // A corrupt or unreadable store must not break the page it renders in.
    lines = EMPTY;
  }
}

/** The store is public (localStorage): treat what comes back as untrusted. */
function isLine(v: unknown): v is CartLine {
  const l = v as Partial<CartLine> | null;
  return (
    !!l &&
    typeof l.id === "string" &&
    typeof l.slug === "string" &&
    (l.kind === "omra" || l.kind === "tour") &&
    typeof l.title === "object" &&
    l.title !== null &&
    typeof l.unitPrice === "string" &&
    typeof l.people === "number" &&
    Number.isFinite(l.people) &&
    Array.isArray(l.details)
  );
}

function commit(next: CartLine[]): void {
  lines = next;
  if (isBrowser()) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Private mode, or quota. The cart still works for this page view.
    }
  }
  listeners.forEach((fn) => fn());
}

const subscribe = (fn: () => void): (() => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const snapshot = (): CartLine[] => {
  load();
  return lines;
};

const serverSnapshot = (): CartLine[] => EMPTY;

/** The cart, live. Empty on the server and on the first client render. */
export const useCart = (): CartLine[] =>
  useSyncExternalStore(subscribe, snapshot, serverSnapshot);

/** The cart outside React — for the checkout handler and for cart.check.ts. */
export const cartLines = (): CartLine[] => snapshot();

export const lineId = (slug: string, details: CartDetail[]): string =>
  [slug, ...details.map((d) => d.value)].join("|");

export function addLine(line: Omit<CartLine, "id">): void {
  load();
  const id = lineId(line.slug, line.details);
  const existing = lines.find((l) => l.id === id);
  const people = clampPeople(line.people + (existing ? existing.people : 0));
  const next = existing
    ? lines.map((l) => (l.id === id ? { ...l, people } : l))
    : [...lines, { ...line, id, people: clampPeople(line.people) }];
  commit(next.slice(0, MAX_LINES));
}

export function setPeople(id: string, people: number): void {
  load();
  commit(lines.map((l) => (l.id === id ? { ...l, people: clampPeople(people) } : l)));
}

export function removeLine(id: string): void {
  load();
  commit(lines.filter((l) => l.id !== id));
}

export function clearCart(): void {
  commit(EMPTY);
}

const clampPeople = (n: number): number =>
  Math.min(MAX_PEOPLE, Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)));

/** Travellers across the whole cart — what the header badge counts. */
export const cartCount = (ls: CartLine[]): number => ls.reduce((n, l) => n + l.people, 0);

/**
 * "20.500" -> 20500. The dot is a thousands separator here, never a decimal:
 * these are whole dirhams. A programme with no digits is quote-only and
 * contributes nothing to a total.
 */
export const priceToNumber = (price: string): number => {
  const digits = price.replace(/[^0-9]/g, "");
  return digits === "" ? 0 : Number(digits);
};

/** Back to the site's own convention, so a total looks like a price. */
export const numberToPrice = (n: number): string =>
  n.toLocaleString("fr-FR").replace(/ | |\s/g, ".");

export const lineTotal = (l: CartLine): number => priceToNumber(l.unitPrice) * l.people;

export const cartTotal = (ls: CartLine[]): number => ls.reduce((n, l) => n + lineTotal(l), 0);

/** True when any line has no price, so a total would understate the order. */
export const hasQuoteOnly = (ls: CartLine[]): boolean =>
  ls.some((l) => priceToNumber(l.unitPrice) === 0);

/**
 * The cart as booking fields — one block per line, flattened, because
 * `Booking.fields` is a flat [label, value] list that both the email and the
 * WhatsApp message render verbatim.
 */
/**
 * The cart as booking fields, rendered in the language the visitor is
 * reading — which is also the language the agency will be answering in.
 */
export function checkoutFields(
  ls: CartLine[],
  t: (key: TranslationKey) => string,
  pickTitle: (title: Localized) => string,
  currency: string,
): [string, string][] {
  const out: [string, string][] = [];
  ls.forEach((l, i) => {
    const n = String(i + 1);
    out.push([`${t("cart.line")} ${n}`, pickTitle(l.title)]);
    l.details.forEach((d) =>
      out.push([
        `  ${t(d.label)}`,
        d.localized
          ? pickTitle(d.localized)
          : d.translate
            ? t(d.value as TranslationKey)
            : d.value,
      ]),
    );
    out.push([`  ${t("cart.people")}`, String(l.people)]);
    if (priceToNumber(l.unitPrice) > 0) {
      out.push([`  ${t("cart.unit")}`, `${l.unitPrice} ${currency}`]);
      out.push([`  ${t("cart.lineTotal")}`, `${numberToPrice(lineTotal(l))} ${currency}`]);
    }
  });
  return out;
}
