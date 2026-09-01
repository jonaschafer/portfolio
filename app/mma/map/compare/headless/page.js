'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { ChevronRight, HelpCircle, ClipboardList, Utensils, BookOpen } from 'lucide-react'
import { useRecoveryState, formatSurgeryDate, SURGERY_INFO } from '../../../../../components/mma-map/compare/useRecoveryState'

// Headless UI ships zero visual opinions — only accessible behavior. The look
// here follows Tailwind Labs' own documented example patterns (ring-1 cards,
// rounded-lg, a tight 4/6/8/12/16/24px spacing rhythm) rather than a library default.
export default function HeadlessCompare() {
  const state = useRecoveryState()
  const [dark, setDark] = useState(false)
  const isPreOp = state.stage === 'pre-op'

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Recovery Map · Headless UI
          </span>
          <Switch
            checked={dark}
            onChange={setDark}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition data-[checked]:bg-blue-600 dark:bg-gray-700"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
          </Switch>
        </div>

        <div className="mx-auto max-w-md px-4 pb-16 pt-6">
          <div className="rounded-lg bg-white p-6 text-center ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {isPreOp ? 'Days until surgery' : `Week ${state.week} · Post-op day`}
            </div>
            <div className="my-2 text-6xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {isPreOp ? state.daysUntil : state.day}
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {isPreOp ? formatSurgeryDate(state.surgery) : state.phase.label}
            </div>
            <p className="mx-auto mt-2 max-w-[36ch] text-sm text-gray-500 dark:text-gray-400">
              {isPreOp ? `${SURGERY_INFO.procedure}. ${SURGERY_INFO.surgeon}.` : state.phase.summary}
            </p>
            {!isPreOp && state.nextPhase && (
              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                Next: {state.nextPhase.label} · day {state.nextPhase.startDay}
              </div>
            )}
          </div>

          <div className="mb-3 mt-8 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Core</div>
          <div className="flex flex-col gap-2">
            <NavRow title="Full timeline" subtitle="Day 0 through 12 months" />
            <NavRow title="Hard rules vs. my choices" subtitle="What the surgeons said vs. what I decided" />
            <NavRow title="Open questions" subtitle="2 unresolved with the care team" icon={<HelpCircle size={15} />} />
          </div>

          <div className="mb-3 mt-8 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Companion</div>
          <div className="flex flex-col gap-2">
            <NavRow title="Decisions & Questions" subtitle="24 unchecked" icon={<ClipboardList size={15} />} />
            <NavRow title="Prep · Meds · Diet" subtitle="Shopping list, the diet rule, sinus precautions" icon={<Utensils size={15} />} />
            <NavRow title="Journal" subtitle="Daily + weekly log, numbness trends" icon={<BookOpen size={15} />} />
          </div>
        </div>

        <button className="fixed inset-x-0 bottom-0 bg-red-600 py-4 text-center text-sm font-semibold text-white">
          ⚠ Red flags — call / ER
        </button>
      </div>
    </div>
  )
}

function NavRow({ title, subtitle, icon }) {
  return (
    <button className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-left ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  )
}
