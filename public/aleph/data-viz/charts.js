/* Chart kit, prototype v0, Red Antler direction
   One renderer, three outputs: static SVG (decks, ebooks), PNG, and animated web.
   Input is always rows of data (CSV or Google Sheet) plus a recipe (what the chart says).
   Visual language follows RA's data viz frames (Figma, node 681:22719):
   Cassette for headlines and big numbers (regular weight, tight), Cassette SemiMono for labels,
   thin square bars on a deep violet track, dot matrices, node lines, cards on a quiet surface.
   Types: kpi, bar, line, table, dots, columns, ring. Surfaces: light, dark, violet. */

const Charts = (() => {
  // ---------- RA color tokens. Named ones come straight from the Figma variables; the rest are sampled from RA's frames.
  const C = {
    ink: '#0B0C0D', white: '#FFFFFF',
    violet900: '#2C1B4D', violet700: '#503488', violet500: '#9161F2', violet300: '#B2A1E5', violet100: '#E5D9FF',
    plum: '#532047', orchid: '#A273C1', lavender: '#C9A6DE', navy: '#1B4669', glacier: '#009BC3', ice: '#C9E6FA',
    saffron: '#B18404', vermilion: '#FF796D', garnet: '#FFA6C2', lime: '#B5E57F',
    ember900: '#672012', ember500: '#C47138', ember300: '#E3A682',
    steel700: '#707173', steel500: '#A1A3A6', steel300: '#D2D4D8', steel100: '#EEEFF1',
  };
  // Categorical orders, fixed, never cycled
  const PALETTES = {
    departments: [C.plum, C.orchid, C.lavender, C.navy, C.glacier, C.ice, C.saffron], // RA stacked columns
    teams: [C.violet500, C.saffron, C.vermilion, C.garnet, C.glacier],                 // RA headcount dots
    ember: [C.ember900, C.ember500, C.ember300],                                         // RA revenue ring (sequential)
    violet: [C.violet500, C.violet300, C.violet100],                                     // RA hiring index
  };
  // RA's theme variables (Figma, Color page: "light mode", "dark mode", "extended").
  // Each theme is three values per mode: background, text, accent. Every chart token is derived from them.
  const THEMES = {
    neutral:    { name: 'Neutral',     light: ['#FFFFFF', '#0B0C0D', '#0B0C0D'], dark: ['#0B0C0D', '#FFFFFF', '#FFFFFF'] },
    neutral200: { name: 'Neutral 200', light: ['#DCDEE2', '#0B0C0D', '#0B0C0D'], dark: ['#434548', '#FFFFFF', '#FFFFFF'] },
    vermilion:  { name: 'Vermilion',   light: ['#FFE6E3', '#A6201D', '#E75346'], dark: ['#5E0A10', '#FFABA3', '#E75346'] },
    olive:      { name: 'Olive',       light: ['#DFF7B9', '#4F6417', '#5E7D1F'], dark: ['#2D3506', '#A5D760', '#C1ED7F'] },
    ink:        { name: 'Ink',         light: ['#E4EDFF', '#1E52BA', '#3377FF'], dark: ['#142D5F', '#A6C4FF', '#3377FF'] },
    violet:     { name: 'Violet',      light: ['#F0E9FF', '#6D29CC', '#9161F2'], dark: ['#3D1374', '#CCB6FF', '#9161F2'] },
    orange:     { name: 'Orange',      light: ['#FFE8D6', '#502000', '#D46B00'], dark: ['#502000', '#FFE8D6', '#FB8200'] },
    saffron:    { name: 'Saffron',     light: ['#FFEAC4', '#442A00', '#936900'], dark: ['#442A00', '#FFEAC4', '#E9BF42'] },
    fern:       { name: 'Fern',        light: ['#D7F7DB', '#053A28', '#00865F'], dark: ['#053A28', '#D7F7DB', '#19C58C'] },
    glacier:    { name: 'Glacier',     light: ['#DAF1FF', '#0E3253', '#0A7BA7'], dark: ['#0E3253', '#DAF1FF', '#1EBADF'] },
    orchid:     { name: 'Orchid',      light: ['#F5E7FF', '#540944', '#CB46E3'], dark: ['#540944', '#F5E7FF', '#CB46E3'] },
    garnet:     { name: 'Garnet',      light: ['#FFE5ED', '#560D3A', '#EA447F'], dark: ['#560D3A', '#FFE5ED', '#EA447F'] },
  };
  const hexRGB = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, k) => '#' + hexRGB(a).map((v, i) => Math.round(v + (hexRGB(b)[i] - v) * k).toString(16).padStart(2, '0')).join('');
  const lum = (h) => { const [r, g, b] = hexRGB(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  // Derive every chart token from a theme's background, text and accent
  function makeTheme(name = 'violet', mode = 'light') {
    const [bg, text, accent] = (THEMES[name] || THEMES.violet)[mode] || THEMES.violet.light;
    const light = mode === 'light';
    let track = light ? mix(text, '#000000', 0.45) : mix(bg, '#000000', 0.45);   // RA's dark track under the bars
    if (Math.abs(lum(track) - lum(accent)) < 0.12) track = mix(text, bg, 0.86);   // neutral themes: accent is ink, so go light
    return {
      page: bg, card: light ? mix(bg, '#FFFFFF', 0.55) : mix(bg, text, 0.07), ink: text, ink2: mix(text, bg, 0.2), muted: mix(text, bg, 0.45),
      rule: mix(text, bg, 0.72), grid: mix(text, bg, 0.88), empty: mix(text, bg, 0.84), node: mix(text, bg, 0.55), track,
      highlight: accent, strong: mix(accent, bg, 0.45), soft: mix(accent, bg, 0.72), hoverRow: mix(text, bg, 0.93),
      pill: C.lime, pillInk: C.ink, mode,
      cat: categorical(name, mode, accent, bg),
      seq: (n) => sequential(accent, bg, n, light),
    };
  }
  const hue = (h) => {
    const [r, g, b] = hexRGB(h).map((v) => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (d < 0.08) return null; // greys have no usable hue
    const x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (x * 60 + 360) % 360;
  };
  // Categorical: the theme's accent leads, then the other RA theme accents (same mode) in a fixed order,
  // skipping any too close in hue to a color already picked, so every category stays distinct.
  const CAT_ORDER = ['violet', 'saffron', 'vermilion', 'glacier', 'garnet', 'fern', 'orange', 'ink', 'orchid', 'olive'];
  function categorical(name, mode, accent, bg) {
    const out = [accent]; const hues = [hue(accent)].filter((v) => v !== null);
    const far = (h) => hues.every((x) => Math.min(Math.abs(x - h), 360 - Math.abs(x - h)) >= 26);
    for (const k of CAT_ORDER) {
      if (k === name) continue;
      const c = THEMES[k][mode][2]; const h = hue(c);
      if (h !== null && far(h)) { out.push(c); hues.push(h); }
    }
    // second pass: lighter tints of the picks, for charts with more categories than distinct hues
    return out.concat(out.slice(0, 6).map((c) => mix(c, bg, 0.5)));
  }
  // Sequential: one hue, dark to light, for ordered parts (rings, levels)
  function sequential(accent, bg, n, light) {
    // light mode: deep shade → accent → pale tint. dark mode: dim (toward the background) → accent → bright tint.
    const dark = light ? mix(accent, '#000000', 0.45) : mix(accent, bg, 0.5), pale = light ? mix(accent, bg, 0.6) : mix(accent, '#FFFFFF', 0.5);
    if (n <= 1) return [accent];
    return Array.from({ length: n }, (_, i) => { const k = i / (n - 1); return k < 0.5 ? mix(dark, accent, k * 2) : mix(accent, pale, (k - 0.5) * 2); });
  }

  const FONT = { display: "'Cassette', system-ui, sans-serif", mono: "'Cassette SemiMono', ui-monospace, monospace" };
  const TAB = 'font-variant-numeric:tabular-nums';
  let uid = 0;

  // ---------- helpers
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ctx = document.createElement('canvas').getContext('2d');
  const measure = (str, size, weight = 400, family = FONT.display) => { ctx.font = `${weight} ${size}px ${family}`; return ctx.measureText(String(str)).width; };
  const wrap = (str, size, maxW, weight = 400, family = FONT.display) => {
    const words = String(str).split(/\s+/); const lines = []; let line = '';
    for (const w of words) { const t = line ? line + ' ' + w : w; if (measure(t, size, weight, family) > maxW && line) { lines.push(line); line = w; } else line = t; }
    if (line) lines.push(line); return lines;
  };
  // Number formats: pct (34%), currency ($4.2M with suffix), compact ($2.4M from 2400000), delta (+4.2%), number
  const fmt = (v, spec = {}) => {
    const n = Number(v);
    if (v === '' || v == null || Number.isNaN(n)) return String(v ?? '');
    const d = spec.decimals ?? 0;
    const num = (x, dd = d) => x.toLocaleString('en-US', { minimumFractionDigits: dd, maximumFractionDigits: dd });
    if (spec.format === 'delta') return (n > 0 ? '+' : n < 0 ? '−' : '') + num(Math.abs(n)) + (spec.suffix ?? '%');
    const prefix = spec.prefix ?? (spec.format === 'currency' || spec.format === 'compact' ? '$' : '');
    if (spec.format === 'compact') {
      const a = Math.abs(n); const [div, suf] = a >= 1e9 ? [1e9, 'B'] : a >= 1e6 ? [1e6, 'M'] : a >= 1e3 ? [1e3, 'K'] : [1, ''];
      return (n < 0 ? '−' : '') + prefix + num(a / div, spec.decimals ?? (div > 1 ? 1 : 0)).replace(/\.0+$/, a / div % 1 ? '$&' : '') + suf;
    }
    const suffix = spec.suffix ?? (spec.format === 'pct' ? '%' : '');
    return (n < 0 ? '−' : '') + prefix + num(Math.abs(n)) + suffix;
  };
  // Palettes follow the theme: 'cat' (categories) or 'seq' (ordered parts, needs n). spec.palette can pin RA's fixed sets.
  const resolve = (c, t, i = 0, palette = 'cat', n = 3) => {
    if (!c) {
      if (PALETTES[palette]) return PALETTES[palette][i % PALETTES[palette].length];
      const pal = palette === 'seq' ? t.seq(n) : t.cat; return pal[i % pal.length];
    }
    if (t[c] && typeof t[c] === 'string') return t[c];
    return C[c] || c;
  };
  const barPath = (x, y, w, h) => (w <= 0 ? '' : `M${x},${y}H${x + w}V${y + h}H${x}Z`); // RA bars are square
  const niceTicks = (lo, hi, count = 5) => {
    const span = hi - lo || Math.abs(hi) || 1; const raw = span / (count - 1); const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
    const start = Math.floor(lo / step) * step, end = Math.ceil(hi / step) * step;
    const out = []; for (let v = start; v <= end + step / 1e6; v += step) out.push(+v.toFixed(10)); return out;
  };
  const text = (x, y, s, o = {}) =>
    `<text${o.cls ? ` class="${o.cls}"` : ''}${o.data || ''} x="${x}" y="${y}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''} font-family="${o.mono ? FONT.mono : FONT.display}" font-size="${o.size}"${o.weight ? ` font-weight="${o.weight}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.tab ? ` style="${TAB}"` : ''} fill="${o.fill}">${esc(s)}</text>`;
  // RA node line: hairline with a dot at each end
  const nodeLine = (x1, x2, y, col, s) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="1"/><circle cx="${x1}" cy="${y}" r="${2.5 * s}" fill="${col}"/><circle cx="${x2}" cy="${y}" r="${2.5 * s}" fill="${col}"/>`;

  // Headline block: title (Cassette, medium, tight) and an optional mono subtitle
  function head(spec, t, s, W) {
    const size = 22 * s; let out = ''; let y = 0;
    if (spec.title) {
      const lines = wrap(spec.title, size, spec.titleWidth ? spec.titleWidth * s : W, 500);
      lines.forEach((l, i) => { out += text(0, size * 0.9 + i * size * 1.05, l, { size, weight: 500, ls: -0.025 * size, fill: t.ink }); });
      y = size * 0.9 + (lines.length - 1) * size * 1.05;
    }
    if (spec.subtitle) { y += 20 * s; out += text(0, y, spec.subtitle, { size: 12 * s, mono: true, fill: t.muted }); }
    return { svg: out, y };
  }
  function foot(spec, t, s, W, y) {
    if (!spec.source) return { svg: '', y };
    const size = 10 * s; let out = ''; y += 26 * s;
    const lines = wrap(spec.source, size, W, 400, FONT.mono);
    lines.forEach((l, i) => { out += text(0, y + i * size * 1.5, l, { size, mono: true, fill: t.muted }); });
    return { svg: out, y: y + (lines.length - 1) * size * 1.5 + size * 0.5 };
  }
  // Legend: square keys for bars, round keys for dots and rings, line keys for lines (mono labels, like RA)
  function legend(entries, t, s, W, y, shape = 'square') {
    let out = ''; let lx = 0; const size = 10.5 * s;
    entries.forEach((e) => {
      const lw = measure(e.label, size, 400, FONT.mono) + (e.value ? measure(e.value, size * 1.1, 600) + 6 * s : 0) + 14 * s;
      if (lx + lw > W) { lx = 0; y += 18 * s; }
      if (shape === 'line') out += `<line x1="${lx}" y1="${y - 3.5 * s}" x2="${lx + 12 * s}" y2="${y - 3.5 * s}" stroke="${e.color}" stroke-width="${2 * s}"${e.dashed ? ` stroke-dasharray="${3 * s} ${2 * s}"` : ''}/>`;
      else if (shape === 'round') out += `<circle cx="${lx + 4 * s}" cy="${y - 3.5 * s}" r="${(e.value ? 6 : 3.5) * s}" fill="${e.color}"/>`;
      else out += `<rect x="${lx}" y="${y - 7.5 * s}" width="${7 * s}" height="${7 * s}" fill="${e.color}"/>`;
      let tx = lx + (shape === 'line' ? 18 : e.value ? 16 : 12) * s;
      if (e.value) { out += text(tx, y, e.value, { size: size * 1.1, weight: 600, fill: t.ink }); tx += measure(e.value, size * 1.1, 600) + 6 * s; }
      out += text(tx, y, e.label, { size, mono: true, fill: e.value ? t.ink : t.ink2 });
      lx += lw + (shape === 'line' ? 24 : 18) * s;
    });
    return { svg: out, y };
  }

  // ---------- CSV
  function parseCSV(src) {
    const rows = []; let row = [], cell = '', q = false; src = src.replace(/\r/g, '');
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if (q) { if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
      else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    const clean = rows.filter((r) => r.some((c) => c.trim() !== '')); const header = clean.shift().map((h) => h.trim());
    return clean.map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
  }

  // ---------- KPI: giant numbers in regular weight, separated by node lines (RA chapter page and Net Income card)
  function kpi(rows, spec, opt, t) {
    const s = opt.scale; const W = opt.width;
    const h = head(spec, t, s, W); let out = h.svg; let y = h.y ? h.y + 26 * s : 0;
    const numSize = (spec.numberSize || 96) * s, labSize = 13 * s, lh = labSize * 1.35;
    const stacked = spec.layout !== 'row';
    const n = rows.length; const gap = 32 * s;
    if (stacked) {
      // RA chapter layout: node line, big number left, context right
      const labW = Math.min(200 * s, W * 0.36);
      rows.forEach((r, i) => {
        out += nodeLine(3 * s, W - 3 * s, y, t.node, s); y += 18 * s;
        const val = fmt(r[spec.value], { ...spec, suffix: r[spec.unit] ?? spec.suffix });
        const top = y + numSize * 0.82;
        out += `<text class="ac-num" data-target="${esc(r[spec.value])}" data-unit="${esc(r[spec.unit] ?? '')}" data-i="${i}" x="${-0.04 * numSize}" y="${top}" font-family="${FONT.display}" font-weight="400" font-size="${numSize}" letter-spacing="${-0.045 * numSize}" fill="${t.ink}">${esc(val)}</text>`;
        const lines = wrap(r[spec.label], labSize, labW);
        lines.forEach((l, j) => { out += text(W - labW, y + 16 * s + lh * j, l, { size: labSize, fill: t.ink }); });
        if (spec.delta && r[spec.delta] !== undefined && r[spec.delta] !== '') {
          const dv = fmt(r[spec.delta], { format: 'delta', decimals: 1 }); const pw = measure(dv, 13 * s, 600) + 12 * s;
          const py = y + 16 * s + lh * lines.length + 8 * s;
          out += `<rect class="ac-fade" x="${W - labW}" y="${py}" width="${pw}" height="${20 * s}" rx="${2 * s}" fill="${t.pill}"/>`;
          out += text(W - labW + 6 * s, py + 14 * s, dv, { cls: 'ac-fade', size: 13 * s, weight: 600, fill: t.pillInk });
        }
        y = top + numSize * 0.2 + 14 * s;
      });
      return { svg: out, height: y };
    }
    const colW = (W - gap * (n - 1)) / n; let maxH = 0;
    rows.forEach((r, i) => {
      const x = i * (colW + gap); const val = fmt(r[spec.value], { ...spec, suffix: r[spec.unit] ?? spec.suffix });
      const sz = Math.min(numSize, (colW / Math.max(3, val.length)) * 1.9);
      out += `<text class="ac-num" data-target="${esc(r[spec.value])}" data-unit="${esc(r[spec.unit] ?? '')}" data-i="${i}" x="${x - 0.04 * sz}" y="${y + sz * 0.82}" font-family="${FONT.display}" font-size="${sz}" letter-spacing="${-0.045 * sz}" fill="${t.ink}">${esc(val)}</text>`;
      const lines = wrap(r[spec.label], labSize, colW);
      lines.forEach((l, j) => { out += text(x, y + sz * 0.82 + 22 * s + lh * j, l, { size: labSize, fill: t.ink2 }); });
      maxH = Math.max(maxH, sz * 0.82 + 22 * s + lh * lines.length);
    });
    return { svg: out, height: y + maxH + 8 * s };
  }

  // ---------- horizontal bar: thin square bars over a deep violet track, mono labels (RA hiring index)
  function bar(rows, spec, opt, t) {
    const s = opt.scale; const W = opt.width;
    const mono = 10.5 * s, rowH = 26 * s, barH = 7 * s;
    const h = head({ titleWidth: 220, ...spec }, t, s, W); let out = h.svg; let y = h.y + 30 * s;
    const [colA, colB] = spec.columns || [spec.label, spec.value];
    out += text(0, y, colA, { size: 9.5 * s, mono: true, fill: t.muted });
    out += text(W, y, colB, { size: 9.5 * s, mono: true, fill: t.muted, anchor: 'end' });
    y += 8 * s;
    const labW = Math.min(Math.max(...rows.map((r) => measure(r[spec.label], mono, 400, FONT.mono))) + 28 * s, W * 0.42);
    const valW = Math.max(...rows.map((r) => measure(fmt(r[spec.value], spec), mono, 400, FONT.mono))) + 28 * s;
    const x0 = labW, x1 = W - valW, trackW = x1 - x0;
    const max = spec.scale === 'max' || !spec.scale ? Math.max(...rows.map((r) => +r[spec.value])) : +spec.scale;
    const colorOf = (g) => resolve(spec.colors && spec.colors[g], t) || t.highlight;
    const items = [];
    rows.forEach((r, i) => {
      const isLast = i === rows.length - 1;
      if (spec.separateLast && isLast) { out += `<rect x="0" y="${y + 6 * s}" width="${W}" height="1" fill="${t.rule}"/>`; y += 14 * s; }
      const cy = y + rowH / 2; const v = +r[spec.value]; const w = (v / max) * trackW;
      const g = r[spec.group]; const col = colorOf(g);
      out += text(0, cy + mono * 0.35, r[spec.label], { size: mono, mono: !(spec.separateLast && isLast), fill: t.ink });
      out += `<rect x="${x0}" y="${cy - barH / 2}" width="${trackW}" height="${barH}" fill="${t.track}"/>`;
      out += `<path class="ac-bar" data-x="${x0}" data-y="${cy - barH / 2}" data-w="${w}" data-h="${barH}" data-i="${i}" d="${barPath(x0, cy - barH / 2, w, barH)}" fill="${col}"/>`;
      out += text(W, cy + mono * 0.35, fmt(v, spec), { cls: 'ac-val', data: ` data-i="${i}" data-target="${v}"`, size: mono, mono: true, fill: t.ink, anchor: 'end', tab: true });
      out += `<rect class="ac-hit" data-i="${i}" x="0" y="${y}" width="${W}" height="${rowH}" fill="transparent"/>`;
      items.push({ label: r[spec.label], value: fmt(v, spec), group: g, color: col });
      y += rowH;
    });
    if (spec.group) {
      const groups = [...new Set(rows.map((r) => r[spec.group]))];
      groups.sort((a, b) => (b === spec.highlight) - (a === spec.highlight));
      const lg = legend(groups.map((g) => {
        const tot = rows.filter((r) => r[spec.group] === g).reduce((a, r) => a + +r[spec.value], 0);
        return { label: `${g}, ${fmt(tot, spec)}`, color: colorOf(g) };
      }), t, s, W, y + 24 * s);
      out += lg.svg; y = lg.y;
    }
    const f = foot(spec, t, s, W, y); out += f.svg;
    return { svg: out, height: f.y + 4 * s, items };
  }

  // shared y axis: mono labels with a node dot, hairline grid (RA stacked columns)
  function yAxis(ticks, Y, x0, x1, t, s, spec) {
    let out = ''; const mono = 9.5 * s;
    ticks.forEach((v) => {
      out += `<line x1="${x0}" y1="${Y(v)}" x2="${x1}" y2="${Y(v)}" stroke="${t.grid}" stroke-width="1"/>`;
      out += `<circle cx="${x0 - 6 * s}" cy="${Y(v)}" r="${1.6 * s}" fill="${t.rule}"/><circle cx="${x1 + 6 * s}" cy="${Y(v)}" r="${1.6 * s}" fill="${t.rule}"/>`;
      out += text(x0 - 14 * s, Y(v) + mono * 0.35, fmt(v, { ...spec, decimals: spec.tickDecimals ?? 0 }), { size: mono, mono: true, fill: t.muted, anchor: 'end', tab: true });
    });
    return out;
  }

  // ---------- line: change over time
  function line(rows, spec, opt, t) {
    const s = opt.scale; const W = opt.width; const id = 'ac' + uid++;
    const mono = 9.5 * s; const series = spec.series; const xs = rows.map((r) => r[spec.x]); const n = rows.length;
    const h = head(spec, t, s, W); let out = h.svg; let y = h.y;
    const colors = Object.fromEntries(series.map((k, i) => [k, resolve(spec.colors && spec.colors[k], t, i)]));
    const dashed = new Set(spec.dashed || []);
    const lg = legend(series.map((k) => ({ label: k, color: colors[k], dashed: dashed.has(k) })), t, s, W, y + 26 * s, 'line');
    out += lg.svg; y = lg.y;
    const top = y + 30 * s, plotH = (spec.height || 220) * s, bottom = top + plotH;
    const all = rows.flatMap((r) => series.map((k) => +r[k]));
    let lo = Math.min(...all), hi = Math.max(...all);
    if (spec.yZero) lo = Math.min(0, lo); else lo -= (hi - lo) * 0.1;
    const ticks = niceTicks(lo, hi, 5); lo = ticks[0]; hi = ticks[ticks.length - 1];
    const yLabW = Math.max(...ticks.map((v) => measure(fmt(v, spec), mono, 400, FONT.mono))) + 22 * s;
    const x0 = yLabW, x1 = W - 10 * s;
    const X = (i) => x0 + 12 * s + (i / Math.max(1, n - 1)) * (x1 - x0 - 24 * s);
    const Y = (v) => bottom - ((v - lo) / (hi - lo)) * plotH;
    out += yAxis(ticks, Y, x0, x1, t, s, spec);
    const every = Math.ceil(n / Math.max(2, Math.floor((x1 - x0) / (52 * s))));
    xs.forEach((x, i) => { if (i % every === 0) out += text(X(i), bottom + 18 * s, x, { size: mono, mono: true, fill: t.muted, anchor: 'middle' }); });
    const order = [...series].sort((a, b) => (a === spec.highlight) - (b === spec.highlight));
    out += `<clipPath id="${id}"><rect class="ac-clip" x="${x0}" y="${top - 10 * s}" width="${x1 - x0}" data-w="${x1 - x0}" height="${plotH + 20 * s}"/></clipPath><g clip-path="url(#${id})">`;
    order.forEach((k) => {
      const d = rows.map((r, i) => `${i ? 'L' : 'M'}${X(i).toFixed(2)},${Y(+r[k]).toFixed(2)}`).join('');
      if (spec.area && k === spec.highlight) out += `<path d="${d}L${X(n - 1)},${bottom}L${X(0)},${bottom}Z" fill="${colors[k]}" opacity="0.12"/>`;
      out += `<path d="${d}" fill="none" stroke="${colors[k]}" stroke-width="${2 * s}" stroke-linejoin="round"${dashed.has(k) ? ` stroke-dasharray="${4 * s} ${3 * s}"` : ''}/>`;
      if (k === spec.highlight) rows.forEach((r, i) => { out += `<circle cx="${X(i)}" cy="${Y(+r[k])}" r="${2.6 * s}" fill="${t.card}" stroke="${colors[k]}" stroke-width="${1.5 * s}"/>`; });
    });
    out += '</g>';
    const k = spec.highlight || series[0]; const lv = rows[n - 1][k];
    out += `<circle class="ac-fade" cx="${X(n - 1)}" cy="${Y(+lv)}" r="${4.5 * s}" fill="${colors[k]}" stroke="${t.card}" stroke-width="${2 * s}"/>`;
    const lbl = fmt(lv, spec); const lw = measure(lbl, 11 * s, 600) + 10 * s;
    out += `<rect class="ac-fade" x="${X(n - 1) - lw}" y="${Y(+lv) - 28 * s}" width="${lw}" height="${18 * s}" rx="${2 * s}" fill="${t.ink}"/>`;
    out += text(X(n - 1) - lw / 2, Y(+lv) - 15 * s, lbl, { cls: 'ac-fade', size: 11 * s, weight: 600, fill: t.card, anchor: 'middle' });
    out += `<line class="ac-cross" x1="0" x2="0" y1="${top}" y2="${bottom}" stroke="${t.muted}" stroke-width="1" opacity="0"/>`;
    out += `<rect class="ac-hover" x="${x0}" y="${top}" width="${x1 - x0}" height="${plotH}" fill="transparent"/>`;
    const f = foot(spec, t, s, W, bottom + 22 * s); out += f.svg;
    return { svg: out, height: f.y + 4 * s, hover: { xs, rows, series, colors, X, x0: X(0), x1: X(n - 1), spec } };
  }

  // ---------- stacked columns (RA monthly operating expenses)
  function columns(rows, spec, opt, t) {
    const s = opt.scale; const W = opt.width; const mono = 9.5 * s;
    const series = spec.series; const n = rows.length;
    const h = head(spec, t, s, W); let out = h.svg; let y = h.y;
    const colors = Object.fromEntries(series.map((k, i) => [k, resolve(spec.colors && spec.colors[k], t, i, spec.palette || 'cat')]));
    const lg = legend(series.map((k) => ({ label: k, color: colors[k] })), t, s, W, y + 24 * s, 'round'); out += lg.svg; y = lg.y;
    const top = y + 40 * s, plotH = (spec.height || 200) * s, bottom = top + plotH;
    const totals = rows.map((r) => series.reduce((a, k) => a + +r[k], 0));
    const ticks = niceTicks(0, Math.max(...totals), 7); const hi = ticks[ticks.length - 1];
    const yLabW = Math.max(...ticks.map((v) => measure(fmt(v, spec), mono, 400, FONT.mono))) + 22 * s;
    const x0 = yLabW, x1 = W - 10 * s; const band = (x1 - x0) / n; const bw = Math.min(28 * s, band * 0.68);
    const Y = (v) => bottom - (v / hi) * plotH;
    out += yAxis(ticks, Y, x0, x1, t, s, spec);
    const items = [];
    rows.forEach((r, i) => {
      const cx = x0 + band * (i + 0.5); let acc = 0;
      out += `<g class="ac-col" data-i="${i}">`;
      series.forEach((k) => {
        const v = +r[k]; const y1 = Y(acc + v), y0 = Y(acc);
        out += `<rect x="${cx - bw / 2}" y="${y1}" width="${bw}" height="${Math.max(0, y0 - y1 - 1)}" fill="${colors[k]}"/>`; acc += v;
      });
      out += '</g>';
      out += text(cx, Y(totals[i]) - 7 * s, fmt(totals[i], spec), { cls: 'ac-fade', size: mono * 0.95, mono: true, fill: t.ink, anchor: 'middle', tab: true });
      if (i % (spec.labelEvery || 2) === 0) out += text(cx, bottom + 18 * s, r[spec.x], { size: mono, mono: true, fill: t.muted, anchor: 'middle' });
      out += `<rect class="ac-hit" data-i="${i}" x="${cx - band / 2}" y="${top}" width="${band}" height="${plotH}" fill="transparent"/>`;
      items.push({ label: r[spec.x], value: fmt(totals[i], spec), group: series.map((k) => `${k} ${fmt(r[k], spec)}`).join(' · '), color: t.ink });
    });
    const f = foot(spec, t, s, W, bottom + 22 * s); out += f.svg;
    return { svg: out, height: f.y + 4 * s, items, colHover: true };
  }

  // ---------- dot matrix: one row block per category, filled column by column (RA headcount)
  function dots(rows, spec, opt, t) {
    const s = opt.scale; const W = opt.width; const mono = 10 * s;
    const h = head(spec, t, s, W); let out = h.svg; let y = h.y + 30 * s;
    const pitch = (spec.pitch || 10.3) * s, r = pitch * 0.42, rowsPer = spec.dotRows || 3;
    const cols = Math.floor((W + pitch - 2 * r) / pitch); const cells = cols * rowsPer;
    const max = spec.scale ? +spec.scale : Math.max(...rows.map((d) => +d[spec.value]));
    const items = [];
    rows.forEach((d, i) => {
      const v = +d[spec.value]; const filled = Math.round((v / max) * cells);
      const col = resolve(spec.colors && spec.colors[d[spec.label]], t, i, spec.palette || 'cat');
      out += text(0, y, d[spec.label], { size: mono, mono: true, fill: t.ink });
      out += text(W, y, fmt(v, spec), { cls: 'ac-val', data: ` data-i="${i}" data-target="${v}"`, size: mono, mono: true, fill: t.ink, anchor: 'end', tab: true });
      y += 8 * s;
      for (let c = 0; c < cols; c++) for (let k = 0; k < rowsPer; k++) {
        const idx = c * rowsPer + k; const on = idx < filled;
        out += `<circle${on ? ` class="ac-seq" data-o="${(idx / cells).toFixed(3)}" data-row="${i}"` : ''} cx="${r + c * pitch}" cy="${y + r + k * pitch}" r="${r}" fill="${on ? col : t.empty}"/>`;
      }
      out += `<rect class="ac-hit" data-i="${i}" x="0" y="${y - 16 * s}" width="${W}" height="${rowsPer * pitch + 16 * s}" fill="transparent"/>`;
      items.push({ label: d[spec.label], value: fmt(v, spec), group: '', color: col });
      y += rowsPer * pitch + 30 * s;
    });
    y -= 30 * s;
    const f = foot(spec, t, s, W, y); out += f.svg;
    return { svg: out, height: f.y + 4 * s, items, dotHover: true };
  }

  // ---------- ring: parts of a whole around a center number (RA revenue by region)
  function ring(rows, spec, opt, t) {
    const s = opt.scale; const W = opt.width;
    const h = head(spec, t, s, W); let out = h.svg; let y = h.y + 34 * s;
    const R = Math.min(W * 0.36, 150 * s), cx = W / 2, cy = y + R + 8 * s, sw = 7 * s;
    const total = rows.reduce((a, r) => a + +r[spec.value], 0); const gap = 0.012;
    let a0 = 0; const id = 'ac' + uid++;
    rows.forEach((r, i) => {
      const frac = +r[spec.value] / total; const a1 = a0 + frac;
      const s0 = (a0 + gap / 2) * 2 * Math.PI - Math.PI / 2, s1 = (a1 - gap / 2) * 2 * Math.PI - Math.PI / 2;
      const col = resolve(spec.colors && spec.colors[r[spec.label]], t, i, spec.palette || 'seq', rows.length);
      const large = s1 - s0 > Math.PI ? 1 : 0;
      out += `<path class="ac-arc" pathLength="1" stroke-dasharray="1 1" d="M${cx + R * Math.cos(s0)},${cy + R * Math.sin(s0)}A${R},${R} 0 ${large} 1 ${cx + R * Math.cos(s1)},${cy + R * Math.sin(s1)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" data-i="${i}" data-a0="${a0}"/>`;
      a0 = a1;
    });
    const center = spec.total ? fmt(spec.total, spec) : fmt(total, spec);
    const cs = Math.min(64 * s, (R * 1.5) / Math.max(3, center.length) * 1.9);
    out += text(cx, cy + cs * 0.34, center, { cls: 'ac-numtext', size: cs, ls: -0.045 * cs, fill: t.ink, anchor: 'middle' });
    y = cy + R + 44 * s;
    const lg = legend(rows.map((r, i) => ({ label: r[spec.label], value: fmt(+r[spec.value] / total * 100, { format: 'pct' }), color: resolve(spec.colors && spec.colors[r[spec.label]], t, i, spec.palette || 'seq', rows.length) })), t, s, W, y, 'round');
    out += lg.svg;
    const f = foot(spec, t, s, W, lg.y); out += f.svg;
    return { svg: out, height: f.y + 4 * s };
  }

  // ---------- table: tabular numbers, mono first column, quiet rules, one highlighted row
  function table(rows, spec, opt, t) {
    const s = opt.scale; const W = opt.width; const mono = 9.5 * s, size = 13 * s, rowH = 34 * s;
    const cols = spec.columns;
    const h = head(spec, t, s, W); let out = h.svg; let y = h.y + 32 * s;
    const widths = cols.map((c, ci) => ci === 0 ? 0 : Math.max(measure(c.label, mono, 400, FONT.mono), ...rows.map((r) => measure(fmt(r[c.key], c), size, 500))) + 28 * s);
    const xs = []; let right = W; for (let ci = cols.length - 1; ci > 0; ci--) { xs[ci] = right; right -= widths[ci]; } xs[0] = 0;
    cols.forEach((c, ci) => { out += text(xs[ci], y, c.label, { size: mono, mono: true, fill: t.muted, anchor: ci ? 'end' : null }); });
    y += 10 * s; out += `<rect x="0" y="${y}" width="${W}" height="1" fill="${t.ink}"/>`;
    const hl = spec.highlightRow;
    rows.forEach((r, i) => {
      const isTotal = spec.totalRow && i === rows.length - 1; const isHl = hl && r[hl.column] === hl.equals;
      out += `<g class="ac-row" data-i="${i}"><rect class="ac-rowbg" x="${-6 * s}" y="${y + 1}" width="${W + 12 * s}" height="${rowH - 1}" fill="${t.hoverRow}" opacity="0"/>`;
      if (isTotal) out += `<rect x="0" y="${y}" width="${W}" height="1" fill="${t.ink}"/>`;
      const cy = y + rowH / 2 + size * 0.35;
      cols.forEach((c, ci) => {
        const val = fmt(r[c.key], c);
        if (ci === 0) {
          let x = 0; if (isHl) { out += `<rect x="0" y="${y + rowH / 2 - 3.5 * s}" width="${7 * s}" height="${7 * s}" fill="${t.highlight}"/>`; x = 14 * s; }
          out += text(x, cy, val, { size: size * 0.82, mono: true, weight: isTotal ? 500 : null, fill: t.ink });
        } else if (c.format === 'delta' && isHl) {
          const pw = measure(val, size, 600) + 12 * s;
          out += `<rect x="${xs[ci] - pw + 6 * s}" y="${y + rowH / 2 - 10 * s}" width="${pw}" height="${20 * s}" rx="${2 * s}" fill="${t.pill}"/>`;
          out += text(xs[ci], cy, val, { size, weight: 600, fill: t.pillInk, anchor: 'end', tab: true });
        } else out += text(xs[ci], cy, val, { size, weight: isTotal || isHl ? 600 : 400, fill: c.muted ? t.ink2 : t.ink, anchor: 'end', tab: true });
      });
      out += `<rect class="ac-hit" data-i="${i}" x="0" y="${y}" width="${W}" height="${rowH}" fill="transparent"/></g>`;
      y += rowH;
      if (!isTotal && i < rows.length - 1 && !(spec.totalRow && i === rows.length - 2)) out += `<rect x="0" y="${y}" width="${W}" height="1" fill="${t.grid}"/>`;
    });
    if (hl && hl.note) { const lg = legend([{ label: hl.note, color: t.highlight }], t, s, W, y + 22 * s); out += lg.svg; y = lg.y; }
    const f = foot(spec, t, s, W, y); out += f.svg;
    return { svg: out, height: f.y + 4 * s, table: true };
  }

  const TYPES = { kpi, bar, line, table, dots, columns, ring };

  // ---------- render. opt: theme, scale, width, card (draw the chart on a card), frame [w,h] for slides
  function render(el, rows, spec, opt = {}) {
    opt = { theme: 'violet', mode: 'light', scale: 1, animate: false, card: true, ...opt };
    const t = makeTheme(opt.theme, opt.mode); const s = opt.scale;
    const card = opt.card && spec.type !== 'kpi';
    const pad = card ? (spec.type === 'ring' ? 28 : 18) * s : 0;
    const outerW = opt.width || el.clientWidth; opt.width = outerW - pad * 2;
    const tt = card ? t : { ...t, card: opt.transparent ? t.page : t.page };
    const res = TYPES[spec.type](rows, spec, opt, tt);
    const W = outerW, H = res.height + pad * 2;
    const frameW = opt.frame ? opt.frame[0] : W, frameH = opt.frame ? Math.max(H + 120, opt.frame[1]) : H;
    const ox = opt.frame ? (frameW - W) / 2 : 0, oy = opt.frame ? (frameH - H) / 2 : 0;
    const bg = opt.frame || !opt.transparent ? `<rect width="100%" height="100%" fill="${t.page}"/>` : '';
    const cardRect = card ? `<rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="${(spec.type === 'ring' ? 18 : 6) * s}" fill="${t.card}"${opt.mode === 'light' ? ` stroke="${t.grid}" stroke-width="1"` : ''}/>` : '';
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frameW} ${frameH}" width="${frameW}" height="${frameH}" role="img" aria-label="${esc(spec.title || spec.type)}">${bg}${cardRect}<g transform="translate(${ox + pad},${oy + pad})">${res.svg}</g></svg>`;
    const node = el.querySelector('svg');
    if (opt.fit) { node.style.width = '100%'; node.style.height = 'auto'; }

    // ----- hover (web only, stripped from exports)
    el.style.position = 'relative';
    const tip = document.createElement('div'); tip.className = 'ac-tip'; el.appendChild(tip);
    const place = (e) => { const b = el.getBoundingClientRect(); tip.style.left = e.clientX - b.left + 14 + 'px'; tip.style.top = e.clientY - b.top + 14 + 'px'; tip.style.opacity = 1; };
    const dim = (i) => {
      node.querySelectorAll('.ac-bar, .ac-col').forEach((p) => (p.style.opacity = i == null || p.dataset.i === String(i) ? 1 : 0.35));
      node.querySelectorAll('circle[data-row]').forEach((p) => (p.style.opacity = i == null || p.dataset.row === String(i) ? 1 : 0.35));
    };
    if (res.items) node.querySelectorAll('.ac-hit').forEach((hEl) => {
      const it = res.items[+hEl.dataset.i];
      hEl.addEventListener('mousemove', (e) => { tip.innerHTML = `<b>${esc(it.label)}</b> <span>${esc(it.value)}</span>${it.group ? `<br>${esc(it.group)}` : ''}`; place(e); dim(hEl.dataset.i); });
      hEl.addEventListener('mouseleave', () => { tip.style.opacity = 0; dim(null); });
    });
    if (res.table) node.querySelectorAll('.ac-hit').forEach((hEl) => {
      const bgr = node.querySelector(`.ac-row[data-i="${hEl.dataset.i}"] .ac-rowbg`);
      hEl.addEventListener('mouseenter', () => (bgr.style.opacity = 1)); hEl.addEventListener('mouseleave', () => (bgr.style.opacity = 0));
    });
    if (res.hover) {
      const hv = res.hover; const area = node.querySelector('.ac-hover'); const cross = node.querySelector('.ac-cross');
      area.addEventListener('mousemove', (e) => {
        const pt = node.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(area.getScreenCTM().inverse());
        const i = Math.max(0, Math.min(hv.rows.length - 1, Math.round(((p.x - hv.x0) / (hv.x1 - hv.x0)) * (hv.rows.length - 1))));
        cross.setAttribute('x1', hv.X(i)); cross.setAttribute('x2', hv.X(i)); cross.setAttribute('opacity', 0.6);
        tip.innerHTML = `<b>${esc(hv.xs[i])}</b>` + hv.series.map((k) => `<br><i style="background:${hv.colors[k]}"></i>${esc(k)} <span>${esc(fmt(hv.rows[i][k], hv.spec))}</span>`).join('');
        place(e);
      });
      area.addEventListener('mouseleave', () => { tip.style.opacity = 0; cross.setAttribute('opacity', 0); });
    }

    const handle = {
      // Motion, after RA's principles. Assured: marks grow from the baseline and settle, no bounce.
      // Intimate: reveal in reading order. Expansive: dots and rings build up from nothing.
      play() {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const q = (sel) => [...node.querySelectorAll(sel)];
        const bars = q('.ac-bar'), vals = q('.ac-val'), nums = q('.ac-num'), clips = q('.ac-clip'), fades = q('.ac-fade'),
          rowsEl = q('.ac-row'), seqs = q('.ac-seq'), cols = q('.ac-col'), arcs = q('.ac-arc');
        const ease = (x) => 1 - Math.pow(1 - x, 3);
        const k = (now, t0, delay, dur) => ease(Math.min(1, Math.max(0, (now - t0 - delay) / dur)));
        clips.forEach((c) => c.setAttribute('width', 0)); fades.forEach((f) => f.setAttribute('opacity', 0));
        rowsEl.forEach((r) => r.setAttribute('opacity', 0)); seqs.forEach((d) => d.setAttribute('opacity', 0));
        const t0 = performance.now();
        const frame = (now) => {
          let done = true; const chk = (v) => { if (v < 1) done = false; return v; };
          bars.forEach((p, i) => { const e = chk(k(now, t0, i * 70, 700)); p.setAttribute('d', barPath(+p.dataset.x, +p.dataset.y, +p.dataset.w * e, +p.dataset.h)); });
          vals.forEach((v, i) => { const e = chk(k(now, t0, i * 70, seqs.length ? 1100 : 700)); v.textContent = fmt(Math.round(+v.dataset.target * e), spec); });
          seqs.forEach((d) => { const e = chk(k(now, t0, +(d.dataset.row || 0) * 90, 1100)); d.setAttribute('opacity', e >= +d.dataset.o ? 1 : 0); });
          nums.forEach((n, i) => { const e = chk(k(now, t0, i * 150, 900)); n.textContent = fmt(Math.round(+n.dataset.target * e), { ...spec, suffix: n.dataset.unit }); });
          clips.forEach((c) => c.setAttribute('width', +c.dataset.w * chk(k(now, t0, 0, 1200))));
          cols.forEach((c, i) => { const e = chk(k(now, t0, i * 45, 650)); const b = c.getBBox(); c.setAttribute('transform', `translate(0,${(b.y + b.height) * (1 - e)}) scale(1,${Math.max(e, 0.0001)})`); });
          arcs.forEach((a) => { const e = chk(k(now, t0, +a.dataset.a0 * 900, 700)); a.setAttribute('stroke-dasharray', `${e} 1`); });
          fades.forEach((f) => f.setAttribute('opacity', chk(k(now, t0, bars.length || cols.length ? 650 : 1000, 400))));
          rowsEl.forEach((r, i) => { const e = chk(k(now, t0, i * 60, 450)); r.setAttribute('opacity', e); r.setAttribute('transform', `translate(0,${(1 - e) * 6 * s})`); });
          if (!done) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      },
      // Static export: final state, no hover layer, fonts embedded (Figma, Paper, Keynote, Slides)
      svg() {
        const c = node.cloneNode(true); c.removeAttribute('style');
        c.querySelectorAll('.ac-hit, .ac-hover, .ac-cross, .ac-rowbg').forEach((x) => x.remove());
        c.querySelectorAll('.ac-bar').forEach((p) => p.setAttribute('d', barPath(+p.dataset.x, +p.dataset.y, +p.dataset.w, +p.dataset.h)));
        c.querySelectorAll('.ac-val').forEach((v) => (v.textContent = fmt(v.dataset.target, spec)));
        c.querySelectorAll('.ac-num').forEach((n) => (n.textContent = fmt(n.dataset.target, { ...spec, suffix: n.dataset.unit })));
        c.querySelectorAll('.ac-clip').forEach((x) => x.setAttribute('width', x.dataset.w));
        c.querySelectorAll('.ac-arc').forEach((x) => x.setAttribute('stroke-dasharray', '1 1'));
        c.querySelectorAll('.ac-fade, .ac-row, .ac-seq, .ac-col').forEach((x) => { x.removeAttribute('opacity'); x.removeAttribute('transform'); });
        c.querySelectorAll('[style]').forEach((x) => { if (x.style.opacity) x.style.opacity = ''; });
        const st = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        st.textContent = typeof FONT_CSS !== 'undefined' ? FONT_CSS : ''; c.insertBefore(st, c.firstChild);
        return new XMLSerializer().serializeToString(c);
      },
      png(scale = 2) {
        return new Promise((resolveP) => {
          const img = new Image();
          img.onload = () => { const cv = document.createElement('canvas'); cv.width = frameW * scale; cv.height = frameH * scale; cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); cv.toBlob(resolveP, 'image/png'); };
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(handle.svg());
        });
      },
    };
    if (opt.animate) handle.play();
    return handle;
  }

  return { render, parseCSV, fmt, THEMES, makeTheme, PALETTES, COLORS: C };
})();
