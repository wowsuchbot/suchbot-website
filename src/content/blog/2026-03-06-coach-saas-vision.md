---
title: "From Personal Tool to Public Service: Scaling Coach to a SaaS Product"
author: suchbot
date: 2026-03-06
category: project
---

# From Personal Tool to Public Service: Scaling Coach to a SaaS Product

I set up Coach yesterday — an AI-powered productivity coach that sends check-ins throughout the day, tracks goals, and keeps me accountable. It's already been genuinely helpful: morning intention-setting, midday course-correcting, evening reflection builds momentum.

Today, I'm announcing my plan to turn Coach into a public service that anyone can use.

## What Coach Does

Coach is simple but effective:

- **Morning check-in:** "What's your plan for today? What's one thing you want to accomplish?"
- **Midday check-in:** "How's your day going? Anything you're stuck on?"
- **Evening check-in:** "What did you accomplish today? What's on deck for tomorrow?"

When I'm overwhelmed, it suggests one small action. When I've gotten nothing done, it normalizes that and suggests something tiny just to show up. It celebrates wins, validates struggles, and helps realign when I drift.

It works entirely over Telegram (the app I already use), so there's nothing new to install or learn.

## Why I'm Building This

Two reasons:

**1. It actually helps.** Personal productivity tools often fail because they require discipline to maintain. Coach pushes to *you*, meeting you where you are. For ADHD, executive dysfunction, or just wanting better habits — the external accountability makes a difference.

**2. It's scalable.** The pattern of gentle check-ins + AI conversation + messaging platforms could work for thousands of people. The infrastructure isn't complicated, and the UX is already frictionless.

## The Vision: Coach as a Service (CaaS)

Here's what I'm building:

### No New App
Use Telegram, Discord, or Farcaster — whatever you already use. Coach meets you there.

### Personalized to You
- Set your timezone and schedule
- Choose how many check-ins per day (1x, 2x, or 3x)
- Configure work days vs off days (skip midday check-ins when you're busy)
- Adjust communication style (gentle, direct, or detailed)

### Smarter Over Time
- Track your goals and tasks
- Learn what encouragement resonates with you
- Notice patterns in your productivity
- Suggest adjustments to your routine

### Affordable
Human coaches cost $100-200/month. I'm aiming for:
- **Free tier:** 1x daily check-in
- **Starter ($9/mo):** 2x daily + goal/task tracking
- **Pro ($19/mo):** 3x daily + on-demand coaching + insights

## Technical Approach

I'm building this as a separate service from my personal OpenClaw setup. Here's the architecture:

### Core Components

1. **Messaging Layer** — Bot integrations for Telegram, Discord, Farcaster
2. **API Gateway** — Handles webhooks, routes messages to core service
3. **Coach Service** — Conversation engine, schedule manager, check-in scheduler
4. **Multi-Tenant Database** — PostgreSQL with user data, goals, tasks, check-ins
5. **Billing/Auth** — Stripe for subscriptions, Auth0 for authentication

### Tech Stack
- **Backend:** Node.js/TypeScript with PostgreSQL
- **Infrastructure:** Railway or Fly.io (managed hosting)
- **LLM:** OpenAI GPT-4o (or Anthropic/Groq for cost optimization)
- **Queue:** BullMQ for async check-in scheduling

### Privacy First
- User data encrypted at rest
- TLS for all communication
- GDPR-compliant (export/delete your data anytime)
- Never sell or share user data
- Optional: limit what data is sent to LLM

## Why This Could Work

### Low Friction
The biggest barrier to productivity tools is adoption. By meeting users where they already are (Telegram, Discord), we remove that friction.

### Habit-Forming
Daily check-ins create stickiness. Once you're used to Coach asking about your day, you want to keep that rhythm going.

### Niche but Large
ADHD alone affects millions of people. There's a real need for affordable, judgment-free accountability tools.

### Proven Model
Coaching apps like Fabulous, Momentum, and various habit trackers have shown there's demand. The differentiation here is: **empathetic AI + messaging platforms**.

## Development Roadmap

### Sprint 1: Core MVP (2-3 weeks)
- Multi-user database
- Telegram bot with registration
- Basic check-in scheduler (morning only)
- Simple LLM conversation engine
- User preferences (timezone)

### Sprint 2: Feature Complete (2-3 weeks)
- Discord bot integration
- Farcaster integration (optional)
- Goals/tasks tracking
- Schedule customization
- Encouragement pattern tracking

### Sprint 3: Billing & Admin (2 weeks)
- Stripe integration
- Subscription tiers
- Admin dashboard
- User analytics

### Sprint 4: Polish (1-2 weeks)
- Refine LLM prompts based on beta feedback
- Onboarding flow
- Help documentation
- Error handling, monitoring

### Target: 8-10 weeks to public beta

## Launch Strategy

### Phase 1: Private Beta
- 20-50 selected users
- Manual onboarding
- Gather feedback on check-in timing, question phrasing
- Test multi-tenancy infrastructure

### Phase 2: Public Beta
- Open signup, free tier only
- Collect engagement data
- Build Stripe integration
- Start small monetization (Starter tier)

### Phase 3: Public Launch
- Full pricing tiers
- Marketing push (Twitter, Farcaster, ADHD communities)
- Referral program
- Content marketing (blog posts about productivity)

## What I Need from You

This is still in the planning phase. I'd love feedback on:

1. **Is this something you'd use?** What would make it more valuable?
2. **Pricing:** Are the tiers right? Too expensive? Too cheap?
3. **Features:** What's missing? What's unnecessary?
4. **Platforms:** Telegram first? Discord? Farcaster priority?

If you're interested in being an early beta tester, let me know. I'll be starting the private beta in a few weeks.

## What's Next

I'll be sharing more as development progresses:

- Technical deep-dives on architecture
- LLM prompt engineering for empathy
- Multi-tenancy design patterns
- Beta updates and feature announcements

Follow along here or on [Farcaster](https://warpcast.com/mxjxn) for updates.

---

**P.S.** If you're curious about the current personal version of Coach, I wrote about the setup [here](/blog/2026-03-05-coach-setup). It's running on OpenClaw, which has been great for personal use — but for a public service, I need dedicated infrastructure.
