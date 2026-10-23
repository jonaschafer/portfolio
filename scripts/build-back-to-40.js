// Builds public/dana-plan/plan-data-v15.json, the "Back to 40" plan: running
// rebuilt from MMA jaw surgery (Oct 2, 2026) to 40 mi/week, with rows and two
// lift days. Edit the tables below and rerun `node scripts/build-back-to-40.js`,
// or edit the JSON directly. The viewer at /dana-plan-v2 only reads the JSON.

const fs = require('fs')
const path = require('path')

const START = '2026-10-26' // Monday of week 1
const SURGERY = '2026-10-02'

// Phases: what changes block to block.
const PHASES = [
  {
    name: 'Re-entry',
    weeks: [1, 4],
    note:
      'Cleared for exercise, so this block is about ramping, not permission. Flat, soft, conversational running. Rows stay steady while the running restarts. Lifts at about 60% of normal, RPE 6, exhale through every rep and keep the jaw loose. Still blowing the nose softly, so no breath holds or bearing down on anything.',
  },
  {
    name: 'Rebuild',
    weeks: [5, 8],
    note:
      'A fourth run comes in and gentle hills come back. Row intervals start on Wednesday. Lifts go back toward normal loads at RPE 7. Smooth trail only, nothing technical yet: a fall on the face is the one thing this plan can’t absorb.',
  },
  {
    name: 'Build',
    weeks: [9, 12],
    note:
      'Trail and vert are back. Tuesday group runs return. Rows drop to two, one steady and one hard, and stop replacing easy miles. Lower body heavy day stays at least 72 hours before the long run.',
  },
  {
    name: 'Arrive',
    weeks: [13, 16],
    note:
      'Back to the old week: Tuesday through Friday plus Sunday, with Monday’s row as the only erg day. 40 by week 15, then hold it. Lifts move to maintenance: fewer sets, same weight.',
  },
]

// Miles per run day, by week. Sat stays rest.
// [Tue, Wed, Thu, Fri, Sun]
const RUNS = {
  1: [2, 0, 2, 0, 2],
  2: [3, 0, 3, 0, 3],
  3: [3, 0, 4, 0, 5],
  4: [3, 0, 3, 0, 4],
  5: [4, 0, 4, 2, 5],
  6: [5, 0, 4, 3, 6],
  7: [5, 0, 5, 3, 8],
  8: [4, 0, 4, 2, 7],
  9: [6, 3, 5, 0, 10],
  10: [7, 4, 6, 0, 11],
  11: [8, 4, 7, 0, 13],
  12: [6, 3, 6, 0, 11],
  13: [8, 5, 7, 0, 14],
  14: [8, 5, 8, 3, 13],
  15: [9, 5, 9, 4, 13],
  16: [9, 5, 9, 4, 13],
}
const DOWN_WEEKS = [4, 8, 12]

// Feet of climbing per mile, by phase and run type.
const VERT = { 1: { easy: 30, long: 30 }, 2: { easy: 60, long: 90 }, 3: { easy: 80, long: 120 }, 4: { easy: 100, long: 150 } }

const phaseOf = (w) => PHASES.findIndex((p) => w >= p.weeks[0] && w <= p.weeks[1]) + 1
const round50 = (n) => Math.round(n / 50) * 50
const vertFor = (w, mi, kind) => round50(mi * VERT[phaseOf(w)][kind])

// ---------- Runs ----------

