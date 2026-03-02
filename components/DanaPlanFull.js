'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DanaPlanHeader from './DanaPlanHeader'
import { getCurrentWeek } from '../lib/dana-plan-utils'

export default function DanaPlanFull() {
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

  const content = week?.content ?? ''
  const coachCommentRe = /\*\*WEEK \d+ COACH COMMENT\*\*:[\s\S]*?(?=\n\n---|\n\n###|$)/g
  const segments = []
  let lastEnd = 0
  let match
  while ((match = coachCommentRe.exec(content)) !== null) {
    if (match.index > lastEnd) segments.push({ type: 'md', text: content.slice(lastEnd, match.index) })
    segments.push({ type: 'coach', text: match[0] })
    lastEnd = match.index + match[0].length
  }
  if (lastEnd < content.length) segments.push({ type: 'md', text: content.slice(lastEnd) })

  return (
    <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] pb-[60px]">
      <DanaPlanHeader
        planData={planData}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        currentView="full"
        loading={false}
      />
      {week?.target && (
        <div className="rounded-[10px] bg-[#FAFAFA]/10 border border-[#FAFAFA]/15 px-4 py-3 mb-6 font-['Haas_Grot_Disp',_sans-serif] text-[14px] tracking-[0.16px] text-[#FAFAFA]">
          <strong>Target:</strong> {week.target}
        </div>
      )}
      <div className="font-['Haas_Grot_Disp',_sans-serif] text-[15px] leading-[1.5] tracking-[0.167px] text-[#FAFAFA]/90 max-w-[640px] prose-invert [&_h4]:text-[#FAFAFA] [&_h4]:font-['Mondwest',_sans-serif] [&_h4]:text-[16px] [&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:first:mt-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_p]:my-2 [&_strong]:text-[#FAFAFA] [&_hr]:border-[#FAFAFA]/20 [&_hr]:my-6">
        {segments.map((seg, i) =>
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
    </div>
  )
}
