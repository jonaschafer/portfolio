import * as E from './engine.js?v=7'
import * as C from './coach.js?v=7'

const $ = (s) => document.querySelector(s)
const NS = 'http://www.w3.org/2000/svg'
const svg = $('#board'), feed = $('#feed'), controls = $('#controls')
const store = {
  get: (k, d) => { try { const v = localStorage.getItem('bg-' + k); return v === null ? d : JSON.parse(v) } catch { return d } },
  set: (k, v) => { try { localStorage.setItem('bg-' + k, JSON.stringify(v)) } catch {} },
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- Geometry (viewBox 1000 x 640) ----------
const PW = 58, L0 = 88, R0 = 496, TOP = 48, BOT = 592, PH = 230, CR = 26, BARX = 466, TRAYX = 898
const px = (h) => (h <= 6 ? R0 + (6 - h) * PW : h <= 12 ? L0 + (12 - h) * PW : h <= 18 ? L0 + (h - 13) * PW : R0 + (h - 19) * PW) + PW / 2
const isTop = (h) => h >= 13
function stackY(h, k, n) {
  const sp = n <= 4 ? 52 : (PH - 2 * CR) / (n - 1)
  return isTop(h) ? TOP + CR + k * sp : BOT - CR - k * sp
}
function slotXY(side, pt, k, n) {
  if (pt === 25) return side === 0 ? [BARX, 392 + k * 44] : [BARX, 248 - k * 44]
  if (pt === 0) return side === 0 ? [TRAYX, BOT - 7 - k * 13] : [TRAYX, TOP + 7 + k * 13]
  const h = side === 0 ? pt : 25 - pt
  return [px(h), stackY(h, k, n)]
}

// ---------- State ----------
const S = {
  level: store.get('level', 'medium'),
  seen: new Set(store.get('seen', [])),
  score: store.get('score', { you: 0, brown: 0 }),
  threats: store.get('threats', true),
  pause: store.get('pause', true),
  speed: store.get('speed', 'normal'),
  stepWaiter: null,
  pos: E.initial(), phase: 'opening', dice: null, rem: [], diceOwner: 0,
  turnStart: null, turns: [], keys: new Set(), undo: [], steps: [],
  sel: null, dests: null, hint: null, lastBrown: null, preview: null, openDice: null,
  isOpening: false, firstMove: true, stats: null, hide: null, review: null, games: 0,
}
// How fast Brown plays. pre: pause after its dice land; fly: one checker's
// travel; gap: pause between checkers; after: pause after your move before Brown rolls.
const SPEEDS = {
  step: { pre: 700, fly: 600, gap: 0, after: 900 },
  slow: { pre: 1600, fly: 950, gap: 850, after: 1400 },
  normal: { pre: 900, fly: 600, gap: 400, after: 900 },
  fast: { pre: 350, fly: 280, gap: 90, after: 500 },
}
const T = () => SPEEDS[S.speed] || SPEEDS.normal
const saveSeen = () => store.set('seen', [...S.seen])

// ---------- Static board ----------
function staticBoard() {
  let s = `<defs>
    <radialGradient id="gC" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fdf6e6"/><stop offset=".65" stop-color="#ecdfc2"/><stop offset="1" stop-color="#d9c6a0"/></radialGradient>
    <radialGradient id="gB" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#a36b3f"/><stop offset=".65" stop-color="#7a4624"/><stop offset="1" stop-color="#5c3318"/></radialGradient>
    <linearGradient id="sC" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbf1dc"/><stop offset="1" stop-color="#d6c29b"/></linearGradient>
    <linearGradient id="sB" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#93603a"/><stop offset="1" stop-color="#5a3117"/></linearGradient>
    <linearGradient id="frame" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#245a3b"/><stop offset="1" stop-color="#173f28"/></linearGradient>
    <linearGradient id="roll" x1="0" x2="1"><stop offset="0" stop-color="#0f2c1b"/><stop offset=".35" stop-color="#2c6845"/><stop offset=".55" stop-color="#2a6242"/><stop offset="1" stop-color="#0d2617"/></linearGradient>
    <linearGradient id="field" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1d4931"/><stop offset=".5" stop-color="#1a432c"/><stop offset="1" stop-color="#173c27"/></linearGradient>
    <filter id="noise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 0"/></filter>
    <filter id="pebble" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="3" seed="9" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 -.25"/></filter>
    <filter id="ckS" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="2.5" stdDeviation="1.8" flood-color="#000" flood-opacity=".5"/></filter>
    <filter id="dieS" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="1" dy="3" stdDeviation="2.5" flood-color="#000" flood-opacity=".45"/></filter>
    <marker id="ahG" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e2b75c"/></marker>
    <marker id="ahC" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#f1e4c6"/></marker>
    <clipPath id="fieldClip"><rect x="80" y="40" width="856" height="560" rx="4"/></clipPath>
  </defs>`
  // strap loop on the right edge
  s += `<path d="M952 300 C 985 300, 996 312, 996 330 C 996 350, 985 362, 952 362" fill="none" stroke="#173f28" stroke-width="7" stroke-linecap="round"/>
        <path d="M952 300 C 985 300, 996 312, 996 330 C 996 350, 985 362, 952 362" fill="none" stroke="#2b6544" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`
  // leather frame
  s += `<rect x="52" y="18" width="904" height="604" rx="16" fill="url(#frame)"/>
        <rect x="52" y="18" width="904" height="604" rx="16" filter="url(#pebble)" opacity=".35"/>
        <rect x="61" y="27" width="886" height="586" rx="11" fill="none" stroke="#7aa88a" stroke-opacity=".55" stroke-width="1.2" stroke-dasharray="5 4"/>`
  // suede field
  s += `<rect x="80" y="40" width="856" height="560" rx="4" fill="url(#field)"/>
        <rect x="80" y="40" width="856" height="560" rx="4" filter="url(#noise)" opacity=".28"/>
        <rect x="80" y="40" width="856" height="560" rx="4" fill="none" stroke="#0e2a19" stroke-width="2"/>`
  // points
  for (let h = 1; h <= 24; h++) {
    const x = px(h), top = isTop(h), base = top ? TOP : BOT, tip = top ? TOP + PH : BOT - PH
    const red = h % 2 === 1
    const fill = red ? '#c8323a' : '#ece0c5'
    const stitch = red ? 'rgba(255,225,220,.55)' : 'rgba(110,80,40,.45)'
    const dir = top ? 1 : -1
    s += `<path d="M${x - 26} ${base} L${x} ${tip} L${x + 26} ${base} Z" fill="${fill}"/>`
    s += `<path d="M${x - 26} ${base} L${x} ${tip} L${x + 26} ${base} Z" filter="url(#noise)" opacity=".12"/>`
    s += `<path d="M${x - 20} ${base + dir * 4} L${x} ${tip - dir * 14} L${x + 20} ${base + dir * 4}" fill="none" stroke="${stitch}" stroke-width="1.1" stroke-dasharray="4 3"/>`
    s += `<text x="${x}" y="${top ? 36 : 611}" text-anchor="middle" font-family="Newsreader, serif" font-size="13" fill="#e9dcbc" fill-opacity=".6">${h}</text>`
  }
  // the bar (center seam) and bear-off tray
  s += `<rect x="436" y="40" width="60" height="560" fill="#163a25"/>
        <rect x="436" y="40" width="60" height="560" filter="url(#pebble)" opacity=".3"/>
        <line x1="441" y1="44" x2="441" y2="596" stroke="#7aa88a" stroke-opacity=".45" stroke-dasharray="5 4"/>
        <line x1="491" y1="44" x2="491" y2="596" stroke="#7aa88a" stroke-opacity=".45" stroke-dasharray="5 4"/>
        <rect x="844" y="40" width="24" height="560" fill="#173f28"/>
        <rect x="868" y="48" width="60" height="544" rx="6" fill="#123320"/>
        <rect x="868" y="48" width="60" height="544" rx="6" filter="url(#noise)" opacity=".25"/>
        <rect x="868" y="48" width="60" height="544" rx="6" fill="none" stroke="#7aa88a" stroke-opacity=".35" stroke-dasharray="4 4"/>
        <text x="${TRAYX}" y="334" text-anchor="middle" font-family="Newsreader, serif" font-style="italic" font-size="13" fill="#e9dcbc" fill-opacity=".45">off</text>`
  // the rolled-up end on the left, with its zipper
  s += `<rect x="6" y="12" width="66" height="616" rx="30" fill="url(#roll)"/>
        <rect x="6" y="12" width="66" height="616" rx="30" filter="url(#pebble)" opacity=".35"/>
        <line x1="33" y1="44" x2="33" y2="588" stroke="#0b1f13" stroke-width="7" stroke-linecap="round"/>
        <line x1="33" y1="46" x2="33" y2="586" stroke="#c9b27a" stroke-width="4" stroke-dasharray="1.6 1.6"/>
        <rect x="27" y="560" width="12" height="22" rx="3" fill="#d8c18a" stroke="#8e7744"/>
        <path d="M33 582 L33 600 L44 614" fill="none" stroke="#1d4a31" stroke-width="6" stroke-linecap="round"/>`
  s += `<g id="dyn"></g><g id="fly"></g><g id="hits"></g>`
  svg.innerHTML = s
  // click targets
  let h = ''
  for (let i = 1; i <= 24; i++) h += `<rect class="hit" data-pt="${i}" x="${px(i) - PW / 2}" y="${isTop(i) ? 40 : 320}" width="${PW}" height="280" fill="transparent"/>`
  h += `<rect class="hit" data-pt="25" x="436" y="40" width="60" height="560" fill="transparent"/>`
  h += `<rect class="hit" data-pt="0" x="860" y="40" width="76" height="560" fill="transparent"/>`
  $('#hits').innerHTML = h
}

// ---------- Drawing ----------
function checker(x, y, side, cls = '') {
  const ring = side ? 'rgba(0,0,0,.22)' : 'rgba(120,90,40,.22)'
  const edge = side ? '#3f210d' : '#c4ad83'
  return `<g class="ck ${cls}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="${CR}" fill="url(#${side ? 'gB' : 'gC'})" filter="url(#ckS)"/><circle r="${CR - 0.5}" fill="none" stroke="${edge}" stroke-width="1"/><circle r="19" fill="none" stroke="${ring}" stroke-width="1.6"/><circle r="12" fill="none" stroke="${ring}" stroke-opacity=".5" stroke-width="1"/></g>`
}
function slice(x, y, side) { return `<rect x="${x - 26}" y="${y - 5.5}" width="52" height="11" rx="3" fill="url(#${side ? 'sB' : 'sC'})" stroke="${side ? '#3f210d' : '#bfa77c'}" stroke-width=".8"/>` }

const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }
function die(x, y, n, size, used, rot = 0, tint = '#fbf8f0') {
  const r = size / 2, o = size * 0.26
  let s = `<g transform="translate(${x},${y}) rotate(${rot})" opacity="${used ? 0.32 : 1}"><rect x="${-r}" y="${-r}" width="${size}" height="${size}" rx="${size * 0.2}" fill="${tint}" stroke="#cfc6b4" filter="url(#dieS)"/>`
  for (const [a, b] of PIPS[n]) s += `<circle cx="${a * o}" cy="${b * o}" r="${size * 0.085}" fill="#1c1814"/>`
  return s + '</g>'
}

