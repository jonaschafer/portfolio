'use client'

import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import WorkMedia from './WorkMedia'

const haas = "font-['Haas_Grot_Disp',_sans-serif]"

// Full-screen viewer for one project's images. Arrow keys step, Esc closes,
// a click on the backdrop closes. `href` adds a link to the project page.
export default function Lightbox({ project, index, setIndex, onClose, href }) {
  const closeRef = useRef(null)
  const count = project.images.length
  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count, setIndex])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [go, onClose])

  const file = project.images[index]
  const arrow = (d, label, path) => (
    <button
      type="button"
      onClick={() => go(d)}
      aria-label={label}
      className="w-12 h-12 flex items-center justify-center rounded-full border border-[#FAFAFA]/30 text-[#FAFAFA] hover:bg-[#FAFAFA]/10"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
  const backdrop = (e) => e.target === e.currentTarget && onClose()

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#1f2a1a] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} images`}
      onClick={backdrop}
    >
      <div className={`${haas} flex items-baseline justify-between gap-[24px] px-5 md:px-[60px] pt-[20px] text-[16px] text-[#FAFAFA]`}>
        <span className="font-['Mondwest',_sans-serif] text-[20px] md:text-[24px] tracking-[0.31px]">{project.title}</span>
        <div className="flex gap-[24px]">
          {href && (
            <Link href={href} className="hover:opacity-80 transition-opacity">
              View project →
            </Link>
          )}
          <button ref={closeRef} type="button" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Close
          </button>
        </div>
      </div>
      <div className="relative flex-1 m-5 md:mx-[60px] md:my-[24px]" onClick={backdrop}>
        <WorkMedia
          key={file}
          project={project}
          file={file}
          sizes="100vw"
          playing
          eager
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      <div className={`${haas} flex items-center justify-between px-5 md:px-[60px] pb-[20px] text-[16px] text-[#FAFAFA]`}>
        <span>
          {index + 1} / {count}
        </span>
        <div className="flex gap-[12px]">
          {arrow(-1, 'Previous image', 'M15 18L9 12L15 6')}
          {arrow(1, 'Next image', 'M9 18L15 12L9 6')}
        </div>
      </div>
    </div>
  )
}
