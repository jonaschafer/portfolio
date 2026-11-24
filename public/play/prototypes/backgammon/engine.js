// Backgammon rules, move generation, evaluation and AI.
//
// A position is [p0, p1]. Each side's array has 26 slots in that side's own
// numbering: 1..24 are points (a side always moves from high to low), 25 is
// the bar, 0 counts checkers borne off. Side 0 is the player (cream), side 1
// is Brown. Point i for one side is point 25 - i for the other.

export const ROLLS = []
for (let a = 1; a <= 6; a++) for (let b = a; b <= 6; b++) ROLLS.push([a, b, a === b ? 1 : 2])

export const clone = (p) => [p[0].slice(), p[1].slice()]
export const key = (p) => p[0].join(',') + '|' + p[1].join(',')

export function initial() {
  const p = [new Array(26).fill(0), new Array(26).fill(0)]
  for (const s of [0, 1]) { p[s][24] = 2; p[s][13] = 5; p[s][8] = 3; p[s][6] = 5 }
  return p
}

export function pips(a) { let t = 0; for (let i = 1; i <= 25; i++) t += a[i] * i; return t }
export function allHome(a) { for (let i = 7; i <= 25; i++) if (a[i]) return false; return true }
export function backmost(a) { for (let i = 25; i >= 1; i--) if (a[i]) return i; return 0 }
export function contact(p) { return backmost(p[0]) + backmost(p[1]) > 25 }
export function homePoints(a) { let n = 0; for (let i = 1; i <= 6; i++) if (a[i] >= 2) n++; return n }
export function prime(a) {
  let best = 0, run = 0, end = 0
  for (let i = 1; i <= 24; i++) { if (a[i] >= 2) { run++; if (run > best) { best = run; end = i } } else run = 0 }
  return { len: best, from: end - best + 1, to: end }
}
export const diceList = (d) => (d[0] === d[1] ? [d[0], d[0], d[0], d[0]] : [d[0], d[1]])
export function removeOne(arr, v) { const i = arr.indexOf(v); const c = arr.slice(); if (i >= 0) c.splice(i, 1); return c }

// Where a checker on `from` lands with die `d`, or null if it can't move.
export function target(p, s, from, d) {
  const me = p[s], op = p[1 - s]
  if (!me[from]) return null
  if (me[25] > 0 && from !== 25) return null
  const to = from - d
  if (to >= 1) return op[25 - to] >= 2 ? null : to
  if (!allHome(me)) return null
  if (to === 0) return 0
  for (let i = from + 1; i <= 6; i++) if (me[i]) return null
  return 0
}

// Why a checker on `from` can't move with any of `dice` (ignoring the
// use-both-dice rule). Used by the coach to explain a dead click.
export function whyBlocked(p, s, from, dice) {
  const me = p[s], op = p[1 - s]
  if (me[25] > 0 && from !== 25) return 'bar'
  let reasons = new Set()
  for (const d of new Set(dice)) {
    const to = from - d
    if (to >= 1) { if (op[25 - to] >= 2) reasons.add('blocked') }
    else if (!allHome(me)) reasons.add('notHome')
    else if (to < 0) reasons.add('overshoot')
  }
  if (reasons.has('notHome')) return 'notHome'
  if (reasons.has('overshoot')) return 'overshoot'
  if (reasons.has('blocked')) return 'blocked'
  return 'rule'
}

export function step(p, s, from, to) {
  const q = clone(p)
  q[s][from]--
  let hit = false
  if (to === 0) q[s][0]++
  else {
    q[s][to]++
    const oi = 25 - to
    if (q[1 - s][oi] === 1) { q[1 - s][oi] = 0; q[1 - s][25]++; hit = true }
  }
  return { pos: q, hit }
}

// Every legal full turn (deduped by resulting position), applying the
// use-as-many-dice-as-possible rule and the larger-die rule.
export function legalTurns(p, s, dice) {
  const doubles = dice[0] === dice[1]
  const orders = doubles ? [diceList(dice)] : [[dice[0], dice[1]], [dice[1], dice[0]]]
  let results = new Map(), maxUsed = 0
  function rec(pos, rem, steps, lastFrom) {
    let moved = false
    if (rem.length) {
      const d = rem[0]
      for (let from = doubles ? lastFrom : 25; from >= 1; from--) {
        if (!pos[s][from]) continue
        const to = target(pos, s, from, d)
        if (to === null) continue
        moved = true
        const r = step(pos, s, from, to)
        rec(r.pos, rem.slice(1), steps.concat({ from, to, die: d, hit: r.hit }), from)
      }
    }
    if (!moved) {
      const used = steps.length
      if (used > maxUsed) { maxUsed = used; results = new Map() }
      if (used === maxUsed) { const k = key(pos); if (!results.has(k)) results.set(k, { pos, steps }) }
    }
  }
  for (const o of orders) rec(p, o, [], 25)
  let turns = [...results.values()]
  if (maxUsed === 0) return []
  if (maxUsed === 1 && !doubles) {
    const big = Math.max(dice[0], dice[1])
    const withBig = turns.filter((t) => t.steps[0].die === big)
    if (withBig.length) turns = withBig
  }
  return turns
}

