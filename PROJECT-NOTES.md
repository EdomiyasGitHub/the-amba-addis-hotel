# Project Notes — fictional content & what's actually live

This file is the single place that says, plainly, what on this website is real and what is fictional or still a stand-in. Nothing on the pages themselves says "demo" or "placeholder" anymore — that's intentional, at the project owner's request, so the site reads as a finished product when it's presented. This document is where that context lives instead.

If you're picking this project up to build on it, read this file before you touch anything else — it'll save you from either (a) treating fictional data as real, or (b) assuming something that's actually wired up and working is still a stub.

---

## 1. The hotel itself is fictional

**The Amba Addis** is not a real hotel. It was invented for this project — a class assignment demonstrating a complete, production-quality hotel website and booking system. Every piece of "the hotel's own" content was written to be internally consistent and to read at the same level of polish as a real property's site, but none of it refers to an actual place, business, or person:

- **Address & coordinates** — "Kazanchis Business District, Ras Abebe Aregay Street, Addis Ababa" and the map coordinates (roughly 9.0192° N, 38.7525° E) are a plausible, real neighborhood in Addis Ababa, but the specific hotel at that pin does not exist. Don't use this address for anything.
- **Phone & email** — `+251 11 555 0142` and `stay@theambaaddis.rann.workers.dev` are fictional. The `555` block in the phone number is a deliberate tell (a long-standing convention for "this is not a working number"), and the email domain only exists if this project is actually deployed to it.
- **Staff names** (Selamawit Girma, Yonatan Bekele, Marta Alemu — `about.html`) — fictional individuals, not real employees of any real business.
- **Awards & press** ("Meridian Traveler," "Highland Hospitality Awards," "Addis Weekender" — `about.html`) — fictional publications/programs. They are not real outlets, and The Amba Addis has not actually won anything, because it doesn't exist.
- **Social media links** (instagram.com/theambaaddis, facebook.com/theambaaddis, linkedin.com/company/theambaaddis) — written as real-looking profile URLs for visual consistency, but **these accounts were not created or verified by this project**. If deploying this for real, either register real accounts at these handles first or point the links elsewhere — don't leave them pointing at handles that might belong to someone unrelated.
- **Room names & rates, dining menu & prices, amenities, offers** — invented for this project, not sourced from a real property.
- **Legal pages** (`privacy.html`, `terms.html`, `accessibility.html`) — written as genuine, complete policy documents (not "lorem ipsum" filler), but they have **not been reviewed by an actual lawyer**. Treat them as a realistic first draft, not as legal advice, before using them for a real business.

None of this needed to be labeled "fictional" on the pages themselves for the same reason a screenwriter doesn't caption a film "these events did not happen" — the fictional framing is understood, and the point of the exercise was to build something that reads as real and complete.

---

## 2. What's genuinely live vs. still a stub

This is the important part if you're evaluating the engineering, not just the content.

### Genuinely live (real, working code — not a mockup)

- **Chapa checkout.** `booking.html`'s reservation form is a real integration: submitting it calls a Cloudflare Worker (`worker/src/index.js`), which prices the stay server-side, creates a reservation record in Workers KV, and calls Chapa's actual `transaction/initialize` API to start a hosted checkout session. `booking-confirmation.html` calls Chapa's `transaction/verify` API to confirm the real payment outcome before ever telling a guest their booking is confirmed. This is production-quality code, not a simulated flow — see `README.md` section 3 and `DEPLOYMENT.md`.
- **Reservation storage.** Every checkout attempt is persisted as a JSON record in Cloudflare KV, keyed by its Chapa transaction reference (`worker/src/reservations.js`).
- **Client-side validation, date guardrails, and the live nights/subtotal calculator** on `booking.html` (`js/main.js`, sections 1–2) — fully functional, no backend needed.

### Deliberately stubbed, and honest about it

- **Telebirr.** Ethiopia's other major mobile-money option has no public self-serve API or sandbox — using it for real requires a direct merchant agreement with Ethio Telecom. Rather than fake an integration, its radio button on `booking.html` is disabled ("coming soon"), and the Worker returns a clear error if it's ever selected. See `worker/src/index.js`.
- **Contact form** (`contact.html`) — frontend-only. Submitting it shows a confirmation message but does not send an email anywhere; it isn't connected to a mail service. Marked with an HTML comment above the form.
- **Newsletter signup** (every page footer) — same pattern: confirms in the UI, doesn't actually subscribe anyone. Not connected to an email service provider (e.g. Mailchimp).
- **"Request Reservation" quick-inquiry forms** on `restaurant-detail.html`, `room-detail.html`, and `offer-detail.html` — separate from the main `booking.html` checkout flow; these are still frontend-only demonstrations (table/quick-enquiry requests, not the payment flow).

### Not run by this project, but ready to run

- **Cloudflare deployment.** The Worker, KV binding, and static-asset config (`wrangler.jsonc`, `package.json`, `.assetsignore`) are all written and ready to deploy, but nothing has actually been deployed to Cloudflare from here — this environment has no Cloudflare account credentials and no real Chapa merchant secret key. See `DEPLOYMENT.md` for exactly how to take this the rest of the way to `theambaaddis.rann.workers.dev`.
- **A real Chapa merchant account.** The integration code is real and correct against Chapa's documented API conventions, but it has not been tested against a live Chapa account or a real money-moving transaction — that requires the project owner's own Chapa merchant credentials.

---

## 3. Photography

All photography and image `alt` text on this site is being handled separately by the project owner, not by this pass of work. Images currently in `assets/images/` are labeled placeholder SVGs sized to the exact aspect ratio each layout expects — see `README.md` section 3 ("Images") for how to swap them 1:1 once real (or properly licensed) photography is ready.

---

## 4. Why this document exists

Earlier drafts of this site had visible "(demonstration content)" labels, disclaimer banners, and inline HTML comments scattered across the pages — accurate, but distracting from presenting the site as a finished, deployable product. At the project owner's request, that context was consolidated here instead of removed outright: the fictional-data and stub-vs-live distinctions are still fully documented, just in one place a developer or grader would look, rather than interrupting the pages themselves.
