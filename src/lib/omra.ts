import { IMG, monoT, monoTList } from "@/lib/tours";
import { addressFor, agency } from "@/config/agency";
import { pick, pickList } from "@/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/types";
import type { Locale, Localized, LocalizedList } from "@/i18n/types";

/**
 * OMRA / HAJJ PROGRAMMES.
 *
 * Every piece of prose here is per-language. The section was Arabic-only in
 * the template this grew out of, and on a trilingual site that produced pages
 * with French headings wrapped around Arabic content — and Arabic sitting in
 * an LTR paragraph, which throws its punctuation to the wrong end.
 *
 * Prices are digits only: the currency word comes from the dictionary in the
 * reader's own language (see money() in @/i18n).
 */

export type PriceRow = {
  /** Hotel name — transliterated for the Latin languages. */
  label: Localized;
  sub?: Localized;
  quad: string;
  triple: string;
  double: string;
  /** Some programmes price a 5-share room too; omitted when they don't. */
  quint?: string;
};

export type PriceTable = {
  name: Localized;
  tag: Localized;
  rows: PriceRow[];
};

export type OmraProgram = {
  slug: string;
  category: "omra" | "hajj"; // chooser on the OMRA page: عمرة or حج
  title: Localized;
  shortTitle: Localized;
  image: string;
  /** Digits only, e.g. "20.500" — never a currency word. */
  priceFrom: string;
  flightRoute: Localized;
  description: LocalizedList;
  tables: PriceTable[];
  includes: LocalizedList;
  gallery: string[];
  /** Optional: the page hides what the agency never supplied. */
  dates?: LocalizedList;
  duration?: Localized;
  flight?: Localized;
  notes?: LocalizedList;
};

/** The same programme with one language chosen — what the pages render. */
export type LocalizedProgram = {
  slug: string;
  category: "omra" | "hajj";
  title: string;
  shortTitle: string;
  image: string;
  priceFrom: string;
  flightRoute: string;
  dates: string[];
  duration: string;
  flight: string;
  description: string[];
  tables: { name: string; tag: string; rows: LocalizedRow[] }[];
  includes: string[];
  notes: string[];
  gallery: string[];
};

export type LocalizedRow = {
  label: string;
  sub?: string;
  quad: string;
  triple: string;
  double: string;
  quint?: string;
};

/**
 * Resolve a whole programme into one language up front, so the pages go on
 * rendering plain strings instead of calling pick() at thirty render sites.
 */
export function localizeProgram(p: OmraProgram, locale: Locale): LocalizedProgram {
  const s = (v: Localized | undefined) => (v ? pick(locale, v) : "");
  const l = (v: LocalizedList | undefined) => (v ? pickList(locale, v) : []);
  return {
    slug: p.slug,
    category: p.category,
    image: p.image,
    priceFrom: p.priceFrom,
    gallery: p.gallery,
    title: s(p.title),
    shortTitle: s(p.shortTitle),
    flightRoute: s(p.flightRoute),
    dates: l(p.dates),
    duration: s(p.duration),
    flight: s(p.flight),
    description: l(p.description),
    includes: l(p.includes),
    notes: l(p.notes),
    tables: p.tables.map((table) => ({
      name: s(table.name),
      tag: s(table.tag),
      rows: table.rows.map((r) => ({
        quad: r.quad,
        triple: r.triple,
        double: r.double,
        quint: r.quint,
        label: s(r.label),
        sub: r.sub ? s(r.sub) : undefined,
      })),
    })),
  };
}


/**
 * Same, for head() and other places outside React, where the language is a
 * raw route param rather than a checked Locale.
 */
export function localizeProgramFor(p: OmraProgram, lang: unknown): LocalizedProgram {
  return localizeProgram(p, isLocale(lang) ? lang : DEFAULT_LOCALE);
}

