'use client'

import Link from 'next/link'
import { getCurrentWeek } from '../lib/dana-plan-utils'

function ViewIcon({ name, active }) {
  const c = active ? '#FAFAFA' : 'rgba(250,250,250,0.6)'
  const size = 22
  switch (name) {
    case 'calendar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    case 'doc':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    case 'cards':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    case 'table':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      )
    default:
      return null
  }
}

const VIEWS = [
  { slug: 'calendar', label: 'Calendar', icon: 'calendar' },
  { slug: 'full', label: 'Full text', icon: 'doc' },
  { slug: '', label: 'Cards', icon: 'cards' },
  { slug: 'table', label: 'Table', icon: 'table' },
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

  const selectStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23FAFAFA' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  }

  return (
    <section className="pt-[40px] md:pt-[52px] pb-[24px] md:pb-[28px]">
      {!loading && planData ? (
        <>
          {/* Desktop: single row — title left, week controls right */}
          <div className="md:flex md:items-start md:justify-between md:gap-6">
            <div>
              <h1 className="font-['Mondwest',_sans-serif] text-[20px] md:text-[28px] leading-[1.2] tracking-[0.31px] text-[#FAFAFA]">
                Dana&apos;s Plan
              </h1>
              <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[15px] leading-[1.35] tracking-[0.167px] text-[#FAFAFA]/70 mt-1">
                Wy&apos;East 50M · Aug 15, 2026
              </p>
            </div>
            <div className="mt-6 md:mt-0 md:flex md:items-center md:gap-3 md:flex-shrink-0">
              <select
                value={selectedWeek}
                onChange={(e) => onWeekChange(Number(e.target.value))}
                aria-label="Week"
                className="w-full md:w-auto md:min-w-[260px] py-3 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[15px] tracking-[0.16px] bg-[#FAFAFA]/10 border border-[#FAFAFA]/20 text-[#FAFAFA] appearance-none cursor-pointer"
                style={selectStyles}
              >
                {planData.weeks.map((w) => (
                  <option key={w.week} value={w.week}>
                    Week {w.week} ({w.dateRange}) — {w.type}
                    {w.week === currentWeek ? ' ★' : ''}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-3 md:mt-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous week"
                  className="py-2 px-3 md:px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[18px] leading-none bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={handleThisWeek}
                  className="flex-1 md:flex-none py-2 px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[14px] bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
                >
                  This week
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next week"
                  className="py-2 px-3 md:px-4 rounded-[8px] font-['Haas_Grot_Disp',_sans-serif] text-[18px] leading-none bg-[#FAFAFA]/10 text-[#FAFAFA] hover:bg-[#FAFAFA]/20 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: view links as pill row */}
          <div className="hidden md:flex md:items-center md:gap-1 mt-4">
            <span className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] uppercase tracking-wider text-[#FAFAFA]/50 mr-2">View</span>
            {VIEWS.map((v) => {
              const isActive = currentView === (v.slug || 'cards')
              const href = v.slug ? `${basePath}/${v.slug}` : basePath
              return (
                <Link
                  key={v.slug || 'cards'}
                  href={href}
                  className={`font-['Haas_Grot_Disp',_sans-serif] text-[13px] tracking-[0.02em] py-1.5 px-3 rounded-full transition-colors ${
                    isActive ? 'bg-[#FAFAFA]/20 text-[#FAFAFA]' : 'text-[#FAFAFA]/70 hover:bg-[#FAFAFA]/10 hover:text-[#FAFAFA]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {v.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile: fixed bottom nav with icons */}
          <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2 px-2 bg-[#2e2e2e] border-t border-[#FAFAFA]/15 safe-area-pb"
            aria-label="View switcher"
          >
            {VIEWS.map((v) => {
              const isActive = currentView === (v.slug || 'cards')
              const href = v.slug ? `${basePath}/${v.slug}` : basePath
              return (
                <Link
                  key={v.slug || 'cards'}
                  href={href}
                  className={`flex flex-col items-center gap-0.5 py-1 px-2 min-w-0 flex-1 ${isActive ? 'text-[#FAFAFA]' : 'text-[#FAFAFA]/60'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <ViewIcon name={v.icon} active={isActive} />
                  <span className="font-['Haas_Grot_Disp',_sans-serif] text-[10px] truncate w-full text-center">{v.label}</span>
                </Link>
              )
            })}
          </nav>
        </>
      ) : (
        <>
          <h1 className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] leading-[1.2] tracking-[0.31px] text-[#FAFAFA]">
            Dana&apos;s Plan
          </h1>
          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[16px] leading-[1.35] tracking-[0.167px] text-[#FAFAFA]/70 mt-1">
            Wy&apos;East 50M · Aug 15, 2026
          </p>
        </>
      )}
    </section>
  )
}
