'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  Moon,
  Phone,
  Printer,
  Sun,
  SunMoon,
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

const VIEWS = ['home', 'timeline', 'rules', 'questions', 'redflags']

const STATUS_META = {
  confirmed: { mark: '✅', label: 'Surgeon confirmed' },
  inference: { mark: '🔶', label: 'Inference / choice' },
  question: { mark: '❓', label: 'Needs confirming' },
}

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

function StatusBadge({ status }) {
  const meta = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-[5px] shrink-0 rounded-full px-2 py-[3px] text-[11px] font-medium tracking-[0.02em] border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--muted)]">
      <span aria-hidden="true">{meta.mark}</span>
      <span>{meta.label}</span>
    </span>
  )
}

function Collapsible({ open, children }) {
  return (
    <div className="mma-collapsible-panel" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
      <div>{children}</div>
    </div>
  )
}

function TopBar({ title, onBack, theme, cycleTheme }) {
  return (
    <div
      data-print-hide
      className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur px-4 py-3"
    >
      <div className="flex max-w-[640px] mx-auto items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mma-btn-press -ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[var(--fg)]"
              aria-label="Back to dashboard"
            >
              <ChevronLeft size={22} strokeWidth={2.25} />
            </button>
          ) : (
            <span className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Recovery Map
            </span>
          )}
          {title && (
            <h1 className="truncate font-['Haas_Grot_Disp',_sans-serif] text-[16px] tracking-[0.01em] text-[var(--fg)]">
              {title}
            </h1>
          )}
        </div>
        <button
          type="button"
          onClick={cycleTheme}
          className="mma-btn-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--fg)]"
          aria-label={`Theme: ${theme}. Tap to change.`}
        >
          {theme === 'dark' ? <Moon size={19} /> : theme === 'light' ? <Sun size={19} /> : <SunMoon size={19} />}
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
      className="mma-btn-press fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-2 border-t border-black/20 bg-[#B3271F] px-4 py-4 text-[15px] font-semibold tracking-[0.01em] text-white pb-[max(16px,env(safe-area-inset-bottom))]"
    >
      <AlertTriangle size={19} strokeWidth={2.25} />
      Red flags — call / ER
    </button>
  )
}