function arrowPaths(base, steps, side, color) {
  let q = E.clone(base), out = ''
  for (const st of steps) {
    const a = slotXY(side, st.from, q[side][st.from] - 1, q[side][st.from])
    q = E.step(q, side, st.from, st.to).pos
    const b = slotXY(side, st.to, q[side][st.to] - 1, q[side][st.to])
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1
    const bend = Math.min(60, len * 0.25)
    const cx = mx - (dy / len) * bend * (isTop(side === 0 ? st.from : 25 - st.from) ? -1 : 1), cy = my + (dx / len) * bend * (a[1] < 320 ? -1 : 1)
    // shorten the end so the head sits just inside the landing checker
    const ex = b[0] - (dx / len) * 6, ey = b[1] - (dy / len) * 6
    out += `<path d="M${a[0]} ${a[1]} Q${cx} ${cy} ${ex} ${ey}" fill="none" stroke="${color === 'gold' ? '#e2b75c' : '#f1e4c6'}" stroke-width="${color === 'gold' ? 5 : 3.5}" stroke-linecap="round" stroke-dasharray="${color === 'gold' ? '0' : '7 6'}" opacity="${color === 'gold' ? 0.95 : 0.75}" marker-end="url(#${color === 'gold' ? 'ahG' : 'ahC'})"/>`
  }
  return out
}

