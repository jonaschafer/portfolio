'use client'

import { useRef, useState } from 'react'
import WorkMedia from './WorkMedia'

// One project's images as a sliding strip (Francine Thompson's gallery):
// arrows at the edges, swipe on touch, arrow keys when focused, and a click
// on the image opens the lightbox at that image.
export default function ProjectSlideshow({ project, onOpen, eager = false }) {
  const [i, setI] = useState(0)
  const n = project.images.length
  const go = (d) => setI((x) => (x + d + n) % n)
  const startX = useRef(null)

  const arrow = (d, label, path, side) => (
    <button
      type="button"
      onClick={() => go(d)}
      aria-label={label}
      className={`absolute ${side} top-1/2 -translate-y-1/2 z-10 w-[36px] h-[36px] rounded-full flex items-center justify-center bg-white/70 text-[#2E2E2E] backdrop-blur-sm opacity-80 hover:opacity-100 hover:bg-white transition active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2E2E2E]`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={path} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )

  return (
    <div
      className="relative w-full aspect-[1300/731] overflow-hidden rounded-[4px] select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${project.title} images`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') startX.current = e.clientX
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      }}
    >
      <div
        className="flex h-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {project.images.map((file, k) => (
          <button
            key={file}
            type="button"
            tabIndex={k === i ? 0 : -1}
            aria-hidden={k !== i}
            onClick={() => onOpen(project, k)}
            className="relative shrink-0 w-full h-full cursor-zoom-in"
            aria-label={`${project.title}, image ${k + 1} of ${n}, open larger`}
          >
            <WorkMedia
              project={project}
              file={file}
              sizes="(min-width: 1024px) 72vw, 100vw"
              playing
              eager={eager && k === 0}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      {n > 1 && (
        <>
          {arrow(-1, 'Previous image', 'M15 18L9 12L15 6', 'left-[12px]')}
          {arrow(1, 'Next image', 'M9 18L15 12L9 6', 'right-[12px]')}
        </>
      )}
    </div>
  )
}
