# Centapillion · the daily dig

A daily rarity-trivia game. It plays like krillion.io, but you tunnel down through the earth instead of diving into the sea.

## How it plays

- 7 prompts a day, the same for everyone (for example, "Name a dog breed").
- Each prompt shows for 3 seconds, then you get **30 seconds**.
- There is **no limit on answers**: every accepted answer scores.
- Rarer answers score more and dig deeper (10 metres per point). When an answer lands, every level's line appears below the digger and it sinks to the one you reached, the way krillion.io shows it.

| Level | Colour | Points | Meaning |
|---|---|---|---|
| Common | white | 10 | The answer everyone digs up first |
| Too Clever | orange | 15 | The "obscure" pick everyone reaches for |
| Uncommon | blue | 30 | Solid, tunnels with the crowd |
| Rare | red | 60 | Genuinely uncommon |
| Deep Cut | purple | 85 | True obscurity |
| One in a Centapillion | gold | 100 | The designated gem, one per prompt, with a fun fact |

- Wrong answers are rejected and you can keep trying until time runs out. Repeats (including alternate spellings) don't score.
- Near-miss typos get a "submit again to confirm" fix-up. If time runs out with a typo in the box, it is accepted.
- Score bands: 0–399 Common, 400–799 Uncommon, 800–1,199 Rare, 1,200–1,799 Deep Cut, 1,800+ Centapillion.
- One daily dig per day. Closing the page doesn't stop the round timer.
- **Archive:** replay any past day. Doesn't count toward your streak; replays keep your best.
- **Unlimited:** numbered digs (∞1, ∞2, …) you can replay; a dig log shows your best on each.
- **Results** (modelled on krillion's): score and depth, a score gauge, "the bearing" (score bands with yours highlighted), copy/share, a per-round depth chart, "the haul" (every round's full answer sheet, your answers marked, sortable), and a logbook line.
- **Diggers:** seven colour variants of the centipede, unlocked by your best daily streak (0, 5, 14, 30, 45, 60, 100 days). Tap the digger to poke it.
- **Settings:** sound, typo checking, clearing the box after a wrong answer, reduced motion, low power mode, erase progress.

## Questions

154 prompts with 11,681 answers across six files (`js/data.js` to `js/data6.js`): animals, food, places, pop culture, science, everyday things and wordplay. With 7 a day, the daily sequence runs 22 days before any prompt comes back, and a prompt never returns within 10 days. Unlimited digs follow their own sequence.

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
| `js/data*.js` | prompt bank: 154 prompts, 11,681 tiered answers with aliases and gem facts |
| `js/engine.js` | rules, answer matching, daily schedule, scoring, share text |
| `js/sprites.js` | procedural pixel-art creatures |
| `js/scene.js` | the underground cross-section and the digging centipede |
| `js/audio.js` | synthesised sound effects |
| `js/app.js` | game flow, saving, screens, modals |

## Editing prompts

Each prompt lists answers by tier (`p c s r d k` = Common, Too Clever, Uncommon, Rare, Deep Cut, Centapillion), separated by `|`. Aliases follow the main name after `=`, for example `Eswatini=swaziland`. The gem's fun fact follows `::`. `npm test` fails if two answers in a prompt collide, the gem duplicates a lower-tier answer, a tier is missing, the gem has no fact, or a prompt has fewer than 30 answers.

## Differences from krillion.io

- Krillion ranks answers from a server-side database of how common they are. Centapillion's tiers are assigned by hand in `js/data.js`, and the game runs entirely in the browser.
- There is no "better than X% of players" line, because there is no server to count other players.
- Progress is saved in the browser's localStorage only.
