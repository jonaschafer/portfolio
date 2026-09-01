'use client'

import { useState } from 'react'
import { ChevronRight, HelpCircle, ClipboardList, Utensils, BookOpen } from 'lucide-react'
import { useRecoveryState, formatSurgeryDate, SURGERY_INFO } from '../../../../../components/mma-map/compare/useRecoveryState'

export default function DaisyUICompare() {
  const state = useRecoveryState()
  const [theme, setTheme] = useState('light')
  const isPreOp = state.stage === 'pre-op'

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 border-b border-base-300 px-4">
        <div className="flex-1 text-xs uppercase tracking-widest opacity-60">Recovery Map · daisyUI</div>
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
          <span className="swap-on text-lg">🌙</span>
          <span className="swap-off text-lg">☀️</span>
        </label>
      </div>

      <div className="max-w-md mx-auto px-4 pb-16 pt-6">
        <div className="stats shadow w-full bg-base-100">
          <div className="stat place-items-center">
            <div className="stat-title">{isPreOp ? 'Days until surgery' : `Week ${state.week} · Post-op day`}</div>
            <div className="stat-value">{isPreOp ? state.daysUntil : state.day}</div>
            <div className="stat-desc mt-1">{isPreOp ? formatSurgeryDate(state.surgery) : state.phase.label}</div>
          </div>
        </div>

        <p className="text-sm text-base-content/70 text-center mt-3 px-4">
          {isPreOp ? `${SURGERY_INFO.procedure}. ${SURGERY_INFO.surgeon}.` : state.phase.summary}
        </p>

        {!isPreOp && state.nextPhase && (
          <div className="badge badge-outline mx-auto mt-3 flex w-fit">
            Next: {state.nextPhase.label} · day {state.nextPhase.startDay}
          </div>
        )}

        <div className="divider text-xs uppercase tracking-widest opacity-50 mt-8">Core</div>

        <div className="flex flex-col gap-3">
          <NavCard title="Full timeline" subtitle="Day 0 through 12 months" />
          <NavCard title="Hard rules vs. my choices" subtitle="What the surgeons said vs. what I decided" />
          <NavCard title="Open questions" subtitle="2 unresolved with the care team" icon={<HelpCircle size={16} />} />
        </div>

        <div className="divider text-xs uppercase tracking-widest opacity-50 mt-8">Companion</div>

        <div className="flex flex-col gap-3">
          <NavCard title="Decisions & Questions" subtitle="24 unchecked" icon={<ClipboardList size={16} />} />
          <NavCard title="Prep · Meds · Diet" subtitle="Shopping list, the diet rule, sinus precautions" icon={<Utensils size={16} />} />
          <NavCard title="Journal" subtitle="Daily + weekly log, numbness trends" icon={<BookOpen size={16} />} />
        </div>
      </div>

      <div className="btm-nav">
        <button className="bg-error text-error-content active">
          <span className="text-sm font-semibold">⚠ Red flags — call / ER</span>
        </button>
      </div>
    </div>
  )
}

function NavCard({ title, subtitle, icon }) {
  return (
    <button className="card card-compact bg-base-100 shadow border border-base-300 text-left">
      <div className="card-body flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <div className="card-title text-base">{title}</div>
            <p className="text-sm text-base-content/60">{subtitle}</p>
          </div>
        </div>
        <ChevronRight size={18} className="opacity-40" />
      </div>
    </button>
  )
}
