# The Amba Addis — Design Direction (Phase 1)

**Status:** Foundational document. Read this before customizing the template for a real hotel — it explains every decision so a future editor (human or AI) can stay consistent.

**Revision note:** after the Phase 1–3 checkpoint, the project owner requested two changes, both reflected below: (1) the color system moved from the original "warm, earthy" direction to **Slate Blue & Copper** (section 4) after reviewing five alternatives side by side; (2) the sitemap was trimmed to focus on the booking funnel — `experiences.html`, `meetings-events.html`, and `weddings.html` are deferred; see `BACKLOG.md` for the full rationale and reactivation steps. Nothing below was rewritten to hide that history — this note is the record of it.

---

## 1. Brand Concept

**Demo hotel name:** The Amba Addis
**Type:** Independent boutique hotel — 5-star positioning, mid-size (fictional: 86 rooms)
**City:** Addis Ababa, Ethiopia (Bole / Kazanchis corridor, fictional address)
**Audience:** business travelers, diplomatic/NGO visitors, leisure travelers, weddings & small conferences

*"Amba"* is the Amharic/Ge'ez word for the flat-topped highland plateaus that define Ethiopia's landscape — a name that is short, pronounceable internationally, ownable as a brand mark, and evocative of place without being a real business. All contact details, reviews, and awards in this template are **clearly placeholder/demo content**, marked as such in the HTML with comments, and must be replaced with a real hotel's verified information before launch.

**Brand story (one paragraph, used across the site):**
The Amba Addis sits above the city's rhythm — a boutique hotel where Ethiopian highland craft, third-wave coffee culture, and contemporary design meet. Rooms are quiet and considered. Service is warm without formality. It is built for the guest who wants a real sense of place, not a copy of a hotel they've stayed in a dozen other cities.

**Why this concept works as a *sellable template*:** the content architecture (rooms, dining, amenities, offers, location) generalizes to almost any independent or boutique property. Swapping name, palette, photography, and copy converts it to a different city or hotel type without restructuring a single page.

---

## 2. Sitemap / Information Architecture

```
/
├── index.html                  Homepage
├── rooms.html                  All room categories
├── room-detail.html            Single room template (duplicate per room)
├── dining.html                 All F&B outlets
├── restaurant-detail.html      Single outlet template
├── amenities.html              Spa, fitness, pool, business facilities hub
├── offers.html                 All packages/promotions
├── offer-detail.html           Single offer template
├── gallery.html                Photo gallery (CSS grid + lightbox-free, filterable via native <details>)
├── about.html                  Hotel story, philosophy, awards/press placeholders
├── location.html               Address, map placeholder, transport, landmarks (local SEO anchor page)
├── contact.html                Contact form + hotel details
├── booking.html                Booking inquiry form (frontend demo only) — priority page for future payment/reservation-engine integration
├── faq.html                    Guest FAQ (uses <details>/<summary>)
├── privacy.html, terms.html, accessibility.html   Legal pages
├── robots.txt, sitemap.xml
```

**Deferred to `BACKLOG.md`:** `experiences.html`, `meetings-events.html`, `weddings.html`, and `blog.html`/`blog-post.html` were all planned in the original brief but are intentionally not built right now, to keep scope focused on the booking funnel. `BACKLOG.md` has the full rationale for each, the content outline already planned, the reserved placeholder images sitting unused in `assets/images/`, and the exact steps to reactivate each one. Business/events content lives in a summary form inside `amenities.html` in the meantime ("Business Centre & Meeting Rooms" section) rather than its own page. `pool.html` and `spa.html` were never planned as standalone pages either — a boutique hotel this size folds spa/pool into the `amenities.html` hub, which is better for SEO (avoids duplicate/thin content) and easier to maintain. Any amenity section can still be "promoted" to its own page later by copying its `<section>` into the `restaurant-detail.html`/`room-detail.html` pattern.

**Every page that exists earns its place** against the brief's own instruction not to pad the page count.

---

## 3. Folder Structure

```
hotel-site/
├── index.html
├── rooms.html, room-detail.html
├── dining.html, restaurant-detail.html
├── amenities.html
├── offers.html, offer-detail.html
├── gallery.html
├── about.html
├── location.html
├── contact.html
├── booking.html
├── faq.html
├── privacy.html, terms.html, accessibility.html
├── robots.txt
├── sitemap.xml
├── README.md
├── design-direction.md
├── BACKLOG.md          (deferred pages: what, why, and how to reactivate)
├── assets/
│   ├── images/        (SVG placeholders now; swap 1:1 for real photography)
│   ├── icons/          (inline-friendly SVG icon set)
│   └── fonts/          (empty — using Google Fonts by default; local fonts documented in README)
├── css/
│   ├── style.css        (variables, mobile-first base styles, layout, components)
│   └── responsive.css   (min-width media queries that progressively enhance to tablet/laptop/desktop/large-desktop, loaded after style.css)
└── js/
    └── main.js          (mobile nav toggle + tiny progressive-enhancement helpers only)
```

