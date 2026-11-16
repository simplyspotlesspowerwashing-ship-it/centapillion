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
fs.mkdirSync(SHOTS, { recursive: true });

let fails = 0, passes = 0;
async function step(name, fn) {
  try { await fn(); passes++; console.log("ok   " + name); }
  catch (e) { fails++; console.log("FAIL " + name + "\n     " + (e.stack || e.message).split("\n").slice(0, 3).join("\n     ")); }
}

// answers for the current prompt, grouped by tier, computed in the page
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
async function submit(page, text) {
  await page.fill("#answer", text);
  await page.press("#answer", "Enter");
  await page.waitForTimeout(60);
}
async function toAnswering(page) {
  await skip(page, 3100);
  await page.waitForFunction(() => window.__centapillion.state().phase === "answering");
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  // Google Fonts may be unreachable in CI; don't let that stall loads.
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await step("loads with intro and no errors", async () => {
    await page.goto(BASE + "/");
    await page.waitForSelector("#beginBtn");
    const st = await state(page);
    assert.equal(st.phase, "intro");
    assert.equal(st.promptIds.length, 7);
    await page.screenshot({ path: path.join(SHOTS, "01-intro.png") });
  });

  await step("begin shows prompt with preview countdown and disabled input", async () => {
    await page.click("#beginBtn");
    const st = await state(page);
    assert.equal(st.phase, "preview");
    assert.ok(await page.isDisabled("#answer"));
    const txt = await page.textContent("#promptText");
    assert.ok(txt.length > 3);
    assert.match(await page.textContent("#countdown"), /^[123]$/);
  });

  await step("preview ends into a 45 second answer window", async () => {
    await toAnswering(page);
    const st = await state(page);
    const left = st.answerEndsAt - Date.now();
    assert.ok(left > 40000 && left <= 45000, "left=" + left);
    assert.ok(!(await page.isDisabled("#answer")));
    assert.equal(await page.evaluate(() => document.activeElement.id), "answer");
  });

  let A;
  await step("rare answer accepted and scored", async () => {
    A = await answersFor(page);
    await submit(page, A.k[0]);
    const st = await state(page);
    assert.equal(st.results[0].answers.length, 1);
    assert.equal(st.results[0].answers[0].score, 100);
    assert.equal(await page.textContent("#scoreNow"), "100");
    assert.equal(await page.inputValue("#answer"), "");
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(SHOTS, "02-accepted.png") });
  });

  await step("lowercase / extra spaces accepted; duplicate rejected", async () => {
    await submit(page, "  " + A.p[0].toUpperCase() + "  ");
    let st = await state(page);
    assert.equal(st.results[0].answers.length, 2);
    await submit(page, A.p[0].toLowerCase());
    st = await state(page);
    assert.equal(st.results[0].answers.length, 2);
    assert.match(await page.textContent("#dockMsg"), /already dug up/);
  });

  await step("nonsense rejected without scoring", async () => {
    await submit(page, "zzqxj blorptastic");
    const st = await state(page);
    assert.equal(st.results[0].answers.length, 2);
    assert.match(await page.textContent("#dockMsg"), /isn't in the dirt/);
  });

  await step("typo shows correction, second submit confirms", async () => {
    const long = A.s.concat(A.r).find(n => n.replace(/[^a-z]/gi, "").length >= 6 && /^[a-z ]+$/i.test(n));
    const typo = long.slice(0, 2) + long[3] + long[2] + long.slice(4); // swap two letters
    await submit(page, typo);
    let st = await state(page);
    assert.equal(st.results[0].answers.length, 2, "typo must not score until confirmed (" + typo + ")");
    assert.match(await page.textContent("#correction"), /submit again to confirm/);
    assert.equal(await page.inputValue("#answer"), long);
    await page.press("#answer", "Enter");
    await page.waitForTimeout(60);
    st = await state(page);
    assert.equal(st.results[0].answers.length, 3);
    assert.equal(await page.textContent("#correction"), "");
  });

  await step("empty submit ignored", async () => {
    await submit(page, "   ");
    assert.equal((await state(page)).results[0].answers.length, 3);
  });

  await step("5th answer fills slots and auto-ends the round", async () => {
    const st0 = await state(page);
    const have = new Set(st0.results[0].answers.map(a => a.name));
    const rest = [].concat(A.d, A.r, A.s).filter(n => !have.has(n)).slice(0, 3);
    await submit(page, rest[0]);
    await submit(page, rest[1]);
    let st = await state(page);
    assert.equal(st.results[0].answers.length, 5);
    await submit(page, rest[2]); // 6th: ignored
    st = await state(page);
    assert.equal(st.results[0].answers.length, 5);
    await page.waitForFunction(() => window.__centapillion.state().phase === "feedback", null, { timeout: 3000 });
    assert.ok(await page.isVisible("#nextBtn"));
    await page.screenshot({ path: path.join(SHOTS, "03-feedback.png") });
  });

  await step("Enter advances to round 2", async () => {
    await page.keyboard.press("Enter");
    const st = await state(page);
    assert.equal(st.roundIndex, 1);
    assert.equal(st.phase, "preview");
  });

  await step("time running out ends the round with 0 points", async () => {
    await toAnswering(page);
    const before = (await state(page)).results.reduce((s, r) => s + r.answers.reduce((x, a) => x + a.score, 0), 0);
    await skip(page, 45100);
    await page.waitForFunction(() => window.__centapillion.state().phase === "feedback");
    const st = await state(page);
    assert.equal(st.results[1].answers.length, 0);
    assert.match(await page.textContent("#panel"), /DEAD END/);
    const after = st.results.reduce((s, r) => s + r.answers.reduce((x, a) => x + a.score, 0), 0);
    assert.equal(before, after);
  });

  await step("typo left in the box at time-up is auto-accepted", async () => {
    await page.click("#nextBtn");
    await toAnswering(page);
    A = await answersFor(page);
    const long = A.s.find(n => /^[a-z]{6,}$/i.test(n)) || A.s[0];
    await page.fill("#answer", long.slice(0, -1) + (long.endsWith("x") ? "y" : "x"));
    await skip(page, 45100);
    await page.waitForFunction(() => window.__centapillion.state().phase === "feedback");
    const st = await state(page);
    assert.equal(st.results[2].answers.length, 1, "expected forced accept of " + long);
  });

  await step("end-round button works mid-round", async () => {
    await page.click("#nextBtn");
    await toAnswering(page);
    A = await answersFor(page);
    await submit(page, A.s[0]);
    await page.click("#endRoundBtn");
    const st = await state(page);
    assert.equal(st.phase, "feedback");
    assert.equal(st.results[3].answers.length, 1);
  });

  await step("reload mid-round resumes with timer still running", async () => {
    await page.click("#nextBtn");
    await toAnswering(page);
    A = await answersFor(page);
    await submit(page, A.p[0]);
    const endsAt = (await state(page)).answerEndsAt;
    await page.reload();
    await page.waitForFunction(() => window.__centapillion && window.__centapillion.state().phase === "answering");
    const st = await state(page);
    assert.equal(st.answerEndsAt, endsAt);
    assert.equal(st.roundIndex, 4);
    assert.equal(await page.locator(".slot.filled").count(), 1);
  });

  await step("closing during a round then returning after time-up lands on feedback", async () => {
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("centapillion:v1"));
      const d = Object.keys(s.daily)[0];
      s.daily[d].answerEndsAt = Date.now() - 1000;
      localStorage.setItem("centapillion:v1", JSON.stringify(s));
    });
    // the storage event only fires in other tabs, so reload
    await page.reload();
    await page.waitForFunction(() => window.__centapillion.state().phase === "feedback");
    assert.equal((await state(page)).results[4].answers.length, 1);
  });

  await step("finish rounds 6-7 and reach results", async () => {
    for (let r = 5; r < 7; r++) {
      await page.click("#nextBtn");
      await toAnswering(page);
      A = await answersFor(page);
      await submit(page, A.r[0]);
      await submit(page, A.d[0]);
      await page.click("#endRoundBtn");
    }
    await page.click("#nextBtn");
    const st = await state(page);
    assert.equal(st.phase, "done");
    await page.waitForSelector(".bigscore");
    const total = st.results.reduce((s, r) => s + r.answers.reduce((x, a) => x + a.score, 0), 0);
    assert.equal(await page.textContent(".bigscore .num"), String(total));
    const share = await page.textContent(".share-preview");
    assert.match(share, /^Centapillion #\d+ 🐛\n\d+ pts · -[\d,]+ m\n/);
    assert.equal(share.split("\n").length, 2 + 7 + 1);
    assert.ok(share.includes("⬛"), "dead-end round shows miss emoji");
    assert.equal(await page.locator(".sheet-round").count(), 7);
    assert.ok(await page.locator(".nm.you").count() >= 10);
    await page.waitForTimeout(1200);
    const dots = await page.locator(".chart .dot:not(.miss)").count();
    assert.ok(dots >= 10, "chart dots: " + dots);
    const op = await page.locator(".chart .dot").first().evaluate(e => getComputedStyle(e).opacity);
    assert.equal(op, "1");
    await page.screenshot({ path: path.join(SHOTS, "04-done.png"), fullPage: false });
  });

  await step("results persist after reload (one dig per day)", async () => {
    await page.reload();
    await page.waitForSelector(".bigscore");
    assert.equal((await state(page)).phase, "done");
  });

  await step("share copies to clipboard", async () => {
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.click("#shareBtn");
    await page.waitForSelector(".toast.show");
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    assert.match(clip, /^Centapillion #/);
  });

  await step("stats modal shows 1 played, streak 1", async () => {
    await page.click('[data-open="stats"]');
    const txt = await page.textContent("#modalBody");
    assert.match(txt, /1played/);
    assert.match(txt, /1streak/);
    await page.screenshot({ path: path.join(SHOTS, "05-stats.png") });
    await page.keyboard.press("Escape");
  });

  await step("how-to and settings modals open; mute toggles", async () => {
    await page.click('[data-open="howto"]');
    assert.match(await page.textContent("#modalBody"), /One in a Centapillion/);
    await page.click("#modalClose");
    await page.click("#muteBtn");
    const s = await page.evaluate(() => JSON.parse(localStorage.getItem("centapillion:v1")).settings);
    assert.equal(s.muted, true);
  });

  await step("unlimited mode starts a fresh game", async () => {
    await page.goto(BASE + "/#/unlimited");
    await page.waitForFunction(() => window.__centapillion.state().mode === "unlimited");
    const st = await state(page);
    assert.equal(st.phase, "intro");
    await page.click("#beginBtn");
    await toAnswering(page);
    A = await answersFor(page);
    await submit(page, A.p[0]);
    assert.equal((await state(page)).results[0].answers.length, 1);
  });

  await step("invalid hash routes fall back to today's dig", async () => {
    await page.goto(BASE + "/#/archive/99999");
    await page.waitForFunction(() => window.__centapillion.state().mode === "daily");
    await page.goto(BASE + "/#/garbage");
    await page.waitForFunction(() => window.__centapillion.state().mode === "daily");
  });

  await step("corrupt localStorage does not break the game", async () => {
    await page.evaluate(() => localStorage.setItem("centapillion:v1", "{not json"));
    await page.reload();
    await page.waitForSelector("#beginBtn");
  });

  await step("no runtime errors on desktop", async () => {
    console.log("     errors:", JSON.stringify(errors)); assert.deepEqual(errors.filter(e => !/ERR_FAILED|net::/.test(e)), []);
  });

  // ---------- later date: archive + streaks ----------
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await ctx2.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const p2 = await ctx2.newPage();
  const errors2 = [];
  p2.on("pageerror", e => errors2.push(e.message));
  await p2.clock.install({ time: new Date(2026, 10, 20, 15, 0) }); // day #5
  await p2.clock.resume();

  await step("day #5 by date; archive lists 5 days and plays an old one", async () => {
    await p2.goto(BASE + "/");
    await p2.waitForFunction(() => window.__centapillion);
    assert.equal(await p2.evaluate(() => window.__centapillion.today()), 5);
    await p2.click('[data-open="archive"]');
    assert.equal(await p2.locator(".arch").count(), 5);
    await p2.click('a.arch[href="#/archive/2"]');
    await p2.waitForFunction(() => window.__centapillion.state().mode === "archive");
    const st = await state(p2);
    assert.equal(st.game, 2);
  });

  await step("streak counts consecutive finished days", async () => {
    await p2.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("centapillion:v1"));
      for (const d of [2, 3, 4]) s.daily[d] = { mode: "daily", game: d, promptIds: window.CP.engine.promptsForDay(d, window.CP.PROMPTS).map(p => p.id), roundIndex: 6, phase: "done", results: [], v: 1 };
      localStorage.setItem("centapillion:v1", JSON.stringify(s));
    });
    // reload straight away: navigating first would let the open page save its own copy over ours
    await p2.reload();
    await p2.click('[data-open="stats"]');
    const txt = await p2.textContent("#modalBody");
    assert.match(txt, /3played/);
    assert.match(txt, /3streak/); // today not played yet: streak runs through yesterday
  });

  await step("no runtime errors on later date", async () => assert.deepEqual(errors2, []));

  // ---------- mobile ----------
  const ctx3 = await browser.newContext({ ...devices["iPhone 13"] });
  await ctx3.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const m = await ctx3.newPage();
  const errors3 = [];
  m.on("pageerror", e => errors3.push(e.message));
  await step("mobile: intro, play and results fit the screen", async () => {
    await m.goto(BASE + "/");
    await m.waitForSelector("#beginBtn");
    await m.screenshot({ path: path.join(SHOTS, "06-mobile-intro.png") });
    await m.tap("#beginBtn");
    await toAnswering(m);
    A = await answersFor(m);
    await submit(m, A.r[0]);
    await submit(m, A.s[0]);
    await m.waitForTimeout(300);
    await m.screenshot({ path: path.join(SHOTS, "07-mobile-play.png") });
    const box = await m.locator("#dock").boundingBox();
    const vh = m.viewportSize().height;
    assert.ok(box.y + box.height <= vh + 1, "dock off screen");
    const prompt = await m.locator("#promptText").boundingBox();
    assert.ok(prompt.y >= 40, "prompt hidden under top bar");
    const slots = await m.locator("#slots").boundingBox();
    assert.ok(slots.y + slots.height < box.y, "slots overlap dock");
    const overflow = await m.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.ok(!overflow, "horizontal overflow");
  });
  await step("no runtime errors on mobile", async () => assert.deepEqual(errors3, []));

  await browser.close();
  console.log(`\n${passes} passed, ${fails} failed`);
  process.exit(fails ? 1 : 0);
})();
