/**
 * Daily cron: if someone is overdue, push one reminder to Jon's phone (ntfy),
 * the most overdue person first, and nobody more than once a week.
 */
import { update } from '../../../../lib/orbit/db'
import { SITE, loadAll, nudgeLine, push } from '../../../../lib/orbit/logic'
import { daysBetween } from '../../../../lib/orbit/time'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { people, today } = await loadAll()
  const next = people.find(
    (p) => p.status.due && (!p.last_nudged || daysBetween(p.last_nudged, today) >= 7)
  )
  if (!next) return Response.json({ nudged: null })
  await push({ title: 'Orbit', message: nudgeLine(next, next.status), click: `${SITE}/orbit#${next.id}` })
  await update('orbit_people', { id: next.id }, { last_nudged: today })
  return Response.json({ nudged: next.id })
}
