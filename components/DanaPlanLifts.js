'use client'

import { useState, useEffect } from 'react'
import DanaPlanHeader from './DanaPlanHeader'
import { getCurrentWeek } from '../lib/dana-plan-utils'

function LiftBlock({ lift }) {
  const oneRMLabel = lift.oneRM
    ? `${lift.oneRM} lb${lift.oneRMNote ? ` (${lift.oneRMNote})` : ''}`
    : null

  return (
    <section className="rounded-[12px] border border-[#FAFAFA]/15 bg-[#FAFAFA]/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#FAFAFA]/15">
        <h2 className="font-['Haas_Grot_Disp',_sans-serif] text-[17px] font-semibold tracking-[0.16px] text-[#FAFAFA]">
          {lift.name}
        </h2>
        {oneRMLabel && (
          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] text-[#FAFAFA]/60 mt-0.5">
            1RM {oneRMLabel}
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-['Haas_Grot_Disp',_sans-serif] text-[14px] md:text-[15px]">
          <thead>
            <tr className="text-left text-[#FAFAFA]/60 border-b border-[#FAFAFA]/15">
              <th className="py-2.5 px-4 font-medium">%</th>
              <th className="py-2.5 px-4 font-medium">Weight</th>
              <th className="py-2.5 px-4 font-medium">Plates</th>
              <th className="py-2.5 px-4 font-medium hidden sm:table-cell">Note</th>
            </tr>
          </thead>
          <tbody>
            {lift.loads.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#FAFAFA]/10 last:border-0 text-[#FAFAFA]/90"
              >
                <td className="py-2.5 px-4">
                  {row.pct != null ? (
                    <span className="font-medium text-[#FAFAFA]">{row.pct}%</span>
                  ) : (
                    <span className="text-[#FAFAFA]/50">—</span>
                  )}
                </td>
                <td className="py-2.5 px-4">
                  {row.weight != null ? (
                    <span className="font-medium text-[#FAFAFA]">{row.weight} lb</span>
                  ) : (
                    <span className="text-[#FAFAFA]/50">—</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-[#c4e0d4]">
                  {row.plates || '—'}
                </td>
                <td className="py-2.5 px-4 text-[#FAFAFA]/60 text-sm hidden sm:table-cell">
                  {row.note || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {lift.loads.some((r) => r.note) && (
        <div className="md:hidden px-4 py-2 border-t border-[#FAFAFA]/10">
          {lift.loads
            .filter((r) => r.note)
            .map((r, i) => (
              <p key={i} className="text-[13px] text-[#FAFAFA]/60 mt-1 first:mt-0">
                {r.pct != null && `${r.pct}%: `}{r.note}
              </p>
            ))}
        </div>
      )}
    </section>
  )
}

export default function DanaPlanLifts() {
  const [planData, setPlanData] = useState(null)
  const [liftsData, setLiftsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/dana-plan/plan-data-v9.json').then((r) => (r.ok ? r.json() : null)),
      fetch('/dana-plan/lifts.json').then((r) => {
        if (!r.ok) throw new Error(r.statusText)
        return r.json()
      }),
    ])
      .then(([plan, lifts]) => {
        setPlanData(plan)
        setLiftsData(lifts?.lifts ?? [])
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const selectedWeek = planData ? getCurrentWeek(planData) : 1

  if (loading) {
    return (
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] py-[40px] text-center font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA]/70">
        Loading…
      </div>
    )
  }

  if (error || !liftsData?.length) {
    return (
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] py-[40px] text-center font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#ff8a8a]">
        {error ? `Could not load lifts. ${error}` : 'No lift data found.'}
      </div>
    )
  }

  return (
    <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] pb-24 md:pb-[60px]">
      <DanaPlanHeader
        planData={planData}
        selectedWeek={selectedWeek}
        onWeekChange={() => {}}
        currentView="lifts"
        loading={false}
      />
      <div className="space-y-6 max-w-[720px] mx-auto">
        {liftsData.map((lift) => (
          <LiftBlock key={lift.id} lift={lift} />
        ))}
      </div>
    </div>
  )
}
