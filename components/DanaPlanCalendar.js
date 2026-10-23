'use client'

import { useState, useEffect, useMemo } from 'react'
import DanaPlanHeader from './DanaPlanHeader'
import { PlanStatus } from './DanaPlanViewer'
import { PLAN_URL, getCurrentWeek, dateKey, parseLocalDate, getCanonicalRun, getDayContentWithPT, DAY_ORDER, MONTH_NAMES } from '../lib/dana-plan-utils'
import { T, social, ultra, rule, chip, pressable, formatContentHtml } from './planStyle'

// Month view, weeks starting Monday to match the plan. Each cell is a hairline
// rule and the day's run, row and lift, with the week's miles at the end of
// each row. Tapping a planned day opens it.

function contentForDay(w, d) {
  let raw = (d.content || '').trim()
  if (raw.length >= 120) return raw
  const weekBlob = (w.content || '').trim()
  if (!weekBlob) return raw
  const re = new RegExp('####\\s+' + d.day.replace(/\s+/g, '\\s+') + '[^\\n]*\\n([\\s\\S]*?)(?=####|$)', 'i')
  const m = weekBlob.match(re)
  if (m && m[1] && m[1].trim().length > raw.length) return m[1].trim()
  return raw
}

function buildDateMap(planData) {
  const map = {}
  if (!planData?.weeks?.length || !planData.startDate) return map
  const start = parseLocalDate(planData.startDate)
  const pt = planData.pt || {}
  planData.weeks.forEach((w) => {
    const weekStart = new Date(start)
    weekStart.setDate(weekStart.getDate() + (w.week - 1) * 7)
    ;(w.days || []).forEach((d) => {
      const dayIdx = DAY_ORDER.indexOf(d.day)
      if (dayIdx === -1) return
      const cellDate = new Date(weekStart)
      cellDate.setDate(weekStart.getDate() + dayIdx)
      const s = d.summary || {}
      const { distance, mi, v } = getCanonicalRun(d)
      map[dateKey(cellDate)] = {
        lines: [distance && `Run ${distance}`, s.rowOneLine && 'Row', s.strengthOneLine && s.strengthOneLine.split(':')[0]].filter(Boolean),
        title: d.title,
        week: w.week,
        mi,
        v,
        content: getDayContentWithPT(d.day, contentForDay(w, d), pt),
      }
    })
  })
  return map
}

