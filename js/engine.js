/*
 * Centapillion game engine: rules, answer matching, daily schedule,
 * scoring and share text. No DOM access, so it runs in Node for tests.
 */
(function (root) {
  var CP = (root.CP = root.CP || {});

  var CONFIG = {
    ROUNDS: 7,
    PREVIEW_MS: 3000,
    ANSWER_MS: 30000,
    MAX_ANSWERS: Infinity, // no cap: every accepted answer scores
    METRES_PER_POINT: 10,
    // Day #1. Local midnight of this date.
    EPOCH: [2026, 10, 16],
    // When time runs out, a submitted answer is held this long for a reply.
    GRACE_MS: 4000
  };

  // Rarity tiers, most common to rarest. Colours follow the white, orange,
  // blue, red, purple, gold ladder.
  var TIERS = {
    p: { id: "p", key: "common", name: "Common", score: 10, emoji: "⬜", color: "#e8ecf4",
         blurb: "The answer everyone digs up first.", depth: 0.08 },
    c: { id: "c", key: "tooclever", name: "Too Clever", score: 15, emoji: "🟧", color: "#ff9f43",
         blurb: "The “obscure” pick everyone reaches for.", depth: 0.18 },
    s: { id: "s", key: "uncommon", name: "Uncommon", score: 30, emoji: "🟦", color: "#4de3ff",
         blurb: "Solid. Tunnels with the crowd.", depth: 0.36 },
    r: { id: "r", key: "rare", name: "Rare", score: 60, emoji: "🟥", color: "#ff5252",
         blurb: "Genuinely uncommon. Nice dig.", depth: 0.6 },
    d: { id: "d", key: "deepcut", name: "Deep Cut", score: 85, emoji: "🟪", color: "#9d7bff",
         blurb: "True obscurity. Few dig this deep.", depth: 0.82 },
    k: { id: "k", key: "centapillion", name: "One in a Centapillion", score: 100, emoji: "🟨", color: "#ffd166",
         blurb: "The designated gem. Earth's core.", depth: 0.97 }
  };
  var TIER_IDS = ["p", "c", "s", "r", "d", "k"];
  var MISS_EMOJI = "⬛";

  // Score bands for a whole dig (7 rounds, unlimited answers, 30 s each).
  var BANDS = [
    { min: 0, tier: "p", range: "0–399", verdict: "Common. Still in the topsoil." },
    { min: 400, tier: "s", range: "400–799", verdict: "Uncommon. Tunnelling with the crowd." },
    { min: 800, tier: "r", range: "800–1,199", verdict: "Rare. Past the bedrock. Nice." },
    { min: 1200, tier: "d", range: "1,200–1,799", verdict: "Deep cut. Seriously deep dig." },
    { min: 1800, tier: "k", range: "1,800+", verdict: "One in a centapillion. Core dweller. Absurd." }
  ];
  var GAUGE_MAX = 2500;

  // Diggers unlocked by your best daily streak.
  var DIGGERS = [
    { id: "classic", name: "The Centipede", streak: 0, body: "#ff7a3d", dark: "#b33a22", hi: "#ffd0a8", says: "skrrt!" },
    { id: "glow", name: "Glow Worm", streak: 5, body: "#4de3ff", dark: "#1f6f8e", hi: "#d8f6ff", says: "bzzt!" },
    { id: "ember", name: "Ember Crawler", streak: 14, body: "#ff5252", dark: "#8c2431", hi: "#ffc2c2", says: "hsss!" },
    { id: "amethyst", name: "Amethyst Crawler", streak: 30, body: "#9d7bff", dark: "#463a68", hi: "#e2d8ff", says: "shing!" },
    { id: "fossil", name: "Fossil Crawler", streak: 45, body: "#e8d5b0", dark: "#8a733d", hi: "#ffffff", says: "rattle!" },
    { id: "gold", name: "Golden Centapede", streak: 60, body: "#ffd166", dark: "#c98f2a", hi: "#fff7d0", says: "ka-ching!" },
    { id: "obsidian", name: "Obsidian Wyrm", streak: 100, body: "#2b2f38", dark: "#05070c", hi: "#9d7bff", says: "…" }
  ];

  // Real-world landmarks drawn on the depth gauge.
  var LANDMARKS = [
    { m: 4000, label: "deepest mine · 4,000 m" },
    { m: 8849, label: "Everest, upside down · 8,849 m" },
    { m: 12262, label: "Kola Superdeep Borehole · 12,262 m" },
    { m: 35000, label: "the Moho · 35,000 m" }
  ];

  var STRATA = [
    { m: 0, name: "TOPSOIL", top: "#6b4226", bottom: "#4f2f1a", speck: "#8a5a35" },
    { m: 1000, name: "CLAY", top: "#8a4a2a", bottom: "#6e3a20", speck: "#a85f38" },
    { m: 3000, name: "FOSSIL BEDS", top: "#7a6a52", bottom: "#5c4f3c", speck: "#c4b49a" },
    { m: 6000, name: "BEDROCK", top: "#3f4450", bottom: "#2b2f38", speck: "#5d6472" },
    { m: 10000, name: "CRYSTAL CAVES", top: "#2a1f40", bottom: "#1c1533", speck: "#9d7bff" },
    { m: 15000, name: "MAGMA", top: "#5c1a0c", bottom: "#3a0f06", speck: "#ff6b3d" },
    { m: 22000, name: "OUTER CORE", top: "#7a3a08", bottom: "#a35a0a", speck: "#ffd166" },
    { m: 30000, name: "INNER CORE", top: "#c98f2a", bottom: "#ffe9a8", speck: "#ffffff" }
  ];

  // ---------- text normalisation and matching ----------

  function stripDiacritics(s) {
    return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
  }

  // Shorthands people type, mapped to one spelling on both sides.
  var TOKEN_SYNONYMS = { st: "saint", ste: "sainte", mt: "mount", mtn: "mountain", ft: "fort", n: "and", vs: "versus", dr: "doctor", jr: "junior", sr: "senior", "1st": "first", "2nd": "second", "3rd": "third" };

  function normalize(raw) {
    var s = stripDiacritics(String(raw || "")).toLowerCase();
    s = s.replace(/&/g, " and ").replace(/\+/g, "plus").replace(/#/g, "sharp");
    s = s.replace(/['’`]/g, "");
    s = s.replace(/[^a-z0-9]+/g, " ").trim();
    s = s.replace(/^(the|a|an) /, "");
    if (s.indexOf(" ") !== -1 || TOKEN_SYNONYMS[s]) {
      s = s.split(" ").map(function (w) { return TOKEN_SYNONYMS[w] || w; }).join(" ");
    }
    return s;
  }

  function compact(raw) {
    return normalize(raw).replace(/ /g, "");
  }

  // Keys tried for a typed answer: as typed, then simple singular forms.
  function variants(key) {
    var out = [key];
    if (key.length > 3) {
      if (/ies$/.test(key)) out.push(key.slice(0, -3) + "y");
      if (/es$/.test(key)) out.push(key.slice(0, -2));
      if (/s$/.test(key)) out.push(key.slice(0, -1));
      if (!/s$/.test(key)) out.push(key + "s");
    }
    return out;
  }

  // A rough sound-alike key: consonant skeleton with common spellings folded
  // ("tiramisoo" and "tiramisu" both give "trms").
  function phonetic(key) {
    var s = key.replace(/ph/g, "f").replace(/ck/g, "k").replace(/q/g, "k").replace(/x/g, "ks").replace(/z/g, "s")
      .replace(/c(?=[eiy])/g, "s").replace(/c/g, "k").replace(/gh/g, "").replace(/^kn/, "n").replace(/^wr/, "r")
      .replace(/^ps/, "s").replace(/mb$/, "m").replace(/dg/g, "j").replace(/sch/g, "sk").replace(/y/g, "i").replace(/w/g, "");
    var first = s.charAt(0);
    var rest = s.slice(1).replace(/[aeiouh]/g, "");
    return (first + rest).replace(/(.)\1+/g, "$1");
  }

  var STOP = { name: 1, a: 1, an: 1, the: 1, of: 1, type: 1, kind: 1, famous: 1, that: 1, is: 1, something: 1, word: 1,
    rhymes: 1, with: 1, ends: 1, "in": 1, or: 1, and: 1, real: 1, life: 1, for: 1, like: 1, member: 1, family: 1, found: 1,
    s: 1, u: 1, letter: 1, piece: 1, item: 1, style: 1, character: 1, lays: 1, eggs: 1, sound: 1, by: 1, has: 1, been: 1 };

  // Words that just repeat the category ("Lake", "River", "Shark", "Cheese"),
  // so "Lake Baikal", "Baikal" and "Baikal lake" all find the same answer.
  // Taken from the question itself plus a fixed list of category nouns.
  var CATEGORY_NOUNS = ("lake river mount mountain falls fall waterfall island islands isle sea ocean desert park national bridge "
    + "city town cheese sauce soup salad bread cake pie cookie tea beer ale dog breed cat shark whale dolphin frog toad snake bird "
    + "tree flower plant fish game movie film song band volcano language disease syndrome dance hat shoe shoes boots style "
    + "pasta noodles dumpling sandwich cocktail coffee candy bar cereal phobia moon constellation instrument").split(" ");
  function genericWords(prompt) {
    var g = {};
    var add = function (w) { g[w] = 1; if (/s$/.test(w)) g[w.slice(0, -1)] = 1; else g[w + "s"] = 1; };
    normalize(prompt.q).split(" ").forEach(function (w) { if (w.length > 2 && !STOP[w]) add(w); });
    CATEGORY_NOUNS.forEach(function (w) { if (prompt.q.toLowerCase().indexOf(w) !== -1 || PROMPT_NOUN_OK[w]) add(w); });
    return g;
  }
  // Nouns safe to drop on any prompt because they only ever name the kind of thing.
  var PROMPT_NOUN_OK = { lake: 1, river: 1, mount: 1, mountain: 1, falls: 1, island: 1, isle: 1, sea: 1, ocean: 1, desert: 1,
    "national": 1, park: 1, bridge: 1, volcano: 1, breed: 1, cheese: 1, language: 1, syndrome: 1 };

  function stripGeneric(norm, g) {
    var t = norm.split(" ");
    while (t.length > 1 && g[t[0]]) t.shift();
    while (t.length > 1 && g[t[t.length - 1]]) t.pop();
    return t.join("");
  }

  function sortedKey(norm) {
    var t = norm.split(" ");
    return t.length > 1 ? t.slice().sort().join("") : null;
  }

  var indexCache = {};
  function indexFor(prompt) {
    if (indexCache[prompt.id]) return indexCache[prompt.id];
    var answers = [];
    var map = {};
    function addList(list, tid, extra) {
      if (!list) return;
      list.split("|").forEach(function (entry) {
        var parts = entry.split("::");
        var names = parts[0].split("=").map(function (x) { return x.trim(); }).filter(Boolean);
        if (!names.length) return;
        var id = compact(names[0]);
        if (!id || (extra && id in map)) return;
        var a = { id: id, name: names[0], tier: tid, score: TIERS[tid].score, keys: [], quip: (parts[1] || "").trim(), extra: !!extra, aliases: names };
        names.forEach(function (n) {
          var k = compact(n);
          if (!k) return;
          a.keys.push(k);
          // First listing wins if two entries share a key; hand answers come first.
          if (!(k in map)) map[k] = answers.length;
        });
        answers.push(a);
      });
    }
    TIER_IDS.forEach(function (tid) { addList(prompt.t[tid], tid, false); });
    var ex = CP.EXTRA && CP.EXTRA[prompt.id];
    if (ex) ["s", "r", "d"].forEach(function (tid) { addList(ex[tid], tid, true); });

    // Secondary keys: category words dropped, and word order ignored.
    var g = genericWords(prompt);
    var alt = {};
    answers.forEach(function (a, i) {
      a.aliases.forEach(function (n) {
        var norm = normalize(n);
        [stripGeneric(norm, g), sortedKey(norm)].forEach(function (k) {
          if (k && k.length >= 3 && !(k in map) && !(k in alt)) alt[k] = i;
        });
      });
    });
    var keys = Object.keys(map).concat(Object.keys(alt));
    var phon = {};
    keys.forEach(function (k) { phon[k] = phonetic(k); });
    var idx = { answers: answers, map: map, alt: alt, keys: keys, phon: phon, generic: g };
    indexCache[prompt.id] = idx;
    return idx;
  }

  function keyAnswer(idx, k) {
    if (k in idx.map) return idx.answers[idx.map[k]];
    if (k in idx.alt) return idx.answers[idx.alt[k]];
    return null;
  }

  function typedKeys(idx, raw) {
    var norm = normalize(raw);
    var out = [norm.replace(/ /g, "")];
    var st = stripGeneric(norm, idx.generic);
    if (st && out.indexOf(st) === -1) out.push(st);
    var so = sortedKey(norm);
    if (so && out.indexOf(so) === -1) out.push(so);
    return out;
  }

  function lookup(prompt, raw) {
    var idx = indexFor(prompt);
    var tk = typedKeys(idx, raw);
    for (var j = 0; j < tk.length; j++) {
      var vs = variants(tk[j]);
      for (var i = 0; i < vs.length; i++) {
        var a = keyAnswer(idx, vs[i]);
        if (a) return a;
      }
    }
    return null;
  }

  // Optimal string alignment distance (Damerau-Levenshtein, adjacent swaps).
  function editDistance(a, b, cap) {
    if (Math.abs(a.length - b.length) > cap) return cap + 1;
    var prev2 = null, prev = [], cur;
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      cur = [i];
      var rowMin = i;
      for (var j2 = 1; j2 <= b.length; j2++) {
        var cost = a[i - 1] === b[j2 - 1] ? 0 : 1;
        var v = Math.min(prev[j2] + 1, cur[j2 - 1] + 1, prev[j2 - 1] + cost);
        if (prev2 && i > 1 && j2 > 1 && a[i - 1] === b[j2 - 2] && a[i - 2] === b[j2 - 1]) {
          v = Math.min(v, prev2[j2 - 2] + 1);
        }
        cur[j2] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > cap) return cap + 1;
      prev2 = prev;
      prev = cur;
    }
    return prev[b.length];
  }

  function allowedTypos(len) {
    if (len < 4) return 0;
    if (len < 6) return 1;
    if (len < 10) return 2;
    return 3;
  }

  var TIER_RANK = { p: 0, c: 1, s: 2, r: 3, d: 4, k: 5 };

  /*
   * Closest accepted answer to a misspelling. Returns
   *   { answer, sure } — sure means close enough to accept without asking —
   * or null. Ties go to the more common answer (that's usually what was meant).
   */
  function nearest(prompt, raw) {
    var idx = indexFor(prompt);
    var tk = typedKeys(idx, raw);
    var best = null;
    tk.forEach(function (t) {
      var cap = allowedTypos(t.length);
      if (!cap) return;
      var tp = phonetic(t);
      for (var i = 0; i < idx.keys.length; i++) {
        var k = idx.keys[i];
        if (k.length < 4 || Math.abs(k.length - t.length) > cap + 1) continue;
        var d = editDistance(t, k, cap + 1);
        var a = keyAnswer(idx, k);
        // Generated answers are mostly obscure names: only fix small slips on long words.
        if (a.extra && (d > 1 || t.length < 6)) continue;
        var sound = !a.extra && t.length >= 5 && idx.phon[k] === tp && d <= 2;
        if (d > cap && !sound) continue;
        var score = sound ? Math.min(d, 1) : d;
        var cand = { answer: a, d: d, score: score, sound: sound, len: Math.abs(k.length - t.length), t: t };
        if (!best || cand.score < best.score ||
            (cand.score === best.score && (TIER_RANK[a.tier] < TIER_RANK[best.answer.tier] ||
              (TIER_RANK[a.tier] === TIER_RANK[best.answer.tier] && cand.len < best.len)))) best = cand;
      }
    });
    if (best) {
      var n = best.t.length;
      best.sure = (best.d <= 1 && n >= 5) || (best.sound && best.d <= 2 && n >= 5) || (best.d <= 2 && n >= 10);
      return best;
    }
    // Unique completion of a long enough start ("tyrannosau" -> Tyrannosaurus).
    var t0 = tk[0];
    if (t0.length >= 5) {
      var hit = null, many = false;
      for (var j = 0; j < idx.keys.length && !many; j++) {
        var key = idx.keys[j];
        if (key.length > t0.length && key.indexOf(t0) === 0 && t0.length >= key.length * 0.6) {
          var ans = keyAnswer(idx, key);
          if (hit && hit !== ans) many = true; else hit = ans;
        }
      }
      if (hit && !many) return { answer: hit, d: 0, sure: false, prefix: true };
    }
    return null;
  }

  /*
   * Judge one submission.
   *   found: array of answer ids already scored this round
   *   force: true when time ran out, or typo checking is off; any close match is accepted
   * Returns { status: "accepted" | "duplicate" | "correction" | "rejected" | "empty", answer?, to?, corrected? }
   */
  function judge(prompt, raw, found, force) {
    var text = String(raw || "").trim();
    if (!compact(text)) return { status: "empty" };
    found = found || [];
    var hit = lookup(prompt, text);
    if (hit) {
      if (found.indexOf(hit.id) !== -1) return { status: "duplicate", answer: hit };
      return { status: "accepted", answer: hit };
    }
    var near = nearest(prompt, text);
    if (near) {
      var a = near.answer;
      if (found.indexOf(a.id) !== -1) return { status: "duplicate", answer: a };
      if (force || near.sure) return { status: "accepted", answer: a, corrected: true };
      return { status: "correction", answer: a, to: a.name };
    }
    return { status: "rejected" };
  }

  // ---------- schedule ----------

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(n, seed) {
    var rnd = mulberry32(seed);
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    for (var j = n - 1; j > 0; j--) {
      var r = Math.floor(rnd() * (j + 1));
      var t = arr[j]; arr[j] = arr[r]; arr[r] = t;
    }
    return arr;
  }

  function epochDate() {
    return new Date(CONFIG.EPOCH[0], CONFIG.EPOCH[1], CONFIG.EPOCH[2]);
  }

  // Day number for a local date (day #1 = launch day). Uses calendar days, so DST is ignored.
  function dayNumber(date) {
    var d = date || new Date();
    var e = epochDate();
    var a = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    var b = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());
    return Math.floor((a - b) / 86400000) + 1;
  }

  function dateForDay(n) {
    var e = epochDate();
    return new Date(e.getFullYear(), e.getMonth(), e.getDate() + (n - 1));
  }

  // Seven distinct prompts for day n. Walks one long sequence made of
  // reshuffled passes over the bank, so every prompt appears once per pass.
  function promptsForDay(n, bank) { return sequenceSet(n, bank, 0x5eed); }
  // Unlimited digs are numbered too, on their own sequence, so they can be replayed.
  function promptsForUnlimited(n, bank) { return sequenceSet(n, bank, 0xd16); }

  // Each pass is a reshuffle of the whole bank. Prompts from the second half
  // of one pass are kept out of the first half of the next, so a prompt never
  // comes back within about half a pass (~11 days with 154 prompts).
  var passCache = {};
  function passOrder(N, salt, pass) {
    var key = N + ":" + salt + ":" + pass;
    if (passCache[key]) return passCache[key];
    var order = shuffled(N, salt + pass * 7919);
    if (pass > 0) {
      var prev = passOrder(N, salt, pass - 1);
      var tail = {};
      prev.slice(Math.floor(N / 2)).forEach(function (i) { tail[i] = true; });
      var head = order.filter(function (i) { return !tail[i]; });
      var rest = order.filter(function (i) { return tail[i]; });
      order = head.concat(rest);
    }
    passCache[key] = order;
    return order;
  }

  function sequenceSet(n, bank, salt) {
    var N = bank.length;
    var out = [];
    var pos = Math.max(0, n - 1) * CONFIG.ROUNDS;
    var guard = 0;
    while (out.length < CONFIG.ROUNDS && guard < N * 3) {
      var pass = Math.floor(pos / N);
      var p = bank[passOrder(N, salt, pass)[pos % N]];
      if (out.indexOf(p) === -1) out.push(p);
      pos++; guard++;
    }
    return out;
  }

  function randomPrompts(bank, seed) {
    var order = shuffled(bank.length, seed >>> 0);
    return order.slice(0, CONFIG.ROUNDS).map(function (i) { return bank[i]; });
  }

  // ---------- scoring ----------

  function roundScore(round) {
    return (round.answers || []).reduce(function (s, a) { return s + a.score; }, 0);
  }

  function totalScore(results) {
    return (results || []).reduce(function (s, r) { return s + roundScore(r); }, 0);
  }

  // Answers sorted rarest first (ties keep the order they were given).
  function byRarity(answers) {
    return answers.map(function (a, i) { return [a, i]; })
      .sort(function (x, y) { return (TIERS[y[0].tier].score - TIERS[x[0].tier].score) || (x[1] - y[1]); })
      .map(function (x) { return x[0]; });
  }

  function bandFor(score) {
    for (var i = BANDS.length - 1; i >= 0; i--) if (score >= BANDS[i].min) return BANDS[i];
    return BANDS[0];
  }

  function fmtMetres(m) {
    return m.toLocaleString("en-US") + " m";
  }

  // One share row per round: rarest first, capped so long rounds stay readable.
  function rowEmoji(round, cap) {
    var a = byRarity(round.answers || []);
    if (!a.length) return MISS_EMOJI;
    cap = cap || 10;
    var row = a.slice(0, cap).map(function (x) { return TIERS[x.tier].emoji; }).join("");
    return a.length > cap ? row + " +" + (a.length - cap) : row;
  }

  function shareText(opts) {
    var label = opts.mode === "unlimited" ? "Centapillion ∞ #" + opts.game
      : opts.mode === "archive" ? "Centapillion ⟲ #" + opts.game
      : "Centapillion #" + opts.game;
    var score = totalScore(opts.results);
    var lines = [label + " 🐛", score + " pts · -" + fmtMetres(score * CONFIG.METRES_PER_POINT)];
    opts.results.forEach(function (r) { lines.push(rowEmoji(r) + " " + roundScore(r)); });
    if (opts.url) lines.push(opts.url);
    return lines.join("\n");
  }

  // Answer sheet for the end screen: the deepest answers per prompt.
  function answerSheet(prompt, limitPerTier) {
    var idx = indexFor(prompt);
    var out = {};
    TIER_IDS.forEach(function (t) { out[t] = []; });
    idx.answers.forEach(function (a) { out[a.tier].push(a); });
    if (limitPerTier) TIER_IDS.forEach(function (t) { out[t] = out[t].slice(0, limitPerTier); });
    return out;
  }

  CP.CONFIG = CONFIG;
  CP.TIERS = TIERS;
  CP.TIER_IDS = TIER_IDS;
  CP.MISS_EMOJI = MISS_EMOJI;
  CP.BANDS = BANDS;
  CP.GAUGE_MAX = GAUGE_MAX;
  CP.DIGGERS = DIGGERS;
  CP.STRATA = STRATA;
  CP.LANDMARKS = LANDMARKS;
  CP.engine = {
    normalize: normalize, compact: compact, phonetic: phonetic, indexFor: indexFor, lookup: lookup,
    editDistance: editDistance, nearest: nearest, judge: judge,
    mulberry32: mulberry32, dayNumber: dayNumber, dateForDay: dateForDay,
    promptsForDay: promptsForDay, promptsForUnlimited: promptsForUnlimited, randomPrompts: randomPrompts,
    roundScore: roundScore, totalScore: totalScore, byRarity: byRarity,
    bandFor: bandFor, fmtMetres: fmtMetres, shareText: shareText, rowEmoji: rowEmoji,
    answerSheet: answerSheet
  };
  if (typeof module !== "undefined" && module.exports) module.exports = CP;
})(typeof window !== "undefined" ? window : globalThis);
