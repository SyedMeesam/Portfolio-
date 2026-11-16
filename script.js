const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Load the decorative WebGL scene only when motion is welcome.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let disposeHeroAnimation;
let animationRequest = 0;
async function updateHeroAnimation() {
  const request = ++animationRequest;
  disposeHeroAnimation?.();
  disposeHeroAnimation = undefined;
  if (motionPreference.matches) return;
  try {
    const { createHeroAnimation } = await import('./hero-animation.js');
    if (request !== animationRequest || motionPreference.matches) return;
    disposeHeroAnimation = createHeroAnimation(document.querySelector('.hero'), document.querySelector('.hero-canvas'));
  } catch (error) {
    // The portrait and content remain available if WebGL is unavailable.
    console.warn('Decorative hero animation unavailable.', error);
  }
}
motionPreference.addEventListener('change', updateHeroAnimation);
updateHeroAnimation();

// React Bits components progressively enhance existing, usable HTML.
import('./reactbits-islands.jsx').then(({ mountReactBits }) => mountReactBits()).catch(error => {
  console.warn('React Bits enhancements unavailable.', error);
});

// Progressively enhance the Mark X Media portfolio filters.
const caseToolbar = document.querySelector('.case-toolbar');
const caseCards = Array.from(document.querySelectorAll('.case-card'));
const caseMore = document.querySelector('.case-more');
const caseCount = document.querySelector('.case-count');
if (caseToolbar && caseCards.length && caseMore && caseCount) {
  const pageSize = 9;
  let filter = 'all';
  let visibleCount = pageSize;
  const updateCases = () => {
    const matches = caseCards.filter(card => filter === 'all' || card.dataset.categories.split(' ').includes(filter));
    const shown = new Set(matches.slice(0, visibleCount));
    caseCards.forEach(card => { card.hidden = !shown.has(card); });
    caseMore.hidden = visibleCount >= matches.length;
    caseCount.textContent = `${Math.min(visibleCount, matches.length)} / ${matches.length} PROJECTS`;
  };
  caseToolbar.hidden = false;
  caseToolbar.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      visibleCount = pageSize;
      caseToolbar.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      updateCases();
    });
  });
  caseMore.addEventListener('click', () => { visibleCount += pageSize; updateCases(); });
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
