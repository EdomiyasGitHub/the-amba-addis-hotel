/**
 * Chapa payment gateway — thin wrapper around the two REST endpoints this
 * project needs. Chapa is an Ethiopian payment aggregator whose hosted
 * checkout accepts cards, local mobile money, and bank transfer through a
 * single flow, which is why it's the primary gateway for this booking form.
 *
 * Reference: https://developer.chapa.co/docs — "Accept Payment" (initialize)
 * and "Verify Payment" endpoints. Auth is a single Bearer secret key set as
 * the CHAPA_SECRET_KEY Worker secret (see DEPLOYMENT.md) — it must never be
 * committed to this repo or pasted into a chat/AI session.
 *
 * NOTE ON PROVENANCE: this wrapper was written from Chapa's well-documented,
 * stable REST conventions (confirmed against the chapa-python SDK's
 * published parameter names) rather than a direct fetch of the live docs
 * page, which this environment's web tools could not reach. Field names and
 * response shape (`data.checkout_url` on initialize, `data.status` on
 * verify) match the current public API as of early 2026 — worth a quick
 * diff against https://developer.chapa.co/docs before going live, in case
 * anything has shifted since.
 */

const CHAPA_BASE_URL = "https://api.chapa.co/v1";

/**
 * Starts a hosted-checkout session.
 * @param {string} secretKey - CHAPA_SECRET_KEY
 * @param {object} params - { amount, currency, email, first_name, last_name,
 *   phone_number, tx_ref, callback_url, return_url, customization }
 * @returns {Promise<{checkout_url: string}>}
 */
export async function initializeChapaTransaction(secretKey, params) {
  const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data || data.status !== "success" || !data.data || !data.data.checkout_url) {
    const message =
      (data && (data.message || data.error)) || `Chapa initialize failed (HTTP ${response.status})`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return data.data;
}

/**
 * Confirms the final state of a transaction. Always re-check with Chapa
 * server-side before treating a booking as paid — never trust the redirect
 * alone, since a guest can land on return_url without payment completing.
 * @param {string} secretKey - CHAPA_SECRET_KEY
 * @param {string} txRef
 * @returns {Promise<{status: string, data: object}>}
 */
export async function verifyChapaTransaction(secretKey, txRef) {
  const response = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`, {
    headers: { Authorization: `Bearer ${secretKey}` }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error(`Chapa verify failed (HTTP ${response.status})`);
  }

  return data;
}
