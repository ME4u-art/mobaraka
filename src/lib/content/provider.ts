import type { Tour } from "@/lib/tours";
import type { OmraProgram } from "@/lib/omra";
import type { GalleryPhoto } from "@/lib/gallery";

/**
 * Home-page section visibility, chosen by the client in wp-admin
 * (« Page d'accueil » settings screen). `null` = never configured →
 * the home page keeps its automatic behavior.
 */
export type HomeSections = {
  omra: boolean;
  voyages: boolean;
  circuits: boolean;
  cruises: boolean;
  languageStays: boolean;
  greatDeals: boolean;
  mice: boolean;
  partners: boolean;
};

export interface ContentProvider {
  getTours(): Promise<Tour[]>;
  getTour(slug: string): Promise<Tour | undefined>;
  getCircuits(): Promise<Tour[]>;
  getVoyagesOrganises(): Promise<Tour[]>;
  getCruises(): Promise<Tour[]>;
  getLanguageStays(): Promise<Tour[]>;
  getGreatDeals(): Promise<Tour[]>;
  getOmraPrograms(): Promise<OmraProgram[]>;
  getOmraProgram(slug: string): Promise<OmraProgram | undefined>;
  getGalleryPhotos(): Promise<GalleryPhoto[]>;
  getHomeSections(): Promise<HomeSections | null>;
}
