import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

/**
 * Skeleton loading states — shown by TanStack Router's `pendingComponent`
 * while a route's loader waits on the content provider (WordPress fetch).
 *
 * Principle: keep the static chrome REAL (header, page-title band — we always
 * know those), and only ghost the data-driven parts. The shimmer color derives
 * from the brand seed (see `skeleton` utility in styles.css), so it retints
 * per client automatically.
 */

/** Base ghost block. Compose with sizing/rounding classes. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton ${className}`} />;
}

/** Matches TourCard's exact geometry so the swap causes zero layout shift. */
export function TourCardSkeleton() {
  return (
    <div className="relative block aspect-[3/4] w-full overflow-hidden rounded-[28px] shadow-[var(--shadow-soft)]">
      <Skeleton className="absolute inset-0 h-full w-full" />
      {/* price pill — top right */}
      <div className="absolute right-4 top-4 h-9 w-24 rounded-full bg-white/70" />
      {/* title + date — bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="h-6 w-3/4 rounded-lg bg-white/70" />
        <div className="mt-3 h-9 w-32 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

/**
 * Listing pages (Voyages organisés, Circuits, OMRA) — real title band,
 * ghost card grid.
 */
export function ListingSkeleton({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">{title}</h1>
          <Skeleton className="mt-4 h-5 w-full max-w-2xl rounded-lg" />
        </div>
      </div>
      <div className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

/** Detail pages (voyage / OMRA program) — ghost hero + ghost content blocks. */
export function DetailSkeleton() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Skeleton className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="relative z-10 flex h-full items-end pb-16 pt-40">
          <div className="container-page">
            <div className="h-8 w-40 rounded-full bg-white/70" />
            <div className="mt-4 h-12 w-2/3 max-w-xl rounded-xl bg-white/80" />
            <div className="mt-4 h-6 w-1/2 max-w-md rounded-lg bg-white/60" />
          </div>
        </div>
      </section>
      <div className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-7 w-56 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="mt-8 h-7 w-44 rounded-lg" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
