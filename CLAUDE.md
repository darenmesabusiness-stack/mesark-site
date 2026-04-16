@AGENTS.md

# MESArk Site — Project Brief for Claude Code

## What this is
The public-facing website for MESA ARK, a competitive PvP ARK server network. Live at mesark.net. Serves as the main marketing + information hub for the server — rules, wipe schedules, cluster settings, store links, Discord invite, server IPs.

## Related MESA properties
- **Leaderboard:** leaderboards.mesark.net (separate repo: mesa-leaderboard)
- **Store:** store.mesark.net (Tip4Serv-hosted, not in this repo)
- **Discord Bot:** support bot for the community (separate repo: mesa-discord-bot)

## Architecture
- **Framework:** Next.js 16.2.4 (App Router) with React 19.2.4, TypeScript 5.x
- **Styling:** Tailwind CSS 4.x (PostCSS plugin), custom CSS variables, dark theme
- **Animation:** Framer Motion 12.38.0
- **Icons:** @heroicons/react 2.2.0
- **Analytics:** @vercel/analytics 2.0.1
- **Data:** 100% static/hardcoded in .tsx files — no database, no API routes
- **Pages:** 6 routes — `/` (landing), `/servers`, `/rules`, `/settings`, `/compete`, `/store` (redirect)
- **Components:** 9 custom components under `src/components/`
- **Path alias:** `@/*` → `./src/*`

## Deployment
- **Platform:** Vercel (project linked, auto-deploys on push to main)
- **Project:** mesark-site (prj_X7F04uSutbdyDOS5Nv9WCBEJdKpn)
- **Build:** `next build` — no custom webpack, no redirects, no image optimization configured
- **Dev:** `npm run dev`

## Design language — DO NOT VIOLATE
This is a competitive gaming product for an ARK PvP community. Tone is confident, gritty, competitive — not corporate, not cutesy.

- Dark theme primary (consistent with leaderboard's aesthetic)
- Bold, punchy typography
- Orange/ember accents (the MESA brand)
- Heavy imagery: ARK creatures, bases, game footage where available
- Copy voice: direct, player-to-player, no marketing fluff
- Reference points: typical esports org sites (Cloud9, 100 Thieves, Faze), not SaaS landing pages

## Banned
- Generic SaaS aesthetic (white background, blue gradient, "sign up for free")
- Cutesy mascot energy
- Wall-of-text marketing copy
- Dark patterns / aggressive CTAs

## Working agreement
- One logical change per commit. Clear English commit messages in present tense.
- Before destructive changes (deleting pages, reworking nav, changing routing), confirm with me.
- Work on feature branches, never push directly to main.
- After visual changes: invoke /frontend-design skill, then use Playwright MCP to screenshot at 1440px and 390px, critique against this brief, iterate once before committing.
- TODOs in code are fine — clearly mark them `// TODO(Daren): ...`
- Never commit secrets, API keys, or .env files.

## Known issues / tech debt
- No OG tags or SEO meta on any page
- No custom favicon pipeline — using default `favicon.ico`
- All server data (106+ IPs, cluster configs, rules, settings) hardcoded in component files — no central data layer
- Public assets are mostly default Next.js SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — no custom brand assets in repo
- Brand imagery (MESA icon, banner) loaded from Discord CDN — fragile, could break if Discord changes URLs
- `next.config.ts` is empty — no image optimization, no security headers, no redirects
- No error page (`not-found.tsx`, `error.tsx`)
- No loading states
- No sitemap or robots.txt

## Reference: Master documents
This project follows:
- Website Upgrade SOP at ~/Documents/SOPs/WEBSITE-UPGRADE-SOP.md
- Apply the 5-phase workflow: Setup → Brief → Diagnose → Plan → Execute

Always run diagnostic before building. Group work into waves (Polish → Speed/UX → Features). Never ship without a design brief for visual changes.
