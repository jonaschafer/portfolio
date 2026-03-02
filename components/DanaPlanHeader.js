'use client'

import Link from 'next/link'
import { getBadgeClass, getCurrentWeek } from '../lib/dana-plan-utils'

const VIEWS = [
  { slug: 'calendar', label: 'Calendar' },
  { slug: 'full', label: 'Full text' },
  { slug: '', label: 'Cards' },
  { slug: 'table', label: 'Table' },
  { slug: 'dashboard', label: 'Dashboard' },
]

export default function DanaPlanHeader({
  planData,
  selectedWeek,
  onWeekChange,
  currentView,
  loading,
}) {
  const currentWeek = planData ? getCurrentWeek(planData) : 1
  const maxWeek = planData?.weeks?.length ?? 27
  const week = planData?.weeks?.find((w) => w.week === selectedWeek)

  const handlePrev = () => onWeekChange(Math.max(1, selectedWeek - 1))
  const handleNext = () => onWeekChange(Math.min(maxWeek, selectedWeek + 1))
  const handleThisWeek = () => onWeekChange(currentWeek)

  const basePath = '/dana-plan-v2'

  return (
    <section className="pt-[40px] md:pt-[60px] pb-[30px]">
      <h1 className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] leading-[1.2] tracking-[0.31px] text-[#FAFAFA]">
        Dana&apos;s Plan
      </h1>
      <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[16px] leading-[1.35] tracking-[0.167px] text-[#FAFAFA]/70 mt-1">
        Wy&apos;East 50M · Aug 15, 2026
      </p>

      {!loading && planData && (
        <>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <select
              value={selectedWeek}
              onChange={(e) => onWeekChange(Number(e.target.value))}
              aria-label="Week"
              className="flex-1 min-w-0 max-w-[280px] py-3 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[15px] tracking-[0.16px] bg-[#FAFAFA]/10 border border-[#FAFAFA]/20 text-[#FAFAFA] appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23FAFAFA' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              {planData.weeks.map((w) => (
                <option key={w.week} value={w.week}>
                  Week {w.week} ({w.dateRange}) — {w.type}
                  {w.week === currentWeek ? ' ★' : ''}
                </option>
              ))}
            </select>
            <span
              className={`inline-block px-3 py-1.5 rounded-[6px] font-['Haas_Grot_Disp',_sans-serif] text-[12px] font-medium tracking-[0.05em] ${getBadgeClass(week?.type)}`}
            >
              {week?.type ?? ''}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous week"
              className="py-2 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[18px] leading-none bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleThisWeek}
              className="py-2 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[14px] bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
            >
              This week
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next week"
              className="py-2 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[18px] leading-none bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
            >
              →
            </button>
          </div>

          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[12px] tracking-[0.05em] text-[#FAFAFA]/60 mt-3">
            {VIEWS.map((v, i) => (
              <span key={v.slug}>
                {i > 0 && ' · '}
                <Link
                  href={v.slug ? `${basePath}/${v.slug}` : basePath}
                  className={currentView === (v.slug || 'cards') ? 'font-semibold text-[#FAFAFA]' : 'underline hover:opacity-80'}
                >
                  {v.label}
                </Link>
              </span>
            ))}
          </p>
        </>
      )}
    </section>
  )
}
