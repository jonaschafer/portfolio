// Everything in /orbit happens in Portland time, while the server runs in UTC.

export const TZ = 'America/Los_Angeles'

// YYYY-MM-DD for a Date, in Portland.
export const pdxDay = (d = new Date()) => new Date(d).toLocaleDateString('en-CA', { timeZone: TZ })

// Minutes Portland is behind UTC at a given instant (480 or 420).
function offsetMinutes(at, tz = TZ) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value])
  )
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute)
  return Math.round((at.getTime() - asUtc) / 60000)
}

// A Portland wall time ("2026-12-04", "08:00") as a real instant.
export function pdxTime(day, hhmm, tz = TZ) {
  const [y, m, d] = day.split('-').map(Number)
  const [h, min] = hhmm.split(':').map(Number)
  const guess = new Date(Date.UTC(y, m - 1, d, h, min))
  return new Date(guess.getTime() + offsetMinutes(guess, tz) * 60000)
}

export const addDays = (day, n) => {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

export const weekday = (day) => {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export const daysBetween = (a, b) => {
  const t = (s) => Date.UTC(...s.split('-').map((n, i) => (i === 1 ? n - 1 : Number(n))))
  return Math.round((t(b) - t(a)) / 86400000)
}

// "Thu, Dec 4 · 8am" in Portland.
export function slotLabel(iso) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric' })
  const time = d
    .toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' })
    .replace(':00', '')
    .replace(' AM', 'am')
    .replace(' PM', 'pm')
  return `${date} · ${time}`
}

export const dayLabel = (day) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' })

// "9 days", "6 weeks", "3 months".
export function ago(days) {
  if (days < 14) return `${days} day${days === 1 ? '' : 's'}`
  if (days < 61) return `${Math.round(days / 7)} weeks`
  const m = Math.round(days / 30.4)
  return `${m} month${m === 1 ? '' : 's'}`
}

const gcalStamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

// One-tap "add to Google Calendar" link.
export function gcalLink({ title, start, end, details = '' }) {
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${gcalStamp(start)}/${gcalStamp(end)}`, details })
  return `https://calendar.google.com/calendar/render?${q}`
}

export function icsFile({ title, start, end, uid }) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//jonschafer.com//orbit//EN',
    'BEGIN:VEVENT',
    `UID:${uid}@jonschafer.com`,
    `DTSTAMP:${gcalStamp(new Date().toISOString())}`,
    `DTSTART:${gcalStamp(start)}`,
    `DTEND:${gcalStamp(end)}`,
    `SUMMARY:${title.replace(/[,;]/g, '\\$&')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
