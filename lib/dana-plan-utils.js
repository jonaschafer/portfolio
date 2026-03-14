export const BADGE_CLASSES = {
  build: 'bg-[#FAFAFA]/20 text-[#FAFAFA]',
  restore: 'bg-[#F8DB79]/30 text-[#c9a82a]',
  taper: 'bg-[#7ec8e3]/25 text-[#7ec8e3]',
  race: 'bg-[#ff6b6b]/25 text-[#ff8a8a]',
}

export function getBadgeClass(type) {
  if (!type) return BADGE_CLASSES.build
  const t = (type || '').toUpperCase()
  if (t.includes('RESTORE')) return BADGE_CLASSES.restore
  if (t.includes('RACE')) return BADGE_CLASSES.race
  if (t.includes('TAPER')) return BADGE_CLASSES.taper
  return BADGE_CLASSES.build
}

export function getStartDate(planData) {
  if (planData?.startDate) {
    const [y, m, d] = planData.startDate.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(2026, 2, 2)
}

export function getCurrentWeek(planData) {
  const startDate = getStartDate(planData)
  const today = new Date()
  if (today < startDate) return 1
  const week = Math.floor((today - startDate) / (7 * 24 * 60 * 60 * 1000)) + 1
  const maxW = planData?.weeks?.length ?? 27
  return Math.min(Math.max(1, week), maxW)
}

export const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** Global PT exercises — shown on Mon / Wed / Fri across all weeks */
export const PT_BY_DAY = {
  Monday: `**Monday — hip flexors + adductors (your injury priority area)**
- Seated straight leg raise
- SL glute bridge
- Side-lying adduction
- Copenhagen plank (or side plank clam raise)`,
  Wednesday: `**Wednesday — reactive/athletic + knee**
- Pogo/SL hops
- Step-downs
- Wall sit
- Med ball side-to-side`,
  Friday: `**Friday — abductors + posterior chain**
- Monsters
- KB calf raises 44#
- SL balance eyes closed
- Banded hip march`,
}

export function getPTBlockForDay(dayName) {
  return (dayName && PT_BY_DAY[dayName]) || ''
}

/** True if content already includes the PT circuit (avoids duplicating exercises). */
function contentAlreadyHasPT(dayName, main) {
  if (!main || !dayName) return false
  const lower = main.toLowerCase()
  // Monday: hip flexors + adductors circuit
  if (dayName === 'Monday' && (lower.includes('seated straight leg raise') || lower.includes('copenhagen plank'))) return true
  // Wednesday: reactive + knee
  if (dayName === 'Wednesday' && (lower.includes('pogo') || lower.includes('step-downs') || lower.includes('wall sit'))) return true
  // Friday: abductors + posterior
  if (dayName === 'Friday' && (lower.includes('monster walks') || lower.includes('fondas') || lower.includes('calf raises'))) return true
  return false
}

/** Returns day content with the global PT block appended when day is Mon/Wed/Fri (skip if content already has that PT). */
export function getDayContentWithPT(dayName, content) {
  const pt = getPTBlockForDay(dayName)
  const main = (content || '').trim()
  if (!pt) return main
  if (contentAlreadyHasPT(dayName, main)) return main
  return main ? main + '\n\n' + pt : pt
}

export function dateKey(d) {
  const pad = (n) => (n < 10 ? '0' + n : '' + n)
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export function parseLocalDate(iso) {
  if (!iso) return null
  const p = iso.split('-')
  if (p.length !== 3) return new Date(iso)
  return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10))
}

export function parseMiles(s) {
  if (!s || typeof s !== 'string') return 0
  const m = String(s).replace(/,/g, '').match(/(\d+\.?\d*)/)
  return m ? parseFloat(m[1], 10) : 0
}

export function parseVert(s) {
  if (!s || typeof s !== 'string') return 0
  const m = String(s).replace(/,/g, '').match(/(\d+\.?\d*)/)
  return m ? parseFloat(m[1], 10) : 0
}

