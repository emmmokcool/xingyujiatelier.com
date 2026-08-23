# XINGYUJI ATELIER Website

Source for the public `xingyujiatelier.com` website. A one-person Qipao atelier in Bellevue,
Washington. Static HTML, CSS, and vanilla JavaScript, with no build step.

## This repository is public

Everything committed here is world-readable, permanently, including git history. Removing a file
in a later commit does not remove it from history. Treat every addition as a publication.

Do not add:

- Original or unpublished photography
- Customer information, measurements, orders, or financial data
- Google credentials, OAuth tokens, API keys, or environment files
- Internal business plans, inventory exports, or private Drive links
- Licensed stock comps, or any third-party artwork without a license to redistribute it

Private originals remain in the restricted Google Drive library. The publishing flow is:

`private Drive original -> approved export -> optimized derivative -> this repo`

Images are published as optimized derivatives with metadata stripped. Confirm that any new
photograph carries no EXIF GPS or camera-identifying tags before committing it.

## Hosting

Served by GitHub Pages from `main` at the repository root.

- `CNAME` pins the apex domain `xingyujiatelier.com`. The apex is canonical: every
  `<link rel="canonical">` and every `sitemap.xml` entry uses it, so `www` should redirect to the
  apex rather than the reverse.
- `.nojekyll` disables Jekyll processing so files are served verbatim.
- `404.html` is served for unknown paths and uses root-absolute links so it resolves at any depth.

## Local preview

Any static server works, run from the repository root:

```
python -m http.server 5173
```

Then open http://localhost:5173. `index.html` is the entry point.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | Portfolio, made-to-order, and studio contact |
| `terms.html`, `privacy.html`, `shipping-returns.html`, `accessibility.html` | Policy pages |
| `styles.css` | All styling, including the responsive token ladders |
| `app.js` | Portfolio filtering, image controls, QR dialogs, header measurement |
| `assets/web/imported/` | Optimized portfolio photography |
| `assets/icons/` | Social marks, favicon, QR codes |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Discovery and crawler guidance |

## Conventions

- Archive image widths, offsets, and vertical pull in `index.html` are hand-tuned per piece.
  Do not regenerate them.
- `--serif` is Spectral, chosen by measuring candidates against the original system stack.
  Changing it changes text width, and therefore wrapping, so re-check the mobile header after.
- Social icons are Simple Icons SVGs on a 24x24 viewBox, single path, filled `#231d1d`.
