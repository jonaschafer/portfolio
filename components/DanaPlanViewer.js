'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DanaPlanHeader from './DanaPlanHeader'
import { getCurrentWeek, formatRunSummary, getDayDate, formatShortDate, getDayContentWithPT, getCanonicalRun } from '../lib/dana-plan-utils'

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

function WeekDayCell({ dayData, day, title, content, dateLabel }) {
  const { distance, vert } = getCanonicalRun(dayData)
  const runLine = [distance, vert].filter(Boolean).join(' ') || null
  const isOff = /off|rest|yay!/i.test(title)
  return (
    <div
      className={`min-h-[280px] flex flex-col border-r last:border-r-0 border-[#FAFAFA]/15 overflow-hidden ${
        isOff ? 'bg-[#252525]' : 'bg-[#383838]'
      }`}
    >
      <div className="p-2 flex-shrink-0 border-b border-[#FAFAFA]/15">
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#FAFAFA]/60">
          {day.toUpperCase().slice(0, 3)}
        </div>
        {dateLabel && (
          <div className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] text-[#FAFAFA]/50 mt-0.5">
            {dateLabel}
          </div>
        )}
        <div className={`font-['Haas_Grot_Disp',_sans-serif] text-[13px] font-semibold mt-1 leading-tight ${isOff ? 'text-[#FAFAFA]/70' : 'text-[#FAFAFA]'}`}>
          {title}
        </div>
        {runLine && (
          <div className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] text-[#c4e0d4] mt-1">
            {runLine}
          </div>
        )}
      </div>
      <div
        className="p-2 flex-1 overflow-y-auto font-['Haas_Grot_Disp',_sans-serif] text-[12px] leading-[1.45] text-[#FAFAFA]/85 [&_strong]:text-[#FAFAFA] [&_br]:block [&_br]:h-1.5"
        dangerouslySetInnerHTML={{ __html: formatContentHtml(getDayContentWithPT(day, content)) }}
      />
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

  const weekContent = week?.content ?? ''
  const coachCommentRe = /\*\*WEEK \d+ COACH COMMENT\*\*:[\s\S]*?(?=\n\n---|\n\n###|$)/g
  const contentSegments = []
  let lastEnd = 0
  let match
  while ((match = coachCommentRe.exec(weekContent)) !== null) {
    if (match.index > lastEnd) contentSegments.push({ type: 'md', text: weekContent.slice(lastEnd, match.index) })
    contentSegments.push({ type: 'coach', text: match[0] })
    lastEnd = match.index + match[0].length
  }
  if (lastEnd < weekContent.length) contentSegments.push({ type: 'md', text: weekContent.slice(lastEnd) })

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
        <div className="rounded-[10px] bg-[#FAFAFA]/10 border border-[#FAFAFA]/15 px-4 py-3 mb-6 font-['Haas_Grot_Disp',_sans-serif] text-[14px] tracking-[0.16px] text-[#FAFAFA] max-w-[640px] md:max-w-[800px] text-left">
          <strong className="text-[#FAFAFA]">Target:</strong> {week.target}
        </div>
      )}
      {contentSegments.length > 0 && (
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[15px] leading-[1.5] tracking-[0.167px] text-[#FAFAFA]/90 max-w-[640px] md:max-w-[800px] prose-invert mb-8 text-left [&_h4]:text-[#FAFAFA] [&_h4]:font-['Mondwest',_sans-serif] [&_h4]:text-[16px] [&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:first:mt-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_p]:my-2 [&_strong]:text-[#FAFAFA] [&_hr]:border-[#FAFAFA]/20 [&_hr]:my-6">
          {contentSegments.map((seg, i) =>
            seg.type === 'coach' ? (
              <div
                key={i}
                className="bg-[#FAFAFA]/10 rounded-lg p-4 my-4 border-l-4 border-[#FAFAFA]/40"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{seg.text}</ReactMarkdown>
              </div>
            ) : (
              <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
                {seg.text}
              </ReactMarkdown>
            )
          )}
        </div>
      )}
      {/* Mobile: single column, collapsible cards */}
      <div className="md:hidden space-y-3 max-w-[520px] mx-auto">
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
      {/* Desktop: one row, 7 equal cells, calendar-style, all expanded */}
      <div className="hidden md:grid md:grid-cols-7 rounded-[10px] border border-[#FAFAFA]/15 overflow-hidden bg-[#FAFAFA]/5">
        {week?.days?.map((d) => {
          const dayDate = getDayDate(planData, week.week, d.day)
          const dateLabel = dayDate ? formatShortDate(dayDate) : null
          return (
            <WeekDayCell
              key={`${week.week}-${d.day}`}
              dayData={d}
              day={d.day}
              title={d.title}
              content={d.content}
              dateLabel={dateLabel}
            />
          )
        })}
      </div>
    </div>
  )
}
