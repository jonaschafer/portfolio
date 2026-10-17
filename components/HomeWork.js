'use client'

import { useCallback, useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import Lightbox from './Lightbox'
import ProjectSlideshow from './ProjectSlideshow'
import TestimonialsSection from './TestimonialsSection'
import { WITH_PAGES } from '../lib/projects'
import useRandomTheme from './useRandomTheme'

// The homepage is the work page, laid out like Francine Thompson's site:
// a big bio sentence, then each project inline as a 9-column slideshow
// beside a 3-column text block. No project pages.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"

function ProjectText({ p }) {
  return (
    <div className={`${social} flex flex-col gap-[14px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`}>
      <h2 className="text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]">{p.title}</h2>
      <p>{p.description}</p>
      <p>
        <i className={`${nichrome} italic`}>Role:</i>
        <br />
        {p.role}
      </p>
      {p.partners?.length > 0 && (
        <p>
          <i className={`${nichrome} italic`}>With:</i>
          <br />
          {p.partners.map((pt, k) => (
            <span key={pt.name}>
              {pt.href ? (
                <a href={pt.href} target="_blank" rel="noopener noreferrer" className="hl">
                  {pt.name}
                </a>
              ) : (
                pt.name
              )}
              {k < p.partners.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}
      <p>
        {p.org}, {p.year}
      </p>
    </div>
  )
}

export default function HomeWork() {
  // One theme for the whole page (nav, body, footer), dealt per load.
  const { theme: t, ready } = useRandomTheme()
  const [box, setBox] = useState(null)
  const open = useCallback((project, index) => setBox({ project, index }), [])
  const close = useCallback(() => setBox(null), [])
  const setIndex = useCallback((fn) => setBox((b) => (b ? { ...b, index: fn(b.index) } : b)), [])

  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <section className="px-[20px] md:px-[26px] pt-[32px] md:pt-[100px] pb-[48px] md:pb-[80px]">
        <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1340px]`}>
          I&apos;m Jon, head of brand at{' '}
          <a className="hl" href="https://www.classdojo.com/" target="_blank" rel="noopener noreferrer">
            ClassDojo
          </a>
          , located in rainy Portland. 🌧️ For the last 20 odd years I&apos;ve built <i className="italic">identities</i>,
          the <i className="italic">systems</i> that carry them, and the <i className="italic">teams</i> that keep &apos;em
          going.
        </h1>
      </section>

      <div className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px] flex flex-col gap-[72px] md:gap-[104px]">
        {WITH_PAGES.map((p, k) => (
          <article key={p.slug} className="grid grid-cols-1 lg:grid-cols-12 gap-y-[20px] lg:gap-x-[48px] items-start">
            <div className="lg:col-span-9">
              <ProjectSlideshow project={p} onOpen={open} eager={k === 0} />
            </div>
            <div className="lg:col-span-3">
              <ProjectText p={p} />
            </div>
          </article>
        ))}
      </div>

      <TestimonialsSection theme={t} />

      <Footer colophon theme={t} />
      {box && <Lightbox project={box.project} index={box.index} setIndex={setIndex} onClose={close} />}
    </main>
  )
}
