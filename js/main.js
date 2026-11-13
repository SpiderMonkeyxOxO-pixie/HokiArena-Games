// Hoki Arena — shared front-end behaviour (nav, filters, form, year)

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Game directory: category filter + search, combined */
  var pills = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
  var searchInput = document.getElementById('game-search');
  var noResults = document.getElementById('no-results');
  var activeCategory = 'all';

  function applyFilters() {
    var query = (searchInput && searchInput.value || '').trim().toLowerCase();
    var visibleCount = 0;
    cards.forEach(function (card) {
      var matchesCategory = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
      var text = (card.textContent || '').toLowerCase();
      var matchesSearch = query === '' || text.indexOf(query) !== -1;
      var show = matchesCategory && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) { visibleCount++; }
    });
    if (noResults) { noResults.classList.toggle('is-visible', visibleCount === 0); }
  }

  if (pills.length && cards.length) {
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        activeCategory = pill.getAttribute('data-filter');
        applyFilters();
      });
    });
  }
  if (searchInput && cards.length) {
    searchInput.addEventListener('input', applyFilters);
  }

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* Contact form confirmation (static site, no backend) */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function () {
      var note = document.getElementById('form-status');
      if (note) {
        note.textContent = 'Opening your email app to send this message to our team…';
        note.style.color = 'var(--accent-2)';
      }
    });
  }

  /* GA4 click tracking: "Visit Listing" buttons (article CTA + game-grid cards) */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-visit');
    if (!btn || typeof gtag !== 'function') { return; }

    var card = btn.closest('.game-card');
    var article = btn.closest('.article');
    var titleEl = card ? card.querySelector('h3') : (article ? article.querySelector('h1') : null);
    var isExternalLink = btn.tagName === 'A' && btn.target === '_blank';

    gtag('event', 'visit_listing_click', {
      game_name: titleEl ? titleEl.textContent.trim() : document.title,
      link_type: isExternalLink ? 'external' : 'card',
      destination: isExternalLink ? btn.href : (card ? card.href : '')
    });
  });
});
