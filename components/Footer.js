'use client'

import { useEffect, useState } from 'react'
import useRandomTheme from './useRandomTheme'
import { THEMES } from '../lib/themes'
import { useSpotifyFeed } from './mixtape'

const haas = "font-['Haas_Grot_Disp',_sans-serif]"
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const EMAIL = 'jonaschafer+website@gmail.com'

// "The unusual suspects".
const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonaschafer/' },
  { label: 'Are.na', href: 'https://www.are.na/jon-schafer' },
  { label: 'Spotify', href: 'https://open.spotify.com/user/jonaschafer' },
]


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
    <span className="tabular-nums shrink-0" title="Portland, Oregon" suppressHydrationWarning>
      {time}
    </span>
  )
}

// What Jon's listening to, from the live Spotify feed; falls back to the last
// track when nothing's playing. Desktop only, and blank until the feed loads.
function NowPlaying() {
  const feed = useSpotifyFeed()
  const n = feed?.now
  if (!n) return null
  return (
    <span className="hidden md:inline-block truncate max-w-[42vw] text-right">
      {n.playing ? 'Listening to ' : 'Last played '}
      <a href={n.url} target="_blank" rel="noopener noreferrer" className="hl">
        {n.title}
      </a>
      , {n.artist}
      <span aria-hidden="true"> · </span>
    </span>
  )
}

// Figma: Website — Oct 26, node 4:126. Hidden until the random theme is
// picked, so the default colors never flash before the swap.
// `pageTheme` lets a page that already picked its color hand it down, so
// page and footer match.
function GiantFooter({ pageTheme }) {
  const random = useRandomTheme(THEMES, !pageTheme)
  const { theme: t, ready, animate } = pageTheme ? { theme: pageTheme, ready: true, animate: random.animate } : random
  const small = `${social} text-[17px] md:text-[22px] leading-[1.15] tracking-[0.22px]`
  return (
    <footer
      className={`w-full overflow-hidden ${animate ? 'f-anim' : ''}`}
      style={{
        backgroundColor: t.bg,
        color: t.ink,
        // With a page theme, inherit the page's own hide-until-picked.
        visibility: pageTheme ? undefined : ready ? 'visible' : 'hidden',
        '--f-bg': t.bg,
        '--f-ink': t.ink,
        '--f-hmu': t.hmu,
        '--f-hmu-ink': t.hmuInk,
      }}
    >
      <div className="px-[20px] md:px-[26px] pt-[40px] md:pt-[48px] pb-[28px] md:pb-[40px] flex flex-col">
        {/* Two rows on desktop so both blurbs top-align and both button rows
            share a baseline, however many lines the left blurb wraps to.
            Stacks in reading order on mobile. */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,381px)_auto] md:justify-between gap-y-[14px] md:gap-y-[18px] md:gap-x-[32px] items-start">
          <p className={`${small} order-1`}>Building a brand, or want to swap notes on design? My inbox is (figuratively) open.</p>
          <p className={`${small} order-3 md:order-2 mt-[18px] md:mt-0 md:text-right`}>The unusual suspects</p>
          <div className="order-2 md:order-3 self-end">
            <a href={`mailto:${EMAIL}?subject=Hello%20from%20portfolio`} className={`${small} fbtn fbtn-solid`}>
              Email me ↗
            </a>
          </div>
          <ul className="order-4 self-end flex flex-wrap gap-[10px] md:justify-end">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={`${small} fbtn fbtn-outline`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="giant-footer-fit mt-[48px] md:mt-[60px]">
          <p className={`${nichrome} giant-footer-type whitespace-nowrap leading-[0.78] tracking-[0.01em] select-none`}>
            Giant footer
          </p>
        </div>

        <div className={`${social} flex items-baseline justify-between gap-[16px] mt-[20px] md:mt-[36px] text-[18px] md:text-[29px] leading-[1.15]`}>
          <p>Guilty. They&apos;re pretty cool, I get it.</p>
          <span className="flex items-baseline min-w-0">
            <NowPlaying />
            <PortlandClock />
          </span>
        </div>
      </div>
    </footer>
  )
}

export default function Footer({ backgroundColor = '#435938', textColor = '#FAFAFA', className = '', minimal = false, colophon = false, theme = null }) {
  if (colophon && !minimal) return <GiantFooter pageTheme={theme} />
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
