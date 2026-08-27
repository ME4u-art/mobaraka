import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { NavTicker } from "./NavTicker";
import ministereTourisme from "@/assets/footer/ministere-tourisme.svg";
import iata from "@/assets/footer/iata.svg";
import { agency, isEnabled } from "@/config/agency";

const legalLinks = [
  "Mentions légales",
  "CGU",
  "Politique de confidentialité",
  "Politique de cookies",
];

const footerAddresses = [agency.contact.addresses.fr];

export function Footer() {
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
              <Link to="/" className="flex items-center gap-2">
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
              Retrouvez-nous ici
            </h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              {footerAddresses.map((a) => (
                <li key={a} className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {a}
                </li>
              ))}
            </ul>

            <h4 className="mt-6 font-display text-sm font-bold uppercase tracking-wide">Contact</h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />{" "}
                <a href={`tel:${agency.contact.phones[0].replace(/\s/g, "")}`} className={hov}>
                  {agency.contact.phones[0]}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />{" "}
                <a href={`mailto:${agency.contact.email}`} className={hov}>
                  {agency.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide">Nos voyages</h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              {isEnabled("circuits") && (
                <li>
                  <Link to="/circuits">Circuit au Maroc</Link>
                </li>
              )}
              {isEnabled("voyagesOrganises") && (
                <li>
                  <Link to="/voyages-organises">Voyages organisés</Link>
                </li>
              )}
              {isEnabled("cruises") && (
                <li>
                  <Link to="/croisieres">Croisières</Link>
                </li>
              )}
              {isEnabled("omra") && (
                <li>
                  <Link to="/omra">Omra & Hajj</Link>
                </li>
              )}
              {isEnabled("languageStays") && (
                <li>
                  <Link to="/sejours-linguistiques">Séjours linguistiques</Link>
                </li>
              )}
              {isEnabled("greatDeals") && (
                <li>
                  <Link to="/bons-plans">Bons plans</Link>
                </li>
              )}
            </ul>

            {(isEnabled("mice") || isEnabled("visa")) && (
              <>
                <h4 className="mt-6 font-display text-sm font-bold uppercase tracking-wide">
                  Nos services
                </h4>
                <ul className={`mt-4 space-y-2 text-sm ${li}`}>
                  {isEnabled("mice") && (
                    <li>
                      <Link to="/mice">MICE</Link>
                    </li>
                  )}
                  {isEnabled("visa") && (
                    <li>
                      <Link to="/visa">Visa & formalités</Link>
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide">Liens utiles</h4>
            <ul className={`mt-4 space-y-2 text-sm ${li}`}>
              <li>
                <Link to="/a-propos">Qui sommes-nous</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={light ? "border-t border-black/10" : "border-t border-white/10"}>
          <div
            className={`container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs ${sub}`}
          >
            <span>
              © {new Date().getFullYear()} {agency.identity.name} — Tous droits réservés.
            </span>
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((label) => (
                <a key={label} href="#" className={`underline underline-offset-2 ${hov}`}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
