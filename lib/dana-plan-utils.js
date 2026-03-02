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

export function getPhaseClass(type) {
  if (!type) return 'build'
  const t = (type + '').toUpperCase()
  if (t.includes('RESTORE')) return 'restore'
  if (t.includes('TEST')) return 'test'
  if (t.includes('RACE')) return 'race'
  if (t.includes('TAPER')) return 'taper'
  return 'build'
}
