'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Rich, Levels, Tick, Visual, visualImages, CONFIDENCE } from './ui'

const PRESENT_EVENT = 'aleph:present'
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ */
/* Top bar                                                             */
/* ------------------------------------------------------------------ */

const NAV = [
  ['overview', 'Overview'],
  ['surfaces', 'Surfaces'],
  ['evidence', 'Evidence'],
]

export function PresentButton({ big }) {
  return (
    <button
      type="button"
      className={`btn-present ${big ? 'big' : ''}`}
      onClick={() => window.dispatchEvent(new Event(PRESENT_EVENT))}
    >
      Present<kbd>P</kbd>
    </button>
  )
}

export function TopBar() {
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -59% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <header className="bar">
      <div className="wrap bar-in">
        <a className="bar-title" href="#top">Aleph brand audit</a>
        <nav className="bar-nav" aria-label="Sections">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a>
          ))}
        </nav>
        <PresentButton />
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Surface filter: flips data-filter on the table; CSS does the rest    */
/* ------------------------------------------------------------------ */

const FILTERS = [
  ['all', 'All'],
  ['ours', 'Ours'],
  ['ra', 'Red Antler'],
]

export function SurfaceFilter({ counts }) {
  const [f, setF] = useState('all')
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aleph-surface-filter')
      if (saved && counts[saved] !== undefined) setF(saved)
    } catch {}
  }, [counts])
  useEffect(() => {
    document.getElementById('surface-table')?.setAttribute('data-filter', f)
    try { localStorage.setItem('aleph-surface-filter', f) } catch {}
  }, [f])
  return (
    <div className="seg" role="group" aria-label="Filter surfaces">
      {FILTERS.map(([key, label]) => (
        <button key={key} type="button" aria-pressed={f === key} onClick={() => setF(key)}>
          {label} <b>{counts[key]}</b>
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* F-number previews on hover (fine pointers only)                     */
/* ------------------------------------------------------------------ */

export function RefPreview({ refs }) {
  const [tip, setTip] = useState(null)
  const warm = useRef(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let showTimer, coolTimer
    const find = (e) => e.target.closest?.('a.fref')
    const over = (e) => {
      const a = find(e)
      if (!a || !refs[a.textContent.trim()]) return
      clearTimeout(showTimer)
      clearTimeout(coolTimer)
      const show = () => {
        const r = a.getBoundingClientRect()
        setTip({ id: a.textContent.trim(), x: r.left + r.width / 2, top: r.top, bottom: r.bottom, instant: warm.current })
        warm.current = true
      }
      // First preview waits a beat; neighbors open instantly after that.
      if (warm.current) show()
      else showTimer = setTimeout(show, 260)
    }
    const out = (e) => {
      if (!find(e)) return
      clearTimeout(showTimer)
      setTip(null)
      coolTimer = setTimeout(() => { warm.current = false }, 450)
    }
    const hide = () => setTip(null)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    window.addEventListener('scroll', hide, { passive: true })
    return () => {
      clearTimeout(showTimer)
      clearTimeout(coolTimer)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
      window.removeEventListener('scroll', hide)
    }
  }, [refs])

  if (!tip) return null
  const r = refs[tip.id]
  const above = tip.top > 170
  const x = Math.min(Math.max(tip.x, 170), window.innerWidth - 170)
  return (
    <div
      className={`ref-tip ${above ? 'above' : 'below'}`}
      data-instant={tip.instant ? '' : undefined}
      style={{ left: x, top: above ? tip.top - 10 : tip.bottom + 10 }}
      role="tooltip"
    >
      <span className="ref-tip-h">{tip.id}<Levels levels={r.levels} tips={false} /></span>
      <span className="ref-tip-c">{r.claim}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Lightbox: any <button class="zoom"> on the page opens its large image */
/* ------------------------------------------------------------------ */

export function Lightbox() {
  const [shot, setShot] = useState(null)
  const [closing, setClosing] = useState(false)
  const opener = useRef(null)
  const root = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      const b = e.target.closest?.('button.zoom')
      if (!b || b.closest('.pm')) return
      e.preventDefault()
      opener.current = b
      setClosing(false)
      setShot({ src: b.dataset.full, caption: b.dataset.caption, alt: b.querySelector('img')?.alt || '' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setShot(null)
      setClosing(false)
      opener.current?.focus?.()
    }, reduceMotion() ? 0 : 160)
  }, [])

  useEffect(() => {
    if (!shot) return
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
    }
    window.addEventListener('keydown', onKey, true)
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    root.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey, true)
      document.documentElement.style.overflow = prev
    }
  }, [shot, close])

  if (!shot) return null
  return (
    <div
      ref={root}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      tabIndex={-1}
      data-closing={closing ? '' : undefined}
      onClick={close}
    >
      <figure className="lb-fig">
        <img src={shot.src} alt={shot.alt} />
        {shot.caption && <figcaption>{shot.caption}</figcaption>}
      </figure>
      <button type="button" className="lb-x" onClick={close}>Close<kbd>Esc</kbd></button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Present mode                                                        */
/* ------------------------------------------------------------------ */

function buildSlides(d) {
  const st = d.overview.standouts
  const slides = [{ kind: 'cover' }, { kind: 'why' }, { kind: 'read' }, { kind: 'tldr' }]
  st.forEach((t, i) => {
    slides.push({ kind: 'takeaway', t, i, n: st.length, images: visualImages(t.visual) })
    if (t.related) slides.push({ kind: 'compare', t })
  })
  slides.push({ kind: 'working' }, { kind: 'rebrand' }, { kind: 'areas' }, { kind: 'surfaces' }, { kind: 'ours' }, { kind: 'question' })
  return slides
}

const pad = (n) => String(n).padStart(2, '0')

function Slide({ s, d }) {
  const { meta, overview: o, rollup: r, compare, images, refs } = d
  switch (s.kind) {
    case 'cover':
      return (
        <div className="s-cover">
          <p className="s-lbl">Brand audit · {meta.date}</p>
          <h1 className="s-title">Aleph brand audit</h1>
          <p className="s-by">{meta.author}</p>
          <p className="s-lbl s-foot-note">
            {meta.counts.findings} findings · {meta.counts.surfaces} surfaces · every claim traces to its evidence
          </p>
        </div>
      )
    case 'why':
      return (
        <div className="s-text">
          <p className="s-lbl">Why an audit, and why now</p>
          <p className="s-para"><Rich text={o.why} refs="text" /></p>
        </div>
      )
    case 'read':
      return (
        <div className="s-read">
          <p className="s-lbl">How to read this</p>
          <div className="s-read-cols">
            <p className="s-para"><Rich text={o.bias} refs="text" /></p>
            <ul className="s-legend">
              {CONFIDENCE.map((l) => (
                <li key={l.key}>
                  <span className="s-legend-k"><Tick level={l.key} /></span>
                  <span><b>{l.label}</b>{l.text}</span>
                </li>
              ))}
              <li>
                <span className="s-legend-k"><span className="fref">F-014</span></span>
                <span><b>F-numbers</b>Each one links to its evidence on the page.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    case 'tldr':
      return (
        <div className="s-text">
          <p className="s-lbl">TL;DR</p>
          <p className="s-state"><Rich text={o.tldr} refs="text" /></p>
        </div>
      )
    case 'takeaway': {
      const t = s.t
      return (
        <div className={`s-take kind-${t.visual?.type || 'none'}`}>
          <div className="s-take-l">
            <p className="s-lbl">What stands out · {s.i + 1} of {s.n}</p>
            <h2 className="s-claim">{t.claim}</h2>
            <p className="s-body"><Rich text={t.body} refs="text" /></p>
            <div className="s-move">
              <p className="s-lbl">The move</p>
              <p><Rich text={t.move} refs="text" /></p>
            </div>
            <p className="s-refs">
              {t.refs.map((id) => (
                <span key={id}><span className="fref">{id}</span><Levels levels={refs[id]?.levels} short tips={false} /></span>
              ))}
            </p>
          </div>
          <div className="s-take-r"><Visual v={t.visual} images={images} eager zoom={false} /></div>
        </div>
      )
    }
    case 'compare': {
      const rel = s.t.related
      const Rows = ({ list }) => list.map((c) => (
        <li key={c.site} data-us={c.site === 'Aleph' || c.site === 'Drivetrain' ? '' : undefined}>
          <span className="s-site">{c.site}{c.aiInTitle && <em>AI in title</em>}</span>
          <span className="s-h1">{c.h1}</span>
        </li>
      ))
      return (
        <div className="s-compare">
          <p className="s-lbl">Related to #{s.t.n} · {rel.refs.join(', ')}</p>
          <h2 className="s-claim">{rel.claim}</h2>
          <div className="s-cmp-cols">
            <div><p className="s-lbl">Finance competitors, homepage headline</p><ul><Rows list={compare.finance} /></ul></div>
            <div><p className="s-lbl">Reference brands</p><ul><Rows list={compare.reference} /></ul></div>
          </div>
        </div>
      )
    }
    case 'working':
      return (
        <div className="s-text">
          <p className="s-lbl">What’s working</p>
          <p className="s-state s-state-sm"><Rich text={o.working.text} refs="text" /></p>
          <p className="s-refs">{o.working.refs.map((id) => <span key={id} className="fref">{id}</span>)}</p>
        </div>
      )
    case 'rebrand':
      return (
        <div className="s-text">
          <p className="s-lbl">What it means for the rebrand</p>
          <ol className="s-list">{o.rebrand.map((b, i) => <li key={i}><Rich text={b} refs="text" /></li>)}</ol>
        </div>
      )
    case 'areas':
      return (
        <div className="s-areas">
          <p className="s-lbl">By area · the one thing</p>
          <dl>
            {d.byArea.map((a) => (
              <div key={a.bucket}><dt>{a.bucket}</dt><dd><Rich text={a.oneThing} refs="text" /></dd></div>
            ))}
          </dl>
        </div>
      )
    case 'surfaces':
      return (
        <div className="s-surf">
          <p className="s-lbl">Surface map</p>
          <h2 className="s-claim">{r.total} surfaces. {r.sow.Yes} are with Red Antler, and {r.ours} are ours.</h2>
          <dl className="s-nums">
            <div><dt>{r.sow.Yes}</dt><dd>Red Antler</dd></div>
            <div className="hot"><dt>{r.ours}</dt><dd>ours</dd></div>
            <div><dt>{r.oursP1.length}</dt><dd>ours at P1, shipping with the rebrand</dd></div>
          </dl>
        </div>
      )
    case 'ours':
      return (
        <div className="s-ours">
          <p className="s-lbl">The list we own</p>
          <h2 className="s-claim">{r.oursP1.length} of ours ship with the rebrand</h2>
          <ul>{r.oursP1.map((name) => <li key={name}>{name}</li>)}</ul>
        </div>
      )
    case 'question':
      return (
        <div className="s-text">
          <p className="s-lbl">One question</p>
          <p className="s-state"><Rich text={o.question} refs="text" /></p>
          <p className="s-para s-ask"><Rich text={o.ask} refs="text" /></p>
        </div>
      )
    default:
      return null
  }
}

export function PresentMode({ deck }) {
  const slides = useMemo(() => buildSlides(deck), [deck])
  const n = slides.length
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [i, setI] = useState(0)
  const [dir, setDir] = useState('none')
  const [idle, setIdle] = useState(false)
  const iRef = useRef(0)
  const rootRef = useRef(null)
  const returnFocus = useRef(null)

  const go = useCallback((to) => {
    const next = Math.max(0, Math.min(n - 1, to))
    if (next === iRef.current) return
    setDir(next > iRef.current ? 'next' : 'prev')
    iRef.current = next
    setI(next)
  }, [n])

  const show = useCallback((at = 0) => {
    returnFocus.current = document.activeElement
    iRef.current = Math.max(0, Math.min(n - 1, at))
    setI(iRef.current)
    setDir('none')
    setClosing(false)
    setOpen(true)
  }, [n])

  const hide = useCallback(() => {
    setClosing(true)
    if (document.fullscreenElement) document.exitFullscreen?.()
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
      window.history.replaceState(null, '', window.location.pathname)
      returnFocus.current?.focus?.()
    }, reduceMotion() ? 0 : 140)
  }, [])

  // ?present=1#slide-4 opens straight into the deck
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('present') === '1') {
      const m = /^#slide-(\d+)$/.exec(window.location.hash)
      show(m ? +m[1] - 1 : 0)
    }
    const onPresent = () => show(0)
    window.addEventListener(PRESENT_EVENT, onPresent)
    return () => window.removeEventListener(PRESENT_EVENT, onPresent)
  }, [show])

  // Keep the URL in step so a reload lands on the same slide
  useEffect(() => {
    if (open && !closing) window.history.replaceState(null, '', `${window.location.pathname}?present=1#slide-${i + 1}`)
  }, [open, closing, i])

  // Lock page scroll and take focus while presenting
  useEffect(() => {
    if (!open) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    rootRef.current?.focus()
    return () => { document.documentElement.style.overflow = prev }
  }, [open])

  // Keys: P opens; arrows, space, page keys, Home/End move; F full screen; Esc exits
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      if (!open) {
        if ((e.key === 'p' || e.key === 'P') && !document.querySelector('.lb')) { e.preventDefault(); show(0) }
        return
      }
      const k = e.key
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) go(iRef.current + 1)
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) go(iRef.current - 1)
      else if (k === 'Home') go(0)
      else if (k === 'End') go(n - 1)
      else if (k === 'Escape' || k === 'p' || k === 'P') hide()
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) document.exitFullscreen?.()
        else rootRef.current?.requestFullscreen?.()
      } else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, hide, show, n])

  // Hide the cursor and controls after two idle seconds (clean for recording)
  useEffect(() => {
    if (!open) return
    let t
    const wake = () => {
      setIdle(false)
      clearTimeout(t)
      t = setTimeout(() => setIdle(true), 2000)
    }
    wake()
    window.addEventListener('pointermove', wake)
    return () => { clearTimeout(t); window.removeEventListener('pointermove', wake) }
  }, [open])

  // Warm the next slide's screenshots
  useEffect(() => {
    if (!open) return
    for (const k of slides[i + 1]?.images || []) {
      const src = deck.images[k]?.src
      if (src) { const img = new Image(); img.src = src }
    }
  }, [open, i, slides, deck.images])

  if (!open) return null
  const s = slides[i]

  const onStageClick = (e) => {
    if (e.target.closest('a, button')) return
    const box = e.currentTarget.getBoundingClientRect()
    go(e.clientX - box.left < box.width * 0.3 ? iRef.current - 1 : iRef.current + 1)
  }

  return (
    <div
      ref={rootRef}
      className="pm"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation"
      tabIndex={-1}
      data-closing={closing ? '' : undefined}
      data-idle={idle ? '' : undefined}
      data-invert={s.kind === 'working' ? '' : undefined}
    >
      <div className="pm-stage" onClick={onStageClick}>
        <div key={i} className={`slide slide-${s.kind}`} data-dir={dir}>
          <Slide s={s} d={deck} />
        </div>
        <div className="pm-foot" aria-hidden="true">
          <span>Aleph brand audit · {deck.meta.author}</span>
          <span>{pad(i + 1)} / {pad(n)}</span>
        </div>
        <div className="pm-prog" style={{ transform: `scaleX(${(i + 1) / n})` }} />
      </div>
      <p className="sr-only" aria-live="polite">Slide {i + 1} of {n}</p>
      <div className="pm-ctl">
        <button type="button" onClick={() => go(iRef.current - 1)} aria-label="Previous slide" disabled={i === 0}>←</button>
        <button type="button" onClick={() => go(iRef.current + 1)} aria-label="Next slide" disabled={i === n - 1}>→</button>
        <button type="button" onClick={hide}>Exit<kbd>Esc</kbd></button>
      </div>
    </div>
  )
}