/** Filled by the client in wp-admin (CPT `omra`). */
export const omraPrograms: OmraProgram[] = [
  {
    slug: "omra-ramadan-2027-economique",
    category: "omra",
    title: monoT("عمرة رمضان 2027 — البرامج الاقتصادية"),
    shortTitle: monoT("رمضان — اقتصادي"),
    image: IMG.hajj,
    priceFrom: "22 000",
    flightRoute: monoT("طيران ناس — رحلة مباشرة إلى جدة"),
    dates: monoTList(["رمضان 1448 / 2027"]),
    duration: monoT("4 ليالٍ في المدينة المنورة والباقي بمكة المكرمة"),
    flight: monoT("طيران ناس — رحلة مباشرة إلى جدة"),
    description: monoTList([
      "رحلة إيمانية في أفضل أيام السنة.",
      "في رمضان، تتضاعف الأجر وتتنزل الرحمة، وللعمرة طعم آخر وروحانية أعظم.",
      "ثلاث صيغ اقتصادية حسب فندق مكة المكرمة.",
    ]),
    tables: [
      {
        name: monoT("البرامج الاقتصادية"),
        tag: monoT("اقتصادي"),
        rows: [
          {
            label: monoT("الاقتصادي الأول"),
            sub: monoT("المدينة المنورة: فندق ثلاث نجوم — مكة: فندق ترست مكان"),
            double: "30 200",
            triple: "27 000",
            quad: "24 000",
            quint: "22 000",
          },
          {
            label: monoT("الاقتصادي الثاني"),
            sub: monoT("المدينة المنورة: فندق ثلاث نجوم — مكة: جادة الخليل"),
            double: "35 300",
            triple: "29 800",
            quad: "26 800",
            quint: "25 700",
          },
          {
            label: monoT("الاقتصادي الثالث"),
            sub: monoT("المدينة المنورة: فندق ثلاث نجوم — مكة: فندق فرسان أجياد"),
            double: "42 000",
            triple: "34 500",
            quad: "29 800",
            quint: "28 500",
          },
        ],
      },
    ],
    includes: monoTList([
      "تذكرة ذهاب وعودة على متن طيران ناس",
      "4 ليالٍ في المدينة والباقي بمكة",
      "نقل داخلي مكيف في السعودية",
      "تأطير ديني وتقني طيلة الرحلة",
      "خدمات متابعة ودعم طيلة الرحلة",
    ]),
    notes: monoTList([
      "إضافة 1500 درهم للمن لمن يرغب في الرحلة مع الخطوط ناس مباشرة إلى المدينة",
      "إضافة 2500 درهم للمن لمن يرغب في الرحلة مع الخطوط الملكية المغربية مباشرة إلى المدينة",
      "جواز سفر لا تقل مدة صلاحيته عن 6 أشهر",
    ]),
    gallery: [],
  },
  {
    slug: "omra-ramadan-2027-touristique",
    category: "omra",
    title: monoT("عمرة رمضان 2027 — البرامج السياحية"),
    shortTitle: monoT("رمضان — سياحي"),
    image: "/Hajj.jpg",
    priceFrom: "41 000",
    flightRoute: monoT("طيران ناس — رحلة مباشرة إلى جدة"),
    dates: monoTList(["رمضان 1448 / 2027"]),
    duration: monoT("4 ليالٍ في المدينة المنورة والباقي بمكة المكرمة"),
    flight: monoT("طيران ناس — رحلة مباشرة إلى جدة"),
    description: monoTList([
      "تجمع القلوب وتحقق الأمنيات.",
      "في شهر الرحمة: تسمو الأرواح وتطمئن القلوب، وتزداد العمرة بركة وسكينة.",
      "ثلاث صيغ سياحية بفنادق أربع نجوم بالمدينة المنورة.",
    ]),
    tables: [
      {
        name: monoT("البرامج السياحية"),
        tag: monoT("سياحي"),
        rows: [
          {
            label: monoT("البرنامج الأول"),
            sub: monoT("المدينة المنورة: 4 نجوم — مكة: إفيينيني"),
            double: "61 500",
            triple: "48 500",
            quad: "41 000",
          },
          {
            label: monoT("البرنامج الثاني"),
            sub: monoT("المدينة المنورة: 4 نجوم — مكة: ميسان المقام"),
            double: "62 500",
            triple: "48 800",
            quad: "42 500",
          },
          {
            label: monoT("البرنامج الثالث"),
            sub: monoT("المدينة المنورة: 4 نجوم — مكة: الشهداء 2 نجوم"),
            double: "86 500",
            triple: "71 000",
            quad: "62 900",
          },
        ],
      },
    ],
    includes: monoTList([
      "تذكرة ذهاب وعودة على متن طيران ناس",
      "4 ليالٍ في المدينة والباقي بمكة",
      "نقل داخلي مكيف في السعودية",
      "تأطير ديني وتقني طيلة الرحلة",
      "خدمات متابعة ودعم طيلة الرحلة",
    ]),
    notes: monoTList([
      "إضافة 2000 درهم لمن يرغب في الرحلة مع الخطوط الملكية المغربية مباشرة إلى المدينة",
      "جواز سفر لا تقل مدة صلاحيته عن 6 أشهر",
    ]),
    gallery: [],
  },
  {
    slug: "dubai-omra-2026",
    category: "omra",
    title: monoT("دبي مع عمرة"),
    shortTitle: monoT("دبي مع عمرة"),
    image: IMG.hajj,
    priceFrom: "19 800",
    flightRoute: monoT("تذكرة ذهاب وإياب على متن طيران الإمارات"),
    dates: monoTList(["من 25 نونبر 2026 إلى 09 دجنبر 2026"]),
    duration: monoT("5 ليالٍ في دبي — 4 ليالٍ بالمدينة المنورة — 6 ليالٍ بمكة المكرمة"),
    flight: monoT("طيران الإمارات"),
    description: monoTList([
      "رحلة استثنائية تجمع متعة السفر وسكينة العبادة.",
      "عش دبي كما تحلم بها… وأدِّ العمرة كما يتمناها قلبك.",
      "تشمل جولة سياحية ليوم كامل في مدينة دبي.",
    ]),
    tables: [
      {
        name: monoT("الفنادق والأسعار"),
        tag: monoT("دبي + عمرة"),
        rows: [
          {
            label: monoT("الصيغة الأولى"),
            sub: monoT("دبي: Al Khoory Atrium — المدينة: فندق 5 نجوم — مكة: إعمار جراند"),
            double: "23 200",
            triple: "20 700",
            quad: "19 800",
          },
          {
            label: monoT("الصيغة الثانية"),
            sub: monoT("دبي: Al Khoory Atrium — المدينة: كارون بلازا — مكة: الشهداء"),
            double: "26 000",
            triple: "24 000",
            quad: "22 500",
          },
        ],
      },
    ],
    includes: monoTList([
      "خدمات متكاملة من المغادرة إلى العودة",
      "تذكرة ذهاب وإياب على متن طيران الإمارات",
      "5 ليالٍ في دبي بفندق فاخر",
      "4 ليالٍ بالمدينة و6 ليالٍ بمكة",
      "جولة سياحية ليوم كامل في مدينة دبي",
      "تنقلات المطار والفندق ذهابًا وإيابًا في دبي",
      "تنقلات داخل السعودية بحافلات حديثة ومكيفة",
      "تأطير تقني طيلة مدة الرحلة",
    ]),
    notes: monoTList(["جواز سفر لا تقل مدة صلاحيته عن 6 أشهر", "تأشيرة الإمارات حسب الحالة"]),
    gallery: [],
  },
  {
    slug: "omra-octobre-2026",
    category: "omra",
    title: monoT("عمرة أكتوبر 2026"),
    shortTitle: monoT("عمرة أكتوبر"),
    image: IMG.hajj,
    priceFrom: "11 800",
    flightRoute: monoT("رحلة مباشرة إلى جدة على متن طيران ناس"),
    dates: monoTList([
      "المرحلة الأولى: من 27/09/2026 إلى 11/10/2026",
      "المرحلة الثانية: من 11/10/2026 إلى 25/10/2026",
    ]),
    duration: monoT("برنامج 15 يومًا — 4 ليالٍ بالمدينة المنورة والباقي بمكة المكرمة"),
    flight: monoT("طيران ناس — رحلة مباشرة إلى جدة"),
    description: monoTList([
      "خدمة ضيوف الرحمن… شرف ومسؤولية نفخر بها.",
      "عرض استثنائي: برنامجان حسب مستوى الإقامة، الاقتصادي والسياحي.",
      "الإقامة: 4 ليالٍ بالمدينة المنورة والباقي بمكة المكرمة.",
    ]),
    tables: [
      {
        name: monoT("البرنامج الاقتصادي — المختار العالمي (المدينة) / ملتزم الحياة (مكة)"),
        tag: monoT("اقتصادي"),
        rows: [
          {
            label: monoT("البرنامج الاقتصادي"),
            sub: monoT("المختار العالمي / ملتزم الحياة"),
            double: "14 900",
            triple: "13 900",
            quad: "13 500",
            quint: "11 800",
          },
        ],
      },
      {
        name: monoT("البرنامج السياحي — رواء الذهبية (المدينة) / انفينيتي (مكة)"),
        tag: monoT("سياحي"),
        rows: [
          {
            label: monoT("البرنامج السياحي"),
            sub: monoT("رواء الذهبية / انفينيتي"),
            double: "17 900",
            triple: "16 900",
            quad: "15 900",
          },
        ],
      },
    ],
    includes: monoTList([
      "تذكرة ذهاب وعودة على متن طيران مباشر",
      "الإقامة بالفنادق حسب البرنامج",
      "رسوم التأشيرة والتأمين",
      "التأطير التقني",
      "جميع التنقلات الداخلية للمجموعات",
      "المزارات بالمدينة المنورة",
    ]),
    notes: monoTList([
      "جواز سفر لا تقل مدة صلاحيته عن 6 أشهر",
      "صورة واحدة بخلفية بيضاء",
      "معاينة المعني بالأمر ضرورية",
      "حجز مواعيد الصلاة في الروضة الشريفة يتم حاليًا بشكل فردي عبر تطبيق «نسك».",
    ]),
    gallery: [],
  },
  {
    slug: "omra-mawlid-1448",
    category: "omra",
    title: monoT("عمرة المولد النبوي 1448 / 2026"),
    shortTitle: monoT("عمرة المولد"),
    image: "/Hajj.jpg",
    priceFrom: "16 500",
    flightRoute: monoT("طيران مباشر من الدار البيضاء إلى المدينة المنورة مع الخطوط الملكية المغربية"),
    dates: monoTList(["من 07/09/2026 إلى 21/09/2026"]),
    duration: monoT("برنامج 15 يومًا — 4 ليالٍ بالمدينة المنورة والباقي بمكة المكرمة"),
    flight: monoT("الخطوط الملكية المغربية — رحلة مباشرة إلى المدينة المنورة"),
    description: monoTList([
      "عمرة المولد النبوي الشريف مع طيران مباشر من الدار البيضاء إلى المدينة المنورة.",
      "أربع صيغ للإقامة حسب الفندق والمسافة من الحرم.",
    ]),
    tables: [
      {
        name: monoT("الفنادق والأسعار"),
        tag: monoT("المولد"),
        rows: [
          {
            label: monoT("أركان المنار (المدينة) / ضيافة الرجاء (مكة)"),
            sub: monoT("600 متر"),
            double: "19 500",
            triple: "18 500",
            quad: "17 500",
            quint: "16 500",
          },
          {
            label: monoT("أركان المنار (المدينة) / إعمار جراند (مكة)"),
            sub: monoT("700 متر — مع الإفطار"),
            double: "21 500",
            triple: "19 800",
            quad: "18 500",
          },
          {
            label: monoT("الحارثية (المدينة) / الشهداء (مكة)"),
            sub: monoT("500 متر — مع الإفطار"),
            double: "24 700",
            triple: "22 900",
            quad: "22 000",
          },
          {
            label: monoT("الحارثية (المدينة) / سويس مكة أو فيرمونت"),
            sub: monoT("مع الإفطار"),
            double: "32 500",
            triple: "31 000",
            quad: "28 500",
          },
        ],
      },
    ],
    includes: monoTList([
      "تذكرة ذهاب وعودة على متن طيران مباشر",
      "الإقامة بالفنادق حسب البرنامج",
      "رسوم التأشيرة والتأمين",
      "التأطير التقني",
      "جميع التنقلات الداخلية للمجموعات",
      "المزارات بالمدينة المنورة",
    ]),
    notes: monoTList([
      "جواز سفر لا تقل مدة صلاحيته عن 6 أشهر",
      "صورة واحدة بخلفية بيضاء",
      "معاينة المعني بالأمر ضرورية",
      "حجز مواعيد الصلاة في الروضة الشريفة يتم حاليًا بشكل فردي عبر تطبيق «نسك».",
    ]),
    gallery: [],
  },
  {
    slug: "omra-novembre-2026",
    category: "omra",
    title: monoT("عمرة نونبر 1448 / 2026"),
    shortTitle: monoT("عمرة نونبر"),
    image: IMG.hajj,
    priceFrom: "15 000",
    flightRoute: monoT("الذهاب من الدار البيضاء إلى جدة، والعودة من المدينة المنورة إلى الدار البيضاء"),
    dates: monoTList(["من 02/11/2026 إلى 15/11/2026"]),
    duration: monoT("برنامج 14 يومًا — 4 ليالٍ بالمدينة المنورة والباقي بمكة المكرمة"),
    flight: monoT("الخطوط الملكية المغربية — طيران مباشر"),
    description: monoTList([
      "عمرة شهر نونبر مع الخطوط الملكية المغربية، طيران مباشر ذهابًا وإيابًا.",
      "أربع صيغ للإقامة حسب الفندق والمسافة من الحرم.",
    ]),
    tables: [
      {
        name: monoT("الفنادق والأسعار"),
        tag: monoT("نونبر"),
        rows: [
          {
            label: monoT("زوار العالمي (المدينة) / ضيافة الرجاء (مكة)"),
            sub: monoT("600 متر"),
            double: "18 000",
            triple: "17 000",
            quad: "16 000",
            quint: "15 000",
          },
          {
            label: monoT("زوار العالمي (المدينة) / إعمار جراند (مكة)"),
            sub: monoT("700 متر — مع الإفطار"),
            double: "20 000",
            triple: "18 500",
            quad: "17 000",
          },
          {
            label: monoT("مكارم أم الحرم (المدينة) / الشهداء (مكة)"),
            sub: monoT("500 متر — مع الإفطار"),
            double: "23 200",
            triple: "21 400",
            quad: "20 500",
          },
          {
            label: monoT("مكارم أم الحرم (المدينة) / سويس مكة"),
            sub: monoT("مع الإفطار"),
            double: "31 000",
            triple: "29 500",
            quad: "27 000",
          },
        ],
      },
    ],
    includes: monoTList([
      "تذكرة ذهاب وعودة على متن طيران مباشر",
      "الإقامة بالفنادق حسب البرنامج",
      "رسوم التأشيرة والتأمين",
      "التأطير التقني",
      "جميع التنقلات الداخلية للمجموعات",
      "المزارات بالمدينة المنورة",
    ]),
    notes: monoTList([
      "جواز سفر لا تقل مدة صلاحيته عن 6 أشهر",
      "صورة واحدة بخلفية بيضاء",
      "معاينة المعني بالأمر ضرورية",
      "حجز مواعيد الصلاة في الروضة الشريفة يتم حاليًا بشكل فردي عبر تطبيق «نسك».",
    ]),
    gallery: [],
  },
  {
    slug: "omra-janvier-2027",
    category: "omra",
    title: monoT("عمرة يناير 1448 / 2027"),
    shortTitle: monoT("عمرة يناير"),
    image: "/Hajj.jpg",
    priceFrom: "15 500",
    flightRoute: monoT("الذهاب من الدار البيضاء إلى جدة، والعودة من المدينة المنورة إلى الدار البيضاء"),
    dates: monoTList(["من 02/01/2027 إلى 16/01/2027"]),
    duration: monoT("برنامج 15 يومًا — 4 ليالٍ بالمدينة المنورة والباقي بمكة المكرمة"),
    flight: monoT("الخطوط الملكية المغربية — طيران مباشر"),
    description: monoTList([
      "عمرة شهر يناير مع الخطوط الملكية المغربية، طيران مباشر ذهابًا وإيابًا.",
      "أربع صيغ للإقامة حسب الفندق والمسافة من الحرم.",
    ]),
    tables: [
      {
        name: monoT("الفنادق والأسعار"),
        tag: monoT("يناير"),
        rows: [
          {
            label: monoT("زوار العالمي (المدينة) / ضيافة الرجاء (مكة)"),
            sub: monoT("600 متر"),
            double: "18 500",
            triple: "17 500",
            quad: "16 500",
            quint: "15 500",
          },
          {
            label: monoT("زوار العالمي (المدينة) / إعمار جراند (مكة)"),
            sub: monoT("700 متر — مع الإفطار"),
            double: "20 500",
            triple: "18 800",
            quad: "17 500",
          },
          {
            label: monoT("مكارم أو الحرم (المدينة) / الشهداء (مكة)"),
            sub: monoT("500 متر — مع الإفطار"),
            double: "23 700",
            triple: "21 900",
            quad: "21 000",
          },
          {
            label: monoT("مكارم أو الحرم (المدينة) / سويس مكة"),
            sub: monoT("مع الإفطار"),
            double: "31 500",
            triple: "30 000",
            quad: "27 500",
          },
        ],
      },
    ],
    includes: monoTList([
      "تذكرة ذهاب وعودة على متن طيران مباشر",
      "الإقامة بالفنادق حسب البرنامج",
      "رسوم التأشيرة والتأمين",
      "التأطير التقني",
      "جميع التنقلات الداخلية للمجموعات",
      "المزارات بالمدينة المنورة",
    ]),
    notes: monoTList([
      "جواز سفر لا تقل مدة صلاحيته عن 6 أشهر",
      "صورة واحدة بخلفية بيضاء",
      "معاينة المعني بالأمر ضرورية",
      "حجز مواعيد الصلاة في الروضة الشريفة يتم حاليًا بشكل فردي عبر تطبيق «نسك».",
    ]),
    gallery: [],
  },
];

export const agencyPhones = agency.contact.phones;

export const whatsappNumber = agency.contact.whatsapp;

export const agencyAddresses = (locale: Locale) => [addressFor(locale)];