function render() {
  const pv = S.preview
  const pos = pv ? pv.pos : S.pos
  const showOpts = !pv && S.phase === 'move'
  const opts = showOpts ? E.stepOptions(S.pos, 0, S.rem, S.keys) : []
  const movable = new Set(opts.map((o) => o.from))
  let s = ''
  // direction guide before the first roll
  if (S.phase === 'opening' && !S.openDice) {
    s += `<path d="M830 296 L120 296 Q92 296 92 320 Q92 344 120 344 L846 344" fill="none" stroke="#f1e4c6" stroke-opacity=".7" stroke-width="2.5" stroke-dasharray="8 7" marker-end="url(#ahC)"/>
          <text x="275" y="326" text-anchor="middle" font-family="Newsreader, serif" font-style="italic" font-size="17" fill="#f1e4c6" fill-opacity=".85">you move this way, 24 down to 1, then off</text>`
  }
  // destination glows (under checkers)
  if (showOpts && S.dests) {
    for (const [to] of S.dests) {
      if (to === 0) { s += `<rect x="868" y="${BOT - 210}" width="60" height="210" rx="6" fill="#e2b75c" fill-opacity=".28" stroke="#e2b75c" stroke-width="2"/>`; continue }
      const x = px(to), top = isTop(to), base = top ? TOP : BOT, tip = top ? TOP + PH : BOT - PH
      s += `<path d="M${x - 26} ${base} L${x} ${tip} L${x + 26} ${base} Z" fill="#e2b75c" fill-opacity=".22"/>`
    }
  }
  // checkers on points
  const hide = S.hide
  for (let h = 1; h <= 24; h++) {
    const n0 = pos[0][h], n1 = pos[1][25 - h]
    const side = n0 ? 0 : 1, n = n0 || n1
    let shown = n
    if (hide && hide.side === side && (side === 0 ? hide.pt : 25 - hide.pt) === h) shown = n - 1
    for (let k = 0; k < shown; k++) {
      const cls = side === 0 && k === n - 1 && S.sel === h && !pv ? 'sel' : ''
      s += checker(px(h), stackY(h, k, n), side, cls)
    }
  }
  // bar and tray
  for (const side of [0, 1]) {
    const nb = pos[side][25]
    const hb = hide && hide.side === side && hide.pt === 25 ? 1 : 0
    for (let k = 0; k < nb - hb; k++) { const [x, y] = slotXY(side, 25, k, nb); s += checker(x, y, side) }
    const no = pos[side][0]
    const ho = hide && hide.side === side && hide.pt === 0 ? 1 : 0
    for (let k = 0; k < no - ho; k++) { const [x, y] = slotXY(side, 0, k, no); s += slice(x, y, side) }
  }
  // movable checkers get a brass ring; the selected one gets a full glow
  if (showOpts) {
    for (const from of movable) {
      const n = S.pos[0][from]
      const [x, y] = slotXY(0, from, n - 1, n)
      const sel = S.sel === from
      s += `<circle cx="${x}" cy="${y}" r="${CR + (sel ? 4 : 2.5)}" fill="${sel ? 'rgba(226,183,92,.18)' : 'none'}" stroke="#e2b75c" stroke-width="${sel ? 4 : 2}" stroke-opacity="${sel ? 1 : 0.7}"/>`
    }
    if (S.dests) {
      for (const [to] of S.dests) {
        if (to === 0) continue
        const n = S.pos[0][to] + 1
        const [x, y] = slotXY(0, to, n - 1, n)
        s += `<circle cx="${x}" cy="${y}" r="10" fill="#e2b75c" stroke="#fff3d6" stroke-width="2"/>`
      }
    }
  }
  // danger: how many of Brown's rolls hit each of your blots
  if (S.threats && !pv && S.phase !== 'opening' && S.phase !== 'over' && E.contact(pos)) {
    const r = E.shotRisk(pos, 0)
    for (const b in r.byPoint) {
      const [x, y] = slotXY(0, +b, 0, 1)
      const by = isTop(+b) ? y + 20 : y - 20
      s += `<g transform="translate(${x + 19},${by})"><circle r="11.5" fill="#b8402f" stroke="#fff4e2" stroke-width="1.5"/><text y="4.5" text-anchor="middle" font-family="Newsreader, serif" font-size="13.5" font-weight="700" fill="#fff">${r.byPoint[b]}</text></g>`
    }
  }
  // arrows: Brown's last move (dashed cream), hint / better play (gold)
  if (pv) s += arrowPaths(pv.pos, pv.steps, 0, 'gold')
  else {
    if (S.lastBrown && S.steps.length === 0 && S.phase !== 'opening') s += arrowPaths(S.lastBrown.base, S.lastBrown.steps, 1, 'cream')
    if (S.hint && S.steps.length === 0) s += arrowPaths(S.turnStart, S.hint, 0, 'gold')
  }
  // dice
  if (S.openDice) {
    const [c, b] = S.openDice
    s += die(670, 320, c, 42, false, -6) + die(262, 320, b, 42, false, 5, '#f3e9d6')
    s += `<text x="670" y="${320 + 40}" text-anchor="middle" font-family="Newsreader, serif" font-size="13" fill="#f1e4c6" fill-opacity=".8">you</text><text x="262" y="${320 + 40}" text-anchor="middle" font-family="Newsreader, serif" font-size="13" fill="#f1e4c6" fill-opacity=".8">Brown</text>`
  } else if (S.dice && !pv) {
    const list = E.diceList(S.dice)
    const remaining = S.rem.slice()
    const cx = S.diceOwner === 0 ? 670 : 262
    const size = list.length === 4 ? 36 : 42, gap = size + 10
    list.forEach((d, i) => {
      const ri = remaining.indexOf(d)
      const used = S.diceOwner === 0 && S.phase === 'move' ? ri < 0 : false
      if (ri >= 0) remaining.splice(ri, 1)
      const x = cx + (i - (list.length - 1) / 2) * gap
      s += die(x, 320, d, size, used, (i % 2 ? 5 : -6) + (S.diceOwner ? 3 : 0))
    })
  }
  $('#dyn').innerHTML = s
  $('#banner').classList.toggle('previewing', !!pv)
  for (const el of document.querySelectorAll('#hits .hit')) {
    const pt = +el.dataset.pt
    el.classList.toggle('can', showOpts && (movable.has(pt) || (S.dests && S.dests.has(pt))))
  }
  renderControls()
  renderHead()
}

