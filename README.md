# The Amba Addis — Hotel Website Template

A shippable, reusable hotel website template built with HTML5, CSS3, and Bootstrap's grid/utility classes, plus a small amount of vanilla JavaScript. Built to the standard of a real commercial hotel website, using a fictional boutique hotel in Addis Ababa as the demo brand.

**Current status: Phase 1–6 — all 18 pages complete, with a live payment/reservation backend.** This delivery includes the full design system, global CSS, header/navigation, footer, every page (`index.html`, `rooms.html`, `room-detail.html`, `dining.html`, `restaurant-detail.html`, `amenities.html`, `offers.html`, `offer-detail.html`, `gallery.html`, `about.html`, `location.html`, `contact.html`, `booking.html`, `booking-confirmation.html`, `faq.html`, the legal pages `privacy.html`, `terms.html`, and `accessibility.html`), `robots.txt`, `sitemap.xml`, and a Cloudflare Worker (`worker/src/`) that gives `booking.html` a real reservation + payment flow through **Chapa** (Telebirr honestly stubbed — see section 3 below). Two changes were made after the Phase 3 checkpoint at the project owner's request: the color palette moved to **Slate Blue & Copper** (see section 3 below), and `experiences.html`, `meetings-events.html`, and `weddings.html` were removed from the active build to keep scope focused on the booking funnel — see `BACKLOG.md` for the full rationale and how to reactivate them later. Phase 5 brought a sitewide polish pass — targeted Bootstrap JS adoption, real icons and a real map in the footer, a parallax hero treatment, smoother accordions. Phase 6 swapped the heading font to **Cactus Classical Serif**, replaced every remaining placeholder value with fictional-but-realistic data consistent with the property's established details (see `PROJECT-NOTES.md` for the full disclaimer and what's genuinely live vs. still stubbed), and built the Chapa integration described above. Every internal link points only to pages that exist; nothing links to a deferred page.

Read `design-direction.md` first — it explains every design decision (brand concept, sitemap, color/type system, component patterns, UX and SEO strategy) referenced below. If you're wondering where Experiences, Meetings & Events, or Weddings went, read `BACKLOG.md` — they were deliberately deferred, not forgotten, and that file explains why plus exactly how to bring each one back.

---

## 1. How to run the website

Every page except `booking.html`/`booking-confirmation.html` is a static file — no build step, no server-side code, no dependencies to install to browse them. The booking flow is different: it calls a small JSON API (`/api/checkout`, `/api/verify`) served by the Cloudflare Worker in `worker/src/`, so it needs that Worker running to actually take a payment. See `DEPLOYMENT.md` for the full picture.

**Quickest option (browsing only, booking flow inert):** double-click `index.html` to open it in a browser. Note: booking-bar/date JavaScript and some form behavior work fine this way, but a couple of browsers restrict certain features on `file://` URLs — a local server avoids that entirely.

**Static preview — a tiny local server (booking flow still inert, no `/api/*`):**

```bash
# Python (already installed on most systems)
cd hotel-site
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or, with Node installed:

```bash
npx serve hotel-site
```

**Full local preview, including the booking/payment flow:**

```bash
cd hotel-site
npm install        # pulls in wrangler, the Cloudflare Workers CLI
npx wrangler dev    # serves the site AND worker/src/index.js's /api/* routes together
```

This runs the exact same code that deploys to production (see below), including the ASSETS fallback and the KV-backed reservation store — `wrangler dev` uses local, disposable KV storage automatically so you can click through checkout without touching production data. It won't be able to reach the real Chapa API meaningfully without a real `CHAPA_SECRET_KEY` (see `DEPLOYMENT.md`).

**Production hosting:** this project deploys to Cloudflare Workers (Workers + Static Assets — see `DEPLOYMENT.md` for the exact steps), because the booking flow needs a place to run `worker/src/index.js`. Every other page would also run fine on a plain static host (Netlify, Vercel, GitHub Pages, S3 + CloudFront), but `booking.html`'s checkout button would have nothing to talk to there.

---

## 2. Working with Bootstrap (a quick explainer)

Bootstrap is a CSS (and optionally JavaScript) toolkit that ships pre-built, cross-browser-tested classes for common layout and UI needs — a responsive 12-column grid (`.container`, `.row`, `.col-*`), spacing utilities (`.mt-4`, `.gap-3`), and flex helpers (`.d-flex`, `.align-items-center`).

This project loads Bootstrap's **CSS**, **Icons**, and — as of Phase 5 — a **targeted slice of its JavaScript**, all via CDN, in every page's `<head>`/before `</body>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
<!-- …body content… -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
<script src="js/main.js" defer></script>
```

Bootstrap's CSS is used sparingly — mainly for the `.row`/`.col-lg-*` two-column layouts (e.g. the homepage introduction and location sections) where Bootstrap's grid math saves writing custom flex/grid CSS for a very standard pattern. Bootstrap Icons supplies the real Instagram/Facebook/LinkedIn glyphs in the footer (`<i class="bi bi-instagram">` etc.) in place of text abbreviations. Every other visual decision on this site — colors, typography, buttons, cards, the booking bar, the header/nav, the footer — is **our own CSS**, defined in `css/style.css` and `css/responsive.css`, layered on top of Bootstrap's grid.

**Bootstrap's JS is scoped deliberately, not loaded wholesale.** We use exactly one Bootstrap JS component — **Collapse** — for exactly two things: the mobile nav toggle (`data-bs-toggle="collapse"` on the hamburger button, targeting `#primary-navigation`) and the accordion behavior on `room-detail.html`, `offer-detail.html`, and `faq.html` (Bootstrap's `.accordion` markup, which is Collapse under the hood with `data-bs-parent` doing the "only one panel open" logic). Both are driven entirely by HTML `data-bs-*` attributes — Bootstrap's bundle self-initializes them, so `js/main.js` contains zero custom code for either. We did **not** reach for Bootstrap's dropdowns, modals, or carousel: the gallery filter is still a CSS-only `:has()` implementation and the testimonials section is still a CSS-only horizontal-scroll carousel (see `design-direction.md`, section 12, and the "Why a CSS carousel" note in the component comments) — both work well as-is and don't need a JS component.

Bootstrap's default blue theming on Collapse's accordion output is overridden to the site's Slate Blue & Copper palette via CSS custom properties scoped under `.accordion` (see `css/style.css`, section 23) — no Bootstrap source files are touched.

**If you don't know Bootstrap at all:** you don't need to learn it to customize this template. You will spend nearly all your time in `css/style.css` (colors, fonts, spacing, component styles) — Bootstrap is only doing grid math and the two Collapse-based interactions described above.

---

## 3. How to customize this for a real hotel

### Branding — colors, fonts, logo

Open `css/style.css` and edit the CSS custom properties at the very top, inside `:root { ... }` (section 1 of the file's table of contents). Every button, link, card, and section on every page pulls its color from these ~13 variables — changing them re-skins the whole site:

```css
--color-primary: #26333F;      /* main brand color (deep slate navy) */
--color-secondary: #4F6672;    /* secondary accent (muted blue-gray) */
--color-accent: #BF6B4D;       /* decorative copper — borders, tags, icons */
--color-accent-dark: #AC5A3A;  /* button fill — deeper copper, accessible with white text */
--color-background: #F4F5F5;
```

Note the split between `--color-accent` and `--color-accent-dark`: the lighter copper looks best for borders/tags/icons, but doesn't clear WCAG AA contrast for small button text, so buttons deliberately use the darker variant with white text instead. See `design-direction.md`, section 4, for the full contrast reasoning — worth reading before changing these if you want to keep the site accessible.

Fonts are loaded from Google Fonts in each page's `<head>` (`Cactus Classical Serif` for headings, `Inter` for body text) and referenced via `--font-heading` / `--font-body` in the same `:root` block — swap the Google Fonts `<link>` and the two variable values together.

The logo is `assets/icons/logo-mark.svg`, referenced in the header and footer of every page. Replace this file with a real logo (SVG recommended for crisp scaling) — the surrounding markup (`<img src="assets/icons/logo-mark.svg" ...>`) does not need to change if the new file keeps the same name, or update the `src` if you rename it. The hotel name text sits next to the logo in the `.brand` markup and is plain HTML — find and replace "The Amba Addis" across all pages.

### Images

Every photograph on the site is currently a labeled SVG placeholder in `assets/images/`, generated to the exact aspect ratio and pixel dimensions the layout expects (see the `width`/`height` attributes on each `<img>` — these prevent layout shift and should match your replacement photo's aspect ratio). Swap files 1:1 by keeping the same filename, or update the `src` attribute if you rename them. Real photography should be compressed and, ideally, served as WebP/AVIF with a JPEG fallback for best performance — see "Performance" below.

### Room information

Each room is one `.card` block inside the "Featured Rooms" section of `index.html` (and, in later phases, `rooms.html`/`room-detail.html`). Duplicate a card block to add a room type, or edit the name, occupancy line (`Sleeps X · Bed Type · Size`), description, `.tag` amenities, and price directly in the HTML.

### Dining, amenities, offers

Same pattern as rooms: each restaurant/amenity/offer is a self-contained `.card` (or smaller tile) block. Copy, edit, or delete blocks freely — the CSS grid (`.grid-auto`) automatically reflows to fit however many cards remain.

### Contact information

The hotel's address, phone, and email appear in three places on the homepage: the Location section (`<address>`), the footer, and the JSON-LD structured data block in `<head>` (see "SEO" below) — update all three together. Phone numbers use `tel:` links and emails use `mailto:` links; update both the visible text and the `href`.

### The booking/payment integration (live)

`booking.html`'s reservation form is wired to a real payment flow, not a demonstration. The pieces:

- **Frontend:** `booking.html` (`#reservation-form`) + `js/main.js` section 4. On submit, it POSTs the form as JSON to `/api/checkout`, then redirects the browser to the `checkout_url` Chapa returns.
- **Backend:** `worker/src/index.js`, a Cloudflare Worker. `/api/checkout` validates the request, prices it server-side from the authoritative `ROOMS` table (never trusting a client-submitted amount), creates a reservation record, and calls Chapa's `transaction/initialize` endpoint (`worker/src/chapa.js`). `/api/verify` re-confirms a transaction's real status with Chapa directly — used by `booking-confirmation.html` (Chapa's `return_url` target) and by `/api/webhook/chapa` (Chapa's server-to-server payment notification).
- **Storage:** Cloudflare Workers KV (`worker/src/reservations.js`), one JSON record per reservation, keyed by its `tx_ref`. KV was chosen over a relational database for simplicity at this property's scale — see the comment at the top of `reservations.js` for when that trade-off would flip.
- **Gateways:** **Chapa** is live. **Telebirr** is intentionally stubbed — it has no public self-serve API/sandbox and requires a direct merchant agreement with Ethio Telecom, so its radio button in `booking.html` is disabled and `/api/checkout` returns an honest "not available yet" error if it's ever selected, rather than faking a working integration.

To point this at a different booking engine or PMS instead of (or alongside) this custom Worker, the seam is `/api/checkout`/`/api/verify` in `worker/src/index.js` — swap what happens inside those handlers.

**Every other form on the site** (contact, every newsletter signup, the dining "Request Reservation" form) is still a frontend-only demonstration, marked with an HTML comment directly above it, e.g.:

```html
<!-- Demo only: connect to a real email service provider (e.g. Mailchimp) in production -->
```

**Why these still don't actually submit (and won't 405 on you):** each uses `action="#" method="post"`. Left alone, that sends a real HTTP POST to the current page's URL, which this Worker's `/api/*` router doesn't handle and the static-assets fallback can't either — on any static host it would 405. `js/main.js` (section 3, "Demo form submission handling") intercepts the submit instead: it runs the form's own HTML validation, then shows an inline "thanks" confirmation (`.form-success`, styled in `css/style.css` section 7) in place of a real request. To connect one for real, give it a real `action`/backend and remove it from the `form[action="#"]` selector (or just change its `action`/`method` so section 3 stops matching it).

---

## 4. SEO considerations

- Every page needs a **unique** `<title>` and `<meta name="description">` — written for the search intent that page targets (see `design-direction.md`, section 8, for the full intent map, e.g. `amenities.html` → "hotel with conference facilities Addis Ababa").
- Update `<link rel="canonical">` and the Open Graph `og:url`/`og:image` tags on every page once the site has a real domain — they currently point at the placeholder `theambaaddis.rann.workers.dev` domain (an RFC 2606 reserved domain, used intentionally so nothing accidentally points at a real third-party site).
- The `Hotel` JSON-LD structured data block in `index.html`'s `<head>` uses placeholder `address`, `geo`, and `telephone` values — replace every field with the real, verified business information before launch. Do not leave fictional data in structured data on a live site; search engines and users treat this as factual.
- Image `alt` text throughout describes what's actually depicted (never keyword-stuffed) — keep that discipline when swapping in real photography.
- `robots.txt` (allows all crawling, points at the sitemap) and `sitemap.xml` (all 14 indexable pages, with `lastmod`/`changefreq`/`priority`) ship at the site root. The three legal pages (`privacy.html`, `terms.html`, `accessibility.html`) carry `<meta name="robots" content="noindex, follow">` and are deliberately **excluded** from the sitemap — standard practice for boilerplate legal pages that shouldn't compete for search visibility, while still letting their outbound links pass equity. Update both files' domain once the site has a real one, and regenerate the sitemap's `lastmod` dates on real content changes.
- On-page headline style (H1s and eyebrows) was audited against real hotel-website convention during Phase 5 — sentence case throughout, proper nouns capitalized as names (e.g. "Highland Suite," "Buna & Vine"), no Title Case — and every page already matched it; no changes were needed.

---

## 5. Accessibility notes

- Every form input has a real `<label>` (visually hidden only where a placeholder-style field is genuinely self-evident, e.g. the newsletter email field, which still has a linked, screen-reader-readable label).
- Focus states are visible everywhere via `:focus-visible` (see `css/style.css` section 5) — do not remove these when customizing.
- The skip-link (`Skip to main content`) is the first focusable element on every page for keyboard users.
- Color contrast for all text/background combinations was chosen to clear WCAG AA; if you change brand colors, re-check contrast (a free tool like the WebAIM Contrast Checker takes seconds).

---

## 6. What's next

All five planned phases are complete:

- ~~**Phase 3:** `rooms.html`, `room-detail.html`, `dining.html`, `restaurant-detail.html`, `amenities.html`, `offers.html`, `offer-detail.html`, `gallery.html`~~ — done
- ~~**Phase 4:** `about.html`, `location.html`, `contact.html`, `booking.html`, `faq.html`~~ — done
- ~~**Phase 5:** legal pages (`privacy.html`, `terms.html`, `accessibility.html`), `robots.txt`, `sitemap.xml`, and a sitewide polish pass (targeted Bootstrap JS, real footer map and social icons, parallax hero, smoother accordions, date-input styling, headline-convention audit, Chapa/Telebirr confirmation)~~ — done

`experiences.html`, `meetings-events.html`, and `weddings.html` remain deliberately out of scope — they were deferred at the project owner's request to keep scope focused on the booking funnel. See `BACKLOG.md` for what each page would contain and exactly how to bring it back later.

The one substantive item intentionally **not** built is a live payment/reservation-engine integration (Chapa/Telebirr) — see "Where future booking integration would occur" above for exactly where that plugs in when that phase is greenlit.

Every existing link points at a page that exists in this delivery; there are no more not-yet-built pages to watch for.

## 7. New patterns introduced in Phase 3 (for customizers)

- **Duplicable detail-page templates:** `room-detail.html`, `restaurant-detail.html`, and `offer-detail.html` are each written as a single template with a "DUPLICATION NOTE" HTML comment near the top of the `<head>` explaining exactly what to change when copying the file for a second room/restaurant/offer.
- **Comparison table** (`rooms.html`): a real `<table>` — not a styled div grid — so it stays screen-reader- and copy/paste-friendly. Add or remove `<tr>` rows to match your actual room count.
- **Sticky booking sidebar** (`.room-detail-layout` in `css/responsive.css`, ≥992px): a reusable two-column pattern with a sticky `<aside>`, used on both `room-detail.html` and `offer-detail.html`. Reuse this class for any future detail page that needs a persistent "book now" panel.
- **CSS-only gallery filter** (`gallery.html`): category pills are implemented with plain radio inputs, `:checked`, `:not()`, and the modern `:has()` selector (see `css/style.css`, section 15b) — zero JavaScript. Add a new category by adding one radio/label pair, one `.cat-yourcategory` class on the relevant figures, and one `:has()` rule.
- **Feature checklist** (`.feature-list` class): the checkmark amenity/inclusion lists used on room, restaurant, and offer detail pages. Just an unordered list — add or remove `<li>` items freely.

## 8. New patterns introduced in Phase 4 (for customizers)

- **`booking.html`.** Every "Book"/"Check Availability" control site-wide (the homepage booking bar, and each room/offer detail page's booking widget) submits a GET request to `booking.html` with `room`, `checkin`, `checkout`, `adults`, `children`, and `rooms` query parameters. `js/main.js` (section 2, "Booking summary") reads those parameters on load to pre-fill the form, then keeps a live nights/subtotal estimate in sync client-side as the visitor changes room or dates — using the `data-price` attribute on each `<option>` in the room `<select>` as its only data source. As of Phase 6, submitting the form is a live payment flow, not a placeholder — see section 3 above ("The booking/payment integration") and "New patterns introduced in Phase 6" below.
- **Image-less utility-page header:** `contact.html`, `booking.html`, and `faq.html` use the `.hero` class without a `.hero__media` child — it falls back to a solid `var(--color-primary)` background. This is a deliberate, lighter-weight header for functional pages (as opposed to the full-bleed photo hero on marketing pages like `rooms.html`/`about.html`/`location.html`) and needs no new image asset if you add another utility page later.
- **Stat row & icon tiles** (`css/style.css`, section 21): `.stat-grid`/`.stat` (used on `about.html`) and `.info-tile`/`.icon-circle` (used on `contact.html`) are small, reusable patterns for at-a-glance numbers and icon+text rows. Both take inline SVG icons directly (see the existing markup for the stroke-icon style used throughout).
- **FAQ accordion** (`faq.html`): reuses the `.accordion-item` `<details>/<summary>` pattern already defined in `css/style.css` section 18 (no new CSS needed), grouped into topic sections. A matching `FAQPage` JSON-LD block sits in the `<head>` — keep it in sync with the visible questions if you add, remove, or reword any.
- **`LodgingBusiness` + `BreadcrumbList` JSON-LD** (`location.html`): the second structured-data page referenced in `design-direction.md` section 8, alongside the `Hotel` schema on `index.html`. Same rule applies — replace every placeholder value with the real property's verified details before launch.

## 9. New patterns introduced in Phase 5 (for customizers)

- **Bootstrap Collapse for mobile nav.** The header's hamburger button is now `<button data-bs-toggle="collapse" data-bs-target="#primary-navigation" aria-expanded="false" aria-controls="primary-navigation">` and the nav itself is `<nav class="primary-nav collapse" id="primary-navigation">`. Bootstrap's bundle handles the open/close, the `.show` class, and keeps `aria-expanded` in sync — `js/main.js` has no mobile-nav code at all anymore. The existing desktop override in `css/responsive.css` (`.primary-nav { display: block !important; }` at `≥768px`) still applies unchanged and safely overrides Bootstrap's collapse state at desktop widths.
- **Bootstrap Accordion for expandable panels** (`room-detail.html`'s "Policies"/"Accessibility", `offer-detail.html`'s "Terms"/"Cancellation policy", and every topic group in `faq.html`): standard `.accordion`/`.accordion-item`/`.accordion-button`/`.accordion-collapse` markup with `data-bs-parent="#groupId"` on each `.accordion-collapse` to keep panels in the same group mutually exclusive (smooth slide, and opening one closes the other). `faq.html` has one accordion group per topic section, so a question in "Booking" and a question in "Check-in" can be open at once, but two "Booking" questions cannot. Brand colors are applied via the `--bs-accordion-*` CSS custom-property overrides in `css/style.css` section 23 — copy that block if you add a new accordion elsewhere and want it to match.
- **Real footer map.** Every page's footer now embeds a live, API-key-free OpenStreetMap iframe (`css/style.css` section 26, `.footer-map`) pointed at the site's placeholder coordinates (9.0192° N, 38.7525° E). Update the `bbox`/`marker` query parameters in the iframe `src` on every page (search-and-replace is fastest) once you have the real property's coordinates — the HTML comment directly above the map flags this.
- **Real social icons.** The footer's Instagram/Facebook/LinkedIn links use Bootstrap Icons glyphs (`<i class="bi bi-instagram">` etc., loaded via the `bootstrap-icons` stylesheet) in place of the old "IG"/"FB"/"IN" text abbreviations. Swap the `href="#"` placeholders for real profile URLs, and swap the `bi-*` class for a different Bootstrap Icons glyph if you add another platform (the full icon set is browsable at icons.getbootstrap.com).
- **Parallax hero** (`css/style.css` section 24, `.hero__media--parallax`): applied to the photographic hero on `index.html`, `rooms.html`, `dining.html`, `amenities.html`, `offers.html`, `about.html`, and `location.html`. It's a CSS-only technique — `background-attachment: fixed` on the `.hero__media` container, driven by a `--hero-bg` custom property set inline per page — not a JS library, and it's gated behind `@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)` so touch devices (where this CSS property is unreliable) and visitors who've asked for reduced motion get the normal static hero instead. The `<img>` tag stays in the DOM at all times (only visually hidden when the effect is active) so alt text, lazy-loading, and LCP behavior are unaffected. To add the effect to a new photo hero, add the `hero__media--parallax` class and a `style="--hero-bg: url('assets/images/your-image.svg');"` attribute to that page's `.hero__media` div — no CSS changes needed.
- **Date-input styling** (`css/style.css` section 25): the native `<input type="date">` field picks up the brand's `accent-color` and a styled hover state on its calendar-icon indicator. Browsers don't allow CSS styling of the OS-native calendar *popup* itself — only the field and (in Chromium/WebKit) the little calendar icon — so this is intentionally a light-touch pass rather than a custom JS datepicker; a full custom calendar UI (e.g. via a library like Tempus Dominus) remains an option for a future phase if a fully bespoke picker becomes a priority.
- **Legal pages** (`privacy.html`, `terms.html`, `accessibility.html`): all three share one content pattern — an image-less, shorter `.hero`, then numbered `<h2>` sections in a `.col-12 col-lg-9` column. All three are marked `<meta name="robots" content="noindex, follow">` and excluded from `sitemap.xml` (see "SEO considerations" above). This content is written as real policy copy for a real property, but it has not had actual legal review — see `PROJECT-NOTES.md` for that disclaimer (deliberately kept off the pages themselves, since this is meant to read as a finished site). Update the "Last updated" date once real legal review has happened.

## 10. New patterns introduced in Phase 6 (for customizers)

- **Live Chapa checkout.** See "The booking/payment integration (live)" in section 3 above for the full architecture (`worker/src/index.js`, `chapa.js`, `reservations.js`, and `js/main.js` section 4). The short version: `#reservation-form` on `booking.html` POSTs JSON to `/api/checkout`, gets back a `checkout_url`, and redirects there; `booking-confirmation.html` is Chapa's `return_url` target and calls `/api/verify` to confirm the real outcome. `DEPLOYMENT.md` has the exact steps to stand up your own Cloudflare account, KV namespace, and Chapa secret and deploy this for real.
- **`.form-error` component** (`css/style.css` section 7, alongside the Phase 5-era `.form-success`): an error-toned mirror of the success message pattern — a `<p class="form-error" role="alert" hidden>` with an inline SVG icon and a `<span>` for the message, unhidden via JS when something goes wrong (used on `booking.html` and `booking-confirmation.html` for checkout/verification failures).
- **`.location-map` component** (`css/style.css` section 26, alongside `.footer-map`): a larger map embed for a page's main content area (used on `index.html`'s Location section and all of `location.html`'s map), as opposed to `.footer-map`'s smaller sidebar-style embed used in every page footer. Same OpenStreetMap iframe technique, different sizing.
- **Cactus Classical Serif.** The `--font-heading` custom property (`css/style.css` section 1) now points to `"Cactus Classical Serif", Georgia, "Times New Roman", serif`, loaded from Google Fonts in every page's `<head>` alongside Inter. Originally Fraunces — see `design-direction.md` section 5 for the swap note.
- **Fictional-but-complete property data.** Every remaining "(demonstration)"/"(illustrative)" label has been replaced with specific, internally-consistent fictional data (address, phone, awards, team names, social profile URLs) at the same level of polish as a real property's site — see `PROJECT-NOTES.md` for the consolidated disclaimer and the honest "what's actually live vs. still stubbed" list (this is the one place that disclaimer now lives, rather than being scattered across the pages themselves).
- **Cloudflare Workers deployment target.** `wrangler.jsonc`, `package.json`, and `.assetsignore` configure this project as a single Worker ("Workers + Static Assets") serving both the site and the `/api/*` routes from `theambaaddis.rann.workers.dev`. See `DEPLOYMENT.md`.
