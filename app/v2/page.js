'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Navigation from '../../components/Navigation'

const HOME_MEDIA = [
  { folder: 'home-images', filename: 'cw-rebrand-10.png', title: 'Clockwise Rebrand' },
  { folder: 'home-images', filename: 'cw-rebrand-3.png', title: 'Clockwise Rebrand' },
  { folder: 'home-images', filename: 'cw-rebrand-5.gif', title: 'Clockwise Rebrand' },
  { folder: 'home-images', filename: 'growlers-1.png', title: 'Growlers' },
  { folder: 'home-images', filename: 'lineage-1.png', title: 'Lineage' },
  { folder: 'home-images', filename: 'lineage-4.png', title: 'Lineage' },
  { folder: 'home-images', filename: 'lineage-5.png', title: 'Lineage' },
  { folder: 'home-images', filename: 'lineage-6.png', title: 'Lineage' },
  { folder: 'home-images', filename: 'links-6.gif', title: 'Scheduling Links' },
  { folder: 'home-images', filename: 'novo-2.png', title: 'Novo' },
  { folder: 'home-images', filename: 'novo-5.png', title: 'Novo' },
  { folder: 'home-images', filename: 'novo-8.png', title: 'Novo' },
  { folder: 'home-images', filename: 'novo-stina-compressed.mp4', title: 'Novo' },
  { folder: 'home-images', filename: 'prism-1.png', title: 'Prism' },
  { folder: 'home-images', filename: 'prism-3.png', title: 'Prism' },
  { folder: 'home-images', filename: 'prism-5.png', title: 'Prism' },
  { folder: 'home-images', filename: 'prism-9.mp4', title: 'Prism' },
  { folder: 'home-images', filename: 'zapier-10.png', title: 'Zapier' },
  { folder: 'home-images', filename: 'zapier-4.png', title: 'Zapier' },
  { folder: 'home-images', filename: 'zapier-5.png', title: 'Zapier' },
]

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function isVideo(filename) {
  return filename.toLowerCase().endsWith('.mp4')
}

export default function V2Page() {
  const [media, setMedia] = useState(HOME_MEDIA)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setMedia(shuffle(HOME_MEDIA))
  }, [])

  const n = media.length
  const go = (delta) => setIndex((i) => (i + delta + n) % n)

  useEffect(() => {
    if (n <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % n), 5000)
    return () => clearInterval(t)
  }, [n])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  if (n === 0) return null

  const item = media[index]
  const slidePercent = 100 / n

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation backgroundColor="transparent" textColor="#FAFAFA" />

      <main className="flex-1 relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex h-full min-h-[100vh] transition-transform duration-500 ease-out"
            style={{
              width: `${n * 100}%`,
              transform: `translateX(-${index * slidePercent}%)`,
            }}
          >
            {media.map((slide, i) => {
              const src = `/images/${slide.folder}/${slide.filename}`
              const isVid = isVideo(slide.filename)
              return (
                <div
                  key={`${slide.filename}-${i}`}
                  className="relative flex-shrink-0 h-full min-h-[100vh]"
                  style={{ width: `${slidePercent}%` }}
                >
                  {isVid ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={encodeURI(src)} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={encodeURI(src)}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      quality={100}
                      priority={i < 5}
                      unoptimized={slide.filename.toLowerCase().endsWith('.gif')}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 border border-white/20"
          aria-label="Previous"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 border border-white/20"
          aria-label="Next"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          className="absolute bottom-0 left-0 right-0 z-30 flex justify-between items-end px-5 md:px-10 pb-8 md:pb-10 min-h-[56px] md:min-h-[64px]"
          style={{
            paddingBottom: 'max(2rem, calc(2rem + env(safe-area-inset-bottom, 0)))',
            paddingLeft: 'max(2.5rem, calc(2.5rem + env(safe-area-inset-left, 0)))',
            paddingRight: 'max(2.5rem, calc(2.5rem + env(safe-area-inset-right, 0)))',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.15) 40%, transparent)',
          }}
        >
          <span className="font-['Mondwest',_sans-serif] text-[14px] md:text-[18px] text-white/95 tracking-wide leading-snug pb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            {item.title}
          </span>
          <span className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] text-white/90 leading-snug pb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            {index + 1} / {n}
          </span>
        </div>
      </main>
    </div>
  )
}
