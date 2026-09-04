/**
 * Reservation persistence — Cloudflare Workers KV.
 *
 * Each reservation is stored as JSON under its tx_ref (the unique
 * transaction reference generated in index.js and passed through to
 * Chapa). KV is a deliberately simple choice for this project's scale — a
 * single boutique property's booking volume doesn't come close to
 * justifying a relational database. If this ever needs real queries (e.g.
 * "every reservation for the Highland Suite between two dates" for a
 * front-desk dashboard), that's the signal to migrate to D1 — the shape
 * of these records would translate directly into a `reservations` table.
 */

const RESERVATION_PREFIX = "reservation:";

export async function saveReservation(kv, txRef, reservation) {
  await kv.put(RESERVATION_PREFIX + txRef, JSON.stringify(reservation));
}

export async function getReservation(kv, txRef) {
  const raw = await kv.get(RESERVATION_PREFIX + txRef);
  return raw ? JSON.parse(raw) : null;
}

export async function updateReservationStatus(kv, txRef, status, extra) {
  const existing = await getReservation(kv, txRef);
  if (!existing) return null;
  const updated = Object.assign({}, existing, extra || {}, {
    status: status,
    updatedAt: new Date().toISOString()
  });
  await saveReservation(kv, txRef, updated);
  return updated;
}
