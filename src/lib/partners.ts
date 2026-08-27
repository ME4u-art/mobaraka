import emirates from "@/assets/partners/emirates.svg";
import ram from "@/assets/partners/ram.svg";
import qatar from "@/assets/partners/qatar.svg";
import airarabia from "@/assets/partners/airarabia.svg";
import etihad from "@/assets/partners/etihad.svg";
import turkish from "@/assets/partners/turkish.svg";

export type Partner = {
  /** id referenced from agency.ts `partners` */
  id: string;
  name: string;
  logo: string;
  /** stacked/portrait logos need more height than horizontal wordmarks */
  tall?: boolean;
};

export const partners: Partner[] = [
  { id: "qatar", name: "Qatar Airways", logo: qatar },
  { id: "airarabia", name: "Air Arabia", logo: airarabia },
  { id: "etihad", name: "Etihad Airways", logo: etihad },
  { id: "emirates", name: "Emirates", logo: emirates },
  { id: "ram", name: "Royal Air Maroc", logo: ram },
  { id: "turkish", name: "Turkish Airlines", logo: turkish },
];

/**
 * The logos a given client shows, in the order listed in agency.ts.
 * No `partners` key at all → every logo (useful for a demo).
 */
export const agencyPartners = (ids?: string[]): Partner[] =>
  ids
    ? ids.map((id) => partners.find((p) => p.id === id)).filter((p): p is Partner => !!p)
    : partners;
