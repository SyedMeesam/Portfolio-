// Navigation. The menu is only rendered below 800px, so this is guarded for
// safety (for example, if the markup is ever reused on a page without it).
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
if (menuButton && menu) {
  const closeMenu = () => {
    menu.classList.remove('open');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  };
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  // The mobile menu is anchored under the header, so close it on scroll.
  window.addEventListener('scroll', () => {
    if (scrollY > 0 && menu.classList.contains('open')) closeMenu();
  }, { passive: true });
  // Escape closes the menu and returns focus to the toggle.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      menuButton.focus();
    }
  });
}

// Reveal-on-scroll. Content is fully usable without it: the rules that hide
// .reveal only apply once the js class is present, and anything already in the
// viewport is shown immediately.
const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -2% 0px' });
  revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('visible'));
}

// React Bits components progressively enhance existing, usable HTML.
import('./reactbits-islands.jsx').then(({ mountReactBits }) => mountReactBits()).catch(error => {
  console.warn('React Bits enhancements unavailable.', error);
});

// Progressively enhance the Mark X Media portfolio filters.
// Without JavaScript every project stays visible; the controls simply show up
// as inert, hidden fallbacks so no card is ever lost behind a filter.
const caseToolbar = document.querySelector('.case-toolbar[data-progressive]');
const caseCards = Array.from(document.querySelectorAll('.case-card'));
const caseMore = document.querySelector('.case-more');
const caseCount = document.querySelector('.case-count');
if (caseToolbar && caseCards.length && caseMore && caseCount) {
  const pageSize = 9;
  const filters = Array.from(caseToolbar.querySelectorAll('[data-filter]'));
  let filter = 'all';
  let visibleCount = pageSize;
  const categoriesOf = card => (card.dataset.categories || '').split(/\s+/).filter(Boolean);
  const updateCases = () => {
    const matches = caseCards.filter(card => filter === 'all' || categoriesOf(card).includes(filter));
    const shown = new Set(matches.slice(0, visibleCount));
    caseCards.forEach(card => { card.hidden = !shown.has(card); });
    const remaining = Math.max(matches.length - visibleCount, 0);
    caseMore.hidden = remaining === 0;
    caseMore.innerHTML = remaining
      ? `SHOW ${Math.min(pageSize, remaining)} MORE PROJECTS <span>↓</span>`
      : 'ALL PROJECTS SHOWN';
    caseCount.textContent = `${Math.min(visibleCount, matches.length)} / ${matches.length} PROJECTS`;
  };
  caseToolbar.hidden = false;
  filters.forEach(button => {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      visibleCount = pageSize;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      updateCases();
    });
  });
  caseMore.addEventListener('click', () => { visibleCount += pageSize; updateCases(); });
  // Render the initial state now; the markup ships every card visible.
  updateCases();
}

// Keep case-study links usable if the original site's image is unavailable.
document.querySelectorAll('.case-image img').forEach(image => {
  const showFallback = () => {
    if (image.dataset.failed) return;
    image.dataset.failed = 'true';
    image.hidden = true;
    const fallback = document.createElement('span');
    fallback.className = 'case-image-fallback';
    fallback.textContent = 'IMAGE UNAVAILABLE — VIEW ORIGINAL CASE STUDY ↗';
    image.parentElement.append(fallback);
  };
  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});

// Interface sound (React Bits Sound Lab recipes). Loaded on idle so it never
// competes with the hero, and silent until the header switch is turned on.
const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1800));
idle(() => {
  import('./src/sound/sound.js')
    .then(({ initSound }) => initSound())
    .catch(error => console.warn('Interface sound unavailable.', error));
});
