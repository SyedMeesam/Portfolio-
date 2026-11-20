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
