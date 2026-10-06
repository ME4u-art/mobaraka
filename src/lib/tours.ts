import hero from "@/assets/hero-samarkand.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";
import hajj from "@/assets/hajj.jpg";
import cruise from "@/assets/cruise.jpg";
import thailand from "@/assets/tour-thailand.jpg";
import prague from "@/assets/tour-prague.jpg";
import sahara from "@/assets/dest-sahara.jpg";
import { pick, pickList } from "@/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/types";
import type { Locale, Localized, LocalizedList } from "@/i18n/types";

/** Template design imagery — page heroes and section backdrops. */
export const IMG = { hero, marrakech, hajj, cruise, thailand, prague, sahara };

export type ItineraryDay = {
  day: Localized; // "Jour 1"
  title: Localized; // "Le Caire"
  description: Localized;
  meals?: LocalizedList; // ["Petit déjeuner", "Dîner"]
  image?: string;
};

/** `hotels` stays one string: hotel brands read the same in every script. */
export type Lodging = { city: Localized; nights: Localized; hotels: string };

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
  title?: Localized;
  dates?: Localized;
  columns: LocalizedList;
  columnRoles?: ColumnRole[]; // aligns with columns[1..]; enables the price estimator
  rows: { label: Localized; sub?: Localized; cells: string[] }[];
};

// Flight schedule (one block per departure): route, date, flight number, times.
export type FlightLeg = {
  route: string;
  date: string;
  flightNo: string;
  departure: string;
  arrival: string;
};
/** Legs stay plain: airport codes, times and flight numbers are not prose. */
export type FlightSchedule = { title?: Localized; legs: FlightLeg[] };

export type Tour = {
  slug: string;
  title: Localized;
  subtitle: Localized;
  duration: Localized;
  dates: Localized;
  /** Digits only, e.g. "12.900" — money() adds the reader's currency. */
  price: string;
  image: string;
  region: Localized;
  airline?: string; // carrier brand, not prose
  priceNote?: Localized;
  overview?: Localized;
  route?: LocalizedList; // city path: ["Casablanca", "Istanbul", ...]
  highlights?: LocalizedList;
  included?: LocalizedList;
  notIncluded?: LocalizedList;
  itinerary?: ItineraryDay[];
  hebergement?: Lodging[];
  priceTables?: PriceTable[];
  flights?: FlightSchedule[]; // détails des vols par départ
  options?: LocalizedList; // excursions / suppléments en option
  notes?: LocalizedList; // bagages, paiement, annulation, passeport…
  departures?: LocalizedList; // booking-form date options
  bookingUrl?: string; // external online checkout (e.g. the client's WooCommerce product page)
  deal?: boolean; // flag for the "Bons plans" (Great Deals) page
  oldPrice?: string; // struck-through original price, shown when `deal` is true
  featuredHero?: boolean; // wp-admin « À la une (hero) » — home carousel
  featuredHome?: boolean; // wp-admin « Programme vedette » — home featured strip
};

/** Wrap single-language values — used by the WordPress mapper. */
export const monoT = (v: string): Localized => ({ fr: v, ar: v, en: v });
export const monoTList = (v: string[]): LocalizedList => ({ fr: v, ar: v, en: v });

export const circuits: Tour[] = [];

