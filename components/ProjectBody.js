'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { WITH_PAGES } from '../app/work/projects'
import WorkMedia from './WorkMedia'
import Lightbox from './Lightbox'

const haas = "font-['Haas_Grot_Disp',_sans-serif]"
const mondwest = "font-['Mondwest',_sans-serif]"

// Rows cycle through these so the page isn't one big image after another
// (Ximena Keirouz, Elana Schlenker). `n` is how many images a row takes.
const ROWS = [
  { n: 1, cells: ['md:col-span-12'] },
  { n: 2, cells: ['md:col-span-7', 'md:col-span-5 md:mt-[120px]'] },
  { n: 1, cells: ['md:col-start-4 md:col-span-9'] },
  { n: 2, cells: ['md:col-span-6', 'md:col-span-6'] },
  { n: 1, cells: ['md:col-span-8'] },
]

function layout(images) {
  const rows = []
  let i = 0
  let r = 0
  while (i < images.length) {
    const pattern = ROWS[r % ROWS.length]
    const take = Math.min(pattern.n, images.length - i)
    const cells = take === pattern.n ? pattern.cells : ['md:col-span-12']
    rows.push(cells.map((cls, k) => ({ cls, index: i + k })))
    i += take
    r += 1
  }
  return rows
}

function Meta({ label, children }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[#FAFAFA]/60">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function ProjectBody({ slug, nextSlug }) {
  const project = WITH_PAGES.find((p) => p.slug === slug)
  const next = WITH_PAGES.find((p) => p.slug === nextSlug)
  const [open, setOpen] = useState(null)
  const setIndex = useCallback((fn) => setOpen((i) => fn(i)), [])
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      {/* Header: title, overview, credits (Juliana Ross, Gareth Hughes) */}
      <section className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] pt-[40px] md:pt-[60px] pb-[40px] md:pb-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-[24px] md:gap-x-[40px]">
          <h1 className={`${mondwest} md:col-span-4 text-[31px] md:text-[48px] leading-[1.1] tracking-[0.31px] text-[#FAFAFA]`}>
            {project.title}
          </h1>
          <p className={`${haas} md:col-span-5 text-[16px] md:text-[19.4px] leading-[1.35] tracking-[0.167px] text-[#FAFAFA]`}>
            {project.description}
          </p>
          <dl className={`${haas} md:col-span-3 flex flex-col gap-[12px] text-[13.4px] md:text-[16px] leading-[1.4] tracking-[0.16px] text-[#FAFAFA]`}>
            <Meta label="Role">
              {project.role}, {project.org}
            </Meta>
            <Meta label="Year">{project.year}</Meta>
            {project.partners?.length > 0 && (
              <Meta label="With">
                {project.partners.map((pt, k) => (
                  <span key={pt.name}>
                    {pt.href ? (
                      <a href={pt.href} target="_blank" rel="noopener noreferrer" className="hl">
                        {pt.name}
                      </a>
                    ) : (
                      pt.name
                    )}
                    {k < project.partners.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </Meta>
            )}
          </dl>
        </div>
      </section>

      {/* Image sequence */}
      <section className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] pb-[80px] flex flex-col gap-[16px] md:gap-[40px]">
        {layout(project.images).map((row, r) => (
          <div key={r} className="grid grid-cols-1 md:grid-cols-12 gap-[16px] md:gap-[40px] items-start">
            {row.map(({ cls, index }) => (
              <button
                key={index}
                type="button"
                onClick={() => setOpen(index)}
                className={`${cls} relative block w-full aspect-[1300/731] overflow-hidden rounded-[10px] cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FAFAFA]`}
                aria-label={`${project.title}, image ${index + 1}, open larger`}
              >
                <WorkMedia
                  project={project}
                  file={project.images[index]}
                  sizes="(min-width: 768px) 75vw, 100vw"
                  playing
                  eager={r === 0}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        ))}
      </section>

      {/* Next project: the arrow and a preview reveal on hover (Elana Schlenker) */}
      <section className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] pb-[60px]">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-end justify-between gap-[24px] border-t border-[#FAFAFA]/20 pt-[24px] text-[#FAFAFA]"
        >
          <span className="flex flex-col gap-[4px]">
            <span className={`${haas} text-[16px] tracking-[0.16px] text-[#FAFAFA]/60`}>Next project</span>
            <span className={`${mondwest} text-[31px] md:text-[48px] leading-[1.1] tracking-[0.31px] flex items-baseline gap-[16px]`}>
              {next.title}
              <span className="inline-block transition-transform duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-[12px]">
                →
              </span>
            </span>
          </span>
          <span className="hidden md:block relative w-[240px] aspect-[1300/731] overflow-hidden rounded-[6px] opacity-0 translate-y-[8px] transition duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 group-hover:translate-y-0">
            <WorkMedia project={next} file={next.images.find((f) => f.endsWith('.png')) || next.images[0]} sizes="240px" className="absolute inset-0 w-full h-full object-cover" />
          </span>
        </Link>
      </section>

      {open !== null && <Lightbox project={project} index={open} setIndex={setIndex} onClose={close} />}
    </>
  )
}
