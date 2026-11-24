// Jon's week, the stuff no calendar holds. Everything else (practices, Girl
// Scouts, Skyhook, travel) comes from Google Calendar.
//
// Weekdays: kids head out 7:30 to 8:20, so Jon can leave the house from 7:45.
// That makes 8am work for anywhere within about 15 minutes (Old Friends,
// Coquine). Work is 9 to 5, but he can scoot at 4:30.

const WEEKDAY = [1, 2, 3, 4, 5]
export const RULES = {
  leaveAfter: { days: WEEKDAY, at: '07:45' },
  blocked: [{ days: WEEKDAY, from: '09:00', to: '16:30', why: 'work' }],
}

const mins = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Does a slot (in Portland minutes since midnight) fit the week?
export function fitsWeek(dow, startMin, lengthMin, travel) {
  const { leaveAfter, blocked } = RULES
  if (leaveAfter.days.includes(dow) && startMin - travel < mins(leaveAfter.at)) return false
  const end = startMin + lengthMin
  return !blocked.some((b) => b.days.includes(dow) && startMin < mins(b.to) && end > mins(b.from))
}

// "Mon-Fri 8am 45m" lines <-> windows, for editing by hand.
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function time12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''}${suffix}`
}

export function windowsToText(windows = []) {
  return windows
    .map((w) => {
      const d = [...w.days].sort((a, b) => a - b)
      const run = d.length > 2 && d.every((x, i) => i === 0 || x === d[i - 1] + 1)
      const days = run ? `${NAMES[d[0]]}-${NAMES[d[d.length - 1]]}` : d.map((x) => NAMES[x]).join(' ')
      const len = w.mins % 30 ? `${w.mins}m` : `${w.mins / 60}h`
      return `${days} ${time12(w.start)} ${len}`
    })
    .join('\n')
}

export function textToWindows(text) {
  const out = []
  for (const line of text.split('\n').map((l) => l.trim().toLowerCase()).filter(Boolean)) {
    const days = new Set()
    for (const m of line.matchAll(/\b(sun|mon|tue|wed|thu|fri|sat)[a-z]*(?:\s*-\s*(sun|mon|tue|wed|thu|fri|sat)[a-z]*)?/g)) {
      const a = DAYS.indexOf(m[1])
      const b = m[2] ? DAYS.indexOf(m[2]) : a
      for (let i = a; ; i = (i + 1) % 7) {
        days.add(i)
        if (i === b) break
      }
    }
    const t = line.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b(?!\s*[mh]\b)/)
    if (!days.size || !t) continue
    let h = Number(t[1])
    if (t[3] === 'pm' && h < 12) h += 12
    if (t[3] === 'am' && h === 12) h = 0
    const len = line.match(/(\d+(?:\.\d+)?)\s*(h|m)\b/)
    const length = len ? Math.round(Number(len[1]) * (len[2] === 'h' ? 60 : 1)) : 120
    out.push({ days: [...days].sort((a, b) => a - b), start: `${String(h).padStart(2, '0')}:${t[2] || '00'}`, mins: length })
  }
  return out
}
