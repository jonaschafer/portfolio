'use client'

import { useEffect, useState } from 'react'
import { SURGERY_DATE, SURGERY_INFO, PHASES } from '../../../app/mma/map/data'

function daysBetween(fromDate, toDate) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const from = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
  const to = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())
  return Math.round((to - from) / MS_PER_DAY)
}

function computeState(now) {
  const surgery = new Date(`${SURGERY_DATE}T00:00:00`)
  const day = daysBetween(surgery, now)
  if (day < 0) return { stage: 'pre-op', daysUntil: -day, surgery }
  const phaseIndex = PHASES.findIndex((p) => day >= p.startDay && day <= p.endDay)
  const phase = PHASES[phaseIndex === -1 ? PHASES.length - 1 : phaseIndex]
  const nextPhase = phaseIndex === -1 ? null : PHASES[phaseIndex + 1] ?? null
  const week = Math.floor(day / 7)
  return { stage: 'post-op', day, week, phase, nextPhase, surgery }
}

export function formatSurgeryDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export { SURGERY_INFO }

export function useRecoveryState() {
  const [state, setState] = useState(() => computeState(new Date()))
  useEffect(() => {
    const id = setInterval(() => setState(computeState(new Date())), 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return state
}
