'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DanaPlanHeader from './DanaPlanHeader'
import { PLAN_URL, getCurrentWeek, getDayDate, formatShortDate, getDayContentWithPT, getCanonicalRun, dateKey } from '../lib/dana-plan-utils'
import { T, social, ultra, rule, chip, pressable, formatContentHtml } from './planStyle'

// Week view: the week's target and notes, then one row per day. Rows on every
// screen size, since the lift lists are too long for seven narrow columns.
// On a phone each row folds; from md up they're all open.

const body = `${social} text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`

// Just the exercise lines, for pasting into a Strava description. Days with
// no list (rest, run only) fall back to the day's text without markdown.
function buildStravaCopyText(dayData, pt) {
  if (!dayData) return ''
  const content = getDayContentWithPT(dayData.day, dayData.content, pt)
  const lines = content.split('\n').map((l) => l.trim())
  const exercises = lines.filter((l) => /^[-*] /.test(l)).map((l) => '- ' + l.slice(2).trim())
  if (exercises.length) return exercises.join('\n')
  return content.replace(/\*\*/g, '').trim()
}

// What the day holds, as chips: run, row, lift.
function Meta({ day }) {
  const { distance, vert } = getCanonicalRun(day)
  const s = day.summary || {}
  const items = [
    distance && ['Run', [distance, vert].filter(Boolean).join(' · ')],
    s.rowOneLine && ['Row', s.rowOneLine],
    s.strengthOneLine && ['Lift', s.strengthOneLine.split(':')[0]],
  ].filter(Boolean)
  if (!items.length) return null
  return (
    <ul className="flex flex-wrap gap-[6px] mt-[10px]">
      {items.map(([k, v]) => (
        <li key={k} className={`${chip} opacity-80`}>
          <span className="opacity-60">{k}</span> {v}
        </li>
      ))}
    </ul>
  )
}

function CopyButton({ dayData, copiedDay, onCopy }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onCopy(dayData)
      }}
      className={`${chip} ${pressable} hover:bg-[var(--ink)] hover:text-[var(--bg)]`}
      aria-label={`Copy ${dayData.day} for Strava`}
    >
      {copiedDay === dayData.day ? 'Copied' : 'Copy'}
    </button>
  )
}

