/*
 * The dig: a pixel-art cross-section of the earth. A centipede tunnels
 * down as points come in. Low-resolution world canvas (scaled up,
 * pixelated) plus a full-resolution canvas for labels and lighting.
 */
(function (root) {
  var CP = (root.CP = root.CP || {});
  var S = CP.sprites;

  var PX_PER_M = 0.1;      // world pixels per metre (low-res pixels)
  var SURFACE_Y = 0;       // world y of the grass line
  var ANCHOR = 0.42;       // head sits this far down the screen

  function hash(x, y) {
    var h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >>> 13)) * 1274126177 | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hexToRgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, t) {
    var x = hexToRgb(a), y = hexToRgb(b);
    return "rgb(" + Math.round(lerp(x[0], y[0], t)) + "," + Math.round(lerp(x[1], y[1], t)) + "," + Math.round(lerp(x[2], y[2], t)) + ")";
  }

  function stratumAt(m) {
    var st = CP.STRATA, i = st.length - 1;
    while (i > 0 && m < st[i].m) i--;
    return i;
  }

  function Scene(world, hud) {
    this.world = world;
    this.hud = hud;
    this.wctx = world.getContext("2d");
    this.hctx = hud.getContext("2d");
    this.reduced = false;
    this.lowPower = false;
    this.frame = 0;
    this.digger = CP.DIGGERS[0];
    this.plungeInfo = null;
    this.pokeInfo = null;
    this.particles = [];
    this.markers = [];
    this.flash = null;
    this.shake = 0;
    this.t = 0;
    this.reset();
    this._resize = this.resize.bind(this);
    window.addEventListener("resize", this._resize);
    this.resize();
    this._loop = this.loop.bind(this);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this._loop);
  }

  Scene.prototype.reset = function () {
    this.targetM = 0;
    this.headY = SURFACE_Y - 10;
    this.headX = 0;
    this.camY = SURFACE_Y - 10 + (ANCHOR - 0.24) * (this.H || 200);
    this.path = [];
    this.markers = [];
    this.particles = [];
    this.digging = false;
    this.started = false;
  };

  Scene.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = window.innerWidth, H = window.innerHeight;
    this.scale = W < 600 ? 3 : 4;
    this.W = Math.ceil(W / this.scale);
    this.H = Math.ceil(H / this.scale);
    this.world.width = this.W;
    this.world.height = this.H;
    this.wctx.imageSmoothingEnabled = false;
    this.hud.width = Math.round(W * dpr);
    this.hud.height = Math.round(H * dpr);
    this.hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cssW = W; this.cssH = H;
    this.headX = Math.round(this.W / 2);
  };

  // Begin the dig: centipede pokes into the ground.
  Scene.prototype.start = function () {
    if (this.started) return;
    this.started = true;
    this.path = [[this.headX, SURFACE_Y - 6]];
    this.setDepth(0);
  };

  Scene.prototype.setDepth = function (metres, instant) {
    this.targetM = Math.max(0, metres);
    var ty = SURFACE_Y + 6 + this.targetM * PX_PER_M;
    if (instant || this.reduced) {
      this.headY = ty;
      this.camY = ty;
      this.path = [[this.W / 2, SURFACE_Y - 6]];
      for (var y = SURFACE_Y - 6; y <= ty; y += 2) this.path.push([this.W / 2 + Math.sin(y * 0.07) * 6, y]);
    }
  };

  Scene.prototype.addMarker = function (round, metres, tier) {
    this.markers = this.markers.filter(function (m) { return m.round !== round; });
    this.markers.push({ round: round, m: metres, tier: tier });
  };

  Scene.prototype.burst = function (wx, wy, n, color, speed) {
    if (this.reduced || this.lowPower) n = Math.min(n, 3);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = (0.4 + Math.random()) * (speed || 1);
      this.particles.push({ x: wx, y: wy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6, life: 40 + Math.random() * 30, c: color || this.speckColor() });
    }
    if (this.particles.length > 400) this.particles.splice(0, this.particles.length - 400);
  };

  Scene.prototype.speckColor = function () {
    var m = Math.max(0, (this.headY - SURFACE_Y) / PX_PER_M);
    return CP.STRATA[stratumAt(m)].speck;
  };

  Scene.prototype.typeFx = function () { this.burst(this.headX, this.headY + 3, 2, null, 0.6); };
  Scene.prototype.submitFx = function () { this.burst(this.headX, this.headY + 3, 8, null, 1.2); };
  Scene.prototype.rejectFx = function () { this.shake = 10; this.burst(this.headX, this.headY, 6, "#ff5252", 1); };
  Scene.prototype.acceptFx = function (tier) {
    var c = CP.TIERS[tier].color;
    this.flash = { c: c, life: 1 };
    this.burst(this.headX, this.headY + 4, tier === "k" ? 40 : 16, c, tier === "k" ? 2 : 1.3);
  };

  Scene.prototype.loop = function (now) {
    var dt = Math.min(50, now - this.last) / 16.67;
    this.last = now;
    this.frame++;
    if (!document.hidden && !(this.lowPower && this.frame % 2)) {
      this.update(this.lowPower ? dt * 2 : dt);
      this.draw();
    }
    this.raf = requestAnimationFrame(this._loop);
  };

  Scene.prototype.update = function (dt) {
    this.t += dt;
    var ty = this.started ? SURFACE_Y + 6 + this.targetM * PX_PER_M : SURFACE_Y - 10;
    var prevY = this.headY;
    var gap = ty - this.headY;
    if (Math.abs(gap) > 0.3) {
      var step = Math.max(0.6, Math.min(Math.abs(gap) * 0.06, 9)) * dt;
      this.headY += Math.sign(gap) * Math.min(step, Math.abs(gap));
      this.digging = true;
    } else {
      this.headY = ty;
      this.digging = false;
    }
    var cx = this.W / 2;
    this.headX = cx + Math.sin(this.headY * 0.07) * 6;
    if (this.started) {
      var last = this.path[this.path.length - 1];
      if (!last) this.path.push([this.headX, this.headY]);
      else if (Math.abs(this.headY - last[1]) >= 1) {
        // fill in every pixel row so fast digs leave a continuous tunnel
        var steps = Math.ceil(Math.abs(this.headY - last[1]));
        for (var s = 1; s <= steps; s++) {
          var yy = last[1] + (this.headY - last[1]) * s / steps;
          this.path.push([cx + Math.sin(yy * 0.07) * 6, yy]);
        }
      }
      if (this.digging && Math.random() < 0.6 * dt) this.burst(this.headX, this.headY + 4, 1, null, 0.8);
    }
    // camera follows with lag
    var introAt = this.cssW < 600 ? 0.11 : 0.24; // keep the resting digger above the intro card
    var camTarget = this.started ? this.headY : SURFACE_Y - 10 + (ANCHOR - introAt) * this.H;
    this.camY += (camTarget - this.camY) * Math.min(1, 0.08 * dt);
    if (this.reduced) this.camY = camTarget;
    // particles
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.06 * dt; p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);
    if (this.flash) { this.flash.life -= 0.03 * dt; if (this.flash.life <= 0) this.flash = null; }
    void prevY;
  };

  Scene.prototype.toScreenY = function (wy) {
    return Math.round(wy - this.camY + this.H * ANCHOR);
  };

  Scene.prototype.draw = function () {
    var ctx = this.wctx, W = this.W, H = this.H;
    var sx = this.shake ? Math.round((Math.random() - 0.5) * this.shake * 0.4) : 0;
    ctx.save();
    ctx.translate(sx, 0);
    var top = this.camY - H * ANCHOR; // world y at screen row 0

    // rows: sky above surface, strata below
    for (var y = 0; y < H; y++) {
      var wy = top + y;
      if (wy < SURFACE_Y) {
        var t = Math.min(1, Math.max(0, (SURFACE_Y - wy) / 120));
        ctx.fillStyle = mix("#ffb46b", "#1a1c2c", t);
      } else {
        var m = (wy - SURFACE_Y) / PX_PER_M;
        var i = stratumAt(m), st = CP.STRATA[i], next = CP.STRATA[i + 1];
        var span = next ? next.m - st.m : 10000;
        var f = Math.min(1, (m - st.m) / span);
        ctx.fillStyle = mix(st.top, st.bottom, f);
      }
      ctx.fillRect(-2, y, W + 4, 1);
    }

    // sky decor
    if (top < SURFACE_Y) {
      var sunY = this.toScreenY(SURFACE_Y - 38);
      S.disc(ctx, Math.round(W * 0.78), sunY, 9, "#ffd166");
      S.disc(ctx, Math.round(W * 0.78), sunY, 6, "#ffe9a8");
      for (var c = 0; c < 4; c++) {
        var cxp = ((c * 97 + this.t * 0.05 * (c + 1)) % (W + 40)) - 20, cyp = this.toScreenY(SURFACE_Y - 70 - c * 17);
        ctx.fillStyle = "rgba(255,233,168,0.55)";
        ctx.fillRect(Math.round(cxp), cyp, 14, 2); ctx.fillRect(Math.round(cxp) + 3, cyp - 2, 7, 2);
      }
      // distant hills
      for (var hx = -2; hx < W + 2; hx++) {
        var hh = 6 + Math.sin(hx * 0.05) * 4 + Math.sin(hx * 0.13 + 1) * 2;
        ctx.fillStyle = "#3a5a2a";
        ctx.fillRect(hx, this.toScreenY(SURFACE_Y - hh), 1, Math.ceil(hh));
      }
      // grass line
      var gy = this.toScreenY(SURFACE_Y);
      ctx.fillStyle = "#2b6338"; ctx.fillRect(-2, gy - 1, W + 4, 3);
      ctx.fillStyle = "#5fd36b";
      for (var gx = -2; gx < W + 2; gx += 2) {
        var bh = 1 + Math.floor(hash(gx, 7) * 3);
        ctx.fillRect(gx, gy - 1 - bh, 1, bh);
      }
    }

    // specks and embedded objects
    var cell = 5;
    var y0 = Math.floor(top / cell) * cell;
    for (var cy = y0; cy < top + H; cy += cell) {
      if (cy < SURFACE_Y + 2) continue;
      var mm = (cy - SURFACE_Y) / PX_PER_M;
      var stt = CP.STRATA[stratumAt(mm)];
      for (var cxx = 0; cxx < W; cxx += cell) {
        var hsh = hash(cxx, cy);
        if (hsh < 0.18) {
          ctx.fillStyle = stt.speck;
          ctx.globalAlpha = 0.35 + hsh * 2;
          ctx.fillRect(cxx + Math.floor(hash(cy, cxx) * cell), this.toScreenY(cy), hsh < 0.05 ? 2 : 1, 1);
        }
      }
      ctx.globalAlpha = 1;
    }
    var chunk = 36;
    var c0 = Math.floor(top / chunk) - 1;
    for (var ci = c0; ci < c0 + H / chunk + 3; ci++) {
      var wyc = ci * chunk;
      if (wyc < SURFACE_Y + 6) continue;
      for (var k = 0; k < 2; k++) {
        var hv = hash(ci, k + 11);
        if (hv > 0.75) continue;
        var ox = Math.floor(hash(k, ci) * W);
        if (Math.abs(ox - W / 2) < 14) ox = (ox + W / 3) % W;
        this.drawObject(ctx, ox, this.toScreenY(wyc + Math.floor(hash(ci, k) * chunk)), (wyc - SURFACE_Y) / PX_PER_M, hv);
      }
    }

    // round markers (horizontal strata lines at each round's end depth)
    for (var mi = 0; mi < this.markers.length; mi++) {
      var mk = this.markers[mi];
      var my = this.toScreenY(SURFACE_Y + 6 + mk.m * PX_PER_M);
      if (my < -2 || my > H + 2) continue;
      ctx.fillStyle = mk.tier ? CP.TIERS[mk.tier].color : "#8fa3c4";
      for (var dx = 0; dx < W; dx += 4) ctx.fillRect(dx, my, 2, 1);
    }

    // tunnel
    ctx.fillStyle = "#0b0705";
    for (var pi = 0; pi < this.path.length; pi++) {
      var pp = this.path[pi], ty = this.toScreenY(pp[1]);
      if (ty < -6 || ty > H + 6) continue;
      ctx.fillRect(Math.round(pp[0]) - 3, ty - 1, 7, 3);
    }
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (var pj = 0; pj < this.path.length; pj += 2) {
      var pq = this.path[pj], tq = this.toScreenY(pq[1]);
      if (tq < -6 || tq > H + 6) continue;
      ctx.fillRect(Math.round(pq[0]) - 3, tq, 1, 1);
    }

    this.drawCentipede(ctx);

    // particles
    for (var q = 0; q < this.particles.length; q++) {
      var pa = this.particles[q];
      ctx.globalAlpha = Math.min(1, pa.life / 20);
      ctx.fillStyle = pa.c;
      ctx.fillRect(Math.round(pa.x), this.toScreenY(pa.y), 1, 1);
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    this.drawHud(top);
  };

  Scene.prototype.drawObject = function (ctx, x, y, m, v) {
    var i = stratumAt(m), name = CP.STRATA[i].name;
    if (y < -12 || y > this.H + 12) return;
    if (name === "TOPSOIL") {
      if (m < 500 && v < 0.4) { // roots
        ctx.fillStyle = "#c4a070";
        for (var r = 0; r < 10; r++) ctx.fillRect(x + Math.round(Math.sin(r * 0.8 + v * 9) * 2), y - 10 + r, 1, 1);
        ctx.fillRect(x + 1, y - 4, 2, 1);
      } else if (v < 0.5) {
        S.disc(ctx, x, y, 2, "#3a2a1a"); S.disc(ctx, x, y, 1, "#7a6a5a");
      } else { // a tiny earthworm cousin
        ctx.fillStyle = "#ff8fa3";
        for (var w = 0; w < 6; w++) ctx.fillRect(x + w, y + Math.round(Math.sin(w + this.t * 0.05) * 1), 1, 1);
      }
    } else if (name === "CLAY") {
      S.disc(ctx, x, y, 3, "#5c2e14"); S.disc(ctx, x - 1, y - 1, 1, "#b8895a");
    } else if (name === "FOSSIL BEDS") {
      if (v < 0.35) { // ammonite spiral
        ctx.fillStyle = "#e8d5b0";
        for (var a = 0; a < 18; a++) { var rr = a * 0.3; ctx.fillRect(Math.round(x + Math.cos(a * 0.7) * rr), Math.round(y + Math.sin(a * 0.7) * rr), 1, 1); }
      } else { // bone
        ctx.fillStyle = "#e8e4da";
        ctx.fillRect(x - 4, y, 9, 1);
        ctx.fillRect(x - 5, y - 1, 2, 3); ctx.fillRect(x + 4, y - 1, 2, 3);
      }
    } else if (name === "BEDROCK") {
      ctx.fillStyle = "#20242c";
      ctx.fillRect(x - 4, y, 9, 1); ctx.fillRect(x - 2, y - 1, 5, 1);
      if (v < 0.2) { ctx.fillStyle = "#ffd166"; ctx.fillRect(x + 1, y - 1, 1, 1); }
    } else if (name === "CRYSTAL CAVES") {
      var cols = ["#9d7bff", "#4de3ff", "#ff5d8f"], col = cols[Math.floor(v * 3.99) % 3];
      ctx.fillStyle = col;
      for (var h = 0; h < 5; h++) { ctx.fillRect(x, y - h, 1, 1); ctx.fillRect(x + 2, y - Math.floor(h * 0.6), 1, 1); ctx.fillRect(x - 2, y - Math.floor(h * 0.5), 1, 1); }
      ctx.fillStyle = "#ffffff"; ctx.fillRect(x, y - 4, 1, 1);
    } else if (name === "MAGMA") {
      var pulse = 1 + Math.round(Math.sin(this.t * 0.08 + v * 20));
      S.disc(ctx, x, y, 2 + pulse, "#ff6b3d"); S.disc(ctx, x, y, 1 + pulse, "#ffb000");
    } else {
      ctx.fillStyle = Math.sin(this.t * 0.1 + v * 30) > 0 ? "#ffffff" : "#ffe9a8";
      ctx.fillRect(x, y, 1, 1); ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3);
    }
  };

  Scene.prototype.drawCentipede = function (ctx) {
    var segs = [], n = 9, spacing = 3.2;
    var hx = this.headX, hy = this.started ? this.headY : SURFACE_Y - 8 + Math.sin(this.t * 0.08) * 1.5;
    if (!this.started) {
      // resting on the grass, curled
      for (var i = 0; i < n; i++) segs.push([hx - 12 + i * 3, hy + Math.sin(i * 0.9 + this.t * 0.06) * 1.2]);
      segs.reverse();
    } else {
      segs.push([hx, hy]);
      var acc = 0, idx = this.path.length - 1, prev = [hx, hy];
      while (segs.length < n && idx >= 0) {
        var p = this.path[idx];
        var d = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
        acc += d;
        if (acc >= spacing) { segs.push([p[0], p[1]]); acc = 0; }
        prev = p; idx--;
      }
      while (segs.length < n) {
        var l = segs[segs.length - 1];
        segs.push([l[0], l[1] - spacing]);
      }
    }
    var body = this.digger.body, dark = this.digger.dark, leg = "#1a0f0a", hiC = this.digger.hi;
    if (this.pokeInfo) {
      var pa = (performance.now() - this.pokeInfo.t0) / 600;
      if (pa < 1) { var hop = Math.round(Math.sin(pa * Math.PI) * 4); segs = segs.map(function (sg, i) { return [sg[0] + (i % 2 ? 1 : -1) * Math.round(Math.sin(pa * 20)), sg[1] - hop]; }); }
    }
    for (var s = segs.length - 1; s >= 0; s--) {
      var sg = segs[s], x = Math.round(sg[0]), y = this.toScreenY(sg[1]);
      var wig = Math.sin(this.t * 0.4 + s * 1.3) > 0 ? 1 : 0;
      ctx.fillStyle = leg;
      ctx.fillRect(x - 4, y + wig, 2, 1); ctx.fillRect(x + 3, y + 1 - wig, 2, 1);
      var head = s === 0, r = head ? 3 : 2;
      S.disc(ctx, x, y, r + 1, "#1a0f0a");
      S.disc(ctx, x, y, r, head ? body : (s % 2 ? body : dark));
      ctx.fillStyle = hiC; ctx.fillRect(x - 1, y - 1, 1, 1);
      if (head) {
        var down = this.started;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 1, y + (down ? 1 : -1), 1, 1); ctx.fillRect(x + 1, y + (down ? 1 : -1), 1, 1);
        ctx.fillStyle = "#1a0f0a";
        var ay = down ? 1 : -1, sw = Math.round(Math.sin(this.t * 0.2));
        ctx.fillRect(x - 2 - sw, y + ay * 4, 1, 1); ctx.fillRect(x - 3 - sw, y + ay * 5, 1, 1);
        ctx.fillRect(x + 2 + sw, y + ay * 4, 1, 1); ctx.fillRect(x + 3 + sw, y + ay * 5, 1, 1);
        if (down) { ctx.fillStyle = "#ffe9a8"; ctx.fillRect(x - 1, y + 3, 1, 1); ctx.fillRect(x + 1, y + 3, 1, 1); }
      }
    }
  };

  Scene.prototype.drawHud = function (top) {
    var ctx = this.hctx, W = this.cssW, H = this.cssH, sc = this.scale;
    ctx.clearRect(0, 0, W, H);
    var headScreenY = (this.headY - top) * sc;
    var depthM = Math.max(0, (this.headY - SURFACE_Y - 6) / PX_PER_M);

    // darkness grows with depth; the centipede carries a little light
    var dark = Math.min(0.55, depthM / 30000);
    if (dark > 0.01) {
      var g = ctx.createRadialGradient(W / 2, headScreenY, 30, W / 2, headScreenY, Math.max(W, H) * 0.7);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0," + dark.toFixed(3) + ")");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    if (this.flash) {
      var fg = ctx.createRadialGradient(W / 2, headScreenY, 4, W / 2, headScreenY, 180);
      fg.addColorStop(0, this.flash.c + "88");
      fg.addColorStop(1, this.flash.c + "00");
      ctx.globalAlpha = Math.max(0, this.flash.life);
      ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    // depth gauge on the left
    ctx.font = "11px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textBaseline = "middle";
    var mTop = (top - SURFACE_Y - 6) / PX_PER_M, mBottom = mTop + this.H / PX_PER_M;
    var stepM = 500;
    var first = Math.max(0, Math.ceil(mTop / stepM) * stepM);
    for (var m = first; m <= mBottom; m += stepM) {
      var y = (SURFACE_Y + 6 + m * PX_PER_M - top) * sc;
      var major = m % 2000 === 0;
      ctx.fillStyle = "rgba(232,228,218," + (major ? 0.55 : 0.25) + ")";
      ctx.fillRect(0, Math.round(y), major ? 14 : 7, 1);
      if (major) ctx.fillText(m === 0 ? "0 m" : "-" + m.toLocaleString("en-US") + " m", 18, y);
    }
    // strata names on the right
    ctx.textAlign = "right";
    for (var i = 0; i < (this.quiet ? 0 : CP.STRATA.length); i++) {
      var st = CP.STRATA[i];
      var sy = (SURFACE_Y + 6 + st.m * PX_PER_M - top) * sc;
      if (sy < -20 || sy > H + 20) continue;
      ctx.fillStyle = "rgba(232,228,218,0.18)";
      ctx.fillRect(W - 120, Math.round(sy), 120, 1);
      ctx.fillStyle = "rgba(232,228,218,0.5)";
      ctx.fillText(st.name, W - 10, sy + 10);
    }
    for (var l = 0; l < (this.quiet ? 0 : CP.LANDMARKS.length); l++) {
      var lm = CP.LANDMARKS[l];
      var ly = (SURFACE_Y + 6 + lm.m * PX_PER_M - top) * sc;
      if (ly < -20 || ly > H + 20) continue;
      ctx.fillStyle = "rgba(77,227,255,0.35)";
      for (var dx = W - 230; dx < W; dx += 6) ctx.fillRect(dx, Math.round(ly), 3, 1);
      ctx.fillStyle = "rgba(77,227,255,0.75)";
      ctx.fillText(lm.label, W - 10, ly - 9);
    }
    ctx.textAlign = "left";
    for (var mk = 0; mk < this.markers.length; mk++) {
      var mr = this.markers[mk];
      var ry = (SURFACE_Y + 6 + mr.m * PX_PER_M - top) * sc;
      if (ry < -20 || ry > H + 20) continue;
      ctx.fillStyle = mr.tier ? CP.TIERS[mr.tier].color : "#8fa3c4";
      ctx.fillText("R" + (mr.round + 1), 18, ry - 8);
    }

    // tier lines for the latest answer
    if (this.plungeInfo) {
      var age = performance.now() - this.plungeInfo.t0, life = 2400;
      if (age > life) this.plungeInfo = null;
      else {
        var fade = age < 200 ? age / 200 : age > life - 500 ? (life - age) / 500 : 1;
        var px0 = Math.min(W / 2 + 200, W - 210);
        for (var ti = 0; ti < CP.TIER_IDS.length; ti++) {
          var tid = CP.TIER_IDS[ti], T = CP.TIERS[tid];
          var tm = this.plungeInfo.fromM + T.score * CP.CONFIG.METRES_PER_POINT;
          var ty = (SURFACE_Y + 6 + tm * PX_PER_M - top) * sc;
          var hit = tid === this.plungeInfo.tier;
          var reveal = Math.min(1, age / (180 + ti * 90));
          ctx.globalAlpha = fade * reveal * (hit ? 1 : 0.42);
          ctx.fillStyle = T.color;
          for (var lx = 0; lx < W; lx += hit ? 6 : 8) ctx.fillRect(lx, Math.round(ty), hit ? 4 : 3, hit ? 2 : 1);
          var img = CP.sprites.tierImage(tid);
          var label = T.name.toUpperCase() + " · " + T.score;
          ctx.font = (hit ? "bold 13px" : "11px") + " 'JetBrains Mono', ui-monospace, monospace";
          var tw = ctx.measureText(label).width;
          var bx = Math.max(px0, W - tw - 46);
          ctx.fillStyle = "rgba(10,6,4,0.75)";
          ctx.fillRect(bx - 4, ty - 13, tw + 36, 24);
          if (img && img.complete) { ctx.imageSmoothingEnabled = false; ctx.drawImage(img, bx, ty - 11, 20, 20); }
          ctx.fillStyle = T.color;
          ctx.fillText(label, bx + 26, ty);
        }
        ctx.globalAlpha = 1;
      }
    }

    // speech bubble when poked
    if (this.pokeInfo) {
      var pg = performance.now() - this.pokeInfo.t0;
      if (pg > 1300) this.pokeInfo = null;
      else {
        var hs = this.headScreen();
        ctx.font = "bold 14px 'JetBrains Mono', ui-monospace, monospace";
        var t2 = this.pokeInfo.text, w2 = ctx.measureText(t2).width + 16;
        var bx2 = hs.x + 16, by2 = hs.y - 44 - Math.min(10, pg / 30);
        ctx.globalAlpha = pg > 1000 ? (1300 - pg) / 300 : 1;
        ctx.fillStyle = "#f4ecdc";
        ctx.fillRect(bx2, by2, w2, 24); ctx.fillRect(bx2 + 4, by2 + 24, 6, 6);
        ctx.fillStyle = "#1a0f0a";
        ctx.textAlign = "left";
        ctx.fillText(t2, bx2 + 8, by2 + 12);
        ctx.globalAlpha = 1;
      }
    }
  };

  Scene.prototype.depthMetres = function () { return this.targetM; };

  Scene.prototype.setDigger = function (d) { this.digger = d || CP.DIGGERS[0]; };

  // Krillion-style plunge: show every tier's line below the current depth,
  // then the digger sinks to the one this answer reached.
  Scene.prototype.plunge = function (fromM, tier) {
    this.plungeInfo = { fromM: fromM, tier: tier, t0: performance.now() };
  };

  Scene.prototype.headScreen = function () {
    var top = this.camY - this.H * ANCHOR;
    var y = this.started ? this.headY : SURFACE_Y - 8;
    return { x: this.headX * this.scale, y: (y - top) * this.scale };
  };

  Scene.prototype.poke = function () {
    this.pokeInfo = { t0: performance.now(), text: this.digger.says };
    this.burst(this.headX, this.started ? this.headY : SURFACE_Y - 8, 8, this.digger.body, 1.2);
  };

  Scene.prototype.destroy = function () {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this._resize);
  };

  CP.Scene = Scene;
  CP.Scene.PX_PER_M = PX_PER_M;
})(typeof window !== "undefined" ? window : globalThis);
