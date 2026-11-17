# Centapillion · the daily dig

A daily rarity-trivia game. It plays like krillion.io, but you tunnel down through the earth instead of diving into the sea.

## How it plays

- 7 prompts a day, the same for everyone (for example, "Name a dog breed").
- Each prompt shows for 3 seconds, then you get **30 seconds**.
- There is **no limit on answers**, but, as on krillion.io, each round scores only its **rarest answer**. Seven rounds × 100 makes the day out of **700**.
- A rarer answer digs deeper (10 metres per point); a weaker one shows "your round best is still …". When an answer lands, every rank's line appears below the digger and it sinks to the one you reached.
- The worm turns the colour of the rank it reached, resets each round, and takes your overall rank's colour on the results screen.

| Rank (Krillion's name) | Colour | Points | Meaning |
|---|---|---|---|
| Topsoil (Plankton) | white | 10 | The answer everyone digs up first |
| Too Clever (Too Clever) | orange | 15 | The "obscure" pick everyone reaches for |
| Burrower (Schooler) | blue | 30 | Solid, tunnels with the crowd |
| Rare (Rare) | red | 60 | Genuinely uncommon |
| Deep Cut (Deep Cut) | purple | 85 | True obscurity |
| One in a Centapillion (One in a Krillion) | gold | 100 | The designated gem, one per prompt, with a fun fact |

- Wrong answers are rejected and you can keep trying until time runs out. Repeats (including alternate spellings) don't score.
- Near-miss typos get a "submit again to confirm" fix-up. If time runs out with a typo in the box, it is accepted.
- Score bands (Krillion's): 0–150 Topsoil, 151–250 Burrower, 251–350 Rare, 351–449 Deep Cut, 450+ One in a Centapillion.
- Share text: title, one emoji per round (your best answer's rank, ⬛ for a miss), then score/700 and depth.
- One daily dig per day. Closing the page doesn't stop the round timer.
- **Archive:** replay any past day. Doesn't count toward your streak; replays keep your best.
- **Unlimited:** numbered digs (∞1, ∞2, …) you can replay; a dig log shows your best on each.
- **Category digs:** after the daily, "keep digging" offers eight categories (Geography, Animals & Nature, Food & Drink, Movies TV & Music, Sports & Games, Science & the Body, History & Culture, Everyday Things). Each runs numbered 7-prompt digs from that subject only, with its own best scores and share line (`#/cat/geography/3`). Categories are listed in `js/categories.js`; every prompt belongs to exactly one.
- **Results** (modelled on krillion's): score and depth, a score gauge, "the bearing" (score bands with yours highlighted), copy/share, a dig-log chart (each round's best answer and its rank icon), "the haul" (each round's best answer in its rank colour; tap for the full answer sheet, your answers marked, sortable), and a logbook line.
- **Diggers:** seven colour variants of the centipede, unlocked by your best daily streak (0, 5, 14, 30, 45, 60, 100 days). Tap the digger to poke it.
- **Settings:** sound, typo checking, clearing the box after a wrong answer, reduced motion, low power mode, erase progress.

## Questions and answers

153 prompts. Each has a hand-curated answer list (`js/data.js` to `js/data7.js`) plus generated extra answers (`js/data-extra.js`), about **125,000 accepted answers** in all. 26 prompts have over 1,000 accepted answers; closed sets (states, presidents, NFL teams, books of the Bible) are complete.

A prompt is kept only if anyone can name a few answers instantly, it has a long tail of real answers, validity is a fact rather than a judgment call, and it isn't a word puzzle. Prompts that failed this (rhymes, "-ology" words, phobias, "something yellow", "a nocturnal animal", cities in Texas, cloud types and similar) were replaced with broad ones such as countries, U.S. states and cities, world capitals, animals, colors, athletes, authors, singers, actors, NFL/NBA teams, soccer clubs, Beatles and Taylor Swift songs, car models and fashion brands.

### How answers are built (modelled on Krillion's process)

Krillion's FAQ describes its process as: aggregate datasets (dictionaries, wiki lists, encyclopedias), merge and clean them into one answer set, score rarity mechanically against a familiarity database, then do a manual pass. Centapillion does the same:

1. **Hand pass:** every prompt has a curated list. Only the hand pass can set Topsoil, Too Clever and the gem (the One in a Centapillion answer).
2. **Datasets:** `tools/build_extra.py` pulls answers from the open [corpora](https://github.com/dariusk/corpora) collection (dog and cat breeds, dinosaurs, birds, cheeses, spices, rivers, gemstones, fabrics, Pokémon, scientists, occupations, sports and more). It also uses the CMU Pronouncing Dictionary for rhymes (manually vetted), `wordfreq`'s vocabulary for "-ology" and "-phobia" words, ISO 639 for languages, and Wikidata (`tools/wikidata_fetch.py`) for long-tail lists such as islands, rivers, lakes, cities, films, painters and species. Lists are fetched from [QLever](https://qlever.dev)'s copy of Wikidata, which answers each query in about a second (all 127 lists in about 4 minutes); `query.wikidata.org` is the fallback. Lists of people require real output in the field, not just a job title: actors need 8+ non-documentary film roles, authors 3+ literary works, musicians 5+ songs or albums, athletes a recorded sport. This keeps out people who only briefly held the job (for example Trump as an actor or Einstein as an author).
3. **Cleaning:** drops entries already in the hand list, spelling variants of existing answers, junk entries, and everyday words that would score too easily (e.g. "Milk" as a river).
4. **Rarity:** each new answer is tiered by how familiar the word is (`wordfreq` Zipf frequency, an open counterpart to Krillion's familiarity database). The cut-offs come from the hand tiers: 3.3 and above is Burrower, 2.2 to 3.3 is Rare, below 2.2 is Deep Cut. Wikidata answers are tiered by how many Wikipedia language editions cover them, with per-prompt cut-offs set where that prompt's hand-tiered answers fall.
5. **Log:** every build writes `tools/answer-build-log.md`, listing per prompt how many answers were added at each level and why others were skipped.

Rebuild after editing the hand data or the script:

```bash
pip install wordfreq pronouncing pycountry
git clone --depth 1 https://github.com/dariusk/corpora ../dariusk/corpora
python3 tools/build_extra.py
```

The daily sequence runs 22 days before any prompt comes back, and a prompt never returns within 10 days.

### Spell check

- **Confident typos count straight away**, with a "counted as …" note. This covers one slip in a 5+ letter word, two slips in long words, and sound-alikes ("tiramisoo", "dalmation", "brocolli", "hermoine").
- **Doubtful matches ask first** ("submit again to confirm").
- **Category words are ignored**: "Lake Baikal", "Baikal" and "Baikal lake" all count. So are word order and shorthands ("mt", "st", "ft", "&").
- **Ties go to the more common answer**, since that's usually what was meant.
- **Generated answers** only get one-letter fixes on 6+ letter words. This stops random words matching obscure entries.

### Missed-answers log

Every guess that doesn't count is saved on the device. **Settings → Missed answers log** shows them grouped by prompt, with a Copy button. Send that list in to get real answers added.

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
| `js/data*.js` | prompt bank: 153 prompts of tiered answers with aliases and gem facts |
| `js/categories.js` | the eight category groups for category digs |
| `js/engine.js` | rules, answer matching, daily schedule, scoring, share text |
| `js/sprites.js` | procedural pixel-art creatures |
| `js/scene.js` | the underground cross-section and the digging centipede |
| `js/audio.js` | synthesised sound effects |
| `js/app.js` | game flow, saving, screens, modals |

## Editing prompts

Each prompt lists answers by tier (`p c s r d k` = Topsoil, Too Clever, Burrower, Rare, Deep Cut, One in a Centapillion), separated by `|`. Aliases follow the main name after `=`, for example `Eswatini=swaziland`. The gem's fun fact follows `::`. `npm test` fails if two answers in a prompt collide, the gem duplicates a lower-tier answer, a tier is missing, the gem has no fact, or a prompt has fewer than 30 answers.

## Differences from krillion.io

- Krillion ranks answers from a server-side database of how common they are. Centapillion's tiers are set by hand plus the build script above, and the game runs entirely in the browser.
- There is no "better than X% of players" line, because there is no server to count other players.
- Progress is saved in the browser's localStorage only.
