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


- **Brand tokens — five colours, nothing else.** Near-black `#0A0A0A`, cobalt
  `#0a66c2`, sky `#119cff`, gold `#FFE873`, white.
  - **Near-black** carries the hero, experience and contact sections.
  - **Gold** is used two ways: as a **full section ground with black type**
    (services, ticker) where black on gold is 16.07:1, and as a **text/border
    accent on black** where gold on black is also 16.07:1.
  - **Gold is never used as text on white** (1.23:1) or on cobalt (4.62:1, which
    reads muddy at small sizes). It is always either the ground or on black.
  - **Cobalt** stays the brand blue for the work/impact section and for small
    text on white (5.69:1).
  - **Sky** is too light for small type on any background (1.96–2.91:1), so it
    stays an accent: borders, rules, decorative marks, and oversized display type.
  - Verified with a WCAG audit of every pairing the stylesheet sets.

## Deployment

Pushing to `main` builds the site and publishes `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`.

## Assets

`public/images/og-card.jpg` is the 1200×630 social preview. Regenerate it from
`meesam-hero-cutout.webp` with Space Grotesk 700 if the headline changes.
