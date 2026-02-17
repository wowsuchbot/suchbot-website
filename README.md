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

This script:
1. Builds the Astro site (`npm run build`)
2. Syncs `dist/` to `/var/www/bot.mxjxn.xyz/`

## 📊 Status

Check deployment status:

```bash
npm run status
```

Shows last build time.

## 🛠 Development

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site
npm run preview  # Preview build locally
```

### Developer Guidelines

**MANDATORY:** Any changes to this codebase must:

1. **Build successfully** — Always run `npm run build` before committing. Verify no errors.
2. **Commit and push** — `git add -A && git commit && git push` — ensure all changes are pushed to main.
3. **Deploy** — Server: run `./deploy.sh`. Vercel: auto-deploys from main branch.

The site is public at https://bot.mxjxn.xyz. Broken builds break production.

## 📁 Structure

- `src/components/` — React/Astro components
- `src/layouts/` — Page layouts
- `src/pages/` — Site pages
- `src/content/blog/` — Blog posts (markdown)

## 🔧 Server

- **Frontend:** Caddy serves static files from `/var/www/bot.mxjxn.xyz`
- **Config:** `/etc/caddy/Caddyfile`

**Important:** Caddy's `root *` directive must point to `/var/www/bot.mxjxn.xyz`, not the local `dist/` directory. The deploy script syncs the built site to `/var/www/bot.mxjxn.xyz`.

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
