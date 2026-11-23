import { insert, remove, select, update } from '../../../../lib/orbit/db'
import { pdxDay } from '../../../../lib/orbit/time'

export const dynamic = 'force-dynamic'

const token = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => (b % 36).toString(36)).join('')

// Make a pick-a-time link.
export async function POST(request) {
  const { person_id, idea, note, slots } = await request.json()
  if (!person_id || !slots?.length) return Response.json({ error: 'person_id and slots' }, { status: 400 })
  const invite = await insert('orbit_invites', { id: token(), person_id, idea: idea || null, note: note || null, slots, responses: [], status: 'open', picked: null })
  return Response.json(invite)
}

// Lock a slot (for group invites, or to pick on someone's behalf), or cancel.
export async function PATCH(request) {
  const { id, slot, cancel } = await request.json()
  const [inv] = await select('orbit_invites', { id })
  if (!inv) return Response.json({ error: 'not found' }, { status: 404 })
  if (cancel) {
    await update('orbit_invites', { id }, { status: 'cancelled' })
    await remove('orbit_hangs', { invite_id: id })
    return Response.json({ ok: true })
  }
  const picked = inv.slots[slot]
  if (!picked) return Response.json({ error: 'slot' }, { status: 400 })
  await update('orbit_invites', { id }, { status: 'booked', picked })
  await remove('orbit_hangs', { invite_id: id })
  await insert('orbit_hangs', { person_id: inv.person_id, day: pdxDay(new Date(picked.start)), what: inv.idea, invite_id: id })
  return Response.json({ ok: true })
}