function renderHead() {
  const p = S.pos
  $('#score').innerHTML = `You <b>${S.score.you}</b> · Brown <b>${S.score.brown}</b>`
  $('#pipline').textContent = `Pip count: you ${E.pips(p[0])}, Brown ${E.pips(p[1])}`
  let w
  const res = E.gameResult(p)
  if (res) w = res.winner === 0 ? 1 : 0
  else if (S.phase === 'opening') w = 0.5
  else if (S.phase === 'ai' || S.phase === 'review' || S.phase === 'commit') w = E.winProb(E.evaluate(p, 0), p)
  else w = 1 - E.winProb(E.evaluate(p, 1), p)
  const pct = Math.round(w * 100)
  $('#oddsPct').textContent = `${pct}%`
  $('#oddsBar').style.width = `${pct}%`
}

function btn(label, fn, cls = '', disabled = false, kbd = '') {
  const b = document.createElement('button')
  b.className = 'btn ' + cls
  b.innerHTML = label + (kbd ? `<kbd>${kbd}</kbd>` : '')
  b.disabled = disabled
  b.onclick = fn
  return b
}
function renderControls() {
  controls.innerHTML = ''
  const add = (...b) => controls.append(...b)
  if (S.preview) return add(btn('Back to the game', endPreview, 'primary', false, 'esc'))
  switch (S.phase) {
    case 'opening': add(btn(S.openDice ? 'Roll again' : 'Roll to start', rollOpening, 'primary pulse', false, 'space')); break
    case 'roll': add(btn('Roll', humanRoll, 'primary pulse', false, 'space')); break
    case 'move': {
      const complete = S.keys.has(E.key(S.pos))
      add(btn('Undo', undo, 'quiet', !S.steps.length, 'U'), btn('Hint', hint, 'quiet', false, 'H'), btn('Done', done, 'primary' + (complete ? ' pulse' : ''), !complete, 'space'))
      break
    }
    case 'pass': add(btn('OK', passTurn, 'primary', false, 'space')); break
    case 'review': add(btn('Try again', tryAgain, 'quiet', false, 'U'), btn('Keep my move', keepMove, 'primary', false, 'space')); break
    case 'over': add(btn('New game', newGame, 'primary pulse', false, 'space')); break
    case 'ai':
      if (S.stepWaiter) add(btn(`Brown’s next checker (${S.stepWaiter.i + 1} of ${S.stepWaiter.n})`, nextStep, 'primary pulse', false, 'space'))
      else controls.innerHTML = `<span style="opacity:.7;font-style:italic;font-size:17px;padding:10px">Brown is moving…</span>`
      break
  }
}

