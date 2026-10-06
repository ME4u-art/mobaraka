import { Link } from "@tanstack/react-router";
import { useLocale, useT } from "@/i18n";
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { NavTicker } from "./NavTicker";
import ministereTourisme from "@/assets/footer/ministere-tourisme.svg";
import iata from "@/assets/footer/iata.svg";
import { addressFor, agency, isEnabled, whatsappDigits } from "@/config/agency";

/**
 * Only the legal page, and only when there is one.
 *
 * This used to be four labels — Mentions légales, CGU, Privacy, Cookies —
 * every one of them on href="#", on every page of every fork. A link that
 * goes nowhere is worse than no link: it reads as a promise the site does not
 * keep, and a visitor hunting for terms before paying for an Omra finds a
 * dead anchor.
 *
 * The other three stay out until their pages exist. The template sets no
 * cookies and ships no analytics, so a cookie policy would be fiction; data
 * handling is a section of the legal notice; and CGU need the client's own
 * terms of sale, which are theirs to write, not ours to invent.
 */
const legalLinks = ["footer.legal"] as const;

export function Footer() {
  const lang = useLocale();
  const t = useT();
  const footerAddresses = [addressFor(lang)];
  // "light" = white footer with the color logo; default "dark" = navy footer.
  const light = agency.theme.footerStyle === "light";
  const logo = light ? agency.identity.logo : (agency.identity.logoOnDark ?? agency.identity.logo);
  const sub = light ? "text-foreground/60" : "text-white/60";
  const li = light ? "text-foreground/70" : "text-white/70";
  const hov = light ? "hover:text-primary" : "hover:text-white";
  return (
    <>
      <NavTicker />
      <footer
        className={
          light ? "border-t border-black/5 bg-white text-foreground" : "bg-navy text-white"
        }
      >
        <div className="container-page grid gap-10 py-16 md:grid-cols-4">
          <div>
            <div className="font-display text-2xl font-semibold">
              <Link to="/$lang" params={{ lang }} className="flex items-center gap-2">
                <img
                  src={logo}
                  alt={agency.identity.name}
                  className="my-[-8px] h-14 w-auto sm:h-16 md:h-20"
                />
              </Link>
            </div>
            <p className={`mt-2 text-sm ${sub}`}>{agency.identity.tagline}</p>

            {/* accreditation badges */}
            <div className="mt-6 flex items-center gap-4">
              <img
                src={ministereTourisme}
                alt="Ministère du Tourisme, de l'Artisanat et de l'Économie Sociale et Solidaire"
                className="h-12 w-auto rounded-lg border border-border bg-white object-contain p-1.5"
              />
              <img
                src={iata}
                alt="IATA"
                className="h-12 w-auto rounded-lg border border-border bg-white object-contain p-1.5"
              />
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide">
              {t("footer.findUs")}
            </h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              {footerAddresses.map((a) => (
                <li key={a} className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {a}
                </li>
              ))}
            </ul>

            <h4 className="mt-6 font-display text-sm font-bold uppercase tracking-wide">
              {t("footer.contact")}
            </h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              {/* One line per number the agency published. The header keeps to
                  the first for space; the footer is where the full details
                  belong, so a second line is not dropped here. */}
              {agency.contact.phones.map((phone) => (
                <li key={phone} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />{" "}
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className={hov}>
                    <bdi dir="ltr">{phone}</bdi>
                  </a>
                </li>
              ))}
              {/* Same as the header: no email means no line, not a dead
                  "mailto:" behind an icon. */}
              {agency.contact.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />{" "}
                  <a href={`mailto:${agency.contact.email}`} className={hov}>
                    {agency.contact.email}
                  </a>
                </li>
              )}
            </ul>

            {/* The floating rail shows only WhatsApp on a phone — three fixed
                buttons covered the price tables — so the footer is where the
                full set lives. Rendered only for the accounts the agency
                actually has, same rule as the email line above. */}
            {(agency.socials.facebook || agency.socials.instagram) && (
              <ul className={`mt-4 flex items-center gap-3 ${li}`}>
                <li>
                  <a
                    href={`https://wa.me/${whatsappDigits()}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className={hov}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </li>
                {agency.socials.facebook && (
                  <li>
                    <a
                      href={agency.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className={hov}
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  </li>
                )}
                {agency.socials.instagram && (
                  <li>
                    <a
                      href={agency.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className={hov}
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide">
              {t("footer.ourTrips")}
            </h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              {isEnabled("circuits") && (
                <li>
                  <Link to="/$lang/circuits" params={{ lang }}>
                    {t("nav.circuits")}
                  </Link>
                </li>
              )}
              {isEnabled("voyagesOrganises") && (
                <li>
                  <Link to="/$lang/voyages-organises" params={{ lang }}>
                    {t("footer.organisedTrips")}
                  </Link>
                </li>
              )}
              {isEnabled("cruises") && (
                <li>
                  <Link to="/$lang/croisieres" params={{ lang }}>
                    {t("nav.cruises")}
                  </Link>
                </li>
              )}
              {isEnabled("omra") && (
                <li>
                  <Link to="/$lang/omra" params={{ lang }}>
                    {t("nav.omra")}
                  </Link>
                </li>
              )}
              {isEnabled("languageStays") && (
                <li>
                  <Link to="/$lang/sejours-linguistiques" params={{ lang }}>
                    {t("nav.languageStays")}
                  </Link>
                </li>
              )}
              {isEnabled("greatDeals") && (
                <li>
                  <Link to="/$lang/bons-plans" params={{ lang }}>
                    {t("nav.greatDeals")}
                  </Link>
                </li>
              )}
            </ul>

            {(isEnabled("mice") || isEnabled("visa")) && (
              <>
                <h4 className="mt-6 font-display text-sm font-bold uppercase tracking-wide">
                  {t("footer.services")}
                </h4>
                <ul className={`mt-4 space-y-2 text-sm ${li}`}>
                  {isEnabled("mice") && (
                    <li>
                      <Link to="/$lang/mice" params={{ lang }}>
                        {t("nav.mice")}
                      </Link>
                    </li>
                  )}
                  {isEnabled("visa") && (
                    <li>
                      <Link to="/$lang/visa" params={{ lang }}>
                        {t("footer.visaFormalities")}
                      </Link>
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide">
              {t("footer.usefulLinks")}
            </h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              <li>
                <Link to="/$lang/a-propos" params={{ lang }}>
                  {t("footer.aboutLink")}
                </Link>
              </li>
              <li>
                <Link to="/$lang/contact" params={{ lang }}>
                  {t("footer.contactLink")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={light ? "border-t border-black/10" : "border-t border-white/10"}>
          <div
            className={`container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs ${sub}`}
          >
            <span>
              © {new Date().getFullYear()} {agency.identity.name} — {t("footer.rights")}
            </span>
            {agency.legal && (
              <div className="flex flex-wrap gap-4">
                {legalLinks.map((label) => (
                  <Link
                    key={label}
                    to="/$lang/mentions-legales"
                    params={{ lang }}
                    className={`underline underline-offset-2 ${hov}`}
                  >
                    {t(label)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
