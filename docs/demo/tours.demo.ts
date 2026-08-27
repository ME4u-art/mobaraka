import hero from "@/assets/hero-samarkand.jpg";
import vietnam from "@/assets/tour-vietnam.jpg";
import prague from "@/assets/tour-prague.jpg";
import china from "@/assets/tour-china.jpg";
import thailand from "@/assets/tour-thailand.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";
import fes from "@/assets/dest-fes.jpg";
import sahara from "@/assets/dest-sahara.jpg";
import hajj from "@/assets/hajj.jpg";
import cruise from "@/assets/cruise.jpg";

export const IMG = { hero, vietnam, prague, china, thailand, marrakech, fes, sahara, hajj, cruise };

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

// Circuits au Maroc — contenu de démonstration, remplacé dès que le client
// publie ses propres circuits dans wp-admin.
export const circuits: Tour[] = [
  {
    slug: "circuit-villes-imperiales-demo",
    title: "Les villes impériales",
    subtitle: "Rabat, Meknès, Fès et Marrakech en un seul circuit",
    duration: "7 jours / 6 nuits",
    dates: "Départs toute l'année",
    price: "6 900 dh",
    priceNote: "Par personne en chambre double, en demi-pension.",
    image: fes,
    region: "Maroc",
    overview:
      "Un tour des quatre villes impériales, de la médina de Fès aux jardins de Marrakech, avec un guide local à chaque étape.",
    highlights: [
      "Médina de Fès classée au patrimoine mondial",
      "Volubilis et Moulay Idriss",
      "Place Jemaa el-Fna à Marrakech",
      "Guide local dans chaque ville",
    ],
    included: [
      "Transport en autocar climatisé",
      "6 nuits en hôtels 4★, demi-pension",
      "Guide accompagnateur pour tout le circuit",
      "Entrées des sites mentionnés au programme",
    ],
    notIncluded: ["Les déjeuners", "Les boissons", "Les pourboires"],
    route: ["Rabat", "Meknès", "Fès", "Marrakech"],
    itinerary: [
      {
        day: "Jour 1",
        title: "Arrivée à Rabat",
        description: "Accueil, installation à l'hôtel et tour panoramique de la capitale.",
        meals: ["Dîner"],
      },
      {
        day: "Jour 2",
        title: "Rabat — Meknès",
        description: "Visite de la tour Hassan et du mausolée, route vers Meknès et ses remparts.",
        meals: ["Petit déjeuner", "Dîner"],
      },
      {
        day: "Jour 3",
        title: "Volubilis & Fès",
        description: "Site romain de Volubilis, puis route vers Fès.",
        meals: ["Petit déjeuner", "Dîner"],
      },
      {
        day: "Jour 4",
        title: "Fès",
        description: "Journée complète dans la médina : tanneries, medersas et souks.",
        meals: ["Petit déjeuner", "Dîner"],
      },
      {
        day: "Jour 5",
        title: "Fès — Marrakech",
        description: "Traversée du Moyen Atlas, arrêt à Ifrane et Beni Mellal.",
        meals: ["Petit déjeuner", "Dîner"],
      },
      {
        day: "Jour 6",
        title: "Marrakech",
        description: "Koutoubia, jardins Majorelle, palais Bahia et Jemaa el-Fna.",
        meals: ["Petit déjeuner", "Dîner"],
      },
      {
        day: "Jour 7",
        title: "Départ",
        description: "Temps libre puis transfert vers l'aéroport.",
        meals: ["Petit déjeuner"],
      },
    ],
  },
  {
    slug: "circuit-desert-demo",
    title: "Kasbahs et désert",
    subtitle: "Ouarzazate, la vallée du Dadès et une nuit sous les étoiles",
    duration: "4 jours / 3 nuits",
    dates: "Départs de septembre à mai",
    price: "3 500 dh",
    oldPrice: "4 200 dh",
    deal: true,
    priceNote: "Par personne en chambre double, dont une nuit en bivouac.",
    image: sahara,
    region: "Maroc",
    overview:
      "De Marrakech au désert par le col du Tichka, avec les kasbahs de la vallée du Dadès et une nuit en bivouac dans les dunes.",
    highlights: [
      "Kasbah d'Aït-Ben-Haddou",
      "Gorges du Dadès et du Todra",
      "Nuit en bivouac dans les dunes",
      "Balade à dos de dromadaire au coucher du soleil",
    ],
    included: [
      "Transport en 4x4 ou minibus",
      "3 nuits (2 en hôtel, 1 en bivouac)",
      "Demi-pension",
      "Guide accompagnateur",
    ],
    notIncluded: ["Les déjeuners", "Les boissons", "Les pourboires"],
    route: ["Marrakech", "Ouarzazate", "Dadès", "Merzouga"],
  },
  {
    slug: "circuit-sud-atlantique-demo",
    title: "Le Sud atlantique",
    subtitle: "Essaouira, Agadir et la côte jusqu'à Sidi Ifni",
    duration: "5 jours / 4 nuits",
    dates: "Départs toute l'année",
    price: "4 700 dh",
    priceNote: "Par personne en chambre double, en demi-pension.",
    image: marrakech,
    region: "Maroc",
    overview:
      "Un circuit le long de la côte atlantique, entre ports de pêche, plages et arganeraies.",
    highlights: [
      "Remparts d'Essaouira",
      "Vallée du Paradis",
      "Coopérative d'huile d'argan",
      "Plages de Sidi Ifni",
    ],
    included: ["Transport climatisé", "4 nuits en hôtels 4★, demi-pension", "Guide accompagnateur"],
    notIncluded: ["Les déjeuners", "Les activités nautiques"],
    route: ["Essaouira", "Agadir", "Tiznit", "Sidi Ifni"],
  },
];

