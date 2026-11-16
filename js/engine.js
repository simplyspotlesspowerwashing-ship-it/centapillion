/*
 * Centapillion game engine: rules, answer matching, daily schedule,
 * scoring and share text. No DOM access, so it runs in Node for tests.
 */
(function (root) {
  var CP = (root.CP = root.CP || {});

  var CONFIG = {
    ROUNDS: 7,
    PREVIEW_MS: 3000,
    ANSWER_MS: 45000,
    MAX_ANSWERS: 5,
    METRES_PER_POINT: 10,
    // Day #1. Local midnight of this date.
    EPOCH: [2026, 10, 16],
    // When time runs out, a submitted answer is held this long for a reply.
    GRACE_MS: 4000
  };

  // Rarity tiers, shallowest to deepest.
  var TIERS = {
    p: { id: "p", key: "earthworm", name: "Earthworm", score: 10, emoji: "🪱", color: "#ff8fa3",
         blurb: "The answer everyone digs up first.", depth: 0.08 },
    c: { id: "c", key: "foolsgold", name: "Fool's Gold", score: 15, emoji: "🪙", color: "#e6c84a",
         blurb: "A famously “obscure” pick. Everyone grabs it.", depth: 0.18 },
    s: { id: "s", key: "beetle", name: "Beetle", score: 30, emoji: "🪲", color: "#5fd36b",
         blurb: "Solid. Tunnels with the crowd.", depth: 0.36 },
    r: { id: "r", key: "mole", name: "Mole", score: 60, emoji: "⛏️", color: "#4de3ff",
         blurb: "Genuinely uncommon. Nice dig.", depth: 0.6 },
    d: { id: "d", key: "wyrm", name: "Magma Wyrm", score: 85, emoji: "🌋", color: "#ff6b3d",
         blurb: "True obscurity. Few dig this deep.", depth: 0.82 },
    k: { id: "k", key: "centapillion", name: "One in a Centapillion", score: 100, emoji: "🐛", color: "#ffd166",
         blurb: "The designated gem. Earth's core.", depth: 0.97 }
  };
  var TIER_IDS = ["p", "c", "s", "r", "d", "k"];
  var MISS_EMOJI = "⬛";

  // Score bands for a whole dig (7 rounds, up to 5 answers each).
  var BANDS = [
    { min: 0, tier: "p", range: "0–299", verdict: "Topsoil. Plenty of planet left down there." },
    { min: 300, tier: "s", range: "300–599", verdict: "Beetle. Tunnelling with the crowd." },
    { min: 600, tier: "r", range: "600–999", verdict: "Mole. Past the bedrock. Nice." },
    { min: 1000, tier: "d", range: "1000–1499", verdict: "Magma Wyrm. Seriously deep dig." },
    { min: 1500, tier: "k", range: "1500+", verdict: "One in a centapillion. Core dweller. Absurd." }
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

  function normalize(raw) {
    var s = stripDiacritics(String(raw || "")).toLowerCase();
    s = s.replace(/&/g, " and ").replace(/\+/g, "plus").replace(/#/g, "sharp");
    s = s.replace(/['’`]/g, "");
    s = s.replace(/[^a-z0-9]+/g, " ").trim();
    s = s.replace(/^(the|a|an) /, "");
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
    }
    return out;
  }

  var indexCache = {};
  function indexFor(prompt) {
    if (indexCache[prompt.id]) return indexCache[prompt.id];
    var answers = [];
    var map = {};
    TIER_IDS.forEach(function (tid) {
      var list = prompt.t[tid];
      if (!list) return;
      list.split("|").forEach(function (entry) {
        var names = entry.split("=").map(function (x) { return x.trim(); }).filter(Boolean);
        if (!names.length) return;
        var a = { id: compact(names[0]), name: names[0], tier: tid, score: TIERS[tid].score, keys: [] };
        names.forEach(function (n) {
          var k = compact(n);
          if (!k) return;
          a.keys.push(k);
          // First listing wins if two entries share a key.
          if (!(k in map)) map[k] = answers.length;
        });
        answers.push(a);
      });
    });
    var idx = { answers: answers, map: map, keys: Object.keys(map) };
    indexCache[prompt.id] = idx;
    return idx;
  }

  function lookup(prompt, raw) {
    var idx = indexFor(prompt);
    var vs = variants(compact(raw));
    for (var i = 0; i < vs.length; i++) {
      if (vs[i] in idx.map) return idx.answers[idx.map[vs[i]]];
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
    if (len < 5) return 0;
    if (len < 9) return 1;
    return 2;
  }

  // Nearest accepted answer to a typo, or null when none is close or two tie.
  function nearest(prompt, raw) {
    var idx = indexFor(prompt);
    var key = compact(raw);
    var cap = allowedTypos(key.length);
    if (!cap) return null;
    var best = null, bestD = cap + 1, tie = false;
    for (var i = 0; i < idx.keys.length; i++) {
      var k = idx.keys[i];
      if (allowedTypos(k.length) === 0) continue;
      var d = editDistance(key, k, Math.min(cap, bestD));
      if (d < bestD) { bestD = d; best = idx.answers[idx.map[k]]; tie = false; }
      else if (d === bestD && best && idx.answers[idx.map[k]] !== best) tie = true;
    }
    if (!best || bestD > cap || tie) return null;
    return best;
  }

  /*
   * Judge one submission.
   *   found: array of answer ids already scored this round
   *   force: true when time ran out; typos are then accepted outright
   * Returns { status: "accepted" | "duplicate" | "correction" | "rejected" | "empty", answer?, to? }
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
      if (found.indexOf(near.id) !== -1) return { status: "duplicate", answer: near };
      if (force) return { status: "accepted", answer: near, corrected: true };
      return { status: "correction", answer: near, to: near.name };
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
  function promptsForDay(n, bank) {
    var N = bank.length;
    var out = [];
    var pos = Math.max(0, n - 1) * CONFIG.ROUNDS;
    var guard = 0;
    while (out.length < CONFIG.ROUNDS && guard < N * 3) {
      var pass = Math.floor(pos / N);
      var order = shuffled(N, 0x5eed + pass * 7919);
      var p = bank[order[pos % N]];
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

  // Best possible score for a set of prompts: the top MAX_ANSWERS answers of each.
  function maxScore(prompts) {
    return prompts.reduce(function (sum, p) {
      var scores = indexFor(p).answers.map(function (a) { return a.score; }).sort(function (a, b) { return b - a; });
      return sum + scores.slice(0, CONFIG.MAX_ANSWERS).reduce(function (s, x) { return s + x; }, 0);
    }, 0);
  }

  function bandFor(score) {
    for (var i = BANDS.length - 1; i >= 0; i--) if (score >= BANDS[i].min) return BANDS[i];
    return BANDS[0];
  }

  function fmtMetres(m) {
    return m.toLocaleString("en-US") + " m";
  }

  function rowEmoji(round) {
    var a = round.answers || [];
    if (!a.length) return MISS_EMOJI;
    return a.map(function (x) { return TIERS[x.tier].emoji; }).join("");
  }

  function shareText(opts) {
    var label = opts.mode === "unlimited" ? "Centapillion ∞ #" + opts.game
      : opts.mode === "archive" ? "Centapillion ⟲ #" + opts.game
      : "Centapillion #" + opts.game;
    var score = totalScore(opts.results);
    var lines = [label + " 🐛", score + " pts · -" + fmtMetres(score * CONFIG.METRES_PER_POINT)];
    opts.results.forEach(function (r) { lines.push(rowEmoji(r)); });
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
  CP.STRATA = STRATA;
  CP.LANDMARKS = LANDMARKS;
  CP.engine = {
    normalize: normalize, compact: compact, indexFor: indexFor, lookup: lookup,
    editDistance: editDistance, nearest: nearest, judge: judge,
    mulberry32: mulberry32, dayNumber: dayNumber, dateForDay: dateForDay,
    promptsForDay: promptsForDay, randomPrompts: randomPrompts,
    roundScore: roundScore, totalScore: totalScore, maxScore: maxScore,
    bandFor: bandFor, fmtMetres: fmtMetres, shareText: shareText, rowEmoji: rowEmoji,
    answerSheet: answerSheet
  };
  if (typeof module !== "undefined" && module.exports) module.exports = CP;
})(typeof window !== "undefined" ? window : globalThis);
