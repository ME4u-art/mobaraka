import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { agencyPhones, agencyAddresses, whatsappNumber } from "@/lib/omra";
import { content } from "@/lib/content";
import { DetailSkeleton } from "@/components/site/Skeleton";
import { agency, isEnabled } from "@/config/agency";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import {
  Plane,
  Check,
  Phone,
  CalendarDays,
  Clock,
  ChevronLeft,
  MessageCircle,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/omra/$slug")({
  beforeLoad: () => {
    if (!isEnabled("omra")) throw notFound();
  },
  loader: async ({ params }) => {
    const program = await content.getOmraProgram(params.slug);
    if (!program) throw notFound();
    // Shared gallery (معرض الصور) — used when this programme has no photos of
    // its own, so the section shows real pictures instead of empty frames.
    const shared = isEnabled("gallery") ? await content.getGalleryPhotos() : [];
    return { program, shared };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.program.title} — ${agency.identity.name}` : "البرنامج" },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.program.description[0]} ابتداءً من ${loaderData.program.priceFrom}.`
          : "",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.program.title} — ${agency.identity.name}` : "",
      },
      { property: "og:image", content: loaderData?.program.image ?? "" },
    ],
  }),
  component: ProgramDetail,
  pendingComponent: DetailSkeleton,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <div className="container-page py-40 text-center" dir="rtl">
        <h1 className="font-display text-4xl">البرنامج غير موجود</h1>
        <Link to="/omra" className="btn-primary mt-6 inline-flex">
          العودة إلى العمرة والحج
        </Link>
      </div>
      <Footer />
    </div>
  ),
});

function PriceTable({
  rows,
}: {
  rows: {
    label: string;
    sub?: string;
    quad: string;
    triple: string;
    double: string;
    quint?: string;
  }[];
}) {
  // Only widen the grid when at least one row actually prices a 5-share room.
  const hasQuint = rows.some((r) => r.quint);
  return (
    <>
      {/* mobile — one card per hotel, no horizontal scrolling */}
      <div className="space-y-3 sm:hidden">
        {rows.map((r) => (
          <div key={r.label} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="bg-accent px-4 py-3 text-accent-foreground">
              <div className="text-sm font-semibold">{r.label}</div>
              {r.sub && <div className="mt-0.5 text-xs opacity-80">{r.sub}</div>}
            </div>
            <div
              className={`grid ${hasQuint ? "grid-cols-4" : "grid-cols-3"} divide-x divide-x-reverse divide-border text-center`}
            >
              {[
                { room: "ثنائية", price: r.double, highlight: true },
                { room: "ثلاثية", price: r.triple },
                { room: "رباعية", price: r.quad },
                ...(hasQuint ? [{ room: "خماسية", price: r.quint || "—" }] : []),
              ].map((c) => (
                <div key={c.room} className="px-2 py-3">
                  <div className="text-xs text-muted-foreground">{c.room}</div>
                  <div
                    dir="ltr"
                    className={`mt-1 text-sm font-semibold ${c.highlight ? "text-primary" : ""}`}
                  >
                    {c.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* tablet & desktop — comparison table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border sm:block">
        <div
          className={`grid ${hasQuint ? "grid-cols-5" : "grid-cols-4"} gap-2 bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground`}
        >
          <span className="text-right">الفندق</span>
          <span>ثنائية</span>
          <span>ثلاثية</span>
          <span>رباعية</span>
          {hasQuint && <span>خماسية</span>}
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`grid ${hasQuint ? "grid-cols-5" : "grid-cols-4"} items-center gap-2 border-b border-border px-4 py-3 text-center text-sm last:border-0 ${i % 2 ? "bg-sand" : "bg-card"}`}
          >
            <div className="text-right">
              <div className="font-medium">{r.label}</div>
              {r.sub && <div className="text-xs text-muted-foreground">{r.sub}</div>}
            </div>
            <div dir="ltr" className="font-semibold text-primary">
              {r.double}
            </div>
            <div dir="ltr" className="font-semibold">
              {r.triple}
            </div>
            <div dir="ltr" className="font-semibold">
              {r.quad}
            </div>
            {hasQuint && (
              <div dir="ltr" className="font-semibold">
                {r.quint || "—"}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function BookingForm({
  programTitle,
  hotels,
  dates,
  programs,
}: {
  programTitle: string;
  hotels: string[];
  dates: string[];
  programs: string[];
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-3xl bg-card p-6 text-center shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BadgeCheck className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-xl">تم إرسال طلبكم</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          شكراً لكم. سيتواصل معكم أحد مستشاري {agency.identity.name} خلال 24 ساعة لتأكيد الحجز في «
          {programTitle}».
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
      <div className="bg-accent px-6 py-4 text-center font-display text-xl font-semibold text-accent-foreground">
        احجز الآن
      </div>
      <form
        className="space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <p className="text-sm text-muted-foreground">
          احجز رحلتك في بضع نقرات من خلال ملء هذا النموذج:
        </p>
        {programs.length > 1 && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              البرنامج <span className="text-primary">*</span>
            </span>
            <select
              required
              defaultValue=""
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                اختر البرنامج
              </option>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
        {dates.length > 1 && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              تاريخ الرحلة <span className="text-primary">*</span>
            </span>
            <select
              required
              defaultValue=""
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                اختر تاريخ الانطلاق
              </option>
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            الفندق <span className="text-primary">*</span>
          </span>
          <select
            required
            defaultValue=""
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>
              اختر الفندق
            </option>
            {hotels.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            الغرفة <span className="text-primary">*</span>
          </span>
          <select
            required
            defaultValue=""
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>
              اختر نوع الغرفة
            </option>
            <option value="ثنائية">ثنائية</option>
            <option value="ثلاثية">ثلاثية</option>
            <option value="رباعية">رباعية</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            عدد الأشخاص <span className="text-primary">*</span>
          </span>
          <input
            type="number"
            min={1}
            defaultValue={1}
            required
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            الاسم الكامل <span className="text-primary">*</span>
          </span>
          <input
            required
            placeholder="الاسم الكامل"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">البريد الإلكتروني</span>
          <input
            type="email"
            dir="ltr"
            placeholder="yourname@example.com"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-right text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            رقم الهاتف <span className="text-primary">*</span>
          </span>
          <input
            required
            dir="ltr"
            placeholder="+212 6 00 00 00 00"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-right text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <button type="submit" className="btn-primary w-full hover:-translate-y-0.5">
          مواصلة الحجز
        </button>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et
          d'opposition au traitement de vos données personnelles.
        </p>
      </form>
    </div>
  );
}

function ProgramDetail() {
  const { program, shared } = Route.useLoaderData();
  // Programme photos win; otherwise borrow the shared gallery so the section
  // still shows something real. Neither → the section doesn't render at all.
  const usingShared = program.gallery.length === 0;
  const photos = usingShared ? shared.slice(0, 6).map((p) => p.image) : program.gallery;

  return (
    <div className="min-h-screen">
      <Header />

      <div dir="rtl">
        {/* البطل */}
        <section className="relative overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/60" />
          <div className="relative z-10 pb-10 pt-36 sm:pt-40">
            <div className="container-page text-white">
              <h1 className="font-display text-3xl leading-tight sm:text-5xl">{program.title}</h1>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base sm:text-lg">
                <span className="opacity-80">ابتداءً من</span>
                <span
                  dir="ltr"
                  className="font-display text-2xl sm:text-3xl"
                  style={{ color: "var(--brand-yellow)" }}
                >
                  {program.priceFrom}
                </span>
                <span className="opacity-80">للشخص الواحد</span>
              </div>
              <div className="mt-5">
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-primary inline-flex"
                >
                  احجز الآن
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* مسار التنقل */}
        <div className="border-b border-border bg-sand">
          <div className="container-page flex items-center gap-1.5 py-3 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              الرئيسية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <Link to="/omra" className="hover:text-primary">
              العمرة والحج
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{program.shortTitle}</span>
          </div>
        </div>

        {/* المحتوى بعمودين */}
        <section className="py-14">
          <div className="container-page grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* العمود الرئيسي */}
            <Reveal className="min-w-0">
              {/* صندوق معلومات الرحلة */}
              <div className="rounded-3xl bg-primary p-6 text-white sm:p-8">
                <div className="text-lg font-semibold">
                  <span className="opacity-80">عبر : </span>
                  {program.flightRoute}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {program.dates.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur"
                    >
                      <CalendarDays className="h-4 w-4" /> {d}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                    <Clock className="h-4 w-4" /> {program.duration}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                    <Plane className="h-4 w-4" /> {program.flight}
                  </span>
                </div>
                {program.dates.length > 1 && (
                  <p className="mt-3 text-sm opacity-80">
                    عدة تواريخ للانطلاق — اختر تاريخك في نموذج الحجز.
                  </p>
                )}
              </div>

              {/* وصف الرحلة */}
              <h2 className="mt-10 font-display text-3xl text-primary">وصف الرحلة</h2>
              <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
                {program.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              {/* الأسعار والفنادق */}
              <h2 className="mt-10 font-display text-3xl text-primary">الأسعار والفنادق</h2>
              <div className="mt-4 space-y-8">
                {program.tables.map((t, i) => (
                  <div key={i}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                        {t.tag}
                      </span>
                      <h3 className="font-display text-2xl">{t.name}</h3>
                    </div>
                    <PriceTable rows={t.rows} />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  الأسعار للفرد الواحد بالدرهم حسب نوع الغرفة.
                </p>
              </div>

              {/* الأسعار تشمل */}
              <h2 className="mt-10 font-display text-3xl text-primary">الأسعار تشمل</h2>
              <ul className="mt-4 space-y-2">
                {program.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* ملاحظات */}
              {program.notes.length > 0 && (
                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                  <div className="font-semibold text-primary">ملاحظة</div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {program.notes.map((n) => (
                      <li key={n} className="flex gap-2">
                        <span className="text-primary">•</span> {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>

            {/* الشريط الجانبي */}
            <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
              <Reveal className="space-y-5">
                {/* تواصل معنا */}
                <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
                  <div className="bg-accent px-6 py-4 text-center font-display text-lg font-semibold text-accent-foreground">
                    تواصل معنا
                  </div>
                  <div className="space-y-2 p-5" dir="ltr">
                    {agencyPhones.slice(0, 2).map((tel) => (
                      <a
                        key={tel}
                        href={`tel:${tel.replace(/\s/g, "")}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary"
                      >
                        <Phone className="h-4 w-4" /> {tel}
                      </a>
                    ))}
                  </div>
                </div>

                {/* واتساب */}
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 rounded-3xl bg-[#25D366] px-6 py-4 font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-center">
                    تواصل معنا على واتساب
                    <span className="block text-sm font-normal opacity-90" dir="ltr">
                      {whatsappNumber}
                    </span>
                  </span>
                </a>

                {/* نموذج الحجز */}
                <div id="booking" className="scroll-mt-28">
                  <BookingForm
                    programTitle={program.shortTitle}
                    hotels={program.tables.flatMap((t) => t.rows.map((r) => r.label))}
                    dates={program.dates}
                    programs={program.tables.map((t) => t.name).filter(Boolean)}
                  />
                </div>
              </Reveal>
            </aside>
          </div>
        </section>

        {/* معرض الصور — صور البرنامج، وإلا صور المعرض المشترك. لا شيء = القسم مخفي */}
        {photos.length > 0 && (
          <section className="bg-sand py-16">
            <div className="container-page">
              <div className="text-center">
                <div className="text-sm font-bold" style={{ color: "var(--brand-yellow)" }}>
                  معرض الصور
                </div>
                <h2 className="mt-1 font-display text-3xl text-primary sm:text-4xl">
                  صور من رحلاتنا
                </h2>
              </div>
              <StaggerGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map((src, i) => (
                  <StaggerItem
                    key={src}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl skeleton shadow-[var(--shadow-soft)]"
                  >
                    <img
                      src={src}
                      alt={`${program.shortTitle} — صورة ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </StaggerItem>
                ))}
              </StaggerGroup>
              {usingShared && (
                <p className="mt-6 text-center">
                  <Link
                    to="/gallery"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    شاهد كل الصور ←
                  </Link>
                </p>
              )}
            </div>
          </section>
        )}

        {/* العنوان */}
        <section className="py-16">
          <div className="container-page">
            <div className="rounded-3xl bg-sand px-8 py-8 text-center text-sm text-muted-foreground">
              {agencyAddresses[0]}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
