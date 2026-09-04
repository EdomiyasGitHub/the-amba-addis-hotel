/**
 * The Amba Addis — main.js
 * ---------------------------------------------------------------------
 * Intentionally minimal, and deliberately not the home of every
 * interaction on the site. The mobile navigation toggle and both
 * accordions are handled by Bootstrap's bundled JS which is
 * loaded before this file via plain data-bs-* attributes in the HTML.
 * 
 * Everything else on this site (carousels, dropdowns, responsive
 * layout) is handled with CSS . See README.md for the reasoning.
 * ---------------------------------------------------------------------
 */
(function () {
  "use strict";


  /* 1. Booking date guardrails ----------------------------------------- */
  var checkinInputs = document.querySelectorAll('input[data-role="check-in"]');

  checkinInputs.forEach(function (checkin) {
    var form = checkin.closest("form");
    if (!form) return;
    var checkout = form.querySelector('input[data-role="check-out"]');
    if (!checkout) return;

    var today = new Date();
    var toISODate = function (date) {
      return date.toISOString().split("T")[0];
    };

    var todayISO = toISODate(today);
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!checkin.value) checkin.min = todayISO;
    if (!checkout.value) checkout.min = toISODate(tomorrow);

    checkin.addEventListener("change", function () {
      if (!checkin.value) return;
      var nextDay = new Date(checkin.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkout.min = toISODate(nextDay);
      if (checkout.value && checkout.value <= checkin.value) {
        checkout.value = toISODate(nextDay);
      }
    });
  });


  /* 2. Booking page — URL prefill + live order summary (booking.html only) */
  var bookingForm = document.querySelector("[data-booking-form]");

  if (bookingForm) {
    try {
      var params = new URLSearchParams(window.location.search);
      var prefillMap = {
        room: "bk-room",
        checkin: "bk-checkin",
        checkout: "bk-checkout",
        adults: "bk-adults",
        children: "bk-children",
        rooms: "bk-rooms"
      };
      Object.keys(prefillMap).forEach(function (key) {
        var value = params.get(key);
        var field = document.getElementById(prefillMap[key]);
        if (value && field) field.value = value;
      });
    } catch (e) {
      /* URLSearchParams unsupported or malformed query string — form still
         works with its own defaults, so fail silently. */
    }

    var roomSelect = document.getElementById("bk-room");
    var bkCheckin = document.getElementById("bk-checkin");
    var bkCheckout = document.getElementById("bk-checkout");
    var roomsCount = document.getElementById("bk-rooms");

    var formatETB = function (amount) {
      return "ETB " + amount.toLocaleString("en-US");
    };

    var updateBookingSummary = function () {
      if (!roomSelect) return;
      var selected = roomSelect.options[roomSelect.selectedIndex];
      var nightlyRate = selected ? Number(selected.getAttribute("data-price")) || 0 : 0;
      var numRooms = roomsCount ? Number(roomsCount.value) || 1 : 1;

      var nights = 0;
      if (bkCheckin && bkCheckout && bkCheckin.value && bkCheckout.value) {
        var msPerDay = 1000 * 60 * 60 * 24;
        var diff = Math.round((new Date(bkCheckout.value) - new Date(bkCheckin.value)) / msPerDay);
        if (diff > 0) nights = diff;
      }

      var subtotal = nightlyRate * numRooms * nights;

      var roomOut = document.querySelector("[data-summary-room]");
      var datesOut = document.querySelector("[data-summary-dates]");
      var nightsOut = document.querySelector("[data-summary-nights]");
      var rateOut = document.querySelector("[data-summary-rate]");
      var subtotalOut = document.querySelector("[data-summary-subtotal]");
      var totalOut = document.querySelector("[data-summary-total]");

      if (roomOut && selected) roomOut.textContent = selected.text.split(" — ")[0];
      if (rateOut) rateOut.textContent = nightlyRate ? formatETB(nightlyRate) + " / night" : "—";
      if (datesOut) {
        var inText = bkCheckin && bkCheckin.value ? bkCheckin.value : "Select dates";
        var outText = bkCheckout && bkCheckout.value ? bkCheckout.value : "";
        datesOut.textContent = outText ? inText + " → " + outText : inText;
      }
      if (nightsOut) nightsOut.textContent = nights ? nights + (nights === 1 ? " night" : " nights") : "—";
      if (subtotalOut) subtotalOut.textContent = nights ? formatETB(subtotal) : "—";
      if (totalOut) totalOut.textContent = nights ? formatETB(subtotal) + " (excl. taxes & fees)" : "Select dates to estimate";
    };

    [roomSelect, bkCheckin, bkCheckout, roomsCount].forEach(function (field) {
      if (field) field.addEventListener("change", updateBookingSummary);
    });

    updateBookingSummary();
  }


  /* 3. Demo form submission handling ------------------------------------
     Every form on this site with action="#" is a frontend-only demonstration. 
     Submitting one of these forms sends a real HTTP POST to the current page's URL, so 
     on any static host that request has nowhere to go and comes back as a 405. 
     This intercepts the submit, runs the form's own HTML
     validation, and once valid, shows an inline confirmation message in place of
     the browser attempting a real request. */
  var demoForms = document.querySelectorAll('form[action="#"]');
  var defaultSuccessMessage =
    "Thanks — this is a demo, so nothing was actually sent, but in production this submission would go through here.";

  demoForms.forEach(function (form) {
    var success = document.createElement("p");
    success.className = "form-success";
    success.setAttribute("role", "status");
    success.hidden = true;
    success.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
    form.insertAdjacentElement("afterend", success);
    success.querySelector("span").textContent =
      form.getAttribute("data-success-message") || defaultSuccessMessage;

    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : "";

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      success.hidden = true;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";
      }

      window.setTimeout(function () {
        form.reset();
        // The booking page's order summary reads these same
        // fields but only recalculates on "change". A form.reset() fires
        // no such event, so nudge it manually or the summary goes stale.
        if (form === bookingForm && typeof updateBookingSummary === "function") {
          updateBookingSummary();
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        }
        success.hidden = false;
      }, 500);
    });
  });

  /* 4. Live checkout — booking.html's #reservation-form only -----------
     This form has a real backend, so it is handled separately from section 3's generic 
     logic. The flow the Worker creates a reservation record and asks Chapa to start a hosted
     checkout session */
  var reservationForm = document.getElementById("reservation-form");

  if (reservationForm) {
    var checkoutStatus = document.getElementById("checkout-status");
    var checkoutError = document.getElementById("checkout-error");
    var checkoutErrorText = checkoutError ? checkoutError.querySelector("span") : null;
    var checkoutSubmitBtn = reservationForm.querySelector('[type="submit"]');
    var checkoutSubmitLabel = checkoutSubmitBtn ? checkoutSubmitBtn.textContent : "";

    var showCheckoutError = function (message) {
      if (checkoutErrorText) checkoutErrorText.textContent = message;
      if (checkoutError) checkoutError.hidden = false;
    };

    var setCheckoutBusy = function (busy) {
      if (checkoutSubmitBtn) {
        checkoutSubmitBtn.disabled = busy;
        checkoutSubmitBtn.textContent = busy ? "Redirecting to secure checkout…" : checkoutSubmitLabel;
      }
      if (checkoutStatus) {
        checkoutStatus.innerHTML = busy
          ? "Contacting Chapa's secure checkout…"
          : "Secured by Chapa.<br><strong>You won't be charged until you complete checkout.</strong>";
      }
    };

    reservationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (checkoutError) checkoutError.hidden = true;

      if (!reservationForm.checkValidity()) {
        reservationForm.reportValidity();
        return;
      }

      var gatewayField = reservationForm.querySelector('input[name="gateway"]:checked');
      var fieldValue = function (id) {
        var field = document.getElementById(id);
        return field ? field.value : "";
      };

      var payload = {
        room: fieldValue("bk-room"),
        checkin: fieldValue("bk-checkin"),
        checkout: fieldValue("bk-checkout"),
        rooms: fieldValue("bk-rooms"),
        adults: fieldValue("bk-adults"),
        children: fieldValue("bk-children"),
        promo: fieldValue("bk-promo"),
        name: fieldValue("bk-name"),
        email: fieldValue("bk-email"),
        phone: fieldValue("bk-phone"),
        country: fieldValue("bk-country"),
        requests: fieldValue("bk-requests"),
        gateway: gatewayField ? gatewayField.value : "chapa"
      };

      setCheckoutBusy(true);

      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response
            .json()
            .catch(function () {
              return {};
            })
            .then(function (data) {
              return { ok: response.ok, status: response.status, data: data };
            });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.checkout_url) {
            window.location.href = result.data.checkout_url;
            return;
          }

          setCheckoutBusy(false);
          var message =
            (result.data && result.data.error) ||
            (result.status === 404
              ? "The reservation service isn't available from this preview — it only runs once this site is deployed to Cloudflare Workers. See DEPLOYMENT.md."
              : "Something went wrong starting checkout. Please try again, or contact us directly to complete your booking.");
          showCheckoutError(message);
        })
        .catch(function () {
          setCheckoutBusy(false);
          showCheckoutError(
            "Couldn't reach the reservation service — this preview may not be running behind the Cloudflare Worker yet (see DEPLOYMENT.md), or you may be offline. Please try again, or contact us directly to complete your booking."
          );
        });
    });
  }
})();
