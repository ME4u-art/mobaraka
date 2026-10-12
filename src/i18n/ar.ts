import type { Dictionary } from "./fr";

/**
 * Arabic. Typed as Dictionary, so a key missing here fails the build.
 *
 * Numbers stay in Western digits — Moroccan agencies quote prices that way,
 * and mixing digit systems inside an RTL line is where bidi text goes wrong.
 */
export const ar: Dictionary = {
  "nav.voyages": "رحلاتنا",
  "nav.hajjOmra": "الحج والعمرة",
  "nav.maroc": "انطلاقات من المغرب",
  "nav.transport": "النقل",
  "nav.mice": "المؤتمرات والحوافز",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.menu": "القائمة",
  "nav.close": "إغلاق",
  "header.tagline": "تابعونا · وكالة أسفار بالمغرب",
  "header.langLabel": "اختر اللغة",

  "footer.ourTrips": "رحلاتنا",
  "footer.services": "خدماتنا",
  "footer.contact": "اتصل بنا",
  "footer.legal": "إشعار قانوني",
  "footer.privacy": "سياسة الخصوصية",
  "footer.cookies": "سياسة ملفات تعريف الارتباط",
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.agencyType": "وكالة أسفار",
  "footer.findUs": "أين تجدنا",
  "footer.usefulLinks": "روابط مفيدة",
  "footer.cgu": "شروط الاستخدام",
  "footer.organisedTrips": "رحلات منظمة",
  "footer.contactLink": "اتصل بنا",

  "home.heroCta": "اكتشف برنامجنا",
  "home.prevProgram": "البرنامج السابق",
  "home.nextProgram": "البرنامج التالي",
  "home.goToProgram": "الانتقال إلى البرنامج {n}",
  "home.prev": "السابق",
  "home.next": "التالي",
  "home.organisedTrips": "رحلات منظمة",
  "home.destinations": "وجهاتنا",
  "home.moroccoTitle": "المغرب، بشكل مختلف.",
  "home.cruises": "رحلاتنا البحرية",
  "home.cruisesTitle": "اكتشف العالم عبر البحر.",
  "home.miceTitle": "الاجتماعات والحوافز والمؤتمرات والمعارض",
  "home.partners": "شركاؤنا",
  "meta.home.title": "{agency} — وكالة أسفار بالمغرب",
  "meta.home.desc":
    "رحلات منظمة، وجولات، ورحلات بحرية، والحج والعمرة، والمؤتمرات. اكتشف العالم مع {agency}، وكالة أسفار بالمغرب.",
  "meta.home.ogDesc": "رحلات منظمة، وجولات، ورحلات بحرية، والحج والعمرة، والمؤتمرات.",
  "home.fareWithFlight": "الثمن يشمل تذكرة الطيران",
  "home.seeAllTrips": "عرض جميع الرحلات",
  "home.cruisesLead":
    "الكاريبي، وشرق البحر الأبيض المتوسط، وحول العالم — من شركائنا: رويال كاريبيان وMSC وغيرهما الكثير.",
  "home.seeCruises": "عرض الرحلات البحرية",
  "home.miceLead":
    "ترافقكم {agency} في تنظيم الندوات والمؤتمرات واللقاءات والرحلات التحفيزية. من التصور إلى التنظيم اللوجيستي، نصنع فعاليات مهنية لا تُنسى.",
  "action.learnMore": "اعرف المزيد",
  "home.moroccoLead":
    "اكتشف المملكة عبر مدنها العتيقة وسواحلها وصحاريها — بين الثقافة والراحة والمغامرة.",
  "action.moreDetail": "مزيد من التفاصيل",

  "action.discover": "اكتشف",
  "action.seeAll": "عرض الكل",
  "action.book": "احجز الآن",
  "action.details": "عرض البرنامج",
  "action.backHome": "العودة إلى الصفحة الرئيسية",
  "action.contactUs": "اتصل بنا",

  "tour.from": "ابتداءً من",
  "tour.onRequest": "حسب الطلب",
  "tour.quote": "اطلب عرض سعر",
  "tour.indicative": "برنامج إرشادي. تؤكد لكم الوكالة خط السير والتواريخ والثمن قبل أي حجز.",
  "tour.bookOnline": "احجز عبر الإنترنت",
  "tour.perPerson": "للشخص الواحد",
  "tour.duration": "المدة",
  "tour.dates": "التواريخ",
  "tour.included": "البرنامج يشمل",
  "tour.notIncluded": "البرنامج لا يشمل",
  "tour.itinerary": "البرنامج يومًا بيوم",
  "tour.highlights": "أبرز المحطات",
  "tour.noResults": "لا يوجد برنامج يطابق بحثك.",

  "pilgrimage.title": "الحج والعمرة",
  "pilgrimage.hotels": "الفنادق",
  "pilgrimage.roomDouble": "غرفة ثنائية",
  "pilgrimage.roomTriple": "غرفة ثلاثية",
  "pilgrimage.roomQuad": "غرفة رباعية",

  "region.all": "الكل",
  "region.Asie": "آسيا",
  "region.Europe": "أوروبا",
  "region.Afrique": "إفريقيا",
  "region.Ameriques": "الأمريكتان",
  "region.MoyenOrient": "الشرق الأوسط",

  "voyages.title": "جميع وجهاتنا",
  "voyages.lead": "رحلات جماعية مع تذكرة الطيران انطلاقاً من المغرب، بمرافقة مرشدينا.",

  "tour.overview": "نظرة عامة على البرنامج",
  "tour.overviewBody": "برنامج من تنظيم {agency} وبمرافقة فرقنا، من لحظة المغادرة إلى العودة.",
  "tour.yourItinerary": "مسار رحلتك",
  "tour.includedTitle": "ما يشمله البرنامج",
  "tour.notIncludedTitle": "غير مشمول",
  "tour.pricePerPerson": "الثمن للشخص الواحد",
  "tour.priceNoteDefault": "على أساس غرفة ثنائية، حسب توفر الأماكن.",
  "tour.deposit": "احجز عبر الإنترنت — تسبيق 3 000 درهم",
  "tour.gallery": "صور من الرحلة",
  "tour.galleryEyebrow": "بالصور",
  "tour.seeAll": "عرض جميع الرحلات",
  "tour.notFound": "الرحلة غير موجودة",
  "tour.fbFlights": "الرحلات الجوية الدولية",
  "tour.fbHotel": "الإقامة",
  "tour.fbTransfers": "التنقلات",
  "tour.fbGuiding": "المرافقة طيلة الرحلة",

  "maroc.eyebrow": "انطلاقات مضمونة داخل المغرب",
  "maroc.title": "اكتشف المغرب بشكل مختلف.",
  "maroc.lead": "رحلات مدروسة بعناية تجمع بين الثقافة والراحة والمغامرة.",
  "maroc.circuits": "رحلات داخل المغرب",
  "maroc.destinations": "وجهاتنا داخل المغرب",
  "maroc.ifrane": "يوم في قلب إفران",
  "maroc.imperial": "في قلب المدن العتيقة",
  "maroc.south": "جنوب المغرب",

  "mice.lead":
    "من التصور إلى التنظيم اللوجيستي، نصمم وننفذ فعاليات مهنية على المقاس، داخل المغرب وخارجه.",
  "mice.quote": "اطلب عرض ثمن",
  "mice.meetings": "الاجتماعات",
  "mice.meetingsDesc": "اجتماعات الشركات بتنظيم كامل.",
  "mice.incentives": "الرحلات التحفيزية",
  "mice.incentivesDesc": "رحلات التحفيز والمكافآت.",
  "mice.conferences": "المؤتمرات",
  "mice.conferencesDesc": "مؤتمرات مهنية وعلمية.",
  "mice.exhibitions": "المعارض",
  "mice.exhibitionsDesc": "معارض وفعاليات كبرى.",
  "mice.gallery": "فعالياتنا بالصور",

  "transport.title": "راحتك أولويتنا.",
  "transport.lead":
    "أسطول من السيارات الفاخرة، وسائقون محترفون، وخدمة تنفيذية لتنقلاتكم الفردية والجماعية داخل المغرب.",
  "transport.cta": "احجز خدمة نقل",
  "transport.fleet": "أسطول فاخر",
  "transport.fleetDesc": "سيارات وسيارات دفع رباعي وحافلات صغيرة وفانات VIP حديثة.",
  "transport.safety": "السلامة",
  "transport.safetyDesc": "سائقون مؤهلون، سيارات مؤمَّنة، وتتبع للرحلات.",
  "transport.always": "24/7",
  "transport.alwaysDesc": "متوفرون دائماً، وفي الموعد دائماً.",

  "about.eyebrow": "من نحن",
  "about.title": "نسافر، بكل قلوبنا.",
  "about.p1":
    "{agency} وكالة أسفار مغربية تصمم منذ سنوات تجارب سفر مدروسة بعناية: رحلات جماعية، وإقامات على المقاس، والحج والعمرة، وأسفار الأعمال.",
  "about.p2":
    "قوتنا: فريق شغوف، وشبكة دولية من الشركاء المنتقين بعناية، ومتابعة شخصية قبل السفر وأثناءه وبعده.",
  "about.statYears": "سنة من الخبرة",
  "about.statTravellers": "مسافر سعيد",
  "about.statDestinations": "وجهة نغطيها",

  "contact.title": "لنتحدث عن رحلتك القادمة.",
  "contact.lead": "فريقنا يجيبكم داخل 24 ساعة عمل.",
  "contact.firstName": "الاسم الشخصي",
  "contact.lastName": "الاسم العائلي",
  "contact.email": "البريد الإلكتروني",
  "contact.subject": "الموضوع",
  "contact.message": "الرسالة",
  "contact.send": "إرسال",

  "gallery.title": "صور من رحلاتنا",
  "gallery.lead": "بعض الذكريات من رحلاتنا ومواسمنا الأخيرة.",

  "hajj.omra": "العمرة",
  "hajj.hajj": "الحج",
  "hajj.eyebrow": "العمرة والحج",
  "hajj.heroTitle": "سافروا بكل طمأنينة إلى الأماكن المقدسة",
  "hajj.heroLead":
    "برامج متكاملة، وتأطير ديني، وفنادق قريبة من الحرم، وطيران مباشر — انطلاقاً من المغرب.",
  "hajj.omraCta": "برنامج العمرة",
  "hajj.hajjCta": "برنامج الحج 2027",
  "hajj.ourPrograms": "برامجنا",
  "hajj.chooseTitle": "اختر برنامجك",
  "hajj.chooseLead": "اضغط على البرنامج لعرض الأسعار والفنادق والتفاصيل الكاملة.",
  "hajj.seeDetails": "عرض التفاصيل والأسعار",
  "hajj.allIncluded": "كل شيء مشمول",
  "hajj.ourServices": "خدماتنا المشمولة",
  "hajj.svcFlight": "تذكرة الطيران ذهاباً وإياباً",
  "hajj.svcHotel": "الإقامة في الفنادق",
  "hajj.svcTransfers": "التنقلات داخل السعودية",
  "hajj.svcVisits": "زيارات بمكة والمدينة",
  "hajj.svcGuide": "مرشد مرافق للمجموعة",
  "hajj.svcVisa": "رسوم التأشيرة مشمولة",
  "hajj.whyUs": "لماذا {agency}",
  "hajj.whyTitle": "مرافقة تثقون بها",
  "hajj.why1": "مجموعات مؤطَّرة ومريحة",
  "hajj.why2": "مرشدون دينيون ذوو خبرة",
  "hajj.why3": "مرافقة روحية",
  "hajj.why4": "فنادق قريبة من الحرم",
  "hajj.why5": "مساعدة على مدار الساعة",
  "hajj.why6": "طيران مباشر — وكالة موثوقة",
  "hajj.bookNow": "احجز مكانك الآن",
  "hajj.bookLead": "يرافقكم مستشارونا لاختيار الصيغة المثالية. تواصلوا مع {agency}:",
  "hajj.programDetail": "تفاصيل البرنامج",
  "hajj.duration": "المدة",
  "hajj.departures": "الانطلاقات",
  "hajj.flight": "الطيران",
  "hajj.pricesTitle": "الأسعار والفنادق",
  "hajj.pricesLead": "الأسعار للفرد الواحد بالدرهم.",
  "hajj.hotel": "الفندق",
  "hajj.included": "البرنامج يشمل",
  "hajj.goodToKnow": "معلومات مفيدة",
  "hajj.gallery": "صور من مواسمنا",
  "hajj.contactTitle": "لديكم سؤال حول هذا البرنامج؟",
  "hajj.whatsapp": "راسلونا على واتساب",
  "hajj.backToPrograms": "العودة إلى البرامج",
  "hajj.notFound": "البرنامج غير موجود",
  "nav.home": "الرئيسية",
  "hajj.via": "عبر",
  "hajj.multiDates": "عدة تواريخ للانطلاق — اختر تاريخك في نموذج الحجز.",
  "hajj.tripDescription": "وصف الرحلة",
  "hajj.priceNote": "الأسعار للفرد الواحد بالدرهم حسب نوع الغرفة.",
  "hajj.note": "ملاحظة",
  "hajj.galleryEyebrow": "معرض الصور",
  "hajj.photo": "صورة",
  "hajj.roomDouble": "ثنائية",
  "hajj.roomTriple": "ثلاثية",
  "hajj.roomQuad": "رباعية",
  "hajj.roomQuint": "خماسية",
  "book.title": "احجز الآن",
  "book.lead": "احجز رحلتك في بضع نقرات من خلال ملء هذا النموذج:",
  "book.program": "البرنامج",
  "book.chooseProgram": "اختر البرنامج",
  "book.date": "تاريخ الرحلة",
  "book.chooseDate": "اختر تاريخ الانطلاق",
  "book.chooseHotel": "اختر الفندق",
  "book.room": "الغرفة",
  "book.chooseRoom": "اختر نوع الغرفة",
  "book.people": "عدد الأشخاص",
  "book.fullName": "الاسم الكامل",
  "book.phone": "رقم الهاتف",
  "book.submit": "مواصلة الحجز",
  "book.privacy":
    "طبقاً للقانون 09-08، لكم الحق في الولوج إلى معطياتكم الشخصية وتصحيحها والاعتراض على معالجتها.",
  "book.sentTitle": "تم إرسال طلبكم",
  "book.sentBody":
    "شكراً لكم. سيتواصل معكم أحد مستشاري {agency} خلال 24 ساعة لتأكيد الحجز في «{program}».",

  "meta.hajj.title": "العمرة والحج — {agency}",
  "meta.hajj.desc":
    "برامج العمرة والحج مع {agency}: الأسعار والفنادق والتواريخ انطلاقاً من المغرب.",
  "meta.hajj.ogDesc": "العمرة والحج انطلاقاً من المغرب — الأسعار والفنادق والتواريخ.",

  "res.notFound": "البرنامج غير موجود",
  "res.seePrograms": "عرض برامجنا",
  "res.step1": "المعلومات",
  "res.step2": "الأداء",
  "res.step3": "التأكيد",
  "res.pricePerPerson": "الثمن / للشخص",
  "res.depositDue": "التسبيق الواجب أداؤه",
  "res.balance": "الباقي يُؤدى بالوكالة",
  "res.beforeDeparture": "قبل السفر",
  "res.secureNote": "أداء آمن — التسبيق قابل للاسترجاع وفق الشروط.",
  "res.demoNote":
    "نسخة تجريبية — الأداء محاكاة فقط. في النسخة النهائية ترتبط هذه المرحلة ببوابة الأداء البنكية المغربية (Payzone / CMI). لا يتم خصم أي مبلغ من أي بطاقة.",
  "res.yourInfo": "معلوماتكم",
  "res.mainTraveller": "المرجو ملء بيانات المسافر الرئيسي.",
  "res.phone": "الهاتف",
  "res.travellers": "عدد المسافرين",
  "res.departureCity": "مدينة الانطلاق",
  "res.continue": "المتابعة إلى الأداء",
  "res.payTitle": "أداء التسبيق",
  "res.secureBadge": "آمن",
  "res.payLead": "أدِّ {amount} لتأكيد حجزك.",
  "res.cardHolder": "اسم صاحب البطاقة",
  "res.cardNumber": "رقم البطاقة",
  "res.expiry": "تاريخ انتهاء الصلاحية",
  "res.cvc": "الرمز السري CVC",
  "res.processing": "جارٍ المعالجة…",
  "res.pay": "أداء",
  "res.back": "رجوع",
  "res.confirmed": "تم تأكيد الحجز!",
  "res.thanks": "شكراً لكم — توصلنا بتسبيقكم {amount} الخاص بـ {tour}.",
  "res.reference": "المرجع",
  "res.followUp": "سيتصل بكم أحد مستشاري {agency} داخل 24 ساعة لإتمام ملفكم.",
  "res.otherPrograms": "اكتشف برامج أخرى",
  "meta.reservation": "الحجز",

  "meta.voyages.title": "رحلاتنا المنظمة — {agency}",
  "meta.voyages.desc": "جميع رحلاتنا الجماعية مع تذكرة الطيران: آسيا وأوروبا والأمريكتان وغيرها.",
  "meta.maroc.title": "انطلاقات من المغرب — رحلات وإقامات | {agency}",
  "meta.maroc.desc":
    "اكتشف المغرب مع رحلاتنا المدروسة: مراكش، فاس، الصحراء، المدن العتيقة، والساحل الأطلسي.",
  "meta.mice.title": "المؤتمرات والحوافز — ندوات ومعارض | {agency}",
  "meta.mice.desc": "تنظيم الندوات والمؤتمرات والمعارض والرحلات التحفيزية. {agency}.",
  "meta.transport.title": "النقل الخاص والسائقون — {agency}",
  "meta.transport.desc":
    "أسطول فاخر وسائقون محترفون: التنقلات، ووضع السيارات رهن إشارتكم، وخدمة VIP في المغرب.",
  "meta.about.title": "من نحن — {agency}",
  "meta.about.desc":
    "{agency}، وكالة أسفار مغربية: رحلات جماعية، ورحلات بحرية، والحج والعمرة، والمؤتمرات.",
  "meta.contact.title": "اتصل بنا — {agency}",
  "meta.contact.desc": "تواصلوا معنا للحصول على عرض ثمن أو لإتمام حجز أو لأي استفسار.",
  "meta.gallery.title": "صور من رحلاتنا — {agency}",

  "error.notFoundTitle": "الصفحة غير موجودة",
  "error.notFoundBody": "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
  "error.genericTitle": "حدث خطأ ما",
  "error.genericBody": "أعد المحاولة بعد لحظات. إذا استمر الأمر، لا تتردد في الاتصال بنا.",

  // navigation — tour collections
  "nav.circuits": "جولات في المغرب",
  "nav.voyagesOrganises": "رحلات منظمة",
  "nav.cruises": "رحلات بحرية",
  "nav.omra": "العمرة والحج",
  "nav.languageStays": "إقامات لغوية",
  "nav.greatDeals": "عروض مميزة",
  "nav.visa": "التأشيرة",
  "nav.gallery": "معرض الصور",

  // footer — template additions
  "footer.visaFormalities": "التأشيرة والإجراءات",
  "footer.aboutLink": "من نحن",

  // home — collection sections
  "home.circuitsEyebrow": "اكتشف المملكة",
  "home.circuitsLink": "شاهد كل الجولات",
  "home.cruisesEyebrow": "أبحر بعيداً",
  "home.cruisesLink": "شاهد كل الرحلات البحرية",
  "home.staysEyebrow": "تعلّم في الخارج",
  "home.staysLink": "شاهد كل الإقامات",
  "home.dealsEyebrow": "عروض اللحظة",
  "home.dealsLink": "شاهد كل العروض",

  // home — hero
  "home.fromPrice": "ابتداءً من",
  "home.newPrograms": "برامج جديدة",
  "home.omraAccent": "نرافقكم في كل خطوة.",
  "home.omraSubtitle": "فنادق قريبة من الحرم، تأطير ديني كامل، ورحلة مباشرة — عدة مواعيد للسفر.",

  // home — why us
  "home.pillarDestinationsTitle": "أكثر من 20 وجهة",
  "home.pillarDestinationsDesc": "آسيا وأوروبا والأمريكتان وإفريقيا — العالم في متناول يدكم.",
  "home.pillarGroupTitle": "رحلات جماعية",
  "home.pillarGroupDesc": "مرشدون ناطقون بالفرنسية، أجواء ودية، ولحظات مشتركة.",
  "home.pillarTrustTitle": "وكالة موثوقة",
  "home.pillarTrustDesc": "فريق يصغي إليكم قبل الرحلة وأثناءها وبعدها.",
  "home.pillarTailoredTitle": "حسب الطلب",
  "home.pillarTailoredDesc": "كل رحلة تُصمَّم حولكم، وفق رغباتكم.",

  // listings — shared empty state
  "listing.emptyTitle": "برامج قريباً",
  "listing.emptyBody": "ستُنشر برامج جديدة قريباً. تواصلوا معنا لأي استفسار.",

  // listings — leads and meta
  "listing.circuitsLead":
    "جولات في المغرب بإشراف مرشدينا: المدن العتيقة، وقصبات الجنوب، والصحراء، والساحل الأطلسي.",
  "meta.circuits.desc": "جولاتنا في المغرب: المدن العتيقة والصحراء والساحل.",
  "listing.cruisesLead":
    "رحلات بحرية في المتوسط والبحر الأحمر وأبعد: المقصورات، والمحطات، وتواريخ الإبحار.",
  "meta.cruises.desc":
    "رحلاتنا البحرية في المتوسط والبحر الأحمر وأبعد — المقصورات والمحطات ومواعيد الإبحار.",
  "listing.dealsLead": "عروضنا الحالية: أماكن محدودة، ومواعيد قريبة، وأسعار مخفّضة.",
  "meta.deals.desc": "عروضنا وتخفيضاتنا الحالية — رحلات بأسعار مخفّضة وأماكن محدودة.",
  "listing.staysLead": "إقامات لغوية وانغماس ثقافي في الخارج، للشباب والكبار.",
  "meta.stays.desc": "إقامات لغوية وانغماس ثقافي في الخارج، للشباب والكبار.",
  "listing.organisedLead":
    "رحلاتنا الجماعية المنظمة مع تذكرة الطائرة: آسيا وأوروبا وإفريقيا وأبعد.",
  "meta.organised.desc":
    "كل رحلاتنا الجماعية المنظمة مع تذكرة الطائرة: آسيا وأوروبا وإفريقيا وأكثر.",
  "listing.organisedTitle": "كل وجهاتنا",

  // mice — template additions
  "mice.title": "الاجتماعات والحوافز والمؤتمرات والمعارض",
  "mice.leadTemplate":
    "من التصور إلى التنظيم اللوجيستي، نصمم وننفذ فعاليات مهنية على المقاس، في المغرب وخارجه.",

  // visa — the page Capital Tours does not have
  "visa.eyebrow": "التأشيرة والإجراءات",
  "visa.title": "إجراءات تأشيرتكم، ببساطة",
  "visa.lead":
    "نرافقكم من الألف إلى الياء في إجراءات السفر: تجهيز الملف، وحجز موعد القنصلية، والتأمين، والمتابعة إلى حين الحصول على التأشيرة.",
  "visa.cta": "اطلبوا المرافقة",
  "visa.step1": "تجهيز الملف",
  "visa.step1Desc": "لائحة الوثائق، والتحقق منها وترتيب ملفكم.",
  "visa.step2": "الموعد والاستمارات",
  "visa.step2Desc": "حجز الموعد وملء الاستمارات الرسمية.",
  "visa.step3": "الإيداع والمتابعة",
  "visa.step3Desc": "إيداع الطلب ومتابعته إلى غاية القرار.",
  "visa.step4": "تأمين السفر",
  "visa.step4Desc": "شهادة تأمين مطابقة لمتطلبات القنصلية.",
  "visa.benefitTime": "ربح للوقت",
  "visa.benefitTimeDesc": "ملف كامل ومطابق من المرة الأولى، دون ذهاب وإياب.",
  "visa.benefitReliable": "ملف موثوق",
  "visa.benefitReliableDesc": "يتحقق منه فريقنا وفق متطلبات كل قنصلية.",
  "visa.benefitHuman": "مرافقة إنسانية",
  "visa.benefitHumanDesc": "مخاطب واحد مخصص لكم، متاح في كل مرحلة من مراحل طلبكم.",
  "visa.question": "سؤال حول وجهتكم؟ لنتحدث.",
  "meta.visa.title": "التأشيرة والإجراءات | {agency}",
  "meta.visa.desc": "المساعدة في التأشيرة وإجراءات السفر — تجهيز الملف، وحجز الموعد، والمتابعة.",

  // contact — template additions
  "contact.whatsapp": "أو تواصلوا معنا عبر واتساب",
  "contact.mapTitle": "موقع {agency}",

  // gallery — was Arabic-only for every reader
  "gallery.eyebrow": "ذكريات",
  "gallery.emptyTitle": "لا توجد صور حالياً",
  "gallery.emptyBody": "سنقوم بنشر صور رحلاتنا هنا قريباً.",
  "gallery.enlarge": "تكبير الصورة",
  "gallery.close": "إغلاق",
  "gallery.prev": "الصورة السابقة",
  "gallery.next": "الصورة التالية",
  "gallery.alt": "صورة من رحلاتنا",
  "gallery.backToOmra": "العودة إلى العمرة والحج",

  // Omra & Hajj — strings the template has and Capital Tours did not
  "hajj.omraPrograms": "برامج العمرة",
  "hajj.hajjPrograms": "برامج الحج",
  "hajj.chooseType": "اختاروا نوع الرحلة لعرض البرامج المتوفرة.",
  "hajj.heroLeadTemplate":
    "برامج متكاملة، وتأطير ديني، وفنادق قريبة من الحرم، وطيران مباشر — انطلاقاً من المغرب.",
  "hajj.soonTitle": "برامج جديدة قريبًا",
  "hajj.soonBody": "اتصلوا بنا لمعرفة مواعيد البرامج المقبلة.",
  "hajj.kaabaAlt": "الكعبة المشرفة",
  "hajj.seeAllPhotos": "شاهد كل الصور ←",
  "hajj.facebook": "فيسبوك",
  "hajj.contactUs": "تواصل معنا",
  "hajj.omraCardDesc":
    "عيشوا عمرة مطمئنة مع {agency}. نرافقكم في كل المراحل بتنظيم محكم وتأطير مهني وخدمات مريحة، مع إقامة روحية هادئة تمكّنكم من التفرغ للعبادة.",

  // Omra & Hajj — the Hajj card
  "hajj.hajjCardDesc":
    "عيشوا حجًّا مريحًا ومطمئنًّا مع مرافقة {agency} الشاملة: الإجراءات، الإقامة، النقل والمرافقة الروحية — بتنظيم محكم لضمان حجّ آمن وهادئ.",

  // Omra & Hajj — programme count
  "hajj.oneProgram": "برنامج",
  "hajj.manyPrograms": "برامج",
  "hajj.comingSoon": "قريبًا",

  // Omra detail — the last two
  "hajj.pricesInclude": "الأسعار تشمل",

  // Omra detail — gallery caption
  "hajj.photoAlt": "{agency} — صورة",

  // tour detail — flights and itinerary
  "tour.flightDetails": "تفاصيل الرحلات الجوية",
  "tour.flightNo": "رقم الرحلة",
  "tour.departure": "المغادرة",
  "tour.arrival": "الوصول",
  "tour.date": "التاريخ",
  "tour.city": "المدينة",
  "tour.nights": "الليالي",
  "tour.optional": "اختياري",

  // tour detail — price estimator
  "tour.pricesTitle": "الأسعار والصيغ",
  "tour.hotelPackage": "الفندق / الصيغة",
  "tour.roomType": "نوع الغرفة",
  "tour.single": "فردية",
  "tour.adults": "البالغون",
  "tour.childrenAge": "الأطفال (العمر)",
  "tour.estimate": "احسب السعر",
  "tour.estimateTotal": "المجموع التقديري",
  "tour.estimateNote":
    "تقدير إرشادي لا يشمل الرسوم والتأشيرة والإضافات المحتملة. السعر النهائي تؤكده الوكالة.",
  "tour.estimateUnavailable":
    "هذه التركيبة غير متوفرة للصيغة المختارة. تواصلوا مع الوكالة للحصول على عرض ثمن.",
  "tour.booking": "الحجز",

  // home — section headers I missed on the first pass
  "home.voyagesEyebrow": "وجهة أخرى؟",
  "home.holyLands": "الأراضي المقدسة",
  "home.miceEyebrow": "المؤتمرات والحوافز",
  "home.trustedBy": "يثقون بنا",

  // tour detail — flight table
  "tour.flight": "الرحلة",

  // shared badges
  "tour.deal": "عرض",

  // 404 page
  "error.notFoundHeading": "الصفحة غير موجودة",
  "error.notFoundText": "الصفحة التي تبحثون عنها غير موجودة أو تم نقلها.",
  "error.goHome": "العودة إلى الرئيسية",

  // error boundary
  "error.tryAgain": "أعيدوا المحاولة",

  // price estimator breakdown
  "tour.estimateAdults": "{n} × بالغ ({room})",
  "tour.estimateChild": "1 × طفل {age} سنة",
  "tour.estimateChildAdultRate": "1 × طفل {age} سنة (سعر البالغ)",

  // currency
  "price.currency": "درهم",

  // contact map
  "contact.mapActivate": "تفعيل الخريطة",

  // الإشعار القانوني
  "meta.legal.title": "إشعار قانوني — {agency}",
  "meta.legal.desc": "معلومات قانونية، والاستضافة، والمعطيات الشخصية، والملكية الفكرية.",
  "legal.eyebrow": "معلومات قانونية",
  "legal.title": "إشعار قانوني",
  "legal.lead": "المعلومات أسفله تعرّف بناشر هذا الموقع وتوضّح كيفية معالجة معطياتكم.",
  "legal.publisher": "ناشر الموقع",
  "legal.name": "التسمية",
  "legal.form": "الشكل القانوني",
  "legal.formValue": "شركة ذات مسؤولية محدودة بشريك وحيد (SARLAU)",
  "legal.capital": "رأس المال",
  "legal.rc": "السجل التجاري",
  "legal.ice": "المعرّف الموحّد للمقاولة (ICE)",
  "legal.activity": "النشاط",
  "legal.activityValue": "وكالة أسفار",
  "legal.manager": "المسيّرة",
  "legal.address": "المقر الاجتماعي",
  "legal.email": "البريد الإلكتروني",
  "legal.phone": "الهاتف",
  "legal.hostingTitle": "الاستضافة",
  "legal.hostingBody":
    "هذا الموقع مستضاف لدى Cloudflare, Inc.، 101 Townsend Street، سان فرانسيسكو، كاليفورنيا 94107، الولايات المتحدة الأمريكية.",
  "legal.dataTitle": "المعطيات الشخصية",
  "legal.dataBody1":
    "لا تجمع استمارات هذا الموقع سوى ما يلزم للرد على طلبكم: الاسم، والهاتف، والبريد الإلكتروني، والبرنامج المختار، ونوع الغرفة. تُرسل إلى الوكالة عبر البريد الإلكتروني وواتساب، ولا تُستعمل إلا لمعالجة طلبكم. ولا تُباع ولا تُسلَّم لأي طرف ثالث.",
  "legal.dataBody2":
    "طبقاً للقانون 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، لكم حق الولوج والتصحيح والتعرض. ولممارسته، راسلونا على البريد الإلكتروني المذكور أعلاه.",
  "legal.cookiesTitle": "ملفات تعريف الارتباط",
  "legal.cookiesBody":
    "لا يضع هذا الموقع أي ملفات تعريف ارتباط إشهارية ولا أي أدوات تتبع لقياس الجمهور. لا يُستعمل سوى ما هو ضروري لعرض الصفحات، ويبقى داخل متصفحكم.",
  "legal.ipTitle": "الملكية الفكرية",
  "legal.ipBody":
    "النصوص والصور والشعارات والعناصر التصويرية في هذا الموقع ملك للوكالة أو لشركائها. ويُمنع كل استنساخ بدون إذن كتابي.",
  "legal.pricesTitle": "الأثمنة والتوفر",
  "legal.pricesBody":
    "الأثمنة مذكورة بالدرهم، للشخص الواحد، وحسب نوع الغرفة المحدد. وهي إرشادية وتبقى رهينة بالتوفر وقت الحجز، ولا تصبح ملزمة إلا بعد تأكيد الوكالة للحجز. أما البرامج التي مرّ تاريخ انطلاقها فتُحفظ للأرشيف ولم تعد قابلة للحجز.",
  // السلة
  "meta.cart.title": "السلة",
  "meta.cart.desc": "البرامج التي اخترتموها، جاهزة للإرسال إلى الوكالة.",
  "cart.title": "سلتكم",
  "cart.open": "عرض السلة",
  "cart.lead":
    "تحققوا من البرامج المختارة ثم أرسلوا طلبكم. تجيبكم الوكالة بالتوفر وبكيفيات الأداء.",
  "cart.empty": "سلتكم فارغة",
  "cart.emptyLead": "تصفحوا البرامج وأضيفوا ما يهمكم منها.",
  "cart.browse": "تصفح البرامج",
  "cart.add": "أضف إلى السلة",
  "cart.added": "أُضيف إلى السلة",
  "cart.remove": "حذف",
  "cart.line": "البرنامج",
  "cart.people": "عدد المسافرين",
  "cart.unit": "الثمن للفرد",
  "cart.lineTotal": "المجموع الجزئي",
  "cart.total": "المجموع",
  "cart.quoteNote": "أحد برامج سلتكم يُقدَّم بعرض سعر، والمجموع أعلاه لا يشمله.",
  "cart.noPayment":
    "لا يُطلب أي أداء عبر هذا الموقع. يصل طلبكم إلى الوكالة التي تؤكد لكم التوفر وتتفق معكم على كيفيات الأداء.",
  "cart.yourDetails": "معطياتكم",
  "cart.checkout": "إرسال الطلب",
  "cart.sentTitle": "تم إرسال الطلب",
  "cart.sentBody": "توصلنا بطلبكم. ستتصل بكم الوكالة قريباً لتأكيد التوفر.",
};