function runDay(w, day, mi) {
  const p = phaseOf(w)
  const long = day === 'Sunday'
  const v = vertFor(w, mi, long ? 'long' : 'easy')
  const one = `${mi} miles, ~${v.toLocaleString()} ft`
  let title = 'Easy run'
  let body = ''
  if (p === 1) {
    title = long ? 'Longest run of the week' : 'Easy run'
    body =
      w === 1
        ? `**Run:** ${one}. Flat and soft, a park loop or the waterfront. Run 4 min, walk 1 min if the knee says anything. Conversational pace, which will feel too slow. That’s right.`
        : `**Run:** ${one}. Flat, soft surface, conversational pace. Stop and walk home if the right knee goes from stiff to sharp.`
  } else if (p === 2) {
    if (day === 'Tuesday') {
      title = 'Easy run + strides'
      body = `**Run:** ${one}. Easy, gentle rolling roads or smooth gravel. Finish with 4 × 20s relaxed strides, full walk back.`
    } else if (day === 'Thursday') {
      title = 'Rolling hills'
      body = `**Run:** ${one}. Gentle hills at easy effort, powerhike anything steep. Short steps on the downs to keep the quad happy.`
    } else if (day === 'Friday') {
      title = 'Shakeout'
      body = `**Run:** ${one}. Very easy, flat. Fine to swap for a 25 min steady row if the legs are cooked.`
    } else {
      title = 'Long run'
      body = `**Run:** ${one}. Easy the whole way, smooth trail or road. Practice eating on the run again: a gel or chews every 40 min once this goes past an hour.`
    }
  } else {
    if (day === 'Tuesday') {
      title = w >= 9 ? 'TTT group run' : 'Easy run'
      body = `**Run:** ${one}. Tuesday crew is back. Keep it conversational on the climbs and let the group go if they push.`
    } else if (day === 'Wednesday') {
      title = 'Recovery run'
      body = `**Run:** ${one}. Flat and slow, the day after Tuesday. This is the first run to cut if anything aches.`
    } else if (day === 'Thursday') {
      title = DOWN_WEEKS.includes(w) ? 'Easy hills' : 'BPA hills'
      body = DOWN_WEEKS.includes(w)
        ? `**Run:** ${one}. Down week. Easy rolling hills, no repeats.`
        : `**Run:** ${one}. Hill session: ${w >= 13 ? '6 to 8' : '4 to 6'} × 2 to 3 min climbs at a strong, relaxed effort, jog down. Powerhike the steep stuff.`
    } else if (day === 'Friday') {
      title = 'Shakeout'
      body = `**Run:** ${one}. Very easy, flat. The day before rest, two days before the long run.`
    } else {
      title = 'Long trail run'
      body = `**Run:** ${one}. Trail, easy effort, real vert. Fuel every 40 min and carry water.`
    }
  }
  return { title, body, one, mi, v }
}

// ---------- Rows ----------
// Pace = rate × meters per stroke. Steady pieces live at 20 spm and the number
// to watch is meters per stroke. Intervals at 24 to 28. 2k checks every 4 weeks.

const ROW = {
  steady: (min) => ({
    title: `Steady row, ${min} min`,
    one: `${min} min steady @ 20 spm`,
    body: `**Row:** ${min} min steady at 20 spm, conversational effort. Watch meters per stroke (9.16 on Oct 22) and pace will follow. Jaw loose at the catch, no gritting on the drive, sit tall instead of leaning back past 11 o’clock (that lean is the sore mid back).`,
  }),
  ladder: {
    title: 'Rate ladder row',
    one: '3 × (5 min @ 18 / 20 / 22 spm)',
    body: `**Row:** 3 rounds of 5 min at 18, 5 min at 20, 5 min at 22 spm, no rest. Same easy effort, just a faster rhythm. The goal is keeping meters per stroke as the rate climbs.`,
  },
  check2k: (cleared) => ({
    title: cleared ? '2k test' : '2k check',
    one: cleared ? '2k test @ 26 to 30 spm' : '2k controlled @ 24 spm',
    body: cleared
      ? `**Row:** 10 min easy, 3 × 10 strokes building, 3 min easy, then 2k all out. Rate 26 to 30. Go out at goal pace, not faster. Compare to Oct 20 (11:20.0 at 20.7 spm). Exhale hard on every drive, no breath holds. Log it on /row.`
      : `**Row:** 2k at a locked 24 spm, hard but still controlled, nose breathing if you can. Not all out until the surgeon clears it. Compare to Oct 20 (11:20.0 at 20.7 spm). Log it on /row.`,
  }),
  intervals4: (n) => ({
    title: `Row intervals, ${n} × 4 min`,
    one: `${n} × 4 min @ 24 to 26 spm, 2 min easy`,
    body: `**Row:** 10 min easy, then ${n} × 4 min at 24 to 26 spm, 2 min easy between. Threshold effort, about 2k pace + 10s. Exhale on the drive, never hold the breath.`,
  }),
  intervals6: (n) => ({
    title: `Row intervals, ${n} × 6 min`,
    one: `${n} × 6 min @ 24 spm, 2 min easy`,
    body: `**Row:** 10 min easy, then ${n} × 6 min at 24 spm, 2 min easy between. Steady-hard, same split every rep.`,
  }),
  minutes: {
    title: 'Row 1 on, 1 off',
    one: '10 × 1 min @ 26 to 28 spm, 1 min easy',
    body: `**Row:** 10 min easy, then 10 × 1 min at 26 to 28 spm with 1 min easy paddle. Fast and long, not frantic. Keeps the top end without beating up the legs.`,
  },
}

