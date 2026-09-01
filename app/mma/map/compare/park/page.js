'use client'

import { useState } from 'react'
import { Switch } from '@ark-ui/react/switch'
import { ChevronRight, HelpCircle, ClipboardList, Utensils, BookOpen } from 'lucide-react'
import { useRecoveryState, formatSurgeryDate, SURGERY_INFO } from '../../../../../components/mma-map/compare/useRecoveryState'

// Park UI's real distribution runs on Panda CSS, not Tailwind, so this uses
// its actual interactive primitive (Ark UI's Switch) with Park UI's published
// visual tokens (rounded-xl cards, teal accent, generous 20-24px padding)
// hand-applied via Tailwind instead of their Panda build.
export default function ParkCompare() {
  const state = useRecoveryState()
  const [dark, setDark] = useState(false)
  const isPreOp = state.stage === 'pre-op'

  const bg = dark ? '#18181b' : '#fafafa'
  const card = dark ? '#232326' : '#ffffff'
  const border = dark ? '#333336' : '#e4e4e7'
  const fg = dark ? '#f4f4f5' : '#18181b'
  const muted = dark ? '#a1a1aa' : '#71717a'
  const accent = '#0d9488'

  return (
    <div style={{ background: bg, minHeight: '100vh', color: fg }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: muted }}>
          Recovery Map · Park UI
        </span>
        <Switch.Root
          checked={dark}
          onCheckedChange={(d) => setDark(d.checked)}
          className="inline-flex h-6 w-10 cursor-pointer items-center rounded-full p-0.5 transition-colors"
          style={{ background: dark ? accent : border }}
        >
          <Switch.Control>
            <Switch.Thumb
              className="block h-5 w-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: dark ? 'translateX(16px)' : 'translateX(0)' }}
            />
          </Switch.Control>
          <Switch.HiddenInput />
        </Switch.Root>
      </div>

      <div className="mx-auto max-w-md px-5 pb-16 pt-6">
        <div className="rounded-2xl p-7 text-center" style={{ background: card, border: `1px solid ${border}` }}>
          <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: muted }}>
            {isPreOp ? 'Days until surgery' : `Week ${state.week} · Post-op day`}
          </div>
          <div className="my-3 text-7xl font-bold tracking-tight" style={{ color: accent }}>
            {isPreOp ? state.daysUntil : state.day}
          </div>
          <div className="text-lg font-semibold">{isPreOp ? formatSurgeryDate(state.surgery) : state.phase.label}</div>
          <p className="mx-auto mt-2 max-w-[36ch] text-sm" style={{ color: muted }}>
            {isPreOp ? `${SURGERY_INFO.procedure}. ${SURGERY_INFO.surgeon}.` : state.phase.summary}
          </p>
          {!isPreOp && state.nextPhase && (
            <div
              className="mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{ background: dark ? '#134e4a' : '#f0fdfa', color: accent }}
            >
              Next: {state.nextPhase.label} · day {state.nextPhase.startDay}
            </div>
          )}
        </div>

        <div className="mb-3 mt-9 text-[11px] font-semibold uppercase tracking-widest" style={{ color: muted }}>
          Core
        </div>
        <div className="flex flex-col gap-2.5">
          <NavCard title="Full timeline" subtitle="Day 0 through 12 months" card={card} border={border} muted={muted} />
          <NavCard title="Hard rules vs. my choices" subtitle="What the surgeons said vs. what I decided" card={card} border={border} muted={muted} />
          <NavCard title="Open questions" subtitle="2 unresolved with the care team" icon={<HelpCircle size={16} />} card={card} border={border} muted={muted} />
        </div>

        <div className="mb-3 mt-9 text-[11px] font-semibold uppercase tracking-widest" style={{ color: muted }}>
          Companion
        </div>
        <div className="flex flex-col gap-2.5">
          <NavCard title="Decisions & Questions" subtitle="24 unchecked" icon={<ClipboardList size={16} />} card={card} border={border} muted={muted} />
          <NavCard title="Prep · Meds · Diet" subtitle="Shopping list, the diet rule, sinus precautions" icon={<Utensils size={16} />} card={card} border={border} muted={muted} />
          <NavCard title="Journal" subtitle="Daily + weekly log, numbness trends" icon={<BookOpen size={16} />} card={card} border={border} muted={muted} />
        </div>
      </div>

      <button className="fixed inset-x-0 bottom-0 bg-red-600 py-4 text-center text-sm font-semibold text-white">
        ⚠ Red flags — call / ER
      </button>
    </div>
  )
}

function NavCard({ title, subtitle, icon, card, border, muted }) {
  return (
    <button
      className="flex items-center justify-between rounded-xl px-5 py-4 text-left transition-shadow hover:shadow-md"
      style={{ background: card, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-2.5">
        {icon && <span style={{ color: muted }}>{icon}</span>}
        <div>
          <div className="text-[15px] font-semibold">{title}</div>
          <div className="text-[13px]" style={{ color: muted }}>
            {subtitle}
          </div>
        </div>
      </div>
      <ChevronRight size={18} style={{ color: muted }} />
    </button>
  )
}
