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
  // ---------------------------------------------------------------------
  // DEMO CONTENT — invented programmes written to show the client what a
  // full page looks like. Prices are round demo figures, not real quotes.
  // Delete both once the agency sends their own programmes.
  // ---------------------------------------------------------------------
  {
    slug: "istanbul-demo",
    title: "Istanbul — entre deux continents",
    subtitle: "La Corne d'Or, le Bosphore et les grands bazars",
    duration: "6 jours / 5 nuits",
    dates: "Départs chaque samedi",
    price: "8 900 dh",
    priceNote: "Par personne en chambre double, vol et petit déjeuner inclus.",
    // Stand-in image — à remplacer par une vraie photo d'Istanbul.
    image: hero,
    region: "Turquie",
    airline: "Turkish Airlines",
    overview:
      "Six jours pour traverser Istanbul d'une rive à l'autre : les mosquées et les palais de la vieille ville le matin, les quartiers vivants de la rive européenne l'après-midi, et une croisière sur le Bosphore au coucher du soleil.",
    route: ["Casablanca", "Istanbul", "Casablanca"],
    highlights: [
      "Sainte-Sophie et la Mosquée Bleue",
      "Croisière sur le Bosphore au coucher du soleil",
      "Grand Bazar et bazar aux épices",
      "Palais de Topkapi et ses jardins",
    ],
    included: [
      "Billet d'avion aller-retour au départ de Casablanca",
      "5 nuits en hôtel 4* avec petit déjeuner",
      "Transferts aéroport - hôtel - aéroport",
      "Guide francophone pour les visites du programme",
      "Croisière sur le Bosphore",
    ],
    notIncluded: [
      "Les déjeuners et les dîners",
      "Les entrées des musées non citées",
      "L'assurance voyage",
      "Les dépenses personnelles",
    ],
    itinerary: [
      {
        day: "Jour 1",
        title: "Envol vers Istanbul",
        description:
          "Départ de Casablanca, accueil à l'aéroport d'Istanbul et transfert à l'hôtel. Soirée libre.",
        meals: ["Dîner"],
      },
      {
        day: "Jour 2",
        title: "La vieille ville",
        description:
          "Sainte-Sophie, la Mosquée Bleue et l'Hippodrome à pied, puis après-midi au Grand Bazar.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 3",
        title: "Topkapi et la Corne d'Or",
        description:
          "Visite du palais de Topkapi le matin, promenade dans le quartier de Balat l'après-midi.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 4",
        title: "Croisière sur le Bosphore",
        description:
          "Navigation entre les deux rives, arrêt sur la rive asiatique et retour au coucher du soleil.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 5",
        title: "Journée libre",
        description: "Shopping à Istiklal, ou excursion en option vers les îles aux Princes.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 6",
        title: "Retour",
        description: "Transfert vers l'aéroport et vol retour sur Casablanca.",
        meals: ["Petit déjeuner"],
      },
    ],
    hebergement: [
      { city: "Istanbul", nights: "5 nuits", hotels: "Hôtel 4* quartier Sultanahmet ou Taksim" },
    ],
    priceTables: [
      {
        title: "Prix par personne (dh)",
        columns: ["Formule", "Chambre double", "Chambre triple", "Chambre single"],
        columnRoles: [
          { kind: "adultDouble" },
          { kind: "adultTriple" },
          { kind: "single", mode: "total" },
        ],
        rows: [
          { label: "Hôtel 4*", cells: ["8 900", "8 500", "11 200"] },
          { label: "Hôtel 5*", cells: ["11 500", "10 900", "14 800"] },
        ],
      },
    ],
    options: [
      "Excursion aux îles aux Princes : 450 dh par personne",
      "Dîner-spectacle sur le Bosphore : 600 dh par personne",
    ],
    notes: [
      "Passeport valable 6 mois après la date de retour.",
      "Inscription confirmée après versement d'un acompte de 50%.",
    ],
    departures: ["Samedi 12/09/2026", "Samedi 26/09/2026", "Samedi 10/10/2026"],
  },
  {
    slug: "dubai-demo",
    title: "Dubaï — la ville verticale",
    subtitle: "Gratte-ciel, désert et souks au bord du Golfe",
    duration: "5 jours / 4 nuits",
    dates: "Départs toute l'année",
    price: "12 500 dh",
    priceNote: "Par personne en chambre double, vol et petit déjeuner inclus.",
    // Stand-in image — à remplacer par une vraie photo de Dubaï.
    image: hero,
    region: "Émirats arabes unis",
    airline: "Emirates",
    overview:
      "Quatre nuits pour voir les deux visages de Dubaï : la ville de verre avec le Burj Khalifa et la marina, et le désert avec un safari en 4x4 et un dîner sous tente.",
    route: ["Casablanca", "Dubaï", "Casablanca"],
    highlights: [
      "Burj Khalifa, étages 124 et 125",
      "Safari dans le désert et dîner sous tente",
      "Souk de l'or et souk aux épices de Deira",
      "Dubaï Marina et la plage de Jumeirah",
    ],
    included: [
      "Billet d'avion aller-retour au départ de Casablanca",
      "4 nuits en hôtel 4* avec petit déjeuner",
      "Transferts aéroport - hôtel - aéroport",
      "Safari dans le désert avec dîner",
      "Tour de ville guidé en français",
    ],
    notIncluded: [
      "Le visa émirati",
      "Les déjeuners et les dîners hors safari",
      "L'assurance voyage",
      "Les dépenses personnelles",
    ],
    itinerary: [
      {
        day: "Jour 1",
        title: "Arrivée à Dubaï",
        description: "Vol depuis Casablanca, accueil et transfert à l'hôtel. Soirée libre.",
        meals: ["Dîner"],
      },
      {
        day: "Jour 2",
        title: "Tour de ville",
        description:
          "Mosquée de Jumeirah, quartier historique d'Al Fahidi, traversée de la crique en abra et souks de Deira.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 3",
        title: "Safari dans le désert",
        description:
          "Matinée libre, puis départ en 4x4 dans les dunes, coucher de soleil et dîner sous tente.",
        meals: ["Petit déjeuner", "Dîner"],
      },
      {
        day: "Jour 4",
        title: "Burj Khalifa et la marina",
        description: "Montée au sommet du Burj Khalifa, Dubai Mall, puis promenade à Dubaï Marina.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 5",
        title: "Retour",
        description: "Temps libre selon l'horaire du vol, transfert et retour sur Casablanca.",
        meals: ["Petit déjeuner"],
      },
    ],
    hebergement: [
      { city: "Dubaï", nights: "4 nuits", hotels: "Hôtel 4* quartier Deira ou Bur Dubaï" },
    ],
    priceTables: [
      {
        title: "Prix par personne (dh)",
        columns: ["Formule", "Chambre double", "Chambre triple", "Chambre single"],
        columnRoles: [
          { kind: "adultDouble" },
          { kind: "adultTriple" },
          { kind: "single", mode: "total" },
        ],
        rows: [
          { label: "Hôtel 4*", cells: ["12 500", "11 900", "15 900"] },
          { label: "Hôtel 5* Marina", cells: ["16 900", "15 900", "21 500"] },
        ],
      },
    ],
    options: [
      "Excursion à Abou Dhabi et mosquée Cheikh Zayed : 850 dh par personne",
      "Croisière dîner sur la crique : 500 dh par personne",
    ],
    notes: [
      "Passeport valable 6 mois après la date de retour.",
      "Visa émirati à prévoir, l'agence s'occupe du dossier.",
    ],
    departures: ["Jeudi 17/09/2026", "Jeudi 15/10/2026", "Jeudi 12/11/2026"],
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
