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

// Hero heading rotator. The markup already shows the first word (with its
// full stop), so with JS off or reduced motion on, nothing moves.
const rotator = document.querySelector('.rotator');
if (rotator) {
  const words = Array.from(rotator.querySelectorAll('.rotator__word'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (words.length > 1 && !reduceMotion.matches) {
    let index = 0;
    let timer = null;

    const advance = () => {
      const current = words[index];
      index = (index + 1) % words.length;
      const next = words[index];

      // Clone the outgoing word so its exit transition can overlap the
      // incoming one instead of being cancelled by it.
      const ghost = current.cloneNode(true);
      ghost.classList.remove('is-active');
      ghost.classList.add('is-leaving');
      ghost.setAttribute('aria-hidden', 'true');
      rotator.append(ghost);
      current.classList.remove('is-active');

      const removeGhost = () => ghost.remove();
      ghost.addEventListener('transitionend', removeGhost, { once: true });
      window.setTimeout(removeGhost, 700);

      next.classList.add('is-active');
    };

    const start = () => { if (!timer) timer = window.setInterval(advance, 2600); };
    const stop = () => { window.clearInterval(timer); timer = null; };

    start();
    // Do not burn frames rotating words nobody is looking at.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (!reduceMotion.matches) start();
    });
    reduceMotion.addEventListener('change', event => {
      if (event.matches) {
        stop();
        rotator.querySelectorAll('.rotator__word.is-leaving').forEach(ghost => ghost.remove());
        words.forEach(word => word.classList.remove('is-active'));
        words[0].classList.add('is-active');
      } else start();
    });
  }
}
