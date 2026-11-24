// The whole model: each person has a cadence (every_days). The last hang on or
// before today sets the clock; a hang dated in the future is a plan, which
// quiets the reminder until it happens and then becomes the new last hang.

import { select } from './db'
import { addDays, daysBetween, pdxDay, pdxTime, weekday } from './time'
import { busyBetween } from './calendar'
import { fitsWeek } from './week'

// The idea used longest ago (or never) comes up next, so suggestions rotate.
function nextIdea(person, hangs) {
  const ideas = person.ideas || []
  if (!ideas.length) return null
  const lastUsed = (idea) => {
    const h = hangs.filter((x) => x.what === idea).map((x) => x.day).sort().pop()
    return h || ''
  }
  return [...ideas].sort((a, b) => lastUsed(a).localeCompare(lastUsed(b)))[0]
}

export function status(person, hangs, invites = [], today = pdxDay()) {
  const mine = hangs.filter((h) => h.person_id === person.id).sort((a, b) => b.day.localeCompare(a.day))
  const past = mine.filter((h) => h.day <= today)
  const upcoming = mine.filter((h) => h.day > today).sort((a, b) => a.day.localeCompare(b.day))[0] || null
  const last = past[0]?.day || null
  const since = last ? daysBetween(last, today) : null
  const snoozed = person.snoozed_until && person.snoozed_until > today
  const ratio = since === null ? 1 : since / person.every_days
  const open = invites.filter((i) => i.person_id === person.id && i.status === 'open')
  // An ask that's out quiets the reminder for two weeks; after that, nudge again.
  const waiting = open.some((i) => !i.created_at || daysBetween(pdxDay(new Date(i.created_at)), today) < 14)
  const due = !upcoming && !snoozed && !waiting && ratio >= 1
  const idea = nextIdea(person, mine)
  return { last, since, upcoming, snoozed, waiting, ratio, due, idea, hangs: mine.slice(0, 6), invites: open }
}

export { nudgeLine, pushLine } from './words'

export async function loadAll() {
  const [people, hangs, invites] = await Promise.all([select('orbit_people'), select('orbit_hangs'), select('orbit_invites')])
  const today = pdxDay()
  const rows = people
    .map((p) => ({ ...p, status: status(p, hangs, invites, today) }))
    .sort((a, b) => {
      // Due first (most overdue on top), then asks that are out, then plans, then everyone else.
      const rank = (p) => (p.status.due ? 0 : p.status.waiting ? 1 : p.status.upcoming ? 2 : 3)
      return rank(a) - rank(b) || b.status.ratio - a.status.ratio || a.sort - b.sort
    })
  return { people: rows, today }
}

// Candidate times over the next three weeks: each of the person's windows on
// each matching day, minus Jon's week rules (week.js) and anything on his
// calendar padded by the drive, at most one per day.
export async function proposeSlots(person, { days = 21, max = 8 } = {}) {
  const windows = person.windows?.length
    ? person.windows
    : [
        { days: [2, 3, 4], start: '18:00', mins: 120 },
        { days: [6], start: '10:00', mins: 120 },
      ]
  const today = pdxDay()
  const from = pdxTime(addDays(today, 1), '00:00')
  const to = pdxTime(addDays(today, days + 1), '00:00')
  const busy = await busyBetween(from, to).catch(() => [])
  const slots = []
  for (let i = 1; i <= days && slots.length < max; i++) {
    const day = addDays(today, i)
    // Rotate which window gets first dibs so the offer mixes mornings and evenings.
    const fits = windows.filter((w) => w.days.includes(weekday(day)))
    const k = slots.length % Math.max(1, fits.length)
    const travel = (person.travel_mins ?? 15) * 60000
    for (const w of [...fits.slice(k), ...fits.slice(0, k)]) {
      const [h, m] = w.start.split(':').map(Number)
      if (!fitsWeek(weekday(day), h * 60 + m, w.mins, person.travel_mins ?? 15)) continue
      const start = pdxTime(day, w.start)
      const end = new Date(start.getTime() + w.mins * 60000)
      // Getting there and back counts as busy too.
      const clash = busy.some(([s, e]) => s < end.getTime() + travel && e > start.getTime() - travel)
      if (!clash) {
        slots.push({ start: start.toISOString(), end: end.toISOString() })
        break
      }
    }
  }
  return slots
}

export async function push({ title, message, click, actions }) {
  const topic = process.env.ORBIT_NTFY_TOPIC || process.env.ROW_NTFY_TOPIC
  if (!topic) return
  const res = await fetch('https://ntfy.sh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, title, message, click, actions, tags: ['wave'] }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`ntfy ${res.status}`)
}

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jonschafer.com'
