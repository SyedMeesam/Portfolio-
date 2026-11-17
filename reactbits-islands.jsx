import { createRoot } from 'react-dom/client';
import GradientText from './src/reactbits/GradientText.jsx';
import Magnet from './src/reactbits/Magnet.jsx';
import CountUp from './src/reactbits/CountUp.jsx';

export function mountReactBits() {
  const headline = document.querySelector('#gradient-headline');
  if (headline) {
    createRoot(headline).render(
      <GradientText colors={['#97f8f4', '#FFFFFF', '#119cff', '#97f8f4']} animationSpeed={7}>
        UNMISSABLE
      </GradientText>
    );
  }

  const header = document.querySelector('#magnet-header');
  if (header) {
    createRoot(header).render(
      <Magnet padding={55} magnetStrength={6} maxOffset={12}>
        <a className="header-cta" href="https://calendly.com/syedmeesam/meeting" target="_blank" rel="noopener noreferrer">FREE MEETING CONSULTATION <span>↗</span></a>
      </Magnet>
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
  const BACKDROPS = [
    ['#hero-grainient', { colors: ['#97f8f4', '#97f8f4', '#119cff', '#119cff', '#0a66c2'], angle: 55, flow: 0.8, silk: 0.35, grainAmount: 0.08 }],
    ['#impact-grainient', { colors: ['#0a66c2', '#119cff', '#97f8f4', '#119cff', '#0a66c2'], angle: 145, flow: 0.8, silk: 0.3, grainAmount: 0.06, speed: 0.6 }],
    ['#experience-grainient', { colors: ['#97f8f4', '#119cff', '#0a66c2', '#119cff', '#97f8f4'], angle: 250, flow: 0.65, silk: 0.55, grainAmount: 0.05, speed: 0.5 }],
    ['#contact-grainient', { colors: ['#0a66c2', '#119cff', '#0a66c2', '#97f8f4', '#119cff'], angle: 200, flow: 0.6, silk: 0.5, grainAmount: 0.05, scale: 1.6, speed: 0.55 }]
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
            colors={['#0a66c2', '#119cff', '#97f8f4', '#119cff']}
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
  document.querySelectorAll('.count-up').forEach(element => {
    createRoot(element).render(
      <CountUp to={Number(element.dataset.to)} prefix={element.dataset.prefix || ''} suffix={element.dataset.suffix || ''} duration={1.8} />
    );
  });
}
