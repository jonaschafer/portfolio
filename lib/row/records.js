// PRs for /row. Strava only tracks running and riding bests, so these come from
// each workout's distance/time stream: the fastest stretch of a set distance
// anywhere inside a row (a 2k PR can come from the middle of a 20:00 piece),
// and the farthest stretch in a set time. Pure functions, used by the page and
// by the Strava sync that sends PR notifications.

export const DISTANCES = [
  { key: 'd500', label: '500m', m: 500 },
  { key: 'd1000', label: '1k', m: 1000 },
  { key: 'd2000', label: '2k', m: 2000 },
  { key: 'd5000', label: '5k', m: 5000 },
  { key: 'd6000', label: '6k', m: 6000 },
  { key: 'd10000', label: '10k', m: 10000 },
]

export const TIMES = [
  { key: 't60', label: '1 min', s: 60 },
  { key: 't240', label: '4 min', s: 240 },
  { key: 't600', label: '10 min', s: 600 },
  { key: 't1200', label: '20 min', s: 1200 },
  { key: 't1800', label: '30 min', s: 1800 },
  { key: 't3600', label: '60 min', s: 3600 },
]

// Distance per stroke only means something over a real piece, so skip warmups.
const MPS_MIN_SECONDS = 300

// Interpolate y at x along a monotonic x series, between indexes i and i + 1.
const lerp = (xs, ys, i, x) => {
  const x0 = xs[i], x1 = xs[i + 1]
  if (x1 === x0) return ys[i]
  return ys[i] + ((x - x0) / (x1 - x0)) * (ys[i + 1] - ys[i])
}

// Fastest time over `m` meters anywhere in the stream, or null if the row was shorter.
export function bestTime({ t = [], d = [] }, m) {
  if (!d.length || d[d.length - 1] - d[0] < m) return null
  let best = Infinity
  let i = 0
  for (let j = 1; j < d.length; j++) {
    const target = d[j] - m
    if (target < d[0]) continue
    while (i + 1 < j && d[i + 1] <= target) i++
    best = Math.min(best, t[j] - lerp(d, t, i, target))
  }
  return Number.isFinite(best) ? best : null
}

// Farthest distance covered in `s` seconds anywhere in the stream.
export function bestDistance({ t = [], d = [] }, s) {
  if (!t.length || t[t.length - 1] - t[0] < s) return null
  let best = -Infinity
  let i = 0
  for (let j = 1; j < t.length; j++) {
    const target = t[j] - s
    if (target < t[0]) continue
    while (i + 1 < j && t[i + 1] <= target) i++
    best = Math.max(best, d[j] - lerp(t, d, i, target))
  }
  return Number.isFinite(best) ? best : null
}

export const strokes = (w) => (w.avg_spm ? (w.avg_spm * w.moving_time) / 60 : null)
export const metersPerStroke = (w) => {
  const n = strokes(w)
  return n ? w.distance / n : null
}

// Every record one workout puts up, before comparing it to anything.
export function efforts(w) {
  const out = []
  for (const r of DISTANCES) {
    // A row that is exactly the distance uses the monitor's own time.
    const v = Math.abs(w.distance - r.m) < 1 ? w.moving_time : bestTime(w.stream || {}, r.m)
    if (v) out.push({ key: r.key, label: r.label, kind: 'time', value: v, meters: r.m })
  }
  for (const r of TIMES) {
    const v = Math.abs(w.moving_time - r.s) < 1 ? w.distance : bestDistance(w.stream || {}, r.s)
    if (v) out.push({ key: r.key, label: r.label, kind: 'distance', value: v, seconds: r.s })
  }
  out.push({ key: 'longest', label: 'Longest row', kind: 'distance', value: w.distance })
  const mps = w.moving_time >= MPS_MIN_SECONDS ? metersPerStroke(w) : null
  if (mps) out.push({ key: 'mps', label: 'Meters per stroke', kind: 'per-stroke', value: mps })
  return out
}

const better = (e, prev) => (e.kind === 'time' ? e.value < prev.value - 0.05 : e.value > prev.value + 0.05)

// Walks the workouts oldest first, ranking every effort against everything
// before it the way Strava does: 1 is a PR, 2 and 3 are the next best ever at
// the time. Returns each workout's top-3 efforts and the standing record for
// every key. A PR carries the best it beat (`prev`); a 2nd or 3rd carries the
// PR it fell short of (`best`).
export function computeRecords(workouts) {
  const ordered = [...workouts].sort((a, b) => String(a.start_local).localeCompare(String(b.start_local)))
  const bests = {}
  const seen = {} // every earlier effort per key
  const byId = {}
  for (const w of ordered) {
    byId[w.id] = []
    for (const e of efforts(w)) {
      const earlier = seen[e.key] || (seen[e.key] = [])
      const prev = bests[e.key]
      let rank = 1 + earlier.filter((x) => better({ ...e, value: x.value }, e)).length
      if (rank === 1 && prev && !better(e, prev)) rank = 2 // a tie doesn't take the PR
      const rec = { ...e, rank, id: w.id, start_local: w.start_local }
      if (rank === 1) {
        rec.prev = prev ? { value: prev.value, id: prev.id, start_local: prev.start_local } : null
        bests[e.key] = rec
      } else {
        rec.best = { value: prev.value, id: prev.id, start_local: prev.start_local }
      }
      if (rank <= 3) byId[w.id].push(rec)
      earlier.push({ value: e.value, id: w.id })
    }
  }
  return { bests, byId }
}

// ---- Formatting ----

// 680 -> "11:20.0", 3725.4 -> "1:02:05.4"
export function fmtTime(sec) {
  if (sec == null) return '–'
  const tenths = Math.round(sec * 10)
  const h = Math.floor(tenths / 36000)
  const m = Math.floor((tenths % 36000) / 600)
  const s = ((tenths % 600) / 10).toFixed(1).padStart(4, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

// Seconds per 500m, the erg's native pace.
export const pace = (seconds, meters) => (meters ? (seconds / meters) * 500 : null)
export const fmtPace = (seconds, meters) => fmtTime(pace(seconds, meters))

export const fmtMeters = (m) => `${Math.round(m).toLocaleString('en-US')}m`

export function fmtRecord(r) {
  if (r.kind === 'time') return fmtTime(r.value)
  if (r.kind === 'per-stroke') return `${r.value.toFixed(2)}m`
  return fmtMeters(r.value)
}

// The pace that record implies, as a second line under the value.
export function recordPace(r) {
  if (r.kind === 'time') return `${fmtPace(r.value, r.meters)} /500m`
  if (r.seconds) return `${fmtPace(r.seconds, r.value)} /500m`
  return null
}

// Against the old best for a PR ("-0:32.7" faster, "+38m" farther), or how
// far off the PR a 2nd or 3rd was ("+0:03.1", "-12m").
export function fmtGain(r) {
  const ref = r.rank > 1 ? r.best : r.prev
  if (!ref) return null
  const diff = r.value - ref.value
  if (r.rank > 1) {
    if (r.kind === 'time') return `+${fmtTime(Math.abs(diff))}`
    if (r.kind === 'per-stroke') return `-${Math.abs(diff).toFixed(2)}m`
    return `-${Math.round(Math.abs(diff))}m`
  }
  if (r.kind === 'time') return `-${fmtTime(Math.abs(diff))}`
  if (r.kind === 'per-stroke') return `+${diff.toFixed(2)}m`
  return `+${Math.round(diff)}m`
}