// ---------- Coach feed ----------
function say(kind, html, acts) {
  if (kind === 'note') feed.querySelectorAll('.msg.note').forEach((n) => n.remove())
  const el = document.createElement('div')
  el.className = 'msg ' + kind
  const who = { tip: 'Coach', you: 'You', brown: 'Brown', note: '', sys: '' }[kind]
  el.innerHTML = (who ? `<span class="who">${who}</span>` : '') + html
  if (acts && acts.length) {
    const box = document.createElement('div')
    box.className = 'acts'
    for (const [label, fn, solid] of acts) { const b = document.createElement('button'); b.className = 'chip' + (solid ? ' solid' : ''); b.textContent = label; b.onclick = fn; box.append(b) }
    el.append(box)
  }
  feed.append(el)
  while (feed.children.length > 60) feed.firstChild.remove()
  feed.scrollTop = feed.scrollHeight
  saveSeen()
  return el
}

// ---------- Animation ----------
function fly(side, from, to, before, after, ms) {
  if (reduced) return Promise.resolve()
  const a = slotXY(side, from, before[side][from] - 1, before[side][from])
  const b = slotXY(side, to, after[side][to] - 1, after[side][to])
  S.hide = { side, pt: to }
  render()
  const g = document.createElementNS(NS, 'g')
  g.innerHTML = to === 0 ? checker(0, 0, side) : checker(0, 0, side)
  const node = g.firstChild
  $('#fly').append(g)
  const lift = Math.min(70, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.18)
  return new Promise((res) => {
    const t0 = performance.now()
    const tick = (t) => {
      let k = Math.min(1, (t - t0) / ms)
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
      const x = a[0] + (b[0] - a[0]) * e, y = a[1] + (b[1] - a[1]) * e - Math.sin(Math.PI * e) * lift
      node.setAttribute('transform', `translate(${x},${y}) scale(${1 + Math.sin(Math.PI * e) * 0.08})`)
      if (k < 1) requestAnimationFrame(tick)
      else { g.remove(); S.hide = null; res() }
    }
    requestAnimationFrame(tick)
  })
}

async function shake(owner, dice) {
  S.diceOwner = owner
  if (!reduced) {
    for (let i = 0; i < 6; i++) {
      S.dice = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]
      S.rem = E.diceList(S.dice)
      render()
      await wait(55)
    }
  }
  S.dice = dice
  S.rem = E.diceList(dice)
}
const roll = () => [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]

// ---------- Game flow ----------
function newGame() {
  S.stepWaiter = null
  S.pos = E.initial(); S.phase = 'opening'; S.dice = null; S.rem = []; S.openDice = null
  S.turnStart = null; S.turns = []; S.keys = new Set(); S.undo = []; S.steps = []
  S.sel = null; S.dests = null; S.hint = null; S.lastBrown = null; S.preview = null; S.review = null
  S.firstMove = true
  S.stats = { best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0, hints: 0 }
  feed.innerHTML = ''
  if (!S.seen.has('welcome')) {
    S.seen.add('welcome')
    say('tip', `Hey. You’re cream, Brown is the computer. You move your checkers from 24 down to 1 (follow the arrow), then ${C.term('bearoff', 'bear them off')} into the tray on the right. First to get all 15 off wins.`)
    say('tip', `I’ll explain what’s happening as we go, grade each of your moves, and tell you why. Underlined words open the rule behind them. Roll to see who goes first.`)
  } else say('sys', `New game on ${S.level}. Roll to see who goes first.`)
  render()
}

