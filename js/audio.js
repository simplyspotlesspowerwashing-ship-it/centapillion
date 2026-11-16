/* Synthesised sound effects (Web Audio). No audio files needed. */
(function (root) {
  var CP = (root.CP = root.CP || {});
  var ctx = null, master = null, muted = false;

  function ensure() {
    if (muted) return null;
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when, slideTo) {
    var c = ensure(); if (!c) return;
    var t = c.currentTime + (when || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noise(dur, vol, when, lp) {
    var c = ensure(); if (!c) return;
    var t = c.currentTime + (when || 0);
    var len = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = c.createBufferSource(); s.buffer = buf;
    var f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp || 800;
    var g = c.createGain(); g.gain.value = vol || 0.2;
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t);
  }

  var TIER_NOTES = { p: [330], c: [349, 294], s: [392, 494], r: [440, 554, 659], d: [523, 659, 784], k: [523, 659, 784, 1047] };

  var SFX = {
    type: function () { noise(0.03, 0.05, 0, 1800); },
    submit: function () { noise(0.12, 0.18, 0, 500); tone(110, 0.12, "triangle", 0.15); },
    reject: function () { tone(160, 0.18, "square", 0.12, 0, 90); },
    duplicate: function () { tone(220, 0.08, "square", 0.08); tone(220, 0.08, "square", 0.08, 0.1); },
    accept: function (tier) {
      (TIER_NOTES[tier] || [440]).forEach(function (f, i) { tone(f, 0.18, "square", 0.12, i * 0.07); });
      noise(0.25, 0.12, 0, 400);
    },
    tick: function () { tone(880, 0.04, "square", 0.06); },
    go: function () { tone(660, 0.12, "square", 0.12); tone(990, 0.16, "square", 0.12, 0.1); },
    timeup: function () { tone(330, 0.2, "sawtooth", 0.1, 0, 110); },
    descend: function () { noise(0.6, 0.2, 0, 300); tone(90, 0.5, "triangle", 0.18, 0, 50); },
    done: function () { [392, 494, 587, 784].forEach(function (f, i) { tone(f, 0.25, "square", 0.12, i * 0.12); }); }
  };

  CP.audio = {
    play: function (name, arg) { if (!muted && SFX[name]) try { SFX[name](arg); } catch (e) { /* audio is optional */ } },
    setMuted: function (m) { muted = !!m; },
    isMuted: function () { return muted; },
    unlock: function () { ensure(); }
  };
})(typeof window !== "undefined" ? window : globalThis);
