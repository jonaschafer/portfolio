'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PROJECTS, isVideo } from '../app/work/projects'
import WorkMedia from './WorkMedia'
import Lightbox from './Lightbox'

const VIEW_KEY = 'work-view'
const haas = "font-['Haas_Grot_Disp',_sans-serif]"
const mondwest = "font-['Mondwest',_sans-serif]"

const withMedia = PROJECTS.filter((p) => p.images?.length)

// Every image across projects, in project order, for the grid.
const TILES = withMedia.flatMap((p) => p.images.map((file, i) => ({ project: p, file, index: i })))

function Toggle({ view, setView }) {
  const opt = (value, label) => (
    <button
      type="button"
      onClick={() => setView(value)}
      aria-pressed={view === value}
      className={`${haas} text-[16px] leading-[1.4] tracking-[0.16px] transition-opacity ${
        view === value ? 'text-[#FAFAFA]' : 'text-[#FAFAFA]/40 hover:text-[#FAFAFA]/80'
      }`}
    >
      {label}
    </button>
  )
  return (
    <div className="flex gap-[16px]" role="group" aria-label="View">
      {opt('grid', 'Grid')}
      {opt('list', 'List')}
    </div>
  )
}

function GridTile({ tile, onOpen }) {
  const ref = useRef(null)
  const vid = isVideo(tile.file)
  return (
    <button
      type="button"
      onClick={() => onOpen(tile.project, tile.index)}
      onMouseEnter={() => vid && ref.current?.querySelector('video')?.play()}
      onMouseLeave={() => vid && ref.current?.querySelector('video')?.pause()}
      ref={ref}
      className="group relative block w-full aspect-[1300/731] overflow-hidden rounded-[4px] bg-[#FAFAFA]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FAFAFA]"
      aria-label={`${tile.project.title}, image ${tile.index + 1}`}
    >
      <WorkMedia
        project={tile.project}
        file={tile.file}
        sizes="(min-width: 1200px) 16vw, (min-width: 768px) 25vw, 50vw"
        className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-300 [@media(hover:hover)]:grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0"
      />
      <span
        className={`${haas} pointer-events-none absolute left-[8px] bottom-[6px] text-[12px] text-[#FAFAFA] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]`}
      >
        {tile.project.title}
      </span>
    </button>
  )
}

function Grid({ onOpen }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 desktop:grid-cols-6 gap-[8px]">
      {TILES.map((tile) => (
        <GridTile key={`${tile.project.slug}-${tile.file}`} tile={tile} onOpen={onOpen} />
      ))}
    </div>
  )
}

function List({ onOpen }) {
  const [open, setOpen] = useState(null)
  return (
    <ul className="flex flex-col">
      {PROJECTS.map((p, i) => {
        const n = String(i + 1).padStart(3, '0')
        const expanded = open === p.slug
        const cells = (
          <>
            <span className="w-[44px] shrink-0 text-[#FAFAFA]/60">{n}</span>
            <span className="flex-1">{p.title}</span>
            <span className={`hidden md:block flex-1 ${p.soon ? '' : 'text-[#FAFAFA]/80'}`}>{p.org}, {p.role}</span>
            <span className="w-[88px] shrink-0 text-right whitespace-nowrap">{p.year}</span>
          </>
        )
        const rowText = `${haas} text-[16px] md:text-[19.4px] leading-[1.4] tracking-[0.167px]`
        return (
          <li key={p.slug} className="border-t border-[#FAFAFA]/20 last:border-b">
            {p.soon ? (
              <div className={`${rowText} flex items-baseline gap-[16px] py-[12px] text-[#FAFAFA]/35`}>{cells}</div>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : p.slug)}
                aria-expanded={expanded}
                className={`${rowText} w-full text-left flex items-baseline gap-[16px] py-[12px] text-[#FAFAFA] hover:bg-[#FAFAFA]/5 transition-colors`}
              >
                {cells}
              </button>
            )}
            {expanded && (
              <div className="pb-[32px] pt-[8px] md:pl-[60px] grid gap-[24px] md:grid-cols-[minmax(0,360px)_1fr] md:gap-[40px]">
                <div className={`${haas} flex flex-col gap-[16px] text-[16px] leading-[1.4] tracking-[0.16px] text-[#FAFAFA]`}>
                  <p>{p.description}</p>
                  <Link href={`/work/${p.slug}`} className="self-start hover:opacity-80 transition-opacity">
                    View project →
                  </Link>
                </div>
                <div className="grid grid-cols-3 desktop:grid-cols-4 gap-[8px]">
                  {p.images.map((file, idx) => (
                    <button
                      key={file}
                      type="button"
                      onClick={() => onOpen(p, idx)}
                      className="relative block w-full aspect-[1300/731] overflow-hidden rounded-[4px] bg-[#FAFAFA]/10 hover:opacity-90"
                      aria-label={`${p.title}, image ${idx + 1}`}
                    >
                      <WorkMedia project={p} file={file} sizes="(min-width: 768px) 15vw, 33vw" className="absolute inset-0 w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function WorkIndex() {
  const [view, setViewState] = useState('grid')
  const [box, setBox] = useState(null) // { project, index }

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('view')
    let saved = null
    try {
      saved = localStorage.getItem(VIEW_KEY)
    } catch {}
    const v = fromUrl || saved
    if (v === 'grid' || v === 'list') setViewState(v)
  }, [])

  const setView = (v) => {
    setViewState(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {}
    const url = new URL(window.location.href)
    url.searchParams.set('view', v)
    window.history.replaceState(null, '', url)
  }

  const open = useCallback((project, index) => setBox({ project, index }), [])
  const close = useCallback(() => setBox(null), [])
  const setIndex = useCallback((fn) => setBox((b) => (b ? { ...b, index: fn(b.index) } : b)), [])

  return (
    <div className="bg-[#435938] w-full">
      <section className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] pt-[20px] pb-[60px] flex flex-col gap-[24px]">
        <div className="flex items-baseline justify-between">
          <h2 className={`${haas} text-[16px] leading-[1.4] tracking-[0.16px] text-[#FAFAFA]/60`}>Work</h2>
          <Toggle view={view} setView={setView} />
        </div>
        {view === 'grid' ? <Grid onOpen={open} /> : <List onOpen={open} />}
      </section>
      {box && <Lightbox project={box.project} index={box.index} setIndex={setIndex} onClose={close} href={`/work/${box.project.slug}`} />}
    </div>
  )
}
