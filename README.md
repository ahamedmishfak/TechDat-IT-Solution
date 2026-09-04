# TechDat IT Solutions — website

Static site. No build step, no dependencies, no database. Upload the folder as-is.

**16 pages · ~1.1 MB total · works from 320px phones to 1920px desktops.**

---

## Deploy

Cloudflare Workers config is already in `wrangler.jsonc`:

```
npx wrangler deploy
```

Or drag the folder into Cloudflare Pages / Netlify. Any static host works.

**Serve it over HTTPS.** The install-as-an-app prompt and offline mode are browser features that only run on a secure origin. Opening `index.html` by double-clicking still works for previewing, but those two features stay off.

---

## Before you go live — 3 things

1. **Domain.** `techdat.lk` is a placeholder. Search and replace `https://techdat.lk` across `sitemap.xml`, `robots.txt` and the `canonical` / `og:url` tags in every page.
2. **Phone prices.** The 9 handset listings use realistic but **invented** LKR figures. Check every one against your supplier before publishing.
3. **Legal pages.** `privacy.html` and `terms.html` are starting templates, not legal advice. Have them reviewed against Sri Lanka's Personal Data Protection Act No. 9 of 2022.

---

## Security

**The staff login page was deleted.** It accepted any email with any 6-character password and redirected to the homepage — anyone could "sign in". It protected nothing, so removing it removed the only real vulnerability on the site. The sign-in icon is gone from the header too.

If you want a staff area later, don't rebuild a form. Put the pages behind **Cloudflare Access** (Zero Trust → Access → Applications): it handles the login, and no credential logic ever reaches the browser.

Everything else that was added:

| Measure | What it does |
|---|---|
| `_headers` file | CSP, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP. Cloudflare Pages and Netlify read this format directly. |
| CSP `script-src 'self'` | No third-party or injected script can execute. This is the header that matters most. |
| `frame-ancestors 'none'` | The site cannot be embedded in an iframe — blocks clickjacking. |
| `rel="noopener noreferrer"` | On every new-tab link, so an opened page cannot reach back via `window.opener`. |
| Honeypot field on the contact form | Silently drops bot submissions. |
| `Permissions-Policy` | Camera, mic, geolocation and payment APIs denied outright. |
| No inline event handlers | No `onclick=` anywhere; all behaviour lives in `app.js`. |

Two notes on the CSP. `style-src` allows `'unsafe-inline'` because the pages use inline `style` attributes for one-off layout — inline styles cannot execute code, so the risk there is cosmetic, not code execution. `connect-src` and `form-action` allow `formspree.io` only, since that is what handles the contact form.

---

## Bugs fixed from the original site

| Bug | Fix |
|---|---|
| `Other IT accessories.html` — file never existed | Now links to `accessories.html` |
| `faqs.html` — file never existed | Written, with 8 real questions and FAQ schema |
| `terms.html` — file never existed | Written |
| Privacy Policy linked to nothing | `privacy.html` written |
| **Wrong phone number** `+94 76 977 9914` on about and careers | All pages use `+94 78 977 9914` |
| `./Images/desktop.jpg` and `./Images/mouse.jpg` missing | Removed; cards are text and spec based |
| `<img src="">` — makes browsers re-request the page | Removed |
| Fake login accepting any password | Page deleted (see Security) |
| No Open Graph or canonical tags | Added, with a generated share image |
| 455 KB of CSS duplicated inline across 10 files | One shared `assets/css/app.css` |
| 6.2 MB of uncompressed images | Compressed to ~350 KB |
| No sitemap, robots.txt or 404 page | All three added |
| Hero text clipped below 460px | Grid children were forcing the column past the viewport; fixed |
| WhatsApp green failed contrast at button size | Darkened to `#15803D` — 5.02:1, passes WCAG AA |

---

## What the site does

**Navigation** — Home / Shop now / Services / About / Contact. "Shop now" opens a menu with the four product categories; `shop.html` shows the same four as tiles. On phones they are in the drawer and on the bottom tab bar.

**Mobile phones** — `phones.html`, 9 handsets across flagship, mid-range, budget and business, filterable.

**Installs as an app** — `manifest.webmanifest` and `sw.js` let the site be added to a phone home screen, open full-screen, and keep visited pages readable offline. The "Install the app" button on the homepage appears only when the browser actually offers it.

**Enquire buttons open WhatsApp with the product name filled in**, so a message arrives as *"I would like to enquire about: Galaxy S25 Ultra 5G"* rather than blank.

**Logo** — the original hexagon TN monogram, unchanged in shape. Only the colours moved: cyan T, silver N, navy hexagon, cyan-to-indigo rim. The SVG viewBox was cropped to the artwork, since the original had roughly 10% blank padding baked in — that was what made it sit small and off-centre. The favicon, both app icons and the share image all render from `assets/icons/logo.svg`.

---

## Testing done

- **Overflow:** every page at 320 / 360 / 390 / 414 / 600 / 768 / 834 / 1024 / 1280 / 1440 / 1920 px — no horizontal scroll, nothing clipped.
- **Markup:** no unclosed tags, no duplicate IDs, exactly one `<h1>` per page, alt text on every image.
- **Links:** every internal link and anchor resolves to something that exists.
- **Contrast:** all text passes WCAG AA against its background.
- **Keyboard:** skip link, visible focus rings, Escape closes the menu and drawer, tap targets at least 36px.
- **Offline:** service worker registers, caches 18 files, serves cached pages with no connection.
- **Reduced motion:** all animation disabled when the operating system asks for it.

---

## Editing

| To change | Edit |
|---|---|
| Colours, spacing, fonts | `assets/css/app.css` — the `:root` block at the top |
| Menu, drawer, filters, form behaviour | `assets/js/app.js` |
| WhatsApp number | `WHATSAPP` at the top of `assets/js/app.js`, plus the `tel:` and `wa.me` links in the HTML |
| A product | Its `<article class="product">` block in the relevant page |
| Contact form destination | The `action` on `#contactForm` in `contact.html` (Formspree form `mkoyaepn`) |
| Security headers | `_headers` |

Pages share one stylesheet and one script, so a colour or nav change is a single edit, not sixteen.
