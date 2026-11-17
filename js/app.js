/* Centapillion: game controller, persistence and UI. */
(function () {
  "use strict";
  var CP = window.CP, E = CP.engine, C = CP.CONFIG, T = CP.TIERS, A = CP.audio;
  var BANK = CP.PROMPTS;
  var BY_ID = {};
  BANK.forEach(function (p) { BY_ID[p.id] = p; });

  var STORE_KEY = "centapillion:v2";
  var $ = function (id) { return document.getElementById(id); };

  // ---------- persistence ----------
  function blankStore() {
    return {
      settings: { muted: false, reduced: false, lowPower: false, typoCheck: true, clearRejected: false, digger: "classic" },
      daily: {}, archive: {}, archiveBest: {},
      unlimited: { games: {}, best: {}, last: 0 },
      missed: []
    };
  }
  function loadStore() {
    var b = blankStore();
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!s || typeof s !== "object") return b;
      return {
        settings: Object.assign(b.settings, s.settings || {}),
        daily: s.daily || {}, archive: s.archive || {}, archiveBest: s.archiveBest || {},
        unlimited: Object.assign(b.unlimited, s.unlimited || {}),
        missed: Array.isArray(s.missed) ? s.missed : []
      };
    } catch (e) { return b; }
  }
  var store = loadStore();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* storage blocked: play on without saving */ }
  }

  // ---------- state ----------
  var game = null, prompts = [], scene = null, tickTimer = null, lastSecond = null;
  var pendingCorrection = null, landedTimer = null, sheetSort = "tier";

  function now() { return Date.now(); }
  function today() { return E.dayNumber(new Date()); }

  function newGame(mode, number, ids) {
    return { mode: mode, game: number, promptIds: ids, roundIndex: 0, phase: "intro",
             previewEndsAt: null, answerEndsAt: null, results: [], v: 2 };
  }
  function validGame(g) {
    return g && Array.isArray(g.promptIds) && g.promptIds.length === C.ROUNDS &&
      g.promptIds.every(function (id) { return BY_ID[id]; }) && Array.isArray(g.results);
  }
  function idsFor(list) { return list.map(function (p) { return p.id; }); }

  function gameFor(route) {
    var g;
    if (route.mode === "daily") {
      var n = today();
      g = store.daily[n];
      if (!validGame(g)) { g = newGame("daily", n, idsFor(E.promptsForDay(n, BANK))); store.daily[n] = g; }
    } else if (route.mode === "archive") {
      var d = route.n;
      if (store.daily[d] && store.daily[d].phase === "done" && !store.archive[d]) return store.daily[d];
      g = store.archive[d];
      if (!validGame(g)) { g = newGame("archive", d, idsFor(E.promptsForDay(d, BANK))); store.archive[d] = g; }
    } else {
      var u = route.n || nextUnlimited();
      g = store.unlimited.games[u];
      if (!validGame(g)) { g = newGame("unlimited", u, idsFor(E.promptsForUnlimited(u, BANK))); store.unlimited.games[u] = g; }
      store.unlimited.last = u;
    }
    return g;
  }

  // The unlimited dig to offer next: the last one if unfinished, else the first unplayed.
  function nextUnlimited() {
    var last = store.unlimited.last;
    if (last && store.unlimited.games[last] && store.unlimited.games[last].phase !== "done") return last;
    var n = 1;
    while (store.unlimited.best[n] != null) n++;
    return n;
  }

  function total() { return E.totalScore(game.results); }
  function curRound() { return game.results[game.roundIndex]; }
  function curPrompt() { return prompts[game.roundIndex]; }

  // ---------- routing ----------
  function parseRoute() {
    var h = location.hash.replace(/^#\/?/, "");
    var m = /^archive\/(\d+)$/.exec(h);
    if (m) {
      var d = parseInt(m[1], 10);
      if (d >= 1 && d < today()) return { mode: "archive", n: d };
      return { mode: "daily" };
    }
    m = /^unlimited(?:\/(\d+))?$/.exec(h);
    if (m) return { mode: "unlimited", n: m[1] ? Math.max(1, Math.min(99999, parseInt(m[1], 10))) : 0 };
    return { mode: "daily" };
  }

  function go(hash) {
    if (location.hash === hash) boot(); else location.hash = hash;
  }

  function boot() {
    stopTick();
    closeModal();
    game = gameFor(parseRoute());
    prompts = game.promptIds.map(function (id) { return BY_ID[id]; });
    save();
    scene.reset();
    if (game.phase !== "intro") {
      scene.start();
      rebuildMarkers();
      scene.setDepth(total() * C.METRES_PER_POINT, true);
    }
    resume();
  }

  function rebuildMarkers() {
    var run = 0;
    game.results.forEach(function (r, i) {
      if (i > game.roundIndex || (i === game.roundIndex && game.phase !== "feedback" && game.phase !== "done")) return;
      run += E.roundScore(r);
      scene.addMarker(i, run * C.METRES_PER_POINT, bestTier(r));
    });
  }

  function bestTier(r) {
    var a = E.byRarity(r.answers || []);
    return a.length ? a[0].tier : null;
  }

  function resume() {
    if (game.phase === "intro") return renderIntro();
    if (game.phase === "done") return renderDone();
    if (game.phase === "feedback") return renderFeedback();
    startTick();
    renderPlay();
    tick();
  }

  // ---------- round flow ----------
  function begin() {
    A.unlock();
    scene.start();
    startRound(0);
  }

  function startRound(i) {
    game.roundIndex = i;
    game.phase = "preview";
    game.previewEndsAt = now() + C.PREVIEW_MS;
    game.answerEndsAt = null;
    if (!game.results[i]) game.results[i] = { promptId: game.promptIds[i], answers: [] };
    pendingCorrection = null;
    lastSecond = null;
    save();
    renderPlay();
    startTick();
    tick();
  }

  function startTick() { if (!tickTimer) tickTimer = setInterval(tick, 100); }
  function stopTick() { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } }

  function tick() {
    if (!game) return;
    var t = now();
    if (game.phase === "preview") {
      var left = Math.max(0, game.previewEndsAt - t);
      var cd = $("countdown");
      if (left > 0) {
        var n = String(Math.ceil(left / 1000));
        if (cd.textContent !== n) { cd.textContent = n; cd.classList.remove("pop"); void cd.offsetWidth; cd.classList.add("pop"); A.play("tick"); }
        setTimer(C.ANSWER_MS);
        return;
      }
      cd.textContent = "";
      game.phase = "answering";
      game.answerEndsAt = game.previewEndsAt + C.ANSWER_MS;
      save();
      A.play("go");
      renderPlay();
    }
    if (game.phase === "answering") {
      var rem = game.answerEndsAt - t;
      setTimer(Math.max(0, rem));
      if (rem <= 0) timeUp();
    }
  }

  function setTimer(ms) {
    var secs = Math.ceil(ms / 1000);
    $("timerNum").textContent = String(secs);
    $("timerFill").style.transform = "scaleX(" + Math.max(0, Math.min(1, ms / C.ANSWER_MS)).toFixed(4) + ")";
    var urgent = game.phase === "answering" && ms <= 8000;
    $("timer").classList.toggle("urgent", urgent);
    document.body.classList.toggle("urgent", urgent);
    if (game.phase === "answering" && secs <= 5 && secs > 0 && secs !== lastSecond) A.play("tick");
    lastSecond = secs;
  }

  function timeUp() {
    var draft = $("answer").value;
    if (draft.trim()) {
      var r = E.judge(curPrompt(), draft, foundIds(), true);
      if (r.status === "accepted") addAnswer(r.answer, draft);
    }
    A.play("timeup");
    endRound();
  }

  function foundIds() { return curRound().answers.map(function (a) { return a.id; }); }

  function submit(text) {
    if (!game || game.phase !== "answering") return;
    var raw = String(text || "").trim();
    if (!raw) return;
    var r = E.judge(curPrompt(), raw, foundIds(), !store.settings.typoCheck);
    hideCorrection();
    scene.submitFx();
    if (r.status === "accepted") {
      A.play("submit");
      addAnswer(r.answer, raw);
      $("answer").value = "";
      flashMsg(r.corrected ? "counted as “" + r.answer.name + "”" : "", r.corrected ? "ok" : "");
    } else if (r.status === "correction") {
      pendingCorrection = { from: raw, to: r.to };
      $("answer").value = r.to;
      showCorrection(raw, r.to);
    } else if (r.status === "duplicate") {
      A.play("duplicate");
      flashMsg("already dug up “" + r.answer.name + "”", "warn");
      rejectEntry();
    } else {
      A.play("reject");
      scene.rejectFx();
      flashMsg("“" + raw + "” isn't in the dirt. try another", "bad");
      shakeDock();
      logMiss(raw);
      rejectEntry();
    }
  }

  // Every rejected guess is kept (on this device) so missing answers can be added later.
  function logMiss(raw) {
    var p = curPrompt();
    store.missed.push({ p: p.id, q: p.q, t: raw.slice(0, 80), at: now() });
    if (store.missed.length > 500) store.missed.splice(0, store.missed.length - 500);
    save();
  }

  function missedText() {
    var by = {};
    store.missed.forEach(function (m) { (by[m.q] = by[m.q] || {})[m.t.toLowerCase()] = m.t; });
    return Object.keys(by).map(function (q) {
      return q + ": " + Object.keys(by[q]).map(function (k) { return by[q][k]; }).join(", ");
    }).join("\n");
  }

  function rejectEntry() {
    if (store.settings.clearRejected) $("answer").value = "";
    else $("answer").select();
  }

  function addAnswer(ans, raw) {
    var fromM = total() * C.METRES_PER_POINT;
    curRound().answers.push({ id: ans.id, name: ans.name, tier: ans.tier, score: ans.score, raw: raw });
    save();
    scene.plunge(fromM, ans.tier);
    scene.setDepth(total() * C.METRES_PER_POINT);
    scene.acceptFx(ans.tier);
    A.play("accept", ans.tier);
    showLanded(ans);
    renderHaul();
    renderScore();
  }

  function endRound() {
    if (game.phase !== "answering" && game.phase !== "preview") return;
    game.phase = "feedback";
    game.answerEndsAt = null;
    save();
    var run = E.totalScore(game.results.slice(0, game.roundIndex + 1));
    scene.addMarker(game.roundIndex, run * C.METRES_PER_POINT, bestTier(curRound()));
    stopTick();
    document.body.classList.remove("urgent");
    renderFeedback();
  }

  function next() {
    if (game.phase !== "feedback") return;
    if (game.roundIndex >= C.ROUNDS - 1) return finish();
    A.play("descend");
    startRound(game.roundIndex + 1);
  }

  function finish() {
    game.phase = "done";
    game.finishedAt = now();
    var s = total();
    if (game.mode === "unlimited") store.unlimited.best[game.game] = Math.max(store.unlimited.best[game.game] || 0, s);
    if (game.mode === "archive") store.archiveBest[game.game] = Math.max(store.archiveBest[game.game] || 0, s);
    save();
    A.play("done");
    renderDone();
  }

  // Start the same unlimited or archive dig again; the best score is kept.
  function replay() {
    var fresh = newGame(game.mode, game.game, game.promptIds.slice());
    if (game.mode === "unlimited") store.unlimited.games[game.game] = fresh;
    else if (game.mode === "archive") store.archive[game.game] = fresh;
    else return;
    save();
    boot();
  }

  // ---------- rendering helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function link(href, text, cls) {
    var a = el("a", cls || null, text);
    a.href = href;
    return a;
  }
  function button(text, cls, onClick, id) {
    var b = el("button", cls, text);
    b.type = "button";
    if (id) b.id = id;
    b.addEventListener("click", onClick);
    return b;
  }
  function section(label, hint) {
    var sec = el("section", "sec");
    var head = el("p", "sec-head");
    head.appendChild(el("span", null, label));
    if (hint) head.appendChild(el("span", "sec-hint", hint));
    sec.appendChild(head);
    return sec;
  }

  function setView(v) {
    document.body.dataset.view = v;
    if (scene) scene.quiet = v === "play";
    $("play").hidden = v !== "play";
    $("dock").hidden = v !== "play";
    $("panel").hidden = v === "play";
  }

  function modeLabel() {
    if (game.mode === "unlimited") return "UNLIMITED ∞ #" + game.game;
    if (game.mode === "archive") return "ARCHIVE ⟲ #" + game.game;
    return "DIG #" + game.game;
  }

  function howToList(collapsible) {
    var items = [
      "7 prompts a day. same for everyone.",
      "30 seconds per prompt. name as many answers as you can.",
      "every answer scores. rare answers score big. obvious ones stay shallow.",
      "the pick that feels clever? the colony thought of it too.",
      "typos get one fix-up. submit again to confirm.",
      "every point digs you 10 metres. 1,800 reaches the core.",
      "one dig per day. no second chances."
    ];
    var ul = el("ul", "howto-list");
    items.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    if (!collapsible) return ul;
    var d = el("details", "howto");
    d.appendChild(el("summary", null, "how to play"));
    d.appendChild(ul);
    return d;
  }

  // ---------- screens ----------
  function renderIntro() {
    setView("intro");
    var P = $("panel");
    P.innerHTML = "";
    var card = el("section", "card intro");
    var logo = el("div", "logo");
    var spr = CP.sprites.tierImg("k", 72, "logo-sprite bob");
    spr.title = "poke";
    spr.addEventListener("click", function () { scene.poke(); A.play("tick"); });
    logo.appendChild(spr);
    logo.appendChild(el("h1", "logo-word", "CENTAPILLION"));
    card.appendChild(logo);
    card.appendChild(el("p", "tagline", "one in a centapillion."));
    card.appendChild(el("p", "subline", game.mode === "unlimited" ? "THE ENDLESS DIG" : game.mode === "archive" ? "AN OLD TUNNEL" : "THE DAILY DIG"));
    card.appendChild(el("p", "subline dim", "7 prompts · 30 seconds each · unlimited answers · rarer answers dig deeper"));
    card.appendChild(tierLadder());
    card.appendChild(howToList(true));
    card.appendChild(button("▼ BEGIN DIG ▼", "btn-begin", begin, "beginBtn"));
    var meta = el("div", "intro-meta");
    var left = el("span", null, modeLabel().toLowerCase());
    if (game.mode === "daily") {
      var s = streaks();
      if (s.current) left.textContent += " · streak " + s.current;
    }
    if (game.mode === "unlimited" && store.unlimited.best[game.game] != null) left.textContent += " · best " + store.unlimited.best[game.game];
    meta.appendChild(left);
    var links = el("span", "links");
    links.appendChild(button("ARCHIVE ⟲", "linkish", function () { openModal("archive"); }));
    if (game.mode !== "unlimited") links.appendChild(link("#/unlimited", "UNLIMITED ∞"));
    else links.appendChild(button("DIG LOG ∞", "linkish", function () { openModal("diglog"); }));
    if (game.mode !== "daily") links.appendChild(link("#/", "TODAY'S DIG"));
    meta.appendChild(links);
    card.appendChild(meta);
    P.appendChild(card);
    setTimeout(function () { var b = $("beginBtn"); if (b) b.focus(); }, 30);
  }

  // The six levels, shallowest to deepest, the way they're shown everywhere.
  function tierLadder() {
    var ol = el("ol", "ladder");
    CP.TIER_IDS.forEach(function (t) {
      var li = el("li");
      li.style.setProperty("--tc", T[t].color);
      li.appendChild(CP.sprites.tierImg(t, 22));
      li.appendChild(el("span", "ladder-name", T[t].name));
      li.appendChild(el("b", null, String(T[t].score)));
      ol.appendChild(li);
    });
    return ol;
  }

  function renderPlay() {
    setView("play");
    var p = curPrompt();
    $("roundLabel").textContent = modeLabel() + " · ROUND " + (game.roundIndex + 1) + " / " + C.ROUNDS;
    $("promptText").textContent = p.q;
    var answering = game.phase === "answering";
    var input = $("answer");
    input.disabled = !answering;
    $("digBtn").disabled = !answering;
    $("endRoundBtn").disabled = !answering;
    document.body.classList.toggle("previewing", game.phase === "preview");
    if (answering) {
      if (document.activeElement !== input) input.focus({ preventScroll: true });
    } else {
      input.value = "";
      hideCorrection();
      flashMsg("", "");
    }
    renderHaul();
    renderScore();
  }

  // Answers found this round, newest first.
  function renderHaul() {
    var box = $("haul");
    box.innerHTML = "";
    var answers = curRound() ? curRound().answers : [];
    var head = el("div", "haul-head");
    head.appendChild(el("span", null, answers.length ? answers.length + (answers.length === 1 ? " answer" : " answers") : "no answers yet"));
    head.appendChild(el("b", null, "+" + E.roundScore(curRound() || {})));
    box.appendChild(head);
    var list = el("ul", "haul-list");
    answers.slice().reverse().forEach(function (a, i) {
      var li = el("li", "chip" + (i === 0 ? " fresh" : ""));
      li.style.setProperty("--tc", T[a.tier].color);
      li.title = T[a.tier].name + " · " + a.score;
      li.appendChild(CP.sprites.tierImg(a.tier, 18));
      li.appendChild(el("span", "chip-name", a.name));
      li.appendChild(el("b", "chip-pts", "+" + a.score));
      list.appendChild(li);
    });
    box.appendChild(list);
  }

  function renderScore() {
    var s = total();
    $("scoreNow").textContent = String(s);
    $("depthNow").textContent = "-" + E.fmtMetres(s * C.METRES_PER_POINT);
  }

  function answerInfo(a) {
    var full = E.indexFor(BY_ID[game.promptIds[game.roundIndex]] || curPrompt()).answers;
    for (var i = 0; i < full.length; i++) if (full[i].id === a.id) return full[i];
    return a;
  }

  function showLanded(ans) {
    var box = $("landed");
    var t = T[ans.tier];
    box.innerHTML = "";
    var card = el("div", "landed-card" + (ans.tier === "k" ? " gem" : ""));
    card.style.setProperty("--tc", t.color);
    card.appendChild(CP.sprites.tierImg(ans.tier, 44));
    card.appendChild(el("div", "tname", t.name.toUpperCase()));
    card.appendChild(el("div", "tans", "“" + ans.name + "”"));
    card.appendChild(el("div", "tpts", "+" + ans.score + " PTS · dig " + E.fmtMetres(ans.score * C.METRES_PER_POINT)));
    card.appendChild(el("div", "tsub", answerInfo(ans).quip || t.blurb));
    box.appendChild(card);
    clearTimeout(landedTimer);
    landedTimer = setTimeout(function () { card.classList.add("gone"); }, ans.tier === "k" ? 3200 : 1600);
  }

  function flashMsg(text, kind) {
    var m = $("dockMsg");
    m.textContent = text;
    m.className = "dock-msg" + (kind ? " " + kind : "");
    if (text) { m.classList.remove("pop"); void m.offsetWidth; m.classList.add("pop"); }
  }

  function showCorrection(from, to) {
    var c = $("correction");
    c.innerHTML = "";
    var pill = el("div", "correction-pill");
    var change = el("span", "correction-change");
    change.appendChild(el("span", null, "“" + from + "”"));
    change.appendChild(el("span", "arrow", " → "));
    change.appendChild(el("b", null, "“" + to + "”"));
    pill.appendChild(change);
    pill.appendChild(el("span", "correction-hint", "submit again to confirm · or edit"));
    c.appendChild(pill);
  }
  function hideCorrection() { $("correction").innerHTML = ""; pendingCorrection = null; }

  function shakeDock() {
    var d = $("dock");
    d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake");
  }

  function answerRow(a, prompt) {
    var info = E.indexFor(prompt).answers.filter(function (x) { return x.id === a.id; })[0] || a;
    var li = el("li", "fb-item");
    li.style.setProperty("--tc", T[a.tier].color);
    li.appendChild(CP.sprites.tierImg(a.tier, 30));
    var mid = el("div", "fb-mid");
    mid.appendChild(el("div", "tname", T[a.tier].name.toUpperCase()));
    mid.appendChild(el("div", "tans", a.name));
    if (info.quip) mid.appendChild(el("div", "tsub", info.quip));
    li.appendChild(mid);
    li.appendChild(el("b", "tpts", "+" + a.score));
    return li;
  }

  function renderFeedback() {
    setView("feedback");
    var r = curRound(), p = curPrompt();
    var P = $("panel");
    P.innerHTML = "";
    var card = el("section", "card feedback");
    card.appendChild(el("div", "kicker", modeLabel() + " · ROUND " + (game.roundIndex + 1) + " / " + C.ROUNDS));
    card.appendChild(el("h2", "fb-prompt", p.q));
    var list = el("ul", "fb-list");
    if (!r.answers.length) {
      var miss = el("li", "fb-miss");
      miss.appendChild(el("span", "tname", "DEAD END"));
      miss.appendChild(el("span", "dim", "no answers this round · +0"));
      list.appendChild(miss);
    }
    E.byRarity(r.answers).forEach(function (a) { list.appendChild(answerRow(a, p)); });
    card.appendChild(list);
    card.appendChild(el("div", "fb-total", r.answers.length + " answers · round +" + E.roundScore(r) + " · total " + total() + " · -" + E.fmtMetres(total() * C.METRES_PER_POINT)));
    var gem = E.answerSheet(p).k[0];
    var found = r.answers.some(function (a) { return a.tier === "k"; });
    var g = el("p", "fb-gem");
    g.appendChild(CP.sprites.tierImg("k", 20));
    g.appendChild(el("span", null, found ? " You found the centapillion." : " The centapillion was “" + gem.name + "”. " + (gem.quip || "")));
    card.appendChild(g);
    var last = game.roundIndex >= C.ROUNDS - 1;
    card.appendChild(button(last ? "SEE THE DIG LOG ▼" : "▼ DIG TO ROUND " + (game.roundIndex + 2) + " ▼", "btn-begin", next, "nextBtn"));
    card.appendChild(el("div", "hint", "press enter"));
    P.appendChild(card);
    setTimeout(function () { var n = $("nextBtn"); if (n) n.focus(); }, 30);
  }

  function renderDone() {
    setView("done");
    stopTick();
    var P = $("panel");
    P.innerHTML = "";
    var s = total(), band = E.bandFor(s);
    var card = el("section", "card done");
    card.appendChild(el("div", "kicker", modeLabel() + " · COMPLETE"));
    var big = el("div", "bigscore");
    big.appendChild(el("span", "num", String(s)));
    big.appendChild(el("span", "depth", "-" + E.fmtMetres(s * C.METRES_PER_POINT)));
    card.appendChild(big);
    if (game.mode === "unlimited" && store.unlimited.best[game.game] > s) card.appendChild(el("p", "dim small", "your best on this dig: " + store.unlimited.best[game.game]));
    if (game.mode === "archive" && store.archiveBest[game.game] > s) card.appendChild(el("p", "dim small", "your best on this dig: " + store.archiveBest[game.game]));
    card.appendChild(gauge(s));

    // the bearing: where this score sits among the bands
    var bearing = section("the bearing");
    var bl = el("ul", "bearing");
    CP.BANDS.forEach(function (b) {
      var li = el("li", b === band ? "on" : "");
      li.style.setProperty("--tc", T[b.tier].color);
      li.appendChild(CP.sprites.tierImg(b.tier, 18));
      li.appendChild(el("b", null, b.range));
      li.appendChild(el("span", null, b.verdict));
      bl.appendChild(li);
    });
    bearing.appendChild(bl);
    card.appendChild(bearing);

    var share = E.shareText({ mode: game.mode, game: game.game, results: game.results });
    card.appendChild(el("pre", "share-preview", share));
    var row = el("div", "btn-row");
    row.appendChild(button("COPY RESULT", "btn-begin", function () { copyResult(share); }, "shareBtn"));
    if (navigator.share) row.appendChild(button("SHARE…", "btn-ghost", function () { navigator.share({ text: share }).catch(function () {}); }));
    card.appendChild(row);

    card.appendChild(digChart());

    // the haul: every round, tap for the full answer sheet
    var haul = section("the haul", "tap a round for every answer");
    var sortRow = el("label", "sort-row");
    sortRow.appendChild(el("span", null, "sort answers within tiers"));
    var sel = document.createElement("select");
    sel.id = "sheetSort";
    [["tier", "As listed"], ["az", "A–Z"], ["za", "Z–A"]].forEach(function (o) {
      var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; if (o[0] === sheetSort) op.selected = true; sel.appendChild(op);
    });
    sel.addEventListener("change", function () { sheetSort = sel.value; var open = []; document.querySelectorAll(".sheet-round[open]").forEach(function (d) { open.push(d.dataset.i); }); var fresh = answerSheet(open); $("sheetBox").replaceWith(fresh); });
    sortRow.appendChild(sel);
    haul.appendChild(sortRow);
    haul.appendChild(answerSheet(["0"]));
    card.appendChild(haul);

    // logbook
    var book = section("logbook");
    var st = streaks(), days = dailyDone(), scores = days.map(function (d) { return E.totalScore(store.daily[d].results); });
    var avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : 0;
    book.appendChild(el("p", "logbook", "streak " + st.current + " · played " + days.length + " · avg " + avg + " · best " + (scores.length ? Math.max.apply(null, scores) : 0)));
    card.appendChild(book);

    var nav = el("div", "btn-row");
    if (game.mode === "daily") {
      var nx = el("p", "next-dig"); nx.id = "nextDig"; card.appendChild(nx); updateNextDig();
      nav.appendChild(link("#/unlimited", "KEEP DIGGING ∞", "btn-ghost"));
      nav.appendChild(button("ARCHIVE ⟲", "btn-ghost", function () { openModal("archive"); }));
    } else {
      nav.appendChild(button("PLAY THIS ONE AGAIN ↻", "btn-ghost", replay, "replayBtn"));
      if (game.mode === "unlimited") {
        nav.appendChild(button("NEXT DIG ∞", "btn-ghost", function () { go("#/unlimited/" + nextUnlimitedAfter(game.game)); }, "nextDigBtn"));
        nav.appendChild(button("DIG LOG ∞", "btn-ghost", function () { openModal("diglog"); }));
      } else {
        nav.appendChild(button("CHOOSE A DIFFERENT DAY ⟲", "btn-ghost", function () { openModal("archive"); }));
      }
      nav.appendChild(link("#/", "← TODAY'S DIG", "btn-ghost"));
    }
    card.appendChild(nav);
    P.appendChild(card);
    P.scrollTop = 0;
  }

  function nextUnlimitedAfter(n) {
    var k = n + 1;
    while (store.unlimited.best[k] != null) k++;
    return k;
  }

  // Score gauge with the band boundaries marked.
  function gauge(score) {
    var W = 320, wrap = el("div", "gauge");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " 40");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Score " + score + " on a scale to " + CP.GAUGE_MAX);
    function add(tag, attrs) { var n = document.createElementNS("http://www.w3.org/2000/svg", tag); for (var k in attrs) n.setAttribute(k, attrs[k]); svg.appendChild(n); return n; }
    var x = function (v) { return Math.min(v, CP.GAUGE_MAX) / CP.GAUGE_MAX * W; };
    CP.BANDS.forEach(function (b, i) {
      var end = CP.BANDS[i + 1] ? CP.BANDS[i + 1].min : CP.GAUGE_MAX;
      add("rect", { x: x(b.min), y: 14, width: Math.max(0, x(end) - x(b.min)), height: 6, fill: T[b.tier].color, opacity: 0.35 });
      if (b.min) { add("line", { x1: x(b.min), y1: 12, x2: x(b.min), y2: 24, stroke: T[b.tier].color }); var t = add("text", { x: x(b.min), y: 36, "text-anchor": "middle", "font-size": 8, fill: "#c4b49a" }); t.textContent = b.min.toLocaleString("en-US"); }
    });
    var sx = x(score);
    add("rect", { x: 0, y: 14, width: sx, height: 6, fill: T[E.bandFor(score).tier].color });
    add("polygon", { points: (sx - 5) + ",4 " + (sx + 5) + ",4 " + sx + ",12", fill: "#f4ecdc" });
    wrap.appendChild(svg);
    return wrap;
  }

  function updateNextDig() {
    var nx = $("nextDig");
    if (!nx) return;
    var d = new Date(), mid = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    var ms = mid - d, h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
    nx.textContent = "next dig in " + h + "h " + (m < 10 ? "0" : "") + m + "m " + (s < 10 ? "0" : "") + s + "s";
  }
  setInterval(function () {
    updateNextDig();
    if (game && parseRoute().mode === "daily" && game.mode === "daily" && game.game !== today() && (game.phase === "done" || game.phase === "intro")) {
      toast("midnight passed · a fresh dig is ready");
      boot();
    }
  }, 1000);

  function digChart() {
    var wrap = el("div", "chart");
    var axis = el("div", "chart-axis");
    CP.TIER_IDS.forEach(function (t) {
      var lab = el("span", null, T[t].name);
      lab.style.top = (8 + T[t].depth * 84) + "%";
      lab.style.color = T[t].color;
      axis.appendChild(lab);
    });
    wrap.appendChild(axis);
    var cols = el("div", "chart-cols");
    game.results.forEach(function (r, i) {
      var col = el("div", "chart-col");
      col.title = "Round " + (i + 1) + ": " + prompts[i].q;
      if (!r.answers.length) { var m = el("i", "dot miss"); m.style.top = "3%"; col.appendChild(m); }
      var byTier = {};
      r.answers.forEach(function (a) { (byTier[a.tier] = byTier[a.tier] || []).push(a); });
      Object.keys(byTier).forEach(function (t) {
        var list = byTier[t], perRow = 5;
        list.forEach(function (a, j) {
          var dot = el("i", "dot");
          var row = Math.floor(j / perRow), inRow = Math.min(perRow, list.length - row * perRow), k = j % perRow;
          dot.style.top = (8 + T[t].depth * 84 + row * 4) + "%";
          dot.style.left = (50 + (k - (inRow - 1) / 2) * 15) + "%";
          dot.style.setProperty("--tc", T[t].color);
          dot.title = a.name + " · " + T[t].name + " · +" + a.score;
          col.appendChild(dot);
        });
      });
      col.appendChild(el("span", "chart-r", String(i + 1)));
      cols.appendChild(col);
    });
    wrap.appendChild(cols);
    return wrap;
  }

  function answerSheet(openIdx) {
    var box = el("div", "sheet");
    box.id = "sheetBox";
    game.results.forEach(function (r, i) {
      var p = prompts[i];
      var sec = el("details", "sheet-round");
      sec.dataset.i = String(i);
      if ((openIdx || []).indexOf(String(i)) !== -1) sec.open = true;
      var sum = el("summary");
      sum.appendChild(el("span", "sheet-n", String(i + 1)));
      sum.appendChild(el("span", "sheet-q", p.q));
      sum.appendChild(el("span", "sheet-emo", E.rowEmoji(r, 6)));
      sum.appendChild(el("b", "sheet-pts", "+" + E.roundScore(r)));
      sec.appendChild(sum);
      var sheet = E.answerSheet(p);
      var mine = {};
      r.answers.forEach(function (a) { mine[a.id] = true; });
      ["k", "d", "r", "s", "c", "p"].forEach(function (t) {
        var list = sheet[t].slice();
        if (!list.length) return;
        if (sheetSort === "az") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
        if (sheetSort === "za") list.sort(function (a, b) { return b.name.localeCompare(a.name); });
        var row = el("div", "sheet-tier");
        row.style.setProperty("--tc", T[t].color);
        var head = el("div", "sheet-tier-head");
        head.appendChild(CP.sprites.tierImg(t, 18));
        var found = list.filter(function (a) { return mine[a.id]; }).length;
        head.appendChild(el("span", null, T[t].name + " · " + T[t].score + " · " + found + "/" + list.length));
        row.appendChild(head);
        var names = el("div", "sheet-names");
        // Long generated lists: show the player's answers plus the first 60.
        var shown = list.filter(function (a, i) { return i < 60 || mine[a.id]; });
        shown.forEach(function (a) {
          var n = el("span", "nm" + (mine[a.id] ? " you" : ""), a.name);
          if (a.quip) n.title = a.quip;
          names.appendChild(n);
        });
        if (list.length > shown.length) names.appendChild(el("span", "nm more", "+" + (list.length - shown.length).toLocaleString("en-US") + " more"));
        row.appendChild(names);
        sec.appendChild(row);
      });
      box.appendChild(sec);
    });
    return box;
  }

  function copyResult(text, btnId) {
    var ok = function () { toast("copied ✓"); var b = $(btnId || "shareBtn"); if (b) b.textContent = "COPIED ✓"; };
    var fail = function () { toast("couldn't copy. select the text above"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { fallbackCopy(text) ? ok() : fail(); });
    } else if (fallbackCopy(text)) ok();
    else fail();
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:0;top:0;opacity:0";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  var toastTimer;
  function toast(t) {
    var e = $("toast");
    e.textContent = t; e.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { e.classList.remove("show"); }, 2200);
  }

  // ---------- stats ----------
  function dailyDone() {
    return Object.keys(store.daily).map(Number).filter(function (n) { return store.daily[n] && store.daily[n].phase === "done"; }).sort(function (a, b) { return a - b; });
  }
  function streaks() {
    var days = dailyDone(), set = {};
    days.forEach(function (d) { set[d] = true; });
    var max = 0, run = 0, prev = null;
    days.forEach(function (d) { run = prev !== null && d === prev + 1 ? run + 1 : 1; max = Math.max(max, run); prev = d; });
    var t = today(), cur = 0, start = set[t] ? t : t - 1;
    for (var d = start; set[d]; d--) cur++;
    return { current: cur, max: max };
  }

  function currentDigger() {
    var best = streaks().max;
    var d = CP.DIGGERS.filter(function (x) { return x.id === store.settings.digger; })[0];
    return d && best >= d.streak ? d : CP.DIGGERS[0];
  }

  // ---------- modals ----------
  function openModal(kind) {
    var body = $("modalBody");
    body.innerHTML = "";
    if (kind === "howto") {
      body.appendChild(el("h2", null, "HOW TO DIG"));
      body.appendChild(howToList(false));
      body.appendChild(el("h3", null, "THE LEVELS"));
      var tl = el("ul", "tier-list");
      CP.TIER_IDS.forEach(function (t) {
        var li = el("li");
        li.style.setProperty("--tc", T[t].color);
        li.appendChild(CP.sprites.tierImg(t, 32));
        var mid = el("div");
        mid.appendChild(el("b", null, T[t].name + " · " + T[t].score + " pts · " + E.fmtMetres(T[t].score * C.METRES_PER_POINT)));
        mid.appendChild(el("div", "dim", T[t].blurb));
        li.appendChild(mid);
        tl.appendChild(li);
      });
      body.appendChild(tl);
      body.appendChild(el("h3", null, "SCORE BANDS"));
      var bl = el("ul", "band-list");
      CP.BANDS.forEach(function (b) {
        var li = el("li"); li.style.setProperty("--tc", T[b.tier].color);
        li.appendChild(el("b", null, b.range));
        li.appendChild(el("span", null, " " + b.verdict));
        bl.appendChild(li);
      });
      body.appendChild(bl);
    } else if (kind === "stats") {
      body.appendChild(el("h2", null, "LOGBOOK"));
      var days = dailyDone(), s = streaks();
      var scores = days.map(function (d) { return E.totalScore(store.daily[d].results); });
      var grid = el("div", "stat-grid");
      [["played", days.length], ["avg", scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : 0],
       ["best", scores.length ? Math.max.apply(null, scores) : 0], ["streak", s.current], ["max streak", s.max]].forEach(function (x) {
        var c = el("div", "stat"); c.appendChild(el("b", null, String(x[1]))); c.appendChild(el("span", null, x[0])); grid.appendChild(c);
      });
      body.appendChild(grid);
      var counts = {}; CP.TIER_IDS.forEach(function (t) { counts[t] = 0; });
      days.forEach(function (d) { store.daily[d].results.forEach(function (r) { (r.answers || []).forEach(function (a) { counts[a.tier]++; }); }); });
      var maxC = Math.max.apply(null, CP.TIER_IDS.map(function (t) { return counts[t]; }).concat([1]));
      body.appendChild(el("h3", null, "ANSWERS BY LEVEL"));
      var bars = el("div", "bars");
      CP.TIER_IDS.slice().reverse().forEach(function (t) {
        var row = el("div", "bar-row"); row.style.setProperty("--tc", T[t].color);
        row.appendChild(CP.sprites.tierImg(t, 20));
        row.appendChild(el("span", "bar-name", T[t].name));
        var bar = el("div", "bar"); var fill = el("i"); fill.style.width = (counts[t] / maxC * 100) + "%"; bar.appendChild(fill);
        row.appendChild(bar); row.appendChild(el("b", null, String(counts[t])));
        bars.appendChild(row);
      });
      body.appendChild(bars);
      var ub = Object.keys(store.unlimited.best).map(function (k) { return store.unlimited.best[k]; });
      if (ub.length) body.appendChild(el("p", "dim", "unlimited: " + ub.length + " digs charted · best " + Math.max.apply(null, ub)));
    } else if (kind === "archive") {
      body.appendChild(el("h2", null, "ARCHIVE ⟲"));
      body.appendChild(el("p", "dim", "Every past daily dig. Archive digs don't count toward your streak. Replays keep your best."));
      var g = el("div", "archive-grid");
      for (var d = today(); d >= 1; d--) {
        var a = link(d === today() ? "#/" : "#/archive/" + d, "", "arch");
        var daily = store.daily[d] && store.daily[d].phase === "done" ? E.totalScore(store.daily[d].results) : null;
        var best = Math.max(daily == null ? -1 : daily, store.archiveBest[d] == null ? -1 : store.archiveBest[d]);
        a.appendChild(el("b", null, "#" + d));
        a.appendChild(el("span", null, E.dateForDay(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })));
        a.appendChild(el("em", null, best >= 0 ? best + " pts" : d === today() ? "today" : "—"));
        if (best >= 0) a.classList.add("played");
        a.addEventListener("click", closeModal);
        g.appendChild(a);
      }
      body.appendChild(g);
    } else if (kind === "diglog") {
      body.appendChild(el("h2", null, "DIG LOG ∞"));
      var charted = Object.keys(store.unlimited.best).length;
      var hi = Math.max(20, nextUnlimited() + 12);
      var rule = el("p", "dim");
      rule.textContent = charted + "/" + hi + " charted · replays keep your best";
      body.appendChild(rule);
      var g2 = el("div", "archive-grid");
      for (var n = 1; n <= hi; n++) {
        var t = link("#/unlimited/" + n, "", "arch");
        var bs = store.unlimited.best[n];
        var inprog = store.unlimited.games[n] && store.unlimited.games[n].phase !== "done" && store.unlimited.games[n].phase !== "intro";
        t.appendChild(el("b", null, "∞" + n));
        t.appendChild(el("em", null, bs != null ? "best " + bs : inprog ? "in progress" : "unplayed"));
        if (bs != null) t.classList.add("played");
        if (game && game.mode === "unlimited" && game.game === n) t.classList.add("current");
        t.addEventListener("click", closeModal);
        g2.appendChild(t);
      }
      body.appendChild(g2);
    } else if (kind === "settings") {
      body.appendChild(el("h2", null, "SETTINGS"));
      body.appendChild(toggle("Sound effects", !store.settings.muted, function (v) { store.settings.muted = !v; applySettings(); save(); }));
      body.appendChild(toggle("Check typos before accepting", store.settings.typoCheck, function (v) { store.settings.typoCheck = v; save(); }));
      body.appendChild(toggle("Clear the box after a wrong answer", store.settings.clearRejected, function (v) { store.settings.clearRejected = v; save(); }));
      body.appendChild(toggle("Reduced motion", store.settings.reduced, function (v) { store.settings.reduced = v; applySettings(); save(); }));
      body.appendChild(toggle("Low power mode", store.settings.lowPower, function (v) { store.settings.lowPower = v; applySettings(); save(); }));
      body.appendChild(el("h3", null, "YOUR DIGGER"));
      body.appendChild(el("p", "dim small", "New diggers unlock with your best daily streak. Tap the digger to poke it."));
      var dl = el("div", "digger-grid");
      var maxStreak = streaks().max, cur = currentDigger();
      CP.DIGGERS.forEach(function (d) {
        var locked = maxStreak < d.streak;
        var b = button("", "digger" + (locked ? " locked" : "") + (cur.id === d.id ? " on" : ""), function () {
          if (locked) return;
          store.settings.digger = d.id; save(); applySettings(); openModal("settings"); scene.poke();
        });
        b.style.setProperty("--dc", d.body);
        b.appendChild(el("i", "swatch"));
        b.appendChild(el("span", null, d.name));
        b.appendChild(el("em", null, locked ? "streak " + d.streak : cur.id === d.id ? "digging" : "ready"));
        b.disabled = locked;
        dl.appendChild(b);
      });
      body.appendChild(dl);
      body.appendChild(el("h3", null, "MISSED ANSWERS LOG"));
      var uniq = {};
      store.missed.forEach(function (m) { uniq[m.p + ":" + m.t.toLowerCase()] = 1; });
      var nMiss = Object.keys(uniq).length;
      body.appendChild(el("p", "dim small", nMiss ? nMiss + " guesses didn't count. Copy the list and send it in to get real answers added." : "Guesses that don't count are logged here so missing answers can be added."));
      if (nMiss) {
        var pre = el("pre", "share-preview missed-log", missedText());
        pre.id = "missedLog";
        body.appendChild(pre);
        var mrow = el("div", "btn-row");
        mrow.appendChild(button("COPY LOG", "btn-ghost", function () { copyResult(missedText(), "copyMissed"); }, "copyMissed"));
        mrow.appendChild(button("CLEAR LOG", "btn-ghost", function () { store.missed = []; save(); openModal("settings"); }, "clearMissed"));
        body.appendChild(mrow);
      }
      var confirmBox = el("div", "confirm-box");
      var reset = button("Erase all progress", "btn-ghost danger", function () {
        confirmBox.innerHTML = "";
        confirmBox.appendChild(el("p", null, "Erase every dig, streak and stat on this device?"));
        confirmBox.appendChild(button("Yes, erase", "btn-ghost danger", function () { store = blankStore(); save(); applySettings(); go("#/"); }, "eraseYes"));
        confirmBox.appendChild(button("Cancel", "btn-ghost", function () { confirmBox.innerHTML = ""; confirmBox.appendChild(reset); }));
      });
      confirmBox.appendChild(reset);
      body.appendChild(confirmBox);
      body.appendChild(el("p", "dim small", "Progress is stored in this browser only."));
    }
    var m = $("modal");
    if (!m.open) { if (m.showModal) m.showModal(); else m.setAttribute("open", ""); }
  }

  function toggle(label, on, cb) {
    var l = el("label", "toggle");
    var i = document.createElement("input");
    i.type = "checkbox"; i.checked = !!on;
    i.addEventListener("change", function () { cb(i.checked); });
    l.appendChild(i); l.appendChild(el("span", null, label));
    return l;
  }

  function closeModal() {
    var m = $("modal");
    if (m.open) { if (m.close) m.close(); else m.removeAttribute("open"); }
    if (game && game.phase === "answering") $("answer").focus({ preventScroll: true });
  }

  function applySettings() {
    A.setMuted(store.settings.muted);
    $("muteBtn").textContent = store.settings.muted ? "♪̸" : "♪";
    $("muteBtn").setAttribute("aria-pressed", String(!store.settings.muted));
    var reduced = store.settings.reduced || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (scene) { scene.reduced = !!reduced; scene.lowPower = !!store.settings.lowPower; scene.setDigger(currentDigger()); }
    document.body.classList.toggle("reduced", !!reduced);
  }

  // ---------- wiring ----------
  function init() {
    $("brandIcon").src = CP.sprites.tierSprite("k");
    scene = new CP.Scene($("world"), $("hud"));
    applySettings();

    $("dock").addEventListener("submit", function (e) { e.preventDefault(); submit($("answer").value); });
    $("answer").addEventListener("input", function () {
      if (pendingCorrection && $("answer").value !== pendingCorrection.to) hideCorrection();
      scene.typeFx();
      A.play("type");
    });
    $("endRoundBtn").addEventListener("click", function () { if (game.phase === "answering") endRound(); });
    $("muteBtn").addEventListener("click", function () { store.settings.muted = !store.settings.muted; applySettings(); save(); });
    document.querySelectorAll("[data-open]").forEach(function (b) {
      b.addEventListener("click", function () { openModal(b.getAttribute("data-open")); });
    });
    $("modalClose").addEventListener("click", closeModal);
    $("modal").addEventListener("click", function (e) { if (e.target === $("modal")) closeModal(); });
    $("modal").addEventListener("close", function () { if (game && game.phase === "answering") $("answer").focus({ preventScroll: true }); });

    // poke the digger by tapping it
    document.addEventListener("pointerdown", function (e) {
      var t = e.target;
      if (t !== document.body && t !== $("world") && t !== $("panel") && t !== $("play")) return;
      var h = scene.headScreen();
      if (Math.hypot(e.clientX - h.x, e.clientY - h.y) < 36) { scene.poke(); A.play("tick"); }
    });

    window.addEventListener("keydown", function (e) {
      if ($("modal").open) return;
      if (e.key !== "Enter" || e.repeat || e.isComposing || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(t.tagName)) return;
      if (game.phase === "feedback") { e.preventDefault(); next(); }
      else if (game.phase === "intro") { e.preventDefault(); begin(); }
    });
    window.addEventListener("hashchange", boot);
    document.addEventListener("visibilitychange", function () { if (!document.hidden && game) tick(); });
    window.addEventListener("storage", function (e) { if (e.key === STORE_KEY) { store = loadStore(); applySettings(); boot(); } });

    boot();
  }

  // Test hook: lets automated checks drive the game without waiting.
  window.__centapillion = {
    state: function () { return JSON.parse(JSON.stringify(game)); },
    skip: function (ms) { if (game.previewEndsAt) game.previewEndsAt -= ms; if (game.answerEndsAt) game.answerEndsAt -= ms; save(); tick(); },
    today: today,
    store: function () { return JSON.parse(JSON.stringify(store)); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
