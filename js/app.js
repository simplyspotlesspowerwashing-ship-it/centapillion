/* Centapillion: game controller, persistence and UI. */
(function () {
  "use strict";
  var CP = window.CP, E = CP.engine, C = CP.CONFIG, T = CP.TIERS, A = CP.audio;
  var BANK = CP.PROMPTS;
  var BY_ID = {};
  BANK.forEach(function (p) { BY_ID[p.id] = p; });

  var STORE_KEY = "centapillion:v1";
  var $ = function (id) { return document.getElementById(id); };

  // ---------- persistence ----------
  function blankStore() {
    return { settings: { muted: false, reduced: false }, daily: {}, archive: {}, unlimited: { count: 0, current: null, history: [] } };
  }
  function loadStore() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!s || typeof s !== "object") return blankStore();
      var b = blankStore();
      return {
        settings: Object.assign(b.settings, s.settings || {}),
        daily: s.daily || {}, archive: s.archive || {},
        unlimited: Object.assign(b.unlimited, s.unlimited || {})
      };
    } catch (e) { return blankStore(); }
  }
  var store = loadStore();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* private mode: play on without saving */ }
  }

  // ---------- state ----------
  var game = null;      // the active game record (lives inside store)
  var prompts = [];     // prompt objects for the active game
  var scene = null;
  var tickTimer = null;
  var lastSecond = null;
  var pendingCorrection = null;
  var landedTimer = null;

  function now() { return Date.now(); }
  function today() { return E.dayNumber(new Date()); }

  function newGame(mode, number, ids) {
    return { mode: mode, game: number, promptIds: ids, roundIndex: 0, phase: "intro",
             previewEndsAt: null, answerEndsAt: null, results: [], v: 1 };
  }

  function validGame(g) {
    return g && Array.isArray(g.promptIds) && g.promptIds.length === C.ROUNDS &&
      g.promptIds.every(function (id) { return BY_ID[id]; }) && Array.isArray(g.results);
  }

  function gameFor(route) {
    var g;
    if (route.mode === "daily") {
      var n = today();
      g = store.daily[n];
      if (!validGame(g)) { g = newGame("daily", n, E.promptsForDay(n, BANK).map(function (p) { return p.id; })); store.daily[n] = g; }
    } else if (route.mode === "archive") {
      var d = route.day;
      if (store.daily[d] && store.daily[d].phase === "done") return store.daily[d];
      g = store.archive[d];
      if (!validGame(g)) { g = newGame("archive", d, E.promptsForDay(d, BANK).map(function (p) { return p.id; })); store.archive[d] = g; }
    } else {
      g = store.unlimited.current;
      if (!validGame(g)) g = newUnlimited();
    }
    return g;
  }

  function newUnlimited() {
    store.unlimited.count += 1;
    var seed = (Math.random() * 0xffffffff) >>> 0;
    var g = newGame("unlimited", store.unlimited.count, E.randomPrompts(BANK, seed).map(function (p) { return p.id; }));
    store.unlimited.current = g;
    save();
    return g;
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
      if (d >= 1 && d <= today()) return d === today() ? { mode: "daily" } : { mode: "archive", day: d };
    }
    if (h === "unlimited") return { mode: "unlimited" };
    return { mode: "daily" };
  }

  function boot() {
    stopTick();
    closeModal();
    var route = parseRoute();
    game = gameFor(route);
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
    var best = null;
    (r.answers || []).forEach(function (a) { if (!best || T[a.tier].score > T[best].score) best = a.tier; });
    return best;
  }

  // Bring the UI in line with the saved phase, catching up on any time
  // that passed while the page was closed.
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
    save();
    lastSecond = null;
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
      var n = Math.ceil(left / 1000);
      var cd = $("countdown");
      if (left > 0) {
        if (cd.textContent !== String(n)) { cd.textContent = String(n); cd.classList.remove("pop"); void cd.offsetWidth; cd.classList.add("pop"); A.play("tick"); }
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
    var urgent = game.phase === "answering" && ms <= 10000;
    $("timer").classList.toggle("urgent", urgent);
    document.body.classList.toggle("urgent", urgent);
    if (game.phase === "answering" && secs <= 5 && secs > 0 && secs !== lastSecond) A.play("tick");
    lastSecond = secs;
  }

  function timeUp() {
    var draft = $("answer").value;
    if (draft.trim() && curRound().answers.length < C.MAX_ANSWERS) {
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
    if (curRound().answers.length >= C.MAX_ANSWERS) return;
    var p = curPrompt();
    var r = E.judge(p, raw, foundIds(), false);
    hideCorrection();
    scene.submitFx();
    if (r.status === "accepted") {
      A.play("submit");
      addAnswer(r.answer, raw);
      $("answer").value = "";
      flashMsg("", "");
      if (curRound().answers.length >= C.MAX_ANSWERS) {
        setTimeout(function () { if (game.phase === "answering") endRound(); }, 900);
      }
    } else if (r.status === "correction") {
      pendingCorrection = { from: raw, to: r.to };
      $("answer").value = r.to;
      showCorrection(raw, r.to);
    } else if (r.status === "duplicate") {
      A.play("duplicate");
      flashMsg("already dug up “" + r.answer.name + "”", "warn");
      $("answer").select();
    } else {
      A.play("reject");
      scene.rejectFx();
      flashMsg("“" + raw + "” isn't in the dirt. try another", "bad");
      shakeDock();
      $("answer").select();
    }
  }

  function addAnswer(ans, raw) {
    var round = curRound();
    round.answers.push({ id: ans.id, name: ans.name, tier: ans.tier, score: ans.score, raw: raw });
    save();
    var depth = total() * C.METRES_PER_POINT;
    scene.setDepth(depth);
    scene.acceptFx(ans.tier);
    A.play("accept", ans.tier);
    showLanded(ans);
    renderSlots();
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
    if (game.mode === "unlimited") {
      store.unlimited.history.push({ game: game.game, score: total(), at: game.finishedAt });
      if (store.unlimited.history.length > 200) store.unlimited.history.shift();
    }
    save();
    A.play("done");
    renderDone();
  }

  // ---------- rendering ----------
  function setView(v) {
    document.body.dataset.view = v;
    $("play").hidden = v !== "play";
    $("dock").hidden = v !== "play";
    if (v !== "play") $("panel").hidden = false;
    else $("panel").hidden = true;
  }

  function modeLabel() {
    if (game.mode === "unlimited") return "UNLIMITED ∞ #" + game.game;
    if (game.mode === "archive") return "ARCHIVE ⟲ DIG #" + game.game;
    return "DIG #" + game.game;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderIntro() {
    setView("intro");
    var P = $("panel");
    P.innerHTML = "";
    var card = el("section", "card intro");
    var logo = el("div", "logo");
    logo.appendChild(CP.sprites.tierImg("k", 72, "logo-sprite bob"));
    logo.appendChild(el("h1", "logo-word", "CENTAPILLION"));
    card.appendChild(logo);
    card.appendChild(el("p", "tagline", "one in a centapillion."));
    card.appendChild(el("p", "subline", game.mode === "unlimited" ? "THE ENDLESS DIG" : game.mode === "archive" ? "AN OLD TUNNEL" : "THE DAILY DIG"));
    card.appendChild(el("p", "subline dim", "7 prompts · 45 seconds each · up to 5 answers · rarer answers dig deeper"));
    card.appendChild(howToList(true));
    var btn = el("button", "btn-begin", "▼ BEGIN DIG ▼");
    btn.type = "button";
    btn.id = "beginBtn";
    btn.addEventListener("click", begin);
    card.appendChild(btn);
    var meta = el("div", "intro-meta");
    var left = el("span", null, modeLabel().toLowerCase());
    if (game.mode === "daily") {
      var s = streaks();
      if (s.current) left.textContent += " · streak " + s.current;
    }
    meta.appendChild(left);
    var links = el("span", "links");
    links.appendChild(link("#/archive/" + Math.max(1, today() - 1), "ARCHIVE ⟲", function (e) { e.preventDefault(); openModal("archive"); }));
    links.appendChild(link("#/unlimited", "UNLIMITED ∞"));
    if (game.mode !== "daily") links.appendChild(link("#/", "TODAY'S DIG"));
    meta.appendChild(links);
    card.appendChild(meta);
    P.appendChild(card);
    setTimeout(function () { var b = $("beginBtn"); if (b) b.focus(); }, 30);
  }

  function link(href, text, onClick) {
    var a = el("a", null, text);
    a.href = href;
    if (onClick) a.addEventListener("click", onClick);
    return a;
  }

  function howToList(collapsible) {
    var items = [
      "7 prompts a day. same for everyone.",
      "45 seconds per prompt. name up to 5 answers.",
      "every answer scores. rare answers score big. obvious ones stay shallow.",
      "the pick that feels clever? the colony thought of it too.",
      "typos get one fix-up. submit again to confirm.",
      "every point digs you 10 metres. 1,500 reaches the core crowd.",
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
    renderSlots();
    renderScore();
  }

  function renderSlots() {
    var ol = $("slots");
    ol.innerHTML = "";
    var answers = curRound() ? curRound().answers : [];
    for (var i = 0; i < C.MAX_ANSWERS; i++) {
      var li = el("li", "slot");
      var a = answers[i];
      if (a) {
        li.classList.add("filled");
        li.style.setProperty("--tc", T[a.tier].color);
        li.appendChild(CP.sprites.tierImg(a.tier, 22));
        li.appendChild(el("span", "slot-name", a.name));
        li.appendChild(el("b", "slot-pts", "+" + a.score));
      } else {
        li.appendChild(el("span", "slot-empty", String(i + 1)));
      }
      ol.appendChild(li);
    }
  }

  function renderScore() {
    var s = total();
    $("scoreNow").textContent = String(s);
    $("depthNow").textContent = "-" + E.fmtMetres(s * C.METRES_PER_POINT);
  }

  function showLanded(ans) {
    var box = $("landed");
    var t = T[ans.tier];
    box.innerHTML = "";
    var card = el("div", "landed-card");
    card.style.setProperty("--tc", t.color);
    card.appendChild(CP.sprites.tierImg(ans.tier, 48));
    card.appendChild(el("div", "tname", t.name.toUpperCase()));
    card.appendChild(el("div", "tans", "“" + ans.name + "”"));
    card.appendChild(el("div", "tpts", "+" + ans.score + " PTS · dig " + E.fmtMetres(ans.score * C.METRES_PER_POINT)));
    card.appendChild(el("div", "tsub", t.blurb));
    box.appendChild(card);
    clearTimeout(landedTimer);
    landedTimer = setTimeout(function () { card.classList.add("gone"); }, 1700);
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
    r.answers.forEach(function (a) {
      var li = el("li", "fb-item");
      li.style.setProperty("--tc", T[a.tier].color);
      li.appendChild(CP.sprites.tierImg(a.tier, 32));
      var mid = el("div", "fb-mid");
      mid.appendChild(el("div", "tname", T[a.tier].name.toUpperCase()));
      mid.appendChild(el("div", "tans", a.name));
      li.appendChild(mid);
      li.appendChild(el("b", "tpts", "+" + a.score));
      list.appendChild(li);
    });
    card.appendChild(list);
    var rs = E.roundScore(r);
    card.appendChild(el("div", "fb-total", "round +" + rs + " · total " + total() + " · -" + E.fmtMetres(total() * C.METRES_PER_POINT)));
    var gem = E.answerSheet(p).k[0];
    var found = r.answers.some(function (a) { return a.tier === "k"; });
    card.appendChild(el("p", "fb-gem", found ? "You found the centapillion. 🐛" : "The centapillion was “" + gem.name + "”."));
    var last = game.roundIndex >= C.ROUNDS - 1;
    var b = el("button", "btn-begin", last ? "SEE THE DIG LOG ▼" : "▼ DIG TO ROUND " + (game.roundIndex + 2) + " ▼");
    b.type = "button";
    b.id = "nextBtn";
    b.addEventListener("click", next);
    card.appendChild(b);
    card.appendChild(el("div", "hint", "press enter"));
    P.appendChild(card);
    setTimeout(function () { var n = $("nextBtn"); if (n) n.focus(); }, 30);
  }

  function renderDone() {
    setView("done");
    stopTick();
    var P = $("panel");
    P.innerHTML = "";
    var s = total(), band = E.bandFor(s), max = E.maxScore(prompts);
    var card = el("section", "card done");
    card.appendChild(el("div", "kicker", modeLabel() + " · COMPLETE"));
    var big = el("div", "bigscore");
    big.appendChild(el("span", "num", String(s)));
    big.appendChild(el("span", "of", "/" + max));
    big.appendChild(el("span", "depth", "-" + E.fmtMetres(s * C.METRES_PER_POINT)));
    card.appendChild(big);
    var verdict = el("div", "verdict");
    verdict.style.setProperty("--tc", T[band.tier].color);
    verdict.appendChild(CP.sprites.tierImg(band.tier, 40));
    verdict.appendChild(el("span", null, band.verdict));
    card.appendChild(verdict);
    card.appendChild(depthChart());

    var share = E.shareText({ mode: game.mode, game: game.game, results: game.results, url: location.origin && location.origin !== "null" ? location.origin + location.pathname : "" });
    var pre = el("pre", "share-preview", share);
    card.appendChild(pre);
    var row = el("div", "btn-row");
    var sb = el("button", "btn-begin", "SHARE ↗");
    sb.type = "button";
    sb.id = "shareBtn";
    sb.addEventListener("click", function () { doShare(share); });
    row.appendChild(sb);
    if (game.mode === "unlimited") {
      var nb = el("button", "btn-ghost", "NEW DIG ∞");
      nb.type = "button";
      nb.addEventListener("click", function () { store.unlimited.current = null; newUnlimited(); boot(); });
      row.appendChild(nb);
    } else {
      row.appendChild(link("#/unlimited", "UNLIMITED ∞")).className = "btn-ghost";
    }
    var ab = el("button", "btn-ghost", "ARCHIVE ⟲");
    ab.type = "button";
    ab.addEventListener("click", function () { openModal("archive"); });
    row.appendChild(ab);
    card.appendChild(row);

    if (game.mode === "daily") {
      var nx = el("p", "next-dig");
      nx.id = "nextDig";
      card.appendChild(nx);
      updateNextDig();
    }

    card.appendChild(el("h3", "sheet-title", "THE DIG LOG"));
    card.appendChild(answerSheet());
    P.appendChild(card);
    P.scrollTop = 0;
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
    // roll over to the new daily when midnight passes on the home screen
    if (game && parseRoute().mode === "daily" && game.game !== today() && (game.phase === "done" || game.phase === "intro")) boot();
  }, 1000);

  function depthChart() {
    var wrap = el("div", "chart");
    var axis = el("div", "chart-axis");
    ["0", "earthworm", "beetle", "mole", "wyrm", "core"].forEach(function (t) { axis.appendChild(el("span", null, t)); });
    wrap.appendChild(axis);
    var cols = el("div", "chart-cols");
    game.results.forEach(function (r, i) {
      var col = el("div", "chart-col");
      col.title = "Round " + (i + 1) + ": " + prompts[i].q;
      if (!r.answers.length) {
        var m = el("i", "dot miss"); m.style.top = "3%"; col.appendChild(m);
      }
      r.answers.forEach(function (a, j) {
        var dot = el("i", "dot");
        dot.style.top = (T[a.tier].depth * 100) + "%";
        dot.style.left = (50 + (j - (r.answers.length - 1) / 2) * 16) + "%";
        dot.style.setProperty("--tc", T[a.tier].color);
        dot.title = a.name + " · " + T[a.tier].name + " · +" + a.score;
        col.appendChild(dot);
      });
      col.appendChild(el("span", "chart-r", String(i + 1)));
      cols.appendChild(col);
    });
    wrap.appendChild(cols);
    return wrap;
  }

  function answerSheet() {
    var box = el("div", "sheet");
    game.results.forEach(function (r, i) {
      var p = prompts[i];
      var sec = el("details", "sheet-round");
      if (i === 0) sec.open = true;
      var sum = el("summary");
      sum.appendChild(el("span", "sheet-n", String(i + 1)));
      sum.appendChild(el("span", "sheet-q", p.q));
      sum.appendChild(el("span", "sheet-emo", E.rowEmoji(r)));
      sum.appendChild(el("b", "sheet-pts", "+" + E.roundScore(r)));
      sec.appendChild(sum);
      var sheet = E.answerSheet(p);
      var mine = {};
      r.answers.forEach(function (a) { mine[a.id] = true; });
      var tiers = ["k", "d", "r", "s", "c", "p"];
      tiers.forEach(function (t) {
        var list = sheet[t];
        if (!list.length) return;
        var row = el("div", "sheet-tier");
        row.style.setProperty("--tc", T[t].color);
        var head = el("div", "sheet-tier-head");
        head.appendChild(CP.sprites.tierImg(t, 20));
        head.appendChild(el("span", null, T[t].name + " · " + T[t].score));
        row.appendChild(head);
        var names = el("div", "sheet-names");
        var shown = list.slice();
        // keep the list short, but always show the player's own answers
        var cap = t === "s" || t === "p" ? 8 : 12;
        var visible = shown.filter(function (a, idx) { return idx < cap || mine[a.id]; });
        visible.forEach(function (a) { names.appendChild(el("span", "nm" + (mine[a.id] ? " you" : ""), a.name)); });
        if (shown.length > visible.length) names.appendChild(el("span", "nm more", "+" + (shown.length - visible.length) + " more"));
        row.appendChild(names);
        sec.appendChild(row);
      });
      box.appendChild(sec);
    });
    return box;
  }

  function doShare(text) {
    var done = function () { toast("copied to clipboard"); };
    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      navigator.share({ text: text }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text) ? done() : toast("couldn't copy. select the text above"); });
    } else if (fallbackCopy(text)) done();
    else toast("couldn't copy. select the text above");
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

  // ---------- modals ----------
  function openModal(kind) {
    var body = $("modalBody");
    body.innerHTML = "";
    if (kind === "howto") {
      body.appendChild(el("h2", null, "HOW TO DIG"));
      body.appendChild(howToList(false));
      body.appendChild(el("h3", null, "RARITY TIERS"));
      var tl = el("ul", "tier-list");
      CP.TIER_IDS.forEach(function (t) {
        var li = el("li");
        li.style.setProperty("--tc", T[t].color);
        li.appendChild(CP.sprites.tierImg(t, 32));
        var mid = el("div");
        mid.appendChild(el("b", null, T[t].name + " · " + T[t].score + " pts"));
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
      body.appendChild(el("h2", null, "DIG STATS"));
      var days = dailyDone(), s = streaks();
      var scores = days.map(function (d) { return E.totalScore(store.daily[d].results); });
      var grid = el("div", "stat-grid");
      [["played", days.length], ["avg", scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : 0],
       ["best", scores.length ? Math.max.apply(null, scores) : 0], ["streak", s.current], ["max streak", s.max]].forEach(function (x) {
        var c = el("div", "stat"); c.appendChild(el("b", null, String(x[1]))); c.appendChild(el("span", null, x[0])); grid.appendChild(c);
      });
      body.appendChild(grid);
      var counts = {}; CP.TIER_IDS.forEach(function (t) { counts[t] = 0; });
      days.forEach(function (d) { store.daily[d].results.forEach(function (r) { r.answers.forEach(function (a) { counts[a.tier]++; }); }); });
      var maxC = Math.max.apply(null, CP.TIER_IDS.map(function (t) { return counts[t]; }).concat([1]));
      body.appendChild(el("h3", null, "ANSWERS BY TIER"));
      var bars = el("div", "bars");
      CP.TIER_IDS.slice().reverse().forEach(function (t) {
        var row = el("div", "bar-row"); row.style.setProperty("--tc", T[t].color);
        row.appendChild(CP.sprites.tierImg(t, 20));
        var bar = el("div", "bar"); var fill = el("i"); fill.style.width = (counts[t] / maxC * 100) + "%"; bar.appendChild(fill);
        row.appendChild(bar); row.appendChild(el("b", null, String(counts[t])));
        bars.appendChild(row);
      });
      body.appendChild(bars);
      if (store.unlimited.history.length) {
        var u = store.unlimited.history.map(function (h) { return h.score; });
        body.appendChild(el("p", "dim", "unlimited: " + u.length + " digs · best " + Math.max.apply(null, u)));
      }
    } else if (kind === "archive") {
      body.appendChild(el("h2", null, "ARCHIVE ⟲"));
      body.appendChild(el("p", "dim", "Every past daily dig. Archive digs don't count toward your streak."));
      var g = el("div", "archive-grid");
      for (var d = today(); d >= 1; d--) {
        var a = link(d === today() ? "#/" : "#/archive/" + d, "", null);
        a.className = "arch";
        var played = store.daily[d] && store.daily[d].phase === "done" ? store.daily[d] : store.archive[d] && store.archive[d].phase === "done" ? store.archive[d] : null;
        a.appendChild(el("b", null, "#" + d));
        a.appendChild(el("span", null, E.dateForDay(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })));
        a.appendChild(el("em", null, played ? E.totalScore(played.results) + " pts" : d === today() ? "today" : "—"));
        if (played) a.classList.add("played");
        a.addEventListener("click", closeModal);
        g.appendChild(a);
      }
      body.appendChild(g);
    } else if (kind === "settings") {
      body.appendChild(el("h2", null, "SETTINGS"));
      body.appendChild(toggle("Sound effects", !store.settings.muted, function (v) { store.settings.muted = !v; applySettings(); save(); }));
      body.appendChild(toggle("Reduced motion", store.settings.reduced, function (v) { store.settings.reduced = v; applySettings(); save(); }));
      var reset = el("button", "btn-ghost danger", "Erase all progress");
      reset.type = "button";
      reset.addEventListener("click", function () {
        if (confirm("Erase every dig, streak and stat on this device?")) {
          store = blankStore(); save(); applySettings(); location.hash = "#/"; boot();
        }
      });
      body.appendChild(reset);
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
    if (scene) scene.reduced = reduced;
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

    window.addEventListener("keydown", function (e) {
      if ($("modal").open) return;
      if (e.key !== "Enter" || e.repeat || e.isComposing || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(t.tagName)) return;
      if (game.phase === "feedback") { e.preventDefault(); next(); }
      else if (game.phase === "intro") { e.preventDefault(); begin(); }
    });
    window.addEventListener("hashchange", boot);
    // catch up after the tab was in the background
    document.addEventListener("visibilitychange", function () { if (!document.hidden && game) tick(); });
    window.addEventListener("storage", function (e) { if (e.key === STORE_KEY) { store = loadStore(); boot(); } });

    boot();
  }

  // Test hook: lets automated checks drive the game without waiting.
  window.__centapillion = {
    state: function () { return JSON.parse(JSON.stringify(game)); },
    skip: function (ms) { if (game.previewEndsAt) game.previewEndsAt -= ms; if (game.answerEndsAt) game.answerEndsAt -= ms; save(); tick(); },
    today: today
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
