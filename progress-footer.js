/* progress-footer.js — shared Progress & Changelog + visitor counter.
 * DRY single source of truth (mirrors geo-redirect.js pattern).
 * Usage: put <div id="progressSlot" data-badge="#hex" data-label="#hex"></div>
 * before </main> (or anywhere in flow), then <script src="progress-footer.js"></script>.
 * The script injects the changelog + hits.sh visitor badge into that slot.
 */
(function () {
  'use strict';

  // Single source of truth — edit dates here, reflected on every page.
  var CHANGELOG = [
    { date: '2026-07-12', text: 'Added the Progress & Changelog section and a consolidated visitor counter across all pages.' },
    { date: '2026-06-30', text: 'Launched the 12-country plan comparison table — Singapore, Malaysia, Indonesia, Thailand, Vietnam, Philippines, Hong Kong, China, Japan, US, India.' },
    { date: '2026-06-28', text: 'Shipped the offline Smart Plan Matcher — privacy-first, no sign-up, all scoring in your browser.' },
    { date: '2026-06-14', text: 'Site foundation, brand system, and the weekly-updated plan pipeline in place.' }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render(slot) {
    var badge = (slot.getAttribute('data-badge') || '1b3322').replace('#', '');
    var label = (slot.getAttribute('data-label') || 'fdfbf7').replace('#', '');
    var items = CHANGELOG.map(function (c) {
      return '<li><span class="mpp-date">' + esc(c.date) + '</span>' + esc(c.text) + '</li>';
    }).join('');

    slot.className = 'mpp-progress';
    slot.setAttribute('aria-label', 'Progress and changelog');
    slot.innerHTML =
      '<div class="mpp-progress-rule"></div>' +
      '<div class="mpp-progress-grid">' +
        '<div class="mpp-changelog">' +
          '<p class="mpp-eyebrow">Progress · Changelog</p>' +
          '<h2 class="mpp-h2">What we’ve shipped</h2>' +
          '<ol class="mpp-log">' + items + '</ol>' +
          '<p class="mpp-more"><a href="changelog.html">View full changelog →</a></p>' +
        '</div>' +
        '<aside class="mpp-visitors">' +
          '<p class="mpp-eyebrow">Visitors</p>' +
          '<h2 class="mpp-h2">Consolidated reach</h2>' +
          '<div class="mpp-count"><a href="https://hits.sh/mobilepriceplan.com/" target="_blank" rel="noopener" aria-label="Visitor count">' +
            '<img class="mpp-badge" alt="Total visitors" src="https://hits.sh/mobilepriceplan.com.svg?style=flat-round&amp;label=Visits&amp;color=' + badge + '&amp;labelColor=' + label + '">' +
          '</a></div>' +
          '<p class="mpp-note">Cookieless, privacy-respecting counting. Page analytics tracked with Plausible.</p>' +
        '</aside>' +
      '</div>';
  }

  function init() {
    var slot = document.getElementById('progressSlot');
    if (slot) render(slot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
