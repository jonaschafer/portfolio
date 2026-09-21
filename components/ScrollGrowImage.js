'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Grows an image from a centered fraction of its container to full width as the
// page scrolls, after the about page on dawn-llc.webflow.io. Width animates rather
// than transform, so the whole image stays visible at every size instead of
// cropping. Finished by half a viewport of scroll.
export default function ScrollGrowImage({ src, alt, width, height, startDesktop = 0.4, startMobile = 0.7 }) {
  const [fraction, setFraction] = useState(null)
  const frame = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Scroll anchoring would nudge scrollY to keep the text below in place as
    // the image grows, which feeds back into more growth. Off while mounted.
    const root = document.documentElement
    const priorAnchor = root.style.overflowAnchor
    root.style.overflowAnchor = 'none'

    const update = () => {
      frame.current = 0
      if (reduce.matches) {
        setFraction(1)
        return
      }
      const start = window.innerWidth < 768 ? startMobile : startDesktop
      const distance = window.innerHeight * 0.5
      const p = Math.min(Math.max(window.scrollY / distance, 0), 1)
      const eased = p * p * (3 - 2 * p)
      setFraction(start + (1 - start) * eased)
    }

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    reduce.addEventListener('change', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      reduce.removeEventListener('change', update)
      if (frame.current) cancelAnimationFrame(frame.current)
      root.style.overflowAnchor = priorAnchor
    }
  }, [startDesktop, startMobile])

  return (
    <div
      className={`mx-auto ${fraction === null ? 'w-[70%] md:w-[40%]' : ''}`}
      style={fraction === null ? undefined : { width: `${fraction * 100}%` }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto rounded-[10px]"
        sizes="(max-width: 1440px) 100vw, 1320px"
        priority
      />
    </div>
  )
}
