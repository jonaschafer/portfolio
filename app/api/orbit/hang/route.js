import { insert, remove, update } from '../../../../lib/orbit/db'
import { pdxDay } from '../../../../lib/orbit/time'

export const dynamic = 'force-dynamic'

// Log a hang (today or any date; a future date is a plan).
export async function POST(request) {
  const { person_id, day, what } = await request.json()
  if (!person_id) return Response.json({ error: 'person_id' }, { status: 400 })
  const hang = await insert('orbit_hangs', { person_id, day: day || pdxDay(), what: what || null })
  // A fresh hang clears any snooze.
  await update('orbit_people', { id: person_id }, { snoozed_until: null })
  return Response.json(hang)
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get('id')
  await remove('orbit_hangs', { id })
  return Response.json({ ok: true })
}