function DayRow({ dayData, dateLabel, isToday, pt, copiedDay, onCopy }) {
  const [open, setOpen] = useState(false)
  const content = getDayContentWithPT(dayData.day, dayData.content, pt)
  const isRest = /^rest/i.test(dayData.title)
  return (
    <li className="border-t pt-[16px] md:pt-[20px] pb-[24px] md:pb-[32px]" style={rule()}>
      <div className="md:grid md:grid-cols-12 md:gap-x-[48px]">
        <div className="md:col-span-4 lg:col-span-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="md:pointer-events-none w-full text-left flex items-start justify-between gap-[12px]"
          >
            <span>
              <span className={`${social} flex items-baseline gap-[10px] text-[16px] md:text-[17px] leading-none tabular-nums`}>
                <span>{dayData.day}</span>
                <span className="opacity-60">{dateLabel}</span>
                {isToday && <span className={`${chip} -my-[3px]`} style={{ backgroundColor: T.ink, color: T.bg, borderColor: T.ink }}>Today</span>}
              </span>
              <span className={`${social} block mt-[8px] text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px] ${isRest ? 'opacity-70' : ''}`}>{dayData.title}</span>
            </span>
            <span aria-hidden className={`${social} md:hidden text-[20px] leading-none w-[20px] text-right`}>
              {open ? '–' : '+'}
            </span>
          </button>
          <Meta day={dayData} />
          {content && (
            <div className="hidden md:block mt-[14px]">
              <CopyButton dayData={dayData} copiedDay={copiedDay} onCopy={onCopy} />
            </div>
          )}
        </div>
        {content && (
          <div className={`${open ? 'block' : 'hidden'} md:block md:col-span-8 lg:col-span-9 mt-[16px] md:mt-0`}>
            <div
              className={`${body} max-w-[720px] [&_strong]:font-normal [&_strong]:underline [&_strong]:underline-offset-[3px] [&_strong]:decoration-[1px] [&_br]:block [&_br]:h-[6px]`}
              dangerouslySetInnerHTML={{ __html: formatContentHtml(content) }}
            />
            <div className="md:hidden mt-[14px]">
              <CopyButton dayData={dayData} copiedDay={copiedDay} onCopy={onCopy} />
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

export function PlanStatus({ children, error }) {
  return <div className={`${body} px-[20px] md:px-[26px] pt-[100px] pb-[160px] ${error ? '' : 'opacity-70'}`}>{children}</div>
}

export default function DanaPlanViewer() {
  const [planData, setPlanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [copiedDay, setCopiedDay] = useState(null)

  useEffect(() => {
    fetch(PLAN_URL)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data) => {
        setPlanData(data)
        setSelectedWeek(getCurrentWeek(data))
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!planData) return
    const maxWeek = planData.weeks.length
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return
      if (e.key === 'ArrowLeft' && selectedWeek > 1) {
        setSelectedWeek(selectedWeek - 1)
        e.preventDefault()
      }
      if (e.key === 'ArrowRight' && selectedWeek < maxWeek) {
        setSelectedWeek(selectedWeek + 1)
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [planData, selectedWeek])

  useEffect(() => {
    if (!copiedDay) return
    const id = setTimeout(() => setCopiedDay(null), 1600)
    return () => clearTimeout(id)
  }, [copiedDay])

  const pt = planData?.pt || {}
  const handleCopy = async (dayData) => {
    try {
      const text = buildStravaCopyText(dayData, pt)
      if (!text) return
      await navigator.clipboard.writeText(text)
      setCopiedDay(dayData.day)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  if (loading) return <PlanStatus>Loading…</PlanStatus>
  if (error || !planData) return <PlanStatus error>Could not load the plan. {error}</PlanStatus>

  const week = planData.weeks.find((w) => w.week === selectedWeek)
  const todayKey = dateKey(new Date())

  return (
    <div className="px-[20px] md:px-[26px] pb-[120px] md:pb-[120px]">
      <DanaPlanHeader planData={planData} selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} currentView="cards" showRamp />
      {week && (
        <section aria-labelledby="week-heading">
          <div className="md:grid md:grid-cols-12 md:gap-x-[48px] pb-[40px] md:pb-[64px]">
            <div className="md:col-span-4 lg:col-span-3">
              <h2 id="week-heading" className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`}>
                Week {week.week}
              </h2>
              <p className={`${social} mt-[12px] text-[16px] md:text-[17px] leading-[1.3] tabular-nums opacity-70`}>
                {week.dateRange} · {week.type.charAt(0) + week.type.slice(1).toLowerCase()}
              </p>
            </div>
            <div className="md:col-span-8 lg:col-span-9 mt-[20px] md:mt-0">
              {week.target && <p className={`${social} text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px] tabular-nums`}>{week.target}</p>}
              {week.content && (
                <div className={`${body} mt-[14px] max-w-[720px] [&_p]:mb-[10px] [&_strong]:font-normal [&_strong]:underline [&_strong]:underline-offset-[3px] [&_strong]:decoration-[1px]`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{week.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
          <ol>
            {week.days.map((d) => {
              const date = getDayDate(planData, week.week, d.day)
              return (
                <DayRow
                  key={`${week.week}-${d.day}`}
                  dayData={d}
                  dateLabel={date ? formatShortDate(date) : ''}
                  isToday={date ? dateKey(date) === todayKey : false}
                  pt={pt}
                  copiedDay={copiedDay}
                  onCopy={handleCopy}
                />
              )
            })}
          </ol>
        </section>
      )}
    </div>
  )
}
