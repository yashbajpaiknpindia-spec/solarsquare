# Sol Grid India — Solar EPC Website

End-to-end solar EPC landing page with a full production backend.

## What's included

- React + Vite + TypeScript + Tailwind + shadcn/ui frontend
- Express.js backend serving the SPA + REST API
- PostgreSQL analytics database (visits, duration, geo, device)
- Admin Dashboard at /admin with charts and heatmaps
- Top-notch SEO: Schema.org LocalBusiness + FAQPage structured data
- Google Analytics 4 integration (optional, zero-config)
- One-click Render deploy via render.yaml Blueprint

---

## Deploy to Render

1. Push this repo to GitHub / GitLab.
2. Render Dashboard → New → Blueprint → connect your repo.
3. Render reads render.yaml and creates the web service + PostgreSQL database automatically.
4. Set these Secret Environment Variables in the Render dashboard:

   | Variable                  | Example                      | Required |
   |---------------------------|------------------------------|----------|
   | ADMIN_TOKEN               | openssl rand -hex 32 output  | Yes      |
   | VITE_GA_MEASUREMENT_ID    | G-XXXXXXXXXX                 | Optional |

5. Trigger a redeploy after setting env vars (Vite bakes the GA ID in at build time).

---

## Local Development

Prerequisites: Node.js >= 18, PostgreSQL >= 14

```bash
npm install
cp .env.example .env          # fill in DATABASE_URL and ADMIN_TOKEN
createdb solgrid
node server/index.js &        # backend on :3000
npm run dev                   # Vite on :8080, proxies /api → :3000
```

---

## Admin Dashboard

Visit /admin on your deployed URL.
Login with your ADMIN_TOKEN value.

Tabs: Overview (KPIs, line chart, heatmap, recent visits) | Realtime (referrers, GA links) | Geo (country table + chart) | Tech (device + browser charts)

---

## SEO Features

- Schema.org LocalBusiness with service catalog, area served, opening hours
- Schema.org FAQPage for rich FAQ snippets in Google
- Open Graph + Twitter Card for social sharing
- Canonical URL, robots.txt (blocks /admin + /api), sitemap.xml
- Semantic HTML heading hierarchy, alt text on all images

Update https://solgridindia.com/ in index.html, robots.txt, and sitemap.xml with your actual domain.

---

## Google Analytics 4

1. Create a GA4 property at analytics.google.com
2. Copy your Measurement ID (G-XXXXXXXXXX)
3. Set VITE_GA_MEASUREMENT_ID in Render environment variables
4. Trigger a redeploy

---

## Build Commands

```bash
npm run dev      # Vite dev server (port 8080)
npm run build    # Production build → dist/
npm run start    # Express server (serves dist/ + API)
npm run preview  # Preview build locally
npm test         # Vitest
```
