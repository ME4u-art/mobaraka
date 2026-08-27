import { agency } from "@/config/agency";
import { localProvider } from "./local";
import { createWordPressProvider } from "./wordpress";
import type { ContentProvider } from "./provider";

export type { ContentProvider } from "./provider";

export const content: ContentProvider =
  agency.data.source === "wordpress" ? createWordPressProvider(agency.data.url) : localProvider;
