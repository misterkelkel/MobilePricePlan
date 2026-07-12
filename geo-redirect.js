/* geo-redirect.js — shared IP-based geo redirect for MobilePricePlan.com
 * Usage: include <script src="geo-redirect.js"></script> on every page.
 * Redirects visitors to their country plan page (e.g. sg.html) based on IP.
 * Country pages that should NOT redirect to themselves set data-geo-home="true".
 */
(function () {
  "use strict";

  var VALID = ["sg", "my", "id", "th", "vn", "ph", "hk", "cn", "jp", "us", "in"];
  var SUPPORTED = {};
  VALID.forEach(function (c) { SUPPORTED[c] = true; });

  // If this page is itself a country plan page, do not redirect away from it.
  var homeCode = (document.documentElement && document.documentElement.getAttribute("data-geo-home")) || "";

  function redirectTo(code) {
    if (homeCode === code) return; // already on the right country page
    window.location.assign(code + ".html");
  }

  try {
    fetch("https://ipwho.is/", { signal: AbortSignal.timeout(800) })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.country_code) {
          var code = String(data.country_code).toLowerCase();
          if (SUPPORTED[code]) {
            redirectTo(code);
          } else if (homeCode) {
            // stay on home country page (default already shown server-side)
          }
        }
      })
      .catch(function () { /* keep current page on error */ });
  } catch (e) {
    /* keep current page */
  }
})();
