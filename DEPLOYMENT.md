# Deployment guide — Cloudflare Workers

This walks through taking this project from "code in a folder" to a live site at `theambaaddis.rann.workers.dev`, with a working Chapa checkout. It assumes a Cloudflare account (the free plan is enough) and, separately, a Chapa merchant account for the real secret key.

**Do this from your own terminal, on your own machine — not by pasting anything into a chat with an AI assistant.** The one genuinely sensitive step here is your Chapa secret key, and the whole point of `wrangler secret put` (step 4) is that the key never has to leave your terminal, get typed into a browser, or be seen by anyone else, including whoever helped you build this project.

---

## 0. Prerequisites

- Node.js installed (18+; anything reasonably recent works).
- A free Cloudflare account — [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
- A Chapa account — [dashboard.chapa.co](https://dashboard.chapa.co) — with a **secret key** from the API/Settings section of your dashboard. Chapa provides both test and live keys; start with a test key while you get deployment working.

---

## 1. Install dependencies

```bash
cd hotel-site
npm install
```

This pulls in `wrangler`, Cloudflare's CLI, as a dev dependency (see `package.json`) — nothing else. There's no other build step; the site itself is plain HTML/CSS/JS.

## 2. Log in to Cloudflare

```bash
npx wrangler login
```

This opens a browser window to authorize the CLI against your Cloudflare account. No credentials are typed into the terminal.

## 3. Create the KV namespace

Reservations are stored in Cloudflare Workers KV (see `worker/src/reservations.js`). Create the namespace:

```bash
npx wrangler kv namespace create RESERVATIONS
```

This prints an `id`. Open `wrangler.jsonc` and paste it in, replacing the placeholder:

```jsonc
"kv_namespaces": [
  { "binding": "RESERVATIONS", "id": "PASTE_YOUR_ID_HERE" }
]
```

## 4. Set your Chapa secret key

```bash
npx wrangler secret put CHAPA_SECRET_KEY
```

Wrangler will prompt you to paste the key interactively — it's stored encrypted on Cloudflare's side and injected into the Worker as `env.CHAPA_SECRET_KEY` at runtime. It is never written into any file in this repo, never appears in `wrangler.jsonc`, and should never be pasted anywhere else (chat, a `.env` file that gets committed, a Slack message, etc.).

## 5. First deploy

```bash
npx wrangler deploy
```

Wrangler will assign your Worker to `<name>.<your-subdomain>.workers.dev` the first time you deploy, where `<name>` comes from `wrangler.jsonc` (already set to `theambaaddis`) and `<your-subdomain>` is a `*.workers.dev` subdomain tied to your Cloudflare account (you'll be prompted to choose one if you haven't already — this project assumes it'll end up being `rann`, per the project owner, giving `theambaaddis.rann.workers.dev`).

Once deployed, `https://theambaaddis.rann.workers.dev/` should serve the full site, and `booking.html` should be able to reach `/api/checkout` on the same origin — no separate API host to configure.

## 6. Test the flow with a test key

With a Chapa **test** secret key set (step 4), go through `booking.html` end to end: pick a room and dates, fill in guest details, submit, and confirm you land on Chapa's hosted checkout with the right amount and currency (ETB). Chapa's test mode lets you complete or fail a test transaction without moving real money — check your Chapa dashboard's docs for current test card/test mobile-money details, since these can change over time.

Once that round-trip works, `wrangler secret put CHAPA_SECRET_KEY` again with your **live** key to go live for real.

## 7. Re-deploying after changes

```bash
npx wrangler deploy
```

Every deploy re-uploads both the Worker code and the current contents of the static-assets directory (everything not excluded by `.assetsignore`). There's no separate "publish" step for HTML edits — a deploy picks up everything.

---

## GitHub integration

This repo is set up as a local git repository (`git init`, with an initial commit) but is not yet pushed to GitHub — that's a step for you to take, since it means choosing where the code lives under your own account:

```bash
# create a new repo on GitHub first (via github.com or `gh repo create`), then:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

From there, two reasonable workflows:

1. **Manual deploys (what this guide assumes above):** keep using `npx wrangler deploy` from your own machine whenever you want to push a change live. Simple, no extra setup, full control over exactly when a deploy happens.
2. **Git-connected deploys:** Cloudflare's dashboard offers a "connect to Git" flow for Workers (under Workers & Pages → your Worker → Settings, or when creating a new Worker) that redeploys automatically on push to a chosen branch. This is worth setting up once you're past initial testing and want pushes to `main` to go live automatically — check the current Cloudflare dashboard for the exact steps, since this UI evolves. Either way, keep `wrangler secret put` as an out-of-band step done from a terminal — CI/CD for the code doesn't need to (and shouldn't) also manage the Chapa secret.

Whichever workflow you use, `wrangler.jsonc`'s `kv_namespaces[0].id` and any secrets are specific to *your* Cloudflare account — if you fork or clone this repo fresh, redo steps 3–4 rather than reusing values from someone else's deployment.

---

## Troubleshooting

- **"Payments aren't configured" error from `/api/checkout`:** `CHAPA_SECRET_KEY` isn't set for this deployment yet — redo step 4.
- **Booking form shows a network/connection error:** you're probably viewing the site via a plain static server (`python3 -m http.server`, opening `index.html` directly, etc.) rather than through `wrangler dev`/`wrangler deploy` — there's no `/api/*` router in that setup. See `README.md` section 1.
- **KV writes failing / reservation not found on the confirmation page:** double check `wrangler.jsonc`'s `kv_namespaces[0].id` actually matches a namespace in your account (`npx wrangler kv namespace list`).
- **Chapa returns an error on initialize:** confirm you're using a secret key (not a public key) from the correct mode (test vs. live), and check the error message returned in the API response — `worker/src/chapa.js` surfaces Chapa's own error text where possible.
