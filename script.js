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
