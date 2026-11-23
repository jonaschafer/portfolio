// The friend side of an invite: no login, the link's random id is the key.
import { insert, select, update } from '../../../../../lib/orbit/db'
import { SITE, push } from '../../../../../lib/orbit/logic'
import { gcalLink, icsFile, pdxDay, slotLabel } from '../../../../../lib/orbit/time'

export const dynamic = 'force-dynamic'

// Downloads the locked time as a calendar file (?json=1 for the raw time).
export async function GET(request, { params }) {
  const [inv] = await select('orbit_invites', { id: params.id })
  if (!inv?.picked) return new Response('Not found', { status: 404 })
  if (new URL(request.url).searchParams.get('json')) return Response.json({ idea: inv.idea, picked: inv.picked })
  const title = `${inv.idea || 'Hang'} with Jon`
  return new Response(icsFile({ title, ...inv.picked, uid: inv.id }), {
    headers: { 'Content-Type': 'text/calendar', 'Content-Disposition': 'attachment; filename="hang.ics"' },
  })
}

export async function POST(request, { params }) {
  const { name, picks = [], note } = await request.json()
  const [inv] = await select('orbit_invites', { id: params.id })
  if (!inv || inv.status !== 'open') return Response.json({ error: 'closed' }, { status: 409 })
  const [person] = await select('orbit_people', { id: inv.person_id })
  const who = name?.trim() || person.name
  const valid = picks.filter((i) => inv.slots[i])

  // One person and one pick: that's a yes, so book it.
  if (!person.is_group && valid.length === 1) {
    const picked = inv.slots[valid[0]]
    await update('orbit_invites', { id: inv.id }, { status: 'booked', picked, responses: [...inv.responses, { name: who, picks: valid, note }] })
    await insert('orbit_hangs', { person_id: person.id, day: pdxDay(new Date(picked.start)), what: inv.idea, invite_id: inv.id })
    const title = `${inv.idea || 'Hang'} with ${person.name}`
    await push({
      title: `${person.name} picked a time`,
      message: `${slotLabel(picked.start)}${inv.idea ? `, ${inv.idea}` : ''}${note ? `\n"${note}"` : ''}`,
      click: `${SITE}/orbit#${person.id}`,
      actions: [{ action: 'view', label: 'Add to calendar', url: gcalLink({ title, ...picked }) }],
    }).catch((e) => console.error('[orbit] push', e.message))
    return Response.json({ booked: picked })
  }

  // Groups (or "none of these"): collect answers, Jon locks it in.
  await update('orbit_invites', { id: inv.id }, { responses: [...inv.responses, { name: who, picks: valid, note }] })
  const times = valid.map((i) => slotLabel(inv.slots[i].start)).join(', ')
  await push({
    title: `${who} answered (${person.name})`,
    message: [times ? `Works: ${times}` : 'None of those work', note && `"${note}"`].filter(Boolean).join('\n'),
    click: `${SITE}/orbit#${person.id}`,
  }).catch((e) => console.error('[orbit] push', e.message))
  return Response.json({ ok: true })
}