// Can `pos` be completed (with dice `rem`) into one of the legal final
// positions? Lets the board accept one die at a time without ever walking
// the player into an illegal turn.
function anyReach(pos, s, rem, keys, memo) {
  const mk = key(pos) + '#' + rem.join('')
  if (memo.has(mk)) return memo.get(mk)
  let moved = false, ok = false
  for (const d of new Set(rem)) {
    for (let from = 25; from >= 1 && !ok; from--) {
      if (!pos[s][from]) continue
      const to = target(pos, s, from, d)
      if (to === null) continue
      moved = true
      if (anyReach(step(pos, s, from, to).pos, s, removeOne(rem, d), keys, memo)) ok = true
    }
    if (ok) break
  }
  if (!moved) ok = keys.has(key(pos))
  memo.set(mk, ok)
  return ok
}

export function stepOptions(pos, s, rem, keys) {
  const out = [], memo = new Map()
  for (const d of new Set(rem)) {
    for (let from = 25; from >= 1; from--) {
      if (!pos[s][from]) continue
      const to = target(pos, s, from, d)
      if (to === null) continue
      const r = step(pos, s, from, to)
      if (anyReach(r.pos, s, removeOne(rem, d), keys, memo)) out.push({ from, to, die: d, hit: r.hit })
    }
  }
  return out
}

// ---------- Shots ----------

// How exposed side s's blots are to the opponent's next roll.
// Returns { shots: rolls out of 36 that hit, loss: expected pips lost, byPoint }.
export function shotRisk(p, s) {
  const me = p[s], op = p[1 - s]
  // Index blots by the attacker's numbering; the pips a hit costs equals that index.
  const blot = new Array(26).fill(0)
  let any = false
  for (let b = 1; b <= 24; b++) if (me[b] === 1) { blot[25 - b] = 1; any = true }
  const byPoint = {}
  if (!any) return { shots: 0, loss: 0, byPoint }
  const open = (a) => a >= 1 && me[25 - a] < 2
  const bar = op[25]
  let shots = 0, loss = 0
  for (const [d1, d2, w] of ROLLS) {
    const hitSet = new Set()
    const run = (j, seq) => {
      let pos = j
      for (const d of seq) {
        pos -= d
        if (!open(pos)) return
        if (blot[pos]) hitSet.add(pos)
      }
    }
    const doubles = d1 === d2
    const seqs = doubles ? [[d1], [d1, d1], [d1, d1, d1], [d1, d1, d1, d1]] : [[d1], [d2], [d1, d2], [d2, d1]]
    if (bar === 0) {
      for (let j = 1; j <= 24; j++) if (op[j]) for (const q of seqs) run(j, q)
    } else if (doubles) {
      if (open(25 - d1)) {
        const spare = Math.max(0, 4 - bar)
        for (const q of seqs) if (q.length <= spare + 1) run(25, q)
        if (spare > 0) for (let j = 1; j <= 24; j++) if (op[j]) for (const q of seqs) if (q.length <= spare) run(j, q)
      }
    } else {
      for (const q of (bar === 1 ? seqs : [[d1], [d2]])) run(25, q)
      if (bar === 1) {
        for (const [enter, other] of [[d1, d2], [d2, d1]]) {
          if (!open(25 - enter)) continue
          for (let j = 1; j <= 24; j++) if (op[j]) run(j, [other])
        }
      }
    }
    if (hitSet.size) {
      shots += w
      let worst = 0
      for (const a of hitSet) { worst = Math.max(worst, a); byPoint[25 - a] = (byPoint[25 - a] || 0) + w }
      loss += w * worst
    }
  }
  return { shots, loss: loss / 36, byPoint }
}

// ---------- Evaluation ----------

// Value of owning each point (in "pips"), from the owner's numbering.
const PV = [0, 1, 2, 4, 6, 8, 7, 6, 3, 2, 1.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.5, 2, 6, 5, 3, 2, 1.5]
const PRIME_BONUS = [0, 0, 0, 3, 8, 15, 28]
const behind = (a) => { let n = 0; for (let i = 13; i <= 25; i++) n += a[i]; return n }
const trapped = (a) => { let n = 0; for (let i = 19; i <= 25; i++) n += a[i]; return n }
function wastage(a) { let w = a[1] * 2 + a[2]; for (let i = 1; i <= 6; i++) if (a[i] > 3) w += (a[i] - 3) * 0.6; return w }

