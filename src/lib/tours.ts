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
export const voyagesOrganises: Tour[] = [
  {
    slug: "dakhla-aout-2026",
    title: "Dakhla — L'évasion authentique",
    subtitle: "Quatre jours entre lagune, dunes et sources thermales",
    duration: "4 jours / 3 nuits",
    dates: "Du 27/08/2026 au 30/08/2026",
    price: "4 900 dh",
    priceNote:
      "Par personne en bungalow quadruple, pension complète. Triple 5 450 dh, double 5 950 dh.",
    // TODO: remplacer par une vraie photo de Dakhla fournie par l'agence.
    image: "/placeholder.svg",
    region: "Maroc — Sud",
    airline: "Royal Air Maroc",
    overview:
      "Quatre jours à Dakhla en pension complète, au bord de la lagune. Vol Royal Air Maroc à l'aller depuis Rabat et retour sur Casablanca, hébergement en bungalow au West Point Dakhla et transferts assurés.",
    highlights: [
      "Hébergement au West Point Dakhla",
      "Pension complète",
      "Transferts aéroport / hôtel inclus",
      "Excursions en option : Porto Rico, source thermale d'Asnaa, dune blanche",
    ],
    included: [
      "Vol Royal Air Maroc — aller Rabat → Dakhla, retour Dakhla → Casablanca",
      "Transferts aéroport / hôtel",
      "3 nuits en bungalow double, triple ou quadruple",
      "Pension complète",
    ],
    notIncluded: [
      "Les trois excursions : 300 dh (plage Porto Rico, source thermale d'Asnaa, dune blanche)",
      "Les boissons et dépenses personnelles",
      "L'assurance voyage",
    ],
    route: ["Rabat", "Dakhla", "Casablanca"],
    hebergement: [{ city: "Dakhla", nights: "3", hotels: "West Point Dakhla — bungalows" }],
    priceTables: [
      {
        title: "Prix par personne (dh)",
        dates: "Du 27/08 au 30/08/2026",
        columns: ["Formule", "Chambre double", "Chambre triple", "Quadruple"],
        columnRoles: [{ kind: "adultDouble" }, { kind: "adultTriple" }, { kind: "adultTriple" }],
        rows: [
          {
            label: "West Point Dakhla",
            sub: "Bungalow, pension complète",
            cells: ["5 950", "5 450", "4 900"],
          },
        ],
      },
    ],
    options: ["Les trois excursions : 300 dh par personne"],
  },
];

export const croisieres: Tour[] = [];

export const sejoursLinguistiques: Tour[] = [];

export const allTours: Tour[] = [
  ...circuits,
  ...voyagesOrganises,
  ...croisieres,
  ...sejoursLinguistiques,
];