export default function DanaPlanCalendar() {
  const [planData, setPlanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [calYear, setCalYear] = useState(2026)
  const [calMonth, setCalMonth] = useState(9)
  const [dayModal, setDayModal] = useState(null)

  const dateToDay = useMemo(() => (planData ? buildDateMap(planData) : {}), [planData])

  useEffect(() => {
    fetch(PLAN_URL)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data) => {
        setPlanData(data)
        setError(null)
        // Open on this month while the plan is running, else the month it starts.
        const start = parseLocalDate(data.startDate)
        const end = new Date(start)
        end.setDate(end.getDate() + data.weeks.length * 7 - 1)
        const today = new Date()
        const at = today >= new Date(start.getFullYear(), start.getMonth(), 1) && today <= end ? today : start
        setCalYear(at.getFullYear())
        setCalMonth(at.getMonth())
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const step = (n) => {
    const d = new Date(calYear, calMonth + n, 1)
    setCalYear(d.getFullYear())
    setCalMonth(d.getMonth())
  }

  useEffect(() => {
    if (!planData) return
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return
      if (e.key === 'Escape') return setDayModal(null)
      if (dayModal) return
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (loading) return <PlanStatus>Loading…</PlanStatus>
  if (error || !planData) return <PlanStatus error>Could not load the plan. {error}</PlanStatus>

  const todayKey = dateKey(new Date())
  const first = new Date(calYear, calMonth, 1)
  const lead = (first.getDay() + 6) % 7 // Monday first
  const cells = Array.from({ length: 42 }, (_, i) => new Date(calYear, calMonth, i - lead + 1))
  const rows = cells[35].getMonth() === calMonth ? 6 : 5
  const btn = `${chip} ${pressable} px-[10px] py-[6px] text-[16px] md:text-[17px] hover:bg-[var(--ink)] hover:text-[var(--bg)]`

  const modalInfo = dayModal ? dateToDay[dayModal] : null
  const modalDate = dayModal ? parseLocalDate(dayModal) : null

  return (
    <div className="px-[20px] md:px-[26px] pb-[120px]" style={{ '--ink': T.ink, '--bg': T.bg }}>
      <DanaPlanHeader planData={planData} currentView="calendar" selectedWeek={getCurrentWeek(planData)} />

      <div className="flex items-center justify-between gap-[12px] pb-[24px] md:pb-[32px]">
        <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`}>
          {MONTH_NAMES[calMonth]} {calYear}
        </h2>
        <div className="flex gap-[8px]">
          <button type="button" className={btn} onClick={() => step(-1)} aria-label="Previous month">
            ←
          </button>
          <button type="button" className={btn} onClick={() => step(1)} aria-label="Next month">
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(7,minmax(0,1fr))_auto] gap-x-[4px] md:gap-x-[16px]">
        {DAY_ORDER.map((name) => (
          <div key={name} className={`${social} pb-[10px] text-[14px] md:text-[17px] leading-none opacity-70`}>
            <span className="md:hidden">{name.slice(0, 2)}</span>
            <span className="hidden md:inline">{name.slice(0, 3)}</span>
          </div>
        ))}
        <div className={`${social} pb-[10px] text-[14px] md:text-[17px] leading-none opacity-70 text-right`}>
          <span className="md:hidden">Mi</span>
          <span className="hidden md:inline">Total</span>
        </div>
        {cells.slice(0, rows * 7).flatMap((d, i) => {
          const key = dateKey(d)
          const info = dateToDay[key]
          const inMonth = d.getMonth() === calMonth
          const isToday = key === todayKey
          const Cell = info ? 'button' : 'div'
          const cell = (
            <Cell
              key={key}
              type={info ? 'button' : undefined}
              onClick={info ? () => setDayModal(key) : undefined}
              className={`${social} text-left border-t pt-[8px] md:pt-[10px] pb-[14px] min-h-[76px] md:min-h-[128px] flex flex-col gap-[4px] ${inMonth ? '' : 'opacity-40'} ${info ? 'group cursor-pointer' : ''}`}
              style={isToday ? { borderColor: T.ink, borderTopWidth: 2 } : rule()}
              aria-label={info ? `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}: ${info.title}` : undefined}
            >
              <span className="flex items-baseline justify-between gap-[4px] text-[14px] md:text-[17px] leading-none tabular-nums">
                <span className={isToday ? 'underline underline-offset-[3px]' : ''}>{d.getDate()}</span>
                {info && d.getDay() === 1 && <span className="hidden md:inline text-[14px] opacity-60">W{info.week}</span>}
              </span>
              {info && (
                <span className="text-[12px] md:text-[15px] leading-[1.2] tabular-nums group-hover:underline underline-offset-[3px]">
                  {info.lines.length ? info.lines.map((l) => <span key={l} className="block">{l}</span>) : <span className="block opacity-60">Rest</span>}
                </span>
              )}
            </Cell>
          )
          if (i % 7 !== 6) return [cell]
          // Sunday closes the row: sum the plan days in it (Monday-start, so one plan week).
          const days = cells.slice(i - 6, i + 1).map((c) => dateToDay[dateKey(c)]).filter(Boolean)
          const mi = Math.round(days.reduce((n, x) => n + x.mi, 0))
          const v = days.reduce((n, x) => n + x.v, 0)
          return [
            cell,
            <div
              key={`total-${i}`}
              className={`${social} border-t pt-[8px] md:pt-[10px] pb-[14px] min-w-[34px] md:min-w-[96px] text-right tabular-nums`}
              style={{ borderColor: T.ink }}
            >
              {days.length > 0 && (
                <>
                  <span className="block text-[14px] md:text-[21px] leading-none">
                    {mi}
                    <span className="hidden md:inline"> mi</span>
                  </span>
                  {v > 0 && <span className="hidden md:block mt-[6px] text-[15px] leading-none opacity-60">{v.toLocaleString()} ft</span>}
                </>
              )}
            </div>,
          ]
        })}
      </div>

      {modalInfo && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-[16px]"
          style={{ backgroundColor: `${T.ink}33` }}
          onClick={() => setDayModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dayModalTitle"
        >
          <div
            className="w-full max-w-[560px] max-h-[85vh] overflow-y-auto rounded-[4px] border px-[20px] md:px-[26px] pt-[16px] pb-[28px]"
            style={{ backgroundColor: T.bg, color: T.ink, borderColor: T.ink }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-[16px] pb-[16px] mb-[16px] border-b" style={rule()}>
              <div>
                <p className={`${social} text-[16px] md:text-[17px] leading-none tabular-nums opacity-70`}>
                  {modalDate && `${MONTH_NAMES[modalDate.getMonth()]} ${modalDate.getDate()}, week ${modalInfo.week}`}
                </p>
                <h3 id="dayModalTitle" className={`${social} mt-[8px] text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]`}>
                  {modalInfo.title}
                </h3>
              </div>
              <button type="button" onClick={() => setDayModal(null)} aria-label="Close" className={btn}>
                ×
              </button>
            </div>
            <div
              className={`${social} text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px] [&_strong]:font-normal [&_strong]:underline [&_strong]:underline-offset-[3px] [&_strong]:decoration-[1px] [&_br]:block [&_br]:h-[6px]`}
              dangerouslySetInnerHTML={{ __html: formatContentHtml(modalInfo.content || '') }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
