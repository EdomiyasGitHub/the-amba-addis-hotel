/**
 * The Amba Addis — reservation & payment Worker
 * ---------------------------------------------------------------------
 * Runs as a Cloudflare Worker with Static Assets: this one Worker serves
 * both the static site (everything under the project root, via the
 * ASSETS binding) and a small JSON API under /api/* for the booking
 * flow. See wrangler.jsonc for the binding config and DEPLOYMENT.md for
 * how to stand this up on a real Cloudflare account.
 *
 * Routes:
 *   POST /api/checkout        Start a reservation + Chapa checkout session
 *   GET  /api/verify          Confirm a transaction's final status
 *   POST /api/webhook/chapa   Chapa's server-to-server payment notification
 *   *    (everything else)    Falls through to the static site (ASSETS)
 *
 * Why a Worker holds this logic instead of the browser calling Chapa
 * directly: the Chapa secret key must never reach client-side code, the
 * room→price map must be authoritative on the server (a browser could
 * otherwise submit any amount it likes), and a payment's real status has
 * to be confirmed with Chapa directly rather than trusted from a redirect
 * the guest's browser could reload, replay, or simply fabricate.
 * ---------------------------------------------------------------------
 */

import { initializeChapaTransaction, verifyChapaTransaction } from "./chapa.js";
import { saveReservation, getReservation, updateReservationStatus } from "./reservations.js";

// Authoritative room catalogue — mirrors the <option data-price> values in
// booking.html, but this copy (not the client's) is what actually gets
// charged. Keep the two in sync when rates change.
const ROOMS = {
  "amba-room": { name: "Amba Room", rate: 5500 },
  "amba-room-twin": { name: "Amba Room Twin", rate: 5500 },
  "garden-twin-room": { name: "Garden Twin Room", rate: 5900 },
  "executive-corner-room": { name: "Executive Corner Room", rate: 7400 },
  "highland-suite": { name: "Highland Suite", rate: 9800 },
  "ras-suite": { name: "Ras Suite", rate: 22000 }
};

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(body, status) {
  return new Response(JSON.stringify(body), { status: status || 200, headers: JSON_HEADERS });
}

function badRequest(message) {
  return json({ error: message }, 400);
}

