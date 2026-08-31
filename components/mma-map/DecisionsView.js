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
          {group.subtitle && <p className="-mt-2 mb-1 text-[12.5px] text-[var(--muted)]">{group.subtitle}</p>}
        </div>
        <span className="shrink-0 text-[12px] text-[var(--muted)]">{remaining} open</span>
      </div>
      {group.intro && <p className="mb-3 text-[13.5px] leading-[1.55] text-[var(--muted)]">{group.intro}</p>}
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
    <div className="px-5 pb-10 pt-5">
      <p className="mb-5 text-[13px] leading-[1.5] text-[var(--muted)]">
        Checking an item means "asked and answered" — tap to attach a note with what you learned.
      </p>

      <section className="mb-6">
        <SectionHeader>Decided</SectionHeader>
        <ul className="space-y-2.5">
          {DECIDED.map((row) => (
            <li key={row.id} data-print-avoid-break className="rounded-[14px] border border-[var(--line)] bg-[var(--card)] px-4 py-3">
              <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">{row.decision}</div>
              <div className="font-['Haas_Grot_Disp',_sans-serif] text-[15px] text-[var(--fg)] mb-1.5">{row.choice}</div>
              <div className="text-[13px] leading-[1.5] text-[var(--muted)]">{row.notes}</div>
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
