# Xingyuji Atelier website prototype

Image-free static prototype for `xingyujiatelier.com`.

## Preview

```powershell
cd path\to\xingyujiatelier.com
python -m http.server 5173
```

Open <http://localhost:5173>.

## Prototype behavior

- Responsive editorial home, collection, lookbook, atelier, list, and booking pages
- Atelier List stored only in the visitor's browser (`localStorage`)
- Collection filters and add/remove interactions
- Seasonal subscription colour-preference fields
- Google Calendar booking link
- Enquiry form is deliberately non-transmitting until a hosted form endpoint is selected
- No private atelier images or Google Drive links

## Image policy for launch

The public website will use a separate curated Google Workspace source folder. Private inventory
images must never be referenced directly.

Export each approved image as:

- AVIF, approximately 80–160 KB where practical
- WebP fallback, approximately 120–220 KB
- JPEG fallback only when needed
- Explicit `width` and `height` attributes
- `loading="lazy"` and `decoding="async"` below the fold
- `fetchpriority="high"` only for the home-page hero

Copy final optimized files into an `assets/images/` directory or a dedicated image CDN. Do not
hotlink the original Google Drive files.
