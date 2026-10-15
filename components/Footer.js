'use client'

import { useEffect, useState } from 'react'

const haas = "font-['Haas_Grot_Disp',_sans-serif]"
const EMAIL = 'jonaschafer+website@gmail.com'

// Colophon links. Entries without an href don't render.
const LINKS = [
  { label: 'LinkedIn', href: null }, // TODO add profile URL
  { label: 'Are.na', href: 'https://www.are.na/jon-schafer' },
  { label: 'Spotify', href: null }, // TODO add profile URL
]

// Live Portland time, ticking each second. Renders nothing until mounted so
// the server and client markup match.
function PortlandClock() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now
    ? now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', second: '2-digit' })
    : ' '
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      Portland, {time}
    </span>
  )
}

export default function Footer({ backgroundColor = '#435938', textColor = '#FAFAFA', className = '', minimal = false, colophon = false }) {
  const text = `${haas} leading-[1.4] text-[16px] tracking-[0.16px]`
  return (
    <div className={`w-full ${className}`.trim()} style={{ backgroundColor, color: textColor }}>
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        {colophon && !minimal && (
          <div className="px-[20px] md:px-[60px] pt-[60px] grid grid-cols-1 md:grid-cols-12 gap-y-[32px] md:gap-x-[40px]">
            <div className={`${text} md:col-span-5 flex flex-col gap-[16px]`}>
              <p className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] leading-[1.2] tracking-[0.31px]">Let&apos;s talk</p>
              <p className="opacity-80 max-w-[420px]">
                Building a brand, or want to swap notes on design? My inbox is open.
              </p>
              <a
                href={`mailto:${EMAIL}?subject=Hello%20from%20portfolio`}
                className="self-start rounded-full border px-[16px] py-[6px] hover:opacity-80 transition-opacity"
                style={{ borderColor: textColor }}
              >
                Email me
              </a>
            </div>
            <ul className={`${text} md:col-start-7 md:col-span-3 flex flex-col gap-[4px]`}>
              {LINKS.filter((l) => l.href).map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="hl">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className={`${text} md:col-span-3 flex flex-col gap-[4px] md:text-right`}>
              <PortlandClock />
              <span className="opacity-80">© {new Date().getFullYear()} Jon Schafer</span>
            </div>
          </div>
        )}
        <footer className={`flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 ${colophon ? 'pb-[30px]' : 'pb-[60px]'} pt-[30px] px-[20px] md:px-[60px] text-center sm:text-left`}>
          {!minimal && (
            <>
              <p className={`${text} sm:whitespace-nowrap`}>Typefaces: PP Mondwest, Neue Haas Grotesk Display</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`${text} whitespace-nowrap hover:opacity-80 transition-opacity cursor-pointer`}
              >
                Beam me up, Scotty ↑
              </button>
            </>
          )}
        </footer>
        {colophon && !minimal && (
          // Name set to the width of the shell (Stu Ohler, Elana Schlenker).
          // The one place type sizes to the viewport: it's a graphic, not text
          // that has to step with the scale.
          <p
            aria-hidden="true"
            className="font-['Mondwest',_sans-serif] leading-[1] tracking-[0.31px] whitespace-nowrap overflow-hidden px-[16px] md:px-[48px] pb-[24px] select-none"
            style={{ fontSize: 'min(19.3vw, 288px)' }}
          >
            Jon Schafer
          </p>
        )}
      </div>
    </div>
  )
}