// Demo « voyages organisés » — replaced as soon as the client publishes
// their own programmes in wp-admin.
export const voyagesOrganises: Tour[] = [
  {
    slug: "dakhla-aout-2026",
    title: monoT("Dakhla — L'évasion authentique"),
    subtitle: monoT("Quatre jours entre lagune, dunes et sources thermales"),
    duration: monoT("4 jours / 3 nuits"),
    dates: monoT("Du 27/08/2026 au 30/08/2026"),
    price: "4 900",
    priceNote: monoT("Par personne en bungalow quadruple, pension complète. Triple 5 450 dh, double 5 950 dh."),
    // Stand-in until the agency sends a real Dakhla photo.
    image: sahara,
    region: monoT("Maroc — Sud"),
    airline: "Royal Air Maroc",
    overview: monoT("Quatre jours à Dakhla en pension complète, au bord de la lagune. Vol Royal Air Maroc à l'aller depuis Rabat et retour sur Casablanca, hébergement en bungalow au West Point Dakhla et transferts assurés."),
    highlights: monoTList([
      "Hébergement au West Point Dakhla",
      "Pension complète",
      "Transferts aéroport / hôtel inclus",
      "Excursions en option : Porto Rico, source thermale d'Asnaa, dune blanche",
    ]),
    included: monoTList([
      "Vol Royal Air Maroc — aller Rabat → Dakhla, retour Dakhla → Casablanca",
      "Transferts aéroport / hôtel",
      "3 nuits en bungalow double, triple ou quadruple",
      "Pension complète",
    ]),
    notIncluded: monoTList([
      "Les trois excursions : 300 dh (plage Porto Rico, source thermale d'Asnaa, dune blanche)",
      "Les boissons et dépenses personnelles",
      "L'assurance voyage",
    ]),
    route: monoTList(["Rabat", "Dakhla", "Casablanca"]),
    hebergement: [{ city: monoT("Dakhla"), nights: monoT("3"), hotels: "West Point Dakhla — bungalows" }],
    priceTables: [
      {
        title: monoT("Prix par personne (dh)"),
        dates: monoT("Du 27/08 au 30/08/2026"),
        columns: monoTList(["Formule", "Chambre double", "Chambre triple", "Quadruple"]),
        columnRoles: [{ kind: "adultDouble" }, { kind: "adultTriple" }, { kind: "adultTriple" }],
        rows: [
          {
            label: monoT("West Point Dakhla"),
            sub: monoT("Bungalow, pension complète"),
            cells: ["5 950", "5 450", "4 900"],
          },
        ],
      },
    ],
    options: monoTList(["Les trois excursions : 300 dh par personne"]),
  },
  // ---------------------------------------------------------------------
  // DEMO CONTENT — invented programmes written to show the client what a
  // full page looks like. Prices are round demo figures, not real quotes.
  // Delete both once the agency sends their own programmes.
  // ---------------------------------------------------------------------
  {
    slug: "istanbul-demo",
    title: monoT("Istanbul — entre deux continents"),
    subtitle: monoT("La Corne d'Or, le Bosphore et les grands bazars"),
    duration: monoT("6 jours / 5 nuits"),
    dates: monoT("Départs chaque samedi"),
    price: "8 900",
    priceNote: monoT("Par personne en chambre double, vol et petit déjeuner inclus."),
    // Stand-in image — à remplacer par une vraie photo d'Istanbul.
    image: hero,
    region: monoT("Turquie"),
    airline: "Turkish Airlines",
    overview: monoT("Six jours pour traverser Istanbul d'une rive à l'autre : les mosquées et les palais de la vieille ville le matin, les quartiers vivants de la rive européenne l'après-midi, et une croisière sur le Bosphore au coucher du soleil."),
    route: monoTList(["Casablanca", "Istanbul", "Casablanca"]),
    highlights: monoTList([
      "Sainte-Sophie et la Mosquée Bleue",
      "Croisière sur le Bosphore au coucher du soleil",
      "Grand Bazar et bazar aux épices",
      "Palais de Topkapi et ses jardins",
    ]),
    included: monoTList([
      "Billet d'avion aller-retour au départ de Casablanca",
      "5 nuits en hôtel 4* avec petit déjeuner",
      "Transferts aéroport - hôtel - aéroport",
      "Guide francophone pour les visites du programme",
      "Croisière sur le Bosphore",
    ]),
    notIncluded: monoTList([
      "Les déjeuners et les dîners",
      "Les entrées des musées non citées",
      "L'assurance voyage",
      "Les dépenses personnelles",
    ]),
    itinerary: [
      {
        day: monoT("Jour 1"),
        title: monoT("Envol vers Istanbul"),
        description: monoT("Départ de Casablanca, accueil à l'aéroport d'Istanbul et transfert à l'hôtel. Soirée libre."),
        meals: monoTList(["Dîner"]),
      },
      {
        day: monoT("Jour 2"),
        title: monoT("La vieille ville"),
        description: monoT("Sainte-Sophie, la Mosquée Bleue et l'Hippodrome à pied, puis après-midi au Grand Bazar."),
        meals: monoTList(["Petit déjeuner"]),
      },
      {
        day: monoT("Jour 3"),
        title: monoT("Topkapi et la Corne d'Or"),
        description: monoT("Visite du palais de Topkapi le matin, promenade dans le quartier de Balat l'après-midi."),
        meals: monoTList(["Petit déjeuner"]),
      },
      {
        day: monoT("Jour 4"),
        title: monoT("Croisière sur le Bosphore"),
        description: monoT("Navigation entre les deux rives, arrêt sur la rive asiatique et retour au coucher du soleil."),
        meals: monoTList(["Petit déjeuner"]),
      },
      {
        day: monoT("Jour 5"),
        title: monoT("Journée libre"),
        description: monoT("Shopping à Istiklal, ou excursion en option vers les îles aux Princes."),
        meals: monoTList(["Petit déjeuner"]),
      },
      {
        day: monoT("Jour 6"),
        title: monoT("Retour"),
        description: monoT("Transfert vers l'aéroport et vol retour sur Casablanca."),
        meals: monoTList(["Petit déjeuner"]),
      },
    ],
    hebergement: [
      { city: monoT("Istanbul"), nights: monoT("5 nuits"), hotels: "Hôtel 4* quartier Sultanahmet ou Taksim" },
    ],
    priceTables: [
      {
        title: monoT("Prix par personne (dh)"),
        columns: monoTList(["Formule", "Chambre double", "Chambre triple", "Chambre single"]),
        columnRoles: [
          { kind: "adultDouble" },
          { kind: "adultTriple" },
          { kind: "single", mode: "total" },
        ],
        rows: [
          { label: monoT("Hôtel 4*"), cells: ["8 900", "8 500", "11 200"] },
          { label: monoT("Hôtel 5*"), cells: ["11 500", "10 900", "14 800"] },
        ],
      },
    ],
    options: monoTList([
      "Excursion aux îles aux Princes : 450 dh par personne",
      "Dîner-spectacle sur le Bosphore : 600 dh par personne",
    ]),
    notes: monoTList([
      "Passeport valable 6 mois après la date de retour.",
      "Inscription confirmée après versement d'un acompte de 50%.",
    ]),
    departures: monoTList(["Samedi 12/09/2026", "Samedi 26/09/2026", "Samedi 10/10/2026"]),
  },
  {
    slug: "dubai-demo",
    title: monoT("Dubaï — la ville verticale"),
    subtitle: monoT("Gratte-ciel, désert et souks au bord du Golfe"),
    duration: monoT("5 jours / 4 nuits"),
    dates: monoT("Départs toute l'année"),
    price: "12 500",
    priceNote: monoT("Par personne en chambre double, vol et petit déjeuner inclus."),
    // Stand-in image — à remplacer par une vraie photo de Dubaï.
    image: hero,
    region: monoT("Émirats arabes unis"),
    airline: "Emirates",
    overview: monoT("Quatre nuits pour voir les deux visages de Dubaï : la ville de verre avec le Burj Khalifa et la marina, et le désert avec un safari en 4x4 et un dîner sous tente."),
    route: monoTList(["Casablanca", "Dubaï", "Casablanca"]),
    highlights: monoTList([
      "Burj Khalifa, étages 124 et 125",
      "Safari dans le désert et dîner sous tente",
      "Souk de l'or et souk aux épices de Deira",
      "Dubaï Marina et la plage de Jumeirah",
    ]),
    included: monoTList([
      "Billet d'avion aller-retour au départ de Casablanca",
      "4 nuits en hôtel 4* avec petit déjeuner",
      "Transferts aéroport - hôtel - aéroport",
      "Safari dans le désert avec dîner",
      "Tour de ville guidé en français",
    ]),
    notIncluded: monoTList([
      "Le visa émirati",
      "Les déjeuners et les dîners hors safari",
      "L'assurance voyage",
      "Les dépenses personnelles",
    ]),
    itinerary: [
      {
        day: monoT("Jour 1"),
        title: monoT("Arrivée à Dubaï"),
        description: monoT("Vol depuis Casablanca, accueil et transfert à l'hôtel. Soirée libre."),
        meals: monoTList(["Dîner"]),
      },
      {
        day: monoT("Jour 2"),
        title: monoT("Tour de ville"),
        description: monoT("Mosquée de Jumeirah, quartier historique d'Al Fahidi, traversée de la crique en abra et souks de Deira."),
        meals: monoTList(["Petit déjeuner"]),
      },
      {
        day: monoT("Jour 3"),
        title: monoT("Safari dans le désert"),
        description: monoT("Matinée libre, puis départ en 4x4 dans les dunes, coucher de soleil et dîner sous tente."),
        meals: monoTList(["Petit déjeuner", "Dîner"]),
      },
      {
        day: monoT("Jour 4"),
        title: monoT("Burj Khalifa et la marina"),
        description: monoT("Montée au sommet du Burj Khalifa, Dubai Mall, puis promenade à Dubaï Marina."),
        meals: monoTList(["Petit déjeuner"]),
      },
      {
        day: monoT("Jour 5"),
        title: monoT("Retour"),
        description: monoT("Temps libre selon l'horaire du vol, transfert et retour sur Casablanca."),
        meals: monoTList(["Petit déjeuner"]),
      },
    ],
    hebergement: [
      { city: monoT("Dubaï"), nights: monoT("4 nuits"), hotels: "Hôtel 4* quartier Deira ou Bur Dubaï" },
    ],
    priceTables: [
      {
        title: monoT("Prix par personne (dh)"),
        columns: monoTList(["Formule", "Chambre double", "Chambre triple", "Chambre single"]),
        columnRoles: [
          { kind: "adultDouble" },
          { kind: "adultTriple" },
          { kind: "single", mode: "total" },
        ],
        rows: [
          { label: monoT("Hôtel 4*"), cells: ["12 500", "11 900", "15 900"] },
          { label: monoT("Hôtel 5* Marina"), cells: ["16 900", "15 900", "21 500"] },
        ],
      },
    ],
    options: monoTList([
      "Excursion à Abou Dhabi et mosquée Cheikh Zayed : 850 dh par personne",
      "Croisière dîner sur la crique : 500 dh par personne",
    ]),
    notes: monoTList([
      "Passeport valable 6 mois après la date de retour.",
      "Visa émirati à prévoir, l'agence s'occupe du dossier.",
    ]),
    departures: monoTList(["Jeudi 17/09/2026", "Jeudi 15/10/2026", "Jeudi 12/11/2026"]),
  },
];

