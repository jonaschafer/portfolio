'use client'

import { useState, useEffect } from 'react'
import DanaPlanHeader from './DanaPlanHeader'
import { PlanStatus } from './DanaPlanViewer'
import { PLAN_URL, getCurrentWeek } from '../lib/dana-plan-utils'
import { T, social, ultra, rule } from './planStyle'

// Lifts view: Heavy A and Heavy B for each phase, from the plan's liftPhases,
// with the phase you're in first. Then plate math from lifts.json.

const body = `${social} text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`

function Phase({ phase, now }) {
  return (
    <section className="border-t pt-[16px] md:pt-[20px] pb-[48px] md:pb-[72px]" style={rule()}>
      <div className="md:grid md:grid-cols-12 md:gap-x-[48px]">
        <div className="md:col-span-4 lg:col-span-3">
          <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`}>{phase.name}</h2>
          <p className={`${social} mt-[12px] text-[16px] md:text-[17px] leading-[1.3] tabular-nums opacity-70`}>
            Weeks {phase.weeks[0]} to {phase.weeks[1]}
            {now && ' · now'}
          </p>
          <p className={`${body} mt-[12px] max-w-[360px]`}>{phase.rule}</p>
        </div>
        <div className="md:col-span-8 lg:col-span-9 mt-[24px] md:mt-0 grid grid-cols-1 lg:grid-cols-2 gap-x-[48px] gap-y-[32px]">
          {phase.sessions.map((s) => (
            <div key={s.name}>
              <h3 className={`${social} text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]`}>
                {s.name} <span className="opacity-60">· {s.focus}, {s.day}s</span>
              </h3>
              <ol className="mt-[10px]">
                {s.moves.map((m) => {
                  const [move, dose] = m.split(/, (.+)/)
                  return (
                    <li key={m} className={`${body} flex justify-between gap-[16px] border-t py-[8px] tabular-nums`} style={rule('26')}>
                      <span>{move}</span>
                      <span className="text-right opacity-80">{dose}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Loads({ lift }) {
  return (
    <div>
      <h3 className={`${social} text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]`}>
        {lift.name}
        {lift.oneRM && (
          <span className="opacity-60">
            {' '}
            · 1RM {lift.oneRM} lb{lift.oneRMNote ? `, ${lift.oneRMNote}` : ''}
          </span>
        )}
      </h3>
      <table className={`${body} w-full mt-[10px] tabular-nums`}>
        <thead>
          <tr className="text-left border-b" style={{ borderColor: T.ink }}>
            <th className="font-normal opacity-70 py-[6px] pr-[12px]">%</th>
            <th className="font-normal opacity-70 py-[6px] pr-[12px]">Weight</th>
            <th className="font-normal opacity-70 py-[6px] pr-[12px]">Plates</th>
            <th className="font-normal opacity-70 py-[6px] hidden sm:table-cell">Note</th>
          </tr>
        </thead>
        <tbody>
          {lift.loads.map((row, i) => (
            <tr key={i} className="border-b align-top" style={rule('26')}>
              <td className="py-[6px] pr-[12px]">{row.pct != null ? `${row.pct}%` : '–'}</td>
              <td className="py-[6px] pr-[12px]">{row.weight != null ? `${row.weight} lb` : '–'}</td>
              <td className="py-[6px] pr-[12px]">{row.plates || '–'}</td>
              <td className="py-[6px] hidden sm:table-cell opacity-70">{row.note || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DanaPlanLifts() {
  const [planData, setPlanData] = useState(null)
  const [liftsData, setLiftsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch(PLAN_URL).then((r) => {
        if (!r.ok) throw new Error(r.statusText)
        return r.json()
      }),
      fetch('/dana-plan/lifts.json').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([plan, lifts]) => {
        setPlanData(plan)
        setLiftsData(lifts?.lifts ?? [])
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PlanStatus>Loading…</PlanStatus>
  if (error || !planData?.liftPhases?.length) return <PlanStatus error>{error ? `Could not load the plan. ${error}` : 'No lifts in this plan.'}</PlanStatus>

  const week = getCurrentWeek(planData)
  const nowIdx = planData.liftPhases.findIndex((p) => week >= p.weeks[0] && week <= p.weeks[1])
  const phases = nowIdx > 0 ? [...planData.liftPhases.slice(nowIdx), ...planData.liftPhases.slice(0, nowIdx)] : planData.liftPhases

  return (
    <div className="px-[20px] md:px-[26px] pb-[120px]">
      <DanaPlanHeader planData={planData} currentView="lifts" selectedWeek={week} />
      {phases.map((p) => (
        <Phase key={p.name} phase={p} now={p === planData.liftPhases[nowIdx]} />
      ))}
      {liftsData.length > 0 && (
        <section className="border-t pt-[16px] md:pt-[20px]" style={rule()}>
          <div className="md:grid md:grid-cols-12 md:gap-x-[48px]">
            <div className="md:col-span-4 lg:col-span-3">
              <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`}>Plate math</h2>
              <p className={`${body} mt-[12px] max-w-[360px] opacity-70`}>Old 1RMs, so treat the top rows as history. Nothing above 80% in this plan.</p>
            </div>
            <div className="md:col-span-8 lg:col-span-9 mt-[24px] md:mt-0 grid grid-cols-1 lg:grid-cols-2 gap-x-[48px] gap-y-[40px]">
              {liftsData.map((l) => (
                <Loads key={l.id} lift={l} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
