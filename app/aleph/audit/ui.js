// Hook-free pieces shared by the server-rendered page and the client present mode.
import { Fragment } from 'react'

const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|F-\d{3})/g
const EMOJI = /([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\u{FE0F}?)/u

// Tiny inline renderer: **bold**, ==highlight==, `code`, [links](url) and F-number refs.
export function Rich({ text, refs = 'link' }) {
  if (!text) return null
  // "(F-026)" or "(F-029, F-001)": the chips already read as a bracket, so drop the parentheses.
  return String(text)
    .replace(/\((F-\d{3}(?:, F-\d{3})*)\)/g, '$1')
    .split(TOKEN)
    .map((part, i) => {
      if (!part) return null
      if (i % 2 === 0) {
        // Emoji fall back to a system font with no side bearing; give them room.
        return (
          <Fragment key={i}>
            {part.split(EMOJI).map((t, j) => (j % 2 ? <span key={j} className="emj">{t}</span> : t))}
          </Fragment>
        )
      }
      if (part.startsWith('**')) return <strong key={i}><Rich text={part.slice(2, -2)} refs={refs} /></strong>
      if (part.startsWith('==')) return <mark key={i}>{part.slice(2, -2)}</mark>
      if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
      if (part.startsWith('[')) {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        return <a key={i} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a>
      }
      return refs === 'link'
        ? <a key={i} className="fref" href={`#${part.toLowerCase()}`}>{part}</a>
        : <span key={i} className="fref">{part}</span>
    })
}

/* ------------------------------------------------------------------ */
/* The rubric: one definition, used by the table, tooltips and slides   */
/* ------------------------------------------------------------------ */

export const CONFIDENCE = [
  { key: 'hard', label: 'Hard data', text: 'Measured and reproducible. Run it again and you get the same answer.' },
  { key: 'directional', label: 'Directional', text: 'An estimate or a single sample. Right shape, soft numbers.' },
  { key: 'hunch', label: 'Hunch', text: 'My read. Needs evidence before we act on it.' },
]
export const PRIORITY = [
  { key: 'P1', label: 'P1', text: 'Ships with the rebrand, or before it.' },
  { key: 'P2', label: 'P2', text: 'In the first six months after launch.' },
  { key: 'P3', label: 'P3', text: 'Later. A big lift, often skills we don’t have in house yet.' },
]
export const RA = [
  { key: 'Yes', label: 'Yes', text: 'Red Antler delivers it.' },
  { key: 'Partial', label: 'Partly', text: 'Red Antler delivers part of it, usually the concept, and we ship the rest.' },
  { key: 'No', label: 'No', text: 'Outside Red Antler’s scope. It’s ours.' },
]
const byKey = (list) => Object.fromEntries(list.map((x) => [x.key, x]))
const CONF = byKey(CONFIDENCE)
const PRI = byKey(PRIORITY)
const RAK = byKey(RA)

// Auditor-style tick marks: solid = hard data, open = directional, dashed = hunch.
const CHECK = 'M4.6 8.3l2.3 2.3 4.5-5'
export function Tick({ level }) {
  return (
    <svg className={`tick tick-${level}`} viewBox="0 0 16 16" aria-hidden="true">
      {level === 'hard' && (
        <>
          <rect x="1" y="1" width="14" height="14" rx="2" fill="currentColor" />
          <path d={CHECK} fill="none" stroke="var(--tick-on)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {level === 'directional' && (
        <>
          <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d={CHECK} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {level === 'hunch' && (
        <>
          <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.4 2.1" />
          <path d="M6.2 6.3a1.85 1.85 0 1 1 2.5 1.75c-.5.2-.7.5-.7 1v.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11.6" r=".95" fill="currentColor" />
        </>
      )}
    </svg>
  )
}

const tip = (label, text) => `${label}: ${text}`

// Confidence marks with a tooltip on each, so nobody has to remember the legend.
export function Levels({ levels = [], short, tips = true }) {
  return (
    <span className="levels">
      {levels.map((l) => (
        <span
          key={l}
          className="level"
          data-tip={tips ? tip(CONF[l].label, CONF[l].text) : undefined}
          tabIndex={tips ? 0 : undefined}
          aria-label={short ? CONF[l].label : undefined}
        >
          <Tick level={l} />
          {!short && CONF[l].label}
        </span>
      ))}
    </span>
  )
}

export function PriorityChip({ value }) {
  if (!value) return <span className="muted">n/a</span>
  const p = PRI[value]
  return <span className={`pri pri-${value}`} data-tip={p ? tip(p.label, p.text) : undefined} tabIndex={0}>{value}</span>
}

export function RaChip({ value }) {
  const r = RAK[value]
  if (!r) return <span className="muted">n/a</span>
  return <span className={`sow sow-${value.toLowerCase()}`} data-tip={r.text} tabIndex={0}>{r.label}</span>
}

// The "How to read this" table. refs="text" renders the sample F-number without a link (slides).
export function RubricTable({ refs = 'link' }) {
  return (
    <table className="rubric">
      <tbody>
        <tr className="rubric-g"><th colSpan={2} scope="colgroup">How solid the evidence is</th></tr>
        {CONFIDENCE.map((c) => (
          <tr key={c.key}>
            <th scope="row"><span className="rubric-k"><Tick level={c.key} />{c.label}</span></th>
            <td>{c.text}</td>
          </tr>
        ))}
        <tr>
          <th scope="row"><span className="rubric-k">{refs === 'link' ? <a className="fref" href="#f-014">F-014</a> : <span className="fref">F-014</span>}</span></th>
          <td>A finding. Hover for a preview, click to jump to the evidence.</td>
        </tr>
        <tr className="rubric-g"><th colSpan={2} scope="colgroup">Priority</th></tr>
        {PRIORITY.map((p) => (
          <tr key={p.key}>
            <th scope="row"><span className="rubric-k"><span className={`pri pri-${p.key}`}>{p.label}</span></span></th>
            <td>{p.text}</td>
          </tr>
        ))}
        <tr className="rubric-g"><th colSpan={2} scope="colgroup">RA? Is it in Red Antler’s scope</th></tr>
        {RA.map((r) => (
          <tr key={r.key}>
            <th scope="row"><span className="rubric-k"><span className={`sow sow-${r.key.toLowerCase()}`}>{r.label}</span></span></th>
            <td>{r.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ------------------------------------------------------------------ */
/* Images and visuals                                                  */
/* ------------------------------------------------------------------ */

// zoom: wraps the image in a button the lightbox listens for (off in present mode).
export function Img({ img, eager, caption = true, zoom = true, className = '' }) {
  if (!img) return null
  const pic = <img src={img.src} width={img.w} height={img.h} alt={img.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  return (
    <figure className={`shot ${className}`}>
      {zoom && img.full
        ? <button type="button" className="zoom" data-full={img.full} data-caption={img.caption || img.alt} aria-label={`Enlarge: ${img.alt}`}>{pic}</button>
        : pic}
      {caption && img.caption && <figcaption>{img.caption}</figcaption>}
    </figure>
  )
}

function Stat({ s, big }) {
  return (
    <div className={`num ${big ? 'stat-big' : ''}`}>
      <span className="stat-v">{s.value}</span>
      <span className="stat-l">{s.label}</span>
    </div>
  )
}

export function Visual({ v, images, eager, zoom = true }) {
  if (!v) return null
  if (v.type === 'quotes') {
    return (
      <div className="v-quotes">
        {v.stat && <Stat s={v.stat} />}
        {v.quotes.map((q, i) => (
          <blockquote key={i}>
            <p>“{q.text}”</p>
            <footer>{q.by}</footer>
          </blockquote>
        ))}
      </div>
    )
  }
  if (v.type === 'stat') {
    return (
      <div className="v-stat">
        <Stat s={v.stat} big />
        <dl>
          {v.support.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }
  if (v.type === 'image') return <Img img={images[v.image]} eager={eager} zoom={zoom} />
  if (v.type === 'strip') {
    return (
      <ol className="v-strip">
        {v.images.map((k, i) => (
          <li key={k}>
            <Img img={images[k]} caption={false} eager={eager} zoom={zoom} />
            <span className="strip-l"><b>{i + 1}</b>{images[k]?.caption}</span>
          </li>
        ))}
      </ol>
    )
  }
  return null
}

export function visualImages(v) {
  if (!v) return []
  if (v.type === 'image') return [v.image]
  if (v.type === 'strip') return v.images
  return []
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function shortDate(iso) {
  const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(iso || '')
  return m ? `${MONTHS[+m[1] - 1]} ${+m[2]}` : iso
}
