/*
 * Browser stress test. Serve the repo root, then:
 *   BASE=http://localhost:8765 node tests/e2e.js
 * Uses the globally installed Playwright.
 */
const { chromium, devices } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const BASE = process.env.BASE || "http://localhost:8765";
const SHOTS = process.env.SHOTS || path.join(__dirname, "shots");
const KEY = "centapillion:v2";
fs.mkdirSync(SHOTS, { recursive: true });

let fails = 0, passes = 0;
async function step(name, fn) {
  try { await fn(); passes++; console.log("ok   " + name); }
  catch (e) { fails++; console.log("FAIL " + name + "\n     " + (e.stack || e.message).split("\n").slice(0, 4).join("\n     ")); }
}

async function answersFor(page) {
  return page.evaluate(() => {
    const st = window.__centapillion.state();
    const p = window.CP.PROMPTS.find(x => x.id === st.promptIds[st.roundIndex]);
    const out = {};
    for (const a of window.CP.engine.indexFor(p).answers) (out[a.tier] = out[a.tier] || []).push(a.name);
    return out;
  });
}
const state = page => page.evaluate(() => window.__centapillion.state());
const skip = (page, ms) => page.evaluate(m => window.__centapillion.skip(m), ms);
const roundTotal = st => st.results.reduce((s, r) => s + r.answers.reduce((x, a) => x + a.score, 0), 0);
async function submit(page, text) {
  await page.fill("#answer", text);
  await page.press("#answer", "Enter");
  await page.waitForTimeout(40);
}
async function toAnswering(page) {
  await skip(page, 3100);
  await page.waitForFunction(() => window.__centapillion.state().phase === "answering");
}
const noFontErrors = errs => errs.filter(e => !/ERR_FAILED|net::/.test(e));

