import { insert, remove, update } from '../../../../lib/orbit/db'

export const dynamic = 'force-dynamic'

const FIELDS = ['name', 'grp', 'members', 'every_days', 'notes', 'ideas', 'windows', 'invitable', 'is_group', 'snoozed_until', 'sort', 'travel_mins']
const pick = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => FIELDS.includes(k)))

export async function PATCH(request) {
  const body = await request.json()
  await update('orbit_people', { id: body.id }, pick(body))
  return Response.json({ ok: true })
}

export async function POST(request) {
  const body = pick(await request.json())
  if (!body.name) return Response.json({ error: 'name' }, { status: 400 })
  const id = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6)
  const person = await insert('orbit_people', { ideas: [], windows: [], every_days: 42, sort: 99, ...body, id })
  return Response.json(person)
}

export async function DELETE(request) {
  await remove('orbit_people', { id: new URL(request.url).searchParams.get('id') })
  return Response.json({ ok: true })
}
