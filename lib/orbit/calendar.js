// Jon's busy times, read from Google Calendar's "secret address in iCal format"
// (Calendar settings > your calendar > Integrate calendar). No OAuth: paste one
// or more of those URLs, comma separated, into ORBIT_ICAL_URLS. Unset means
// slots are offered from the windows alone and Jon prunes them by hand.

import ical from 'node-ical'
import { pdxDay, pdxTime } from './time'

export const calendarConfigured = () => Boolean(process.env.ORBIT_ICAL_URLS)

export async function busyBetween(from, to) {
  const urls = (process.env.ORBIT_ICAL_URLS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const busy = []
  for (const url of urls) {
    let data
    try {
      data = await ical.async.fromURL(url)
    } catch (e) {
      console.error('[orbit] calendar', e.message)
      continue
    }
    for (const ev of Object.values(data)) {
      if (ev.type !== 'VEVENT' || !ev.start) continue
      // Free events (Google's default for all-day ones) don't block anything.
      if (String(ev.transparency || '').toUpperCase() === 'TRANSPARENT') continue
      if (String(ev.status || '').toUpperCase() === 'CANCELLED') continue
      const len = (ev.end ? new Date(ev.end) : new Date(ev.start)).getTime() - new Date(ev.start).getTime()
      if (ev.rrule) {
        const ex = ev.exdate ? Object.values(ev.exdate).map((d) => pdxDay(d)) : []
        // With a TZID, rrule hands back wall-clock times dressed as UTC; convert them.
        const tz = ev.rrule.options.tzid
        const real = (occ) => (tz ? pdxTime(occ.toISOString().slice(0, 10), occ.toISOString().slice(11, 16), tz) : occ)
        for (const floating of ev.rrule.between(new Date(from.getTime() - 2 * 86400000), new Date(to.getTime() + 86400000), true)) {
          const key = floating.toISOString().slice(0, 10)
          const occ = real(floating)
          if (ex.includes(key)) continue
          const moved = ev.recurrences?.[key]
          if (moved) {
            if (String(moved.status || '').toUpperCase() === 'CANCELLED') continue
            busy.push([new Date(moved.start).getTime(), new Date(moved.end || moved.start).getTime()])
          } else {
            busy.push([occ.getTime(), occ.getTime() + len])
          }
        }
      } else {
        const s = new Date(ev.start).getTime()
        if (s + len >= from.getTime() && s <= to.getTime()) busy.push([s, s + len])
      }
    }
  }
  return busy
}
