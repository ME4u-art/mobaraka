import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { IMG } from "@/lib/tours";
import { FileText, ClipboardCheck, Stamp, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { agency, isEnabled, notFoundHead } from "@/config/agency";

export const Route = createFileRoute("/visa")({
  beforeLoad: () => {
    if (!isEnabled("visa")) throw notFound();
  },
  head: () =>
    !isEnabled("visa")
      ? notFoundHead()
      : {
          meta: [
            { title: `Visa & formalités | ${agency.identity.name}` },
            {
              name: "description",
              content: `Assistance visa et formalités de voyage — constitution du dossier, prise de rendez-vous et suivi. ${agency.identity.name}.`,
            },
            { property: "og:title", content: `Visa & formalités — ${agency.identity.name}` },
            { property: "og:description", content: "Assistance visa et formalités de voyage." },
            { property: "og:image", content: IMG.hero },
          ],
        },
  component: () => (
    <div className="min-h-screen">
      <Header />

      <section className="pt-40 pb-16 bg-sand">
        <div className="container-page max-w-3xl">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Visa & formalités
            </div>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl">
              Vos démarches de visa, simplifiées
            </h1>
            <p className="mt-4 text-muted-foreground">
              Nous vous accompagnons de A à Z dans vos formalités de voyage : constitution du
              dossier, prise de rendez-vous au consulat, assurance et suivi jusqu'à l'obtention de
              votre visa.
            </p>
            <Link to="/contact" className="btn-primary mt-6 inline-flex hover:-translate-y-0.5">
              Demander un accompagnement
            </Link>
          </Reveal>
        </div>
      </section>

      <StaggerGroup className="container-page py-16 grid gap-6 md:grid-cols-4">
        {[
          {
            icon: FileText,
            t: "Constitution du dossier",
            d: "Liste des pièces, vérification et mise en forme de votre dossier.",
          },
          {
            icon: ClipboardCheck,
            t: "Rendez-vous & formulaires",
            d: "Prise de rendez-vous et remplissage des formulaires officiels.",
          },
          {
            icon: Stamp,
            t: "Dépôt & suivi",
            d: "Dépôt de la demande et suivi jusqu'à la décision.",
          },
          {
            icon: ShieldCheck,
            t: "Assurance voyage",
            d: "Attestation d'assurance conforme aux exigences du consulat.",
          },
        ].map(({ icon: I, t, d }) => (
          <StaggerItem key={t} className="rounded-3xl border border-border p-6">
            <I className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <section className="container-page pb-20">
        <div className="rounded-3xl border border-border bg-sand p-8 sm:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-display text-lg">Gain de temps</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Un dossier complet et conforme du premier coup, sans allers-retours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-display text-lg">Dossier fiable</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vérifié par notre équipe selon les exigences de chaque consulat.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-display text-lg">Accompagnement humain</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Un interlocuteur dédié, joignable à chaque étape de votre demande.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Une question sur votre destination ? Parlons-en.
            </p>
            <Link to="/contact" className="btn-primary inline-flex">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  ),
});
