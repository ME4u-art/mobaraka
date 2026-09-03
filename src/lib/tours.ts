import hero from "@/assets/hero-samarkand.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";
import hajj from "@/assets/hajj.jpg";
import cruise from "@/assets/cruise.jpg";
import thailand from "@/assets/tour-thailand.jpg";
import prague from "@/assets/tour-prague.jpg";
import sahara from "@/assets/dest-sahara.jpg";

/** Template design imagery — page heroes and section backdrops. */
export const IMG = { hero, marrakech, hajj, cruise, thailand, prague, sahara };

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
    // Stand-in until the agency sends a real Dakhla photo.
    image: sahara,
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

export const croisieres: Tour[] = [
  {
    slug: "croisiere-mediterranee-demo",
    title: "Croisière en Méditerranée",
    subtitle: "Sept jours entre l'Italie, la France et l'Espagne",
    duration: "8 jours / 7 nuits",
    dates: "Départs de mai à septembre",
    price: "11 500 dh",
    oldPrice: "13 900 dh",
    deal: true,
    priceNote: "Par personne en cabine double intérieure, pension complète à bord.",
    image: cruise,
    region: "Méditerranée",
    overview:
      "Une semaine de navigation entre trois pays, avec une escale par jour et la pension complète à bord. Les journées en mer laissent le temps de profiter des ponts, des piscines et des spectacles du soir.",
    highlights: [
      "Une escale chaque jour",
      "Pension complète à bord",
      "Animations et spectacles en soirée",
      "Cabine avec hublot en option",
    ],
    included: [
      "7 nuits à bord en cabine double",
      "Pension complète (petit déjeuner, déjeuner, dîner)",
      "Accès aux piscines, spectacles et animations",
      "Taxes portuaires",
    ],
    notIncluded: [
      "Les excursions à terre",
      "Les boissons",
      "Les pourboires d'équipage",
      "L'assurance voyage",
    ],
    route: ["Barcelone", "Marseille", "Gênes", "Naples", "Barcelone"],
  },
  {
    slug: "croisiere-iles-demo",
    title: "Croisière îles et lagons",
    subtitle: "Navigation entre îles tropicales et plages de sable blanc",
    duration: "6 jours / 5 nuits",
    dates: "Départs d'octobre à mars",
    price: "14 900 dh",
    priceNote: "Par personne en cabine double, petit déjeuner et dîner inclus.",
    image: thailand,
    region: "Asie du Sud-Est",
    overview:
      "Un itinéraire court entre plusieurs îles, pensé pour ceux qui veulent alterner navigation, baignades et villages de pêcheurs.",
    highlights: [
      "Cinq îles en cinq jours",
      "Snorkeling au départ du bateau",
      "Couchers de soleil en mer",
    ],
    included: ["5 nuits à bord", "Demi-pension", "Transferts port / aéroport"],
    notIncluded: ["Les vols internationaux", "Les activités nautiques payantes"],
  },
];

// Séjours linguistiques — contenu de démonstration.
export const sejoursLinguistiques: Tour[] = [
  {
    slug: "sejour-linguistique-anglais-demo",
    title: "Séjour linguistique — Anglais",
    subtitle: "Cours d'anglais en petits groupes et hébergement en famille",
    duration: "2 semaines",
    dates: "Sessions en juillet et août",
    price: "18 500 dh",
    priceNote: "Par participant : cours, hébergement en famille d'accueil et demi-pension.",
    image: prague,
    region: "Europe",
    overview:
      "Deux semaines de cours d'anglais le matin et d'activités culturelles l'après-midi, avec un hébergement en famille d'accueil pour pratiquer la langue au quotidien. Encadrement assuré pour les mineurs.",
    highlights: [
      "20 heures de cours par semaine",
      "Groupes de 12 participants maximum",
      "Test de niveau à l'arrivée",
      "Certificat de fin de séjour",
    ],
    included: [
      "Cours de langue et matériel pédagogique",
      "Hébergement en famille d'accueil, demi-pension",
      "Activités culturelles et sportives",
      "Transferts aéroport aller-retour",
    ],
    notIncluded: ["Le billet d'avion", "Les dépenses personnelles", "L'assurance voyage"],
  },
  {
    slug: "sejour-linguistique-junior-demo",
    title: "Séjour linguistique junior",
    subtitle: "Campus d'été encadré pour les 12–17 ans",
    duration: "3 semaines",
    dates: "Session d'été",
    price: "24 900 dh",
    priceNote: "Par participant, pension complète sur le campus.",
    image: hero,
    region: "Europe",
    overview:
      "Un programme d'été qui combine cours de langue, sport et sorties, avec un encadrement permanent et une résidence sur le campus.",
    highlights: ["Encadrement 24h/24", "Résidence sur le campus", "Sorties le week-end"],
    included: ["Cours de langue", "Pension complète", "Activités et sorties encadrées"],
    notIncluded: ["Le billet d'avion", "L'argent de poche"],
  },
];

export const allTours: Tour[] = [
  ...circuits,
  ...voyagesOrganises,
  ...croisieres,
  ...sejoursLinguistiques,
];
