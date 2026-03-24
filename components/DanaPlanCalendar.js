'use client'

import { useState, useEffect, useMemo } from 'react'
import DanaPlanHeader from './DanaPlanHeader'
import {
  getCurrentWeek,
  getStartDate,
  dateKey,
  parseLocalDate,
  getPhaseClass,
  getCanonicalRun,
  getDayContentWithPT,
  DAY_ORDER,
  MONTH_NAMES,
} from '../lib/dana-plan-utils'

function contentForDay(w, d) {
  let raw = (d.content || '').trim()
  if (raw.length >= 120) return raw
  const weekBlob = (w.content || '').trim()
  if (!weekBlob) return raw
  const dayName = d.day
  const re = new RegExp('####\\s+' + dayName.replace(/\s+/g, '\\s+') + '[^\\n]*\\n([\\s\\S]*?)(?=####|$)', 'i')
  const m = weekBlob.match(re)
  if (m && m[1]) {
    const section = m[1].trim()
    if (section.length > raw.length) return section
  }
  return raw
}

function buildDateMap(planData) {
  const map = {}
  if (!planData?.weeks?.length || !planData.startDate) return map
  const start = parseLocalDate(planData.startDate)
  planData.weeks.forEach((w) => {
    let totalMiles = 0
    let totalVert = 0
    ;(w.days || []).forEach((d) => {
      const run = getCanonicalRun(d)
      totalMiles += run.mi
      totalVert += run.v
    })
    const weekTargetStr =
      (totalMiles ? Math.round(totalMiles) + ' mi' : '') +
      (totalMiles && totalVert ? ' · ' : '') +
      (totalVert ? totalVert.toLocaleString() + ' ft' : '')
    const weekStart = new Date(start)
    weekStart.setDate(weekStart.getDate() + (w.week - 1) * 7)
    ;(w.days || []).forEach((d) => {
      const dayIdx = DAY_ORDER.indexOf(d.day)
      if (dayIdx === -1) return
      const cellDate = new Date(weekStart)
      cellDate.setDate(weekStart.getDate() + dayIdx)
      const key = dateKey(cellDate)
      const { distance: dist, vert } = getCanonicalRun(d)
      const run = [dist, vert].filter(Boolean).join(' ') || (d.title || '').slice(0, 30)
      map[key] = {
        run: run || (d.title || '').slice(0, 30),
        title: d.title,
        phase: w.type,
        content: getDayContentWithPT(d.day, contentForDay(w, d)),
        weekTarget: weekTargetStr,
      }
    })
  })
  return map
}

function formatContentHtml(text) {
  if (!text) return ''
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^- /gm, '• ')
    .replace(/\n/g, '<br/>')
}

const PHASE_COLORS = {
  build: 'text-[#FAFAFA]',
  restore: 'text-[#c9a82a]',
  test: 'text-[#a78bfa]',
  taper: 'text-[#7ec8e3]',
  race: 'text-[#ff8a8a]',
}

