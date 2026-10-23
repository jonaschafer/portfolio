// One Strava activity in, everything downstream out: save the row, work out
// which PRs it set, push the new ones to Jon's phone, and write advice when
// the notes are new. Safe to run twice on the same activity (Strava retries
// webhooks): PRs already pushed and notes already answered are skipped.
import { fetchRow } from './strava'
import { listWorkouts, getWorkout, upsertWorkout, updateWorkout, deleteWorkout } from './store'
import { computeRecords, fmtRecord, fmtGain } from './records'
import { writeAdvice, adviceConfigured } from './advice'
import { push } from './notify'

export async function syncActivity(id, { notify = true } = {}) {
  const { row, skip } = await fetchRow(id)
  if (skip) {
    // Reclassified away from rowing, or deleted on Strava.
    if (await getWorkout(id)) await deleteWorkout(id)
    return { id, skipped: skip }
  }
  await upsertWorkout(row)

  const history = await listWorkouts()
  const saved = history.find((w) => String(w.id) === String(id))
  const { byId, bests } = computeRecords(history)
  const prs = (byId[saved.id] || []).filter((p) => p.rank === 1)
  const result = { id, prs: prs.map((p) => p.key), advice: false }

  // PRs only count against an earlier best; a first-ever effort isn't news.
  const fresh = prs.filter((p) => p.prev && !(saved.notified || []).includes(p.key))
  if (notify && fresh.length) {
    await push({
      title: fresh.length === 1 ? `New ${fresh[0].label} PR 🏆` : `${fresh.length} new PRs 🏆`,
      message: fresh.map((p) => `${p.label}: ${fmtRecord(p)} (${fmtGain(p)})`).join('\n'),
      tags: ['trophy'],
    }).catch((e) => console.error('[row] push', e))
  }
  const notified = [...new Set([...(saved.notified || []), ...prs.map((p) => p.key)])]
  if (notified.length !== (saved.notified || []).length) await updateWorkout(saved.id, { notified })

  // New or edited notes get fresh advice. No notes, no advice: the page asks for them.
  if (adviceConfigured() && saved.notes && saved.notes !== saved.advice_notes) {
    const before = history.filter((w) => w.start_local <= saved.start_local)
    const advice = await writeAdvice(saved, { history: before, prs, bests })
    await updateWorkout(saved.id, { advice, advice_notes: saved.notes })
    result.advice = true
    if (notify) {
      await push({ title: `Advice for ${saved.name}`, message: advice.summary.slice(0, 240), tags: ['rowing_boat'] }).catch((e) =>
        console.error('[row] push', e)
      )
    }
  }
  return result
}
