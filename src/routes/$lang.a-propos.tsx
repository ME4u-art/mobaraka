import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { agency } from "@/config/agency";
import { useT, tFor } from "@/i18n";

export const Route = createFileRoute("/$lang/a-propos")({
  head: ({ params }) => {
    const t = tFor(params.lang);
    return {
      meta: [
        { title: t("meta.about.title") },
        { name: "description", content: t("meta.about.desc") },
        { property: "og:title", content: t("meta.about.title") },
        { property: "og:description", content: t("meta.about.desc") },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const t = useT();
  return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-40 pb-16 container-page max-w-3xl">
        <Reveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t("about.eyebrow")}
          </div>
          <h1 className="mt-2 font-display text-5xl">{t("about.title")}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{t("about.p1")}</p>
          <p className="mt-4 text-muted-foreground">{t("about.p2")}</p>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
