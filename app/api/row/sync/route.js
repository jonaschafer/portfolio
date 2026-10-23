/**
 * Backfill and safety net for /row. Pulls every rowing activity from the last
 * `days` days (default 3) and syncs it, so a missed webhook gets picked up by
 * the daily cron in vercel.json. `?days=365` backfills; `?notify=0` keeps it quiet.
 *
 * Needs `Authorization: Bearer <CRON_SECRET>`. Vercel Cron sends it when
 * CRON_SECRET is set.
 */
import { listRowIds, stravaConfigured } from '../../../../lib/row/strava'
import { syncActivity } from '../../../../lib/row/sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!stravaConfigured()) return Response.json({ error: 'Strava not configured' }, { status: 503 })

  const q = new URL(request.url).searchParams
  const days = Number(q.get('days') || 3)
  const notify = q.get('notify') !== '0'
  const ids = await listRowIds(Math.floor(Date.now() / 1000 - days * 86400))
  const results = []
  // One at a time: each sync reads the full history to rank PRs in order.
  for (const id of ids.reverse()) {
    results.push(await syncActivity(id, { notify }).catch((e) => ({ id, error: e.message })))
  }
  return Response.json({ ok: true, results })
}
