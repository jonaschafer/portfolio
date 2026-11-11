import { GEAR, MOVES, MOVE, WARMUP, FLOW, BENCHMARKS } from './data'

// Seeded so the same Sunday, headcount and length always deal the same board.
function rng(seedStr) {
  let h = 1779033703 ^ seedStr.length
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const shuffle = (r, arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const pickOne = (r, arr) => arr[Math.floor(r() * arr.length)]

// "12 cal row", "6/6 landmine press", ":40 plank", "40m farmers carry"
export function fmt(mv, reps = mv.r) {
  if (mv.unit === 'cal') return `${reps} cal ${mv.name}`
  if (mv.unit === 'm') return `${reps}m ${mv.name}`
  if (mv.unit === 'side') return `${reps}/${reps} ${mv.name}`
  if (mv.unit === 'secside') return `:${reps}/:${reps} ${mv.name}`
  if (mv.unit === 'sec') return reps >= 60 ? `${Math.floor(reps / 60)}:${String(reps % 60).padStart(2, '0')} ${mv.name}` : `:${reps} ${mv.name}`
  return `${reps} ${mv.name}`
}
const line = (mv, reps) => ({ text: fmt(mv, reps), cue: mv.cue, id: mv.id })
const scale = (mv, k) => {
  const v = mv.r * k
  if (mv.unit === 'm' || mv.unit === 'sec') return Math.max(10, Math.round(v / 10) * 10)
  return Math.max(1, Math.round(v))
}

// Does this set of movements fit the garage with `each` people on every one?
function fits(moves, each = 1) {
  const used = {}
  for (const mv of moves) for (const [g, u] of Object.entries(mv.gear)) used[g] = (used[g] || 0) + u * each
  return Object.entries(used).every(([g, u]) => u <= (GEAR[g] ?? Infinity))
}

// Pick k movements, one per pattern in order, skipping anything already used
// today, so that `each` people can be on each one at the same time.
function pickMoves(r, ctx, patterns, each = 1, filter = () => true) {
  const out = []
  for (const p of patterns) {
    const pool = shuffle(r, MOVES.filter((mv) => mv.pattern === p && !ctx.used.has(mv.id) && filter(mv)))
    const mv = pool.find((c) => fits([...out, c], each))
    if (mv) out.push(mv)
  }
  out.forEach((mv) => ctx.used.add(mv.id))
  return out
}

const STATION_PATTERNS = ['hinge', 'push', 'pull', 'squat', 'carry', 'getup', 'core']
// Past seven stations, patterns repeat (two hinges, two pushes).
const EXTRA = ['hinge', 'push', 'squat', 'pull']

function stationPatterns(r, k, withEngine) {
  const rest = [...shuffle(r, STATION_PATTERNS), ...shuffle(r, EXTRA)].slice(0, withEngine ? k - 1 : k)
  return withEngine ? ['engine', ...rest] : rest
}

const people = (n) => (n === 1 ? 'Solo' : `With ${n} of you`)
const stations = (n) => Math.min(6, Math.max(4, n))

// ---------- Block A: stations and team work, the bulk of the session ----------

const A_FORMATS = {
  // Your usual: a list of stations, rotate on the clock. Picks the station
  // count, minutes per station and rounds that best fill the target, leaning
  // to 3 minute stations.
  rotation: (r, ctx, target) => {
    let best = null
    for (let k = stations(ctx.n); k <= 6; k++)
      for (const per of [3, 2])
        for (const rounds of [2, 3, 1]) {
          const mins = k * per * rounds
          if (mins > target + 6) continue
          const score = Math.abs(mins - target) + (per === 2 ? 4 : 0) + (rounds === 1 ? 6 : 0)
          if (!best || score < best.score) best = { k, per, rounds, score }
        }
    const { k, per, rounds } = best || { k: stations(ctx.n), per: 2, rounds: 1 }
    const moves = pickMoves(r, ctx, stationPatterns(r, k, false).slice(0, k - 1))
    const list = [MOVE.row, ...moves]
    ctx.used.add('row')
    return {
      key: 'rotation',
      title: `Stations, every ${per} min, ${rounds} ${rounds === 1 ? 'rd' : 'rds'}`,
      format: 'Station rotation',
      what: `Your classic. Each station is ${per} minutes. Work sets with short rests until the switch, then move down one.`,
      group: ctx.n === 1
        ? `Solo: go top to bottom, ${per} minutes each.`
        : `${people(ctx.n)}: one person per station, starting with whoever rows. Rotate when the ${per} minutes are up.${list.length > ctx.n ? ' Empty stations are a rest.' : ''}`,
      lines: list.map((mv, i) => (i === 0 ? { text: '1. row, steady', cue: 'Steady pace you could hold the whole time. Note your meters.', id: 'row' } : { ...line(mv), text: `${i + 1}. sets of ${fmt(mv)}` })),
      minutes: list.length * per * rounds,
    }
  },

  // One move per minute, down the list. k = number of stations (and minutes per round).
  emom: (r, ctx, target, k = stations(ctx.n), rounds = null) => {
    const moves = pickMoves(r, ctx, stationPatterns(r, Math.min(8, k), true))
    rounds = rounds || Math.max(2, Math.round(target / moves.length))
    const total = moves.length * rounds
    return {
      key: 'emom',
      title: `EMOM ${total}${ctx.n > 1 ? ', stagger start' : ''}`,
      format: 'EMOM',
      what: 'Every minute on the minute. Do the station\'s work at the top of the minute, rest what\'s left, then move to the next one.',
      group: ctx.n === 1
        ? `Solo: go 1 to ${moves.length}${rounds > 1 ? ` and repeat, ${rounds} times through` : ''}.`
        : `${people(ctx.n)}: stagger start. Each person begins on a different number and moves down one every minute, so one person per station.${rounds > 1 ? ` ${rounds} times through.` : ''}`,
      lines: moves.map((mv, i) => ({ ...line(mv), text: `${i + 1}. ${fmt(mv)}` })),
      minutes: total,
    }
  },

  chipper: (r, ctx, target) => {
    const n = ctx.n
    const moves = pickMoves(r, ctx, ['engine', ...shuffle(r, ['hinge', 'push', 'pull', 'squat', 'core']).slice(0, 4)], 1, (mv) => !mv.unit.startsWith('sec'))
    const cap = Math.min(25, Math.max(12, target))
    const k = n === 1 ? 3 : Math.min(n, 4) * 2.5
    return {
      key: 'chipper',
      title: `${n > 1 ? 'Team chipper' : 'Chipper'}, ${cap} min cap`,
      format: 'Chipper',
      what: 'One long list, done once from top to bottom, for time.',
      group: n === 1
        ? 'Solo: grind through it. Break the reps up however you want.'
        : `${people(n)}: one shared list. Split the reps however you want, but only one person per movement at a time, and finish each line before starting the next. Everyone else rests or helps count.`,
      lines: moves.map((mv) => line(mv, mv.id === 'row' ? Math.round((mv.r * k) / 5) * 5 : scale(mv, k))),
      minutes: cap,
    }
  },
}

// ---------- Block B: everyone together, or in pairs ----------

// Everyone together if the gear allows, else pairs taking turns.
function together(r, ctx, patterns, filter) {
  const before = new Set(ctx.used)
  let moves = pickMoves(r, ctx, patterns, ctx.n, filter)
  if (moves.length === patterns.length) return { moves, pairs: false }
  ctx.used = before
  moves = pickMoves(r, ctx, patterns, Math.ceil(ctx.n / 2), filter)
  return { moves, pairs: ctx.n > 1 }
}

const B_FORMATS = {
  amrap: (r, ctx, budget) => {
    const mins = Math.min(15, budget)
    const { moves, pairs } = together(r, ctx, shuffle(r, ['hinge', 'push', 'pull', 'squat', 'engine', 'core']).slice(0, 3))
    return {
      key: 'amrap',
      title: `AMRAP ${mins}${pairs ? ', you go / I go' : ''}`,
      format: 'AMRAP',
      what: 'As many rounds as you can in the time. Keep a tally. Score is rounds plus leftover reps.',
      group: ctx.n === 1 ? 'Solo: pick a pace you can hold.' : pairs ? `${people(ctx.n)}: pair up. One does a full round while the other rests, then swap.` : `${people(ctx.n)}: everyone goes at once, there\'s enough gear.`,
      lines: moves.map((mv) => line(mv)),
      minutes: mins,
    }
  },

  ladder: (r, ctx, budget) => {
    const mins = Math.min(10, Math.max(5, budget))
    const { moves } = together(r, ctx, shuffle(r, ['hinge', 'push', 'squat', 'pull']).slice(0, 2), (mv) => (mv.unit === 'reps' || mv.unit === 'side') && mv.r <= 12)
    return {
      key: 'ladder',
      title: `Ladder ${mins} min, 1, 2, 3…`,
      format: 'Ladder',
      what: 'One rep of each, then two, then three. Keep climbing until time runs out. Score is the last full rung.',
      group: ctx.n === 1 ? 'Solo: climb without stopping as long as you can.' : `${people(ctx.n)}: pair up, you go / I go. Your rest is your partner\'s rung, so it gets longer as you climb.`,
      lines: moves.map((mv) => ({ text: mv.unit === 'side' ? `${mv.name} (each side)` : mv.name, cue: mv.cue, id: mv.id })),
      minutes: mins,
    }
  },

  twentyone: (r, ctx, budget) => {
    const cap = Math.min(12, Math.max(6, budget))
    const { moves, pairs } = together(r, ctx, shuffle(r, ['hinge', 'push', 'squat', 'engine']).slice(0, 2), (mv) => mv.unit === 'reps' && mv.r <= 15)
    return {
      key: 'twentyone',
      title: `21-15-9 for time, ${cap} min cap`,
      format: '21-15-9',
      what: '21 reps of each, then 15, then 9. Fast, and it should hurt a little.',
      group: ctx.n === 1 ? 'Solo: go.' : pairs ? `${people(ctx.n)}: two heats. Second heat starts when the first finishes, and counts reps for them.` : `${people(ctx.n)}: everyone at once.`,
      lines: moves.map((mv) => ({ text: mv.name, cue: mv.cue, id: mv.id })),
      minutes: cap,
    }
  },

  deathby: (r, ctx, budget) => {
    const cap = Math.min(12, Math.max(6, budget))
    const pool = shuffle(r, ['burpee', 'swing', 'goblet', 'pushup', 'airsq', 'boxersit'].map((id) => MOVE[id]).filter((mv) => !ctx.used.has(mv.id) && fits([mv], ctx.n)))
    const mv = pool[0] || MOVE.burpee
    ctx.used.add(mv.id)
    return {
      key: 'deathby',
      title: `Death by ${mv.name}, ${cap} min cap`,
      format: 'Death by',
      what: 'Minute 1: 1 rep. Minute 2: 2 reps. Keep adding one. You\'re out when you can\'t finish the reps inside the minute.',
      group: ctx.n === 1 ? 'Solo: go until you can\'t.' : `${people(ctx.n)}: everyone at once. Last one standing picks the music next week.`,
      lines: [{ ...line(mv), text: `min 1: 1 ${mv.name}` }, { text: '+1 rep every minute' }],
      minutes: cap,
    }
  },

  getups: (r, ctx, budget) => {
    const mins = Math.min(12, Math.max(6, Math.round(budget / 2) * 2))
    const pool = ['swing', 'altswing', 'goblet', 'kbclean'].map((id) => MOVE[id]).filter((mv) => !ctx.used.has(mv.id))
    const hinge = pickOne(r, pool.length ? pool : [MOVE.swing])
    const each = Math.min(ctx.n, 3) // three bell pairs in the room
    ctx.used.add('tgu')
    ctx.used.add(hinge.id)
    return {
      key: 'getups',
      title: `Getups + hinges, EMOM ${mins}`,
      format: 'EMOM',
      what: 'Odd minutes a getup, even minutes the hinge. Same bell the whole time.',
      group: ctx.n <= 3 ? `${people(ctx.n)}: everyone at once, one bell each.` : `${people(ctx.n)}: ${each} at a time on the bells. The rest hold a :40 plank or beast hold that minute and swap in on the next odd minute.`,
      lines: [{ ...line(MOVE.tgu, 1), text: 'odd: 1 TGU, alt. sides' }, { ...line(hinge), text: `even: ${fmt(hinge)}` }],
      minutes: mins,
    }
  },
}

// ---------- Finishers ----------

const FINISHERS = {
  flow: (r, ctx) => ({
    key: 'flow',
    title: 'Finisher flow, :20 each',
    format: 'Flow',
    what: 'Move from one position to the next without stopping, 20 seconds in each.',
    group: 'Everyone at once, follow whoever knows it best.',
    lines: [{ text: FLOW.join(' → '), cue: 'Loaded beast: beast hold with the hips pushed back to the heels. Crab: hands behind, hips up, chest to the sky.' }],
    minutes: 4,
  }),
  relay: (r, ctx) => {
    if (ctx.n === 1) return { key: 'relay', title: '500m row for time', format: 'For time', what: 'All out, one go.', group: 'Solo: note your time for next week.', lines: [{ text: '500m row', cue: MOVE.row.cue }], minutes: 3 }
    const hold = pickOne(r, ['farmers', 'plank', 'beast', 'hang', 'suitcase'].map((id) => MOVE[id]).filter((mv) => fits([mv], ctx.n - 1)))
    const meters = ctx.n <= 2 ? 1000 : 250 * ctx.n
    return {
      key: 'relay',
      title: `Team relay, ${meters}m row`,
      format: 'Relay',
      what: 'One shared row, passed person to person every 250m. Everyone not rowing works the hold, 30 seconds on and 30 off, until the row is done.',
      group: `${people(ctx.n)}: swap on the rower every 250m. Next person up is whoever just finished a hold.`,
      lines: [{ text: `${meters}m row relay, swap every 250`, cue: MOVE.row.cue }, { text: `everyone else: :30 on / :30 off ${(hold || MOVE.plank).name}`, cue: (hold || MOVE.plank).cue }],
      minutes: Math.ceil(meters / 250),
    }
  },
  carries: (r, ctx) => ({
    key: 'carries',
    title: 'Carry medley, driveway',
    format: 'For time',
    what: 'Out and back on each carry, no rest between them.',
    group: ctx.n <= 3 ? 'Everyone at once, each with their own bells.' : `${people(ctx.n)}: pairs, you go / I go.`,
    lines: ['farmers', 'suitcase', 'rackcarry'].map((id) => line(MOVE[id])),
    minutes: 6,
  }),
  core: (r, ctx) => {
    const ids = shuffle(r, ['hollow', 'deadbug', 'plank', 'sideplank', 'boxersit', 'beast']).slice(0, 3)
    return {
      key: 'core',
      title: 'Core, 2 rds',
      format: 'Rounds',
      what: 'Two rounds, no rest between moves.',
      group: 'Everyone at once on the floor (or the driveway).',
      lines: ids.map((id) => line(MOVE[id])),
      minutes: 5,
    }
  },
}

function warmup(r, ctx) {
  const picks = []
  for (const mv of shuffle(r, WARMUP)) if (picks.length < 4 && fits([...picks, mv], Math.max(1, ctx.n - 1))) picks.push(mv)
  return {
    key: 'warmup',
    title: 'Warmup, 8 min',
    format: 'Warmup',
    what: 'Easy. Get warm and loose, no clock pressure.',
    group: ctx.n === 1
      ? 'Solo: 250m easy row, then 2 rounds of the list.'
      : `${people(ctx.n)}: one person rows an easy 250m while everyone else works the list. When the rower hits 250, the next person hops on.`,
    lines: [{ text: '250m easy row (one at a time)', cue: 'Conversational pace. Just get the blood moving.' }, ...picks.map((mv) => line(mv))],
    minutes: 8,
  }
}

// ---------- The session ----------

export function sundayOf(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7))
  return d
}
export const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function benchmarkFor(d) {
  return BENCHMARKS[(d.getFullYear() * 12 + d.getMonth()) % BENCHMARKS.length]
}

