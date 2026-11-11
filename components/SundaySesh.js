'use client'

import { useEffect, useMemo, useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import useRandomTheme from './useRandomTheme'
import { generate, boardText, sundayOf, isoDay, benchmarkFor, SHAPES } from '../lib/sesh/generate'
import { GLOSSARY } from '../lib/sesh/data'

// /sunday-sesh, in the site register. Pick the headcount and length, get a
// board for the garage whiteboard. Seeded by date so the crew sees the same
// one all week; reroll if it's not the one.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const ultra = "font-['Nichrome','Arial_Black',sans-serif] font-black"

const parseDay = (s) => {
  const [y, m, d] = (s || '').split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}

function Seg({ options, value, onChange, t, label, loose }) {
  return (
    <div role="radiogroup" aria-label={label} className={loose ? 'flex flex-wrap gap-[6px]' : 'flex'}>
      {options.map(([v, text], i) => {
        const on = v === value
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(v)}
            className={`min-w-[40px] h-[38px] px-[10px] border tabular-nums transition-colors active:scale-[0.97] ${loose ? 'rounded-[4px]' : `${i ? '-ml-px' : ''} ${i === 0 ? 'rounded-l-[4px]' : ''} ${i === options.length - 1 ? 'rounded-r-[4px]' : ''}`}`}
            style={{ borderColor: t.ink, background: on ? t.ink : 'transparent', color: on ? t.bg : t.ink }}
          >
            {text}
          </button>
        )
      })}
    </div>
  )
}

function Btn({ children, onClick, t, solid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[38px] px-[12px] rounded-[4px] border active:scale-[0.97] transition-opacity hover:opacity-80"
      style={{ borderColor: t.ink, background: solid ? t.ink : 'transparent', color: solid ? t.bg : t.ink }}
    >
      {children}
    </button>
  )
}

function InfoDot({ open, onClick, t, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={label}
      className={`${nichrome} italic shrink-0 w-[24px] h-[24px] rounded-full border text-[14px] leading-none flex items-center justify-center active:scale-[0.97] transition-colors`}
      style={{ borderColor: t.ink, background: open ? t.ink : 'transparent', color: open ? t.bg : t.ink }}
    >
      i
    </button>
  )
}

// A board line. Lines with a cue get a dotted underline and open it on tap.
function Line({ l, t }) {
  const [open, setOpen] = useState(false)
  if (!l.cue) return <li className="py-[3px]">{l.text}</li>
  return (
    <li className="py-[3px]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="text-left underline decoration-dotted underline-offset-[4px] hover:opacity-80"
        style={{ textDecorationColor: `${t.ink}80` }}
      >
        {l.text}
      </button>
      {open && <p className="text-[15px] md:text-[16px] opacity-80 mt-[4px] mb-[6px] max-w-[420px]">{l.cue}</p>}
    </li>
  )
}

function Block({ b, t }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="border-t pt-[16px] md:pt-[20px]" style={{ borderColor: `${t.ink}40` }}>
      <div className="flex items-start justify-between gap-[12px]">
        <h3 className={`${ultra} text-[20px] md:text-[24px] leading-[1.05] tracking-[0.3px]`}>
          {b.label ? `${b.label}. ` : ''}
          {b.title}
        </h3>
        <InfoDot open={open} onClick={() => setOpen(!open)} t={t} label={`How ${b.format} works`} />
      </div>
      {open && (
        <div className="mt-[12px] p-[14px] rounded-[4px] text-[15px] md:text-[16px] leading-[1.35]" style={{ background: `${t.ink}14` }}>
          <p>
            <span className={`${nichrome} italic`}>{b.format}: </span>
            {b.what}
          </p>
          <p className="mt-[8px]">{b.group}</p>
        </div>
      )}
      <ul className="mt-[12px] text-[18px] md:text-[20px] leading-[1.25]">
        {b.lines.map((l, i) => (
          <Line key={`${b.key}-${i}-${l.text}`} l={l} t={t} />
        ))}
      </ul>
      {!open && <p className="mt-[10px] text-[15px] md:text-[16px] opacity-70 max-w-[460px]">{b.group}</p>}
    </li>
  )
}

