# FINTECH Payments Website

A premium, production-ready marketing site for the "Fintech Payments" sub-category.

## Pages
Home, Features, Pricing, How it works, About, Contact, Login, Register, 404 — 9 in total.

## Tech stack
Plain HTML / CSS / JS. No build step. The only external dependencies are Phosphor Icons,
Google Fonts, and Unsplash imagery.

## Design system
- **Primary — Indigo** (`#4F46E5`): calls to action, links, active states, gradient headlines.
- **Secondary — Ink Slate** (`#0F172A`): body ink, and the dark bands used for the stat strip,
  CTA blocks and auth panels.
- **Accent — Emerald** (`#10B981`): reserved for confirmation and highlight moments — check marks,
  live indicators, "free" values, security badges. Deliberately never used for a primary button,
  so it keeps its meaning.
- Typography: Outfit (headings) + Plus Jakarta Sans (body), on a fluid `clamp()` scale.
- Full token set in `assets/css/style.css` §1 — ramps, gradients, elevation, motion easings.

## Interactive components
Home (`index.html`)
- **Live transfer estimator** in the hero — amount input, 9 currencies, swap button, and a
  rate/fee/total breakdown that recalculates on every change.
- **Tabbed product showcase** — Transfers / Cards / Insights / Business, each with its own imagery.
- **Testimonial carousel** — prev/next, dot navigation, autoplay, pause-on-hover, touch swipe.
- **FAQ accordion**, animated stat counters, animated spending bars, logo marquee.

About (`about.html`)
- **Interactive timeline** — click 2023–2026 to swap the milestone panel, with a progress line
  that fills as you move through the years.
- **Values accordion**, hover-reveal leadership cards, animated stat counters.

Site-wide
- Dark / light theme with `localStorage` persistence and no flash of the wrong theme on load.
- Scroll-reveal animations, scroll progress bar, sticky nav state, mobile drawer.
- **Back to top** on all 9 pages — fades in past 400px of scroll and smooth-scrolls home.
  Short pages (404, login at desktop) never scroll far enough to show it, which is intended.
- Client-side form validation with inline errors.

## Icons
The favicon is the brand mark from the navbar — a white bolt on the indigo gradient — authored
once as `assets/favicon.svg` and rendered to the other formats from that single source.

| File | Purpose |
| --- | --- |
| `assets/favicon.svg` | Modern browsers; scales to any size |
| `favicon.ico` | Fallback, packing 16 / 32 / 48px |
| `assets/apple-touch-icon.png` | 180px, iOS home screen |
| `assets/icon-192.png`, `assets/icon-512.png` | Android / PWA install, referenced by the manifest |
| `site.webmanifest` | App name, theme colour, icon set |

All five are declared in every page's `<head>`. To restyle the mark, edit the SVG and re-render
the raster sizes from it.

## Accessibility & robustness
- Semantic landmarks, ARIA roles on tabs/timeline/accordion, visible focus rings, labelled controls.
- Honours `prefers-reduced-motion` and `prefers-color-scheme`.
- Verified: no horizontal overflow on any page from 360px to 1600px; every image renders;
  all interactive components exercised in a headless browser.

## Run locally
```bash
python -m http.server     # then open http://localhost:8000
# or
npx serve
```

## Placeholders
- **Contact form**: Formspree `action` placeholder.
- **Map**: styled placeholder image in `contact.html` where a Google Maps iframe would go.
- **Analytics**: `<!-- GA_TAG -->` in each `<head>`.
- **Disclaimer**: the footer states that FINTECH is a demo brand and all figures, rates and
  licences shown are illustrative.
- `assets/css/style.css.bak` and `assets/js/main.js.bak` are the pre-redesign originals —
  safe to delete.
