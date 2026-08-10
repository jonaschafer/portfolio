function pad(n) {
  return String(n).padStart(2, '0')
}

// Parses "8:30 – 9:30 AM" / "8:00 – 9:00 AM" into 24h {startH,startM,endH,endM}.
// Both times share a single trailing meridiem in this data, applying to both.
function parseTimeRange(timeStr) {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return null
  const [, sh, sm, eh, em, meridiem] = match
  const to24 = (h) => {
    let hour = parseInt(h, 10) % 12
    if (meridiem.toUpperCase() === 'PM') hour += 12
    return hour
  }
  return { startH: to24(sh), startM: parseInt(sm, 10), endH: to24(eh), endM: parseInt(em, 10) }
}

export function buildIcsDataUri({ title, description, date, time }) {
  const [y, m, d] = date.split('-').map((n) => parseInt(n, 10))
  const uid = `${date}-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}@jonschafer.com`
  // Deterministic, not "now" — this is rendered on both server and client, and a real
  // current timestamp would differ between the two passes and trigger a hydration mismatch.
  // The event's own date is a stable stand-in; iCal doesn't require DTSTAMP to be the
  // actual creation time for a static link like this.
  const dtstamp = `${y}${pad(m)}${pad(d)}T000000Z`

  let dtLines
  const range = time ? parseTimeRange(time) : null
  if (range) {
    const start = `${y}${pad(m)}${pad(d)}T${pad(range.startH)}${pad(range.startM)}00`
    const end = `${y}${pad(m)}${pad(d)}T${pad(range.endH)}${pad(range.endM)}00`
    dtLines = `DTSTART:${start}\r\nDTEND:${end}`
  } else {
    const dateStr = `${y}${pad(m)}${pad(d)}`
    const endDate = new Date(Date.UTC(y, m - 1, d + 1))
    const endStr = `${endDate.getUTCFullYear()}${pad(endDate.getUTCMonth() + 1)}${pad(endDate.getUTCDate())}`
    dtLines = `DTSTART;VALUE=DATE:${dateStr}\r\nDTEND;VALUE=DATE:${endStr}`
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//jonschafer.com//mma-recovery//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    dtLines,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}
