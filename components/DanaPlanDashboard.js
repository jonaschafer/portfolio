'use client'

import { useState, useEffect } from 'react'
import DanaPlanHeader from './DanaPlanHeader'
import { getCurrentWeek, getCanonicalRun } from '../lib/dana-plan-utils'

function oneLine(d) {
  const s = d.summary || {}
  const { distance: dist, vert } = getCanonicalRun(d)
  // Run days: always show distance (and vert) when present, never duration
  if (dist || vert) {
    const parts = [dist, vert].filter(Boolean)
    let runPart = parts.join(', ')
    const strengthPart = d.title.indexOf('+') !== -1 ? d.title.split('+').slice(1).join('+').replace(/\s*\([^)]*\)/g, '').trim() : ''
    if (strengthPart) runPart = runPart + ' + ' + strengthPart
    return runPart || d.title.split('+')[0].trim()
  }
  // PT-only days (no run distance)
  if (/PT|Exercises/i.test(d.title) && !/Run|Vert|Strength/i.test(d.title)) {
    return s.duration ? 'PT · ' + s.duration : 'PT'
  }
  return d.title.split('+')[0].trim() || d.title
}

export default function DanaPlanDashboard() {
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
        currentView="dashboard"
        loading={false}
      />
      {week?.target && (
        <div className="rounded-[10px] bg-[#FAFAFA]/10 border border-[#FAFAFA]/15 px-4 py-3 mb-6 font-['Haas_Grot_Disp',_sans-serif] text-[14px] tracking-[0.16px] text-[#FAFAFA] text-center">
          <strong>Target:</strong> {week.target}
        </div>
      )}
      <div className="max-w-[420px] rounded-[10px] border border-[#FAFAFA]/15 overflow-hidden bg-[#FAFAFA]/5">
        {week?.days?.map((d) => {
          const isOff = /off|rest|yay!/i.test(d.title)
          const desc = oneLine(d)
          return (
            <div
              key={d.day}
              className={`flex items-baseline gap-3 py-3 px-4 border-b border-[#FAFAFA]/15 last:border-b-0 font-['Haas_Grot_Disp',_sans-serif] text-[14px] ${isOff ? 'text-[#FAFAFA]/70' : ''}`}
            >
              <span className="font-bold text-[#FAFAFA]/70 min-w-[64px] text-[12px] uppercase tracking-wider">
                {d.day}
              </span>
              <span className="flex-1 text-[#FAFAFA]">{desc}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
