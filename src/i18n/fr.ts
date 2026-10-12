/**
 * French — the source of truth.
 *
 * Every other dictionary is typed against this one, so adding a key here and
 * forgetting to translate it fails the build instead of shipping a blank.
 * Keys are grouped by where they appear, not alphabetically: it is far easier
 * to translate a screen at a time than a scattered list.
 *
 * TWO RULES, because these dictionaries are shared by every client the
 * template is forked for:
 *
 * 1. No client's name. Write "{agency}" and the name arrives from
 *    src/config/agency.ts at render time. Hard-coding one means the next
 *    onboarding is a hunt through three languages.
 *
 * 2. No client's data at all — no address, phone, city or social handle.
 *    Those live in agency.ts and are read from there. A dictionary holds
 *    interface wording, nothing a client could ask you to change.
 *
 * A key with no translation yet falls back to French and warns in dev, so a
 * feature may ship before its wording does.
 */
export const fr = {
  // header + navigation
  "nav.voyages": "Nos voyages",
  "nav.hajjOmra": "Hajj / Omra",
  "nav.maroc": "Départs Maroc",
  "nav.transport": "Transport",
  "nav.mice": "MICE",
  "nav.about": "Qui sommes-nous ?",
  "nav.contact": "Nous contacter",
  "nav.menu": "Menu",
  "nav.close": "Fermer",
  "header.tagline": "Suivez-nous · agence de voyages au Maroc",
  "header.langLabel": "Choisir la langue",

  // footer
  "footer.ourTrips": "Nos voyages",
  "footer.services": "Nos services",
  "footer.contact": "Contact",
  "footer.legal": "Mentions légales",
  "footer.privacy": "Politique de confidentialité",
  "footer.cookies": "Politique de cookies",
  "footer.rights": "Tous droits réservés.",
  "footer.agencyType": "Agence de voyages",
  "footer.findUs": "Retrouvez-nous ici",
  "footer.usefulLinks": "Liens utiles",
  "footer.cgu": "CGU",
  "footer.organisedTrips": "Voyages organisés",
  "footer.contactLink": "Contact",

  "home.heroCta": "Découvrir notre offre",
  "home.prevProgram": "Programme précédent",
  "home.nextProgram": "Programme suivant",
  "home.goToProgram": "Aller au programme {n}",
  "home.prev": "Précédent",
  "home.next": "Suivant",
  "home.organisedTrips": "Voyages organisés",
  "home.destinations": "Nos destinations",
  "home.moroccoTitle": "Le Maroc, autrement.",
  "home.cruises": "Nos croisières",
  "home.cruisesTitle": "Découvrez le monde au fil de l'eau.",
  "home.miceTitle": "Meetings, Incentives, Conferences & Exhibitions",
  "home.partners": "Nos partenaires",
  "meta.home.title": "{agency} — Agence de voyages au Maroc",
  "meta.home.desc":
    "Voyages organisés, circuits, croisières, Hajj & Omra et MICE. Découvrez le monde avec {agency}, votre agence de voyages basée au Maroc.",
  "meta.home.ogDesc": "Voyages organisés, circuits, croisières, Hajj & Omra et MICE.",
  "home.fareWithFlight": "Tarif avec billet d'avion",
  "home.seeAllTrips": "Voir tous les voyages",
  "home.cruisesLead":
    "Caraïbes, Méditerranée orientale, tour du monde — nos partenaires : Royal Caribbean, MSC et bien plus.",
  "home.seeCruises": "Voir les croisières",
  "home.miceLead":
    "{agency} vous accompagne dans l'organisation de séminaires, conférences, congrès et voyages incentives. De la conception à la logistique, nous créons des expériences professionnelles mémorables.",
  "action.learnMore": "En savoir plus",
  "home.moroccoLead":
    "Explorez le Royaume à travers ses villes impériales, ses côtes et ses déserts — entre culture, détente et aventure.",
  "action.moreDetail": "Plus de détail",

  // shared actions
  "action.discover": "Découvrir",
  "action.seeAll": "Voir tout",
  "action.book": "Réserver",
  "action.details": "Voir le programme",
  "action.backHome": "Retour à l'accueil",
  "action.contactUs": "Nous contacter",

  // tour cards and listings
  "tour.from": "À partir de",
  "tour.onRequest": "Sur devis",
  "tour.quote": "Demander un devis",
  "tour.indicative":
    "Programme indicatif. L'itinéraire, les dates et le tarif vous sont confirmés par l'agence avant toute réservation.",
  "tour.bookOnline": "Réserver en ligne",
  "tour.perPerson": "par personne",
  "tour.duration": "Durée",
  "tour.dates": "Dates",
  "tour.included": "Le prix comprend",
  "tour.notIncluded": "Le prix ne comprend pas",
  "tour.itinerary": "Programme jour par jour",
  "tour.highlights": "Les temps forts",
  "tour.noResults": "Aucun programme ne correspond à votre recherche.",

  // pilgrimage
  "pilgrimage.title": "Hajj & Omra",
  "pilgrimage.hotels": "Hôtels",
  "pilgrimage.roomDouble": "Chambre double",
  "pilgrimage.roomTriple": "Chambre triple",
  "pilgrimage.roomQuad": "Chambre quadruple",

  // regions — filter labels on /voyages, badge on a tour page
  "region.all": "Tous",
  "region.Asie": "Asie",
  "region.Europe": "Europe",
  "region.Afrique": "Afrique",
  "region.Ameriques": "Amériques",
  "region.MoyenOrient": "Moyen-Orient",

  // /voyages
  "voyages.title": "Toutes nos destinations",
  "voyages.lead":
    "Circuits en groupe avec billet d'avion au départ du Maroc, encadrés par nos guides.",

  // tour detail page
  "tour.overview": "Aperçu du programme",
  "tour.overviewBody":
    "Un programme organisé par {agency} et encadré par nos équipes, du départ au retour.",
  "tour.yourItinerary": "Votre itinéraire",
  "tour.includedTitle": "Ce que comprend le programme",
  "tour.notIncludedTitle": "Non inclus",
  "tour.pricePerPerson": "Prix par personne",
  "tour.priceNoteDefault": "Base chambre double, sous réserve de disponibilité.",
  "tour.deposit": "Réservez en ligne — acompte 3 000 dhs",
  "tour.gallery": "Photos du voyage",
  "tour.galleryEyebrow": "En images",
  "tour.seeAll": "Voir tous les voyages",
  "tour.notFound": "Voyage introuvable",
  "tour.fbFlights": "Vols internationaux",
  "tour.fbHotel": "Hébergement",
  "tour.fbTransfers": "Transferts",
  "tour.fbGuiding": "Encadrement",

  // /maroc
  "maroc.eyebrow": "Départs garantis Maroc",
  "maroc.title": "Explorez le Maroc autrement.",
  "maroc.lead": "Voyages soigneusement conçus, mêlant découverte culturelle, détente et aventure.",
  "maroc.circuits": "Circuits Maroc",
  "maroc.destinations": "Nos destinations au Maroc",
  "maroc.ifrane": "Une journée au cœur d'Ifrane",
  "maroc.imperial": "Au cœur des villes impériales",
  "maroc.south": "Sud du Maroc",

  // /mice
  "mice.lead":
    "De la conception à la logistique, nous imaginons et produisons des événements professionnels sur mesure, au Maroc et à l'international.",
  "mice.quote": "Demander un devis",
  "mice.meetings": "Meetings",
  "mice.meetingsDesc": "Réunions d'entreprise clé en main.",
  "mice.incentives": "Incentives",
  "mice.incentivesDesc": "Voyages de motivation & récompenses.",
  "mice.conferences": "Conferences",
  "mice.conferencesDesc": "Congrès professionnels & scientifiques.",
  "mice.exhibitions": "Exhibitions",
  "mice.exhibitionsDesc": "Salons et événements grand format.",
  "mice.gallery": "Nos événements en images",

  // /transport
  "transport.title": "Votre confort, notre priorité.",
  "transport.lead":
    "Flotte de véhicules haut de gamme, chauffeurs professionnels et service exécutif pour vos déplacements individuels et de groupe au Maroc.",
  "transport.cta": "Réserver un transfert",
  "transport.fleet": "Flotte premium",
  "transport.fleetDesc": "Berlines, SUV, minibus et vans VIP récents.",
  "transport.safety": "Sécurité",
  "transport.safetyDesc": "Chauffeurs formés, véhicules assurés, suivi trajet.",
  "transport.always": "24/7",
  "transport.alwaysDesc": "Disponibilité totale, ponctualité garantie.",

  // /a-propos
  "about.eyebrow": "À propos",
  "about.title": "Voyager, avec le cœur.",
  "about.p1":
    "{agency} est une agence de voyages marocaine qui compose depuis des années des expériences soigneusement conçues : circuits en groupe, séjours sur mesure, Hajj & Omra et voyages d'affaires.",
  "about.p2":
    "Notre force : une équipe passionnée, un réseau international de partenaires triés sur le volet et un suivi personnalisé avant, pendant et après votre voyage.",
  "about.statYears": "années d'expérience",
  "about.statTravellers": "voyageurs conquis",
  "about.statDestinations": "destinations couvertes",

  // /contact
  "contact.title": "Parlons de votre prochain voyage.",
  "contact.lead": "Notre équipe vous répond sous 24h ouvrées.",
  "contact.firstName": "Prénom",
  "contact.lastName": "Nom",
  "contact.email": "Email",
  "contact.subject": "Sujet",
  "contact.message": "Message",
  "contact.send": "Envoyer",

  // /gallery
  "gallery.title": "Photos de nos voyages",
  "gallery.lead": "Quelques souvenirs de nos dernières sorties et pèlerinages.",

  // Hajj & Omra pages
  "hajj.omra": "Omra",
  "hajj.hajj": "Hajj",
  "hajj.eyebrow": "Omra & Hajj",
  "hajj.heroTitle": "Partez l'esprit tranquille vers les Lieux Saints",
  "hajj.heroLead":
    "Des programmes complets, un encadrement religieux, des hôtels proches du Haram et un vol direct — au départ du Maroc.",
  "hajj.omraCta": "Programme Omra",
  "hajj.hajjCta": "Programme Hajj 2027",
  "hajj.ourPrograms": "Nos programmes",
  "hajj.chooseTitle": "Choisissez votre programme",
  "hajj.chooseLead": "Cliquez sur un programme pour voir les prix, les hôtels et tous les détails.",
  "hajj.seeDetails": "Voir les détails et les prix",
  "hajj.allIncluded": "Tout est compris",
  "hajj.ourServices": "Nos services inclus",
  "hajj.svcFlight": "Billet d'avion aller / retour",
  "hajj.svcHotel": "Hébergement en hôtel",
  "hajj.svcTransfers": "Transferts en Arabie Saoudite",
  "hajj.svcVisits": "Visites à La Mecque et Médine",
  "hajj.svcGuide": "Guide accompagnateur du groupe",
  "hajj.svcVisa": "Frais de visa inclus",
  "hajj.whyUs": "Pourquoi {agency}",
  "hajj.whyTitle": "Un accompagnement de confiance",
  "hajj.why1": "Des groupes encadrés et confortables",
  "hajj.why2": "Des guides religieux expérimentés",
  "hajj.why3": "Un accompagnement spirituel",
  "hajj.why4": "Des hôtels proches du Haram",
  "hajj.why5": "Une assistance 24h/24",
  "hajj.why6": "Vol direct — agence de confiance",
  "hajj.bookNow": "Réservez votre place",
  "hajj.bookLead":
    "Nos conseillers vous accompagnent pour choisir la formule idéale. Contactez {agency} :",
  "hajj.programDetail": "Détail du programme",
  "hajj.duration": "Durée",
  "hajj.departures": "Départs",
  "hajj.flight": "Vol",
  "hajj.pricesTitle": "Prix et hôtels",
  "hajj.pricesLead": "Prix par personne, en dirhams.",
  "hajj.hotel": "Hôtel",
  "hajj.included": "Le programme comprend",
  "hajj.goodToKnow": "Bon à savoir",
  "hajj.gallery": "Photos de nos pèlerinages",
  "hajj.contactTitle": "Une question sur ce programme ?",
  "hajj.whatsapp": "Écrire sur WhatsApp",
  "hajj.backToPrograms": "Retour aux programmes",
  "hajj.notFound": "Programme introuvable",
  "nav.home": "Accueil",
  "hajj.via": "Via",
  "hajj.multiDates":
    "Plusieurs dates de départ — choisissez la vôtre dans le formulaire de réservation.",
  "hajj.tripDescription": "Description du voyage",
  "hajj.priceNote": "Prix par personne en dirhams, selon le type de chambre.",
  "hajj.note": "À noter",
  "hajj.galleryEyebrow": "Galerie photo",
  "hajj.photo": "photo",
  "hajj.roomDouble": "Double",
  "hajj.roomTriple": "Triple",
  "hajj.roomQuad": "Quadruple",
  "hajj.roomQuint": "Quintuple",
  "book.title": "Réserver maintenant",
  "book.lead": "Réservez votre voyage en quelques clics en remplissant ce formulaire :",
  "book.program": "Programme",
  "book.chooseProgram": "Choisissez le programme",
  "book.date": "Date du voyage",
  "book.chooseDate": "Choisissez la date de départ",
  "book.chooseHotel": "Choisissez l'hôtel",
  "book.room": "Chambre",
  "book.chooseRoom": "Choisissez le type de chambre",
  "book.people": "Nombre de personnes",
  "book.fullName": "Nom complet",
  "book.phone": "Numéro de téléphone",
  "book.submit": "Poursuivre la réservation",
  "book.privacy":
    "Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles.",
  "book.sentTitle": "Votre demande a bien été envoyée",
  "book.sentBody":
    "Merci. Un conseiller {agency} vous contactera sous 24 heures pour confirmer votre réservation sur « {program} ».",

  "meta.hajj.title": "Omra et Hajj — {agency}",
  "meta.hajj.desc":
    "Les programmes Omra et Hajj de {agency} : prix, hôtels et dates au départ du Maroc.",
  "meta.hajj.ogDesc": "Omra et Hajj au départ du Maroc — prix, hôtels et dates.",

  // /reservation — the demo checkout
  "res.notFound": "Programme introuvable",
  "res.seePrograms": "Voir nos programmes",
  "res.step1": "Informations",
  "res.step2": "Paiement",
  "res.step3": "Confirmation",
  "res.pricePerPerson": "Prix / personne",
  "res.depositDue": "Acompte à payer",
  "res.balance": "Solde à l'agence",
  "res.beforeDeparture": "Avant le départ",
  "res.secureNote": "Paiement sécurisé — acompte remboursable sous conditions.",
  "res.demoNote":
    "Démonstration — paiement simulé. En production, cette étape est connectée à la passerelle bancaire marocaine (Payzone / CMI). Aucune carte n'est réellement débitée.",
  "res.yourInfo": "Vos informations",
  "res.mainTraveller": "Renseignez le voyageur principal.",
  "res.phone": "Téléphone",
  "res.travellers": "Nombre de voyageurs",
  "res.departureCity": "Ville de départ",
  "res.continue": "Continuer vers le paiement",
  "res.payTitle": "Paiement de l'acompte",
  "res.secureBadge": "Sécurisé",
  "res.payLead": "Réglez {amount} pour confirmer votre réservation.",
  "res.cardHolder": "Titulaire de la carte",
  "res.cardNumber": "Numéro de carte",
  "res.expiry": "Expiration",
  "res.cvc": "CVC",
  "res.processing": "Traitement…",
  "res.pay": "Payer",
  "res.back": "Retour",
  "res.confirmed": "Réservation confirmée !",
  "res.thanks": "Merci — votre acompte de {amount} pour {tour} a bien été reçu.",
  "res.reference": "Référence",
  "res.followUp": "Un conseiller {agency} vous contactera sous 24h pour finaliser votre dossier.",
  "res.otherPrograms": "Découvrir d'autres programmes",
  "meta.reservation": "Réservation",

  // page titles and descriptions (<head>)
  "meta.voyages.title": "Nos voyages organisés — {agency}",
  "meta.voyages.desc":
    "Découvrez tous nos voyages organisés en groupe avec billet d'avion : Asie, Europe, Amériques et plus.",
  "meta.maroc.title": "Départs Maroc — Circuits & séjours au Maroc | {agency}",
  "meta.maroc.desc":
    "Découvrez le Maroc avec nos circuits soignés : Marrakech, Fès, Sahara, villes impériales et côte atlantique.",
  "meta.mice.title": "MICE — Séminaires, congrès & incentives | {agency}",
  "meta.mice.desc":
    "Organisation de séminaires, conférences, congrès et voyages incentives. {agency} MICE.",
  "meta.transport.title": "Transport privé & chauffeurs — {agency}",
  "meta.transport.desc":
    "Flotte haut de gamme, chauffeurs professionnels : transferts, mise à disposition et VIP au Maroc.",
  "meta.about.title": "Qui sommes-nous ? — {agency}",
  "meta.about.desc":
    "{agency}, agence de voyages marocaine passionnée : circuits, croisières, Hajj & Omra et MICE.",
  "meta.contact.title": "Contact — {agency}",
  "meta.contact.desc": "Contactez notre équipe pour un devis, une réservation ou un renseignement.",
  "meta.gallery.title": "Photos de nos voyages — {agency}",

  // errors and empty states
  "error.notFoundTitle": "Page introuvable",
  "error.notFoundBody": "La page que vous cherchez n'existe pas ou a été déplacée.",
  "error.genericTitle": "Une erreur est survenue",
  "error.genericBody": "Réessayez dans un instant. Si le problème persiste, contactez-nous.",

  // navigation — tour collections
  "nav.circuits": "Circuit au Maroc",
  "nav.voyagesOrganises": "Voyages organisés",
  "nav.cruises": "Croisières",
  "nav.omra": "Omra & Hajj",
  "nav.languageStays": "Séjours linguistiques",
  "nav.greatDeals": "Bons plans",
  "nav.visa": "Visa",
  "nav.gallery": "Galerie",

  // footer — template additions
  "footer.visaFormalities": "Visa & formalités",
  "footer.aboutLink": "Qui sommes-nous",

  // home — collection sections
  "home.circuitsEyebrow": "Découvrir le Royaume",
  "home.circuitsLink": "Voir tous les circuits",
  "home.cruisesEyebrow": "Prendre le large",
  "home.cruisesLink": "Voir toutes les croisières",
  "home.staysEyebrow": "Apprendre ailleurs",
  "home.staysLink": "Voir tous les séjours",
  "home.dealsEyebrow": "Offres du moment",
  "home.dealsLink": "Voir tous les bons plans",

  // home — hero
  "home.fromPrice": "À partir de",
  "home.newPrograms": "Nouveaux programmes",
  "home.omraAccent": "nous vous accompagnons à chaque étape.",
  "home.omraSubtitle":
    "Hôtels proches du Haram, encadrement religieux complet et vol direct — plusieurs départs.",

  // home — why us
  "home.pillarDestinationsTitle": "20+ destinations",
  "home.pillarDestinationsDesc": "Asie, Europe, Amériques, Afrique — la planète à portée de main.",
  "home.pillarGroupTitle": "Voyages en groupe",
  "home.pillarGroupDesc": "Guides francophones, ambiance conviviale, moments partagés.",
  "home.pillarTrustTitle": "Agence de confiance",
  "home.pillarTrustDesc": "Une équipe à votre écoute avant, pendant et après votre voyage.",
  "home.pillarTailoredTitle": "Sur mesure",
  "home.pillarTailoredDesc": "Chaque voyage se compose autour de vous, selon vos envies.",

  // listings — shared empty state
  "listing.emptyTitle": "Programmes bientôt disponibles",
  "listing.emptyBody":
    "De nouveaux programmes seront publiés prochainement. Contactez-nous pour toute demande.",

  // listings — leads and meta
  "listing.circuitsLead":
    "Circuits au Maroc encadrés par nos guides : villes impériales, kasbahs du Sud, désert et côtes atlantiques.",
  "meta.circuits.desc":
    "Nos circuits au Maroc, à la découverte des villes impériales, du désert et des côtes.",
  "listing.cruisesLead":
    "Croisières en Méditerranée, mer Rouge et au-delà : cabines, escales et dates de départ.",
  "meta.cruises.desc":
    "Nos croisières en Méditerranée, mer Rouge et au-delà — cabines, escales et départs.",
  "listing.dealsLead": "Nos offres du moment : places limitées, départs proches, prix réduits.",
  "meta.deals.desc": "Nos offres et promotions du moment — voyages à prix réduit, places limitées.",
  "listing.staysLead":
    "Séjours linguistiques et immersions culturelles à l'étranger, pour jeunes et adultes.",
  "meta.stays.desc":
    "Séjours linguistiques et immersions culturelles à l'étranger, pour jeunes et adultes.",
  "listing.organisedLead":
    "Nos voyages organisés en groupe, billet d'avion inclus : Asie, Europe, Afrique et plus.",
  "meta.organised.desc":
    "Découvrez tous nos voyages organisés en groupe avec billet d'avion : Asie, Europe, Afrique et plus.",
  "listing.organisedTitle": "Toutes nos destinations",

  // mice — template additions
  "mice.title": "Meetings, Incentives, Conferences & Exhibitions",
  "mice.leadTemplate":
    "De la conception à la logistique, nous imaginons et produisons des événements professionnels sur mesure, au Maroc et à l'international.",

  // visa — the page Capital Tours does not have
  "visa.eyebrow": "Visa & formalités",
  "visa.title": "Vos démarches de visa, simplifiées",
  "visa.lead":
    "Nous vous accompagnons de A à Z dans vos formalités de voyage : constitution du dossier, prise de rendez-vous au consulat, assurance et suivi jusqu'à l'obtention de votre visa.",
  "visa.cta": "Demander un accompagnement",
  "visa.step1": "Constitution du dossier",
  "visa.step1Desc": "Liste des pièces, vérification et mise en forme de votre dossier.",
  "visa.step2": "Rendez-vous & formulaires",
  "visa.step2Desc": "Prise de rendez-vous et remplissage des formulaires officiels.",
  "visa.step3": "Dépôt & suivi",
  "visa.step3Desc": "Dépôt de la demande et suivi jusqu'à la décision.",
  "visa.step4": "Assurance voyage",
  "visa.step4Desc": "Attestation d'assurance conforme aux exigences du consulat.",
  "visa.benefitTime": "Gain de temps",
  "visa.benefitTimeDesc": "Un dossier complet et conforme du premier coup, sans allers-retours.",
  "visa.benefitReliable": "Dossier fiable",
  "visa.benefitReliableDesc": "Vérifié par notre équipe selon les exigences de chaque consulat.",
  "visa.benefitHuman": "Accompagnement humain",
  "visa.benefitHumanDesc": "Un interlocuteur dédié, joignable à chaque étape de votre demande.",
  "visa.question": "Une question sur votre destination ? Parlons-en.",
  "meta.visa.title": "Visa & formalités | {agency}",
  "meta.visa.desc":
    "Assistance visa et formalités de voyage — constitution du dossier, prise de rendez-vous et suivi.",

  // contact — template additions
  "contact.whatsapp": "Ou contactez-nous sur WhatsApp",
  "contact.mapTitle": "Localisation de {agency}",

  // gallery — was Arabic-only for every reader
  "gallery.eyebrow": "Souvenirs",
  "gallery.emptyTitle": "Pas encore de photos",
  "gallery.emptyBody": "Nous publierons ici les photos de nos voyages très bientôt.",
  "gallery.enlarge": "Agrandir la photo",
  "gallery.close": "Fermer",
  "gallery.prev": "Photo précédente",
  "gallery.next": "Photo suivante",
  "gallery.alt": "Photo de nos voyages",
  "gallery.backToOmra": "Retour à Omra & Hajj",

  // Omra & Hajj — strings the template has and Capital Tours did not
  "hajj.omraPrograms": "Programmes Omra",
  "hajj.hajjPrograms": "Programmes Hajj",
  "hajj.chooseType": "Choisissez le type de voyage pour voir les programmes disponibles.",
  "hajj.heroLeadTemplate":
    "Programmes complets, encadrement religieux, hôtels proches du Haram et vol direct — au départ du Maroc.",
  "hajj.soonTitle": "Nouveaux programmes bientôt",
  "hajj.soonBody": "Contactez-nous pour connaître les dates des prochains programmes.",
  "hajj.kaabaAlt": "La Kaaba",
  "hajj.seeAllPhotos": "Voir toutes les photos ←",
  "hajj.facebook": "Facebook",
  "hajj.contactUs": "Contactez-nous",
  "hajj.omraCardDesc":
    "Vivez une Omra sereine avec {agency}. Nous vous accompagnons à chaque étape, avec une organisation rigoureuse, un encadrement professionnel et des services confortables.",

  // Omra & Hajj — the Hajj card
  "hajj.hajjCardDesc":
    "Vivez un Hajj confortable et serein avec l'accompagnement complet de {agency} : formalités, hébergement, transport et accompagnement spirituel — organisés pour un pèlerinage sûr et paisible.",

  // Omra & Hajj — programme count
  "hajj.oneProgram": "programme",
  "hajj.manyPrograms": "programmes",
  "hajj.comingSoon": "Bientôt",

  // Omra detail — the last two
  "hajj.pricesInclude": "Les prix comprennent",

  // Omra detail — gallery caption
  "hajj.photoAlt": "{agency} — photo",

  // tour detail — flights and itinerary
  "tour.flightDetails": "Détails des vols",
  "tour.flightNo": "N° de vol",
  "tour.departure": "Départ",
  "tour.arrival": "Arrivée",
  "tour.date": "Date",
  "tour.city": "Ville",
  "tour.nights": "Nuits",
  "tour.optional": "En option",

  // tour detail — price estimator
  "tour.pricesTitle": "Tarifs & formules",
  "tour.hotelPackage": "Hôtel / formule",
  "tour.roomType": "Type de chambre",
  "tour.single": "Single",
  "tour.adults": "Adultes",
  "tour.childrenAge": "Enfants (âge)",
  "tour.estimate": "Estimer mon prix",
  "tour.estimateTotal": "Total estimé",
  "tour.estimateNote":
    "Estimation indicative hors taxes, visa et suppléments éventuels. Le tarif définitif est confirmé par l'agence.",
  "tour.estimateUnavailable":
    "Cette combinaison n'est pas disponible pour la formule choisie. Contactez l'agence pour un devis.",
  "tour.booking": "Réservation",

  // home — section headers I missed on the first pass
  "home.voyagesEyebrow": "Envie d'ailleurs ?",
  "home.holyLands": "Terres saintes",
  "home.miceEyebrow": "MICE",
  "home.trustedBy": "Ils nous font confiance",

  // tour detail — flight table
  "tour.flight": "Vol",

  // shared badges
  "tour.deal": "Promo",

  // 404 page
  "error.notFoundHeading": "Page introuvable",
  "error.notFoundText": "La page que vous cherchez n'existe pas ou a été déplacée.",
  "error.goHome": "Retour à l'accueil",

  // error boundary
  "error.tryAgain": "Réessayer",

  // price estimator breakdown
  "tour.estimateAdults": "{n} × adulte ({room})",
  "tour.estimateChild": "1 × enfant {age} ans",
  "tour.estimateChildAdultRate": "1 × enfant {age} ans (tarif adulte)",

  // currency
  "price.currency": "DH",

  // contact map
  "contact.mapActivate": "Activer la carte",

  // mentions légales
  "meta.legal.title": "Mentions légales — {agency}",
  "meta.legal.desc": "Informations légales, hébergement, données personnelles et propriété intellectuelle.",
  "legal.eyebrow": "Informations légales",
  "legal.title": "Mentions légales",
  "legal.lead":
    "Les informations ci-dessous identifient l'éditeur de ce site et précisent comment vos données sont traitées.",
  "legal.publisher": "Éditeur du site",
  "legal.name": "Dénomination",
  "legal.form": "Forme juridique",
  "legal.formValue": "SARL à associé unique (SARLAU)",
  "legal.capital": "Capital social",
  "legal.rc": "Registre du commerce",
  "legal.ice": "ICE",
  "legal.activity": "Activité",
  "legal.activityValue": "Agence de voyages",
  "legal.manager": "Gérante",
  "legal.address": "Siège social",
  "legal.email": "E-mail",
  "legal.phone": "Téléphone",
  "legal.hostingTitle": "Hébergement",
  "legal.hostingBody":
    "Ce site est hébergé par Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.",
  "legal.dataTitle": "Données personnelles",
  "legal.dataBody1":
    "Les formulaires de ce site collectent uniquement les informations nécessaires pour répondre à votre demande : nom, téléphone, e-mail, programme choisi et type de chambre. Elles sont transmises à l'agence par e-mail et par WhatsApp, et ne servent qu'à traiter votre demande. Elles ne sont ni vendues ni cédées à des tiers.",
  "legal.dataBody2":
    "Conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition. Pour l'exercer, écrivez-nous à l'adresse e-mail ci-dessus.",
  "legal.cookiesTitle": "Cookies",
  "legal.cookiesBody":
    "Ce site ne dépose aucun cookie publicitaire ni aucun traceur de mesure d'audience. Seules les données strictement nécessaires à l'affichage des pages sont utilisées, et elles restent dans votre navigateur.",
  "legal.ipTitle": "Propriété intellectuelle",
  "legal.ipBody":
    "Les textes, photographies, logos et éléments graphiques de ce site sont la propriété de l'agence ou de ses partenaires. Toute reproduction sans autorisation écrite est interdite.",
  "legal.pricesTitle": "Tarifs et disponibilités",
  "legal.pricesBody":
    "Les tarifs sont indiqués en dirhams, par personne, et correspondent au type de chambre précisé. Ils sont donnés à titre indicatif, restent soumis à disponibilité au moment de la réservation, et ne constituent un engagement qu'une fois la réservation confirmée par l'agence. Les programmes dont la date de départ est passée sont conservés à titre d'historique et ne sont plus réservables.",
  // panier
  "meta.cart.title": "Panier",
  "meta.cart.desc": "Les programmes que vous avez retenus, prêts à être envoyés à l'agence.",
  "cart.title": "Votre panier",
  "cart.open": "Voir le panier",
  "cart.lead":
    "Vérifiez les programmes retenus, puis envoyez votre demande. L'agence vous répond avec la disponibilité et les modalités de règlement.",
  "cart.empty": "Votre panier est vide",
  "cart.emptyLead": "Parcourez les programmes et ajoutez ceux qui vous intéressent.",
  "cart.browse": "Voir les programmes",
  "cart.add": "Ajouter au panier",
  "cart.added": "Ajouté au panier",
  "cart.remove": "Retirer",
  "cart.line": "Programme",
  "cart.people": "Voyageurs",
  "cart.unit": "Prix par personne",
  "cart.lineTotal": "Sous-total",
  "cart.total": "Total",
  "cart.quoteNote":
    "Un programme de votre panier est proposé sur devis : le total ci-dessus ne le comprend pas.",
  "cart.noPayment":
    "Aucun paiement n'est demandé sur ce site. Votre demande part à l'agence, qui vous confirme la disponibilité et convient avec vous des modalités de règlement.",
  "cart.yourDetails": "Vos coordonnées",
  "cart.checkout": "Envoyer la demande",
  "cart.sentTitle": "Demande envoyée",
  "cart.sentBody":
    "Nous avons bien reçu votre demande. L'agence vous recontacte très vite pour confirmer la disponibilité.",
} as const;

/** The shape every other language must satisfy. */
export type TranslationKey = keyof typeof fr;
export type Dictionary = Record<TranslationKey, string>;
