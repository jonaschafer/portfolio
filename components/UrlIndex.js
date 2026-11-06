'use client'

import Navigation from './Navigation'
import Footer from './Footer'
import useRandomTheme from './useRandomTheme'

// /urls: every live page, grouped by top-level section. Same shell as /play:
// one dealt theme, statement in Nichrome, rows in Social Condensed under a
// hairline rule, random-pair hover via .hl-row.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const ultra = "font-['Nichrome','Arial_Black',sans-serif] font-black"

export default function UrlIndex({ total, groups }) {
  const { theme: t, ready } = useRandomTheme()

  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <section className="px-[20px] md:px-[26px] pt-[32px] md:pt-[100px] pb-[48px] md:pb-[80px]">
        <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1340px]`}>
          Every page that&rsquo;s live on this site, all <span className="tabular-nums">{total}</span> of them. 🗺️
        </h1>
      </section>

      <div className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[48px] gap-y-[48px] md:gap-y-[64px]">
        {groups.map(({ section, items }) => (
          <section key={section} className="border-t pt-[16px] md:pt-[20px]" style={{ borderColor: `${t.ink}40` }}>
            <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[16px]`}>
              {section === '/' ? 'Home' : section}
            </h2>
            <ul className={`${social} text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`}>
              {items.map((u) => (
                <li key={u.url}>
                  <a href={u.url} className="hl-row flex items-baseline justify-between gap-[16px] py-[6px] break-words">
                    <span>{u.url}</span>
                    {u.gated && <span className="shrink-0 opacity-70" title="Needs the password">🔒</span>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Footer colophon theme={t} />
    </main>
  )
}