/** Parse vert from runOneLine-style string (e.g. "6 miles, ~1,200 ft") by taking the number before "ft". */
export function parseVertFromRunOneLine(s) {
  if (!s || typeof s !== 'string') return 0
  const m = String(s).match(/([\d,.]+)\s*ft/i)
  if (!m) return 0
  const n = parseFloat(m[1].replace(/,/g, ''), 10)
  return isNaN(n) ? 0 : n
}

export function getPhaseClass(type) {
  if (!type) return 'build'
  const t = (type + '').toUpperCase()
  if (t.includes('RESTORE')) return 'restore'
  if (t.includes('TEST')) return 'test'
  if (t.includes('RACE')) return 'race'
  if (t.includes('TAPER')) return 'taper'
  return 'build'
}

/** Format distance for display: whole miles (e.g. "4 mi") */
export function formatDistance(summary) {
  if (!summary?.distance) return null
  const mi = parseMiles(summary.distance)
  if (mi === 0) return null
  return `${Math.round(mi)} mi`
}

/** Format vert for display (e.g. "1,600 ft"). Prefer summary.vert. */
export function formatVert(summary) {
  if (!summary?.vert) return null
  const s = String(summary.vert).trim()
  if (s.length > 15) return null
  const n = parseVert(summary.vert)
  if (n === 0) return null
  return n.toLocaleString() + ' ft'
}

/**
 * Single source of truth for run distance and vert across all views.
 * Uses runOneLine when present (matches full-text week copy), else summary.distance / summary.vert.
 * Returns { distance, vert, mi, v } - formatted strings and numeric for totals.
 */
export function getCanonicalRun(day) {
  const empty = { distance: null, vert: null, mi: 0, v: 0 }
  if (!day) return empty
  const s = day.summary || {}
  const runOneLine = s.runOneLine && String(s.runOneLine).trim()
  if (runOneLine) {
    const mi = parseMiles(runOneLine)
    const v = parseVertFromRunOneLine(runOneLine)
    return {
      distance: mi > 0 ? `${Math.round(mi)} mi` : null,
      vert: v > 0 ? v.toLocaleString() + ' ft' : null,
      mi,
      v,
    }
  }
  const mi = parseMiles(s.distance)
  const v = parseVert(s.vert)
  return {
    distance: formatDistance(s),
    vert: formatVert(s),
    mi,
    v,
  }
}

/** Run summary for display: use canonical run so all views match. */
export function formatRunSummary(dayOrSummary) {
  if (!dayOrSummary) return { distance: null, vert: null }
  const day = dayOrSummary.summary !== undefined ? dayOrSummary : null
  if (day) return getCanonicalRun(day)
  return {
    distance: formatDistance(dayOrSummary),
    vert: formatVert(dayOrSummary),
  }
}

/** Get the calendar date for a day in a week (e.g. for "Tuesday" in week 1). */
export function getDayDate(planData, weekNum, dayName) {
  const start = getStartDate(planData)
  const week = planData?.weeks?.find((w) => w.week === weekNum)
  if (!week) return null
  const dayIdx = DAY_ORDER.indexOf(dayName)
  if (dayIdx === -1) return null
  const d = new Date(start)
  d.setDate(d.getDate() + (weekNum - 1) * 7 + dayIdx)
  return d
}

/** Short date string for cards (e.g. "Mar 3") */
export function formatShortDate(date) {
  if (!date || !(date instanceof Date)) return ''
  return MONTH_NAMES[date.getMonth()].slice(0, 3) + ' ' + date.getDate()
}

/** Format race date for header (e.g. "Aug 15, 2026") */
export function formatRaceDate(planData) {
  const iso = planData?.raceDate
  if (!iso) return ''
  const d = parseLocalDate(iso)
  if (!d || isNaN(d.getTime())) return ''
  return MONTH_NAMES[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + ', ' + d.getFullYear()
}

/** Short plan/race label for header, derived from planTitle (e.g. "Wy'East Trailfest 50M") */
export function getPlanSubtitleLabel(planData) {
  const title = planData?.planTitle || ''
  const label = title.replace(/\s+Training Plan.*$/i, '').trim()
  return label || "Dana's Plan"
}