// Demo « voyages organisés » — replaced as soon as the client publishes
// their own programmes in wp-admin.
export const voyagesOrganises: Tour[] = [
  {
    slug: "istanbul-aout-2026",
    title: "Istanbul — Août 2026",
    subtitle: "Istanbul, la mer Noire et les paysages de Marmara",
    duration: "8 jours / 7 nuits",
    dates: "Août 2026",
    price: "9 200 dh",
    priceNote:
      "Par personne en chambre double — hôtel Vieille Ville 3★. Voir la grille tarifaire par hôtel ci-dessous.",
    image: hero,
    region: "Turquie",
    airline: "Royal Air Maroc",
    overview:
      "Un séjour au rythme d'Istanbul et de ses environs verdoyants, entre l'Europe et l'Asie. Au programme : l'excursion incluse à Sapança et Maşukiye (lacs, cascades et outlets), les stations balnéaires de la mer Noire (Şile & Ağva), l'ancienne capitale ottomane de Bursa et une croisière sur le Bosphore. Vols directs Royal Air Maroc et hôtels au choix, de la vieille ville à Taksim.",
    highlights: [
      "Excursion incluse à Sapança & Maşukiye",
      "Şile & Ağva, sur la côte de la mer Noire",
      "Bursa et le mont Uludağ, 1ʳᵉ capitale ottomane",
      "Croisière sur le Bosphore",
      "Outlets Paulmark, Venezia & Olivium",
    ],
    included: [
      "Billet d'avion aller-retour en classe économique avec Royal Air Maroc",
      "Logement : 7 nuits en petit déjeuner (chambre double ou triple), hôtel au choix",
      "1 excursion d'une journée à Sapança & Maşukiye (billets d'entrée non inclus)",
      "Assistance d'un guide arabophone durant les excursions",
      "Transferts aéroport / hôtel / aéroport",
    ],
    notIncluded: [
      "Les boissons et dépenses à caractère personnel",
      "Les excursions en option",
      "L'assurance de voyage (à la charge du client)",
    ],
    route: ["Casablanca", "Istanbul", "Casablanca"],
    departures: [
      "02/08 → 09/08/2026",
      "09/08 → 16/08/2026",
      "18/08 → 25/08/2026",
      "21/08 → 28/08/2026",
    ],
    hebergement: [
      {
        city: "Istanbul",
        nights: "7",
        hotels:
          "Hôtel Vieille Ville 3★ · Hôtel Vieille Ville 4★ · Hôtel Centre-ville 4★ · Hôtel Centre-ville 4★+ (hôtels 5★ sur demande)",
      },
    ],
    priceTables: [
      {
        title: "Prix par personne (dh)",
        dates: "Août 2026 — 4 départs",
        columns: [
          "Hôtel",
          "Chambre double",
          "Supp. single",
          "Chambre triple",
          "Enfant 2–5.99 ans (sans lit)",
          "Enfant 6–11 ans (avec lit)",
        ],
        columnRoles: [
          { kind: "adultDouble" },
          { kind: "single", mode: "supp" },
          { kind: "adultTriple" },
          { kind: "child", maxAge: 5 },
          { kind: "child", maxAge: 11 },
        ],
        rows: [
          {
            label: "Hôtel Vieille Ville 3★",
            sub: "Vieille ville",
            cells: ["9 200", "2 200", "9 100", "6 900", "8 200"],
          },
          {
            label: "Hôtel Vieille Ville 4★",
            sub: "Vieille ville",
            cells: ["10 500", "3 100", "10 200", "6 900", "8 900"],
          },
          {
            label: "Hôtel Centre-ville 4★",
            sub: "Taksim",
            cells: ["10 500", "3 100", "10 200", "6 900", "8 900"],
          },
          {
            label: "Hôtel Centre-ville 4★+",
            sub: "Taksim",
            cells: ["12 900", "5 400", "12 600", "6 900", "10 500"],
          },
        ],
      },
    ],
    options: [
      "Les 3 excursions en option (Şile & Ağva, Bursa, Bosphore) : 1 300 dh / personne",
      "Dîner-spectacle en croisière sur le Bosphore : 500 dh",
      "Îles des Princes : 400 dh",
    ],
    itinerary: [
      {
        day: "Jour 1",
        title: "Envol vers Istanbul",
        description:
          "Rassemblement à l'aéroport, formalités d'embarquement et vol vers Istanbul. À l'arrivée, transfert et installation à l'hôtel.",
        meals: [],
      },
      {
        day: "Jour 2",
        title: "Sapança & Maşukiye (inclus)",
        description:
          "Excursion à la journée : le lac de Sapança, l'un des plus grands lacs naturels de Marmara, puis Maşukiye et ses cascades. Temps libre nature et shopping à l'outlet Paulmark.",
        meals: [],
      },
      {
        day: "Jour 3",
        title: "Journée libre",
        description: "Petit déjeuner à l'hôtel, journée libre et logement à l'hôtel.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 4",
        title: "Şile & Ağva — mer Noire (option)",
        description:
          "Colline de Çamlıca et son panorama sur Istanbul, phare historique de Şile, croisière sur la rivière Göksu à Ağva, déjeuner local, Lac Caché (Saklı Göl) et Zipline en option.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 5",
        title: "Bursa & mont Uludağ (option)",
        description:
          "Excursion à Bursa, première capitale de l'Empire ottoman, réputée pour sa nature et son majestueux mont Uludağ.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 6",
        title: "Croisière sur le Bosphore (option)",
        description:
          "Croisière sur le Bosphore puis visite de l'Olivium Mall ou du célèbre outlet Venezia.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 7",
        title: "Journée libre",
        description: "Petit déjeuner à l'hôtel, journée libre et logement à l'hôtel.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 8",
        title: "Retour vers Casablanca",
        description:
          "Petit déjeuner, transfert à l'aéroport d'Istanbul et vol retour vers Casablanca.",
        meals: ["Petit déjeuner"],
      },
    ],
    notes: [
      "Politique bagages Royal Air Maroc : 46 kg (2 valises de 23 kg) + bagage cabine 10 kg par personne.",
      "Enfant 2–5.99 ans : sans lit supplémentaire, partage la chambre de 2 adultes. Enfant 6–11 ans : lit supplémentaire à tarif réduit. Une seule chambre ne peut contenir qu'un seul enfant / lit supplémentaire.",
      "Paiement : 50 % à la confirmation, solde 15 jours avant le départ.",
      "Annulation : remboursement sans frais jusqu'à 20 jours avant le départ ; entre 19 et 15 jours, les frais de dossier, de service et de réservation d'hôtel ne sont pas remboursables ; au-delà, aucune annulation.",
      "Passeport valable au moins 6 mois à partir de la date du voyage.",
      "L'ordre des excursions peut changer selon les conditions climatiques et l'organisation du guide.",
    ],
  },
  {
    slug: "kuala-lumpur-bali-ete-2026",
    title: "Kuala Lumpur & Bali — Été 2026",
    subtitle: "Malaisie & Indonésie — villes, temples et plages",
    duration: "13 jours / 11 nuits",
    dates: "Été 2026",
    price: "31 900 dh",
    priceNote: "Par personne en chambre double. Hôtels 5★ à Kuala Lumpur et Bali.",
    image: vietnam,
    region: "Asie",
    airline: "Qatar Airways (via Doha)",
    overview:
      "Deux facettes de l'Asie en un seul voyage : la Malaisie moderne et l'île de Bali. À Kuala Lumpur, excursion au Genting Highland, ville historique de Malacca (UNESCO) et tour de ville (KLCC, place Merdeka, mosquée nationale). À Bali, temples et villages d'artisans (Celuk, Goa Gajah, Tirta Empul, Kintamani), rizières de Tegalalang et croisière à Nusa Lembongan. Vols Qatar Airways via Doha et hôtels 5★.",
    highlights: [
      "Genting Highland en téléphérique",
      "Malacca, cité classée à l'UNESCO",
      "Tour de Kuala Lumpur (KLCC, Merdeka)",
      "Temples de Bali : Goa Gajah & Tirta Empul",
      "Rizières en terrasses de Tegalalang",
      "Croisière à Nusa Lembongan",
    ],
    included: [
      "Billet d'avion aller-retour en classe économique avec Qatar Airways (via Doha)",
      "Vol interne Kuala Lumpur / Bali (20 kg de bagage en soute)",
      "Kuala Lumpur : 4 nuits en petit déjeuner à l'hôtel Park Royal Collection 5★",
      "Bali : 7 nuits en petit déjeuner à l'hôtel Nusa Dua Beach 5★",
      "Les repas et les visites mentionnés au programme",
      "Guide durant les excursions",
    ],
    notIncluded: [
      "Visa de Bali : 40 € à l'arrivée",
      "Pourboires : 20 $ obligatoire en Malaisie + selon satisfaction en Indonésie",
      "Taxe de départ Indonésie : 12 $ par personne",
      "Dépenses personnelles (blanchisserie, téléphone, boissons…)",
    ],
    route: ["Casablanca", "Kuala Lumpur", "Bali", "Casablanca"],
    departures: ["07/08 → 20/08/2026", "11/08 → 24/08/2026"],
    hebergement: [
      { city: "Kuala Lumpur", nights: "4", hotels: "Park Royal Collection 5★" },
      { city: "Bali", nights: "7", hotels: "Nusa Dua Beach 5★" },
    ],
    priceTables: [
      {
        title: "Prix par personne (dh)",
        dates: "07/08 → 20/08 · 11/08 → 24/08",
        columns: [
          "Formule",
          "Chambre double",
          "Supp. single",
          "Enfant 2–5 ans (sans lit)",
          "Enfant 5–11 ans (avec lit)",
        ],
        columnRoles: [
          { kind: "adultDouble" },
          { kind: "single", mode: "supp" },
          { kind: "child", maxAge: 5 },
          { kind: "child", maxAge: 11 },
        ],
        rows: [
          {
            label: "Kuala Lumpur & Bali",
            sub: "13 jours / 11 nuits",
            cells: ["31 900", "9 500", "23 900", "28 500"],
          },
        ],
      },
    ],
    itinerary: [
      {
        day: "Jour 1",
        title: "Casablanca / Kuala Lumpur",
        description: "Rassemblement à l'aéroport Mohammed V, envol vers Kuala Lumpur via Doha.",
        meals: [],
      },
      {
        day: "Jour 2",
        title: "Arrivée à Kuala Lumpur",
        description:
          "Accueil par notre guide, dîner dans un restaurant local puis installation à l'hôtel.",
        meals: ["Dîner"],
      },
      {
        day: "Jour 3",
        title: "Genting Highland",
        description:
          "Journée d'excursion au Genting Highland : montée en téléphérique, climat frais et temps libre (shopping, visites, activités optionnelles).",
        meals: ["Petit déjeuner", "Déjeuner", "Dîner"],
      },
      {
        day: "Jour 4",
        title: "Malacca (UNESCO)",
        description:
          "Départ vers le sud pour la ville historique de Malacca, classée au patrimoine mondial de l'UNESCO.",
        meals: ["Petit déjeuner", "Déjeuner", "Dîner"],
      },
      {
        day: "Jour 5",
        title: "Tour de Kuala Lumpur",
        description: "Visite de la ville : KLCC Tower, place de Merdeka et la mosquée nationale.",
        meals: ["Petit déjeuner", "Déjeuner", "Dîner"],
      },
      {
        day: "Jour 6",
        title: "Kuala Lumpur → Bali",
        description:
          "Transfert vers l'aéroport, envol vers Bali, arrivée et installation à l'hôtel.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 7",
        title: "Bali — journée libre",
        description: "Petit déjeuner à l'hôtel, journée libre et logement à l'hôtel.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 8",
        title: "Celuk · Goa Gajah · Tirta Empul · Kintamani",
        description:
          "Village d'argenterie de Celuk et villages d'artistes, grotte des éléphants Goa Gajah, temple de l'eau sacrée Tirta Empul, panorama du mont Batur et rizières en terrasses de Tegalalang.",
        meals: ["Petit déjeuner", "Déjeuner"],
      },
      {
        day: "Jour 9",
        title: "Bali — journée libre",
        description: "Petit déjeuner à l'hôtel, journée libre et logement à l'hôtel.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 10",
        title: "Croisière à Nusa Lembongan",
        description:
          "Journée de croisière sur l'île de Nusa Lembongan : activités nautiques (banana boat, paddle, canoë), déjeuner barbecue et snorkeling dans la baie.",
        meals: ["Petit déjeuner", "Déjeuner"],
      },
      {
        day: "Jour 11",
        title: "Bali — journée libre",
        description: "Petit déjeuner à l'hôtel, journée libre et logement à l'hôtel.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 12",
        title: "Bali — journée libre",
        description: "Petit déjeuner à l'hôtel, journée libre et logement à l'hôtel.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 13",
        title: "Bali / Casablanca",
        description:
          "Petit déjeuner, transfert à l'aéroport de Bali et vol retour vers Casablanca via Doha.",
        meals: ["Petit déjeuner"],
      },
    ],
    notes: [
      "Les chambres ne peuvent contenir qu'un seul enfant avec 2 adultes.",
      "Paiement : 50 % à la confirmation, solde (50 %) au plus tard 30 jours avant le départ.",
      "Passeport valable au moins 6 mois à partir de la date du voyage.",
    ],
  },
  {
    slug: "caire-sharm-aout-2026",
    title: "Le Caire & Sharm El-Sheikh — Août 2026",
    subtitle: "Égypte — pyramides du Caire et mer Rouge en all-inclusive",
    duration: "10 jours / 9 nuits",
    dates: "Août 2026",
    price: "15 900 dh",
    priceNote:
      "Par personne en chambre double — hôtel Centre 4★ (Caire) + Resort Mer Rouge 5★ (Sharm). Voir la grille par hôtel ci-dessous.",
    image: sahara,
    region: "Égypte",
    airline: "EgyptAir",
    overview:
      "L'Égypte en deux temps : la découverte du Caire — pyramides de Gizeh, Sphinx, Khan El Khalili et une croisière-dîner sur le Nil — puis six nuits de détente en all-inclusive à Sharm El-Sheikh, au bord de la mer Rouge. Vols EgyptAir et vol interne Le Caire / Sharm inclus.",
    highlights: [
      "Pyramides de Gizeh & le Sphinx",
      "Croisière-dîner sur le Nil (danse orientale & soufie)",
      "Khan El Khalili & mosquée Al-Azhar",
      "Sharm El-Sheikh en formule all-inclusive",
      "Excursions optionnelles à la mer Rouge",
    ],
    included: [
      "Billet d'avion avec EgyptAir + vol interne Le Caire / Sharm El-Sheikh (aller-retour)",
      "Le Caire : 3 nuits en petit déjeuner",
      "Sharm El-Sheikh : 6 nuits en all-inclusive (petit déjeuner, déjeuner, dîner, snacks & boissons non alcoolisées)",
      "Tour du Caire avec déjeuner (boissons non incluses)",
      "Croisière-dîner sur le Nil",
      "Entrées aux sites mentionnés au programme",
      "Guide professionnel et accompagnement de l'agence durant le séjour",
    ],
    notIncluded: [
      "Frais de visa : 500 dh par personne",
      "15 $ de pourboires (collectés par le guide à l'arrivée)",
      "Excursions optionnelles à Sharm El-Sheikh",
      "Assurance santé et dépenses personnelles",
      "Transport vers l'aéroport de Casablanca",
    ],
    route: ["Casablanca", "Le Caire", "Sharm El-Sheikh", "Le Caire", "Casablanca"],
    departures: ["05/08 → 14/08/2026", "17/08 → 26/08/2026"],
    hebergement: [
      {
        city: "Le Caire",
        nights: "3",
        hotels: "Hôtel Centre 4★ ou Hôtel Bord du Nil 5★ (petit déjeuner)",
      },
      {
        city: "Sharm El-Sheikh",
        nights: "6",
        hotels: "Resort Mer Rouge 5★ · Resort Baie 5★ · Resort Lagon 5★ (all-inclusive)",
      },
    ],
    priceTables: [
      {
        title: "Prix par personne (dh)",
        dates: "05/08 → 14/08 · 17/08 → 26/08",
        columns: [
          "Hôtels (Caire + Sharm)",
          "Chambre double",
          "Chambre single",
          "Enfant 0–5 ans",
          "1ᵉʳ enfant 6 ans+",
          "2ᵉ enfant 6 ans+",
        ],
        columnRoles: [
          { kind: "adultDouble" },
          { kind: "single", mode: "total" },
          { kind: "child", maxAge: 5 },
          { kind: "child", maxAge: 120, ordinal: 1 },
          { kind: "child", maxAge: 120, ordinal: 2 },
        ],
        rows: [
          {
            label: "Hôtel Centre 4★ + Resort Mer Rouge 5★",
            cells: ["15 900", "19 500", "9 000", "10 500", "12 500"],
          },
          {
            label: "Hôtel Bord du Nil 5★ + Resort Baie 5★",
            cells: ["18 500", "24 900", "9 900", "11 500", "14 000"],
          },
          {
            label: "Hôtel Bord du Nil 5★ + Resort Lagon 5★",
            sub: "Chambre supérieure",
            cells: ["22 500", "30 900", "—", "—", "—"],
          },
          {
            label: "Hôtel Bord du Nil 5★ + Resort Lagon 5★",
            sub: "Deluxe Family",
            cells: ["23 500", "—", "10 500", "11 500", "16 900"],
          },
        ],
      },
    ],
    flights: [
      {
        title: "1ᵉʳ départ — du 05 au 14 août 2026",
        legs: [
          {
            route: "Casablanca / Le Caire",
            date: "05/08/2026",
            flightNo: "MS 862",
            departure: "00:45",
            arrival: "07:45",
          },
          {
            route: "Le Caire / Sharm El-Sheikh",
            date: "08/08/2026",
            flightNo: "MS 226",
            departure: "14:50",
            arrival: "15:50",
          },
          {
            route: "Sharm El-Sheikh / Le Caire",
            date: "14/08/2026",
            flightNo: "MS 021",
            departure: "06:00",
            arrival: "07:00",
          },
          {
            route: "Le Caire / Casablanca",
            date: "14/08/2026",
            flightNo: "MS 847",
            departure: "09:00",
            arrival: "12:30",
          },
        ],
      },
      {
        title: "2ᵉ départ — du 17 au 26 août 2026",
        legs: [
          {
            route: "Casablanca / Le Caire",
            date: "17/08/2026",
            flightNo: "MS 862",
            departure: "00:45",
            arrival: "07:45",
          },
          {
            route: "Le Caire / Sharm El-Sheikh",
            date: "20/08/2026",
            flightNo: "MS 222",
            departure: "11:40",
            arrival: "12:40",
          },
          {
            route: "Sharm El-Sheikh / Le Caire",
            date: "26/08/2026",
            flightNo: "MS 021",
            departure: "06:00",
            arrival: "07:00",
          },
          {
            route: "Le Caire / Casablanca",
            date: "26/08/2026",
            flightNo: "MS 847",
            departure: "09:00",
            arrival: "12:30",
          },
        ],
      },
    ],
    options: [
      "Ras Mohammed, l'une des plus célèbres réserves naturelles d'Égypte",
      "Safari dans le désert",
      "Spectacle de dauphins",
      "Sortie en sous-marin",
      "Spectacle Neverland",
    ],
    itinerary: [
      {
        day: "Jour 1",
        title: "Arrivée au Caire & croisière sur le Nil",
        description:
          "Envol de Casablanca vers Le Caire, accueil et installation à l'hôtel. En soirée, croisière-dîner sur le Nil avec spectacle de danse orientale et danse soufie (tanoura).",
        meals: ["Dîner"],
      },
      {
        day: "Jour 2",
        title: "Le Caire — pyramides & vieille ville",
        description:
          "Pyramides de Gizeh, le Sphinx et fabrique de papyrus. Déjeuner au restaurant, puis Khan El Khalili, la mosquée Al-Azhar et Hussein.",
        meals: ["Petit déjeuner", "Déjeuner"],
      },
      {
        day: "Jour 3",
        title: "Le Caire — journée libre",
        description: "Petit déjeuner à l'hôtel, journée libre pour le repos et le shopping.",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jour 4",
        title: "Le Caire → Sharm El-Sheikh",
        description:
          "Transfert à l'aéroport du Caire, vol vers Sharm El-Sheikh, arrivée et installation à l'hôtel (all-inclusive).",
        meals: ["Petit déjeuner"],
      },
      {
        day: "Jours 5-9",
        title: "Sharm El-Sheikh — mer Rouge (all-inclusive)",
        description:
          "Journées libres de détente et de baignade en formule all-inclusive. Excursions optionnelles : Ras Mohammed, safari, spectacle de dauphins, sous-marin, Neverland.",
        meals: ["Petit déjeuner", "Déjeuner", "Dîner"],
      },
      {
        day: "Jour 10",
        title: "Retour vers Casablanca",
        description:
          "Petit déjeuner, départ de l'hôtel et transfert à l'aéroport de Sharm El-Sheikh pour le vol retour vers Casablanca via Le Caire.",
        meals: ["Petit déjeuner"],
      },
    ],
    notes: [
      "Politique bagages du vol interne Le Caire–Sharm : 23 kg + bagage cabine 7 kg par personne.",
      "L'hôtel Bord du Nil 5★ est associé aux formules 5★ ; l'hôtel Centre 4★ à la première formule.",
      "Documents visa : passeport (valable 6 mois), 2 photos fond blanc, copie CIN, relevé bancaire des 3 derniers mois, attestation de travail / retraite / registre de commerce, copie de l'acte de mariage. Pour les enfants : acte de naissance + certificat scolaire.",
      "L'ordre des visites peut changer en cas d'imprévu, mais l'ensemble du programme sera assuré.",
      "Passeport valable au moins 6 mois à partir de la date du voyage.",
    ],
  },
];

// Croisières — contenu de démonstration, remplacé dès que le client publie
// ses propres croisières dans wp-admin.
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
