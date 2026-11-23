import { select } from '../../../../lib/orbit/db'
import { proposeSlots } from '../../../../lib/orbit/logic'
import { calendarConfigured } from '../../../../lib/orbit/calendar'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const id = new URL(request.url).searchParams.get('person')
  const [person] = await select('orbit_people', { id })
  if (!person) return Response.json({ error: 'not found' }, { status: 404 })
  const slots = await proposeSlots(person)
  return Response.json({ slots, calendar: calendarConfigured() })
}
