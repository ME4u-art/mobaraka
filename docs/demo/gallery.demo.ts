import { IMG } from "@/lib/tours";

/**
 * Photo gallery — dedicated to the OMRA & Hajj section (Arabic, RTL).
 *
 * Managed by the client in wp-admin: CPT `photo` (REST base `galerie-photos`),
 * where the featured image is the photo, the post title is the caption, and an
 * optional ACF `lieu` field labels where it was taken.
 */
export type GalleryPhoto = {
  id: string;
  image: string;
  /** Short caption shown over/under the photo. May be empty. */
  caption: string;
  /** Optional place or trip label ("مكة المكرمة"). */
  place?: string;
};

export const galleryTitle = "صور من رحلاتنا";
export const galleryEyebrow = "ذكريات";
export const galleryIntro = "لحظات عاشها حجاجنا ومعتمرونا — لمحة عمّا ينتظركم معنا.";

/** Arabic UI strings for the gallery page + lightbox. */
export const galleryStrings = {
  emptyTitle: "لا توجد صور حالياً",
  emptyBody: "سنقوم بنشر صور رحلاتنا هنا قريباً.",
  enlarge: "تكبير الصورة",
  close: "إغلاق",
  prev: "الصورة السابقة",
  next: "الصورة التالية",
  alt: "صورة من رحلاتنا",
  backToOmra: "العودة إلى العمرة والحج",
};

/**
 * Demo photos — shown only while the client has not published any photo in
 * wp-admin, so the page is never an empty grid.
 *
 * Deliberately generic: no recognisable faces. The template must never ship
 * photographs of one agency's real customers to another agency's site.
 */
export const galleryPhotos: GalleryPhoto[] = [
  { id: "demo-1", image: IMG.hajj, caption: "أجواء روحانية بالحرم", place: "مكة المكرمة" },
  {
    id: "demo-2",
    image: "/Hajj.jpg",
    caption: "لحظات من رحلة العمرة",
    place: "المملكة العربية السعودية",
  },
  { id: "demo-3", image: IMG.hajj, caption: "زيارة الأماكن المقدسة", place: "المدينة المنورة" },
];
