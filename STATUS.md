# STATUS UPDATE

**Date:** 2026-03-26 02:15 UTC
**Component:** suchbot-website
**Status:** 🟢 Operational

## Current Status

**Website:** ✅ https://bot.mxjxn.com (LIVE)
**Process Manager:** PM2 (auto-restart, monitoring)
**Last Deployment:** 2026-03-26 02:15 UTC

---

## Deployment Workflow (UPDATED)

### Creating a New Blogpost

**Option 1: Using the helper script**
```bash
cd /root/.openclaw/services/bot-website
./create-blogpost.sh "Your Post Title"
```
This will:
1. Create a new file in `src/content/blog/YYYY-MM-DD-slug.md`
2. Open it in your editor
3. Ask if you want to deploy immediately

**Option 2: Manual workflow**
```bash
# 1. Create blogpost
vim src/content/blog/YYYY-MM-DD-title.md

# 2. Build
npm run build

# 3. Deploy
./deploy.sh
```

### Deployment Process

The `deploy.sh` script now:
1. Builds the site (`npm run build`)
2. Syncs `dist/` to `/var/www/bot.mxjxn.com`
3. **Restarts PM2 process** (no more nohup!)

### Process Management

**PM2 Configuration:**
- Process name: `bot-website`
- Port: 4321
- Auto-restart: ✅ (on crash, file changes disabled)
- Monitoring: ✅ (via `pm2 list`, `pm2 logs`)
- Persistence: ✅ (survives reboots via `pm2 save`)

**PM2 Commands:**
```bash
pm2 list              # Show all processes
pm2 logs bot-website  # View logs
pm2 restart bot-website  # Restart server
pm2 stop bot-website  # Stop server
pm2 start bot-website # Start server
pm2 monit             # Real-time monitoring
```

---

## Infrastructure

**Web Server:** Node.js (Astro SSR) on port 4321
**Reverse Proxy:** Caddy → localhost:4321
**Web Root:** `/var/www/bot.mxjxn.com`
**Repository:** https://github.com/wowsuchbot/suchbot-website

**Caddy Configuration:**
- `bot.mxjxn.com` → `localhost:4321`
- `bot.mxjxn.xyz` → `localhost:4321` (API proxy to port 3001)
- SSL: Automatic via Caddy

---

## Monitoring & Alerts

**Current Status:** Check anytime with:
```bash
curl -I https://bot.mxjxn.com
pm2 list
pm2 logs bot-website --lines 50
```

**Health Checks:**
- Local: `http://localhost:4321` → Should return 200
- Public: `https://bot.mxjxn.com` → Should return 200

---

## Recent Changes

### 2026-03-26: PM2 Migration
- ✅ Migrated from nohup to PM2
- ✅ Updated deploy.sh to use PM2 restart
- ✅ Added create-blogpost.sh helper script
- ✅ PM2 process saved for persistence
- ✅ Website back online after 7-day downtime

### 2026-02-14: Initial Deployment
- Hero tagline adjustment
- Avatar integration
- CSS consolidation
- Build & deploy workflow established

---

## Metrics

**Build Time:** ~8 seconds
**Deploy Time:** <5 seconds
**Process Uptime:** Continuous (PM2 managed)
**Last Restart:** 2026-03-26 02:15 UTC

---

## Troubleshooting

**If site is down:**
1. Check PM2: `pm2 list`
2. Check logs: `pm2 logs bot-website --lines 100`
3. Restart: `pm2 restart bot-website`
4. Check port: `lsof -i :4321`

**If build fails:**
1. Check Node version: `node --version` (should be v18+)
2. Check dependencies: `npm install`
3. Check for errors: `npm run build`

**If deployment fails:**
1. Check permissions: `ls -la /var/www/bot.mxjxn.com`
2. Check disk space: `df -h`
3. Run manually: `./deploy.sh`
