'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  HelpCircle,
  Moon,
  Printer,
  Sun,
  SunMoon,
  Utensils,
} from 'lucide-react'
import {
  SURGERY_DATE,
  SURGERY_INFO,
  CATEGORIES,
  PHASES,
  HARD_RULES,
  MY_CHOICES,
  RED_FLAGS,
  RED_FLAGS_FOOTER,
  OPEN_QUESTIONS,
} from '../app/mma/map/data'
import { StatusBadge } from './mma-map/ui'
import { useChecklist, unresolvedCount } from './mma-map/storage'
import { DECISIONS_REVIEW, DECISIONS_PREOP, DECISIONS_LOGISTICS } from '../app/mma/map/data/decisions'
import DecisionsView from './mma-map/DecisionsView'
import PrepView from './mma-map/PrepView'
import JournalView from './mma-map/JournalView'

const VIEWS = ['home', 'timeline', 'rules', 'questions', 'redflags', 'decisions', 'prep', 'journal']

function daysBetween(fromDate, toDate) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const from = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
  const to = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())
  return Math.round((to - from) / MS_PER_DAY)
}

function getRecoveryState(now) {
  const surgery = new Date(`${SURGERY_DATE}T00:00:00`)
  const day = daysBetween(surgery, now)

  if (day < 0) {
    return { stage: 'pre-op', daysUntil: -day, surgery }
  }

  const phaseIndex = PHASES.findIndex((p) => day >= p.startDay && day <= p.endDay)
  const phase = PHASES[phaseIndex === -1 ? PHASES.length - 1 : phaseIndex]
  const nextPhase = phaseIndex === -1 ? null : PHASES[phaseIndex + 1] ?? null
  const week = Math.floor(day / 7)

  return { stage: 'post-op', day, week, phase, nextPhase, surgery }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function TopBar({ title, onBack, theme, cycleTheme }) {
  return (
    <div data-print-hide className="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[640px] items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          {onBack ? (
            <button type="button" onClick={onBack} className="btn btn-ghost btn-circle btn-sm -ml-1" aria-label="Back to dashboard">
              <ChevronLeft size={20} strokeWidth={2.25} />
            </button>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-widest text-base-content/60">Recovery Map</span>
          )}
          {title && <h1 className="truncate text-base font-semibold text-base-content">{title}</h1>}
        </div>
        <button
          type="button"
          onClick={cycleTheme}
          className="btn btn-ghost btn-circle btn-sm"
          aria-label={`Theme: ${theme}. Tap to change.`}
        >
          {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <SunMoon size={18} />}
        </button>
      </div>
    </div>
  )
}

function RedFlagBar({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-print-hide
      className="btn btn-error btn-block fixed inset-x-0 bottom-0 z-30 rounded-none pb-[max(0px,env(safe-area-inset-bottom))] text-base"
    >
      <AlertTriangle size={19} strokeWidth={2.25} />
      Red flags — call / ER
    </button>
  )
}

function NavCard({ title, subtitle, icon, onClick }) {
  return (
    <button type="button" onClick={onClick} className="card card-compact bg-base-100 border border-base-300 text-left">
      <div className="card-body flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <div>
            <div className="text-[15px] font-semibold text-base-content">{title}</div>
            <div className="text-xs text-base-content/60">{subtitle}</div>
          </div>
        </div>
        <ChevronDown size={18} className="-rotate-90 shrink-0 text-base-content/40" />
      </div>
    </button>
  )
}

