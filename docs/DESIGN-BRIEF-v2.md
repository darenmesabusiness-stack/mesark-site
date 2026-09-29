# mesark.net v2 — Design Brief ("Every wipe is a war")

## Goal
Turn mesark.net from a tidy info site into a cinematic esports-org front door that
makes a new ARK PvP player want to join *this* network, while keeping every info page
(servers, rules, settings, helpful, compete) fast, scannable, and scraper-friendly for
the Discord bot's knowledge base.

## Constraints (non-negotiable)
- Same routes, same nav destinations, same page copy on info pages. The bot scrapes
  these URLs (`mesark-bot/config.yaml → knowledge_urls`); text content must stay in the
  server-rendered HTML.
- `/t/:id` transcript rewrite and `/store` redirect untouched.
- Dark only. No SaaS aesthetics. Player-to-player copy.
- Mobile first-class: 390px must look intentional, not a squished desktop.
- `prefers-reduced-motion` → no autoplay video, no particles, no parallax.

## Visual system
| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#07080b` | page |
| `--bg-secondary` | `#0c0e13` | alt sections |
| `--bg-card` | `#12151c` | cards, accordions |
| `--border` | `#1f2430` | hairlines |
| `--text-primary` | `#efe8de` | warm bone white |
| `--text-muted` | `#8d8c8f` | secondary copy |
| `--accent` | `#e87b35` | ember (logo fill) |
| `--accent-secondary` | `#c4622a` | ember pressed |
| `--blue` → teal | `#3cb9c4` | logo rim light; secondary accent |

- **Display:** Big Shoulders Display 800/900, uppercase, tight tracking. Headlines are
  huge (clamp up to ~10rem on desktop).
- **Body:** Barlow 400/500/600.
- **HUD/data:** JetBrains Mono for IPs, countdowns, micro-labels (`// NEXT WIPE`).
- **Texture:** film grain overlay, vignettes, ember particle field, 1px ember hairlines.

## Imagery (Higgsfield-generated, project "MESA ARK — mesark.net v2")
Grade across all assets: near-black shadows, ember-orange firelight key, teal rim light,
volumetric smoke, drifting embers. Generated with GPT Image 2.5, upscaled (ByteDance
upscaler), hero loops animated with Seedance 2.5 using start = end frame for a
seamless cinemagraph.

| Asset | Where |
|---|---|
| `siege` (21:9, video loop + poster) | Home hero |
| `rex` (21:9, video loop + poster) | Servers header / "Why MESA" feature tile |
| `solo`, `duo`, `threesix`, `hundredx` (4:5) | Cluster cards |
| `hall` (16:9) | Hall of Fame section, Compete header |
| `ashfield` (16:9, very dark) | Final CTA, Rules/Settings/Helpful headers |

## Home page narrative
1. **Hero:** full-bleed siege loop → "EVERY WIPE IS A WAR." → Play Now / Join Discord →
   live wipe ticker pinned to the hero's bottom edge.
2. **Numbers strip:** 106+ servers · 4 clusters · 74K+ Discord · 24/7 admins (count-up).
3. **Pick your war:** four tall art cards (Solo / Duo / 3-6 Man / 100x), wipe day, server
   count derived from `src/data/servers.ts`.
4. **Why MESA:** bento grid — one big art tile, five compact feature tiles.
5. **Hall of Fame:** cavern art backdrop, 7-tier ladder Silver → Prestige with rewards.
6. **Final call:** ash-field plate, countdown to the soonest wipe, Play / Discord.

## Reference points
Esports org sites (100 Thieves, Cloud9, FaZe), AAA game launch pages (big type over
motion, sparse copy, confident negative space).

## Out of scope for v2
Live server population (needs an API from the bot/intel DB — follow-up), leaderboard
embed, i18n.
