import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { agency, whatsappDigits } from "@/config/agency";

/**
 * Fixed social rail (left) + scroll-to-top button (bottom-right),
 * mirroring terratour.ma's floating UI.
 */
export function FloatingRail() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* social rail — lower-left on all screens, clear of the hero's edge arrows */}
      <div className="fixed bottom-6 left-4 z-40 flex flex-col gap-3">
        <a
          href={`https://wa.me/${whatsappDigits()}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
            <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.33.44-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.15.19 2.02 3.08 4.9 4.32.68.29 1.21.47 1.63.6.68.22 1.31.19 1.8.12.55-.08 1.7-.69 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34zM12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.32l-.35-.21-3.6.94.96-3.51-.23-.36a9.46 9.46 0 0 1-1.45-5.06c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.92.99 6.71 2.79a9.42 9.42 0 0 1 2.78 6.71c0 5.23-4.26 9.49-9.49 9.49z" />
          </svg>
        </a>
        {agency.socials.facebook && (
          <a
            href={agency.socials.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md transition hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
              <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
            </svg>
          </a>
        )}
        {agency.socials.instagram && (
          <a
            href={agency.socials.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white shadow-md transition hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
            </svg>
          </a>
        )}
      </div>

      {/* scroll-to-top — bottom right */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Remonter en haut"
        className={`fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 sm:bottom-6 sm:right-6 ${
          showTop ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </>
  );
}
