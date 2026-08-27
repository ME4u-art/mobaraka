import hero from "@/assets/hero-samarkand.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";
import hajj from "@/assets/hajj.jpg";

/** Template design imagery — page heroes and section backdrops. */
export const IMG = { hero, marrakech, hajj };

export type ItineraryDay = {
  day: string; // "Jour 1"
  title: string; // "Le Caire"
  description: string;
  meals?: string[]; // ["Petit déjeuner", "Dîner"]
  image?: string;
};

export type Lodging = { city: string; nights: string; hotels: string };

// Describes what each price column means, so the estimator can compute a total.
// One role per cell column (i.e. columns[1..]).
export type ColumnRole =
  | { kind: "adultDouble" }
  | { kind: "adultTriple" }
  | { kind: "single"; mode: "total" | "supp" } // total = full per-person price; supp = supplement over double
  | { kind: "child"; maxAge: number; ordinal?: number }; // ordinal: applies to the Nth child in that age band

// Flexible tariff grid: `columns` are the header labels (first column = row label),
// each row's `cells` line up with columns[1..]. "—" marks a non-applicable price.
export type PriceTable = {
  title?: string;
  dates?: string;
  columns: string[];
  columnRoles?: ColumnRole[]; // aligns with columns[1..]; enables the price estimator
  rows: { label: string; sub?: string; cells: string[] }[];
};

// Flight schedule (one block per departure): route, date, flight number, times.
export type FlightLeg = {
  route: string;
  date: string;
  flightNo: string;
  departure: string;
  arrival: string;
};
export type FlightSchedule = { title?: string; legs: FlightLeg[] };

export type Tour = {
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  dates: string;
  price: string;
  image: string;
  region: string;
  airline?: string;
  priceNote?: string;
  overview?: string;
  route?: string[]; // city path: ["Casablanca", "Istanbul", ...]
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  itinerary?: ItineraryDay[];
  hebergement?: Lodging[];
  priceTables?: PriceTable[];
  flights?: FlightSchedule[]; // détails des vols par départ
  options?: string[]; // excursions / suppléments en option
  notes?: string[]; // bagages, paiement, annulation, passeport…
  departures?: string[]; // booking-form date options
  bookingUrl?: string; // external online checkout (e.g. the client's WooCommerce product page)
  deal?: boolean; // flag for the "Bons plans" (Great Deals) page
  oldPrice?: string; // struck-through original price, shown when `deal` is true
  featuredHero?: boolean; // wp-admin « À la une (hero) » — home carousel
  featuredHome?: boolean; // wp-admin « Programme vedette » — home featured strip
};

export const circuits: Tour[] = [];

// Demo « voyages organisés » — replaced as soon as the client publishes
// their own programmes in wp-admin.
export const voyagesOrganises: Tour[] = [];

export const croisieres: Tour[] = [];

export const sejoursLinguistiques: Tour[] = [];

export const allTours: Tour[] = [
  ...circuits,
  ...voyagesOrganises,
  ...croisieres,
  ...sejoursLinguistiques,
];
