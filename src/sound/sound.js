// Interface sound, built on React Bits' Sound Lab engine.
// Recipes are synthesised in the browser (no audio downloads). Sound is off
// until someone turns it on, and the choice is remembered.
import { playSound, preloadSound, setSoundMuted, setSoundVolume } from './react-bits-sound.js';
import hover from './recipes/hover.js';
import pebble from './recipes/pebble.js';
import appear from './recipes/appear.js';
import unfold from './recipes/unfold.js';
import dock from './recipes/dock.js';
import chime from './recipes/chime.js';

const CUES = { hover, pebble, appear, unfold, dock, chime };
const STORAGE_KEY = 'mk-sound';
const HOVER_GAP = 110;

let allowed = false;
let lastHover = 0;
let hovered = new WeakSet();
let toggle;

const stored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const remember = value => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode: the choice just will not persist */
  }
};

export function play(cue, tune) {
  if (!allowed || !CUES[cue]) return;
  playSound(CUES[cue], tune).catch(() => void 0);
}

function announce(on) {
  if (!toggle) return;
  toggle.setAttribute('aria-pressed', String(on));
  toggle.dataset.state = on ? 'on' : 'off';
  const label = toggle.querySelector('.sound-label');
  if (label) label.textContent = on ? 'SOUND ON' : 'SOUND OFF';
  toggle.setAttribute('aria-label', on ? 'Turn interface sound off' : 'Turn interface sound on');
}

function enable() {
  allowed = true;
  setSoundVolume(0.55);
  setSoundMuted(false);
  remember('on');
  announce(true);
  Object.values(CUES).forEach(recipe => preloadSound(recipe));
  play('chime');
}

function disable() {
  allowed = false;
  setSoundMuted(true);
  remember('off');
  announce(false);
}

export function initSound() {
  toggle = document.querySelector('.sound-toggle');
  setSoundVolume(0.55);
  setSoundMuted(!allowed);
  announce(allowed);
  if (!toggle) return;
  toggle.hidden = false;
  toggle.addEventListener('click', () => (allowed ? disable() : enable()));

  // One delegated listener keeps the wiring small and survives React islands.
  document.addEventListener('pointerover', event => {
    const target = event.target.closest('a, button, summary, .case-card, .service-list details');
    if (!target || target.closest('.sound-toggle')) return;
    if (hovered.has(target)) return;
    hovered.add(target);
    const now = performance.now();
    if (now - lastHover < HOVER_GAP) return;
    lastHover = now;
    play('hover', { volume: -6 });
  });

  // Only forget a target when the pointer truly leaves it, not when it moves
  // between children, otherwise a single hover would retrigger.
  document.addEventListener('pointerout', event => {
    const target = event.target.closest('a, button, summary, .case-card');
    if (!target) return;
    if (event.relatedTarget && target.contains(event.relatedTarget)) return;
    hovered.delete(target);
  });

  document.addEventListener('click', event => {
    if (!allowed) return;
    const target = event.target.closest('a, button, summary');
    if (!target || target.closest('.sound-toggle')) return;
    if (target.matches('.case-more')) return play('unfold');
    if (target.matches('.case-filters button')) return play('pebble');
    if (target.closest('summary')) return play('appear');
    const link = target.closest('a');
    if (link && /^https?:/i.test(link.getAttribute('href') || '') && link.target === '_blank') return play('chime');
  }, true);
}

// Remembered preference is applied once the module loads.
if (stored() === 'on') {
  allowed = true;
  setSoundMuted(false);
  // The audio context still needs a gesture, so arm it on the first one.
  // Browsers only allow audio after a gesture; arm quietly on the first one.
  const arm = () => {
    setSoundVolume(0.55);
    window.removeEventListener('pointerdown', arm);
    window.removeEventListener('keydown', arm);
  };
  window.addEventListener('pointerdown', arm, { once: true });
  window.addEventListener('keydown', arm, { once: true });
}