export default function SundaySesh() {
  const { theme: t, ready } = useRandomTheme()
  const [day, setDay] = useState(null)
  const [n, setN] = useState(4)
  const [minutes, setMinutes] = useState(45)
  const [roll, setRoll] = useState(0)
  const [shape, setShape] = useState('mix')
  const [copied, setCopied] = useState(false)

  // Read ?n=&t=&d=&r= once, so a link drops the crew on the same board.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const qn = Number(q.get('n'))
    const qt = Number(q.get('t'))
    if (qn >= 1 && qn <= 6) setN(qn)
    if (qt === 45 || qt === 60) setMinutes(qt)
    setRoll(Number(q.get('r')) || 0)
    if (SHAPES[q.get('s')]) setShape(q.get('s'))
    setDay(parseDay(q.get('d')) || sundayOf())
  }, [])

  useEffect(() => {
    if (!day) return
    const q = new URLSearchParams({ n: String(n), t: String(minutes), d: isoDay(day) })
    if (shape !== 'mix') q.set('s', shape)
    if (roll) q.set('r', String(roll))
    window.history.replaceState(null, '', `?${q}`)
  }, [day, n, minutes, roll, shape])

  const sesh = useMemo(() => (day ? generate({ date: day, n, minutes, roll, shape }) : null), [day, n, minutes, roll, shape])
  const bench = day ? benchmarkFor(day) : null

  const shift = (weeks) => {
    const d = new Date(day)
    d.setDate(d.getDate() + weeks * 7)
    setDay(d)
    setRoll(0)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(boardText(day, sesh.blocks))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <section className="px-[20px] md:px-[26px] pt-[32px] md:pt-[100px] pb-[40px] md:pb-[64px]">
        <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1340px]`}>
          Sunday sesh. A new workout for the garage crew every week, sized to whoever shows up. Copy it onto the whiteboard and go. 🏋️
        </h1>
      </section>

      <div className={`${social} text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`}>
        <section className="px-[20px] md:px-[26px] pb-[40px] md:pb-[56px]">
          <div className="flex flex-wrap items-end gap-x-[28px] gap-y-[18px]">
            <div>
              <p className="mb-[6px] opacity-70">Sunday</p>
              <div className="flex items-center gap-[6px]">
                <Btn t={t} onClick={() => shift(-1)}>‹</Btn>
                <span className="min-w-[112px] text-center tabular-nums text-[18px]">
                  {day ? day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                </span>
                <Btn t={t} onClick={() => shift(1)}>›</Btn>
              </div>
            </div>
            <div>
              <p className="mb-[6px] opacity-70">How many of us</p>
              <Seg label="Headcount" t={t} value={n} onChange={setN} options={[1, 2, 3, 4, 5, 6].map((v) => [v, v])} />
            </div>
            <div>
              <p className="mb-[6px] opacity-70">Length</p>
              <Seg label="Length" t={t} value={minutes} onChange={setMinutes} options={[[45, '45 min'], [60, '60 min']]} />
            </div>
            <div>
              <p className="mb-[6px] opacity-70">Shape</p>
              <Seg
                loose
                label="Session shape"
                t={t}
                value={shape}
                onChange={(v) => { setShape(v); setRoll(0) }}
                options={[['mix', 'Mix'], ...Object.entries(SHAPES).map(([k, v]) => [k, v.name])]}
              />
            </div>
            <div className="flex gap-[8px]">
              <Btn t={t} onClick={() => setRoll(roll + 1)}>Reroll 🎲</Btn>
              <Btn t={t} solid onClick={copy}>{copied ? 'Copied' : 'Copy board'}</Btn>
            </div>
          </div>
        </section>

        {sesh && (
          <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
            <div className="flex items-baseline justify-between gap-[16px] mb-[24px] md:mb-[32px]">
              <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`}>
                Sunday sesh {day.getMonth() + 1}/{day.getDate()}
              </h2>
              <span className="opacity-70 tabular-nums whitespace-nowrap">~{sesh.total} min</span>
            </div>
            <p className="-mt-[12px] md:-mt-[16px] mb-[24px] md:mb-[32px] max-w-[640px]">
              <span className={`${nichrome} italic`}>{SHAPES[sesh.shape].name}{shape === 'mix' ? ' this week' : ''}: </span>
              {SHAPES[sesh.shape].what}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[48px] gap-y-[40px] md:gap-y-[56px]">
              {sesh.blocks.map((b) => (
                <Block key={`${b.key}-${b.label}-${roll}-${n}-${minutes}-${shape}-${isoDay(day)}`} b={b} t={t} />
              ))}
            </ul>
            <p className="mt-[32px] opacity-70 max-w-[640px]">
              Tap any underlined move for a cue, and the circled i for how the format works with your headcount.
            </p>
          </section>
        )}

        {bench && (
          <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
            <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[24px] md:mb-[32px]`}>Benchmark of the month</h2>
            <div className="border-t pt-[16px] md:pt-[20px] grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-[48px] gap-y-[16px] max-w-[1100px]" style={{ borderColor: `${t.ink}40` }}>
              <div>
                <p className={`${ultra} text-[20px] md:text-[24px] leading-[1.05]`}>{bench.name}</p>
                <ul className="mt-[12px] text-[18px] md:text-[20px] leading-[1.25]">
                  {bench.lines.map((l) => (
                    <li key={l} className="py-[3px]">{l}</li>
                  ))}
                </ul>
              </div>
              <div className="max-w-[460px]">
                <p>
                  <span className={`${nichrome} italic`}>Score: </span>
                  {bench.score}
                </p>
                <p className="mt-[8px]">{bench.note}</p>
                <p className="mt-[8px] opacity-70">On Mix, it runs as block B on the first Sunday of the month. Write the score down and beat it next time it comes around.</p>
              </div>
            </div>
          </section>
        )}

        <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
          <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[24px] md:mb-[32px]`}>Board speak</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[48px]">
            {GLOSSARY.map(([term, def]) => (
              <div key={term} className="border-t py-[12px]" style={{ borderColor: `${t.ink}40` }}>
                <dt className={`${nichrome} italic text-[18px] md:text-[19px]`}>{term}</dt>
                <dd className="mt-[2px] opacity-90">{def}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <Footer colophon theme={t} />
    </main>
  )
}
