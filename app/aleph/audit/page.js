// Server component. Shows the surface ownership map (Group / Sub-area /
// Surface / What it is / Finding / In RA SOW? / Invest? / Assigned to). The
// Invest column and its filter row carry Daniel's Sep 17 read on where the
// team invests over the next 6 months (see PRIORITY in surfaces.js). The hero above
// the table matches the Figma "Aleph Audit - Preso" deck (Neue Montreal,
// indigo). The table itself is a straight match of aleph-field-guide.html's
// own surfaces table: same layout, typeface (Geist / Geist Mono / Schibsted
// Grotesk), colors, All/Ours/RA toggle, sticky header and group rows. No
// F-numbers or other evidence, that stays in the audit files. Base data
// (everything but "finding") matches the shared Google Sheet
// (`26_0910 Audit/delivery/surface-ownership-map.csv`); keep the two in sync
// by hand if the map changes.
//
// Class names here are prefixed (amwrap/amseg/amsurf/amchip/amfoot) even
// though this whole page is under .amap, because it renders inside the /aleph
// layout's `.aa` wrapper (layout.js) — aleph.css's `.aa .wrap`, `.aa .seg`,
// `.aa .surf`, `.aa .chip` and `.aa .foot` rules (built for the old
// evidence-heavy audit page) would otherwise apply here too and silently
// break the layout (this happened twice: once with `.pm`, once with `.surf`).
import localFont from 'next/font/local'
import './preso.css'
import { SURFACES, surfaceCounts, priorityCounts, PRIORITY } from './surfaces'
import { IA_RATIONALE, IA_PROBLEMS, IA_SOLUTIONS, IA_CLOSING } from './ia'
import {
  FLOW_INTRO, FLOW_REALITY, FLOW_FLAGS, FLOW_BASELINE, FLOW_BASELINE_NOTE,
  FLOW_PROPOSAL_LEDE, FLOW_PROPOSAL, FLOW_CLOSING,
} from './flow'
// Three tabs (Surfaces / IA / Conversion flow), brought back Sep 18 per Jon.
// Tab switching is vanilla JS in TABS_SCRIPT (hash-aware: #surfaces, #ia,
// #flow), same no-hydration approach as the table filters.

// Neue Montreal, the deck's actual typeface (Figma "Aleph Audit - Preso"), for the hero only.
const sans = localFont({
  variable: '--f-sans',
  src: [
    { path: './fonts/NeueMontreal-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/NeueMontreal-Bold.otf', weight: '700', style: 'normal' },
  ],
})

export const metadata = {
  title: 'Aleph surfaces',
  description: 'Aleph brand audit: which surfaces Red Antler owns, which are shared, and which are ours regardless.',
}

const GROUP_ORDER = ['Communication', 'Marketing', 'Product']

// Matches the field guide's SOW chip: green Yes = Red Antler, blue Partial = Shared, orange No = ours alone.
const SOW = {
  'Red Antler': { value: 'Yes', label: 'Yes', chip: 'amchip done' },
  Shared: { value: 'Partial', label: 'Partial', chip: 'amchip blue' },
  Aleph: { value: 'No', label: 'No', chip: 'amchip private' },
}

// Iconoir "info-circle-solid" (https://iconoir.com), fetched from
// github.com/iconoir-icons/iconoir/icons/solid/info-circle.svg, fill hardcoded
// to #D6D6D6 in place of currentColor.
function InfoCircleSolid() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" fill="#D6D6D6" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 10.75C12.4142 10.75 12.75 11.0858 12.75 11.5V16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5V11.5C11.25 11.0858 11.5858 10.75 12 10.75ZM12.5675 8.00075C12.8446 7.69287 12.8196 7.21865 12.5117 6.94156C12.2038 6.66446 11.7296 6.68942 11.4525 6.99731L11.4425 7.00842C11.1654 7.3163 11.1904 7.79052 11.4983 8.06761C11.8062 8.34471 12.2804 8.31975 12.5575 8.01186L12.5675 8.00075Z" />
    </svg>
  )
}