// ---------- Lifts ----------
// Heavy A (Tue): hinge + pull. Heavy B (Thu): squat + single leg.
// Loads come from lifts.json (deadlift 1RM 197, back squat 180).

const LIFTS = {
  1: {
    A: [
      'RDL, 3 × 8 @ 75 to 95 lb',
      'Chest-supported DB row, 3 × 10 @ 25 to 30 lb',
      '45° back extension, 2 × 12, bodyweight',
      'Hammer curl, 2 × 12 @ 20 lb',
      'Farmer carry, 3 × 40 m @ 35 lb each hand',
      'Dead bug, 2 × 8 per side',
    ],
    B: [
      'Goblet squat, 3 × 10 @ 35 lb',
      'SL RDL, 3 × 8 per side @ 25 lb',
      'Step-downs, 3 × 10 per side, bodyweight',
      'KB swing, 3 × 12 @ 35 lb',
      'Dead hang, 3 × 20 s',
      'Pallof press, 2 × 10 per side',
    ],
  },
  2: {
    A: [
      'Deadlift, 4 × 5 @ 115 to 135 lb (60 to 70%)',
      'Chest-supported DB row, 4 × 8 @ 35 lb',
      '45° back extension, 3 × 12 holding a 10 lb plate',
      'Hammer curl, 3 × 10 @ 25 lb',
      'Farmer carry, 3 × 40 m @ 44 lb each hand',
      'Dead bug, 3 × 8 per side',
    ],
    B: [
      'Back squat, 4 × 6 @ 110 to 125 lb (60 to 70%)',
      'SL RDL, 3 × 8 per side @ 35 lb',
      'Step-downs, 3 × 10 per side @ 35 lb',
      'KB swing, 3 × 15 @ 44 lb',
      'Dead hang, 3 × 30 s',
      'Pallof press, 3 × 10 per side',
    ],
  },
  3: {
    A: [
      'Deadlift, 4 × 5 @ 135 to 145 lb (70 to 75%)',
      'Chest-supported DB row, 4 × 8 @ 40 lb',
      '45° back extension, 3 × 12 holding a 25 lb plate',
      'Hammer curl, 3 × 10 @ 25 lb',
      'Farmer carry, 4 × 40 m @ 53 lb each hand',
      'Dead bug, 3 × 10 per side',
    ],
    B: [
      'Back squat, 4 × 5 @ 125 to 135 lb (70 to 75%)',
      'SL RDL, 3 × 8 per side @ 44 lb',
      'Step-downs, 3 × 10 per side @ 35 lb',
      'KB swing, 3 × 15 @ 53 lb',
      'Dead hang, 3 × 40 s',
      'Pallof press, 3 × 12 per side',
    ],
  },
  4: {
    A: [
      'Deadlift, 3 × 5 @ 145 to 155 lb (75 to 80%)',
      'Chest-supported DB row, 3 × 8 @ 40 lb',
      '45° back extension, 3 × 12 holding a 25 lb plate',
      'Hammer curl, 2 × 10 @ 25 lb',
      'Farmer carry, 3 × 40 m @ 53 lb each hand',
      'Dead bug, 3 × 10 per side',
    ],
    B: [
      'Back squat, 3 × 5 @ 135 to 145 lb (75 to 80%)',
      'SL RDL, 3 × 8 per side @ 44 lb',
      'Step-downs, 2 × 10 per side @ 35 lb',
      'KB swing, 3 × 15 @ 53 lb',
      'Dead hang, 3 × 45 s',
      'Pallof press, 3 × 12 per side',
    ],
  },
}

