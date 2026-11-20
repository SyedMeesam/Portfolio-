import { createRoot } from 'react-dom/client';
import { createRef } from 'react';
import GradientText from './src/reactbits/GradientText.jsx';
import Magnet from './src/reactbits/Magnet.jsx';
import CountUp from './src/reactbits/CountUp.jsx';
import ClickSpark from './src/reactbits/ClickSpark.jsx';
import ShinyText from './src/reactbits/ShinyText.jsx';
import StarBorder from './src/reactbits/StarBorder.jsx';
import SpotlightCard from './src/reactbits/SpotlightCard.jsx';
import BlurText from './src/reactbits/BlurText.jsx';

// Renders the ReactBits spotlight shell and adopts the already-existing <article>
// so no card markup is duplicated or re-created by React.
function CaseSpotlight({ card }) {
  const slot = node => {
    if (node && card && card.parentNode !== node) node.appendChild(card);
  };
  return (
    <SpotlightCard
      spotlightColor="#FFE873"
      intensity={0.11}
      spotlightSize={260}
      borderGlow={0.16}
      proximity={90}
      smoothing={0.22}
      flare={false}
      className="case-card-wrap"
    >
      <div ref={slot} className="case-card-slot" />
    </SpotlightCard>
  );
}

export function mountReactBits() {
  const headline = document.querySelector('#gradient-headline');
  if (headline) {
    createRoot(headline).render(
      <GradientText colors={['#FFE873', '#FFFFFF', '#119cff', '#FFE873']} animationSpeed={7}>
        UNMISSABLE
      </GradientText>
    );
  }

  const header = document.querySelector('#magnet-header');
  if (header) {
    createRoot(header).render(
      <Magnet padding={55} magnetStrength={6} maxOffset={12}>
        <StarBorder
          as="a"
          href="https://calendly.com/syedmeesam/meeting"
          target="_blank"
          rel="noopener noreferrer"
          className="header-cta star-border-cta"
          color="#FFE873"
          trailColor="#FFFFFF"
          backgroundColor="rgba(10,102,194,0)"
          textColor="#FFFFFF"
          borderColor="rgba(255,232,115,.55)"
          radius={50}
          thickness={1}
          duration={6}
          trailLength={0.28}
          glow={0.4}
          hover="lap"
        >
          FREE MEETING CONSULTATION <span>↗</span>
        </StarBorder>
      </Magnet>
    );
  }

  // A soft aqua spark on every click. The layer is a click-through overlay, so the
  // burst is driven from a document listener instead of the layer's own hit area.
  const sparkRoot = document.querySelector('#click-spark-root');
  if (sparkRoot && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches !== true) {
    const sparkRef = createRef();
    createRoot(sparkRoot).render(
      <ClickSpark
        ref={sparkRef}
        sparkColor="#FFE873"
        sparkCount={9}
        sparkSize={13}
        sparkRadius={32}
        sparkWidth={2}
        duration={520}
        glow={0.35}
      />
    );
    window.addEventListener('pointerdown', event => {
      sparkRef.current?.spark(event.clientX, event.clientY);
    }, { passive: true });
  }

  // The section kickers get a slow travelling highlight, in palette colours.
  const shinyKicker = document.querySelector('.hero-eyebrow span:first-child');
  if (shinyKicker) {
    createRoot(shinyKicker).render(
      <ShinyText text={shinyKicker.textContent.trim()} color="#FFE873" shineColor="#FFFFFF" speed={2.4} spread={120} shineWidth={24} direction="left" />
    );
  }
  const contact = document.querySelector('#magnet-contact');
  if (contact) {
    createRoot(contact).render(
      <Magnet padding={70} magnetStrength={6} maxOffset={14}>
        <a href="https://calendly.com/syedmeesam/meeting" target="_blank" rel="noopener noreferrer" className="contact-button">
          FREE MEETING CONSULTATION <span>↗</span>
        </a>
      </Magnet>
    );
  }
  // Grainient shader backdrops, one per section. Each host keeps a layered CSS
  // gradient underneath, so the design holds up without WebGL2. Sections that
  // are far down the page only mount their shader as they come into view.
  const HERO_BACKDROP = { colors: ['#0A0A0A', '#0A0A0A', '#0a66c2', '#0a66c2', '#0A0A0A'], angle: 55, flow: 0.8, silk: 0.35, grainAmount: 0.08, speed: 0.3 };
  // Every host here is a live WebGL canvas, but only the ones in view actually
  // paint: Grainient stops its loop when it leaves the viewport or the tab is
  // hidden. The speeds are deliberately slow - a fast-moving field behind body
  // copy reads as jitter while scrolling, not as polish.
  const BACKDROPS = [
    ['#header-grainient', HERO_BACKDROP],
    ['#hero-grainient', HERO_BACKDROP],
    ['#impact-grainient', { colors: ['#0a66c2', '#119cff', '#0a66c2', '#119cff', '#0a66c2'], angle: 145, flow: 0.8, silk: 0.3, grainAmount: 0.06, speed: 0.28 }],
    ['#experience-grainient', { colors: ['#0A0A0A', '#0a66c2', '#0A0A0A', '#0a66c2', '#0A0A0A'], angle: 250, flow: 0.65, silk: 0.55, grainAmount: 0.05, speed: 0.22 }],
    ['#contact-grainient', { colors: ['#0A0A0A', '#0a66c2', '#0A0A0A', '#0A0A0A', '#0A0A0A'], angle: 200, flow: 0.6, silk: 0.5, grainAmount: 0.05, scale: 1.6, speed: 0.26 }]
  ];
  const mountBackdrop = async ([selector, props]) => {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      const { default: Grainient } = await import('./src/reactbits/Grainient.jsx');
      createRoot(host).render(
        <Grainient {...props} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
      );
    } catch (error) {
      // The static CSS gradient remains visible.
      console.warn('Grainient backdrop unavailable.', error);
    }
  };
  BACKDROPS.forEach((backdrop, index) => {
    const host = document.querySelector(backdrop[0]);
    if (!host) return;
    // The hero paints immediately; the rest wait until they are near the fold.
    if (index === 0 || !('IntersectionObserver' in window)) return void mountBackdrop(backdrop);
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      mountBackdrop(backdrop);
    }, { rootMargin: '250px' });
    observer.observe(host);
  });

  // Load the WebGL background only as the contact section approaches the viewport.
  const asciiHost = document.querySelector('#contact-ascii');
  if (asciiHost) {
    const loadAscii = async () => {
      try {
        const { default: GradientASCII } = await import('./src/reactbits/GradientASCII.jsx');
        createRoot(asciiHost).render(
          <GradientASCII
            colors={['#0a66c2', '#119cff', '#FFFFFF', '#119cff']}
            shape="horizon"
            characters=" =+xX0S8#@"
            cellSize={18}
            density={0.8}
            speed={0.55}
            glow={0.2}
            dpr={1.25}
          />
        );
      } catch (error) {
        // The CSS background and contact content remain usable without WebGL.
        console.warn('GradientASCII background unavailable.', error);
      }
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect();
          loadAscii();
        }
      }, { rootMargin: '300px' });
      observer.observe(asciiHost);
    } else {
      loadAscii();
    }
  }
  // Section headlines resolve word by word as they scroll in. The original <h2>
  // stays in the document for search engines and assistive tech; the animated
  // copy is an aria-hidden sibling that replaces it visually.
  document.querySelectorAll('h2[data-blur]').forEach(heading => {
    const text = heading.dataset.blur;
    if (!text) return;
    const shell = document.createElement('span');
    shell.className = 'reveal-words-shell';
    shell.setAttribute('aria-hidden', 'true');
    heading.parentNode.insertBefore(shell, heading.nextSibling);
    heading.classList.add('reveal-words-source');
    createRoot(shell).render(
      <BlurText
        text={text}
        animateBy="words"
        direction="top"
        effect="blur"
        blur={9}
        distance={26}
        stepDuration={0.42}
        delay={55}
        easing="easeOut"
        className="reveal-words-text"
      />
    );
  });

  // A cursor-following aqua spotlight on the case-study cards. Each card is moved
  // into a decorative SpotlightCard shell; the <article> and its links stay as-is.
  document.querySelectorAll('.case-grid .case-card').forEach(card => {
    const host = document.createElement('div');
    host.className = 'case-card-spotlight';
    // Insert the empty shell first; the ref callback then moves the real <article>
    // inside it, after React has finished mounting into the shell.
    card.parentNode.insertBefore(host, card);
    createRoot(host).render(<CaseSpotlight card={card} />);
  });

  // Counters animate the real figures already in the markup. They are mounted only
  // once the figure is close to the viewport, and the original text stays in the
  // DOM until then, so a number is never missing or stuck at zero.
  const mountCounters = element => {
    if (element.dataset.counted) return;
    element.dataset.counted = 'true';
    const { to, prefix = '', suffix = '', decimals } = element.dataset;
    if (!to) return;
    createRoot(element).render(
      <CountUp
        to={Number(to)}
        from={0}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals === undefined ? undefined : Number(decimals)}
        duration={1.8}
        trigger="load"
      />
    );
  };
  const counters = document.querySelectorAll('.count-up, .impact-figure');
  counters.forEach(element => {
    if (!('IntersectionObserver' in window)) return void mountCounters(element);
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      mountCounters(element);
    }, { rootMargin: '150px' });
    observer.observe(element);
  });
}
