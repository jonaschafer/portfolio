/**
 * Strava webhook for /row. Strava calls this on every activity create, update
 * and delete. Subscribe once with `node scripts/strava-subscribe.mjs`.
 *
 * GET answers Strava's subscription check. POST must answer within 2 seconds,
 * so the sync (Strava fetch, PRs, push, advice) runs after the response via
 * waitUntil. Strava webhooks aren't signed; events are only used as a prompt
 * to fetch the activity from Strava with Jon's own token, and owner_id must
 * match STRAVA_ATHLETE_ID when that's set.
 *
 * Env: STRAVA_VERIFY_TOKEN, STRAVA_ATHLETE_ID (optional), plus lib/row/* vars.
 */
import { waitUntil } from '@vercel/functions'
import { syncActivity } from '../../../../lib/row/sync'
import { deleteWorkout } from '../../../../lib/row/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(request) {
  const q = new URL(request.url).searchParams
  if (q.get('hub.mode') === 'subscribe' && q.get('hub.verify_token') === process.env.STRAVA_VERIFY_TOKEN) {
    return Response.json({ 'hub.challenge': q.get('hub.challenge') })
  }
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(request) {
  const e = await request.json().catch(() => null)
  if (!e || e.object_type !== 'activity') return Response.json({ ok: true })
  const athlete = process.env.STRAVA_ATHLETE_ID
  if (athlete && String(e.owner_id) !== athlete) return Response.json({ ok: true })

  const work =
    e.aspect_type === 'delete'
      ? deleteWorkout(e.object_id)
      : syncActivity(e.object_id).then((r) => console.log('[row] synced', JSON.stringify(r)))
  waitUntil(work.catch((err) => console.error('[row] webhook', e.object_id, err)))
  return Response.json({ ok: true })
}