const LIFT_RULES = {
  1: 'RPE 6, two reps left in every set. Exhale on the way up, no breath holds or bracing grinds, jaw relaxed and teeth apart.',
  2: 'RPE 7. Breathe out through the hard part of each rep. Still no maxes and no grinding.',
  3: 'RPE 7 to 8. Down weeks: drop one set from everything.',
  4: 'Maintenance. Same weights, fewer sets, so the running gets the recovery.',
}

function liftBlock(w, which) {
  const p = phaseOf(w)
  let moves = LIFTS[p][which]
  if (DOWN_WEEKS.includes(w)) moves = moves.map((m) => m.replace(/^(.*?), (\d) ×/, (_, a, n) => `${a}, ${Math.max(2, n - 1)} ×`))
  const name = which === 'A' ? 'Heavy A (hinge + pull)' : 'Heavy B (squat + single leg)'
  return {
    one: which === 'A' ? 'Heavy A: hinge + pull' : 'Heavy B: squat + single leg',
    body: `**${name}:** after the run, or later the same day.\n${moves.map((m) => `- ${m}`).join('\n')}\n${LIFT_RULES[p]}`,
  }
}

// ---------- PT ----------
// His current PT, on the days without a lift.

const PT = `**PT, 15 min:**
- Step-downs, 2 × 10 per side
- Wall sit, 3 × 45 to 60 s
- SL glute bridge, 2 × 12 per side`

// ---------- Weeks ----------

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return dt
}
function range(w) {
  const a = addDays(START, (w - 1) * 7)
  const b = addDays(START, (w - 1) * 7 + 6)
  return a.getMonth() === b.getMonth()
    ? `${MON[a.getMonth()]} ${a.getDate()}-${b.getDate()}`
    : `${MON[a.getMonth()]} ${a.getDate()}-${MON[b.getMonth()]} ${b.getDate()}`
}
function postOpWeek(w) {
  const [y, m, d] = SURGERY.split('-').map(Number)
  const ms = addDays(START, (w - 1) * 7) - new Date(y, m - 1, d)
  return Math.floor(ms / (7 * 864e5)) + 1
}

// Which row goes where, by week. Keys are day names.
function rowsFor(w) {
  const p = phaseOf(w)
  if (p === 1) return { Wednesday: ROW.steady(20 + 5 * (w - 1 > 2 ? 2 : w - 1)), Friday: w === 4 ? ROW.check2k(true) : w === 2 ? ROW.ladder : ROW.steady(25 + 5 * Math.min(w - 1, 2)), Monday: w >= 3 ? ROW.steady(20) : null }
  if (p === 2) return { Monday: ROW.steady(30), Wednesday: w === 8 ? ROW.check2k(true) : w === 5 ? ROW.intervals4(4) : w === 6 ? ROW.intervals4(5) : ROW.intervals6(3) }
  if (p === 3) return { Monday: ROW.steady(w === 12 ? 30 : 35), Friday: w === 12 ? ROW.check2k(true) : w === 10 ? ROW.intervals6(4) : ROW.minutes }
  return { Monday: w === 16 ? ROW.check2k(true) : w === 14 ? ROW.intervals6(4) : ROW.steady(w === 15 ? 30 : 40) }
}

