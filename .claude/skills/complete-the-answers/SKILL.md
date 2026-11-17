---
name: complete-the-answers
description: Make Centapillion prompts accept every correct answer a player could type, ranked Krillion-style. Use when a player reports an answer that "isn't in the dirt", before a prompt goes live in the daily or a category set, or when asked to cover today's / this week's prompts.
---

# Complete the answers

Goal: a player should never type a correct answer and see "isn't in the dirt". Niche answers matter most:
the rarer the answer, the more likely it is missing, and the more it hurts.

Repository layout this relies on:
- Hand lists: `js/data*.js` (tiers `p c s r d k`, `=` aliases, `::` gem fact).
- Generated answers: `js/data-extra.js`, built by `tools/build_extra.py` from
  `tools/wikidata/<prompt>.json` (`tools/wikidata_fetch.py`),
  `tools/wikipedia/<prompt>.json` (`tools/wikipedia_fetch.py`),
  `tools/supplement/<prompt>.txt` (hand-written, one answer per line, `=` for other spellings),
  and the open corpora datasets.
- Matching: `js/engine.js` (`lookup`, `nearest`, `partial`, `judge`).

## 1. Pick the prompts

Do the prompts players will see first. Print the daily for today and the next six days:

```bash
node -e 'for (const f of ["data","data2","data3","data4","data5","data6","data7","categories"]) require("./js/"+f+".js");
const CP=require("./js/engine.js"),E=CP.engine,d=E.dayNumber(new Date());
for(let i=0;i<7;i++)console.log(d+i,E.promptsForDay(d+i,CP.PROMPTS).map(p=>p.id).join(" "))'
```

Today's category sets come from `E.promptsForCategory(catId, day, CP.PROMPTS)`.

## 2. Diagnose every reported miss before adding anything

For each miss, find the cause with `E.judge(prompt, text, [])` and by searching the caches. Fix the cause,
not just the one answer. Causes seen so far, and the fix for each:

| Symptom | Cause | Fix |
|---|---|---|
| Real but obscure item missing ("Neenach Volcano", "Bears vs Babies") | Popularity floor in `FLOOR` of `wikidata_fetch.py` | Lower the floor; rarity is ranked later, never filter by fame |
| Item exists on Wikipedia but not in the Wikidata list | Wikidata classifies it oddly | Add or widen Wikipedia categories in `wikipedia_fetch.py` `SPEC` |
| Nickname or short form ("T-bird", "Uno Flip") | Aliases not fetched | Wikidata `skos:altLabel` is fetched; add any others to `tools/supplement/<prompt>.txt` |
| Make, adjective or category word around a real answer ("Ford Focus", "Neenach Volcano") | Extra words | `partial()` in `engine.js` strips 1-2 leading or 1 trailing words |
| One word missing from a long name ("chicken masala") | Shortened name | `partial()` offers it as a confirm; if it is its own thing, add it as an answer |
| Typo plus anything above | Combination | Check `nearest()` is still reachable; add the base answer |
| Names with digits ("Peugeot 205", "Halo 3") | Old cleanup rule | `tidy()` keeps digits now; check it still does |
| Whole query returns too few items | Wrong class or only one level of sub-types | Look up IDs on QLever (step 3), use `P279+` for "types of", `P31/P279*` for instances |

## 3. Widen the sources

1. Wikidata through QLever (fast, no outage throttling):
   look up the class ID by English label, check how items attach (`?y ?p wd:Q…` grouped by `?p`),
   then edit `SPEC` and run `python3 tools/wikidata_fetch.py <prompt>`. Read the top 40 and a middle slice
   of the result for wrong-class items (apple cultivars as fruits, Big Ben as an instrument) and fix the
   query (sub-types only, `MINUS` the wrong class) before blocking names one by one.
2. Wikipedia categories: add the category tree to `tools/wikipedia_fetch.py` and run it for the prompt.
   Keep depth low for people, gods and characters (art, operas and works hide one level down).
   Respect rate limits; it is slow by design.
3. Supplement: write every answer you can think of that a real player might type, especially niche ones,
   regional names, brand names, nicknames, abbreviations and plural/singular forms, into
   `tools/supplement/<prompt>.txt`. Short forms of hand answers become aliases automatically.

## 4. Rebuild and rank

`python3 tools/build_extra.py` merges everything and ranks every prompt as a pyramid:
hand-picked Topsoil and Too Clever, Burrower = top ~6% (8-60), Rare = next 50%, Deep Cut = the rest.
Do not hand-assign Rare or Deep Cut to new answers; familiarity decides.

## 5. Stress-test the prompt (required before calling it done)

1. Write at least 60 answers a real player could type for each prompt, half of them niche, plus typos,
   nicknames, "brand + item" forms and partial names. Run them through `E.judge(prompt, text, [], true)`.
   Every correct one must be accepted or offered as a correction.
2. Run the everyday-word check (top English words must not be accepted unless they are real answers).
3. Run `node tests/engine.test.js` and `BASE=http://localhost:8765 node tests/e2e.js` with Playwright.
4. Check the pyramid still holds (the engine test enforces it).

## 6. Ship

Commit with the coverage numbers, push to the working branch, republish the preview, and tell the user which
prompts are covered and what remains.
