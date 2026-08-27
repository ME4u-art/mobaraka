import { agency } from "@/config/agency";

export type PriceRow = {
  label: string;
  sub?: string;
  quad: string;
  triple: string;
  double: string;
};

export type OmraProgram = {
  slug: string;
  category: "omra" | "hajj"; // chooser on the OMRA page: عمرة or حج
  title: string;
  shortTitle: string;
  image: string;
  priceFrom: string;
  flightRoute: string;
  dates: string[];
  duration: string;
  flight: string;
  description: string[];
  tables: { name: string; tag: string; rows: PriceRow[] }[];
  includes: string[];
  notes: string[];
  gallery: string[];
};

/** Filled by the client in wp-admin (CPT `omra`). */
export const omraPrograms: OmraProgram[] = [];

export const agencyPhones = agency.contact.phones;

export const whatsappNumber = agency.contact.whatsapp;

export const agencyAddresses = [agency.contact.addresses.ar ?? agency.contact.addresses.fr];