async function newPage(browser, opts, clock) {
  const ctx = await browser.newContext(opts);
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const page = await ctx.newPage();
  page.errors = [];
  page.on("pageerror", e => page.errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") page.errors.push("console: " + m.text()); });
  if (clock) { await page.clock.install({ time: clock }); await page.clock.resume(); }
  return { ctx, page };
}

(async () => {
  const browser = await chromium.launch();
  const { ctx, page } = await newPage(browser, { viewport: { width: 1280, height: 860 } });

  await step("loads intro with the six-level ladder", async () => {
    await page.goto(BASE + "/");
    await page.waitForSelector("#beginBtn");
    assert.equal((await state(page)).phase, "intro");
    const ladder = await page.locator(".ladder li").allTextContents();
    assert.deepEqual(ladder, ["Common10", "Too Clever15", "Uncommon30", "Rare60", "Deep Cut85", "One in a Centapillion100"]);
    assert.match(await page.textContent(".card.intro"), /30 seconds each · unlimited answers/);
    await page.screenshot({ path: path.join(SHOTS, "01-intro.png") });
  });

  await step("preview then a 30 second answer window", async () => {
    await page.click("#beginBtn");
    assert.equal((await state(page)).phase, "preview");
    assert.ok(await page.isDisabled("#answer"));
    await toAnswering(page);
    const left = (await state(page)).answerEndsAt - Date.now();
    assert.ok(left > 25000 && left <= 30000, "left=" + left);
    assert.equal(await page.evaluate(() => document.activeElement.id), "answer");
  });

  let A;
  await step("each tier scores its own points", async () => {
    A = await answersFor(page);
    let expect = 0;
    for (const t of ["p", "s", "r", "d", "k"]) {
      await submit(page, A[t][0]);
      expect += { p: 10, s: 30, r: 60, d: 85, k: 100 }[t];
      assert.equal(roundTotal(await state(page)), expect, "after " + t);
    }
    assert.equal(await page.textContent("#scoreNow"), String(expect));
    assert.equal(await page.textContent("#depthNow"), "-" + (expect * 10).toLocaleString("en-US") + " m");
  });

  await step("gem shows its quip and tier lines appear", async () => {
    await page.waitForTimeout(450);
    const card = await page.textContent("#landed");
    assert.match(card, /ONE IN A CENTAPILLION/);
    const quip = await page.evaluate(() => {
      const st = window.__centapillion.state();
      const p = window.CP.PROMPTS.find(x => x.id === st.promptIds[0]);
      return window.CP.engine.indexFor(p).answers.find(a => a.tier === "k").quip;
    });
    assert.ok(card.includes(quip), "quip missing from landed card");
    await page.screenshot({ path: path.join(SHOTS, "02-gem-plunge.png") });
  });

  await step("no answer cap: 12 answers in one round all score", async () => {
    const have = new Set((await state(page)).results[0].answers.map(a => a.name));
    const more = [].concat(A.s, A.r, A.d).filter(n => !have.has(n)).slice(0, 7);
    for (const n of more) await submit(page, n);
    const st = await state(page);
    assert.equal(st.phase, "answering");
    assert.equal(st.results[0].answers.length, 12);
    assert.equal(await page.locator("#haul .chip").count(), 12);
    assert.match(await page.textContent(".haul-head"), /12 answers/);
  });

  await step("duplicate, nonsense and empty are rejected", async () => {
    await submit(page, A.p[0].toUpperCase());
    assert.match(await page.textContent("#dockMsg"), /already dug up/);
    await submit(page, "zzqxj blorptastic");
    assert.match(await page.textContent("#dockMsg"), /isn't in the dirt/);
    await submit(page, "   ");
    assert.equal((await state(page)).results[0].answers.length, 12);
  });

  await step("a doubtful match asks first, then counts on confirm", async () => {
    const before = (await state(page)).results[0].answers.length;
    const probe = await page.evaluate(() => {
      const st = window.__centapillion.state();
      const p = window.CP.PROMPTS.find(x => x.id === st.promptIds[0]);
      const found = st.results[0].answers.map(a => a.id);
      for (const a of window.CP.engine.indexFor(p).answers) {
        if (found.includes(a.id) || a.name.length < 9) continue;
        const t = a.name.slice(0, Math.ceil(a.name.length * 0.7));
        const r = window.CP.engine.judge(p, t, found, false);
        if (r.status === "correction") return t;
      }
      return null;
    });
    if (!probe) return; // this prompt has no doubtful case; covered by the engine tests
    await submit(page, probe);
    assert.equal((await state(page)).results[0].answers.length, before, "scored before confirming: " + probe);
    assert.match(await page.textContent("#correction"), /submit again to confirm/);
    await page.press("#answer", "Enter");
    await page.waitForTimeout(40);
    assert.equal((await state(page)).results[0].answers.length, before + 1);
  });

  await step("misspelling is auto-fixed and says what it counted as", async () => {
    const st0 = await state(page);
    const have = new Set(st0.results[0].answers.map(a => a.name));
    const long = [].concat(A.s, A.r).find(n => !have.has(n) && /^[a-z]{8,}$/i.test(n));
    const typo = long.slice(0, 3) + long.slice(4); // drop one letter
    await submit(page, typo);
    assert.equal((await state(page)).results[0].answers.length, st0.results[0].answers.length + 1, "not counted: " + typo);
    assert.match(await page.textContent("#dockMsg"), /counted as/);
  });

  await step("wrong guesses land in the missed-answers log", async () => {
    await submit(page, "qwertyuiopzz");
    const missed = (await page.evaluate(() => window.__centapillion.store())).missed;
    assert.ok(missed.some(m => m.t === "qwertyuiopzz"));
  });

  await step("time-up ends the round; feedback sorted rarest first", async () => {
    await skip(page, 30100);
    await page.waitForFunction(() => window.__centapillion.state().phase === "feedback");
    const tiers = await page.locator(".fb-item .tname").allTextContents();
    assert.equal(tiers[0], "ONE IN A CENTAPILLION");
    assert.equal(tiers[tiers.length - 1], "COMMON");
    await page.screenshot({ path: path.join(SHOTS, "03-feedback.png") });
  });

  await step("empty round is a dead end", async () => {
    await page.keyboard.press("Enter");
    await toAnswering(page);
    await skip(page, 30100);
    await page.waitForFunction(() => window.__centapillion.state().phase === "feedback");
    assert.match(await page.textContent("#panel"), /DEAD END/);
  });

  await step("typo left in the box at time-up is accepted", async () => {
    await page.click("#nextBtn");
    await toAnswering(page);
    A = await answersFor(page);
    const long = A.s.find(n => /^[a-z]{6,}$/i.test(n)) || A.s[0];
    await page.fill("#answer", long.slice(0, -1) + (long.endsWith("x") ? "y" : "x"));
    await skip(page, 30100);
    await page.waitForFunction(() => window.__centapillion.state().phase === "feedback");
    assert.equal((await state(page)).results[2].answers.length, 1);
  });

  await step("reload mid-round resumes with the same deadline", async () => {
    await page.click("#nextBtn");
    await toAnswering(page);
    A = await answersFor(page);
    await submit(page, A.p[0]);
    const endsAt = (await state(page)).answerEndsAt;
    await page.reload();
    await page.waitForFunction(() => window.__centapillion && window.__centapillion.state().phase === "answering");
    assert.equal((await state(page)).answerEndsAt, endsAt);
    assert.equal(await page.locator("#haul .chip").count(), 1);
    await page.click("#endRoundBtn");
  });

  await step("finish and see the krillion-style results", async () => {
    for (let r = 4; r < 7; r++) {
      await page.click("#nextBtn");
      await toAnswering(page);
      A = await answersFor(page);
      await submit(page, A.r[0]);
      await submit(page, A.c[0]);
      await page.click("#endRoundBtn");
    }
    await page.click("#nextBtn");
    await page.waitForSelector(".bigscore");
    const st = await state(page);
    assert.equal(st.phase, "done");
    assert.equal(await page.textContent(".bigscore .num"), String(roundTotal(st)));
    const heads = await page.locator(".sec-head > span:first-child").allTextContents();
    assert.deepEqual(heads, ["the bearing", "the haul", "logbook"]);
    assert.equal(await page.locator(".bearing li.on").count(), 1);
    const share = await page.textContent(".share-preview");
    assert.match(share, /^Centapillion #\d+ 🐛\n\d+ pts · -[\d,]+ m\n/);
    assert.equal(share.split("\n").length, 9);
    assert.ok(share.includes("⬛ 0"));
    assert.match(await page.textContent(".logbook"), /streak 1 · played 1/);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SHOTS, "04-done.png") });
  });

  await step("answer sheet expands, marks your answers, and sorts", async () => {
    await page.locator(".sheet-round summary").nth(1).click();
    assert.equal(await page.locator(".sheet-round[open]").count(), 2);
    assert.ok(await page.locator('.sheet-round[data-i="0"] .nm.you').count() >= 13);
    await page.selectOption("#sheetSort", "az");
    assert.equal(await page.locator(".sheet-round[open]").count(), 2, "open rounds stay open after sorting");
    const names = await page.locator('.sheet-round[data-i="0"] .sheet-tier').nth(3).locator(".nm").allTextContents();
    assert.deepEqual(names, names.slice().sort((a, b) => a.localeCompare(b)));
  });

  await step("copy result", async () => {
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.click("#shareBtn");
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /^Centapillion #/);
  });

  await step("one dig per day: reload keeps results", async () => {
    await page.reload();
    await page.waitForSelector(".bigscore");
  });

  await step("settings: typo check off auto-accepts; clear-on-reject clears", async () => {
    await page.goto(BASE + "/#/unlimited/3");
    await page.waitForFunction(() => window.__centapillion.state().mode === "unlimited");
    await page.click('[data-open="settings"]');
    await page.getByText("Check typos before accepting").click();
    await page.getByText("Clear the box after a wrong answer").click();
    await page.keyboard.press("Escape");
    await page.click("#beginBtn");
    await toAnswering(page);
    A = await answersFor(page);
    const long = [].concat(A.s, A.r).find(n => /^[a-z]{7,}$/i.test(n));
    await submit(page, long.slice(0, 2) + long[3] + long[2] + long.slice(4));
    assert.equal((await state(page)).results[0].answers.length, 1, "typo should be accepted directly");
    await submit(page, "qqqqzzzz");
    assert.equal(await page.inputValue("#answer"), "");
  });

  await step("unlimited: numbered, replay keeps best, next dig", async () => {
    await page.click("#endRoundBtn");
    for (let r = 1; r < 7; r++) { await page.click("#nextBtn"); await toAnswering(page); await page.click("#endRoundBtn"); }
    await page.click("#nextBtn");
    await page.waitForSelector("#replayBtn");
    const best = (await page.evaluate(() => window.__centapillion.store())).unlimited.best[3];
    assert.ok(best > 0);
    await page.click("#replayBtn");
    let st = await state(page);
    assert.equal(st.game, 3);
    assert.equal(st.phase, "intro");
    assert.match(await page.textContent(".intro-meta"), new RegExp("best " + best));
    await page.click("#beginBtn");
    await toAnswering(page);
    await page.click("#endRoundBtn");
    for (let r = 1; r < 7; r++) { await page.click("#nextBtn"); await toAnswering(page); await page.click("#endRoundBtn"); }
    await page.click("#nextBtn");
    assert.equal((await page.evaluate(() => window.__centapillion.store())).unlimited.best[3], best, "lower replay must not overwrite best");
    await page.click("#nextDigBtn");
    await page.waitForFunction(() => window.__centapillion.state().game !== 3);
    assert.equal((await state(page)).mode, "unlimited");
  });

  await step("dig log lists charted digs", async () => {
    await page.click('button.linkish:has-text("DIG LOG")');
    assert.match(await page.textContent("#modalBody"), /1\/\d+ charted · replays keep your best/);
    assert.equal(await page.locator(".arch.played").count(), 1);
    await page.keyboard.press("Escape");
  });

  await step("settings shows the missed log with copy", async () => {
    await page.click('[data-open="settings"]');
    assert.match(await page.textContent("#missedLog"), /zzqxj blorptastic/);
    await page.click("#copyMissed");
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /zzqxj/);
    await page.keyboard.press("Escape");
  });

  await step("diggers: locked until streak, classic selected", async () => {
    await page.click('[data-open="settings"]');
    assert.equal(await page.locator(".digger").count(), 7);
    assert.equal(await page.locator(".digger.locked").count(), 6);
    assert.equal(await page.locator(".digger.on").count(), 1);
    await page.keyboard.press("Escape");
  });

  await step("poking the digger doesn't break anything", async () => {
    const h = await page.evaluate(() => [innerWidth / 2, innerHeight * 0.42 - 30]);
    await page.mouse.click(h[0], h[1]);
    await page.waitForTimeout(200);
  });

  await step("erase progress uses an in-page confirm", async () => {
    await page.click('[data-open="settings"]');
    await page.click("text=Erase all progress");
    await page.click("#eraseYes");
    await page.waitForFunction(() => Object.keys(window.__centapillion.store().daily).length === 1);
    assert.equal((await state(page)).phase, "intro");
  });

  await step("bad routes and corrupt storage are survivable", async () => {
    await page.goto(BASE + "/#/archive/99999");
    await page.waitForFunction(() => window.__centapillion.state().mode === "daily");
    await page.evaluate(k => localStorage.setItem(k, "{not json"), KEY);
    await page.reload();
    await page.waitForSelector("#beginBtn");
  });

  await step("no runtime errors (desktop)", async () => assert.deepEqual(noFontErrors(page.errors), []));

  // ---------- later date: archive, streak, digger unlock ----------
  const later = await newPage(browser, { viewport: { width: 1280, height: 860 } }, new Date(2026, 11, 1, 15, 0));
  const p2 = later.page;
  await step("day #16: archive lists every day and plays an old one", async () => {
    await p2.goto(BASE + "/");
    await p2.waitForFunction(() => window.__centapillion);
    assert.equal(await p2.evaluate(() => window.__centapillion.today()), 16);
    await p2.click('[data-open="archive"]');
    assert.equal(await p2.locator(".arch").count(), 16);
    await p2.click('a.arch[href="#/archive/2"]');
    await p2.waitForFunction(() => window.__centapillion.state().mode === "archive");
    assert.equal((await state(p2)).game, 2);
  });

  await step("a 6-day streak unlocks the Glow Worm digger", async () => {
    await p2.evaluate(k => {
      const s = JSON.parse(localStorage.getItem(k));
      for (const d of [10, 11, 12, 13, 14, 15]) s.daily[d] = { mode: "daily", game: d, promptIds: window.CP.engine.promptsForDay(d, window.CP.PROMPTS).map(p => p.id), roundIndex: 6, phase: "done", results: [], v: 2 };
      localStorage.setItem(k, JSON.stringify(s));
    }, KEY);
    await p2.reload();
    await p2.click('[data-open="settings"]');
    assert.equal(await p2.locator(".digger.locked").count(), 5);
    await p2.click('.digger:has-text("Glow Worm")');
    assert.equal((await p2.evaluate(() => window.__centapillion.store())).settings.digger, "glow");
    await p2.keyboard.press("Escape");
    await p2.click('[data-open="stats"]');
    assert.match(await p2.textContent("#modalBody"), /6streak/);
  });
  await step("no runtime errors (later date)", async () => assert.deepEqual(noFontErrors(p2.errors), []));

  // ---------- mobile ----------
  const mob = await newPage(browser, { ...devices["iPhone 13"] });
  const m = mob.page;
  await step("mobile: play screen fits, many answers don't push into the dock", async () => {
    await m.goto(BASE + "/");
    await m.waitForSelector("#beginBtn");
    await m.screenshot({ path: path.join(SHOTS, "06-mobile-intro.png") });
    await m.tap("#beginBtn");
    await toAnswering(m);
    A = await answersFor(m);
    for (const n of [].concat(A.s.slice(0, 6), A.r.slice(0, 6))) await submit(m, n);
    await m.waitForTimeout(500);
    await m.screenshot({ path: path.join(SHOTS, "07-mobile-play.png") });
    const dock = await m.locator("#dock").boundingBox();
    assert.ok(dock.y + dock.height <= m.viewportSize().height + 1, "dock off screen");
    const haul = await m.locator("#haul").boundingBox();
    assert.ok(haul.y + haul.height < dock.y, "haul overlaps dock");
    assert.ok(!(await m.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "horizontal overflow");
  });
  await step("mobile: results screen", async () => {
    await m.click("#endRoundBtn");
    for (let r = 1; r < 7; r++) { await m.click("#nextBtn"); await toAnswering(m); await m.click("#endRoundBtn"); }
    await m.click("#nextBtn");
    await m.waitForSelector(".bigscore");
    await m.waitForTimeout(900);
    await m.screenshot({ path: path.join(SHOTS, "08-mobile-done.png") });
    assert.ok(!(await m.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "horizontal overflow");
  });
  await step("no runtime errors (mobile)", async () => assert.deepEqual(noFontErrors(m.errors), []));

  await browser.close();
  console.log(`\n${passes} passed, ${fails} failed`);
  process.exit(fails ? 1 : 0);
})();
