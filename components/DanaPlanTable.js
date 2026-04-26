'use client'

import { useState, useEffect } from 'react'
import DanaPlanHeader from './DanaPlanHeader'
import { getCurrentWeek, getCanonicalRun } from '../lib/dana-plan-utils'

function runCell(d) {
  const { distance: dist, vert } = getCanonicalRun(d)
  const meta = [dist, vert].filter(Boolean)
  return (
    <div>
      <div className="font-semibold text-[#FAFAFA] mb-1">{d.title}</div>
      {meta.length > 0 && (
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] text-[#FAFAFA]/70 mt-1 flex flex-wrap gap-3">
          {meta.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function strengthCell(d) {
  const s = d.summary
  const one = (s && s.strengthOneLine) ? s.strengthOneLine : ''
  const title = d.title
  let strengthPart = title.indexOf('+') !== -1 ? title.split('+').slice(1).join('+').replace(/\s*\([^)]*\)\s*/g, ' ').trim() : title
  if (/PT Exercises|Day Off|OFF/i.test(title) && title.indexOf('+') === -1) strengthPart = title
  let out = strengthPart ? <div className="font-semibold text-[#FAFAFA]">{strengthPart}</div> : null
  if (one && one.length > 5) {
    out = (
      <div>
        {out}
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] text-[#FAFAFA]/70 mt-1">
          {one.length > 90 ? one.slice(0, 90) + '…' : one}
        </div>
      </div>
    )
  }
  return out || '—'
}

const STRAVA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function buildStravaCopyText(d) {
  if (!d) return ''
  const { distance, vert } = getCanonicalRun(d)
  const parts = []
  if (distance) parts.push(distance)
  if (vert) parts.push(vert)
  const runPart = parts.join(' · ') || d.title
  const strengthOneLine = d.summary?.strengthOneLine && String(d.summary.strengthOneLine).trim()
  const strengthPart = strengthOneLine || ''
  return strengthPart ? `${d.day}: ${runPart} — ${strengthPart}` : `${d.day}: ${runPart}`
}

export default function DanaPlanTable() {
  const [planData, setPlanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [copiedDay, setCopiedDay] = useState(null)

  useEffect(() => {
    fetch('/dana-plan/plan-data-v10.json')
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
    if (!copiedDay) return
    const id = setTimeout(() => setCopiedDay(null), 1600)
    return () => clearTimeout(id)
  }, [copiedDay])

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

  const handleCopy = async (day) => {
    try {
      const text = buildStravaCopyText(day)
      if (!text) return
      await navigator.clipboard.writeText(text)
      setCopiedDay(day.day)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

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
        currentView="table"
        loading={false}
      />
      {week?.target && (
        <div className="rounded-[10px] bg-[#FAFAFA]/10 border border-[#FAFAFA]/15 px-4 py-3 mb-6 font-['Haas_Grot_Disp',_sans-serif] text-[14px] tracking-[0.16px] text-[#FAFAFA]">
          <strong>Target:</strong> {week.target}
        </div>
      )}
      <div className="overflow-x-auto max-w-[720px] md:max-w-[960px]">
        <table className="w-full font-['Haas_Grot_Disp',_sans-serif] text-[14px] md:text-[15px]">
          <thead className="md:sticky md:top-0 md:z-10 md:bg-[#2e2e2e]">
            <tr className="border-b border-[#FAFAFA]/20">
              <th className="text-left py-3 px-4 text-[#FAFAFA]/70 font-semibold text-[11px] uppercase tracking-wider w-[22%]">
                Day
              </th>
              <th className="text-left py-3 px-4 text-[#FAFAFA]/70 font-semibold text-[11px] uppercase tracking-wider w-[39%]">
                Run
              </th>
              <th className="text-left py-3 px-4 text-[#FAFAFA]/70 font-semibold text-[11px] uppercase tracking-wider w-[39%]">
                Strength / PT
              </th>
            </tr>
          </thead>
          <tbody>
            {week?.days?.map((d) => {
              const isOff = /off|rest|yay!/i.test(d.title)
              return (
                <tr
                  key={d.day}
                  className={`border-b border-[#FAFAFA]/15 ${isOff ? 'text-[#FAFAFA]/70' : ''}`}
                >
                  <td className="py-3 px-4 font-semibold text-[#FAFAFA] w-[22%]">{d.day}</td>
                  <td className="py-3 px-4 w-[39%]">{runCell(d)}</td>
                  <td className="py-3 px-4 w-[39%]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">{strengthCell(d)}</div>
                      {STRAVA_DAYS.includes(d.day) && (
                        <button
                          type="button"
                          onClick={() => handleCopy(d)}
                          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FAFAFA]/60 hover:text-[#FAFAFA] border border-transparent hover:border-[#FAFAFA]/30 rounded-full px-2 py-1 bg-[#1f1f1f]/60 hover:bg-[#303030]"
                        >
                          <span className="w-3 h-3 relative inline-block">
                            <span className="absolute inset-0 border border-[#FAFAFA]/40 rounded-[2px]" />
                            <span className="absolute -top-[2px] -left-[2px] w-full h-full border border-[#FAFAFA]/80 rounded-[2px] bg-transparent" />
                          </span>
                          <span>{copiedDay === d.day ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