// Session shapes. "Mix" walks a fixed cycle week to week so it never
// repeats back to back; the first Sunday of the month is A + B with the
// benchmark as B.
export const SHAPES = {
  stations: { name: 'Stations', what: 'Your usual: one list of stations, rotate on the clock, the whole way through.' },
  ab: { name: 'A + B', what: 'Two main pieces: a station block, then something everyone does together.' },
  abc: { name: 'A + B + C', what: 'A station block, then two short pieces in different formats.' },
  emom: { name: 'Long EMOM', what: 'One long station-by-minute list, like the kettlebell gym board.' },
  sandwich: { name: 'Sandwich', what: 'EMOM, ladder, a second EMOM, then the ladder again.' },
}
const CYCLE = ['stations', 'sandwich', 'abc', 'emom', 'stations', 'ab', 'abc', 'sandwich']

const weekIndex = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / (7 * 864e5))

export function shapeFor(date, choice = 'mix') {
  if (choice !== 'mix') return choice
  if (date.getDate() <= 7) return 'ab'
  return CYCLE[weekIndex(date) % CYCLE.length]
}

function benchmarkBlock(date, budget) {
  const bm = benchmarkFor(date)
  return {
    key: 'benchmark', title: `Benchmark: ${bm.name}`, format: 'Benchmark',
    what: `This month\'s test. Write your score down and beat it next time it comes around. Score: ${bm.score.toLowerCase()}.`,
    group: bm.note, lines: bm.lines.map((t) => ({ text: t })), minutes: budget, benchmark: true,
  }
}

