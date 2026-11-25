# Meesam Kazmi — Portfolio

Personal site for Meesam Kazmi, digital growth strategist and CMO at Mark X Media.
A single-page portfolio built with plain HTML, CSS and a small ES module. No
frameworks, no WebGL, no background motion. The only moving thing on the page is
the hero heading's word rotator, which is opt-in by design: it stops for
`prefers-reduced-motion`, pauses in hidden tabs, and never runs at all without
JavaScript.

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
| `script.js` | Gallery filtering, image fallback, hero word rotator |
| `public/` | Images, favicon, `robots.txt`, `sitemap.xml` |
| `src/fonts/` | Self-hosted woff2 fonts |

## Conventions

- **Content first.** Every section is readable, linkable and indexable without
  JavaScript. Nothing is hidden behind a script.
- **Project gallery.** Cards live in `index.html` with a `data-categories`
  attribute (`seo`, `web`, `ads`). `script.js` adds filtering and paging; with
  JavaScript disabled all 26 projects stay visible. Images are served from the
  Mark X Media portfolio with an inline fallback if a file 404s.
- **Hero word rotator.** The third heading line cycles
  `UNMISSABLE / FINDABLE / CLICKABLE / BUYABLE`. Words are declared once in the
  markup; the first one is the no-JS fallback. They are stacked in a single grid
  cell so the line never reflows, and the outgoing word is cloned so both
  transitions can run at once. Each word carries its own full stop.
  Travel is `.55em` inside a `.83` line height - checked against the font's real
  metrics, so no cap is clipped at either end of the move.
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

## Services

The site presents seven services, each anchored to a number from a real case
study: AI SEO & GEO, SEO strategy, local SEO, e-commerce SEO, web design,
Google Ads and Meta Ads.

Figures on the page (16.7K clicks, 757K impressions, +898% users, EUR 3.83 cost
per conversion, EUR 1.68 per B2B lead, 69.1K impressions) all come from the Mark
X Media case studies linked beside them. Add a number only with a case study to
back it.

## Deployment

Pushing to `main` builds the site and publishes `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`.

## Assets

`public/images/og-card.jpg` is the 1200×630 social preview. Regenerate it from
`meesam-hero-cutout.webp` with Space Grotesk 700 if the headline changes.

`meesam-hero-cutout.webp` is the only image with an alpha channel, so it is the
only one with a cutout edge to look after. Its mask was rebuilt from a smoothed
signed distance field rather than a threshold, which keeps the silhouette
identical (IoU 1.0000 against the original) while removing the faceted polygon
corners and the dark fringe left by compositing onto black. If the portrait is
ever replaced, check the new edge against both black and white before shipping -
a hard-edged mask is invisible on the near-black hero and obvious everywhere
else.