function HomeView({ state, goTo }) {
  const isPreOp = state.stage === 'pre-op'

  return (
    <div className="px-5 pb-10 pt-6">
      <div className="rounded-[20px] border border-[var(--line)] bg-[var(--card)] px-5 py-7 text-center">
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          {isPreOp ? 'Days until surgery' : `Week ${state.week} · Post-op day`}
        </div>
        <div className="font-['Mondwest',_sans-serif] text-[92px] leading-[1] text-[var(--accent)] my-2">
          {isPreOp ? state.daysUntil : state.day}
        </div>
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[19px] text-[var(--fg)]">
          {isPreOp ? formatDate(state.surgery) : state.phase.label}
        </div>
        <p className="mt-2 text-[14px] leading-[1.5] text-[var(--muted)] max-w-[38ch] mx-auto">
          {isPreOp
            ? `${SURGERY_INFO.procedure}. ${SURGERY_INFO.surgeon}.`
            : state.phase.summary}
        </p>
        {!isPreOp && state.nextPhase && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-[6px] text-[12px] text-[var(--muted)]">
            Next: {state.nextPhase.label} · day {state.nextPhase.startDay}
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => goTo('timeline')}
          className="mma-btn-press flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-[var(--card)] px-5 py-4 text-left"
        >
          <div>
            <div className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[var(--fg)]">Full timeline</div>
            <div className="text-[13px] text-[var(--muted)]">Day 0 through 12 months</div>
          </div>
          <ChevronDown size={18} className="-rotate-90 text-[var(--muted)]" />
        </button>

        <button
          type="button"
          onClick={() => goTo('rules')}
          className="mma-btn-press flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-[var(--card)] px-5 py-4 text-left"
        >
          <div>
            <div className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[var(--fg)]">Hard rules vs. my choices</div>
            <div className="text-[13px] text-[var(--muted)]">What the surgeons said vs. what I decided</div>
          </div>
          <ChevronDown size={18} className="-rotate-90 text-[var(--muted)]" />
        </button>

        <button
          type="button"
          onClick={() => goTo('questions')}
          className="mma-btn-press flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-[var(--card)] px-5 py-4 text-left"
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-[var(--muted)]" />
            <div>
              <div className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[var(--fg)]">Open questions</div>
              <div className="text-[13px] text-[var(--muted)]">{OPEN_QUESTIONS.length} unresolved with the care team</div>
            </div>
          </div>
          <ChevronDown size={18} className="-rotate-90 text-[var(--muted)]" />
        </button>
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
      className={`rounded-[16px] border bg-[var(--card)] overflow-hidden ${
        isCurrent ? 'border-[var(--accent)] border-2' : 'border-[var(--line)]'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="mma-btn-press flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          {isCurrent && (
            <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--accent-fg)]">
              You are here
            </div>
          )}
          <div className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[var(--fg)] truncate">{phase.label}</div>
          <div className="text-[12px] text-[var(--muted)]">{dayRangeLabel}{phase.dateLabel ? ` · ${phase.dateLabel}` : ''}</div>
        </div>
        <ChevronDown
          data-print-hide
          size={18}
          className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <Collapsible open={isOpen}>
        <div className="px-4 pb-4 pt-0 space-y-4">
          {grouped.map(([categoryId, notes]) => (
            <div key={categoryId}>
              <div className="font-['Haas_Grot_Disp',_sans-serif] text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-1.5">
                {CATEGORIES[categoryId]?.label ?? categoryId}
              </div>
              <ul className="space-y-2">
                {notes.map((note, i) => (
                  <li key={i} className="text-[14px] leading-[1.55] text-[var(--fg)]">
                    <div className="mb-1"><StatusBadge status={note.status} /></div>
                    {note.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

function TimelineView({ state }) {
  const currentPhaseId = state.stage === 'post-op' ? state.phase.id : null
  const [openId, setOpenId] = useState(currentPhaseId ?? PHASES[0].id)

  return (
    <div className="px-5 pb-28 pt-5">
      <p className="mb-4 text-[13px] leading-[1.5] text-[var(--muted)]">
        <span className="mr-1">✅ surgeon confirmed</span>·
        <span className="mx-1">🔶 inference / my choice</span>·
        <span className="ml-1">❓ needs confirming</span>
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
      <p className="mt-5 text-[12px] leading-[1.5] text-[var(--muted)]">
        Phase boundaries beyond 6 weeks are approximate — converted from the surgeons’ month-based
        estimates, since the consults didn’t give exact days that far out.
      </p>
    </div>
  )
}

function RulesView() {
  return (
    <div className="px-5 pb-10 pt-5 space-y-6">
      <section>
        <h2 className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] uppercase tracking-[0.14em] text-[var(--fg)] mb-3">
          Hard rules — from the surgeons
        </h2>
        <ul className="space-y-3">
          {HARD_RULES.map((rule) => (
            <li
              key={rule.id}
              data-print-avoid-break
              className="rounded-[14px] border-l-[4px] border-[var(--accent)] bg-[var(--card)] px-4 py-3 text-[14px] leading-[1.55] text-[var(--fg)]"
            >
              {rule.text}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] uppercase tracking-[0.14em] text-[var(--fg)] mb-3">
          My choices — not surgeon restrictions
        </h2>
        <ul className="space-y-3">
          {MY_CHOICES.map((choice) => (
            <li
              key={choice.id}
              data-print-avoid-break
              className="rounded-[14px] border-l-[4px] border-dashed border-[var(--muted)] bg-[var(--card)] px-4 py-3 text-[14px] leading-[1.55] text-[var(--fg)]"
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
    <div className="px-5 pb-10 pt-5">
      <p className="mb-4 text-[13px] leading-[1.5] text-[var(--muted)]">
        Unresolved — not restrictions, just things to get on record with the care team.
      </p>
      <ul className="space-y-3">
        {OPEN_QUESTIONS.map((q) => (
          <li key={q.id} data-print-avoid-break className="rounded-[16px] border border-[var(--line)] bg-[var(--card)] px-4 py-4">
            <div className="mb-1.5 flex items-center gap-2">
              <span aria-hidden="true">❓</span>
              <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[15px] text-[var(--fg)]">{q.title}</h3>
            </div>
            <p className="text-[14px] leading-[1.55] text-[var(--muted)]">{q.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

const SEVERITY_STYLE = {
  er: 'border-[#B3271F] bg-[#B3271F]/12',
  call: 'border-[#B4790E] bg-[#B4790E]/10',
  'call-nonurgent': 'border-[var(--line)] bg-[var(--card)]',
}
const SEVERITY_LABEL = {
  er: 'GO TO THE ER',
  call: 'CALL THE SURGEON',
  'call-nonurgent': 'CALL — NOT URGENT',
}

function RedFlagsView() {
  return (
    <div data-print-root className="px-5 pb-10 pt-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="font-['Haas_Grot_Disp',_sans-serif] text-[18px] text-[var(--fg)] flex items-center gap-2">
          <AlertTriangle size={20} className="text-[#B3271F]" />
          Red flags
        </h1>
        <button
          type="button"
          data-print-hide
          onClick={() => window.print()}
          className="mma-btn-press flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-[7px] text-[13px] text-[var(--fg)]"
        >
          <Printer size={15} /> Print
        </button>
      </div>
      <p className="mb-4 text-[13px] leading-[1.5] text-[var(--muted)]">
        Put this on the fridge. When in doubt, call.
      </p>
      <ul className="space-y-3">
        {RED_FLAGS.map((flag) => (
          <li
            key={flag.id}
            data-severity={flag.severity}
            data-print-avoid-break
            className={`rounded-[14px] border-2 px-4 py-4 ${SEVERITY_STYLE[flag.severity]}`}
          >
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--fg)]">
              {flag.severity === 'er' && <Phone size={13} />}
              {SEVERITY_LABEL[flag.severity]}
            </div>
            <div className="font-['Haas_Grot_Disp',_sans-serif] text-[15px] leading-[1.4] text-[var(--fg)]">
              {flag.sign}
            </div>
            <div className="mt-1 text-[13.5px] leading-[1.5] text-[var(--muted)]">{flag.action}</div>
            {flag.detail && <div className="mt-1 text-[12.5px] leading-[1.5] text-[var(--muted)] italic">{flag.detail}</div>}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[13px] leading-[1.5] text-[var(--muted)]">{RED_FLAGS_FOOTER}</p>
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
      navigator.serviceWorker.register('/mma-map-sw.js', { scope: '/mma/map/' }).catch(() => {})
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

  const titles = { home: null, timeline: 'Timeline', rules: 'Rules vs. choices', questions: 'Open questions', redflags: null }

  return (
    <div
      className="map-root min-h-screen"
      data-theme={resolvedTheme}
      style={{ visibility: mounted ? 'visible' : 'hidden', background: 'var(--bg)', color: 'var(--fg)' }}
    >
      <style jsx global>{`
        .map-root {
          --bg: #f6f2ea;
          --fg: #1c1a16;
          --muted: #6b6558;
          --card: #ffffff;
          --line: #e2dccc;
          --chip-bg: #efe9db;
          --accent: #3f5d4a;
          --accent-fg: #f6f2ea;
          font-family: 'Inter', sans-serif;
        }
        .map-root[data-theme='dark'] {
          --bg: #101210;
          --fg: #f2f0ea;
          --muted: #9a988e;
          --card: #191b18;
          --line: #2b2e29;
          --chip-bg: #1f221d;
          --accent: #7fa789;
          --accent-fg: #0d150f;
        }

        @media print {
          .map-root {
            background: #fff !important;
            color: #111 !important;
            visibility: visible !important;
          }
          .map-root [data-print-hide] {
            display: none !important;
          }
          .map-root .mma-collapsible-panel {
            grid-template-rows: 1fr !important;
          }
          .map-root .mma-collapsible-panel > div {
            overflow: visible !important;
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
      `}</style>

      <TopBar title={titles[view]} onBack={view === 'home' ? null : () => goTo('home')} theme={theme} cycleTheme={cycleTheme} />

      <main className="pb-24 max-w-[640px] mx-auto">
        {view === 'home' && <HomeView state={state} goTo={goTo} />}
        {view === 'timeline' && <TimelineView state={state} />}
        {view === 'rules' && <RulesView />}
        {view === 'questions' && <QuestionsView />}
        {view === 'redflags' && <RedFlagsView />}
      </main>

      {view !== 'redflags' && <RedFlagBar onOpen={() => goTo('redflags')} />}
    </div>
  )
}
