'use client'

import { useState, useEffect } from 'react'
import DanaPlanHeader from './DanaPlanHeader'
import { getCurrentWeek, formatRunSummary, getDayDate, formatShortDate, getDayContentWithPT } from '../lib/dana-plan-utils'

function formatMeta(day) {
  const { distance, vert } = formatRunSummary(day || {})
  const parts = []
  if (distance) parts.push(<span key="d" className="text-[#FAFAFA]">{distance}</span>)
  if (vert) parts.push(<span key="v" className="text-[#c4e0d4]">{vert}</span>)
  if (parts.length === 0) return null
  return <div className="flex flex-wrap gap-[10px] mt-2 font-['Haas_Grot_Disp',_sans-serif] text-[15px] md:text-[13px] tracking-[0.17px] text-[#FAFAFA]/70">{parts}</div>
}

function formatContentHtml(text) {
  if (!text) return ''
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^- /gm, '• ')
    .replace(/\n/g, '<br/>')
}

function DayCard({ dayData, day, title, summary, content, isOff, dateLabel }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-[12px] border overflow-hidden ${
        isOff ? 'bg-[#FAFAFA]/5 border-[#FAFAFA]/10' : 'bg-[#FAFAFA]/10 border-[#FAFAFA]/15'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAFAFA]/50 rounded-[12px]"
        aria-expanded={open}
      >
        <div>
          <div className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] font-bold uppercase tracking-[0.05em] text-[#FAFAFA]/60 mb-1">
            {day}
            {dateLabel && <span className="md:hidden"> · {dateLabel}</span>}
          </div>
            <div
              className={`font-['Haas_Grot_Disp',_sans-serif] text-[15px] leading-[1.3] tracking-[0.16px] ${isOff ? 'text-[#FAFAFA]/70 font-medium' : 'text-[#FAFAFA] font-semibold'}`}
            >
              {title}
            </div>
            {formatMeta(dayData)}
          </div>
        <span className="text-[#FAFAFA]/60 text-sm flex-shrink-0" aria-hidden>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (content || getDayContentWithPT(day)) && (
        <div
          className="px-4 pb-4 pt-0 border-t border-[#FAFAFA]/15 font-['Haas_Grot_Disp',_sans-serif] text-[15px] md:text-[13px] leading-[1.5] tracking-[0.167px] text-[#FAFAFA]/80 [&_strong]:text-[#FAFAFA] [&_br]:block [&_br]:h-2"
          dangerouslySetInnerHTML={{ __html: formatContentHtml(getDayContentWithPT(day, content)) }}
        />
      )}
    </div>
  )
}

export default function DanaPlanViewer() {
  const [planData, setPlanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(1)

  useEffect(() => {
    fetch('/dana-plan/plan-data-v3.json')
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

  return (
    <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] pb-24 md:pb-[60px]">
      <DanaPlanHeader
        planData={planData}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        currentView="cards"
        loading={false}
      />
      {week?.target && (
        <div className="rounded-[10px] bg-[#FAFAFA]/10 border border-[#FAFAFA]/15 px-4 py-3 mb-6 font-['Haas_Grot_Disp',_sans-serif] text-[14px] tracking-[0.16px] text-[#FAFAFA] max-w-[520px] md:max-w-none">
          <strong className="text-[#FAFAFA]">Target:</strong> {week.target}
        </div>
      )}
      <div className="space-y-3 max-w-[520px] md:max-w-none md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {week?.days?.map((d) => {
          const isOff = /off|rest|yay!/i.test(d.title)
          const dayDate = getDayDate(planData, week.week, d.day)
          const dateLabel = dayDate ? formatShortDate(dayDate) : null
          return (
            <DayCard
              key={`${week.week}-${d.day}`}
              dayData={d}
              day={d.day}
              title={d.title}
              summary={d.summary}
              content={d.content}
              isOff={isOff}
              dateLabel={dateLabel}
            />
          )
        })}
      </div>
    </div>
  )
}