export const croisieres: Tour[] = [
  {
    slug: "croisiere-mediterranee-demo",
    title: monoT("Croisière en Méditerranée"),
    subtitle: monoT("Sept jours entre l'Italie, la France et l'Espagne"),
    duration: monoT("8 jours / 7 nuits"),
    dates: monoT("Départs de mai à septembre"),
    price: "11 500",
    oldPrice: "13 900",
    deal: true,
    priceNote: monoT("Par personne en cabine double intérieure, pension complète à bord."),
    image: cruise,
    region: monoT("Méditerranée"),
    overview: monoT("Une semaine de navigation entre trois pays, avec une escale par jour et la pension complète à bord. Les journées en mer laissent le temps de profiter des ponts, des piscines et des spectacles du soir."),
    highlights: monoTList([
      "Une escale chaque jour",
      "Pension complète à bord",
      "Animations et spectacles en soirée",
      "Cabine avec hublot en option",
    ]),
    included: monoTList([
      "7 nuits à bord en cabine double",
      "Pension complète (petit déjeuner, déjeuner, dîner)",
      "Accès aux piscines, spectacles et animations",
      "Taxes portuaires",
    ]),
    notIncluded: monoTList([
      "Les excursions à terre",
      "Les boissons",
      "Les pourboires d'équipage",
      "L'assurance voyage",
    ]),
    route: monoTList(["Barcelone", "Marseille", "Gênes", "Naples", "Barcelone"]),
  },
  {
    slug: "croisiere-iles-demo",
    title: monoT("Croisière îles et lagons"),
    subtitle: monoT("Navigation entre îles tropicales et plages de sable blanc"),
    duration: monoT("6 jours / 5 nuits"),
    dates: monoT("Départs d'octobre à mars"),
    price: "14 900",
    priceNote: monoT("Par personne en cabine double, petit déjeuner et dîner inclus."),
    image: thailand,
    region: monoT("Asie du Sud-Est"),
    overview: monoT("Un itinéraire court entre plusieurs îles, pensé pour ceux qui veulent alterner navigation, baignades et villages de pêcheurs."),
    highlights: monoTList([
      "Cinq îles en cinq jours",
      "Snorkeling au départ du bateau",
      "Couchers de soleil en mer",
    ]),
    included: monoTList(["5 nuits à bord", "Demi-pension", "Transferts port / aéroport"]),
    notIncluded: monoTList(["Les vols internationaux", "Les activités nautiques payantes"]),
  },
];

