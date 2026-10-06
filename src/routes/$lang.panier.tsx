import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { BadgeCheck, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useLocale, useT, tFor, pick, type TranslationKey } from "@/i18n";
import { submitBooking } from "@/lib/booking";
import {
  cartCount,
  cartTotal,
  checkoutFields,
  clearCart,
  hasQuoteOnly,
  lineTotal,
  numberToPrice,
  removeLine,
  setPeople,
  useCart,
} from "@/lib/cart";

/**
 * The cart, and the enquiry it turns into.
 *
 * No payment is taken here and no card details are collected — see the note
 * at the top of src/lib/cart.ts. The order leaves by the same road as every
 * other form on the site: recorded server-side, then handed to WhatsApp.
 *
 * noindex: a cart is per-visitor and empty for a crawler, so there is nothing
 * here worth indexing and a thin empty page would only compete with the
 * programme pages that sell.
 */
export const Route = createFileRoute("/$lang/panier")({
  head: ({ params }) => {
    const t = tFor(params.lang);
    return {
      meta: [
        { title: t("meta.cart.title") },
        { name: "description", content: t("meta.cart.desc") },
        { name: "robots", content: "noindex, follow" },
      ],
    };
  },
  component: CartPage,
});

function CartPage() {
  const lang = useLocale();
  const t = useT();
  const lines = useCart();
  const [sent, setSent] = useState(false);

  const total = cartTotal(lines);
  const currency = t("price.currency");

  if (sent) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-3xl bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BadgeCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl">{t("cart.sentTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("cart.sentBody")}</p>
          <Link to="/$lang" params={{ lang }} className="btn-primary mt-6 inline-flex">
            {t("cart.browse")}
          </Link>
        </div>
      </Shell>
    );
  }

  if (lines.length === 0) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl">{t("cart.empty")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("cart.emptyLead")}</p>
          <Link to="/$lang/omra" params={{ lang }} className="btn-primary mt-6 inline-flex">
            {t("cart.browse")}
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Reveal>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{t("cart.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("cart.lead")}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <Reveal>
          <ul className="space-y-4">
            {lines.map((l) => (
              <li
                key={l.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold">
                      {pick(lang, l.title)}
                    </h2>
                    <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {l.details.map((d) => (
                        <div key={d.label} className="flex gap-2">
                          <dt>{t(d.label)}:</dt>
                          <dd className="font-medium text-foreground">
                            {d.localized
                              ? pick(lang, d.localized)
                              : d.translate
                                ? t(d.value as TranslationKey)
                                : d.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(l.id)}
                    aria-label={t("cart.remove")}
                    className="shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{t("cart.people")}</span>
                    <div className="flex items-center gap-1 rounded-full border border-border">
                      <Stepper
                        label="-"
                        onClick={() => setPeople(l.id, l.people - 1)}
                        disabled={l.people <= 1}
                      />
                      <span className="w-8 text-center text-sm font-semibold">{l.people}</span>
                      <Stepper label="+" onClick={() => setPeople(l.id, l.people + 1)} />
                    </div>
                  </div>
                  <div className="text-end">
                    {lineTotal(l) > 0 ? (
                      <>
                        {/* "20.500 DH × 2", not "… / Voyageurs": the plural
                            label reads as "per Travellers" in every language. */}
                        <div className="text-xs text-muted-foreground">
                          <bdi dir="ltr">
                            {l.unitPrice} {currency} × {l.people}
                          </bdi>
                        </div>
                        <div className="font-display text-lg font-bold text-primary">
                          <bdi dir="ltr">
                            {numberToPrice(lineTotal(l))} {currency}
                          </bdi>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm font-medium text-muted-foreground">
                        {/* An unpriced combination stores "" — show the
                            agency's own wording, not a blank gap. */}
                        {l.unitPrice || t("tour.onRequest")}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <form
            className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const value = (name: string) => String(f.get(name) ?? "");
              submitBooking({
                kind: "cart",
                subject: `${t("cart.title")} — ${cartCount(lines)} ${t("cart.people")}`,
                fields: [
                  ...checkoutFields(lines, t, (title) => pick(lang, title), currency),
                  [t("cart.total"), `${numberToPrice(total)} ${currency}`],
                  [t("book.fullName"), value("fullName")],
                  [t("contact.email"), value("email")],
                  [t("book.phone"), value("phone")],
                ],
              });
              clearCart();
              setSent(true);
            }}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-display text-lg font-semibold">{t("cart.total")}</span>
              <span className="font-display text-xl font-bold text-primary">
                <bdi dir="ltr">
                  {numberToPrice(total)} {currency}
                </bdi>
              </span>
            </div>

            {hasQuoteOnly(lines) && (
              <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                {t("cart.quoteNote")}
              </p>
            )}

            <h2 className="pt-2 font-display text-base font-semibold">{t("cart.yourDetails")}</h2>
            <Field name="fullName" label={t("book.fullName")} />
            <Field name="phone" label={t("book.phone")} type="tel" />
            <Field name="email" label={t("contact.email")} type="email" required={false} />

            <button type="submit" className="btn-primary w-full justify-center">
              {t("cart.checkout")}
            </button>

            {/* Said plainly, on the page where a visitor would expect to be
                asked for a card. Nothing on this site takes a payment. */}
            <p className="text-xs leading-relaxed text-muted-foreground">{t("cart.noPayment")}</p>
          </form>
        </Reveal>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page pb-20 pt-32 sm:pt-40">{children}</main>
      <Footer />
    </div>
  );
}

function Stepper({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted disabled:opacity-40"
    >
      {label === "+" ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