Root-level HTML (rather than a `pages/` subfolder) was chosen deliberately: clean, predictable URLs (`/rooms.html` not `/pages/rooms.html`) matter for SEO and for a non-technical hotel owner editing files directly.

---

## 4. Color System

**"Slate Blue & Copper"** — cool, contemporary, boutique-modern. Chosen from five alternatives (a side-by-side comparison mockup was reviewed) as a deliberate move away from the original "warm coffee/terracotta" direction, which didn't land with the project owner. All colors are defined as CSS custom properties in `:root` (top of `css/style.css`) so a resale customization only touches those ~13 lines.

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#26333F` | Deep slate navy — header, footer, primary text on light, section backgrounds |
| `--color-primary-light` | `#3B4C5C` | Hover states, secondary dark surfaces |
| `--color-secondary` | `#4F6672` | Muted blue-gray — eyebrows, links, secondary button text/border. Deliberately darker than the swatch shown in the comparison mockup — see contrast note below |
| `--color-accent` | `#BF6B4D` | Copper/terracotta — borders, tags, icons, hover accents (decorative/non-text use) |
| `--color-accent-light` | `#E0A588` | Pale copper tint — subtle backgrounds, badges |
| `--color-accent-dark` | `#AC5A3A` | **Button fill only** — pairs with white text at accessible contrast; see note below |
| `--color-accent-dark-hover` | `#B2603F` | Button hover fill, same contrast requirement |
| `--color-text` | `#202A31` | Body copy |
| `--color-text-muted` | `#5D6B73` | Secondary copy, captions |
| `--color-background` | `#F4F5F5` | Page background (cool off-white, not stark white) |
| `--color-surface` | `#FFFFFF` | Cards, form fields |
| `--color-border` | `#DCE2E6` | Hairlines, card borders |
| `--color-success` | `#3F6B52` | Confirmation states |

**Why there are two "accent" tracks:** the copper swatch that reads best decoratively (`#BF6B4D`, used for tags/borders/icons) does not clear WCAG AA (4.5:1) for small bold text against it — it only manages ~3.3:1 with dark text or ~3.9:1 with white text, both below the 4.5:1 required for text that isn't "large" (18.66px+ bold). Rather than accept a marginally-inaccessible primary CTA button, `.btn--primary` uses a deliberately deeper copper (`--color-accent-dark`, 4.91:1 with white text) that's still visibly part of the same color family. The lighter `--color-accent` stays reserved for places where contrast rules are looser (borders and icons need only 3:1; UI at rest, not carrying small text). The same reasoning drove darkening `--color-secondary` from the mockup's `#6E8494` (3.57:1, fails) to `#4F6672` (5.53:1, passes) — it's used as real link/label text in several places (breadcrumbs, the eyebrow label, nav hover states), not just as a decorative tone.

Verified programmatically (WCAG relative-luminance contrast formula) rather than eyeballed: every text/background pairing in active use — body text, muted text, headings, button text (both states), footer text on the dark primary background — clears 4.5:1, and every icon-only/decorative use of the lighter accent clears the looser 3:1 non-text threshold.

---

## 5. Typography

- **Headings:** `"Cactus Classical Serif", Georgia, serif` — a distinctive display serif with real character (avoids the "generic luxury Playfair" cliché) loaded from Google Fonts, single weight (regular). Originally Fraunces; swapped in Phase 6 at the project owner's request.
- **Body / UI:** `"Inter", -apple-system, Segoe UI, sans-serif` — highly legible at small sizes, excellent for forms and long-form content, weights 400/500/600.
- Two font families total (performance: 2 font requests, `font-display: swap`, variable-font files where available).
- Fluid type scale via `clamp()`, defined once as custom properties (`--fs-h1` … `--fs-small`) so every page inherits consistent hierarchy without repeated media queries.

---

## 6. Component Patterns (reused across every page)

