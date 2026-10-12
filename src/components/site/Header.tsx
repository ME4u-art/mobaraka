import { Link } from "@tanstack/react-router";
import { useLocale, useT, type TranslationKey } from "@/i18n";
import { cartCount, useCart } from "@/lib/cart";
import { Mail, Phone, Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { HoverScale } from "@/components/motion/HoverScale";
import { agency, isEnabled } from "@/config/agency";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

type NavItem = { to: string; key: TranslationKey; feature?: string };

// Travel collections — grouped under a "Nos voyages ▾" dropdown on desktop.
const voyagesGroup: NavItem[] = [
  { to: "/$lang/circuits", key: "nav.circuits", feature: "circuits" },
  { to: "/$lang/voyages-organises", key: "nav.voyagesOrganises", feature: "voyagesOrganises" },
  { to: "/$lang/croisieres", key: "nav.cruises", feature: "cruises" },
  { to: "/$lang/omra", key: "nav.omra", feature: "omra" },
  { to: "/$lang/sejours-linguistiques", key: "nav.languageStays", feature: "languageStays" },
  { to: "/$lang/bons-plans", key: "nav.greatDeals", feature: "greatDeals" },
];

// Standalone top-level entries.
const topNav: NavItem[] = [
  { to: "/$lang/mice", key: "nav.mice", feature: "mice" },
  { to: "/$lang/visa", key: "nav.visa", feature: "visa" },
  { to: "/$lang/gallery", key: "nav.gallery", feature: "gallery" },
  { to: "/$lang/a-propos", key: "nav.about" },
];

const shown = (items: NavItem[]) => items.filter((n) => !n.feature || isEnabled(n.feature));

// Flat list of every enabled entry — consumed by the NavTicker.
export const nav: NavItem[] = [...shown(voyagesGroup), ...shown(topNav)];

export function Header() {
  const lang = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  // "light" = white pill with the color logo; default "dark" = navy pill + on-dark logo.
  const light = agency.theme.headerStyle === "light";
  const pillLogo = light
    ? agency.identity.logo
    : (agency.identity.logoOnDark ?? agency.identity.logo);

  const voyages = shown(voyagesGroup);
  const tops = shown(topNav);

  const linkCls = light
    ? "text-foreground/75 hover:bg-black/5 hover:text-foreground"
    : "text-white/85 hover:bg-white/10 hover:text-white";
  const menuPanel = light
    ? "border-black/5 bg-white text-foreground"
    : "border-white/10 bg-navy text-white";

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="bg-primary/90 text-primary-foreground backdrop-blur">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-2 text-[11px] sm:flex-row sm:items-center sm:text-sm">
          <span className="hidden opacity-80 sm:inline">{agency.identity.tagline}</span>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-5">
            {/* A client who has not given us an email would otherwise get a
                bare icon linking to "mailto:" — worse than no line at all. */}
            {agency.contact.email && (
              <a
                href={`mailto:${agency.contact.email}`}
                className="inline-flex items-center gap-1.5 hover:opacity-80"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" /> {agency.contact.email}
              </a>
            )}
            <a
              href={`tel:${agency.contact.phones[0].replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 hover:opacity-80"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />{" "}
              <bdi dir="ltr">{agency.contact.phones[0]}</bdi>
            </a>
          </div>
        </div>
      </div>

      <div className="container-page mt-3">
        <div
          className={`flex items-center justify-between rounded-full border px-3 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur sm:px-5 sm:py-3 ${light ? "border-black/5 bg-white/95 text-foreground" : "border-white/10 bg-navy/95 text-white"}`}
        >
          <Link to="/$lang" params={{ lang }} className="flex items-center gap-2">
            <img
              src={pillLogo}
              alt={agency.identity.name}
              className="my-[-4px] h-10 w-auto sm:h-11 md:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {voyages.length === 1 && (
              <HoverScale>
                <Link
                  to={voyages[0].to}
                  params={{ lang }}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition ${linkCls}`}
                  activeProps={{
                    className: light ? "bg-black/5 text-primary" : "bg-white/15 text-white",
                  }}
                >
                  {t(voyages[0].key)}
                </Link>
              </HoverScale>
            )}
            {voyages.length > 1 && (
              <div className="relative group">
                <button
                  className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition ${linkCls}`}
                  aria-haspopup="true"
                >
                  {t("nav.voyages")}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                {/* pt-2 keeps a hoverable bridge under the button so the panel
                    doesn't close when the cursor crosses the gap. */}
                <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div
                    className={`min-w-[240px] translate-y-1 rounded-2xl border p-2 shadow-[var(--shadow-lift)] backdrop-blur transition duration-150 group-hover:translate-y-0 group-focus-within:translate-y-0 ${menuPanel}`}
                  >
                    {voyages.map((n) => (
                      <Link
                        key={n.to}
                        to={n.to}
                        params={{ lang }}
                        className={`block rounded-lg px-3 py-2 text-[13px] font-medium transition ${linkCls}`}
                        activeProps={{
                          className: light ? "bg-black/5 text-primary" : "bg-white/15 text-white",
                        }}
                      >
                        {t(n.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tops.map((n) => (
              <HoverScale key={n.to}>
                <Link
                  to={n.to}
                  params={{ lang }}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition ${linkCls}`}
                  activeProps={{
                    className: light ? "bg-black/5 text-primary" : "bg-white/15 text-white",
                  }}
                >
                  {t(n.key)}
                </Link>
              </HoverScale>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CartButton light={light} />
            <LanguageSwitcher />
            <HoverScale className="hidden sm:block">
              <Link to="/$lang/contact" params={{ lang }} className="btn-primary inline-flex">
                {t("nav.contact")}
              </Link>
            </HoverScale>
            <button
              onClick={() => setOpen((o) => !o)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border xl:hidden ${light ? "border-black/20 text-foreground" : "border-white/30 text-white"}`}
              aria-label={t("nav.menu")}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div
            className={`mt-2 rounded-2xl border p-3 shadow-[var(--shadow-lift)] xl:hidden ${light ? "border-black/5 bg-white" : "border-white/10 bg-navy"}`}
          >
            {voyages.length > 1 && (
              <div
                className={`px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider ${light ? "text-foreground/45" : "text-white/45"}`}
              >
                {t("nav.voyages")}
              </div>
            )}
            {voyages.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                params={{ lang }}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${linkCls}`}
              >
                {t(n.key)}
              </Link>
            ))}
            {tops.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                params={{ lang }}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${linkCls}`}
              >
                {t(n.key)}
              </Link>
            ))}
            <Link
              to="/$lang/contact"
              params={{ lang }}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {t("nav.contact")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * The cart button: a circular outline with the bag, and a count badge once
 * there is something in it.
 *
 * The cart is empty on the server and on the first client render (localStorage
 * is a browser-only global — see src/lib/cart.ts), so the badge appears on
 * hydration rather than being rendered server-side. That is deliberate: a
 * server-rendered count would be wrong for every visitor, and this is exactly
 * the class of bug that sent everyone to /en.
 */
function CartButton({ light }: { light: boolean }) {
  const lang = useLocale();
  const t = useT();
  const count = cartCount(useCart());
  return (
    <Link
      to="/$lang/panier"
      params={{ lang }}
      aria-label={t("cart.open")}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
        light
          ? "border-black/15 text-foreground hover:bg-black/5"
          : "border-white/25 text-white hover:bg-white/10"
      }`}
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