// Deal B formats into `slots` (minutes each), never repeating a format.
// Each pick has to fill its slot within a few minutes. `prefer` goes first.
function dealB(r, ctx, slots, prefer = null) {
  const keys = shuffle(r, Object.keys(B_FORMATS))
  if (prefer) keys.sort((a, b) => (b === prefer) - (a === prefer))
  const out = []
  for (const slot of slots) {
    for (const key of [...keys]) {
      const snap = new Set(ctx.used)
      const b = B_FORMATS[key](r, ctx, slot)
      if (b.lines.length >= 2 && b.minutes <= slot + 2 && b.minutes >= slot - 4) {
        out.push(b)
        keys.splice(keys.indexOf(key), 1)
        break
      }
      ctx.used = snap
    }
  }
  return out
}

function dealA(r, ctx, target) {
  for (const key of shuffle(r, ['rotation', 'emom', 'chipper'])) {
    const snap = new Set(ctx.used)
    const b = A_FORMATS[key](r, ctx, target)
    if (b.minutes <= target + 8 && b.minutes >= target - 8) return b
    ctx.used = snap
  }
  return A_FORMATS.emom(r, ctx, target)
}

const BUILD = {
  stations: (r, ctx, work) => [A_FORMATS.rotation(r, ctx, work)],

  emom: (r, ctx, work) => {
    // 6 to 8 stations, sized so it's 3 to 5 times through.
    const k = Math.min(8, Math.max(ctx.n, work >= 38 ? 8 : 6))
    return [A_FORMATS.emom(r, ctx, work, k, Math.max(2, Math.round(work / k)))]
  },

  sandwich: (r, ctx, work) => {
    const k = stations(ctx.n)
    const ladder = 5
    const rounds = Math.max(1, Math.round((work - 2 * ladder) / (2 * k)))
    const e1 = A_FORMATS.emom(r, ctx, 0, k, rounds)
    const [l] = dealB(r, ctx, [ladder], 'ladder')
    const e2 = A_FORMATS.emom(r, ctx, 0, k, rounds)
    const again = l && { ...l, key: `${l.key}-again`, title: `Repeat the ${l.format.toLowerCase()}`, what: `Same as before, from the top. Try to beat your first go. ${l.what}` }
    return l ? [e1, l, e2, again] : [e1, e2]
  },

  ab: (r, ctx, work, date) => {
    const bench = date.getDate() <= 7
    const A = dealA(r, ctx, Math.round(work * (bench ? 0.45 : 0.6)))
    const left = Math.max(6, work - A.minutes)
    return [A, bench ? benchmarkBlock(date, left) : dealB(r, ctx, [Math.min(15, left)])[0]].filter(Boolean)
  },

  abc: (r, ctx, work) => {
    const A = dealA(r, ctx, Math.round(work * 0.5))
    const left = Math.max(12, work - A.minutes)
    const first = Math.round(left / 2)
    return [A, ...dealB(r, ctx, [first, left - first])]
  },
}