// Séjours linguistiques — contenu de démonstration.
export const sejoursLinguistiques: Tour[] = [
  {
    slug: "sejour-linguistique-anglais-demo",
    title: monoT("Séjour linguistique — Anglais"),
    subtitle: monoT("Cours d'anglais en petits groupes et hébergement en famille"),
    duration: monoT("2 semaines"),
    dates: monoT("Sessions en juillet et août"),
    price: "18 500",
    priceNote: monoT("Par participant : cours, hébergement en famille d'accueil et demi-pension."),
    image: prague,
    region: monoT("Europe"),
    overview: monoT("Deux semaines de cours d'anglais le matin et d'activités culturelles l'après-midi, avec un hébergement en famille d'accueil pour pratiquer la langue au quotidien. Encadrement assuré pour les mineurs."),
    highlights: monoTList([
      "20 heures de cours par semaine",
      "Groupes de 12 participants maximum",
      "Test de niveau à l'arrivée",
      "Certificat de fin de séjour",
    ]),
    included: monoTList([
      "Cours de langue et matériel pédagogique",
      "Hébergement en famille d'accueil, demi-pension",
      "Activités culturelles et sportives",
      "Transferts aéroport aller-retour",
    ]),
    notIncluded: monoTList(["Le billet d'avion", "Les dépenses personnelles", "L'assurance voyage"]),
  },
  {
    slug: "sejour-linguistique-junior-demo",
    title: monoT("Séjour linguistique junior"),
    subtitle: monoT("Campus d'été encadré pour les 12–17 ans"),
    duration: monoT("3 semaines"),
    dates: monoT("Session d'été"),
    price: "24 900",
    priceNote: monoT("Par participant, pension complète sur le campus."),
    image: hero,
    region: monoT("Europe"),
    overview: monoT("Un programme d'été qui combine cours de langue, sport et sorties, avec un encadrement permanent et une résidence sur le campus."),
    highlights: monoTList(["Encadrement 24h/24", "Résidence sur le campus", "Sorties le week-end"]),
    included: monoTList(["Cours de langue", "Pension complète", "Activités et sorties encadrées"]),
    notIncluded: monoTList(["Le billet d'avion", "L'argent de poche"]),
  },
];