// Renders finding text with inline evidence markers: `{{tooltip text}}` in the
// source string becomes a small info icon right after that point, hover/focus
// shows the tooltip. Markers are added by hand in surfaces.js where a claim
// has a specific, sourceable answer (e.g. "which two pages?").
const FINDING_MARKER = /\{\{([^}]*)\}\}/g
function Finding({ text }) {
  if (!text) return <span className="note">—</span>
  const parts = text.split(FINDING_MARKER)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <button key={i} type="button" className="itip" data-tip={part}><InfoCircleSolid /><span className="sr-only">Source</span></button>
      : <span key={i}>{part}</span>
  )
}

function groupBy(rows, key) {
  const map = new Map()
  for (const r of rows) {
    if (!map.has(r[key])) map.set(r[key], [])
    map.get(r[key]).push(r)
  }
  return map
}

// Vanilla JS (not React state) so the toggle and sticky sizing work without hydration,
// same approach as aleph-field-guide.html itself.
const TABLE_SCRIPT = `(function(){
  var t = document.querySelector('.amap .amsurf table'), th = t && t.querySelector('thead'), root = document.documentElement;
  function sizes(){ if (th) root.style.setProperty('--amap-theadh', th.offsetHeight + 'px'); }
  sizes(); addEventListener('resize', sizes);
  var own = document.querySelectorAll('.amap .amseg[data-seg="own"] button');
  var pri = document.querySelectorAll('.amap .amseg[data-seg="pri"] button');
  var state = { own: 'all', pri: 'all' };
  function apply(){
    own.forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.f === state.own); });
    pri.forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.p === state.pri); });
    t.querySelectorAll('tbody.g').forEach(function(tb){
      var vis = 0;
      tb.querySelectorAll('tr[data-sow]').forEach(function(r){
        var sow = r.dataset.sow, f = state.own;
        var okOwn = f === 'all' || (f === 'ra' ? sow === 'Yes' : sow !== 'Yes');
        var okPri = state.pri === 'all' || r.dataset.pri === state.pri;
        var show = okOwn && okPri;
        r.hidden = !show; if (show) vis++;
      });
      tb.hidden = vis === 0; var n = tb.querySelector('.n'); if (n) n.textContent = vis;
    });
    try { localStorage.setItem('amap-surface-filter', state.own); localStorage.setItem('amap-priority-filter', state.pri); } catch (e) {}
  }
  own.forEach(function(b){ b.addEventListener('click', function(){ state.own = b.dataset.f; apply(); }); });
  pri.forEach(function(b){ b.addEventListener('click', function(){ state.pri = state.pri === b.dataset.p ? 'all' : b.dataset.p; apply(); }); });
  try { state.own = localStorage.getItem('amap-surface-filter') || 'all'; state.pri = localStorage.getItem('amap-priority-filter') || 'all'; } catch (e) {}
  apply();
})();`

const TABS_SCRIPT = `(function(){
  var tabs = document.querySelectorAll('.amap .amtabs button'), ids = [];
  tabs.forEach(function(b){ ids.push(b.dataset.tab); });
  function show(id){
    if (ids.indexOf(id) < 0) id = 'surfaces';
    tabs.forEach(function(b){ b.setAttribute('aria-selected', b.dataset.tab === id); });
    document.querySelectorAll('.amap .amtabpanel').forEach(function(p){ p.hidden = p.id !== 'tab-' + id; });
    dispatchEvent(new Event('resize'));
  }
  tabs.forEach(function(b){ b.addEventListener('click', function(){ history.replaceState(null, '', '#' + b.dataset.tab); show(b.dataset.tab); }); });
  addEventListener('hashchange', function(){ show(location.hash.slice(1)); });
  show(location.hash.slice(1));
})();`

const VERDICT = {
  yes: { label: 'Confirmed', chip: 'amchip warm' },
  part: { label: 'Partly', chip: 'amchip blue' },
  no: { label: "Didn't hold up", chip: 'amchip' },
}