export function generate({ date, n, minutes, roll = 0, shape = 'mix' }) {
  const s = shapeFor(date, shape)
  const r = rng(`${isoDay(date)}|${n}|${minutes}|${roll}|${s}`)
  const ctx = { n, used: new Set() }
  const fin = minutes >= 60 ? 6 : 5
  const work = minutes - 8 - fin - 3 // 3 min for water and moving gear
  const main = BUILD[s](r, ctx, work, date)
  const blocks = [warmup(r, ctx), ...main]

  const usesRower = main.some((b) => b.key === 'rotation')
  const finKey = pickOne(r, Object.keys(FINISHERS).filter((k) => !(k === 'relay' && usesRower)))
  blocks.push(FINISHERS[finKey](r, ctx))
  blocks.slice(1).forEach((b, i) => (b.label = 'ABCDEFG'[i]))

  return { shape: s, blocks, total: blocks.reduce((t, b) => t + b.minutes, 0) + 3 }
}

// The board as plain text, for copying.
export function boardText(date, blocks) {
  const head = `SUNDAY SESH ${date.getMonth() + 1}/${date.getDate()}`
  const body = blocks.map((b) => [`${b.label ? `${b.label}. ` : ''}${b.title}`.toUpperCase(), ...b.lines.map((l) => `  ${l.text}`)].join('\n'))
  return [head, ...body].join('\n\n')
}
