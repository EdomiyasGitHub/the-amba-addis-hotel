# Backlog — Deferred Pages

This document exists so nothing gets lost. These pages were planned in the original sitemap (`design-direction.md`) but are intentionally **not built** in the current version of the template, to keep the initial scope focused on proving the core booking funnel: browse rooms → check an offer → book. Nothing described here was deleted — these pages were never built in the first place, so "removing" them mostly meant removing the dead navigation/footer links that pointed at them. Reactivating any of them later is additive, not a rebuild.

Read this before deciding the project is "done" — these are genuinely useful pages for a real hotel, just not urgent for the current goal (a sellable, booking-focused MVP).

---

## Deferred pages

### 1. `experiences.html` — Local Experiences

**What it would be:** a hub page of curated local experiences/concierge recommendations — the kind of content that captures search intent like "things to do near [hotel]" and gives the concierge desk something to point guests to online before they even check in.

**Why deferred:** the core value (helping a guest picture their stay and book) is already covered by the homepage and Amenities page; a full experiences hub is a content-marketing/local-SEO investment, not a booking-funnel essential.

**Reserved assets (already generated, currently unused):** `assets/images/experience-coffee.svg`, `experience-market.svg`, `experience-museum.svg`, `experience-hiking.svg`.

**Planned content outline:**
- Hero + short intro tying experiences to the hotel's hospitality philosophy
- Card grid (reuse the `.grid-auto` / `.card` pattern from `rooms.html`): Traditional Coffee Ceremony, Local Market Tour, National Museum Visit, Entoto Highland Hike — each with image, description, typical duration, and a "book through concierge" CTA
- Internal links back to `location.html` (once built) for geographic context

**To reactivate:**
1. Build the page using `rooms.html` as the structural template (hero → grid of cards → CTA section).
2. Add `<li><a href="experiences.html">Experiences</a></li>` back into `.primary-nav__list` on every page (it was the 3rd item, right after Dining) and into the footer's "Explore" column.
3. In `amenities.html`, the Concierge & Guest Services paragraph currently reads "...Ask for a printed city guide at check-in for local recommendations." — restore the sentence to link to `experiences.html` if desired.

---

### 2. `meetings-events.html` — Dedicated Meetings & Events page

**What it would be:** a full conference/events page with room-by-room capacity charts (theatre/banquet/classroom seating), floor plans, AV specs, catering packages, and an RFP (request-for-proposal) inquiry form for group business.

**Why deferred:** `amenities.html` already has a "Business Centre & Meeting Rooms" section covering this at a summary level, which is enough until there's actual group/corporate demand to justify the deeper page (capacity tables, RFP form, catering menus).

**Reserved assets (already generated, currently used via the Gallery's Events category, linked to `amenities.html` for now):** `assets/images/meetings-hall.svg`, `event-ballroom-setup.svg`.

**Planned content outline:**
- Hero + capacity table (room name × theatre / banquet / classroom capacity × m²) — a good `<table>` use case
- AV & catering information
- RFP/inquiry form (same field pattern as `contact.html`, plus event date and estimated headcount)
- Gallery of the ballroom and meeting rooms

**To reactivate:**
1. Build the page (the `room-detail.html` two-column layout — content + sticky sidebar — works well here, with an RFP form in the sidebar instead of a booking widget).
2. Restore the nav + footer "Hotel" column link (it was the 2nd item in the Hotel column, right after "Book Your Stay").
3. In `amenities.html`, change the Business & Events section's CTA from `<a href="contact.html">Enquire about meetings &amp; events</a>` back to `<a href="meetings-events.html">View meetings &amp; events facilities</a>`.
4. In `gallery.html`, change the two Amba Ballroom / conference-setup figures' links from `amenities.html` back to `meetings-events.html`.

---

### 3. `weddings.html` — Weddings page

**What it would be:** a dedicated wedding-venue page — ceremony and reception space descriptions, sample packages, a real wedding photo gallery, and an inquiry form.

**Why deferred:** weddings are a genuine revenue vertical for a hotel like this eventually, but they're a distinct sales motion (long lead times, package customization) that doesn't need to exist before the core room-booking product does.

**Reserved assets (already generated, currently unlinked in the Gallery's Events category):** `assets/images/wedding-terrace.svg`, `event-outdoor-reception.svg`.

**Planned content outline:**
- Hero + short positioning ("weddings above the city")
- Ceremony space + reception space descriptions (terrace, ballroom)
- 2–3 sample packages (similar card pattern to `offers.html`)
- Gallery + inquiry form

**To reactivate:**
1. Build the page (the `offers.html` + `offer-detail.html` patterns are the closest fit: a hub of packages plus a detail template).
2. Restore the nav + footer "Hotel" column link (it followed Meetings & Events).
3. In `gallery.html`, wrap the two wedding-related figures (`wedding-terrace.svg`, `event-outdoor-reception.svg`) back in `<a href="weddings.html">`.

---

### 4. `blog.html` / `blog-post.html` — Travel guide / content marketing

**What it would be:** a simple blog/travel-guide section ("Best Coffee Shops Near Meskel Square," "A Weekend in Addis Ababa," etc.) — genuinely high-value for local SEO long-term, since hotels rarely rank for broad city-guide searches without ongoing content.

**Why deferred:** this was already out of scope in the original Phase 1 plan (see `design-direction.md`, section 2) — it requires an ongoing content production commitment the static template itself can't provide, not just a one-time build.

**To reactivate:** follow the `room-detail.html` / `restaurant-detail.html` pattern for `blog-post.html` (single-article template), and `rooms.html` for `blog.html` (index/hub with card grid). No reserved assets yet — real article photography needed.

---

## What stayed, for context

Everything else from the original sitemap is in active scope: `index.html`, `rooms.html` + `room-detail.html`, `dining.html` + `restaurant-detail.html`, `amenities.html` (which absorbed the business/events summary), `offers.html` + `offer-detail.html`, `gallery.html`, and the Phase 4 pages still to come — `about.html`, `location.html`, `contact.html`, `booking.html`, `faq.html` — plus the legal pages and SEO files in Phase 5.

Booking (`booking.html`) stays a first-class priority, not a backlog item — per the project owner's direction, it's the page most likely to get a real payment/reservation-engine integration next, once the frontend is in place.
