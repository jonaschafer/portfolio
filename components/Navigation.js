'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { mixtape, useMixtape, useSpotifyFeed, SpeakerIcon } from './mixtape'

// Name left in Nichrome Regular, Play and About together on the right in
// Social Condensed at the same size and weight, fixed to the top on the
// page's own field. The name goes home, which is the work page.
export default function Navigation({ backgroundColor = '#FFFFFF', textColor = '#2E2E2E' }) {
  const pathname = usePathname()
  const { open, playing } = useMixtape()
  // Tooltip: what Jon's listening to right now, from the live Spotify feed.
  const now = useSpotifyFeed()?.now
  const tip = now ? `${now.playing ? 'Currently listening to' : 'Last played'} ${now.title}, ${now.artist}` : 'Play my mixtape'
  const isTransparent = backgroundColor === 'transparent'
  const link = (href, label) => {
    const active = pathname?.startsWith(href)
    return (
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`font-['Social_Condensed','Haas_Grot_Disp',sans-serif] text-[18px] md:text-[19px] leading-none tracking-[0.19px] transition-opacity hover:opacity-100 ${active ? 'opacity-100' : 'opacity-70'}`}
      >
        {label}
      </Link>
    )
  }
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ color: textColor, ...(isTransparent ? {} : { backgroundColor }) }}
      >
        <div className="flex items-baseline justify-between px-[20px] md:px-[26px] py-[20px] md:py-[24px]">
          <Link
            href="/"
            className="font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal text-[18px] md:text-[19px] leading-none tracking-[0.19px] hover:opacity-80 transition-opacity"
          >
            Jon Schafer
          </Link>
          <div className="flex items-center gap-[24px]">
            {/* Mixtape opens the floating player instead of a page, so it's an
                outlined pill with the voicemail speaker rather than a text link. */}
            <span className="group relative inline-flex">
            <button
              type="button"
              onClick={() => mixtape.set({ open: !open })}
              aria-describedby="mixtape-tip"
              aria-expanded={open}
              aria-label={playing ? 'Mixtape, playing' : 'Mixtape'}
              className="font-['Social_Condensed','Haas_Grot_Disp',sans-serif] text-[16px] md:text-[17px] leading-none tracking-[0.17px] inline-flex items-center gap-[6px] -my-[7px] px-[10px] py-[6px] rounded-full border border-current opacity-90 hover:opacity-100 active:scale-[0.97] transition"
            >
              <SpeakerIcon playing={playing} size={15} />
              Mixtape
            </button>
            <span
              id="mixtape-tip"
              role="tooltip"
              className="pointer-events-none absolute right-0 top-[calc(100%+10px)] w-max max-w-[280px] rounded-[6px] px-[10px] py-[7px] font-['Social_Condensed','Haas_Grot_Disp',sans-serif] text-[15px] leading-[1.2] opacity-0 translate-y-[-4px] transition duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 motion-reduce:transition-none"
              style={{ backgroundColor: 'var(--page-ink, #2E2E2E)', color: 'var(--page-bg, #FFFFFF)' }}
            >
              {tip}
            </span>
            </span>
            {link('/play', 'Play')}
            {link('/about', 'About')}
          </div>
        </div>
      </nav>
      {!isTransparent && <div aria-hidden="true" className="h-[60px] md:h-[68px]" />}
    </>
  )
}
