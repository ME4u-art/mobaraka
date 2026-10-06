/**
 * BOOKING DELIVERY — one path for all three forms (contact, tour, Omra).
 *
 * Every submission does two things:
 *   1. reaches the server, which logs it and emails the agency;
 *   2. hands the visitor a pre-filled WhatsApp message.
 *
 * (1) is the record: it happens even if the visitor never presses send in
 * WhatsApp, so a booking can never vanish silently again. (2) is what
 * actually gets a reply, because WhatsApp is how Moroccan agencies sell.
 *
 * Email is optional on purpose. A client with no RESEND_API_KEY still gets a
 * working form and the booking still lands in the deployment log — same
 * principle as `agency.features`: unconfigured means degraded, never broken.
 *
 * Per-client env vars (never committed):
 *   RESEND_API_KEY     — the agency's own Resend key
 *   BOOKING_EMAIL_TO   — where bookings go (default: agency.contact.email)
 *   BOOKING_EMAIL_FROM — verified sender (default: onboarding@resend.dev)
 */

import { createServerFn } from "@tanstack/react-start";

import { agency, whatsappDigits } from "@/config/agency";

/** "cart" is several programmes in one enquiry — see src/lib/cart.ts. */
export type BookingKind = "omra" | "tour" | "contact" | "cart";

export type Booking = {
  kind: BookingKind;
  /** Subject line — already translated for the visitor's language. */
  subject: string;
  /** Ordered [label, value] pairs, already translated. Empty values drop out. */
  fields: [string, string][];
};

const KINDS: BookingKind[] = ["omra", "tour", "contact", "cart"];
// A cart enquiry is one block per line (title, details, people, prices), so
// the ceiling has to clear a realistic multi-programme order. Still a cap:
// this is a public endpoint and the list feeds an outgoing email.
const MAX_FIELDS = 120;
const MAX_LEN = 600;

const SPACE = " ";
const NEWLINE = String.fromCharCode(10);
const DEL = 127;
const FIRST_PRINTABLE = 32;

/**
 * Trust boundary: this feeds a public endpoint, so it is the one place that
 * must not be lazy. Control characters are replaced so a crafted value cannot
 * forge headers in the outgoing mail, and lengths are capped so the form
 * cannot be used as a relay.
 *
 * Written as a scan rather than a regex on purpose: a character class of
 * control codes puts real control bytes in this source file.
 */
const clean = (value: unknown, keepNewlines = false): string => {
  if (typeof value !== "string") return "";
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= FIRST_PRINTABLE && code !== DEL) {
      out += ch;
    } else {
      out += keepNewlines && code === 10 ? NEWLINE : SPACE;
    }
  }
  return out.trim().slice(0, MAX_LEN);
};

export const validateBooking = (input: Booking): Booking => ({
  kind: KINDS.includes(input?.kind) ? input.kind : "contact",
  subject: clean(input?.subject) || "Demande",
  fields: (Array.isArray(input?.fields) ? input.fields : [])
    .slice(0, MAX_FIELDS)
    .map(([label, value]) => [clean(label), clean(value, true)] as [string, string])
    .filter(([label, value]) => label !== "" && value !== ""),
});

/** The message body, shared by WhatsApp and email so both read identically. */
export const bookingText = (b: Booking): string =>
  [b.subject, "", ...b.fields.map(([label, value]) => `${label}: ${value}`)].join(NEWLINE);

export const whatsappUrl = (b: Booking): string =>
  `https://wa.me/${whatsappDigits()}?text=${encodeURIComponent(bookingText(b))}`;

const env = (key: string): string =>
  (typeof process !== "undefined" ? (process.env?.[key] ?? "") : "").trim();

/**
 * Records the booking server-side. Never throws: a failing mail provider must
 * not turn into a failed booking for the visitor.
 */
export const recordBooking = createServerFn({ method: "POST" })
  .validator(validateBooking)
  .handler(async ({ data }) => {
    // Always log — this is the record for clients with no email account.
    console.log(`[booking:${data.kind}] ${JSON.stringify(data.fields)}`);

    const key = env("RESEND_API_KEY");
    const to = env("BOOKING_EMAIL_TO") || agency.contact.email;
    if (!key || !to) return { recorded: true, emailed: false };

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: env("BOOKING_EMAIL_FROM") || "onboarding@resend.dev",
          to,
          subject: `${agency.identity.name} — ${data.subject}`,
          text: bookingText(data),
        }),
      });
      if (!res.ok) console.error(`[booking] mail failed ${res.status}: ${await res.text()}`);
      return { recorded: true, emailed: res.ok };
    } catch (error) {
      console.error("[booking] mail threw", error);
      return { recorded: true, emailed: false };
    }
  });

/**
 * Called from the form's submit handler.
 *
 * The server call is deliberately NOT awaited: opening WhatsApp has to happen
 * inside the user's click gesture or the browser blocks it as a popup.
 */
export function submitBooking(input: Booking): void {
  const booking = validateBooking(input);

  void recordBooking({ data: booking }).catch((error: unknown) => {
    console.error("[booking] record failed", error);
  });

  if (whatsappDigits() !== "") {
    window.open(whatsappUrl(booking), "_blank", "noopener,noreferrer");
  }
}
