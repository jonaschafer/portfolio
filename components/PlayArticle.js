'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navigation from './Navigation'
import Footer from './Footer'
import useRandomTheme from './useRandomTheme'
import HomelabDiagram from './builds/HomelabDiagram'
import DojoBriefExample from './builds/DojoBriefExample'

// Hero diagrams drawn in the page's ink, keyed by hero.src.
const DIAGRAMS = { homelab: HomelabDiagram, 'dojo-brief': DojoBriefExample }

// A build write-up on /play. One narrow column (after joshpuckett.me/bloom):
// the name, a one-line h2 of what it does, the piece itself in a frame, then
// a short article. Same dealt theme, faces and gutters as the /play index.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const ultra = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const formatDate = (d) => {
  const [y, m] = d.split('.')
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`
}
const isVideoSrc = (src = '') => /\.(mp4|webm|mov)$/i.test(src)

// The frame every piece sits in: rounded, on the checkerboard until loaded.
function Frame({ children, loaded, ink, tall }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[4px] ${tall ? '' : ''}`}
      style={{ boxShadow: `inset 0 0 0 1px ${ink}26` }}
    >
      <span aria-hidden="true" className="load-checker absolute inset-0 transition-opacity duration-500" style={{ opacity: loaded ? 0 : 1 }} />
      {children}
    </div>
  )
}

function Media({ type, src, poster, alt, title, ink, bg, height }) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(null)
  // Media can finish before hydration attaches onLoad, so check on mount too.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.tagName === 'VIDEO' ? el.readyState >= 2 : el.tagName === 'IMG' && el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])
  const cls = 'load-fade relative block w-full h-auto'

  if (type === 'diagram') {
    const Diagram = DIAGRAMS[src]
    return (
      // Diagrams keep a readable size on phones and scroll sideways instead.
      <div className="rounded-[4px] p-[16px] md:p-[24px] overflow-x-auto" style={{ boxShadow: `inset 0 0 0 1px ${ink}26` }}>
        <div className={src === 'homelab' ? 'min-w-[560px]' : ''}>
          <Diagram />
        </div>
      </div>
    )
  }
  if (type === 'iframe') {
    return (
      <Frame loaded={loaded} ink={ink}>
        <iframe
          ref={ref}
          // The piece takes the page's theme, so it reads as part of the article.
          src={`${src}?bg=${encodeURIComponent(bg)}&ink=${encodeURIComponent(ink)}`}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          data-loaded={loaded}
          className="load-fade relative block w-full border-0"
          style={{ height: height || 620 }}
        />
      </Frame>
    )
  }
  if (type === 'video' || isVideoSrc(src)) {
    return (
      <Frame loaded={loaded} ink={ink}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          data-loaded={loaded}
          aria-label={alt}
          className={cls}
        />
      </Frame>
    )
  }
  return (
    <Frame loaded={loaded} ink={ink}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={ref} src={src} alt={alt || ''} loading="lazy" onLoad={() => setLoaded(true)} data-loaded={loaded} className={cls} />
    </Frame>
  )
}

export default function PlayArticle({ build, body }) {
  const { theme: t, ready } = useRandomTheme()
  const rule = `${t.ink}40`

  // Markdown in the site's faces. An image line becomes a figure; a .mp4
  // "image" plays as a looping video, and its alt text is the caption.
  const prose = {
    p: ({ node, children }) => {
      const only = node.children.length === 1 && node.children[0].tagName === 'img'
      if (only) return <>{children}</>
      return <p className="my-[18px]">{children}</p>
    },
    img: ({ src, alt }) => (
      <figure className="my-[32px] md:my-[40px]">
        <Media src={src} alt={alt} ink={t.ink} type={isVideoSrc(src) ? 'video' : 'image'} />
        {alt && <figcaption className="mt-[10px] text-[14px] md:text-[15px] leading-[1.3] opacity-70">{alt}</figcaption>}
      </figure>
    ),
    h2: ({ children }) => (
      <h2 className={`${ultra} text-[22px] md:text-[24px] leading-[1.05] tracking-[0.3px] mt-[44px] mb-[4px]`}>{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-[19px] md:text-[20px] leading-[1.2] tracking-[0.2px] mt-[28px] mb-[2px] opacity-80">{children}</h3>,
    a: ({ href, children }) => (
      <a href={href} className="hl" target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="my-[18px] pl-[20px] list-disc flex flex-col gap-[6px]">{children}</ul>,
    ol: ({ children }) => <ol className="my-[18px] pl-[22px] list-decimal flex flex-col gap-[6px]">{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className={`${nichrome} italic text-[20px] md:text-[22px] leading-[1.3] tracking-[0.2px] my-[32px] pl-[18px] border-l`} style={{ borderColor: t.ink }}>
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="text-[0.92em] px-[4px] py-[1px] rounded-[2px]" style={{ backgroundColor: `${t.ink}14` }}>
        {children}
      </code>
    ),
    hr: () => <hr className="my-[40px] border-t" style={{ borderColor: rule }} />,
  }

  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <article className={`${social} px-[20px] md:px-[26px] pt-[32px] md:pt-[88px] pb-[80px] md:pb-[120px]`}>
        <div className="mx-auto max-w-[680px]">
          <Link href="/play" className="hl text-[16px] md:text-[17px] opacity-80">
            ← Play
          </Link>

          <header className="mt-[28px] md:mt-[40px]">
            <h1 className={`${nichrome} text-[34px] md:text-[44px] leading-[1.05] tracking-[0.2px]`}>{build.name}</h1>
            <h2 className="mt-[12px] text-[20px] md:text-[22px] leading-[1.25] tracking-[0.21px] opacity-80">{build.dek}</h2>
            <div className="mt-[20px] pt-[14px] border-t flex flex-wrap items-center gap-x-[14px] gap-y-[8px] text-[15px]" style={{ borderColor: rule }}>
              <span className="opacity-70 tabular-nums">{formatDate(build.date)}</span>
              <ul className="flex flex-wrap gap-[6px]" aria-label="Built with">
                {build.tags.map((name) => (
                  <li key={name} className="rounded-[4px] border px-[8px] py-[3px] text-[14px] leading-[1.2] opacity-80" style={{ borderColor: t.ink }}>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <div className="mt-[28px] md:mt-[36px]">
            <Media {...build.hero} ink={t.ink} bg={t.bg} />
            {build.hero.caption && <p className="mt-[10px] text-[14px] md:text-[15px] leading-[1.3] opacity-70">{build.hero.caption}</p>}
          </div>

          <div className="mt-[28px] md:mt-[36px] text-[17px] md:text-[19px] leading-[1.42] tracking-[0.17px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={prose}>
              {body}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer colophon theme={t} />
    </main>
  )
}
