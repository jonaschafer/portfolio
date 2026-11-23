import Orbit from '../../components/Orbit'
import { dbConfigured } from '../../lib/orbit/db'
import { SITE, loadAll } from '../../lib/orbit/logic'
import { calendarConfigured } from '../../lib/orbit/calendar'

export const dynamic = 'force-dynamic'

export default async function OrbitPage() {
  if (!dbConfigured()) return <p style={{ padding: 20 }}>Orbit store not configured.</p>
  const { people, today } = await loadAll()
  return <Orbit people={people} today={today} site={SITE} calendar={calendarConfigured()} />
}
