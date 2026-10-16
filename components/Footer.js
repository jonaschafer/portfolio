'use client'

import { useEffect, useState } from 'react'
import Asterisk from './Asterisk'

const haas = "font-['Haas_Grot_Disp',_sans-serif]"
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const EMAIL = 'jonaschafer+website@gmail.com'

// "The unusual suspects". Entries without an href don't render.
const LINKS = [
  { label: 'LinkedIn', href: null }, // TODO add profile URL
  { label: 'Are.na', href: 'https://www.are.na/jon-schafer' },
  { label: 'Spotify', href: null }, // TODO add profile URL
]

// Color themes from Figma (Website — Oct 26, node 7:235). One is picked at
// random on each load, never the same one twice in a row.
// bg: field, ink: all type and pill borders, hmu/hmuInk: the email button.
const THEMES = [
  { bg: '#D5B800', ink: '#19180E', hmu: '#19180E', hmuInk: '#F2F2F2' },
  { bg: '#FFFFFF', ink: '#2E2E2E', hmu: '#FF000F', hmuInk: '#FFFFFF' },
  { bg: '#9FAE79', ink: '#3E3C32', hmu: '#FFFFFF', hmuInk: '#3E3C32' },
  { bg: '#FF4B00', ink: '#511A07', hmu: '#FFFFFF', hmuInk: '#511A07' },
  { bg: '#F2F2F2', ink: '#130EA8', hmu: '#130EA8', hmuInk: '#F2F2F2' },
  { bg: '#0F50C8', ink: '#FF69B4', hmu: '#FF69B4', hmuInk: '#0F50C8' },
]
const THEME_KEY = 'footer-theme'

function useRandomTheme() {
  const [i, setI] = useState(null)
  useEffect(() => {
    let last = -1
    try {
      last = Number(sessionStorage.getItem(THEME_KEY) ?? -1)
    } catch {}
    const options = THEMES.map((_, k) => k).filter((k) => k !== last)
    const pick = options[Math.floor(Math.random() * options.length)]
    setI(pick)
    try {
      sessionStorage.setItem(THEME_KEY, String(pick))
    } catch {}
  }, [])
  return { theme: THEMES[i ?? 0], ready: i !== null }
}

// Live Portland time, 24-hour, ticking each second. Blank until mounted so
// server and client markup match.
function PortlandClock() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now
    ? now.toLocaleTimeString('en-GB', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : ' '
  return (
    <span className="tabular-nums" title="Portland, Oregon" suppressHydrationWarning>
      {time}
    </span>
  )
}

// Figma: Website — Oct 26, node 4:126.
function GiantFooter() {
  // Hidden until the random theme is picked, so the server's default colors
  // never flash before the swap.
  const { theme: t, ready } = useRandomTheme()
  const small = `${social} text-[17px] md:text-[22px] leading-[1.15] tracking-[0.22px]`
  const pill = 'inline-flex items-center rounded-[4px] px-[10px] py-[7px] md:py-[8px]'
  return (
    <footer
      className="w-full"
      style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}
    >
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[42px] pt-[40px] md:pt-[48px] pb-[28px] md:pb-[40px] flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between gap-[32px]">
          <div className="flex flex-col items-start gap-[14px] md:gap-[18px] max-w-[381px]">
            <p className={small}>Building a brand, or want to swap notes on design? My inbox is (figuratively) open.</p>
            <a
              href={`mailto:${EMAIL}?subject=Hello%20from%20portfolio`}
              className={`${small} ${pill} hover:opacity-80 transition-opacity`}
              style={{ backgroundColor: t.hmu, color: t.hmuInk }}
            >
              HMU
            </a>
          </div>
          <div className="flex flex-col items-start md:items-end gap-[14px] md:gap-[18px]">
            <p className={`${small} md:mt-[14px]`}>The unusual suspects</p>
            <ul className="flex flex-wrap gap-[10px]">
              {LINKS.filter((l) => l.href).map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${small} ${pill} border footer-pill`}
                    style={{ borderColor: t.ink, '--pill-bg': t.bg, '--pill-ink': t.ink }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The asterisk footnotes the giant line; the line below answers it. */}
        <p
          className={`${nichrome} giant-footer-type whitespace-nowrap leading-[0.78] tracking-[0.01em] mt-[48px] md:mt-[60px] -ml-[0.02em] select-none`}
        >
          Giant footer
          <Asterisk className="inline-block align-top w-[0.3em] h-[0.3em] ml-[0.06em] mt-[0.02em]" />
        </p>

        <div className={`${social} flex items-baseline justify-between gap-[16px] mt-[20px] md:mt-[36px] text-[18px] md:text-[29px] leading-[1.15]`}>
          <p>
            <Asterisk className="inline-block align-baseline w-[0.5em] h-[0.5em] mr-[0.12em] -translate-y-[0.35em]" />
            Guilty. They&apos;re pretty cool, I get it.
          </p>
          <PortlandClock />
        </div>
      </div>
    </footer>
  )
}

export default function Footer({ backgroundColor = '#435938', textColor = '#FAFAFA', className = '', minimal = false, colophon = false }) {
  if (colophon && !minimal) return <GiantFooter />
  const text = `${haas} leading-[1.4] text-[16px] tracking-[0.16px]`
  return (
    <div className={`w-full ${className}`.trim()} style={{ backgroundColor, color: textColor }}>
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 pb-[60px] pt-[30px] px-[20px] md:px-[60px] text-center sm:text-left">
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
      </div>
    </div>
  )
}
