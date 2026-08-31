'use client'

import {
  PREP_SHOPPING,
  MEDS_EXPECT,
  DIET_RULE,
  SINUS_PRECAUTIONS,
  ORAL_HYGIENE,
  RUNNING_NOTE,
} from '../../app/mma/map/data/prep'
import { SectionHeader, StatusBadge, CheckItem } from './ui'
import { useChecklist } from './storage'

function ShoppingGroup({ group }) {
  const { checked, notes, toggle, setNote } = useChecklist(`prep:shopping:${group.id}`)
  const remaining = group.items.filter((item) => !checked[item.id]).length

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] text-[var(--fg)]">{group.title}</div>
        <span className="text-[12px] text-[var(--muted)]">{remaining} left</span>
      </div>
      {group.intro && <p className="mb-2.5 text-[12.5px] leading-[1.5] text-[var(--muted)]">{group.intro}</p>}
      <ul className="space-y-2">
        {group.items.map((item) => (
          <CheckItem
            key={item.id}
            id={item.id}
            text={item.text}
            detail={item.status ? undefined : item.detail}
            checked={Boolean(checked[item.id])}
            onToggle={toggle}
            note={notes[item.id]}
            onNoteChange={setNote}
          />
        ))}
      </ul>
      {group.items.some((i) => i.status) && (
        <div className="mt-2 space-y-1.5 pl-1">
          {group.items
            .filter((i) => i.status)
            .map((i) => (
              <div key={i.id} className="text-[12px] leading-[1.5] text-[var(--muted)]">
                <StatusBadge status={i.status} /> <span className="font-medium text-[var(--fg)]">{i.text}:</span> {i.detail}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

function NoteList({ notes }) {
  return (
    <ul className="space-y-2">
      {notes.map((n, i) => (
        <li key={i} className="text-[13.5px] leading-[1.55] text-[var(--fg)]">
          <StatusBadge status={n.status} />
          {n.text}
        </li>
      ))}
    </ul>
  )
}

export default function PrepView() {
  return (
    <div className="px-5 pb-10 pt-5">
      <section className="mb-7">
        <SectionHeader>Prep / shopping</SectionHeader>
        {PREP_SHOPPING.map((group) => (
          <ShoppingGroup key={group.id} group={group} />
        ))}
      </section>

      {/* Glanceable — same visual weight as the red-flags card. */}
      <section data-print-avoid-break className="mb-7 rounded-[20px] bg-[var(--rf-bg)] px-6 py-6">
        <div className="text-[19px] font-bold leading-[1.3] text-[var(--rf-fg)] mb-2">{DIET_RULE.headline}</div>
        <div className="text-[13px] leading-[1.5] text-[var(--rf-fg)]/70">{DIET_RULE.headlineNote}</div>
      </section>

      <section className="mb-7">
        <SectionHeader>Diet</SectionHeader>
        <div className="space-y-3">
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">What’s allowed</div>
            <p className="text-[14px] leading-[1.55] text-[var(--fg)]">
              <StatusBadge status={DIET_RULE.allowed.status} />
              {DIET_RULE.allowed.text}
            </p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">Technique</div>
            <p className="text-[14px] leading-[1.55] text-[var(--fg)]">
              <StatusBadge status={DIET_RULE.technique.status} />
              {DIET_RULE.technique.text}
            </p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">Timeline of intake priorities</div>
            <NoteList notes={DIET_RULE.timeline} />
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">Before surgery</div>
            <p className="text-[14px] leading-[1.55] text-[var(--fg)]">
              <StatusBadge status={DIET_RULE.beforeSurgery.status} />
              {DIET_RULE.beforeSurgery.text}
            </p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">Stock</div>
            <p className="text-[13.5px] leading-[1.55] text-[var(--muted)]">{DIET_RULE.stock}</p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">Nutrition target</div>
            <p className="text-[14px] leading-[1.55] text-[var(--fg)]">
              <StatusBadge status={DIET_RULE.nutritionTarget.status} />
              {DIET_RULE.nutritionTarget.text}
            </p>
          </div>
        </div>
      </section>

      {/* Glanceable — same treatment as the diet rule / red-flags card. */}
      <section data-print-avoid-break className="mb-7 rounded-[20px] bg-[var(--rf-bg)] px-6 py-6">
        <div className="text-[15px] font-bold uppercase tracking-[0.04em] leading-[1.3] text-[var(--rf-fg)] mb-3">
          Sinus precautions
        </div>
        <ul className="space-y-1.5">
          {SINUS_PRECAUTIONS.map((n, i) => (
            <li key={i} className="text-[14px] leading-[1.5] text-[var(--rf-fg)]/85">
              {n.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-7">
        <SectionHeader>Meds — what to expect</SectionHeader>
        <div className="space-y-4">
          {MEDS_EXPECT.map((group) => (
            <div key={group.id}>
              <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">{group.title}</div>
              <NoteList notes={group.notes} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-7">
        <SectionHeader>Oral hygiene = wound care</SectionHeader>
        <NoteList notes={ORAL_HYGIENE} />
      </section>

      <section className="mb-2">
        <SectionHeader>The running note</SectionHeader>
        <p className="mb-3 text-[12.5px] leading-[1.5] text-[var(--muted)] italic">{RUNNING_NOTE.intro}</p>
        <div className="space-y-3">
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">What the surgeons said</div>
            <p className="text-[14px] leading-[1.55] text-[var(--fg)]">
              <StatusBadge status={RUNNING_NOTE.whatSurgeonsSaid.status} />
              {RUNNING_NOTE.whatSurgeonsSaid.text}
            </p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">What you’re choosing</div>
            <p className="text-[14px] leading-[1.55] text-[var(--fg)]">
              <StatusBadge status={RUNNING_NOTE.whatYoureChoosing.status} />
              {RUNNING_NOTE.whatYoureChoosing.text}
            </p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1">What to actually learn from it</div>
            <p className="mb-2 text-[13.5px] leading-[1.55] text-[var(--muted)]">{RUNNING_NOTE.whatToLearn}</p>
            <ul className="list-disc space-y-1 pl-5">
              {RUNNING_NOTE.weeklyPrompts.map((p, i) => (
                <li key={i} className="text-[13.5px] leading-[1.5] text-[var(--fg)]">
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] italic leading-[1.5] text-[var(--muted)]">{RUNNING_NOTE.closing}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
