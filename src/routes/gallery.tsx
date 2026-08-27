import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon, ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingSkeleton } from "@/components/site/Skeleton";
import { content } from "@/lib/content";
import {
  galleryTitle,
  galleryEyebrow,
  galleryIntro,
  galleryStrings as S,
  type GalleryPhoto,
} from "@/lib/gallery";
import { agency, isEnabled, notFoundHead } from "@/config/agency";

/** The gallery belongs to the OMRA section — it needs both switches on. */
const galleryOn = () => isEnabled("omra") && isEnabled("gallery");

export const Route = createFileRoute("/gallery")({
  beforeLoad: () => {
    if (!galleryOn()) throw notFound();
  },
  loader: async () => ({ photos: await content.getGalleryPhotos() }),
  head: () =>
    !galleryOn()
      ? notFoundHead()
      : {
          meta: [
            { title: `${galleryTitle} — ${agency.identity.name}` },
            { name: "description", content: galleryIntro },
          ],
        },
  pendingComponent: () => <ListingSkeleton eyebrow={galleryEyebrow} title={galleryTitle} />,
  component: GalleryPage,
});

function GalleryPage() {
  const { photos } = Route.useLoaderData();
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <Header />
      {/* Arabic section: the page content reads right-to-left, like /omra */}
      <div dir="rtl" lang="ar">
        <div className="pt-40 pb-16 bg-sand">
          <div className="container-page">
            <div className="text-sm font-bold" style={{ color: "var(--brand-yellow)" }}>
              {galleryEyebrow}
            </div>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl">{galleryTitle}</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">{galleryIntro}</p>
            <Link
              to="/omra"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
              {S.backToOmra}
            </Link>
          </div>
        </div>

        <main className="container-page py-12">
          {photos.length === 0 ? (
            <EmptyState />
          ) : (
            /* CSS columns = masonry: portrait and landscape photos keep their own
               aspect ratio instead of being cropped into a uniform grid. */
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
              {photos.map((photo, i) => (
                <PhotoTile key={photo.id} photo={photo} index={i} onOpen={() => setOpenAt(i)} />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />

      {openAt !== null && (
        <Lightbox
          photos={photos}
          index={openAt}
          onIndex={setOpenAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </div>
  );
}

function PhotoTile({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl skeleton text-right shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-lift)]"
      aria-label={photo.caption ? `${S.enlarge} — ${photo.caption}` : S.enlarge}
    >
      <img
        src={photo.image}
        alt={photo.caption || photo.place || S.alt}
        loading={index < 6 ? "eager" : "lazy"}
        ref={(el) => {
          if (el?.complete) setLoaded(true); // cached images fire no onLoad
        }}
        onLoad={() => setLoaded(true)}
        className={`w-full transition duration-700 group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      {(photo.caption || photo.place) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10 opacity-0 transition duration-300 group-hover:opacity-100">
          {photo.caption && (
            <p className="font-semibold text-white drop-shadow-sm">{photo.caption}</p>
          )}
          {photo.place && <p className="text-sm text-white/80">{photo.place}</p>}
        </div>
      )}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-primary/25 bg-card px-6 py-20 text-center">
      <ImageIcon className="h-10 w-10 text-primary/30" />
      <p className="mt-4 font-semibold">{S.emptyTitle}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{S.emptyBody}</p>
    </div>
  );
}

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number;
  onIndex: Dispatch<SetStateAction<number | null>>;
  onClose: () => void;
}) {
  const photo = photos[index];
  // Functional update, not `index + delta`: two arrow presses inside one frame
  // would both read the same stale index and collapse into a single step.
  const go = useCallback(
    (delta: number) =>
      onIndex((cur) => (cur === null ? cur : (cur + delta + photos.length) % photos.length)), // wraps at both ends
    [photos.length, onIndex],
  );

  // Keyboard control + lock the page behind the overlay so the background
  // doesn't scroll under the photo on mobile.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // RTL: ArrowLeft advances, ArrowRight goes back — matches the on-screen arrows
      if (e.key === "ArrowLeft") go(1);
      if (e.key === "ArrowRight") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const single = photos.length < 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir="rtl"
      lang="ar"
      aria-label={photo.caption || S.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={S.close}
        className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {!single && (
        <>
          {/* RTL reading order: "next" sits on the left, "previous" on the right */}
          <NavButton side="left" label={S.next} onClick={() => go(1)} />
          <NavButton side="right" label={S.prev} onClick={() => go(-1)} />
        </>
      )}

      {/* stopPropagation: clicking the photo itself must not close the overlay */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-5xl text-center"
      >
        <img
          src={photo.image}
          alt={photo.caption || photo.place || S.alt}
          className="mx-auto max-h-[76vh] w-auto max-w-full rounded-2xl object-contain shadow-[var(--shadow-lift)]"
        />
        {(photo.caption || photo.place) && (
          <figcaption className="mt-4 text-white">
            {photo.caption && <p className="font-semibold">{photo.caption}</p>}
            {photo.place && <p className="text-sm text-white/70">{photo.place}</p>}
          </figcaption>
        )}
        {!single && (
          /* bdi + ltr: the counter must read "1 / 9", not flip in an RTL page */
          <p className="mt-2 text-xs text-white/50">
            <bdi dir="ltr">
              {index + 1} / {photos.length}
            </bdi>
          </p>
        )}
      </figure>
    </div>
  );
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 ${
        side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6"
      }`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