export default function AuditPage() {
  const counts = surfaceCounts(SURFACES)
  const pcounts = priorityCounts(SURFACES)
  const ours = counts.Shared + counts.Aleph
  const byGroup = groupBy(SURFACES, 'group')
  let rn = 0

  return (
    <div className={`amap ${sans.variable}`}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Schibsted+Grotesk:wght@700;800&display=swap" />
      <div className="amwrap">
        <h1>Aleph surfaces</h1>
        <div className="amtabs" role="tablist" aria-label="Views">
          <button type="button" role="tab" data-tab="surfaces" aria-selected="true" suppressHydrationWarning>Surfaces</button>
          <button type="button" role="tab" data-tab="ia" aria-selected="false" suppressHydrationWarning>IA</button>
          <button type="button" role="tab" data-tab="flow" aria-selected="false" suppressHydrationWarning>Conversion flow</button>
        </div>

        <div className="amtabpanel" id="tab-surfaces" role="tabpanel" suppressHydrationWarning>
          <div className="amia amintro">
            <h2>Where to focus next</h2>
            <p className="ia-p lead">
              The brand shows up in {counts.total} places, and Red Antler owns {counts['Red Antler']} of them outright. The other {ours} are ours or shared, which raises a question I keep coming back to: which handful actually move the number in Q4 and Q1, and which can wait? Daniel's read marks a few as burning (paid ads, marketplace listings and the MCP previews).
            </p>
            <p className="ia-p lead">
              I wonder if the forms and the moment after someone submits belong on that list too, since they're cheap to change, sit outside Red Antler's scope, and now have a baseline to measure against. And just as useful: where should we not spend?
            </p>
          </div>

        <div className="amseg" data-seg="own" role="group" aria-label="Filter surfaces by owner">
          <button type="button" data-f="all" aria-pressed="true" suppressHydrationWarning>All <b>{counts.total}</b></button>
          <button type="button" data-f="ours" aria-pressed="false" suppressHydrationWarning>Ours <b>{ours}</b></button>
          <button type="button" data-f="ra" aria-pressed="false" suppressHydrationWarning>RA <b>{counts['Red Antler']}</b></button>
        </div>

        <div className="amseg" data-seg="pri" role="group" aria-label="Filter surfaces by where we invest">
          <button type="button" data-p="urgent" aria-pressed="false" suppressHydrationWarning>Priority 1 <b>{pcounts.urgent}</b></button>
          <button type="button" data-p="invest" aria-pressed="false" suppressHydrationWarning>Priority 2 <b>{pcounts.invest}</b></button>
          <button type="button" data-p="discuss" aria-pressed="false" suppressHydrationWarning>Discuss <b>{pcounts.discuss}</b></button>
          <button type="button" data-p="hold" aria-pressed="false" suppressHydrationWarning>Hold <b>{pcounts.hold}</b></button>
          <button type="button" data-p="oob" aria-pressed="false" suppressHydrationWarning>Not brand <b>{pcounts.oob}</b></button>
          <span className="note">Daniel's read on the next 6 months (Sep 17).</span>
        </div>

        <div className="sheet-scroll amsurf">
          <table className="sheet">
            <thead>
              <tr>
                <th className="rn"></th>
                <th>Surface</th>
                <th>What it is</th>
                <th>Finding</th>
                <th>In RA SOW?</th>
                <th>Invest?</th>
                <th>Assigned to</th>
              </tr>
            </thead>
            {GROUP_ORDER.map((group) => {
              const rows = byGroup.get(group) || []
              const bySub = groupBy(rows, 'sub')
              return [...bySub.entries()].map(([sub, subRows]) => (
                <tbody className="g" key={group + sub} suppressHydrationWarning>
                  <tr className="grp-row">
                    <td colSpan={7}>{group} <span>· {sub} · <span className="n" suppressHydrationWarning>{subRows.length}</span></span></td>
                  </tr>
                  {subRows.map((r) => {
                    rn += 1
                    const sow = SOW[r.owner]
                    const assigned = r.assigned || (r.owner === 'Red Antler' ? 'Red Antler' : null)
                    const pri = r.priority ? PRIORITY[r.priority] : null
                    return (
                      <tr key={r.surface} data-sow={sow.value} data-pri={r.priority || 'none'} suppressHydrationWarning>
                        <td className="rn">{rn}</td>
                        <td className="term">{r.surface}</td>
                        <td className="what">{r.what}</td>
                        <td className="finding"><Finding text={r.finding} /></td>
                        <td><span className={sow.chip}>{sow.label}</span></td>
                        <td>{pri ? <span className={pri.chip} title={pri.note}>{pri.label}</span> : <span className="note">—</span>}</td>
                        <td className="own">{assigned || <span className="note">none yet</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              ))
            })}
          </table>
        </div>

        <p className="amfn">
          <b>A number to measure the rebrand against.</b> In the last 30 days (Aug 20 to Sep 18, from HubSpot) the demo form converted 15.5% of the people who saw it, trial 16.9% and contact 15.2%, and 79% of people who see the demo form never start it. The forms, the moment after submit and what follows are cheap to change and sit outside Red Antler's scope. More in the Conversion flow tab.
        </p>
        </div>

        <div className="amtabpanel amia" id="tab-ia" role="tabpanel" hidden suppressHydrationWarning>
          <h2>Site structure</h2>
          {IA_RATIONALE.map((p, i) => <p key={i} className="ia-p lead"><Finding text={p} /></p>)}

          <h3>What I'm noticing</h3>
          <div className="sheet-scroll">
            <table className="sheet">
              <thead><tr><th>Problem</th><th>What it might be costing us</th></tr></thead>
              <tbody>
                {IA_PROBLEMS.map((r) => (
                  <tr key={r.problem}><td className="term">{r.problem}</td><td><Finding text={r.cost} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>One way it could work <span className="note">labels are placeholders</span></h3>
          <div className="sheet-scroll">
            <table className="sheet">
              <thead><tr><th>Solution</th><th>What it might look like</th><th>Pages that could move in</th></tr></thead>
              <tbody>
                {IA_SOLUTIONS.map((r) => (
                  <tr key={r.section}><td className="term">{r.section}</td><td><Finding text={r.holds} /></td><td className="muted">{r.pages}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {IA_CLOSING.map((p, i) => <p key={i} className="ia-p">{p}</p>)}
        </div>

        <div className="amtabpanel amia" id="tab-flow" role="tabpanel" hidden suppressHydrationWarning>
          <h2>From click to first call</h2>
          {FLOW_INTRO.map((p, i) => <p key={i} className="ia-p lead"><Finding text={p} /></p>)}

          <h3>What a buyer sees</h3>
          <div className="sheet-scroll">
            <table className="sheet">
              <thead><tr><th>Step</th><th>What they see</th><th>What we promise</th></tr></thead>
              <tbody>
                {FLOW_REALITY.map((r) => (
                  <tr key={r.step}><td className="term">{r.step}</td><td><Finding text={r.sees} /></td><td className="muted"><Finding text={r.promise} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>What I expected, and what held up</h3>
          <div className="sheet-scroll">
            <table className="sheet">
              <thead><tr><th>What I expected</th><th>Verdict</th><th>Evidence</th></tr></thead>
              <tbody>
                {FLOW_FLAGS.map((r) => (
                  <tr key={r.expected}><td className="term">{r.expected}</td><td><span className={VERDICT[r.verdict].chip}>{VERDICT[r.verdict].label}</span></td><td><Finding text={r.evidence} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>The baseline</h3>
          <div className="sheet-scroll">
            <table className="sheet nums">
              <thead><tr><th>Form</th><th>Views</th><th>Submissions</th><th>Conversion</th></tr></thead>
              <tbody>
                {FLOW_BASELINE.map((r) => (
                  <tr key={r.form}><td className="term">{r.form}</td><td>{r.views}</td><td>{r.subs}</td><td>{r.rate}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ia-p"><Finding text={FLOW_BASELINE_NOTE} /></p>

          <h3>A possible path</h3>
          <p className="ia-p lead">{FLOW_PROPOSAL_LEDE}</p>
          <div className="sheet-scroll">
            <table className="sheet">
              <thead><tr><th>Idea</th><th>What it could mean</th><th>Who might own it</th><th>When</th></tr></thead>
              <tbody>
                {FLOW_PROPOSAL.map((r) => (
                  <tr key={r.move}><td className="term">{r.move}</td><td>{r.means}</td><td className="muted">{r.who}</td><td className="muted">{r.when}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ia-p lead">{FLOW_CLOSING}</p>
        </div>

        <div className="amfoot">
          <span>Sources: the audit spreadsheet, Slack, Zoom and meeting notes, competitor and search research, and public reviews (G2, Reddit).</span>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: TABLE_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: TABS_SCRIPT }} />
    </div>
  )
}
