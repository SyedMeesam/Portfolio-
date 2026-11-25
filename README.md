# Meesam Kazmi — Portfolio

Personal site for Meesam Kazmi, digital growth strategist and CMO at Mark X Media.
A single-page portfolio built with plain HTML, CSS and a small ES module. No
frameworks, no WebGL, no background animation - the page is static and every
effect that used to run has been removed.

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
| `script.js` | Gallery filtering and image fallback only |
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


- **Brand tokens — four colours, nothing else.** Near-black `#0A0A0A`, cobalt
  `#0a66c2`, sky `#119cff`, white `#FFFFFF`.
  - **Near-black** carries the hero, experience, contact and footer.
  - **Cobalt** is the brand blue: the services and ticker grounds, the
    work/impact section, and small text on white (5.69:1).
  - **Sky** is the accent: rules, borders, decorative marks, hover states, and
    display type on black (6.81:1).
  - **Grounds carry white type.** Cobalt carries white (5.69:1); black carries
    white (19.8:1); white carries cobalt (5.69:1).
  - **Sky is never type on white (2.91:1) or on cobalt (1.96:1), and never a
    ground for type.** Black on cobalt is 3.48:1 — large type only — so no small
    text is ever black on cobalt.
  - Verified with a WCAG audit of every pairing the stylesheet sets.

## Deployment

Pushing to `main` builds the site and publishes `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`.

## Assets

`public/images/og-card.jpg` is the 1200×630 social preview. Regenerate it from
`meesam-hero-cutout.webp` with Space Grotesk 700 if the headline changes.
