# Meesam Kazmi — Portfolio

Personal site for Meesam Kazmi, digital growth strategist and CMO at Mark X Media.
A single-page portfolio built with plain HTML, CSS and ES modules, enhanced by
React Bits islands (GradientText, Magnet, CountUp, SplashCursor, GradientASCII)
and a Three.js hero scene.

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
| `src/reactbits/` | Vendored React Bits components (MIT, see `NOTICE.md`) |
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
- **Brand tokens.** Navy `#0A2540`, cyan `#8EF0F5`, blue `#139DFF`, white.

## Deployment

Pushing to `main` builds the site and publishes `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`.

## Assets

`public/images/og-card.jpg` is the 1200×630 social preview. Regenerate it from
`meesam-hero-cutout.webp` with Space Grotesk 700 if the headline changes.
