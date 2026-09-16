// Server components for the three layers: overview, surface map, evidence.
import { Rich, Levels, Img, Visual, RubricTable, PriorityChip, RaChip, shortDate } from './ui'
import { SurfaceFilter, PresentButton } from './client'

/* ------------------------------------------------------------------ */
/* 1. Overview                                                         */
/* ------------------------------------------------------------------ */

export function Overview({ data }) {
  const { meta, overview: o, findings, images } = data
  const levelsById = Object.fromEntries(findings.map((f) => [f.id, f.levels]))

  return (
    <section id="overview" className="sec">
      <div className="wrap doc opening">
        <aside className="rail hero-rail">
          <dl className="facts">
            <div><dt>By</dt><dd>{meta.author}</dd></div>
            <div><dt>Date</dt><dd>{meta.date}</dd></div>
            <div><dt>Updated</dt><dd>{shortDate(meta.exported)}</dd></div>
            <div><dt>Findings</dt><dd>{meta.counts.findings}</dd></div>
            <div><dt>Surfaces</dt><dd>{meta.counts.surfaces}</dd></div>
          </dl>
          <div className="hero-actions">
            <PresentButton big />
            {meta.loom && <a className="btn-quiet" href={meta.loom} target="_blank" rel="noreferrer">Watch the Loom ↗</a>}
          </div>
        </aside>
        <div className="main">
          <h1 className="h1">Aleph brand audit</h1>
          <p className="intro"><Rich text={o.intro} /></p>
          <div className="tldr">
            <span className="lbl">TL;DR</span>
            <p><Rich text={o.tldr} /></p>
          </div>
        </div>
      </div>

      <div className="wrap doc">
        <div className="span two before">
          <div>
            <h2 className="h3">Why an audit, and why now</h2>
            <p><Rich text={o.why} /></p>
          </div>
          <div className="howto" id="how-to-read">
            <h2 className="h3">How to read this</h2>
            <p><Rich text={o.bias} /></p>
            <RubricTable />
          </div>
        </div>
      </div>

      <div className="wrap doc sub-head">
        <div className="rail" />
        <div className="main"><h2 className="h2">What stands out</h2></div>
      </div>
      <ol className="standouts">
        {o.standouts.map((s) => (
          <li key={s.key} id={`t-${s.n}`} className="wrap doc standout">
            <div className="rail st-rail">
              <span className="st-n" aria-hidden="true">{s.n}</span>
              <span className="st-refs">
                {s.refs.map((r) => (
                  <span key={r} className="ref-line">
                    <Rich text={r} />
                    <Levels levels={levelsById[r]} short />
                  </span>
                ))}
              </span>
            </div>
            <div className="main">
              <h3 className="claim">{s.claim}</h3>
              <p className="body"><Rich text={s.body} /></p>
              <div className="visual"><Visual v={s.visual} images={images} /></div>
              {s.move && (
                <p className="move">
                  <span className="lbl">The move</span>
                  <Rich text={s.move} />
                </p>
              )}
              {(s.fuller || s.related) && (
                <details className="more">
                  <summary><span className="ico" aria-hidden="true">+</span>Read the full note</summary>
                  <div className="more-in">
                    {s.fuller && <p><Rich text={s.fuller} /></p>}
                    {s.related && (
                      <div className="related">
                        <p className="lbl">Related {s.related.refs.map((r) => <Rich key={r} text={r} />)}</p>
                        <h4 className="h3">{s.related.claim}</h4>
                        <p><Rich text={s.related.text} /></p>
                        <div className="pair">
                          {s.related.images.map((k) => <Img key={k} img={images[k]} />)}
                        </div>
                        <CompareTable compare={data.compare} />
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="wrap">
        <div className="working">
          <p className="lbl">What’s working</p>
          <p className="working-t">
            <Rich text={o.working.text} />{' '}
            {o.working.refs.map((r) => <Rich key={r} text={r} />)}
          </p>
        </div>
      </div>

      <div className="wrap doc blk">
        <div className="rail" />
        <div className="main">
          <h2 className="h2">What it means for the rebrand</h2>
          <ul className="bullets">
            {o.rebrand.map((b, i) => <li key={i}><Rich text={b} /></li>)}
          </ul>
          <details className="more">
            <summary><span className="ico" aria-hidden="true">+</span>The longer version</summary>
            <div className="more-in">
              {data.rebrandFull.map((p, i) => <p key={i}><Rich text={p} /></p>)}
            </div>
          </details>
        </div>
      </div>

      <div className="wrap blk">
        <h2 className="h2">By area</h2>
        <div className="areas" role="table" aria-label="By area">
          <div className="areas-h" role="row">
            <span role="columnheader">Area</span>
            <span role="columnheader">Not working</span>
            <span role="columnheader">Working</span>
            <span role="columnheader">The one thing</span>
          </div>
          {data.byArea.map((a) => (
            <div className="areas-r" role="row" key={a.bucket}>
              <h3 role="rowheader">{a.bucket}</h3>
              <p role="cell" data-l="Not working"><Rich text={a.notWorking} /></p>
              <p role="cell" data-l="Working"><Rich text={a.working} /></p>
              <p role="cell" data-l="The one thing" className="one"><Rich text={a.oneThing} /></p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap doc blk">
        <div className="rail" />
        <div className="main">
          <h2 className="h3">Still to do</h2>
          <p className="still"><Rich text={o.stillToDo} /></p>
        </div>
      </div>

      <div className="wrap doc question">
        <div className="rail"><span className="lbl">One question</span></div>
        <div className="main">
          <p className="q"><Rich text={o.question} /></p>
          <p className="ask"><Rich text={o.ask} /> {o.askClose}</p>
        </div>
      </div>
    </section>
  )
}

export function CompareTable({ compare }) {
  const Row = ({ c }) => (
    <tr data-us={c.site === 'Aleph' ? '' : undefined}>
      <th scope="row">{c.site}</th>
      <td>{c.h1}</td>
      <td className="c-ai">{c.aiInTitle ? 'Yes' : ''}</td>
    </tr>
  )
  return (
    <div className="cmp">
      <table>
        <thead>
          <tr><th>Site</th><th>Homepage headline, Sep 12</th><th>AI in page title</th></tr>
        </thead>
        <tbody>
          <tr className="cmp-g"><th colSpan={3}>Finance competitors</th></tr>
          {compare.finance.map((c) => <Row key={c.site} c={c} />)}
          <tr className="cmp-g"><th colSpan={3}>Reference brands</th></tr>
          {compare.reference.map((c) => <Row key={c.site} c={c} />)}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Surface map                                                      */
/* ------------------------------------------------------------------ */

// Group rows by bucket and sub, and precompute banding and counts per filter
// so the All / Ours / Red Antler toggle is pure CSS.
function groupRows(rows) {
  const map = new Map()
  for (const s of rows) {
    const k = `${s.group}|${s.sub}`
    if (!map.has(k)) map.set(k, { group: s.group, sub: s.sub, rows: [] })
    map.get(k).rows.push(s)
  }
  return [...map.values()].map((g) => {
    let all = 0, ours = 0, ra = 0
    const out = g.rows.map((s) => {
      const isOurs = s.sow !== 'Yes'
      return { ...s, b: { all: all++ % 2, ours: isOurs ? ours++ % 2 : null, ra: isOurs ? null : ra++ % 2 } }
    })
    return { ...g, rows: out, n: { all, ours, ra } }
  })
}

function FigmaCell({ s }) {
  if (!s.inFigma || s.inFigma === 'No') return <span className="muted">Not yet</span>
  const label = s.inFigma === 'Card only' ? 'Card' : s.inFigma === 'Partial' ? 'Partly' : 'Open'
  return s.figmaUrl
    ? <a className="fig-a" href={s.figmaUrl} target="_blank" rel="noreferrer">{label}<span aria-hidden="true"> ↗</span></a>
    : <span>{label}</span>
}

export function Surfaces({ data }) {
  const S = data.surfaces
  const r = S.rollup
  const groups = groupRows(S.rows)
  const counts = { all: r.total, ours: r.ours, ra: r.sow.Yes }

  return (
    <section id="surfaces" className="sec layer">
      <div className="wrap doc">
        <div className="rail"><span className="lbl">Surfaces · {r.total}</span></div>
        <div className="main">
          <h2 className="h2">Surface map</h2>
          <p className="lede">
            Daniel’s ask was to map {S.ask} <span className="muted">({S.askBy})</span> Here are all {r.total} surfaces
            from the audit sheet, with what each one is, our read on it, and who delivers it.
          </p>
          <details className="more ledger-more">
            <summary><span className="ico" aria-hidden="true">+</span>What’s been asked for, in order</summary>
            <ol className="ledger">
              {S.ledger.map((l) => (
                <li key={l.date + l.who}>
                  <span className="ld-k">{l.date}<small>{l.who}</small></span>
                  <p><Rich text={l.text} /></p>
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>

      <div className="wrap">
        <dl className="rollup">
          <div><dt>{r.total}</dt><dd>surfaces</dd></div>
          <div><dt>{r.sow.Yes}</dt><dd>Red Antler</dd></div>
          <div className="hot"><dt>{r.ours}</dt><dd>ours</dd></div>
          <div><dt>{r.oursP1.length}</dt><dd>ours at <PriorityChip value="P1" /></dd></div>
        </dl>

        <div className="surf-tools">
          <SurfaceFilter counts={counts} />
          <a className="lbl surf-key" href="#how-to-read">What P1 and RA? mean</a>
        </div>

        <div className="surf" id="surface-table" data-filter="all">
          <table>
            <thead>
              <tr>
                <th className="c-name">Surface</th>
                <th className="c-what">What it is</th>
                <th className="c-read">Our read</th>
                <th className="c-pri">Priority</th>
                <th className="c-sow">RA?</th>
                <th className="c-src">Where the ask came from</th>
                <th className="c-fig">Figma</th>
                <th className="c-f">Findings</th>
              </tr>
            </thead>
            {groups.map((g) => (
              <tbody
                key={g.group + g.sub}
                data-empty-ours={g.n.ours === 0 ? '' : undefined}
                data-empty-ra={g.n.ra === 0 ? '' : undefined}
              >
                <tr className="grp">
                  <th colSpan={8} scope="colgroup">
                    {g.group} <span className="grp-sub">{g.sub}</span>
                    <span className="grp-n" data-for="all">{g.n.all}</span>
                    <span className="grp-n" data-for="ours">{g.n.ours}</span>
                    <span className="grp-n" data-for="ra">{g.n.ra}</span>
                  </th>
                </tr>
                {g.rows.map((s) => (
                  <tr
                    key={s.name}
                    data-sow={s.sow}
                    data-ours={s.sow !== 'Yes' ? '' : undefined}
                    data-ba={s.b.all}
                    data-bo={s.b.ours ?? undefined}
                    data-br={s.b.ra ?? undefined}
                  >
                    <th scope="row" className="c-name">{s.name}</th>
                    <td className="c-what" data-l="What it is"><Rich text={s.what} /></td>
                    <td className="c-read" data-l="Our read">
                      {s.issue && <p><Rich text={s.issue} /></p>}
                      {s.opportunity && <p className="opp"><span className="lbl">Opportunity</span><Rich text={s.opportunity} /></p>}
                    </td>
                    <td className="c-pri" data-l="Priority"><PriorityChip value={s.priority} /></td>
                    <td className="c-sow" data-l="RA?"><RaChip value={s.sow} /></td>
                    <td className="c-src" data-l="Where the ask came from">
                      {s.sources.map((c) => <span key={c.label} className="chip">{c.label}</span>)}
                    </td>
                    <td className="c-fig" data-l="Figma"><FigmaCell s={s} /></td>
                    <td className="c-f" data-l="Findings">
                      {s.findings.length ? s.findings.map((f) => <Rich key={f} text={f} />) : <span className="muted">None</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Evidence                                                         */
/* ------------------------------------------------------------------ */

function Finding({ f, images }) {
  const many = f.images.length > 3
  return (
    <article id={f.slug} className="wrap doc find">
      <div className="rail find-rail">
        <a className="fid" href={`#${f.slug}`}>{f.id}</a>
        <Levels levels={f.levels} />
        <span className="lbl">{f.bucket} · {shortDate(f.date)}</span>
      </div>
      <div className="main">
        <h3 className="find-claim">{f.claim}</h3>
        {f.surface && <p className="lbl find-surf">{f.surface}</p>}
        <p className="find-ev"><Rich text={f.evidence} /></p>
        {f.images.length > 0 && (
          <div className={`find-shots ${many ? 'many' : ''}`}>
            {f.images.map((k) => <Img key={k} img={images[k]} caption={!many} />)}
          </div>
        )}
        {(f.figma || f.links.length > 0) && (
          <p className="find-foot">
            {f.figma && (
              <a className="lnk" href={f.figma.url} target="_blank" rel="noreferrer">Figma: {f.figma.label}<span aria-hidden="true"> ↗</span></a>
            )}
            {f.links.map((l) => (
              <a key={l.url} className="lnk" href={l.url} target="_blank" rel="noreferrer">{l.label}<span aria-hidden="true"> ↗</span></a>
            ))}
          </p>
        )}
      </div>
    </article>
  )
}

export function Evidence({ data }) {
  const { findings, images } = data
  return (
    <section id="evidence" className="sec layer">
      <div className="wrap doc">
        <div className="rail"><span className="lbl">Evidence · {findings.length}</span></div>
        <div className="main">
          <h2 className="h2">Evidence</h2>
          <p className="lede">
            Every claim above traces to one of these. The mark under each number says how solid it is (hover it), and the links
            go to the capture in Figma and the public source.
          </p>
        </div>
      </div>
      <div className="findings">
        {findings.map((f) => <Finding key={f.id} f={f} images={images} />)}
      </div>
    </section>
  )
}

export function Footer({ data }) {
  return (
    <footer className="wrap foot">
      <a href={data.meta.figmaFile} target="_blank" rel="noreferrer">Figma source file<span aria-hidden="true"> ↗</span></a>
      <a href={data.meta.sheet} target="_blank" rel="noreferrer">Audit spreadsheet (xlsx)<span aria-hidden="true"> ↗</span></a>
    </footer>
  )
}
