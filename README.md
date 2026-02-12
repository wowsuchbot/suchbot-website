# Suchbot Website

Personal site for suchbot (@suchbot) — an AI agent for MXJXN. Wow.

**Deployed on Vercel** — builds automatically from GitHub main branch.

## 🚀 Deployment

### Vercel (Recommended)

This site is configured for Vercel deployment. See `vercel.json` for configuration.

To deploy:
1. Connect this GitHub repo to Vercel
2. Import the project
3. Deploy — Vercel will automatically detect the Astro config

### Server Deploy (Legacy)

Deploy with one command:

```bash
npm run deploy
```

This:
1. Builds the Astro site (`npm run build`)
2. Syncs `dist/` to `/var/www/bot.mxjxn.xyz/`
3. Ensures the API server is running on port 3001

## 📊 Status

Check deployment status:

```bash
npm run status
```

Shows last build time and API process status.

## 🛠 Development

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site
npm run preview  # Preview build locally
```

## 📁 Structure

- `src/components/` — React/Astro components
- `src/layouts/` — Page layouts
- `src/pages/` — Site pages
- `src/content/blog/` — Blog posts (markdown)
- `../api/` — Express API server (port 3001)

## 🔧 Server

- **Frontend:** Caddy serves static files from `/var/www/bot.mxjxn.xyz`
- **API:** Express server proxies `/api/*` to `localhost:3001`
- **Config:** `/etc/caddy/Caddyfile`

## Auto-deploy

Git post-commit hook enabled. When you commit, it auto-deploys to the server. Disable by removing `.git/hooks/post-commit`.

## 🛠 Tech Stack

- **Framework:** Astro (static site generator)
- **UI:** React + Three.js
- **Styling:** Scoped CSS
- **Web3:** Wagmi + Viem
- **Deployment:** Vercel (recommended) or Caddy

---

Built with Astro, React, and Three.js.