function HomeView({ state, goTo }) {
  const isPreOp = state.stage === 'pre-op'

  const review = useChecklist('decisions:review')
  const preop = useChecklist('decisions:preop')
  const logistics = useChecklist('decisions:logistics')
  const openDecisions =
    unresolvedCount(review, DECISIONS_REVIEW.items) +
    unresolvedCount(preop, DECISIONS_PREOP.items) +
    unresolvedCount(logistics, DECISIONS_LOGISTICS.items)

  return (
    <div className="px-4 pb-10 pt-6">
      <div className="stats stats-vertical w-full border border-base-300 bg-base-100 shadow-sm">
        <div className="stat items-center text-center">
          <div className="stat-title">{isPreOp ? 'Days until surgery' : `Week ${state.week} · Post-op day`}</div>
          <div className="stat-value">{isPreOp ? state.daysUntil : state.day}</div>
          <div className="stat-desc mt-1 whitespace-normal text-sm font-semibold text-base-content">
            {isPreOp ? formatDate(state.surgery) : state.phase.label}
          </div>
          <p className="stat-desc mx-auto mt-2 max-w-[36ch] whitespace-normal normal-case">
            {isPreOp ? `${SURGERY_INFO.procedure}. ${SURGERY_INFO.surgeon}.` : state.phase.summary}
          </p>
          {!isPreOp && state.nextPhase && (
            <div className="badge badge-outline mt-3">
              Next: {state.nextPhase.label} · day {state.nextPhase.startDay}
            </div>
          )}
          {!isPreOp && (
            <button type="button" onClick={() => goTo('journal')} className="btn btn-link btn-sm mt-2 no-underline">
              Log today’s entry →
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <NavCard title="Full timeline" subtitle="Day 0 through 12 months" onClick={() => goTo('timeline')} />
        <NavCard title="Hard rules vs. my choices" subtitle="What the surgeons said vs. what I decided" onClick={() => goTo('rules')} />
        <NavCard
          title="Open questions"
          subtitle={`${OPEN_QUESTIONS.length} unresolved with the care team`}
          icon={<HelpCircle size={16} className="text-base-content/40" />}
          onClick={() => goTo('questions')}
        />
      </div>

      <div className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-base-content/50">Companion</div>
      <div className="flex flex-col gap-3">
        <NavCard
          title="Decisions & Questions"
          subtitle={`${openDecisions} unchecked`}
          icon={<ClipboardList size={16} className="text-base-content/40" />}
          onClick={() => goTo('decisions')}
        />
        <NavCard
          title="Prep · Meds · Diet"
          subtitle="Shopping list, the diet rule, sinus precautions"
          icon={<Utensils size={16} className="text-base-content/40" />}
          onClick={() => goTo('prep')}
        />
        <NavCard
          title="Journal"
          subtitle="Daily + weekly log, numbness trends"
          icon={<BookOpen size={16} className="text-base-content/40" />}
          onClick={() => goTo('journal')}
        />
      </div>
    </div>
  )
}

function PhaseCard({ phase, isCurrent, isOpen, onToggle }) {
  const grouped = useMemo(() => {
    const map = new Map()
    for (const note of phase.notes) {
      if (!map.has(note.category)) map.set(note.category, [])
      map.get(note.category).push(note)
    }
    return [...map.entries()]
  }, [phase])

  const dayRangeLabel =
    phase.endDay === Infinity
      ? `Day ${phase.startDay}+`
      : phase.startDay === phase.endDay
      ? `Day ${phase.startDay}`
      : `Days ${phase.startDay}–${phase.endDay}`

  return (
    <div
      data-print-avoid-break
      className={`collapse collapse-arrow border bg-base-100 ${isOpen ? 'collapse-open' : 'collapse-close'} ${
        isCurrent ? 'border-primary border-2' : 'border-base-300'
      }`}
    >
      <button type="button" onClick={onToggle} className="collapse-title min-w-0 pr-10" aria-expanded={isOpen}>
        {isCurrent && <div className="badge badge-primary badge-sm mb-1">You are here</div>}
        <div className="truncate text-[15px] font-semibold text-base-content">{phase.label}</div>
        <div className="text-xs text-base-content/50">
          {dayRangeLabel}
          {phase.dateLabel ? ` · ${phase.dateLabel}` : ''}
        </div>
      </button>
      <div className="collapse-content">
        <div className="space-y-4 pt-1">
          {grouped.map(([categoryId, notes]) => (
            <div key={categoryId}>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-content/50">
                {CATEGORIES[categoryId]?.label ?? categoryId}
              </div>
              <ul className="space-y-2">
                {notes.map((note, i) => (
                  <li key={i} className="text-sm leading-relaxed text-base-content">
                    <StatusBadge status={note.status} />
                    <div>{note.text}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TimelineView({ state }) {
  const currentPhaseId = state.stage === 'post-op' ? state.phase.id : null
  const [openId, setOpenId] = useState(currentPhaseId ?? PHASES[0].id)

  return (
    <div className="px-4 pb-28 pt-5">
      <p className="mb-4 text-sm leading-relaxed text-base-content/60">
        Unmarked notes are surgeon-confirmed.
        <span className="mx-1">🔶 Inferred</span>·<span className="ml-1">❓ Unconfirmed</span>
      </p>
      <div className="space-y-3">
        {PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isCurrent={phase.id === currentPhaseId}
            isOpen={openId === phase.id}
            onToggle={() => setOpenId((id) => (id === phase.id ? null : phase.id))}
          />
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-base-content/50">
        Phase boundaries beyond 6 weeks are approximate — converted from the surgeons’ month-based estimates, since the consults
        didn’t give exact days that far out.
      </p>
    </div>
  )
}

function RulesView() {
  return (
    <div className="space-y-6 px-4 pb-10 pt-5">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/60">Hard rules — from the surgeons</h2>
        <ul className="space-y-3">
          {HARD_RULES.map((rule) => (
            <li
              key={rule.id}
              data-print-avoid-break
              className="border-l-4 border-primary bg-base-100 px-4 py-3 text-sm leading-relaxed text-base-content"
            >
              {rule.text}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/60">My choices — not surgeon restrictions</h2>
        <ul className="space-y-3">
          {MY_CHOICES.map((choice) => (
            <li
              key={choice.id}
              data-print-avoid-break
              className="border-l-4 border-dashed border-base-content/30 bg-base-100 px-4 py-3 text-sm leading-relaxed text-base-content"
            >
              {choice.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function QuestionsView() {
  return (
    <div className="px-4 pb-10 pt-5">
      <p className="mb-4 text-sm leading-relaxed text-base-content/60">
        Unresolved — not restrictions, just things to get on record with the care team.
      </p>
      <ul className="space-y-3">
        {OPEN_QUESTIONS.map((q) => (
          <li key={q.id} data-print-avoid-break className="card card-compact border border-base-300 bg-base-100">
            <div className="card-body">
              <div className="mb-1 flex items-center gap-2">
                <span aria-hidden="true">❓</span>
                <h3 className="text-[15px] font-semibold text-base-content">{q.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-base-content/60">{q.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RedFlagsView() {
  return (
    <div data-print-root className="px-4 pb-10 pt-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-base-content">Red flags</h1>
        <button type="button" data-print-hide onClick={() => window.print()} className="btn btn-outline btn-sm">
          <Printer size={15} /> Print
        </button>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-base-content/60">Put this on the fridge. When in doubt, call.</p>
      <ul className="space-y-3">
        {RED_FLAGS.map((flag) => (
          <li
            key={flag.id}
            data-severity={flag.severity}
            data-print-avoid-break
            className="rounded-2xl border border-[var(--glance-border)] bg-[var(--glance-bg)] px-6 py-6"
          >
            <div className="mb-2 text-lg font-bold leading-snug text-base-content">{flag.sign}</div>
            <div className="text-sm leading-relaxed text-base-content/70">{flag.action}</div>
            {flag.detail && <div className="mt-2 text-xs leading-relaxed text-base-content/55">{flag.detail}</div>}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-base-content/60">{RED_FLAGS_FOOTER}</p>
    </div>
  )
}

export default function MmaRecoveryMap() {
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState('home')
  const [theme, setTheme] = useState('system')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    setMounted(true)

    const applyHash = () => {
      const h = window.location.hash.replace('#', '')
      setView(VIEWS.includes(h) ? h : 'home')
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)

    try {
      const stored = window.localStorage.getItem('mma-map-theme')
      if (stored) setTheme(stored)
    } catch (e) {}

    const tick = setInterval(() => setNow(new Date()), 60 * 60 * 1000)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/mma-map-sw.js', { scope: '/mma/map' }).catch(() => {})
    }

    return () => {
      window.removeEventListener('hashchange', applyHash)
      clearInterval(tick)
    }
  }, [])

  const goTo = useCallback((v) => {
    window.location.hash = v === 'home' ? '' : v
    setView(v)
    window.scrollTo(0, 0)
  }, [])

  const cycleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'
      try {
        window.localStorage.setItem('mma-map-theme', next)
      } catch (e) {}
      return next
    })
  }, [])

  const [systemDark, setSystemDark] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mq.matches)
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
  const state = useMemo(() => getRecoveryState(now), [now])

  const titles = {
    home: null,
    timeline: 'Timeline',
    rules: 'Rules vs. choices',
    questions: 'Open questions',
    redflags: null,
    decisions: 'Decisions & Questions',
    prep: 'Prep · Meds · Diet',
    journal: 'Journal',
  }

  return (
    <div
      className="map-root min-h-screen bg-base-200 font-sans"
      data-theme={resolvedTheme}
      style={{ visibility: mounted ? 'visible' : 'hidden' }}
    >
      <style jsx global>{`
        /*
         * Plain opaque hex for the "glanceable" red-tinted cards (red flags,
         * diet rule, sinus precautions) instead of daisyUI's oklch bg-error/10 +
         * border-error/20. Chromium has a print-rasterization bug where
         * alpha-blended oklch colors shift hue (verified: identical computed
         * border-color on screen vs. print, but renders teal instead of red) —
         * these three spots must print correctly, so they get real hex.
         */
        .map-root[data-theme='light'] {
          --glance-bg: #fce8e6;
          --glance-border: #f3c6c2;
        }
        .map-root[data-theme='dark'] {
          --glance-bg: #3a211d;
          --glance-border: #5c322b;
        }
        @media print {
          .map-root {
            background: #fff !important;
            visibility: visible !important;
          }
          .map-root [data-print-hide] {
            display: none !important;
          }
          .map-root .collapse-content {
            grid-template-rows: 1fr !important;
            visibility: visible !important;
            padding-bottom: 1rem !important;
          }
          .map-root,
          .map-root * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .map-root [data-print-avoid-break] {
            break-inside: avoid;
          }
          @page {
            margin: 14mm;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .map-root .collapse-content,
          .map-root .collapse-title {
            transition: none !important;
          }
        }
      `}</style>

      <TopBar title={titles[view]} onBack={view === 'home' ? null : () => goTo('home')} theme={theme} cycleTheme={cycleTheme} />

      <main className="mx-auto max-w-[640px] pb-24">
        {view === 'home' && <HomeView state={state} goTo={goTo} />}
        {view === 'timeline' && <TimelineView state={state} />}
        {view === 'rules' && <RulesView />}
        {view === 'questions' && <QuestionsView />}
        {view === 'redflags' && <RedFlagsView />}
        {view === 'decisions' && <DecisionsView />}
        {view === 'prep' && <PrepView />}
        {view === 'journal' && <JournalView />}
      </main>

      {view !== 'redflags' && <RedFlagBar onOpen={() => goTo('redflags')} />}
    </div>
  )
}
