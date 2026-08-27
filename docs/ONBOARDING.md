# Launching a new client site

Copy the template, edit **one file**, connect WordPress, deploy. Budget half a
day for the first one and about an hour once you've done a couple.

Nothing in `src/` outside `src/config/agency.ts` should ever carry a client's
name, colours or contacts. If you find yourself editing a component to change
something client-specific, that's a bug in the template — fix it there instead,
so every future client benefits.

---

## 1. Copy the folder

```bash
cp -r MotherTemplate ClientName
cd ClientName
rm -rf .git node_modules .output
git init && npm install
```

Then rename the project in `package.json` (`"name"`).

Keep the copy on the same machine as the mother: when you improve the template
later, you'll want to diff the two.

---

## 2. Fill in `src/config/agency.ts`

This is the whole client setup. Every value below is used somewhere visible.

| Key                                 | What it drives                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `identity.name`                     | Page titles, footer, Omra copy, alt text                                                                                    |
| `identity.tagline`                  | Header top bar                                                                                                              |
| `identity.logo`                     | Logo on light surfaces                                                                                                      |
| `identity.logoOnDark`               | Logo on the navy header/footer — delete the key if one logo works on both                                                   |
| `theme.brand`                       | Buttons, links, active states                                                                                               |
| `theme.accent`                      | Hero accent words, badges                                                                                                   |
| `theme.highlight`                   | Section eyebrows, decorative details                                                                                        |
| `theme.navy`                        | Body text, header pill, footer                                                                                              |
| `theme.headerStyle` / `footerStyle` | `"light"` for a white surface with the colour logo; omit for navy                                                           |
| `contact.phones`                    | First one shows in the header; all show on Contact and Omra                                                                 |
| `contact.whatsapp`                  | Floating WhatsApp button (international format)                                                                             |
| `contact.email`, `fax`              | Header bar and Contact page                                                                                                 |
| `contact.addresses.fr` / `.ar`      | Footer and Contact (`.ar` is used by the Omra pages)                                                                        |
| `contact.mapQuery`                  | The Google Maps embed — use the exact string that finds them on Maps                                                        |
| `socials`                           | Footer icons. Omit a network and its icon disappears                                                                        |
| `features`                          | See step 3                                                                                                                  |
| `partners`                          | Airline logo ids, in display order. Ids live in `src/lib/partners.ts`; drop the key to show all, use `[]` to hide the strip |
| `seo.title` / `description`         | Default `<title>` and meta description                                                                                      |
| `data`                              | See step 5                                                                                                                  |

### Logo files

Drop the client's files in `public/` and point `identity.logo` at them.
Delete `logo-placeholder.svg` and `logo-placeholder-dark.svg` once you do.

The header pill is dark navy by default, so a dark logo disappears on it.
Either supply `logoOnDark` (a white version) or set `theme.headerStyle: "light"`.

### Colours

Only these four are ever set. Everything else — backgrounds, borders, muted
text, hovers, shadows — is computed from them in `src/styles.css`. Pull them
from the client's logo and check the result on the home page before moving on.

---

## 3. Turn features on and off

```ts
features: { voyagesOrganises: true, omra: true, /* ... */ }
```

| Key                | Page                                                        |
| ------------------ | ----------------------------------------------------------- |
| `voyagesOrganises` | `/voyages-organises` + programme detail pages               |
| `circuits`         | `/circuits`                                                 |
| `cruises`          | `/croisieres`                                               |
| `languageStays`    | `/sejours-linguistiques`                                    |
| `greatDeals`       | `/bons-plans` — programmes flagged « Bon plan »             |
| `omra`             | `/omra` (Arabic, RTL) + programme detail pages              |
| `visa`             | `/visa` — static info page                                  |
| `mice`             | `/mice` — corporate travel                                  |
| `gallery`          | Photo gallery inside the Omra section (needs `omra` on too) |

A key left out defaults to **off**: the page 404s and every link to it
disappears from the menu, the footer and the home page. Turn on only what the
client actually sells — an empty section reads as an unfinished site.

---

## 4. Set up their WordPress

Skip this only for a client who will never edit their own content.

1. Any WordPress host. Install the free **Secure Custom Fields** plugin.
2. Copy `docs/wordpress/travel-cms.php` to `wp-content/mu-plugins/`
   (create the folder if it isn't there). No activation needed — mu-plugins
   load automatically.
3. Three new menus appear: **Programmes**, **العمرة والحج**, **معرض الصور**,
   plus a **Page d'accueil** settings screen.
4. Check the REST API answers:
   `https://their-site.com/wp-json/wp/v2/programmes` should return `[]`, not a 404.

> Some cheap hosts block the REST API (InfinityFree does). Test this before
> promising the client a CMS.

### What the client manages

- **Programmes** — title, photo, price, hotels, flights, day-by-day itinerary,
  price tables. The `type` field routes each one to the right collection
  (circuit / croisière / séjour linguistique / voyage organisé).
- **« À la une »** and **« Programme vedette »** checkboxes drive the home
  carousel and the featured strips.
- **« Bon plan »** + **« Ancien prix »** put a programme on `/bons-plans` with a
  struck-through price and a Promo badge.
- **العمرة والحج** — Omra and Hajj programmes in Arabic, with price tables.
- **معرض الصور** — gallery photos: the featured image is the photo, the title is
  the caption.
- **Page d'accueil** — checkboxes to show or hide each home section.

---

## 5. Point the site at WordPress

```ts
data: { source: "wordpress", url: "https://cms.client.ma" }
```

No trailing slash. Leave it as `{ source: "local" }` to run on the bundled demo
content with no backend at all.

**The site does not break when WordPress does.** Each request has an 8-second
timeout, then falls back to the last good response, then to the bundled demo
content. Worth knowing so you don't panic-debug a slow host.

---

## 6. Replace the demo content

The bundled content is placeholder material and disappears per collection as
soon as the client publishes their own. Until they do, it's what visitors see —
so either get their real programmes in, or turn that feature off.

Also swap `public/gallery/*.jpg`. **Never ship one agency's photos on another
agency's site** — those pictures are their real customers.

Then shrink whatever you dropped in:

```bash
npm run images        # resizes to 2000px and re-encodes, in place
npm run images -- --dry   # report first, change nothing
```

Client photos arrive straight off a phone — 10 MB, 6000px wide — and nothing
on the site ever displays them larger than a full-width hero. The script skips
files already small enough, so it is safe to re-run.

---

## 7. Check it before handing it over

```bash
npm run dev
```

- [ ] No "Votre Agence" or placeholder logo left anywhere
- [ ] Every menu entry leads to a real page with real content
- [ ] Disabled features 404 and are gone from the menu and footer
- [ ] Phone, WhatsApp and email links all work
- [ ] The Contact map shows the right place
- [ ] Home page at 375px wide with no sideways scrolling
- [ ] Omra pages read right-to-left, prices not flipped
- [ ] `npm run build` passes

---

## 8. Deploy

```bash
npm run build
```

The build is **server-rendered, not a static folder** — shared hosting that only
serves files will not run it.

Nitro targets **Cloudflare by default** (you'll see `.output/server/wrangler.json`).
For a VPS or any Node host, build with the node preset instead:

```bash
NITRO_PRESET=node-server npm run build
node .output/server/index.mjs
```

If the client already has hosting for their WordPress and email, keep it: point
the domain at the frontend and leave the MX records alone. Never touch their
mail.
