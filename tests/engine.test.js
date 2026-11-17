// Run with: node tests/engine.test.js
const assert = require("node:assert/strict");
const path = require("node:path");
for (const f of ["data.js", "data2.js", "data3.js", "data4.js", "data5.js", "data6.js", "data-extra.js"]) {
  const fp = path.join(__dirname, "../js", f);
  if (require("node:fs").existsSync(fp)) require(fp);
}
const CP = require(path.join(__dirname, "../js/engine.js"));
const E = CP.engine;
const BANK = CP.PROMPTS;

let failures = 0, passes = 0;
function test(name, fn) {
  try { fn(); passes++; }
  catch (e) { failures++; console.error("FAIL " + name + "\n  " + e.message); }
}

// ---------- data integrity ----------
test("bank has enough prompts for distinct daily sets", () => {
  assert.ok(BANK.length >= CP.CONFIG.ROUNDS * 4, "only " + BANK.length + " prompts");
});

test("prompt ids are unique", () => {
  const ids = BANK.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

for (const p of BANK) {
  test(`[${p.id}] every tier present, exactly one centapillion`, () => {
    for (const t of CP.TIER_IDS) assert.ok(p.t[t] && p.t[t].trim(), "missing tier " + t);
    assert.equal(p.t.k.split("|").length, 1, "k tier must hold one answer");
  });
  test(`[${p.id}] no answer key collides with another answer`, () => {
    const seen = {};
    const clashes = [];
    for (const t of CP.TIER_IDS) {
      for (const entry of p.t[t].split("|")) {
        const names = entry.split("::")[0].split("=").map(s => s.trim()).filter(Boolean);
        assert.ok(names.length, "empty entry in tier " + t);
        const own = new Set();
        for (const n of names) {
          const k = E.compact(n);
          assert.ok(k, `"${n}" normalises to nothing`);
          if (own.has(k)) continue;
          own.add(k);
          if (seen[k]) clashes.push(`${n} (${t}) vs ${seen[k]}`);
          else seen[k] = `${names[0]} (${t})`;
        }
      }
    }
    assert.deepEqual(clashes, []);
  });
  test(`[${p.id}] the gem is not a longer spelling of another answer`, () => {
    const idx = E.indexFor(p);
    const gem = idx.answers.find(a => a.tier === "k");
    assert.ok(gem.quip, "gem has no quip");
    const bad = [];
    for (const a of idx.answers) {
      if (a === gem) continue;
      for (const k of a.keys) for (const g of gem.keys) {
        if (k.length >= 4 && g !== k && (g.startsWith(k) || k.startsWith(g))) bad.push(`${a.name} (${a.tier}) ~ ${gem.name}`);
      }
    }
    assert.deepEqual([...new Set(bad)], []);
  });
  test(`[${p.id}] has a krillion-sized answer set`, () => {
    const n = E.indexFor(p).answers.length;
    assert.ok(n >= 30, n + " answers");
  });
  test(`[${p.id}] every answer can be looked up by its own name`, () => {
    for (const a of E.indexFor(p).answers) {
      const hit = E.lookup(p, a.name);
      assert.ok(hit, a.name + " not found");
      assert.ok(hit === a, a.name + " (" + a.tier + ") resolved to " + hit.name + " (" + hit.tier + ")");
    }
  });
}

// ---------- matching ----------
const fruit = BANK.find(p => p.id === "fruit");
const africa = BANK.find(p => p.id === "africa");
const element = BANK.find(p => p.id === "element");
const lang = BANK.find(p => p.id === "language");
const pres = BANK.find(p => p.id === "president");

test("normalize strips case, accents, punctuation, leading article", () => {
  assert.equal(E.normalize("  The Côte d'Ivoire!! "), "cote divoire");
  assert.equal(E.compact("Wreck-It Ralph"), "wreckitralph");
});

test("exact, case and spacing variants accepted", () => {
  for (const s of ["apple", "APPLE", " Apple ", "app le"]) {
    const r = E.judge(fruit, s, []);
    assert.equal(r.status, "accepted", s);
    assert.equal(r.answer.name, "Apple");
  }
});

test("aliases map to the canonical answer", () => {
  assert.equal(E.judge(fruit, "pitaya", []).answer.name, "Dragon Fruit");
  assert.equal(E.judge(africa, "Swaziland", []).answer.name, "Eswatini");
  assert.equal(E.judge(africa, "Côte d’Ivoire", []).answer.name, "Ivory Coast");
  assert.equal(E.judge(pres, "FDR", []).answer.name, "Franklin D. Roosevelt");
});

test("plurals accepted", () => {
  assert.equal(E.judge(fruit, "apples", []).answer.name, "Apple");
  assert.equal(E.judge(fruit, "cherries", []).answer.name, "Cherry");
  assert.equal(E.judge(fruit, "peaches", []).answer.name, "Peach");
});

test("symbols in names (C++, C#, F#) resolve", () => {
  assert.equal(E.judge(lang, "c++", []).answer.name, "C++");
  assert.equal(E.judge(lang, "C#", []).answer.name, "C#");
  assert.equal(E.judge(lang, "c", []).answer.name, "C");
  assert.equal(E.judge(lang, "f#", []).answer.name, "F#");
});

test("duplicates rejected, including via alias", () => {
  const first = E.judge(fruit, "dragon fruit", []);
  assert.equal(first.status, "accepted");
  const again = E.judge(fruit, "pitaya", [first.answer.id]);
  assert.equal(again.status, "duplicate");
});

test("confident typos are auto-fixed; doubtful ones ask first", () => {
  const r = E.judge(fruit, "pinapple", []);
  assert.equal(r.status, "accepted");
  assert.equal(r.corrected, true);
  assert.equal(r.answer.name, "Pineapple");
  const dino = BANK.find(p => p.id === "dinosaur");
  const q = E.judge(dino, "tyrannosau", []);
  assert.equal(q.status, "correction");
  assert.equal(q.to, "T. Rex");
  assert.equal(E.judge(dino, q.to, []).status, "accepted");
});

test("forced (time-up) typo is accepted", () => {
  const r = E.judge(fruit, "pinapple", [], true);
  assert.equal(r.status, "accepted");
  assert.equal(r.answer.name, "Pineapple");
});

test("three-letter words never fuzzy-match", () => {
  assert.equal(E.judge(fruit, "fog", []).status, "rejected");
  assert.equal(E.judge(element, "tim", []).status, "rejected");
});

test("garbage and empty input", () => {
  assert.equal(E.judge(fruit, "", []).status, "empty");
  assert.equal(E.judge(fruit, "   ", []).status, "empty");
  assert.equal(E.judge(fruit, "!!!", []).status, "empty");
  assert.equal(E.judge(fruit, "carburettor", []).status, "rejected");
  assert.equal(E.judge(fruit, "x".repeat(500), []).status, "rejected");
});

test("typo of an already-found answer reports duplicate", () => {
  const a = E.judge(fruit, "pineapple", []).answer;
  assert.equal(E.judge(fruit, "pinapple", [a.id]).status, "duplicate");
});

test("edit distance", () => {
  assert.equal(E.editDistance("abc", "abc", 2), 0);
  assert.equal(E.editDistance("abc", "acb", 2), 1);
  assert.equal(E.editDistance("kitten", "sitting", 5), 3);
  assert.ok(E.editDistance("a", "abcdef", 2) > 2);
});

// ---------- schedule ----------
test("day numbering", () => {
  assert.equal(E.dayNumber(new Date(2026, 10, 16, 0, 1)), 1);
  assert.equal(E.dayNumber(new Date(2026, 10, 16, 23, 59)), 1);
  assert.equal(E.dayNumber(new Date(2026, 10, 17, 0, 0)), 2);
  assert.equal(E.dayNumber(new Date(2027, 2, 15, 12)), 120); // across DST change
  assert.equal(E.dayNumber(E.dateForDay(77)), 77);
});

test("each day has 7 distinct prompts and is deterministic", () => {
  for (let d = 1; d <= 400; d++) {
    const a = E.promptsForDay(d, BANK).map(p => p.id);
    assert.equal(a.length, CP.CONFIG.ROUNDS, "day " + d);
    assert.equal(new Set(a).size, a.length, "dup on day " + d);
    assert.deepEqual(a, E.promptsForDay(d, BANK).map(p => p.id));
  }
});

test("consecutive days within a pass do not repeat prompts", () => {
  const perPass = Math.floor(BANK.length / CP.CONFIG.ROUNDS);
  const seen = new Set();
  for (let d = 1; d <= perPass; d++) {
    for (const p of E.promptsForDay(d, BANK)) {
      assert.ok(!seen.has(p.id), p.id + " repeated by day " + d);
      seen.add(p.id);
    }
  }
});

test("random prompts are 7 distinct", () => {
  for (let s = 0; s < 200; s++) {
    const ids = E.randomPrompts(BANK, s * 31337).map(p => p.id);
    assert.equal(new Set(ids).size, CP.CONFIG.ROUNDS);
  }
});

// ---------- scoring ----------
test("ranks use Krillion's points and colours with digging names", () => {
  assert.deepEqual(CP.TIER_IDS.map(t => CP.TIERS[t].score), [10, 15, 30, 60, 85, 100]);
  assert.deepEqual(CP.TIER_IDS.map(t => CP.TIERS[t].color), ["#d7e1f2", "#ff9f43", "#4de3ff", "#ff5252", "#9d7bff", "#ffd166"]);
  assert.deepEqual(CP.TIER_IDS.map(t => CP.TIERS[t].name), ["Topsoil", "Too Clever", "Burrower", "Rare", "Deep Cut", "Mother Lode"]);
  assert.deepEqual(CP.TIER_IDS.map(t => CP.TIERS[t].depth), [0.08, 0.18, 0.36, 0.6, 0.82, 0.97]);
});

test("accepted answers carry their tier's points", () => {
  for (const p of BANK) for (const a of E.indexFor(p).answers) assert.equal(a.score, CP.TIERS[a.tier].score);
  const dog = BANK.find(p => p.id === "dog");
  assert.equal(E.judge(dog, "labrador", []).answer.score, 10);
  assert.equal(E.judge(dog, "pug", []).answer.score, 30);
  assert.equal(E.judge(dog, "akita", []).answer.score, 60);
  assert.equal(E.judge(dog, "komondor", []).answer.score, 85);
  assert.equal(E.judge(dog, "peruvian inca orchid", []).answer.score, 100);
});

test("30 second rounds with no answer cap", () => {
  assert.equal(CP.CONFIG.ANSWER_MS, 30000);
  assert.equal(CP.CONFIG.MAX_ANSWERS, Infinity);
});

test("Krillion scoring: each round scores its best answer, out of 700", () => {
  const results = [
    { promptId: "x", answers: [{ tier: "p", score: 10 }, { tier: "k", score: 100 }, { tier: "s", score: 30 }] },
    { promptId: "y", answers: [] },
    { promptId: "z", answers: [{ tier: "d", score: 85 }] }
  ];
  assert.equal(E.roundScore(results[0]), 100);
  assert.equal(E.roundScore(results[1]), 0);
  assert.equal(E.bestAnswer(results[0]).tier, "k");
  assert.equal(E.totalScore(results), 185);
  assert.equal(CP.MAX_DAY_SCORE, 700);
});

test("Krillion's score bands", () => {
  const at = n => E.bandFor(n).tier;
  assert.deepEqual([0, 150, 151, 250, 251, 350, 351, 449, 450, 700].map(at), ["p", "p", "s", "s", "r", "r", "d", "d", "k", "k"]);
  assert.deepEqual(CP.BANDS.map(b => b.range), ["0–150", "151–250", "251–350", "351–449", "450+"]);
});

test("share text: title, one emoji per round, score", () => {
  const results = [
    { answers: [{ tier: "p", score: 10 }, { tier: "k", score: 100 }] }, { answers: [] }, { answers: [{ tier: "d", score: 85 }] },
    { answers: [{ tier: "c", score: 15 }] }, { answers: [{ tier: "s", score: 30 }] }, { answers: [{ tier: "r", score: 60 }] }, { answers: [] }
  ];
  assert.equal(E.shareText({ mode: "daily", game: 3, results }), "Centapillion #3 🐛\n🌟⬛🔮🤡🪱💎⬛\n290/700 · -2,900 m");
  assert.ok(E.shareText({ mode: "unlimited", game: 9, results }).startsWith("Centapillion ∞ #9"));
});

test("a prompt never returns within 10 days", () => {
  const last = {};
  for (let d = 1; d <= 400; d++) {
    for (const p of E.promptsForDay(d, BANK)) {
      if (last[p.id]) assert.ok(d - last[p.id] >= 10, p.id + " back after " + (d - last[p.id]) + " days (day " + d + ")");
      last[p.id] = d;
    }
  }
});

test("unlimited digs are deterministic and distinct from each other", () => {
  const a = E.promptsForUnlimited(5, BANK).map(p => p.id), b = E.promptsForUnlimited(5, BANK).map(p => p.id);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, E.promptsForUnlimited(6, BANK).map(p => p.id));
});

// ---------- generated answers ----------
test("generated answers load and each resolves to itself", () => {
  assert.ok(CP.EXTRA && Object.keys(CP.EXTRA).length >= 30);
  let n = 0;
  for (const p of BANK) {
    for (const a of E.indexFor(p).answers.filter(x => x.extra)) {
      n++;
      assert.ok(["s", "r", "d"].includes(a.tier), a.name + " has tier " + a.tier);
      assert.equal(E.lookup(p, a.name), a, p.id + ": " + a.name);
    }
  }
  assert.ok(n > 15000, n + " generated answers");
});

test("hand tiers win over generated answers", () => {
  for (const p of BANK) {
    const hand = new Set();
    for (const a of E.indexFor(p).answers) {
      if (!a.extra) a.keys.forEach(k => hand.add(k));
      else assert.ok(!hand.has(a.id), p.id + ": generated duplicate " + a.name);
    }
  }
});

test("no everyday words slip in as generated answers", () => {
  const P = id => BANK.find(p => p.id === id);
  for (const [id, w] of [["spokenlang", "anal"], ["spokenlang", "sake"], ["river", "milk"], ["river", "white"], ["cheese", "butter"], ["sport", "table sports"]]) {
    assert.equal(E.judge(P(id), w, []).status === "accepted", false, id + ": " + w);
  }
});

// ---------- spell check ----------
const P = id => BANK.find(p => p.id === id);
test("common misspellings are accepted without a confirm step", () => {
  const cases = [["dog", "golden retreiver", "Golden Retriever"], ["dog", "dalmation", "Dalmatian"], ["dog", "chiuaua", "Chihuahua"],
    ["dog", "rotweiler", "Rottweiler"], ["dessert", "tiramisoo", "Tiramisu"], ["vegetable", "brocolli", "Broccoli"],
    ["vegetable", "zuchini", "Zucchini"], ["fruit", "pinapple", "Pineapple"], ["fruit", "bannana", "Banana"],
    ["fruit", "rasberry", "Raspberry"], ["dinosaur", "velocirapter", "Velociraptor"], ["element", "magnesuim", "Magnesium"],
    ["cheese", "parmesean", "Parmesan"], ["cheese", "mozarella", "Mozzarella"], ["harrypotter", "hermoine", "Hermione Granger"],
    ["spice", "cinamon", "Cinnamon"], ["spokenlang", "portugese", "Portuguese"], ["pokemon", "pikachoo", "Pikachu"],
    ["capital", "copenhagan", "Copenhagen"], ["instrument", "xylaphone", "Xylophone"], ["dinosaur", "tyranosaurus rex", "T. Rex"]];
  for (const [id, typed, want] of cases) {
    const r = E.judge(P(id), typed, []);
    assert.equal(r.status, "accepted", typed);
    assert.equal(r.answer.name, want, typed);
  }
});

test("category words, word order and shorthands don't matter", () => {
  const cases = [["lake", "baikal", "Lake Baikal"], ["lake", "baikal lake", "Lake Baikal"], ["river", "the amazon river", "Amazon"],
    ["mountain", "mt everest", "Mount Everest"], ["texascity", "ft worth", "Fort Worth"], ["dog", "pug dog", "Pug"],
    ["shark", "tiger", "Tiger Shark"], ["dog", "labs", "Labrador"]];
  for (const [id, typed, want] of cases) assert.equal(E.judge(P(id), typed, []).answer.name, want, typed);
});

test("wrong answers are still rejected", () => {
  const neg = { fruit: ["chair", "lion", "pencil", "onion", "bread"], dog: ["cat", "lion", "horse", "table"],
    spokenlang: ["table", "chair", "pizza", "banana", "guitar", "hello", "london", "computer"], cheese: ["bread", "table", "pizza", "apple"],
    dinosaur: ["dragon", "lizard", "shark", "chicken"], mammal: ["shark", "spider", "snake", "eagle"], bird: ["bee", "dog", "plane"],
    element: ["water", "fire", "air", "steel", "bronze"], sport: ["table", "pizza", "apple"] };
  for (const [id, ws] of Object.entries(neg)) for (const w of ws) {
    assert.notEqual(E.judge(P(id), w, []).status, "accepted", id + ": " + w);
  }
});

test("judging stays fast on the biggest answer lists", () => {
  const t = Date.now();
  for (let i = 0; i < 50; i++) E.judge(P("spokenlang"), "zzqxjvv" + i, []);
  assert.ok(Date.now() - t < 2000, (Date.now() - t) + " ms for 50 misses");
});

console.log(`${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