async function rollOpening() {
  if (S.phase !== 'opening' || S.busy) return
  S.busy = true
  let c, b
  for (let i = 0; i < (reduced ? 1 : 7); i++) { c = 1 + Math.floor(Math.random() * 6); b = 1 + Math.floor(Math.random() * 6); S.openDice = [c, b]; render(); if (!reduced) await wait(60) }
  S.busy = false
  if (c === b) {
    say('sys', `Both rolled ${c}. Tie, roll again.`)
    return render()
  }
  const youFirst = c > b
  const first = !S.seen.has('openRoll')
  S.seen.add('openRoll')
  say('sys', `You rolled ${c}, Brown rolled ${b}. ${youFirst ? 'You go first' : 'Brown goes first'}${first ? `, playing those two numbers (${Math.max(c, b)}-${Math.min(c, b)}) as the ${C.term('start', 'opening move')}` : ''}.`)
  await wait(500)
  S.openDice = null
  const dice = [Math.max(c, b), Math.min(c, b)]
  if (youFirst) { S.diceOwner = 0; startHumanTurn(dice) }
  else aiTurn(dice)
}

async function humanRoll() {
  if (S.phase !== 'roll' || S.busy) return
  S.busy = true
  const d = roll()
  await shake(0, d)
  S.busy = false
  startHumanTurn(d)
}

function startHumanTurn(dice) {
  S.dice = dice; S.rem = E.diceList(dice); S.diceOwner = 0
  S.turnStart = E.clone(S.pos); S.steps = []; S.undo = []; S.sel = null; S.dests = null; S.hint = null
  S.isOpening = S.firstMove
  S.firstMove = false
  S.turns = E.analyze(S.pos, 0, dice)
  S.keys = new Set(S.turns.map((t) => E.key(t.pos)))
  if (!S.turns.length) {
    S.phase = 'pass'
    say('tip', C.noMoveText(S.pos, dice))
    return render()
  }
  S.phase = 'move'
  const tip = C.tipForRoll(S.pos, dice, S.turns, { seen: S.seen, isOpening: S.isOpening })
  if (tip) say('tip', tip)
  if (!S.seen.has('howToMove')) {
    S.seen.add('howToMove')
    say('note', `Click a checker with a gold ring, then a gold dot to move it. Each die is one move. Press Done when you’re finished.`)
  }
  // only one way to play it? say so
  if (S.turns.length === 1 && S.turns[0].steps.length < E.diceList(dice).length) say('note', `Only part of this roll can be played. That’s the rule: use what you can.`)
  render()
}

function computeDests(from) {
  const map = new Map()
  const frontier = [{ pos: S.pos, rem: S.rem, at: from, path: [] }]
  while (frontier.length) {
    const f = frontier.shift()
    for (const o of E.stepOptions(f.pos, 0, f.rem, S.keys)) {
      if (o.from !== f.at) continue
      const path = f.path.concat(o)
      if (!map.has(o.to)) map.set(o.to, path)
      if (o.to !== 0) frontier.push({ pos: E.step(f.pos, 0, o.from, o.to).pos, rem: E.removeOne(f.rem, o.die), at: o.to, path })
    }
  }
  return map
}

async function clickPoint(pt) {
  if (S.preview) return endPreview()
  if (S.phase === 'opening') return rollOpening()
  if (S.phase === 'roll') return humanRoll()
  if (S.phase !== 'move' || S.busy) return
  if (S.sel !== null && S.dests && S.dests.has(pt)) return playPath(S.dests.get(pt))
  if (pt === S.sel) { S.sel = null; S.dests = null; return render() }
  if (pt !== 0 && S.pos[0][pt] > 0) {
    const opts = E.stepOptions(S.pos, 0, S.rem, S.keys).filter((o) => o.from === pt)
    if (opts.length) {
      S.sel = pt; S.dests = computeDests(pt)
      // one checker, one place to go: just move it
      return render()
    }
    if (!S.rem.length || S.keys.has(E.key(S.pos)) && !E.stepOptions(S.pos, 0, S.rem, S.keys).length) say('note', `You’ve played your roll. Press Done.`)
    else say('note', C.blockedText(E.whyBlocked(S.pos, 0, pt, S.rem), pt, S.rem))
  }
  S.sel = null; S.dests = null
  render()
}

async function playPath(path) {
  S.busy = true
  S.sel = null; S.dests = null
  for (const o of path) {
    const before = S.pos
    S.undo.push({ pos: S.pos, rem: S.rem.slice(), steps: S.steps.slice() })
    const r = E.step(S.pos, 0, o.from, o.to)
    S.pos = r.pos; S.rem = E.removeOne(S.rem, o.die); S.steps = S.steps.concat({ ...o, hit: r.hit })
    await fly(0, o.from, o.to, before, S.pos, 230)
    if (r.hit && !S.seen.has('youHit')) { S.seen.add('youHit'); say('note', `Hit! That Brown checker goes to the bar and has to start over from your home board.`) }
  }
  S.busy = false
  render()
}