- **Buttons:** `.btn`, `.btn--primary` (solid copper, deepens on hover), `.btn--secondary` (outline), `.btn--ghost` (text-only, for card CTAs). One base class + modifiers — no per-page button styles.
- **Section header:** `.section-header` (eyebrow label + `<h2>` + short intro) — used identically on every page for rhythm/predictability.
- **Card:** `.card` base with `.card--room`, `.card--dining`, `.card--offer` modifiers sharing image/figcaption/body/footer structure.
- **Badge/tag:** `.tag` for amenity pills ("Free Wi-Fi", "City View") — reused in room cards, detail pages, and filters.
- **Booking bar:** `.booking-bar` — the availability search component, identical on homepage (embedded) and `booking.html` (full page).
- **Testimonial:** `.testimonial` card, used in a horizontal CSS-scroll carousel.
- **Breadcrumb:** `.breadcrumb` list (`<nav aria-label="Breadcrumb">`) on every interior page — SEO + orientation.
- **Accordion:** Bootstrap's `.accordion` component, reskinned to brand colors via CSS custom-property overrides (Phase 5) — used for room/offer detail-page panels and every FAQ topic group. See the README's "New patterns introduced in Phase 5" for the markup pattern.

All patterns live in `css/style.css` under clearly commented sections so they can be located and edited in seconds.

---

## 7. UX Strategy

1. **Above the fold on every entry page** answers: what is this place, where is it, what's the vibe, how do I book.
2. **Booking CTA is always reachable** — persistent header button plus contextual CTAs in every section (rooms, offers, dining) rather than one aggressive popup.
3. **Progressive disclosure** for dense info (FAQ, room amenities) via an accordion pattern — fully accessible, works with browser find-in-page.
4. **JS-dependent interactions only where they earn their cost:** the mobile navigation toggle and the accordion panels (originally native `<details>/<summary>`; revised in Phase 5 to Bootstrap's Collapse component so panels within a group could be mutually exclusive with a smooth slide — see the README's "New patterns introduced in Phase 5" for the full rationale). Both are driven by Bootstrap's `data-bs-*` attributes with zero custom JS. Everything else (the testimonial carousel, the gallery filter, tab-like filtering) is still solved with CSS alone (`scroll-snap`, `:checked` radio hacks kept minimal and accessible, `:has()`) — deliberately not converted to a JS component, since the CSS-only versions already work well.
5. **Mobile-first layouts, not shrunk desktop layouts** — e.g., the booking bar is a stacked card on mobile and a horizontal inline bar at `≥768px`; room cards reflow from 1 → 2 → 3 columns via `grid-template-columns: repeat(auto-fit, minmax(...))` rather than fixed breakpoint counts.

---

## 8. SEO Strategy

- **Search-intent mapping per page** (examples): `index.html` → "boutique hotel in Addis Ababa"; `amenities.html` → "hotel with conference facilities Addis Ababa" (until `meetings-events.html` is reactivated per `BACKLOG.md`, at which point it inherits this intent); `dining.html`/`restaurant-detail.html` → "hotel restaurant Addis Ababa"; `location.html` → "hotel near Bole airport".
- Unique `<title>` and `<meta name="description">` per page, written for humans, following a `Primary Keyword | Secondary Context | Brand` pattern.
- One `<h1>` per page, logical `h2`/`h3` nesting, descriptive internal anchor text (never "click here").
- `rel="canonical"` on every page, pointed at the project's real deployment domain (`theambaaddis.rann.workers.dev`, since Phase 6 — see `PROJECT-NOTES.md`).
- Open Graph + Twitter Card meta on shareable pages (home, rooms, offers, room-detail).
- `Hotel` / `LodgingBusiness` and `BreadcrumbList` JSON-LD structured data on `index.html` and `location.html`, filled with internally-consistent fictional values (phone, geo-coordinates, price range) written to the same standard a real listing would use — see `PROJECT-NOTES.md` for the fictional-data disclaimer, kept in documentation rather than on the pages themselves.
- `robots.txt` + `sitemap.xml` provided; sitemap uses realistic `<lastmod>`/`<changefreq>`.
- Descriptive `alt` text on every image (no keyword stuffing — describes what's actually in the photo).

---

## 9. Commercial / Scope Guardrails

- As of Phase 6, `booking.html`'s reservation form is a **live payment flow** through Chapa, backed by a Cloudflare Worker (`worker/src/`) — see `README.md` section 3 and `DEPLOYMENT.md`. The contact form and every newsletter signup remain **frontend-only** demonstrations, each clearly commented in the HTML (e.g. `<!-- Demo only: connect to a real email service provider (e.g. Mailchimp) in production -->`).
- No fabricated "real" review attributions — testimonials and awards use clearly fictional names, not real publications or people. No invented certifications presented as fact beyond what's disclosed as fictional-but-illustrative in `PROJECT-NOTES.md`.

This document is the reference for every phase that follows. Phase 2 (global CSS, header, footer, homepage) begins next.