function buildWeek(w) {
  const p = phaseOf(w)
  const phase = PHASES[p - 1]
  const [tue, wed, thu, fri, sun] = RUNS[w]
  const miles = { Tuesday: tue, Wednesday: wed, Thursday: thu, Friday: fri, Sunday: sun }
  const rows = rowsFor(w)
  let totalMi = 0
  let totalV = 0
  let rowCount = 0

  const days = DAYS.map((day) => {
    const parts = []
    const titles = []
    const summary = {}
    const mi = miles[day] || 0
    if (mi) {
      const r = runDay(w, day, mi)
      parts.push(r.body)
      titles.push(r.title)
      summary.distance = `${mi} miles`
      summary.vert = `${r.v.toLocaleString()} ft`
      summary.runOneLine = r.one
      totalMi += mi
      totalV += r.v
    }
    const row = rows[day]
    if (row) {
      parts.push(row.body)
      titles.push(row.title)
      summary.rowOneLine = row.one
      rowCount++
    }
    if (day === 'Tuesday' || day === 'Thursday') {
      const l = liftBlock(w, day === 'Tuesday' ? 'A' : 'B')
      parts.push(l.body)
      titles.push(day === 'Tuesday' ? 'Heavy A' : 'Heavy B')
      summary.strengthOneLine = l.one
    } else if (day !== 'Saturday' && day !== 'Sunday') {
      parts.push(PT)
      summary.ptOneLine = 'PT, 15 min'
    }
    if (day === 'Saturday') {
      titles.push('Rest')
      parts.push('Rest. Walk Sadie if you want to move.')
    }
    if (day === 'Monday' && !row) {
      titles.unshift('Rest + PT')
      parts.unshift('Rest from running and rowing. PT only.')
    }
    return { day, title: titles.join(' + '), content: parts.join('\n\n'), summary }
  })

  const down = DOWN_WEEKS.includes(w)
  const type = down ? `${phase.name.toUpperCase()} · DOWN` : phase.name.toUpperCase()
  const notes = [
    `**Week ${postOpWeek(w)} after surgery.** ${w === phase.weeks[0] ? phase.note : ''}`.trim(),
    down ? 'Down week: about 20% less running so the last three weeks soak in. Every fourth week, no exceptions.' : '',
    w === 4 ? 'First 2k test on Friday, four weeks after the Oct 20 row.' : '',
    w === 5 ? 'Thanksgiving Thursday. Run in the morning, lift Friday if the day gets eaten.' : '',
    w === 9 ? 'Christmas week. The Wednesday run is the one to drop.' : '',
    w === 15 ? 'First 40 mile week. If the knee is quiet, this is the new normal. Hold it next week before thinking about more.' : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  return {
    week: w,
    dateRange: range(w),
    type,
    target: `${Math.round(totalMi)} miles, ${totalV.toLocaleString()} ft · ${rowCount} row${rowCount === 1 ? '' : 's'} · 2 lifts`,
    content: notes,
    days,
  }
}

const weeks = Object.keys(RUNS).map((w) => buildWeek(Number(w)))
const plan = {
  planTitle: 'Back to 40',
  planDates: 'Oct 26, 2026 to Feb 14, 2027',
  startDate: START,
  raceDate: '2027-02-14',
  goal: '40 miles a week',
  statement: 'Rebuilding to 40 miles a week after jaw surgery, back to running Tuesday through Friday and Sunday, with the erg and two lift days carrying the fitness while my legs catch up.',
  // The lifts view reads this; the days carry the same moves.
  liftPhases: PHASES.map((p, i) => ({
    name: p.name,
    weeks: p.weeks,
    rule: LIFT_RULES[i + 1],
    sessions: [
      { name: 'Heavy A', focus: 'Hinge + pull', day: 'Tuesday', moves: LIFTS[i + 1].A },
      { name: 'Heavy B', focus: 'Squat + single leg', day: 'Thursday', moves: LIFTS[i + 1].B },
    ],
  })),
  weeks,
}

const out = path.join(__dirname, '..', 'public', 'dana-plan', 'plan-data-v15.json')
fs.writeFileSync(out, JSON.stringify(plan, null, 2) + '\n')
console.log(`Wrote ${out}`)
weeks.forEach((w) => console.log(`W${w.week} ${w.dateRange.padEnd(14)} ${w.type.padEnd(16)} ${w.target}`))
