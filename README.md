# Pipeline

A privacy-first, zero-cost job application tracker. Your data never leaves your browser.

Built as a portfolio project for managing an entry-level software engineering job search — with support for role tags like bio/health tech, resume version tracking, and pipeline analytics.

## Cost: $0

This project is designed so you never need to pay for infrastructure:

| Item | Cost | Notes |
|------|------|-------|
| **Local use** | $0 | `npm run dev` — data in IndexedDB, no internet required after install |
| **Database** | $0 | IndexedDB in your browser (not a cloud DB) |
| **Auth / accounts** | $0 | None — no user sign-up service |
| **APIs** | $0 | No external calls; no API keys to manage |
| **Hosting (optional)** | $0 | Static files only — GitHub Pages, Vercel, or Netlify free tiers |

**Recommended for lowest cost:** use it locally during your job search. Add to your Netlify portfolio when you want it visible — still free on the hobby tier.

## Privacy model

- All data is stored in **IndexedDB** in your browser
- **No backend, no accounts, no analytics** on your application data
- Deploying only serves the static app shell — visitors cannot see your data
- Use **Export JSON** to back up; import restores on any browser or device

## Features

- **Kanban board** — drag cards between stages (Wishlist → Applied → Recruiter → Technical → Onsite → Offer)
- **Table view** — sortable overview with stale-application highlighting (14+ days without contact)
- **Stats** — breakdown by status, role type, source, and resume version
- **Role tags** — General SWE, Bio/Health Tech, Frontend, Backend, etc.
- **Export / Import** — JSON backup (store the file in Google Drive, Dropbox, or a USB drive — all free)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to your portfolio (recommended)

This app lives as a **subdirectory** on [keanucodes.netlify.app](https://keanucodes.netlify.app/pipeline/) (`/pipeline/`). That keeps your main portfolio fast — Pipeline JS loads only when someone visits the link.

```bash
npm run build:portfolio
```

This builds with `base: /pipeline/`, splits vendor chunks for caching, and copies `dist/` into `../Keanus-Portfolio/static/pipeline/`. Commit and push [Keanus-Portfolio](https://github.com/keanu-sida/Keanus-Portfolio) to publish via Netlify.

To point at a different portfolio path, edit `.env.portfolio` and `scripts/copy-to-portfolio.mjs`.

### Why this is performant

- **No impact on your main portfolio** — static HTML/CSS only; Pipeline JS (~100 KB gzip total) loads only when visiting `/pipeline/`
- **Vendor chunk splitting** — React and Dexie cached separately from app code
- **No server, no API calls** — zero latency from backends

## Deploy standalone (optional)

```bash
npm run build
```

Deploy `dist/` to any static host with `base: /`. Not needed if you use the portfolio subdirectory approach.

## Tech stack

- React 19 + TypeScript
- Vite (static build — no server runtime)
- Tailwind CSS 4
- Dexie (IndexedDB wrapper)

## License

MIT
