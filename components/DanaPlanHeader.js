'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { getCurrentWeek, getCanonicalRun, formatRaceDate } from '../lib/dana-plan-utils'
import { T, social, nichrome, rule, chip, pressable } from './planStyle'

const VIEWS = [
  { slug: '', label: 'Week', view: 'cards' },
  { slug: 'calendar', label: 'Month', view: 'calendar' },
  { slug: 'lifts', label: 'Lifts', view: 'lifts' },
]
const basePath = '/dana-plan-v2'

const weekMiles = (w) => Math.round((w.days || []).reduce((n, d) => n + getCanonicalRun(d).mi, 0))
const isDown = (w) => /DOWN|RESTORE/i.test(w.type || '')
const phaseName = (type = '') => {
  const name = type.split('·')[0].trim().toLowerCase()
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// The ramp: one bar per week, height is the week's miles. Tapping a bar picks
// the week, so it doubles as the week picker on every screen size.
function Ramp({ planData, selectedWeek, currentWeek, onWeekChange }) {
  const weeks = planData.weeks
  const max = Math.max(...weeks.map(weekMiles), 1)
  return (
    <div className="pt-[16px] md:pt-[20px] border-t" style={rule()}>
      <div className={`${social} flex items-baseline justify-between text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px] mb-[16px]`}>
        <span>Miles by week</span>
        <span className="opacity-70">● this week · tap a bar to jump</span>
      </div>
      <ol className="grid gap-[3px] md:gap-[6px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
        {weeks.map((w) => {
          const mi = weekMiles(w)
          const on = w.week === selectedWeek
          return (
            <li key={w.week}>
              <button
                type="button"
                onClick={() => onWeekChange(w.week)}
                aria-label={`Week ${w.week}, ${w.dateRange}, ${mi} miles`}
                aria-pressed={on}
                className={`group w-full flex flex-col items-stretch ${pressable}`}
              >
                <span className={`${social} block text-center text-[12px] md:text-[15px] leading-none tabular-nums mb-[6px] ${on ? '' : 'opacity-70'}`}>{mi}</span>
                <span className="relative block h-[72px] md:h-[120px]">
                  <span
                    className="absolute bottom-0 left-0 right-0 rounded-[2px] transition-[background-color,opacity] duration-[120ms] ease-out group-hover:opacity-100 motion-reduce:transition-none"
                    style={{
                      height: `${Math.max(6, (mi / max) * 100)}%`,
                      backgroundColor: on ? T.ink : `${T.ink}${isDown(w) ? '26' : '4D'}`,
                    }}
                  />
                </span>
                <span className={`${social} block text-center text-[12px] md:text-[14px] leading-none tabular-nums mt-[8px] ${on ? '' : 'opacity-60'}`}>
                  {w.week === currentWeek ? '●' : w.week}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function DanaPlanHeader({ planData, selectedWeek, onWeekChange, currentView, showRamp = false }) {
  // The body still carries the old green under the page; match it so overscroll stays Bone.
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', T.bg)
    return () => document.documentElement.style.removeProperty('--page-bg')
  }, [])

  const currentWeek = getCurrentWeek(planData)
  const maxWeek = planData.weeks.length
  const week = planData.weeks.find((w) => w.week === selectedWeek)
  const btn = `${chip} ${pressable} px-[10px] py-[6px] text-[16px] md:text-[17px] hover:bg-[var(--ink)] hover:text-[var(--bg)] disabled:opacity-30 disabled:pointer-events-none`

  return (
    <header style={{ '--ink': T.ink, '--bg': T.bg }}>
      <section className="pt-[32px] pb-[40px] md:pt-[100px] md:pb-[64px]">
        <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1100px]`}>
          {planData.statement || planData.planTitle}
        </h1>
        <p className={`${social} mt-[16px] md:mt-[24px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px] tabular-nums`}>
          <span className="opacity-70">
            {planData.planTitle} · {planData.planDates || formatRaceDate(planData)} · {maxWeek} weeks ·{' '}
          </span>
          <Link href="/row" className="hl">
            Erg log
          </Link>
        </p>
      </section>

      {/* Views left, week controls right. On a phone the views move to the bottom bar. */}
      <div className="flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[12px] pb-[24px] md:pb-[32px]">
        <nav aria-label="Plan views" className="hidden md:flex items-baseline gap-[24px]">
          {VIEWS.map((v) => {
            const active = currentView === v.view
            return (
              <Link
                key={v.view}
                href={v.slug ? `${basePath}/${v.slug}` : basePath}
                aria-current={active ? 'page' : undefined}
                className={`${social} text-[18px] md:text-[19px] leading-none tracking-[0.19px] transition-opacity hover:opacity-100 ${active ? 'opacity-100 underline underline-offset-[5px]' : 'opacity-70'}`}
              >
                {v.label}
              </Link>
            )
          })}
        </nav>
        {onWeekChange && (
          <div className="flex w-full md:w-auto items-center gap-[8px]">
            <button type="button" className={btn} onClick={() => onWeekChange(Math.max(1, selectedWeek - 1))} disabled={selectedWeek <= 1} aria-label="Previous week">
              ←
            </button>
            <select
              value={selectedWeek}
              onChange={(e) => onWeekChange(Number(e.target.value))}
              aria-label="Week"
              className={`${btn} min-w-0 flex-1 md:flex-none md:min-w-[280px] truncate appearance-none bg-transparent cursor-pointer pr-[28px] hover:bg-transparent hover:text-current`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(T.ink)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {planData.weeks.map((w) => (
                <option key={w.week} value={w.week}>
                  Week {w.week}, {w.dateRange}, {phaseName(w.type)}
                  {w.week === currentWeek ? ' (now)' : ''}
                </option>
              ))}
            </select>
            <button type="button" className={btn} onClick={() => onWeekChange(Math.min(maxWeek, selectedWeek + 1))} disabled={selectedWeek >= maxWeek} aria-label="Next week">
              →
            </button>
            <button type="button" className={btn} onClick={() => onWeekChange(currentWeek)} disabled={selectedWeek === currentWeek}>
              <span className="md:hidden">Now</span>
              <span className="hidden md:inline">This week</span>
            </button>
          </div>
        )}
      </div>

      {showRamp && week && (
        <div className="pb-[48px] md:pb-[80px]">
          <Ramp planData={planData} selectedWeek={selectedWeek} currentWeek={currentWeek} onWeekChange={onWeekChange} />
        </div>
      )}

      {/* Phone: views as a fixed bottom bar on the page field. */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t safe-area-pb"
        style={{ backgroundColor: T.bg, color: T.ink, ...rule() }}
        aria-label="Plan views"
      >
        {VIEWS.map((v) => {
          const active = currentView === v.view
          return (
            <Link
              key={v.view}
              href={v.slug ? `${basePath}/${v.slug}` : basePath}
              aria-current={active ? 'page' : undefined}
              className={`${social} py-[14px] text-center text-[18px] leading-none tracking-[0.19px] ${active ? 'opacity-100 underline underline-offset-[5px]' : 'opacity-70'}`}
            >
              {v.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
