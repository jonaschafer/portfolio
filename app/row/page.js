import RowLog from '../../components/RowLog'
import { listWorkouts, storeConfigured } from '../../lib/row/store'
import { computeRecords } from '../../lib/row/records'

export const metadata = {
  title: 'Jon Schafer — Row',
  description: 'My erg log: every row from Strava, the PRs Strava doesn’t track, and what to work on next.',
}

// New rows arrive by webhook at any time, so render per request. The table is small.
export const dynamic = 'force-dynamic'

export default async function RowPage() {
  let workouts = []
  if (storeConfigured()) {
    workouts = await listWorkouts().catch((e) => {
      console.error('[row] page', e)
      return []
    })
  }
  const { byId, bests } = computeRecords(workouts)
  // Streams stay on the server; the page only needs the summaries.
  const rows = workouts
    .map(({ stream, notified, advice_notes, ...w }) => ({ ...w, prs: byId[w.id] || [] }))
    .reverse()
  return <RowLog workouts={rows} bests={bests} />
}
