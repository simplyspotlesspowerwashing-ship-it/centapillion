// Run with: node tests/engine.test.js
const assert = require("node:assert/strict");
const path = require("node:path");
require(path.join(__dirname, "../js/data.js"));
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
        const names = entry.split("=").map(s => s.trim()).filter(Boolean);
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
  test(`[${p.id}] every answer can be looked up by its own name`, () => {
    for (const a of E.indexFor(p).answers) {
      const hit = E.lookup(p, a.name);
      assert.ok(hit, a.name + " not found");
      assert.equal(hit.id, a.id, a.name + " resolved to " + hit.name);
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

test("typo gives a correction, not an accept", () => {
  const r = E.judge(fruit, "pinapple", []);
  assert.equal(r.status, "correction");
  assert.equal(r.to, "Pineapple");
  // Submitting the corrected text is accepted.
  assert.equal(E.judge(fruit, r.to, []).status, "accepted");
});

test("forced (time-up) typo is accepted", () => {
  const r = E.judge(fruit, "pinapple", [], true);
  assert.equal(r.status, "accepted");
  assert.equal(r.answer.name, "Pineapple");
});

test("short words never fuzzy-match", () => {
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
test("scores, bands, share text", () => {
  const results = [
    { promptId: "x", answers: [{ tier: "k", score: 100 }, { tier: "p", score: 10 }] },
    { promptId: "y", answers: [] },
    { promptId: "z", answers: [{ tier: "d", score: 85 }] }
  ];
  assert.equal(E.totalScore(results), 195);
  assert.equal(E.bandFor(0).tier, "p");
  assert.equal(E.bandFor(299).tier, "p");
  assert.equal(E.bandFor(300).tier, "s");
  assert.equal(E.bandFor(1500).tier, "k");
  const t = E.shareText({ mode: "daily", game: 3, results });
  assert.equal(t, "Centapillion #3 🐛\n195 pts · -1,950 m\n🐛🪱\n⬛\n🌋");
  assert.ok(E.shareText({ mode: "unlimited", game: 9, results }).startsWith("Centapillion ∞ #9"));
});

test("max score is bounded by 5 answers x 100 x 7", () => {
  const ps = E.promptsForDay(1, BANK);
  const m = E.maxScore(ps);
  assert.ok(m > 0 && m <= 3500, String(m));
});

console.log(`${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
