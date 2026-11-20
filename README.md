# Meesam Kazmi — Portfolio

Personal site for Meesam Kazmi, digital growth strategist and CMO at Mark X Media.
A single-page portfolio built with plain HTML, CSS and ES modules, enhanced by
React Bits islands (Grainient backdrops, GradientText, Magnet, CountUp,
GradientASCII), interface sound from React Bits' Sound Lab, and a Three.js hero
scene.

Live: https://syedmeesam.github.io/Portfolio-/

## Develop

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the production build
```

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | All page content, metadata, structured data |
| `style.css` | Design system and layout |
| `script.js` | Menu, reveal-on-scroll, gallery filtering, progressive enhancement |
| `hero-animation.js` | Three.js hero, loaded only when motion is welcome |
| `reactbits-islands.jsx` | Mounts the React Bits components onto existing markup |
| `src/reactbits/` | Vendored React Bits components (see `NOTICE.md`) |
| `src/sound/` | Sound Lab engine + one recipe per interaction |
| `public/` | Images, favicon, `robots.txt`, `sitemap.xml` |
| `src/fonts/` | Self-hosted woff2 fonts |

## Conventions

- **Content first.** Every section is readable, linkable and indexable without
  JavaScript. Decorative WebGL and cursor effects are progressive enhancements
  and are disabled under `prefers-reduced-motion`.
- **Project gallery.** Cards live in `index.html` with a `data-categories`
  attribute (`seo`, `web`, `ads`). `script.js` adds filtering and paging; with
  JavaScript disabled all 26 projects stay visible. Images are served from the
  Mark X Media portfolio with an inline fallback if a file 404s.
- **Fonts are self-hosted** in `src/fonts` (woff2, latin subset; hashed by Vite) so the site
  makes no third-party font requests and text does not reflow.
- **Grainient backdrops.** The hero, impact, experience and contact sections
  each mount a `Grainient` WebGL2 shader (`#119cff → #0a66c2` blues only,
  re-angled per section). Every host keeps a layered CSS
  gradient underneath as the no-WebGL fallback, and sections below the fold only
  mount their shader when they approach the viewport.
- **Interface sound is opt-in.** Recipes from the React Bits Sound Lab are
  synthesised in the browser (no audio files). Nothing plays until the header
  switch is turned on; the choice is stored in `localStorage` and the switch
  reports state through `aria-pressed`.
- **Brand tokens — four colours, nothing else.** Cobalt `#0a66c2`, sky
  `#119cff`, gold `#FFE873`, white. Gold is a **small-area accent only**: labels,
  rules, hover states and buttons. It is never used as a section fill and never
  as text on white (1.23:1), which is why the services section is white rather
  than the old full-bleed accent. Gold on cobalt measures 4.62:1, so the small
  uppercase labels still clear WCAG AA. Cobalt is the only dark in the palette, so
  it carries all body text and every dark section. `#119cff` is too light for
  small type on any background (1.96–2.91:1), so it stays an accent: borders,
  decorative marks, and oversized display type. Verified with a WCAG audit of
  every pairing the stylesheet sets.

## Deployment

Pushing to `main` builds the site and publishes `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`.

## Assets

`public/images/og-card.jpg` is the 1200×630 social preview. Regenerate it from
`meesam-hero-cutout.webp` with Space Grotesk 700 if the headline changes.