export default function DanaPlanCalendar() {
  const [planData, setPlanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [calYear, setCalYear] = useState(2026)
  const [calMonth, setCalMonth] = useState(2)
  const [dayModal, setDayModal] = useState(null)

  const dateToDay = useMemo(() => (planData ? buildDateMap(planData) : {}), [planData])

  useEffect(() => {
    fetch('/dana-plan/plan-data-v9.json')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data) => {
        setPlanData(data)
        setSelectedWeek(getCurrentWeek(data))
        setError(null)
        const start = getStartDate(data)
        setCalYear(start.getFullYear())
        setCalMonth(start.getMonth())
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!planData) return
    const maxWeek = planData.weeks.length
    const onKey = (e) => {
      if (e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA') return
      if (e.key === 'Escape') {
        setDayModal(null)
        return
      }
      if (dayModal) return
      if (e.key === 'ArrowLeft') {
        setCalMonth((m) => {
          if (m <= 0) {
            setCalYear((y) => y - 1)
            return 11
          }
          return m - 1
        })
        e.preventDefault()
      }
      if (e.key === 'ArrowRight') {
        setCalMonth((m) => {
          if (m >= 11) {
            setCalYear((y) => y + 1)
            return 0
          }
          return m + 1
        })
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [planData, dayModal])

  const week = planData?.weeks?.find((w) => w.week === selectedWeek)

  if (loading) {
    return (
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] py-[40px] text-center font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA]/70">
        Loading…
      </div>
    )
  }

  if (error || !planData) {
    return (
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] py-[40px] text-center font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#ff8a8a]">
        Could not load plan. {error}
      </div>
    )
  }

  const today = new Date()
  const todayKey = dateKey(today)
  const first = new Date(calYear, calMonth, 1)
  const startDow = first.getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const prevMonth = new Date(calYear, calMonth, 0)
  const prevDays = prevMonth.getDate()

  const cells = []
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  dayNames.forEach((name) => {
    cells.push(
      <div
        key={'head-' + name}
        className="py-2 text-center font-['Haas_Grot_Disp',_sans-serif] text-[11px] font-bold uppercase tracking-wider border-b border-[#FAFAFA]/15"
        style={{ color: '#e8e8f0' }}
      >
        {name}
      </div>
    )
  })

  for (let i = 0; i < startDow; i++) {
    const num = prevDays - startDow + i + 1
    const d = new Date(calYear, calMonth - 1, num)
    const key = dateKey(d)
    const info = dateToDay[key]
    cells.push(
      <div
        key={'p-' + i}
        className={`min-h-[70px] p-2 border-r border-b border-[#FAFAFA]/15 flex flex-col bg-[#252525] ${info ? 'cursor-pointer hover:bg-[#353535]' : ''}`}
        onClick={info ? () => setDayModal(key) : undefined}
        style={{ color: '#e8e8f0' }}
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 mb-1" style={{ color: '#e8e8f0' }}>
          {num}
        </span>
        {info?.run && (
          <div className="text-[11px] line-clamp-3 leading-tight" style={{ color: '#e8e8f0' }}>{info.run}</div>
        )}
        {info?.weekTarget && d.getDay() === 1 && (
          <div className="text-[10px] font-bold mt-1 flex-shrink-0" style={{ color: '#c4e0d4' }}>
            {info.weekTarget}
          </div>
        )}
        {info?.phase && (
          <div className={`text-[10px] font-semibold uppercase mt-0.5 flex-shrink-0 ${PHASE_COLORS[getPhaseClass(info.phase)] || PHASE_COLORS.build}`}>
            {info.phase}
          </div>
        )}
      </div>
    )
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(calYear, calMonth, i)
    const key = dateKey(d)
    const info = dateToDay[key]
    const isToday = key === todayKey
    cells.push(
      <div
        key={'c-' + i}
        className={`min-h-[70px] p-2 border-r border-b border-[#FAFAFA]/15 flex flex-col ${isToday ? 'bg-[#FAFAFA]/25' : 'bg-[#383838]'} ${info ? 'cursor-pointer hover:opacity-95' : ''}`}
        onClick={info ? () => setDayModal(key) : undefined}
        style={!isToday ? { color: '#FAFAFA' } : undefined}
      >
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 mb-1 ${isToday ? 'bg-[#2e2e2e] text-[#333]' : ''}`}
          style={!isToday ? { color: '#FAFAFA' } : undefined}
        >
          {i}
        </span>
        {info?.run && (
          <div
            className="text-[11px] line-clamp-3 leading-tight"
            style={isToday ? { color: 'rgba(0,0,0,0.85)' } : { color: '#FAFAFA' }}
          >
            {info.run}
          </div>
        )}
        {info?.weekTarget && d.getDay() === 1 && (
          <div
            className="text-[10px] font-bold mt-1 flex-shrink-0"
            style={isToday ? { color: '#333' } : { color: '#c4e0d4' }}
          >
            {info.weekTarget}
          </div>
        )}
        {info?.phase && (
          <div className={`text-[10px] font-semibold uppercase mt-0.5 flex-shrink-0 ${isToday ? 'text-[#333]' : PHASE_COLORS[getPhaseClass(info.phase)] || 'text-[#FAFAFA]'}`}>
            {info.phase}
          </div>
        )}
      </div>
    )
  }

  const trailing = Math.max(0, 42 - startDow - daysInMonth)
  for (let i = 1; i <= trailing; i++) {
    const d = new Date(calYear, calMonth + 1, i)
    const key = dateKey(d)
    const info = dateToDay[key]
    cells.push(
      <div
        key={'n-' + i}
        className={`min-h-[70px] p-2 border-r border-b border-[#FAFAFA]/15 flex flex-col bg-[#252525] ${info ? 'cursor-pointer hover:bg-[#353535]' : ''}`}
        onClick={info ? () => setDayModal(key) : undefined}
        style={{ color: '#e8e8f0' }}
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 mb-1" style={{ color: '#e8e8f0' }}>
          {i}
        </span>
        {info?.run && (
          <div className="text-[11px] line-clamp-3 leading-tight" style={{ color: '#e8e8f0' }}>{info.run}</div>
        )}
        {info?.weekTarget && d.getDay() === 1 && (
          <div className="text-[10px] font-bold mt-1 flex-shrink-0" style={{ color: '#c4e0d4' }}>
            {info.weekTarget}
          </div>
        )}
        {info?.phase && (
          <div className={`text-[10px] font-semibold uppercase mt-0.5 flex-shrink-0 ${PHASE_COLORS[getPhaseClass(info.phase)] || PHASE_COLORS.build}`}>
            {info.phase}
          </div>
        )}
      </div>
    )
  }

  const modalInfo = dayModal ? dateToDay[dayModal] : null
  const modalDate = dayModal ? new Date(dayModal) : null
  const modalDateStr = modalDate
    ? `${MONTH_NAMES[modalDate.getMonth()]} ${modalDate.getDate()}, ${modalDate.getFullYear()}`
    : ''

  return (
    <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] pb-24 md:pb-[60px]">
      <DanaPlanHeader
        planData={planData}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        currentView="calendar"
        loading={false}
      />
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={() => {
            if (calMonth <= 0) {
              setCalYear((y) => y - 1)
              setCalMonth(11)
            } else setCalMonth((m) => m - 1)
          }}
          aria-label="Previous month"
          className="py-2 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[18px] leading-none bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
        >
          ←
        </button>
        <span className="font-['Mondwest',_sans-serif] text-[16px] font-bold text-[#FAFAFA]">
          {MONTH_NAMES[calMonth]} {calYear}
        </span>
        <button
          type="button"
          onClick={() => {
            if (calMonth >= 11) {
              setCalYear((y) => y + 1)
              setCalMonth(0)
            } else setCalMonth((m) => m + 1)
          }}
          aria-label="Next month"
          className="py-2 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[18px] leading-none bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
        >
          →
        </button>
      </div>
      <div
        className="grid grid-cols-7 rounded-[10px] border border-[#FAFAFA]/15 overflow-hidden bg-[#FAFAFA]/5"
        style={{ gridTemplateRows: 'auto repeat(6, minmax(70px, 1fr))' }}
      >
        {cells}
      </div>

      {modalInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setDayModal(null)}
          role="dialog"
          aria-labelledby="dayModalTitle"
        >
          <div
            className="bg-[#2e2e2e] border border-[#FAFAFA]/20 rounded-xl max-w-[480px] w-full max-h-[85vh] overflow-hidden flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#FAFAFA]/15 flex-shrink-0">
              <div>
                <div id="dayModalTitle" className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] font-semibold text-[#FAFAFA]">
                  {modalInfo.title}
                </div>
                <div className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] text-[#FAFAFA]/70 mt-0.5">
                  {modalDateStr}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDayModal(null)}
                aria-label="Close"
                className="py-2 px-3 rounded-lg bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div
              className="p-4 overflow-y-auto font-['Haas_Grot_Disp',_sans-serif] text-[14px] leading-[1.5] text-[#FAFAFA]/80 [&_strong]:text-[#FAFAFA] [&_br]:block [&_br]:h-2"
              dangerouslySetInnerHTML={{ __html: formatContentHtml(modalInfo.content || '') }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
