'use client'

import Link from 'next/link'
import Navigation from './Navigation'
import Footer from './Footer'
import useRandomTheme from './useRandomTheme'

// /play, in the October 2026 system: one theme for the whole page (dealt per
// load like the homepage and About), the blurb at the homepage's size in
// Nichrome, and project cards in Social Condensed on the same 26px gutters.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const TECH = ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'Claude']

function formatDate(dateString) {
  const [year, month] = dateString.split('.')
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[parseInt(month, 10) - 1]} ${year}`
}

export default function PlayIndex({ projects }) {
  const { theme: t, ready } = useRandomTheme()
  // Newest first.
  const sorted = [...projects].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <section className="px-[20px] md:px-[26px] pt-[32px] md:pt-[100px] pb-[48px] md:pb-[80px]">
        <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1340px]`}>
          A small, but growing collection of <i className="italic">vibe coded</i> ideas, full-on projects and side
          quests. 🧙
        </h1>
      </section>

      <ul className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[48px] gap-y-[48px] md:gap-y-[64px]">
        {sorted.map((p) => {
          const tech = p.tags.filter((tag) => TECH.includes(tag))
          return (
            <li key={p.id} className="border-t pt-[16px]" style={{ borderColor: `${t.ink}40` }}>
              <Link href={p.path} className={`group ${social} flex flex-col gap-[14px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`}>
                <div className="flex items-baseline justify-between gap-[16px]">
                  <h2 className="text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px] underline decoration-transparent underline-offset-[3px] transition-[text-decoration-color] duration-150 group-hover:decoration-current">
                    {p.name}
                  </h2>
                  <span className="shrink-0 opacity-70 tabular-nums">{formatDate(p.date)}</span>
                </div>
                <p>{p.description}</p>
                {tech.length > 0 && (
                  <ul className="flex flex-wrap gap-[6px]" aria-label="Built with">
                    {tech.map((name) => (
                      <li
                        key={name}
                        className="rounded-[4px] border px-[8px] py-[3px] text-[14px] leading-[1.2] opacity-80"
                        style={{ borderColor: t.ink }}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            </li>
          )
        })}
      </ul>

      <Footer colophon theme={t} />
    </main>
  )
}
