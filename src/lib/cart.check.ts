/**
 * Self-check for the cart's arithmetic and its merge rule.
 *
 *   node src/lib/cart.check.ts
 *
 * Nothing imports this file. It exists so the price parsing and the
 * merge-vs-duplicate behaviour cannot rot silently. Node 24 strips the types.
 */
import {
  addLine,
  cartCount,
  cartLines,
  cartTotal,
  clearCart,
  hasQuoteOnly,
  lineTotal,
  numberToPrice,
  priceToNumber,
  removeLine,
  setPeople,
  type CartLine,
} from "./cart.ts";

const eq = (got: unknown, want: unknown, what: string): void => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) throw new Error(`${what}: got ${g}, want ${w}`);
};

// ——— prices: the dot is a thousands separator, never a decimal ————————
eq(priceToNumber("20.500"), 20500, "price with dot separator");
eq(priceToNumber("9.750"), 9750, "four-figure price");
eq(priceToNumber("—"), 0, "quote-only price contributes nothing");
eq(priceToNumber(""), 0, "empty price");
eq(numberToPrice(41000), "41.000", "format back to the site's convention");
eq(numberToPrice(615000), "615.000", "six figures");

const line = (over: Partial<CartLine> = {}): Omit<CartLine, "id"> => ({
  slug: "ramadan-15",
  kind: "omra",
  title: { fr: "Omra Ramadan 15 jours", ar: "عمرة رمضان 15 يوماً" },
  details: [
    { label: "hajj.hotel", value: "Hilton" },
    { label: "book.room", value: "hajj.roomDouble", translate: true },
  ],
  people: 2,
  unitPrice: "20.500",
  ...over,
});

// ——— totals ———————————————————————————————————————————————
eq(lineTotal({ ...line(), id: "x" }), 41000, "2 people x 20.500");
eq(
  cartTotal([
    { ...line(), id: "a" },
    { ...line({ unitPrice: "18.900", people: 1 }), id: "b" },
  ]),
  59900,
  "cart total across two lines",
);
eq(cartCount([{ ...line(), id: "a" }, { ...line({ people: 3 }), id: "b" }]), 5, "traveller count");
eq(hasQuoteOnly([{ ...line({ unitPrice: "Sur devis" }), id: "q" }]), true, "quote-only detected");
eq(hasQuoteOnly([{ ...line(), id: "a" }]), false, "priced cart is not quote-only");

// ——— merge rule ———————————————————————————————————————————
// Same programme, same hotel, same room: one line of 4, not two lines of 2.
clearCart();
addLine(line());
addLine(line());
eq(cartLines().length, 1, "identical lines merge");
eq(cartLines()[0].people, 4, "merged line sums the travellers");

// A different room is a different line.
addLine(
  line({
    details: [
      { label: "hajj.hotel", value: "Hilton" },
      { label: "book.room", value: "hajj.roomTriple", translate: true },
    ],
  }),
);
eq(cartLines().length, 2, "a different room is its own line");

// People are clamped into 1..20 whatever the caller passes.
setPeople(cartLines()[0].id, 999);
eq(cartLines()[0].people, 20, "people clamp at the ceiling");
setPeople(cartLines()[0].id, 0);
eq(cartLines()[0].people, 1, "people clamp at the floor");
setPeople(cartLines()[0].id, Number.NaN);
eq(cartLines()[0].people, 1, "NaN clamps to one, not to NaN");

removeLine(cartLines()[0].id);
eq(cartLines().length, 1, "remove drops exactly one line");
clearCart();
eq(cartLines().length, 0, "clear empties the cart");

console.log("cart.check: all assertions passed");
