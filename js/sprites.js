/*
 * Pixel-art sprites drawn procedurally at low resolution, then scaled up
 * with nearest-neighbour filtering (image-rendering: pixelated).
 */
(function (root) {
  var CP = (root.CP = root.CP || {});
  var OUT = "#1a0f0a";

  function px(ctx, x, y, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, 1, 1); }

  // Pixel disc without anti-aliasing.
  function disc(ctx, cx, cy, r, c) {
    ctx.fillStyle = c;
    var r2 = r * r + r * 0.6;
    for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) {
      if (x * x + y * y <= r2) ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
    }
  }
  function ellipse(ctx, cx, cy, rx, ry, c) {
    ctx.fillStyle = c;
    for (var y = -ry; y <= ry; y++) for (var x = -rx; x <= rx; x++) {
      if ((x * x) / (rx * rx + 0.6) + (y * y) / (ry * ry + 0.6) <= 1) ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
    }
  }
  function outlined(fn, ctx, args, fill) {
    var a = args.slice();
    a[2] += 1; if (a.length > 4) a[3] += 1;
    fn.apply(null, [ctx].concat(a).concat([OUT]));
    fn.apply(null, [ctx].concat(args).concat([fill]));
  }
  function line(ctx, x0, y0, x1, y1, c) {
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx - dy;
    for (var i = 0; i < 64; i++) {
      px(ctx, x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  function canvas(w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return { c: c, ctx: ctx };
  }

  var DRAW = {
    // Topsoil: a pale earthworm, the first thing any shovel turns up.
    p: function (ctx) {
      var body = "#d7e1f2", hi = "#ffffff", band = "#8fa3c4";
      var pts = [];
      for (var i = 0; i < 9; i++) pts.push([5 + i * 1.9, 16 + Math.sin(i * 0.8) * 4]);
      pts.forEach(function (p) { disc(ctx, p[0], p[1], 3, OUT); });
      pts.forEach(function (p, i) { disc(ctx, p[0], p[1], 2, i === 4 ? band : body); px(ctx, p[0] - 1, p[1] - 1, hi); });
      var h = pts[pts.length - 1];
      px(ctx, h[0] + 1, h[1] - 1, OUT);
    },
    // Too Clever: a pyrite nugget with a smug face.
    c: function (ctx) {
      var f = "#ff9f43", d = "#c86a1a", hi = "#ffe0b8";
      var pts = [[8, 18], [12, 11], [18, 9], [23, 13], [24, 19], [19, 24], [12, 24]];
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.moveTo(pts[0][0] - 1, pts[0][1]);
      pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.closePath(); ctx.fill();
      ellipse(ctx, 16, 17, 7, 6, f);
      ellipse(ctx, 18, 20, 5, 3, d);
      px(ctx, 12, 13, hi); px(ctx, 13, 13, hi); px(ctx, 13, 12, hi);
      px(ctx, 14, 16, OUT); px(ctx, 19, 16, OUT);
      line(ctx, 14, 20, 19, 19, OUT);
    },
    // Burrower: a blue ground beetle.
    s: function (ctx) {
      var shell = "#4de3ff", hi = "#d8f6ff", head = "#1f6f8e";
      [0, 1, 2].forEach(function (i) {
        var y = 14 + i * 4;
        line(ctx, 9, y, 5, y + i - 1, OUT); line(ctx, 23, y, 27, y + i - 1, OUT);
      });
      outlined(ellipse, ctx, [16, 18, 7, 8], shell);
      line(ctx, 16, 11, 16, 26, OUT);
      outlined(disc, ctx, [16, 9, 3], head);
      line(ctx, 14, 6, 12, 3, OUT); line(ctx, 18, 6, 20, 3, OUT);
      px(ctx, 12, 14, hi); px(ctx, 13, 13, hi); px(ctx, 19, 14, hi); px(ctx, 20, 13, hi);
    },
    // Rare: a ruby crystal cluster in a lump of rock.
    r: function (ctx) {
      var rock = "#5a4a3a", ruby = "#ff5252", dark = "#8c2431", hi = "#ffc2c2";
      outlined(ellipse, ctx, [16, 24, 10, 4], rock);
      function crystal(x, top, w, col) {
        for (var y = top; y < 24; y++) {
          var half = Math.min(w, Math.floor((y - top) * 0.8) + 1);
          ctx.fillStyle = OUT; ctx.fillRect(x - half - 1, y, half * 2 + 3, 1);
        }
        for (var y2 = top + 1; y2 < 24; y2++) {
          var h2 = Math.min(w, Math.floor((y2 - top) * 0.8));
          ctx.fillStyle = col; ctx.fillRect(x - h2, y2, h2 * 2 + 1, 1);
          ctx.fillStyle = dark; ctx.fillRect(x + 1, y2, Math.max(0, h2), 1);
        }
        px(ctx, x - 1, top + 3, hi); px(ctx, x - 1, top + 4, hi);
      }
      crystal(10, 13, 2, ruby); crystal(22, 12, 2, ruby); crystal(16, 5, 3, ruby);
    },
    // Deep Cut: an amethyst wyrm from the crystal caves.
    d: function (ctx) {
      var a = "#9d7bff", b = "#e2d8ff", c2 = "#463a68";
      var pts = [];
      for (var i = 0; i < 7; i++) pts.push([7 + i * 3, 21 - Math.sin(i * 0.9) * 5]);
      pts.forEach(function (p, i) { disc(ctx, p[0], p[1], 3 + (i > 4 ? 1 : 0), OUT); });
      pts.forEach(function (p, i) { disc(ctx, p[0], p[1], 2 + (i > 4 ? 1 : 0), i % 2 ? a : c2); px(ctx, p[0], p[1] - 1, b); });
      var h = pts[pts.length - 1];
      line(ctx, h[0] - 1, h[1] - 4, h[0] - 3, h[1] - 8, OUT);
      line(ctx, h[0] + 2, h[1] - 4, h[0] + 3, h[1] - 8, OUT);
      px(ctx, h[0] + 1, h[1] - 1, "#ffffff");
    },
    // One in a Centapillion: the golden centipede.
    k: function (ctx) { drawCentipede(ctx, true); }
  };

  function drawCentipede(ctx, gold) {
    var body = gold ? "#ffd166" : "#ff7a3d", dark = gold ? "#c98f2a" : "#b33a22", hi = gold ? "#fff7d0" : "#ffd0a8", leg = gold ? "#8a6a24" : "#5c1a0c";
    var segs = [];
    for (var i = 0; i < 7; i++) segs.push([5 + i * 3.2, 20 - Math.sin(i * 0.7 + 0.4) * 4]);
    segs.forEach(function (p) {
      line(ctx, Math.round(p[0]), Math.round(p[1]), Math.round(p[0]) - 1, Math.round(p[1]) + 5, leg);
      line(ctx, Math.round(p[0]), Math.round(p[1]), Math.round(p[0]) + 1, Math.round(p[1]) - 5, leg);
    });
    segs.forEach(function (p, i) { disc(ctx, p[0], p[1], i === segs.length - 1 ? 4 : 3, OUT); });
    segs.forEach(function (p, i) {
      var head = i === segs.length - 1;
      disc(ctx, p[0], p[1], head ? 3 : 2, head ? body : (i % 2 ? body : dark));
      px(ctx, p[0] - 1, p[1] - 1, hi);
    });
    var h = segs[segs.length - 1];
    px(ctx, h[0] + 1, h[1] - 1, OUT); px(ctx, h[0] + 2, h[1] - 1, "#ffffff");
    line(ctx, Math.round(h[0]) + 1, Math.round(h[1]) - 4, Math.round(h[0]) + 4, Math.round(h[1]) - 9, OUT);
    line(ctx, Math.round(h[0]) + 3, Math.round(h[1]) - 3, Math.round(h[0]) + 7, Math.round(h[1]) - 6, OUT);
  }

  var cache = {};
  function tierSprite(tier, gold) {
    var key = tier + (gold ? "g" : "");
    if (cache[key]) return cache[key];
    if (typeof document === "undefined") return "";
    var cv = canvas(32, 32);
    DRAW[tier](cv.ctx, gold);
    cache[key] = cv.c.toDataURL("image/png");
    return cache[key];
  }

  function tierImg(tier, size, cls) {
    var img = document.createElement("img");
    img.src = tierSprite(tier);
    img.width = size; img.height = size;
    img.alt = CP.TIERS[tier].name;
    img.className = "px " + (cls || "");
    img.draggable = false;
    return img;
  }

  var images = {};
  function tierImage(tier) {
    if (!images[tier] && typeof Image !== "undefined") { images[tier] = new Image(); images[tier].src = tierSprite(tier); }
    return images[tier];
  }

  CP.sprites = { tierSprite: tierSprite, tierImg: tierImg, tierImage: tierImage, disc: disc, line: line, px: px };
})(typeof window !== "undefined" ? window : globalThis);
