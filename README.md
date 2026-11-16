# Centapillion · the daily dig

A daily rarity-trivia game. It plays like krillion.io, but you tunnel down through the earth instead of diving into the sea.

## How it plays

- 7 prompts a day, the same for everyone (for example, "Name a dog breed").
- Each prompt shows for 3 seconds, then you get **45 seconds** to answer.
- You can give **up to 5 answers per prompt**, and every accepted answer scores.
- Rarer answers score more and dig deeper (10 metres per point):

| Tier | Points | Meaning |
|---|---|---|
| 🪱 Earthworm | 10 | The answer everyone digs up first |
| 🪙 Fool's Gold | 15 | A famously "obscure" pick that everyone grabs |
| 🪲 Beetle | 30 | Solid, tunnels with the crowd |
| ⛏️ Mole | 60 | Genuinely uncommon |
| 🌋 Magma Wyrm | 85 | True obscurity |
| 🐛 One in a Centapillion | 100 | The designated gem (one per prompt) |

- Wrong answers are rejected and you can keep trying until time runs out.
- Repeating an answer you already gave this round doesn't score (aliases count as repeats).
- For a near-miss typo, the game suggests the correct answer; submit again to confirm. If time runs out with a typo in the box, it is accepted.
- Score bands: 0–299 Topsoil, 300–599 Beetle, 600–999 Mole, 1000–1499 Magma Wyrm, 1500+ Centapillion.
- One daily dig per day. If you close the page, the round timer keeps running.
- Other modes:
  - **Archive:** replay any past day. Doesn't count toward your streak.
  - **Unlimited:** endless random digs.
- Features:
  - Streaks and stats.
  - An emoji share grid.
  - A per-prompt answer sheet ("dig log") at the end.

## Run it

It's a static site with no build step and no dependencies.

```bash
npm start            # or: python3 -m http.server 8765
```

Then open http://localhost:8765. To deploy, put the folder on any static host (GitHub Pages, Netlify, Cloudflare Pages).

## Tests

```bash
npm test             # data integrity + matching/scoring/schedule (Node)
npm run test:e2e     # full browser playthrough (needs Playwright + a running server)
```

## Files

| Path | What |
|---|---|
| `index.html` | page shell |
| `css/style.css` | all styling |
| `js/data.js` | prompt bank: 44 prompts, ~3,500 tiered answers with aliases |
| `js/engine.js` | rules, answer matching, daily schedule, scoring, share text |
| `js/sprites.js` | procedural pixel-art creatures |
| `js/scene.js` | the underground cross-section and the digging centipede |
| `js/audio.js` | synthesised sound effects |
| `js/app.js` | game flow, saving, screens, modals |

## Editing prompts

Each prompt in `js/data.js` lists answers by tier (`p c s r d k`), separated by `|`. Aliases follow the main name after `=`, for example `Eswatini=swaziland`. `npm test` fails if two answers in a prompt collide, or if a prompt is missing a tier or has more than one centapillion answer.

## Differences from krillion.io

- Krillion ranks answers from a server-side database of how common they are. Centapillion's tiers are assigned by hand in `js/data.js`, and the game runs entirely in the browser.
- There is no "better than X% of players" line, because there is no server to count other players.
- Progress is saved in the browser's localStorage only.