function undo() {
  if (S.phase === 'review') return tryAgain()
  if (S.phase !== 'move' || !S.undo.length || S.busy) return
  const u = S.undo.pop()
  S.pos = u.pos; S.rem = u.rem; S.steps = u.steps; S.sel = null; S.dests = null
  render()
}

function hint() {
  if (S.phase !== 'move') return
  if (S.steps.length) { S.pos = S.turnStart; S.rem = E.diceList(S.dice); S.steps = []; S.undo = [] }
  const bt = S.isOpening && C.bookTurn(S.turns, S.dice)
  const t = bt || S.turns[0]
  S.hint = t.steps
  S.stats.hints++
  say('note', `Gold arrows show the move: <span class="mv">${C.fmtMove(t.steps, 0)}</span>. ${bt ? 'That’s the standard first move for this roll.' : hintWhy(t)}`)
  render()
}
function hintWhy(t) {
  const f = C.features(S.turnStart, t.pos, t.steps, 0)
  if (f.hits) return 'It hits.'
  const km = f.made.filter((p) => [5, 4, 7, 6, 3, 20, 21].includes(p))
  if (km.length) return `It makes ${C.pointName(km[0])}.`
  if (f.off) return 'Bear off as many as you can.'
  if (f.escaped) return 'It gets a back checker moving.'
  if (f.shots === 0) return 'It keeps everything safe.'
  return ''
}

async function done() {
  if (S.phase !== 'move' || S.busy || !S.keys.has(E.key(S.pos))) return
  const before = S.turnStart
  if (S.turns.length === 1) {
    // Forced: nothing to grade.
    S.hint = null
    say('you', `<span class="mv">${C.fmtMove(S.steps, 0)}</span><p style="color:var(--muted)">The only legal way to play this roll.</p>`)
    if (E.gameResult(S.pos)) return gameOver()
    S.phase = 'commit'; render()
    await wait(T().after)
    return aiTurn()
  }
  const g = C.grade(before, S.turns, E.key(S.pos), S.dice, S.isOpening)
  S.stats[g.grade]++
  S.hint = null
  const G = C.GRADES[g.grade]
  const acts = []
  const better = g.grade !== 'best' && g.grade !== 'book' && g.best !== g.chosen
  if (better) acts.push(['Show the better play', () => startPreview(before, g.best.steps)])
  const pct = ['inaccuracy', 'mistake', 'blunder'].includes(g.grade) && g.diff >= 0.01 ? ` <span style="color:var(--muted);font-size:15px">(−${Math.round(g.diff * 100)}% chances)</span>` : ''
  say('you', `<span class="badge ${G.tone}">${G.label}</span><span class="mv">${C.fmtMove(S.steps, 0)}</span>${pct}<p>${g.why}${better ? ` Better: <span class="mv">${C.fmtMove(g.best.steps, 0)}</span>.` : ''}</p>`, acts)
  if (E.gameResult(S.pos)) return gameOver()
  S.phase = 'commit'
  if (S.pause && ['inaccuracy', 'mistake', 'blunder'].includes(g.grade)) {
    S.phase = 'review'; S.review = g
    say('note', `Want to try that roll again? Or keep your move and play on.`)
    return render()
  }
  render()
  await wait(T().after)
  aiTurn()
}

function tryAgain() {
  if (S.phase !== 'review') return
  S.stats[S.review.grade]--
  S.pos = S.turnStart; S.rem = E.diceList(S.dice); S.steps = []; S.undo = []; S.sel = null; S.dests = null
  S.phase = 'move'; S.review = null
  say('note', `Same roll, ${S.dice[0]}-${S.dice[1]}. Have another look.`)
  render()
}
async function keepMove() {
  if (S.phase !== 'review') return
  S.review = null; S.phase = 'commit'
  render()
  await wait(300)
  aiTurn()
}
async function passTurn() {
  if (S.phase !== 'pass') return
  S.phase = 'commit'
  render()
  await wait(200)
  aiTurn()
}

// Step mode: Brown waits for a click (or space) before each checker.
function stepGate(i, n) {
  return new Promise((res) => { S.stepWaiter = { res, i, n }; render() })
}
function nextStep() {
  const w = S.stepWaiter
  if (!w) return
  S.stepWaiter = null
  w.res()
}

async function aiTurn(given) {
  S.phase = 'ai'; S.sel = null; S.dests = null; S.hint = null; S.steps = []; S.undo = []; S.firstMove = false
  render()
  const dice = given || roll()
  if (!given) await shake(1, dice)
  S.dice = dice; S.rem = E.diceList(dice); S.diceOwner = 1
  render()
  await wait(reduced ? 50 : T().pre)
  const before = S.pos
  const t = E.chooseAI(S.pos, 1, dice, S.level)
  const steps = t ? t.steps : []
  for (let i = 0; i < steps.length; i++) {
    const st = steps[i]
    if (S.speed === 'step') await stepGate(i, steps.length)
    const b = S.pos
    S.pos = E.step(S.pos, 1, st.from, st.to).pos
    S.rem = E.removeOne(S.rem, st.die)
    await fly(1, st.from, st.to, b, S.pos, T().fly)
    if (S.speed !== 'step' && i < steps.length - 1) await wait(T().gap)
  }
  S.lastBrown = { base: before, steps }
  const lines = C.explainBrown(before, S.pos, steps, dice, S.seen)
  say('brown', lines.map((l, i) => (i ? `<p>${l}</p>` : l)).join(''))
  if (E.gameResult(S.pos)) return gameOver()
  S.phase = 'roll'
  S.dice = null
  render()
}