// Score for side s, who just moved (opponent is on roll). Units are roughly pips.
export function evaluate(p, s) {
  const me = p[s], op = p[1 - s]
  if (me[0] === 15) return op[0] === 0 ? 700 : 500
  if (op[0] === 15) return me[0] === 0 ? -700 : -500
  if (!contact(p)) return pips(op) + wastage(op) - pips(me) - wastage(me) - 4
  let sc = (pips(op) - pips(me)) * 0.8
  const fMe = 0.3 + 0.7 * Math.min(1, behind(op) / 3)
  const fOp = 0.3 + 0.7 * Math.min(1, behind(me) / 3)
  for (let i = 1; i <= 24; i++) {
    if (me[i] >= 2) sc += PV[i] * (i <= 12 ? fMe : 1)
    if (op[i] >= 2) sc -= PV[i] * (i <= 12 ? fOp : 1)
    if (me[i] > 3) sc -= (me[i] - 3) * 0.8
    if (op[i] > 3) sc += (op[i] - 3) * 0.8
  }
  sc += PRIME_BONUS[Math.min(6, prime(me).len)] * fMe - PRIME_BONUS[Math.min(6, prime(op).len)] * fOp
  const hMe = homePoints(me), hOp = homePoints(op)
  sc -= me[25] * (3 + hOp * hOp * 0.7)
  sc += op[25] * (3 + hMe * hMe * 0.7)
  if (hMe === 6 && op[25] > 0) sc += 10
  sc -= trapped(me) * hOp * 0.6
  sc += trapped(op) * hMe * 0.6
  sc -= shotRisk(p, s).loss * (1.3 + 0.2 * hOp)
  sc += shotRisk(p, 1 - s).loss * 0.25
  return sc
}

// Rough chance that side s wins, from a score in evaluate()'s units.
export function winProb(score, p) {
  if (score >= 500) return 1
  if (score <= -500) return 0
  const avg = (pips(p[0]) + pips(p[1])) / 2
  const k = contact(p) ? 14 : 2 + avg * 0.07
  return 1 / (1 + Math.exp(-score / k))
}

// Average result for s after the opponent's best reply to each of the 21 rolls.
export function ply1(pos, s) {
  if (pos[s][0] === 15) return evaluate(pos, s)
  const o = 1 - s
  let tot = 0
  for (const [a, b, w] of ROLLS) {
    const resp = legalTurns(pos, o, [a, b])
    let best = -Infinity
    if (!resp.length) best = -evaluate(pos, s)
    else for (const r of resp) { const v = evaluate(r.pos, o); if (v > best) best = v }
    tot += w * -best
  }
  return tot / 36
}

// Rank every legal turn. Deep analysis looks one roll ahead on the top few.
export function analyze(p, s, dice, deep = false, top = 6) {
  const turns = legalTurns(p, s, dice)
  for (const t of turns) t.score = evaluate(t.pos, s)
  turns.sort((a, b) => b.score - a.score)
  if (deep && turns.length > 1) {
    for (let i = 0; i < Math.min(top, turns.length); i++) { turns[i].deep = ply1(turns[i].pos, s); }
    turns.sort((a, b) => (b.deep ?? -1e9) - (a.deep ?? -1e9) || b.score - a.score)
  }
  return turns
}

export function deepScore(t, s) { if (t.deep === undefined) t.deep = ply1(t.pos, s); return t.deep }

// Easy plays loose (lots of noise, sometimes random), Medium makes the odd
// slip, Hard always plays its top-rated move. In self-play tests Hard beats
// Medium about 62% of the time and Medium beats Easy almost every game.
export function chooseAI(p, s, dice, level) {
  const turns = analyze(p, s, dice, false)
  if (!turns.length) return null
  if (level === 'hard') return turns[0]
  if (level === 'easy' && Math.random() < 0.3) return turns[Math.floor(Math.random() * turns.length)]
  const T = level === 'easy' ? 9 : 3, max = turns[0].score
  const ws = turns.map((t) => Math.exp((t.score - max) / T))
  let r = Math.random() * ws.reduce((a, b) => a + b, 0)
  for (let i = 0; i < turns.length; i++) { r -= ws[i]; if (r <= 0) return turns[i] }
  return turns[0]
}

export function gameResult(p) {
  for (const s of [0, 1]) {
    if (p[s][0] === 15) {
      const l = p[1 - s]
      let kind = 1
      if (l[0] === 0) { kind = 2; for (let i = 19; i <= 25; i++) if (l[i]) kind = 3 }
      return { winner: s, kind }
    }
  }
  return null
}