export const allTours: Tour[] = [
  ...circuits,
  ...voyagesOrganises,
  ...croisieres,
  ...sejoursLinguistiques,
];

export type LocalizedTour = Omit<
  Tour,
  | "title" | "subtitle" | "duration" | "dates" | "region" | "priceNote" | "overview"
  | "route" | "highlights" | "included" | "notIncluded" | "options" | "notes"
  | "departures" | "itinerary" | "hebergement" | "priceTables" | "flights"
> & {
  title: string;
  subtitle: string;
  duration: string;
  dates: string;
  region: string;
  priceNote?: string;
  overview?: string;
  route?: string[];
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  options?: string[];
  notes?: string[];
  departures?: string[];
  itinerary?: { day: string; title: string; description: string; meals?: string[]; image?: string }[];
  hebergement?: { city: string; nights: string; hotels: string }[];
  priceTables?: {
    title?: string;
    dates?: string;
    columns: string[];
    columnRoles?: ColumnRole[];
    rows: { label: string; sub?: string; cells: string[] }[];
  }[];
  flights?: { title?: string; legs: FlightLeg[] }[];
};

/**
 * Resolve a whole programme into one language up front, so pages and cards go
 * on rendering plain strings instead of calling pick() at every field.
 */
export function localizeTour(t: Tour, locale: Locale): LocalizedTour {
  const s = (v: Localized | undefined) => (v ? pick(locale, v) : "");
  const opt = (v: Localized | undefined) => (v ? pick(locale, v) : undefined);
  const l = (v: LocalizedList | undefined) => (v ? pickList(locale, v) : undefined);
  return {
    ...t,
    title: s(t.title),
    subtitle: s(t.subtitle),
    duration: s(t.duration),
    dates: s(t.dates),
    region: s(t.region),
    priceNote: opt(t.priceNote),
    overview: opt(t.overview),
    route: l(t.route),
    highlights: l(t.highlights),
    included: l(t.included),
    notIncluded: l(t.notIncluded),
    options: l(t.options),
    notes: l(t.notes),
    departures: l(t.departures),
    itinerary: t.itinerary?.map((d) => ({
      day: s(d.day),
      title: s(d.title),
      description: s(d.description),
      meals: l(d.meals),
      image: d.image,
    })),
    hebergement: t.hebergement?.map((h) => ({
      city: s(h.city),
      nights: s(h.nights),
      hotels: h.hotels,
    })),
    priceTables: t.priceTables?.map((p) => ({
      title: opt(p.title),
      dates: opt(p.dates),
      columns: pickList(locale, p.columns),
      columnRoles: p.columnRoles,
      rows: p.rows.map((r) => ({ label: s(r.label), sub: opt(r.sub), cells: r.cells })),
    })),
    flights: t.flights?.map((f) => ({ title: opt(f.title), legs: f.legs })),
  };
}

/** Same, where the language is a raw route param rather than a checked Locale. */
export function localizeTourFor(t: Tour, lang: unknown): LocalizedTour {
  return localizeTour(t, isLocale(lang) ? lang : DEFAULT_LOCALE);
}
