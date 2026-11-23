import { notFound } from 'next/navigation'
import OrbitInvite from '../../../../components/OrbitInvite'
import { select } from '../../../../lib/orbit/db'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Pick a time with Jon' }

export default async function InvitePage({ params }) {
  const [inv] = await select('orbit_invites', { id: params.id })
  if (!inv || inv.status === 'cancelled') notFound()
  const [person] = await select('orbit_people', { id: inv.person_id })
  // Friends see the plan and the times, never Jon's notes about them.
  return (
    <OrbitInvite
      invite={{ id: inv.id, idea: inv.idea, slots: inv.slots, picked: inv.picked, status: inv.status }}
      group={Boolean(person?.is_group)}
      // Prefill a name only for one-on-one invites.
      name={person && !person.is_group ? person.name : ''}
    />
  )
}
