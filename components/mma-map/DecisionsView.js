'use client'

import { DECIDED, DECISIONS_GROUPS } from '../../app/mma/map/data/decisions'
import { SectionHeader, CheckItem } from './ui'
import { useChecklist } from './storage'

function ChecklistGroup({ group }) {
  const { checked, notes, toggle, setNote } = useChecklist(`decisions:${group.id}`)
  const remaining = group.items.filter((item) => !checked[item.id]).length

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <SectionHeader>{group.title}</SectionHeader>
          {group.subtitle && <p className="-mt-2 mb-1 text-xs text-base-content/50">{group.subtitle}</p>}
        </div>
        <span className="badge badge-ghost badge-sm shrink-0">{remaining} open</span>
      </div>
      {group.intro && <p className="mb-3 text-sm leading-relaxed text-base-content/60">{group.intro}</p>}
      <ul className="space-y-2.5">
        {group.items.map((item) => (
          <CheckItem
            key={item.id}
            id={item.id}
            text={item.text}
            detail={item.detail}
            checked={Boolean(checked[item.id])}
            onToggle={toggle}
            note={notes[item.id]}
            onNoteChange={setNote}
          />
        ))}
      </ul>
    </section>
  )
}

export default function DecisionsView() {
  return (
    <div className="px-4 pb-10 pt-5">
      <p className="mb-5 text-sm leading-relaxed text-base-content/60">
        Checking an item means "asked and answered" — tap to attach a note with what you learned.
      </p>

      <section className="mb-6">
        <SectionHeader>Decided</SectionHeader>
        <ul className="space-y-2.5">
          {DECIDED.map((row) => (
            <li key={row.id} data-print-avoid-break className="card card-compact border border-base-300 bg-base-100">
              <div className="card-body">
                <div className="mb-1 text-xs uppercase tracking-wide text-base-content/50">{row.decision}</div>
                <div className="mb-1.5 text-[15px] font-semibold text-base-content">{row.choice}</div>
                <div className="text-sm leading-relaxed text-base-content/60">{row.notes}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {DECISIONS_GROUPS.map((group) => (
        <ChecklistGroup key={group.id} group={group} />
      ))}
    </div>
  )
}
