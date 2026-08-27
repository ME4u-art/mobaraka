import {
  allTours,
  circuits,
  voyagesOrganises,
  croisieres,
  sejoursLinguistiques,
} from "@/lib/tours";
import { omraPrograms } from "@/lib/omra";
import { galleryPhotos } from "@/lib/gallery";
import type { ContentProvider } from "./provider";

export const localProvider: ContentProvider = {
  getTours: async () => allTours,
  getTour: async (slug) => allTours.find((t) => t.slug === slug),
  getCircuits: async () => circuits,
  getVoyagesOrganises: async () => voyagesOrganises,
  getCruises: async () => croisieres,
  getLanguageStays: async () => sejoursLinguistiques,
  getGreatDeals: async () => allTours.filter((t) => t.deal),
  getOmraPrograms: async () => omraPrograms,
  getOmraProgram: async (slug) => omraPrograms.find((p) => p.slug === slug),
  getGalleryPhotos: async () => galleryPhotos,
  // No WP settings in local mode → home keeps its automatic behavior
  getHomeSections: async () => null,
};
