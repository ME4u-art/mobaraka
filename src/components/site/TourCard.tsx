import { localizeTour, type Tour } from "@/lib/tours";
import { useLocale, useT, money, priceOrQuote } from "@/i18n";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { HoverScale } from "@/components/motion/HoverScale";

export function TourCard({ tour: raw }: { tour: Tour }) {
  const t = useT();
  const lang = useLocale();
  // Every listing page renders through this card, so resolving here covers
  // circuits, croisières, séjours linguistiques, bons plans and the home strips.
  const tour = localizeTour(raw, lang);
  // Photo fades in over the brand-tinted shimmer once decoded (no pop-in).
  const [loaded, setLoaded] = useState(false);
  return (
    <HoverScale className="h-full w-full">
      <Link
        to="/$lang/voyages/$slug"
        params={{ lang, slug: tour.slug }}
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[28px] skeleton shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-lift)]"
      >
        {/* A programme whose photo has not arrived yet gets the brand gradient
            rather than a broken image or a grey placeholder box. */}
        {tour.image ? (
          <img
            src={tour.image}
            alt={tour.title}
            loading="lazy"
            ref={(el) => {
              if (el?.complete) setLoaded(true); // cached images fire no onLoad
            }}
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent" />
        )}
        {/* dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

        {/* deal badge — top left */}
        {tour.deal && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-md">
            {t("tour.deal")}
          </span>
        )}

        {/* price pill — top right (with struck-through old price when on deal) */}
        <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary shadow-md">
          {tour.deal && tour.oldPrice && (
            <span className="text-xs font-medium text-muted-foreground line-through">
              {money(tour.oldPrice, t)}
            </span>
          )}
          {priceOrQuote(tour.price, t)}
        </span>

        {/* title + date — bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h3 className="font-display text-2xl font-bold leading-tight drop-shadow-sm">
            {tour.title}
          </h3>
          <span className="mt-3 inline-block rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            {tour.dates}
          </span>
        </div>
      </Link>
    </HoverScale>
  );
}