function isValidDateString(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function nightsBetween(checkin, checkout) {
  const ms = Date.parse(checkout) - Date.parse(checkin);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function splitName(fullName) {
  const trimmed = (fullName || "").trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { first: trimmed || "Guest", last: "Guest" };
  return { first: trimmed.slice(0, spaceIndex), last: trimmed.slice(spaceIndex + 1) };
}

function generateTxRef() {
  // "amba-" prefix makes these easy to recognize in a Chapa dashboard
  // alongside transactions from other properties on the same account.
  return "amba-" + crypto.randomUUID();
}

async function handleCheckout(request, env) {
  if (!env.CHAPA_SECRET_KEY) {
    return json(
      {
        error:
          "Payments aren't configured on this deployment yet — CHAPA_SECRET_KEY hasn't been set. See DEPLOYMENT.md."
      },
      501
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return badRequest("Request body must be JSON.");
  }

  const gateway = body.gateway === "telebirr" ? "telebirr" : "chapa";

  if (gateway === "telebirr") {
    // Telebirr has no public self-serve API/sandbox — integrating it for
    // real requires a direct merchant agreement with Ethio Telecom. Rather
    // than fake a working flow, this is an honest, clearly-labeled stub
    // (the radio button in booking.html is also disabled for the same
    // reason). See PROJECT-NOTES.md.
    return json(
      {
        error:
          "Telebirr checkout isn't available yet — it requires a direct merchant agreement with Ethio Telecom that hasn't been set up. Please choose Chapa, which supports Telebirr's mobile money alongside cards and bank transfer."
      },
      501
    );
  }

  const room = ROOMS[body.room];
  if (!room) return badRequest("Select a valid room.");
  if (!isValidDateString(body.checkin) || !isValidDateString(body.checkout)) {
    return badRequest("Select valid check-in and check-out dates.");
  }

  const nights = nightsBetween(body.checkin, body.checkout);
  if (nights < 1) return badRequest("Check-out must be after check-in.");

  const roomsCount = Math.max(1, Math.min(10, parseInt(body.rooms, 10) || 1));
  const amount = room.rate * roomsCount * nights;

  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  if (!email || !phone || !body.name) {
    return badRequest("Name, email, and phone are required.");
  }

  const { first, last } = splitName(body.name);
  const txRef = generateTxRef();
  const origin = new URL(request.url).origin;

  const reservation = {
    txRef: txRef,
    status: "pending",
    gateway: "chapa",
    room: body.room,
    roomName: room.name,
    checkin: body.checkin,
    checkout: body.checkout,
    nights: nights,
    rooms: roomsCount,
    adults: parseInt(body.adults, 10) || 2,
    children: parseInt(body.children, 10) || 0,
    promo: (body.promo || "").trim() || null,
    guest: { name: body.name.trim(), email: email, phone: phone, country: (body.country || "").trim() || null },
    requests: (body.requests || "").trim() || null,
    currency: "ETB",
    amount: amount,
    createdAt: new Date().toISOString()
  };

  try {
    const chapaSession = await initializeChapaTransaction(env.CHAPA_SECRET_KEY, {
      amount: String(amount),
      currency: "ETB",
      email: email,
      first_name: first,
      last_name: last,
      phone_number: phone,
      tx_ref: txRef,
      callback_url: origin + "/api/webhook/chapa",
      return_url: origin + "/booking-confirmation.html?tx_ref=" + encodeURIComponent(txRef),
      customization: {
        title: "The Amba Addis",
        description: room.name + " · " + nights + " night" + (nights === 1 ? "" : "s")
      }
    });

    reservation.checkoutUrl = chapaSession.checkout_url;
    await saveReservation(env.RESERVATIONS, txRef, reservation);

    return json({ checkout_url: chapaSession.checkout_url, tx_ref: txRef });
  } catch (err) {
    return json({ error: "Chapa couldn't start checkout: " + err.message }, 502);
  }
}

async function handleVerify(request, env) {
  const txRef = new URL(request.url).searchParams.get("tx_ref");
  if (!txRef) return badRequest("Missing tx_ref.");

  const reservation = await getReservation(env.RESERVATIONS, txRef);
  if (!reservation) return json({ error: "No reservation found for that reference." }, 404);

  if (!env.CHAPA_SECRET_KEY) {
    return json({ reservation: reservation, note: "CHAPA_SECRET_KEY not set — returning stored status only." });
  }

  try {
    const result = await verifyChapaTransaction(env.CHAPA_SECRET_KEY, txRef);
    const chapaStatus = result && result.data && result.data.status; // e.g. "success", "failed"
    const status = chapaStatus === "success" ? "confirmed" : chapaStatus === "failed" ? "failed" : "pending";
    const updated = await updateReservationStatus(env.RESERVATIONS, txRef, status, {
      chapaStatus: chapaStatus || null
    });
    return json({ reservation: updated });
  } catch (err) {
    // Verification failing doesn't necessarily mean payment failed — it
    // may just mean Chapa is unreachable right now. Return what we have
    // rather than claiming a definite failure.
    return json({ reservation: reservation, note: "Could not reach Chapa to confirm status: " + err.message });
  }
}

async function handleWebhook(request, env) {
  // Chapa's server-to-server callback on payment completion. Treat this
  // as a hint to re-verify, not as proof by itself — always confirm via
  // verifyChapaTransaction before trusting a status change, same as
  // handleVerify does. Chapa's webhook payload includes tx_ref; see
  // https://developer.chapa.co/docs/webhooks for the current payload
  // shape and signature header, which is worth reconfirming before relying
  // on this in production (see the provenance note in chapa.js).
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return json({ error: "Invalid webhook payload." }, 400);
  }

  const txRef = body.tx_ref;
  if (!txRef || !env.CHAPA_SECRET_KEY) return json({ received: true });

  try {
    const result = await verifyChapaTransaction(env.CHAPA_SECRET_KEY, txRef);
    const chapaStatus = result && result.data && result.data.status;
    const status = chapaStatus === "success" ? "confirmed" : chapaStatus === "failed" ? "failed" : "pending";
    await updateReservationStatus(env.RESERVATIONS, txRef, status, { chapaStatus: chapaStatus || null });
  } catch (err) {
    // Swallow — Chapa will retry webhooks, and the guest's own return_url
    // visit also triggers a verify via handleVerify as a second path.
  }

  return json({ received: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/checkout" && request.method === "POST") {
      return handleCheckout(request, env);
    }
    if (url.pathname === "/api/verify" && request.method === "GET") {
      return handleVerify(request, env);
    }
    if (url.pathname === "/api/webhook/chapa" && request.method === "POST") {
      return handleWebhook(request, env);
    }
    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found." }, 404);
    }

    // Everything else is the static site.
    return env.ASSETS.fetch(request);
  }
};