function gameOver() {
  const r = E.gameResult(S.pos)
  S.phase = 'over'
  S.dice = null
  const pts = r.kind
  if (r.winner === 0) S.score.you += pts; else S.score.brown += pts
  store.set('score', S.score)
  const kind = [null, 'a single game', `a ${C.term('winning', 'gammon')}`, `a ${C.term('winning', 'backgammon')}`][pts]
  const st = S.stats
  const total = st.best + st.good + st.inaccuracy + st.mistake + st.blunder + st.book
  const clean = st.best + st.book + st.good
  say('tip', `<b>${r.winner === 0 ? 'You win' : 'Brown wins'}</b>, ${kind} (${pts} point${pts > 1 ? 's' : ''}).<p>Your ${total} moves: ${st.book + st.best} best or book, ${st.good} good, ${st.inaccuracy} inaccurate, ${st.mistake + st.blunder} mistakes${st.hints ? `, ${st.hints} hint${st.hints > 1 ? 's' : ''}` : ''}. ${total ? `${Math.round((clean / total) * 100)}% solid.` : ''}</p>${S.level !== 'hard' && r.winner === 0 && clean / Math.max(1, total) > 0.7 ? `<p>Ready to try ${S.level === 'easy' ? 'Medium' : 'Hard'}?</p>` : ''}`)
  render()
}

function startPreview(pos, steps) { S.preview = { pos, steps }; render() }
function endPreview() { S.preview = null; render() }

// ---------- Rules drawer ----------
function openRules(id) {
  document.body.classList.add('rules-open')
  $('#drawer').setAttribute('aria-hidden', 'false')
  if (id) {
    const sec = document.getElementById('r-' + id)
    if (sec) {
      sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      sec.classList.add('flash')
      setTimeout(() => sec.classList.remove('flash'), 1600)
    }
  }
}
function closeRules() { document.body.classList.remove('rules-open'); $('#drawer').setAttribute('aria-hidden', 'true') }

// ---------- Wiring ----------
staticBoard()
svg.addEventListener('click', (e) => {
  const t = e.target.closest('[data-pt]')
  if (S.preview) return endPreview()
  if (t) clickPoint(+t.dataset.pt)
})
document.addEventListener('click', (e) => {
  const t = e.target.closest('.term')
  if (t) { e.preventDefault(); openRules(t.dataset.rule) }
})
$('#rulesBtn').onclick = () => openRules()
$('#closeRules').onclick = closeRules
$('#scrim').onclick = closeRules
document.querySelectorAll('.toc a').forEach((a) => (a.onclick = (e) => { e.preventDefault(); openRules(a.getAttribute('href').slice(3)) }))
$('#newGame').onclick = () => { if (S.phase === 'opening' || S.phase === 'over' || confirm('Start a new game? This one will be dropped.')) newGame() }
function setLevel(l) {
  S.level = l; store.set('level', l)
  document.querySelectorAll('#levels button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.level === l)))
}
document.querySelectorAll('#levels button').forEach((b) => (b.onclick = () => { setLevel(b.dataset.level); if (S.phase !== 'opening') say('sys', `Brown plays ${b.dataset.level} from here on.`) }))
setLevel(S.level)
$('#optThreats').checked = S.threats
function setSpeed(v) {
  S.speed = v; store.set('speed', v)
  document.querySelectorAll('#speed button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.speed === v)))
  // switching away from Step mid-turn shouldn't leave Brown waiting
  if (v !== 'step') nextStep()
}
document.querySelectorAll('#speed button').forEach((b) => (b.onclick = () => setSpeed(b.dataset.speed)))
setSpeed(S.speed)
$('#optPause').checked = S.pause
$('#optThreats').onchange = (e) => { S.threats = e.target.checked; store.set('threats', S.threats); render() }
$('#optPause').onchange = (e) => { S.pause = e.target.checked; store.set('pause', S.pause) }

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  if (e.target.closest('input, textarea, select')) return
  const k = e.key.toLowerCase()
  if (k === 'escape') {
    if (document.body.classList.contains('rules-open')) return closeRules()
    if (S.preview) return endPreview()
    S.sel = null; S.dests = null; return render()
  }
  if (document.body.classList.contains('rules-open')) return
  if (k === ' ' || k === 'enter') {
    e.preventDefault()
    if (S.preview) return endPreview()
    if (S.stepWaiter) return nextStep()
    ;({ opening: rollOpening, roll: humanRoll, move: done, pass: passTurn, review: keepMove, over: newGame }[S.phase] || (() => {}))()
  } else if (k === 'u' || k === 'backspace') undo()
  else if (k === 'h') hint()
  else if (k === 'r' || k === '?') openRules()
})

newGame()
