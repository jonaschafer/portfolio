'use client'

import { useEffect, useRef, useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import useRandomTheme from './useRandomTheme'

// /hq: a live HQ intake form embedded the way a studio would drop it on its
// own site. Same register as /play: one theme dealt per load, the statement in
// Nichrome, a hairline rule over the embed.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const nichromeUltra = "font-['Nichrome','Arial_Black',sans-serif] font-black"

// The published form's embed link, from HQ's Publish dialog (the one ending in
// ?embed=true). Set NEXT_PUBLIC_HQ_EMBED_URL in Vercel and .env.local, or
// paste it here. Empty shows the "coming soon" state.
const HQ_EMBED_URL = process.env.NEXT_PUBLIC_HQ_EMBED_URL || ''

// Matches the iframe HQ generates. It's the starting height: HQ's embed posts
// its real height ({ type: 'hq:embed-height' }) and the frame grows to fit, so
// the page scrolls instead of the form. Adjust if that message never arrives.
const EMBED_HEIGHT = 900

export default function HqBody() {
  const { theme: t, ready } = useRandomTheme()
  const frame = useRef(null)
  const [height, setHeight] = useState(EMBED_HEIGHT)

  useEffect(() => {
    const onMessage = (e) => {
      if (e.source !== frame.current?.contentWindow) return
      if (e.data?.type !== 'hq:embed-height' || typeof e.data.height !== 'number') return
      setHeight(Math.max(200, Math.ceil(e.data.height)))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <section className="px-[20px] md:px-[26px] pt-[32px] md:pt-[100px] pb-[48px] md:pb-[80px]">
        <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1340px]`}>
          I&apos;m building HQ, a forms tool for studios. Every request comes in through a form that knows your
          standards, then lands in the tools you already run on. 📮
        </h1>
      </section>

      <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
        <div className="border-t pt-[16px] md:pt-[20px]" style={{ borderColor: `${t.ink}40` }}>
          <div className={`${social} flex flex-col md:flex-row md:items-baseline md:justify-between gap-[8px] md:gap-[24px] mb-[24px] md:mb-[32px]`}>
            <h2 className={`${nichromeUltra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`}>Live example</h2>
            <p className="text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px] max-w-[520px] md:text-right opacity-80">
              A form published from HQ and embedded right here, the same way a studio would put one on its own site.
            </p>
          </div>

          {HQ_EMBED_URL ? (
            <iframe
              ref={frame}
              src={HQ_EMBED_URL}
              title="HQ intake form"
              width="100%"
              height={height}
              style={{ border: 0 }}
              loading="lazy"
              className="block w-full rounded-[4px] load-checker"
            />
          ) : (
            <div
              className={`${social} load-checker rounded-[4px] flex items-center justify-center h-[320px] md:h-[420px] text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]`}
            >
              Form coming soon
            </div>
          )}
        </div>
      </section>

      <Footer colophon theme={t} />
    </main>
  )
}
