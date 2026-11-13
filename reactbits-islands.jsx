import { createRoot } from 'react-dom/client';
import GradientText from './src/reactbits/GradientText.jsx';
import Magnet from './src/reactbits/Magnet.jsx';
import CountUp from './src/reactbits/CountUp.jsx';

export function mountReactBits() {
  const headline = document.querySelector('#gradient-headline');
  if (headline) {
    createRoot(headline).render(
      <GradientText colors={['#8EF0F5', '#FFFFFF', '#139DFF', '#8EF0F5']} animationSpeed={7}>
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
  // Disable the decorative cursor for people who prefer reduced motion.
  const splashHost = document.querySelector('#splash-cursor-root');
  if (splashHost) {
    const root = createRoot(splashHost);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let request = 0;
    const updateSplash = async () => {
      const current = ++request;
      if (motion.matches) {
        root.render(null);
        return;
      }
      try {
        const { default: SplashCursor } = await import('./src/reactbits/SplashCursor.jsx');
        if (current !== request || motion.matches) return;
        root.render(
          <SplashCursor
            rainbow={false}
            size={1}
            force={1}
            swirl={3}
            trail={1}
            clickSplash
            colors={['#ffffff', '#3b82f6', '#06b6d4']}
            quality="medium"
          />
        );
      } catch (error) {
        console.warn('SplashCursor enhancement unavailable.', error);
      }
    };
    motion.addEventListener('change', updateSplash);
    updateSplash();
  }
  // Load the WebGL background only as the contact section approaches the viewport.
  const asciiHost = document.querySelector('#contact-ascii');
  if (asciiHost) {
    const loadAscii = async () => {
      try {
        const { default: GradientASCII } = await import('./src/reactbits/GradientASCII.jsx');
        createRoot(asciiHost).render(
          <GradientASCII
            colors={['#0A2540', '#0B6ABB', '#139DFF', '#8EF0F5']}
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
