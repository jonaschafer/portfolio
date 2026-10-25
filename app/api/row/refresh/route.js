/**
 * The "Check Strava" button on /row. Strava sends no webhook when only the
 * description changes, so this resyncs one row on demand: fresh notes, then
 * advice if they're new. Waits for the advice so the page can reload once.
 *
 * The page is public, so this only touches rows already in the table, and
 * at most once every 30 seconds per row. Advice is still only written when
 * the notes changed, so repeat taps cost a Strava fetch and nothing more.
 */
import { syncActivity } from '../../../../lib/row/sync'
import { getWorkout } from '../../../../lib/row/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const COOLDOWN = 30 * 1000

export async function POST(request) {
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isSafeInteger(id) || id <= 0) return Response.json({ error: 'Bad id' }, { status: 400 })

  const saved = await getWorkout(id)
  if (!saved) return Response.json({ error: 'Not found' }, { status: 404 })
  if (Date.now() - new Date(saved.updated_at).getTime() < COOLDOWN) {
    return Response.json({ ok: true, cooldown: true, notes: Boolean(saved.notes), advice: Boolean(saved.advice) })
  }

  try {
    const r = await syncActivity(id)
    const after = await getWorkout(id)
    return Response.json({ ok: true, ...r, notes: Boolean(after?.notes), advice: Boolean(after?.advice) })
  } catch (e) {
    console.error('[row] refresh', id, e)
    return Response.json({ error: 'Sync failed' }, { status: 502 })
  }
}
