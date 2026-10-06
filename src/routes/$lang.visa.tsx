import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLocale, useT, tFor } from "@/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { IMG } from "@/lib/tours";
import { FileText, ClipboardCheck, Stamp, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { agency, isEnabled, notFoundHead } from "@/config/agency";

export const Route = createFileRoute("/$lang/visa")({
  beforeLoad: () => {
    if (!isEnabled("visa")) throw notFound();
  },
  head: ({ params }) =>
    !isEnabled("visa")
      ? notFoundHead(tFor(params.lang)("error.notFoundTitle"))
      : {
          meta: [
            { title: tFor(params.lang)("meta.visa.title") },
            { name: "description", content: tFor(params.lang)("meta.visa.desc") },
            { property: "og:title", content: tFor(params.lang)("meta.visa.title") },
            { property: "og:description", content: tFor(params.lang)("meta.visa.desc") },
            { property: "og:image", content: IMG.hero },
          ],
        },
  component: function RouteComponent() {
    const lang = useLocale();
    const t = useT();
    return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-40 pb-16 bg-sand">
        <div className="container-page max-w-3xl">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("visa.eyebrow")}
            </div>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl">{t("visa.title")}</h1>
            <p className="mt-4 text-muted-foreground">{t("visa.lead")}</p>
            <Link to="/$lang/contact" params={{ lang }} className="btn-primary mt-6 inline-flex hover:-translate-y-0.5">
              {t("visa.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <StaggerGroup className="container-page py-16 grid gap-6 md:grid-cols-4">
        {([
          {
            icon: FileText,
            t: "visa.step1",
            d: "visa.step1Desc",
          },
          {
            icon: ClipboardCheck,
            t: "visa.step2",
            d: "visa.step2Desc",
          },
          {
            icon: Stamp,
            t: "visa.step3",
            d: "visa.step3Desc",
          },
          {
            icon: ShieldCheck,
            t: "visa.step4",
            d: "visa.step4Desc",
          },
        ] as const).map(({ icon: I, t: titleKey, d: descKey }) => (
          <StaggerItem key={titleKey} className="rounded-3xl border border-border p-6">
            <I className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl">{t(titleKey)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(descKey)}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <section className="container-page pb-20">
        <div className="rounded-3xl border border-border bg-sand p-8 sm:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-display text-lg">{t("visa.benefitTime")}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{t("visa.benefitTimeDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-display text-lg">{t("visa.benefitReliable")}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{t("visa.benefitReliableDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-display text-lg">{t("visa.benefitHuman")}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{t("visa.benefitHumanDesc")}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t("visa.question")}</p>
            <Link to="/$lang/contact" params={{ lang }} className="btn-primary inline-flex">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    );
  },
});
