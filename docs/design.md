# design.md

**The document register.** Paper and ink, hairline rules, one highlighter, mono for
anything that labels rather than speaks.

This is one of two systems, not the house style for everything. It covers audits, decks,
specs and data-dense reads: `/aleph/audit` and work like it. The portfolio site runs on
its own register (green and mustard, Mondwest and Haas Grot) and the two stay separate.
Section 8 has the split and how to pick.

Source of truth for the running version is `app/aleph/aleph.css`. If the two ever
disagree, the CSS wins and this file needs updating.

**Using it:** copy the token block and the table CSS into the new project, load the two
typefaces, and build from the patterns below. Everything is plain CSS, so it works in a
Next app, a single HTML file, or an artifact.

---

## 1. The idea

Four rules do most of the work:

1. **Rules, not boxes.** Structure comes from 1px lines and whitespace. Cards, drop
   shadows and filled containers are the exception, and each one needs a reason.
2. **Two type registers.** A sans speaks, a mono labels. Column headers, refs, figure
   numbers, counts, eyebrows and captions are all mono. Nothing else is.
3. **One accent.** A single highlighter yellow. Priority, status and emphasis are carried
   by weight, rules and that one color. No red/amber/green severity palettes.
4. **Tight display, loose body.** Headlines run at negative tracking and leading under 1,
   body runs at 1.6. The contrast between the two is most of the feel.

---

## 2. Color

Neutral paper and ink. Slightly green-cast greys rather than pure neutrals, which is what
keeps it from reading as a default stylesheet.

```css
:root {
  --paper:  #F2F3EF;  /* page */
  --sheet:  #FAFAF8;  /* raised panels, chips, refs */
  --ink:    #131516;  /* primary text, hard rules, filled buttons */
  --ink-2:  #33373A;  /* body copy, secondary cells */
  --muted:  #5E6468;  /* mono labels, captions */
  --faint:  #8A9094;  /* footers, slide numbers */
  --rule:   #CDD2CA;  /* standard 1px divider */
  --hair:   #E1E4DE;  /* lightest divider, between table rows */
  --band:   #E8EEE4;  /* green-bar row banding */
  --mark:   #F2DC45;  /* the highlighter */
  --mark-ink: #131516;
  --invert-bg:  #131516;
  --invert-ink: #F2F3EF;
}

@media (prefers-color-scheme: dark) {
  :root {
    --paper:  #0F1110;
    --sheet:  #151816;
    --ink:    #E6E9E4;
    --ink-2:  #C5CAC3;
    --muted:  #979E98;
    --faint:  #6C736D;
    --rule:   #2C312D;
    --hair:   #1F2320;
    --band:   #151B17;
    --mark:   #E2CE45;
    --mark-ink: #0F1110;
    --invert-bg:  #E6E9E4;
    --invert-ink: #0F1110;
  }
}
```

Three weights of line, and they mean different things:

| Line | Token | Used for |
| --- | --- | --- |
| Hard | `--ink` | Section tops, table head underline, anything that opens a block |
| Standard | `--rule` | Dividers between peers, list rows, card edges |
| Hair | `--hair` | Between rows inside a table, inside a dense list |

Set the page background on `body`, not on a wrapper, so overscroll matches.

---

## 3. Type

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap">
```

```css
:root {
  --sans: 'Geist', ui-sans-serif, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
  --mono: 'Martian Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}

body {
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.6;
  background: var(--paper);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
@media (max-width: 640px) { body { font-size: 16px; } }
```

**Every mono run carries `font-variation-settings: 'wdth' 87.5`.** Martian Mono at default
width is wide and clumsy. At 87.5 it reads as a drafting label. Large mono numerals
(counts, figure IDs) open back up to `'wdth' 100` or `112.5` and drop to weight 300.

Never bold the sans past 600. There is no 700 in this system.

### Scale

| Role | Size | Leading | Tracking | Weight |
| --- | --- | --- | --- | --- |
| Page title | `clamp(52px, 8.4vw, 104px)` | 0.92 | -0.05em | 500 |
| Section | `clamp(30px, 3.4vw, 42px)` | 1.08 | -0.035em | 500 |
| Statement, pull quote | `clamp(23px, 2.6vw, 30px)` | 1.32 | -0.025em | 500 |
| Claim (leads a block) | `clamp(24px, 2.6vw, 30px)` | 1.18 | -0.03em | 600 |
| Subhead | 21px | 1.28 | -0.015em | 600 |
| Lede | 19px | 1.55 | 0 | 400, `--ink-2` |
| Body | 17px | 1.6 | 0 | 400 |
| Table body | 14–14.5px | 1.45 | 0 | 400 |
| Mono label | 12px | 1.45 | 0 | 400, `--muted` |
| Table head, badge | 11.5px | 1.3 | 0 | 400 |

The negative tracking is not optional. Headlines set at 0 tracking are the single fastest
way to make this system look like a template.

```css
.lbl {
  font-family: var(--mono);
  font-variation-settings: 'wdth' 87.5;
  font-size: 12px;
  line-height: 1.45;
  color: var(--muted);
}

/* the label sits inside blocks that size their own paragraphs, and a descendant
   selector like `.tldr p` outranks a bare `.lbl`. Raise it once, here. */
p.lbl, .tldr p.lbl, .standout p.lbl { font-size: 12px; line-height: 1.45; letter-spacing: 0; font-weight: 400; }
```

That second rule is not optional tidying. A label dropped into a block that styles `p`
silently inflates to the block's size, and because it still looks deliberate it is easy
to miss.

---

## 4. Space and layout

```css
:root {
  --gutter: 24px;
  --bar: 52px;    /* sticky top bar height */
  --thead: 44px;  /* sticky table head height */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}
@media (max-width: 640px) { :root { --gutter: 16px; } }

.wrap { width: 100%; max-width: 1240px; margin-inline: auto; padding-inline: var(--gutter); }
```

The document grid is a narrow left rail for labels and refs beside a measured column of
text. Below 1100px the rail collapses above the content and runs horizontally.

```css
.doc { display: grid; grid-template-columns: minmax(0, 1fr); }
.rail { display: flex; flex-wrap: wrap; gap: 6px 16px; align-items: baseline; }
.span { grid-column: 1 / -1; }

@media (min-width: 1100px) {
  .doc { grid-template-columns: 200px minmax(0, 720px); column-gap: 64px; }
  .rail { flex-direction: column; align-items: flex-start; gap: 10px; }
}
```

Vertical rhythm is coarse on purpose. Between blocks in a section, 96px. Between major
layers, 120px with a hard `--ink` rule on top. Inside a block, 14–26px. Body copy caps at
`36em`, claims at `26em`.

---

## 5. Tables

Three patterns, in order of how often you need them.

### 5a. Reference table

Two columns, a term and its definition. Left-aligned, top-aligned, no vertical rules, hair
lines between rows. Optional mono group headers break it into sections.

```css
.rubric { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 14.5px; line-height: 1.45; }
.rubric th,
.rubric td { text-align: left; vertical-align: top; padding: 8px 0; border-top: 1px solid var(--hair); }
.rubric th[scope='row'] { width: 128px; padding-right: 16px; font-weight: 500; }
.rubric td { color: var(--ink-2); }

/* group header row */
.rubric-g th {
  padding: 16px 0 6px;
  border-top: 0;
  font: 400 11.5px/1.3 var(--mono);
  font-variation-settings: 'wdth' 87.5;
  color: var(--muted);
}
.rubric tr.rubric-g:first-child th { padding-top: 0; }
```

```html
<table class="rubric">
  <tbody>
    <tr class="rubric-g"><th colspan="2">Confidence</th></tr>
    <tr><th scope="row">Held up</th><td>Seen directly, more than once.</td></tr>
    <tr><th scope="row">Likely</th><td>One clear source, consistent with the rest.</td></tr>
  </tbody>
</table>
```

### 5b. Comparison table

A few columns, a labelled row axis. Mono head with a hard rule under it, hair rules
between rows, scrolls horizontally rather than squeezing.

```css
.cmp { overflow-x: auto; margin-top: 8px; }
.cmp table { width: 100%; min-width: 520px; border-collapse: collapse; font-size: 14px; line-height: 1.4; }
.cmp th,
.cmp td { text-align: left; vertical-align: top; padding: 8px 10px 8px 0; border-bottom: 1px solid var(--hair); font-weight: 400; }
.cmp thead th {
  font: 11.5px var(--mono);
  font-variation-settings: 'wdth' 87.5;
  color: var(--muted);
  border-bottom: 1px solid var(--ink);
}
.cmp tbody th { font-weight: 600; width: 120px; }
.cmp tr[data-us] td:nth-child(2) { font-weight: 600; }  /* the row that is you */
```

### 5c. Dense data grid

The one that carries real weight: eight columns, sticky head, sticky group headers,
banding, and a restack to cards on narrow screens. Uses `border-collapse: separate` so
sticky headers keep their borders.

```css
.grid { margin-top: 22px; }
.grid table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; line-height: 1.48; }
.grid th,
.grid td { text-align: left; font-weight: 400; vertical-align: top; }

.grid .grp th { font: 600 19px/1.2 var(--sans); letter-spacing: -0.02em; color: var(--ink); }
.grid .grp-sub { font-weight: 400; color: var(--muted); }
.grid th.c-name { font-weight: 600; }
.grid .c-what { color: var(--ink-2); }
.grid tr[data-band='1'] > * { background: var(--band); }

@media (min-width: 1180px) {
  .grid table { table-layout: fixed; }
  .grid thead th {
    position: sticky; top: var(--bar); z-index: 3; height: var(--thead);
    padding: 0 8px 0 10px; vertical-align: middle; line-height: 1.2;
    background: var(--paper); border-bottom: 1px solid var(--ink);
    font: 11.5px var(--mono); font-variation-settings: 'wdth' 87.5; color: var(--muted);
  }
  .grid .grp th {
    position: sticky; top: calc(var(--bar) + var(--thead)); z-index: 2;
    background: var(--paper); padding: 26px 10px 8px; border-bottom: 1px solid var(--ink);
  }
  .grid tbody tr:not(.grp) > * { padding: 13px 10px 14px; border-bottom: 1px solid var(--hair); }

  /* set explicit widths, they total 100 */
  .grid thead .c-name { width: 12%; }
  .grid thead .c-what { width: 19%; }
  .grid thead .c-read { width: 30%; }
  .grid thead .c-pri  { width: 6.5%; }
  .grid thead .c-src  { width: 12.5%; }
}

/* restack as cards, group headers still pin */
@media (max-width: 1179px) {
  .grid table, .grid tbody, .grid tr, .grid td, .grid th { display: block; }
  .grid thead { display: none; }
  .grid .grp { position: sticky; top: var(--bar); z-index: 2; background: var(--paper); }
  .grid .grp th { padding: 24px 0 8px; border-bottom: 1px solid var(--ink); }
  .grid tr:not(.grp) {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 16px; padding: 16px 12px 18px; border-bottom: 1px solid var(--hair);
  }
  .grid tr:not(.grp) > * { background: none !important; }
  .grid tr[data-band='1'] { background: var(--band); }
  .grid .c-name { grid-column: 1 / -1; font-size: 17px; }
  .grid .c-what, .grid .c-read, .grid .c-src { grid-column: 1 / -1; }
  .grid td::before {
    content: attr(data-l); display: block;
    font: 11px/1.5 var(--mono); font-variation-settings: 'wdth' 87.5;
    color: var(--muted); margin-bottom: 4px;
  }
}
@media (min-width: 700px) and (max-width: 1179px) {
  .grid tr:not(.grp) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

```html
<div class="grid">
  <table>
    <thead>
      <tr>
        <th class="c-name">Surface</th>
        <th class="c-what">What it is</th>
        <th class="c-read">Our read</th>
        <th class="c-pri">Priority</th>
        <th class="c-src">Source</th>
      </tr>
    </thead>
    <tbody>
      <tr class="grp"><th colspan="5">Acquisition <span class="grp-sub">6 surfaces</span></th></tr>
      <tr data-band="1">
        <th scope="row" class="c-name">Homepage</th>
        <td class="c-what" data-l="What it is">First stop for most visitors.</td>
        <td class="c-read" data-l="Our read">Leads with the product, not the promise.</td>
        <td class="c-pri"  data-l="Priority"><span class="pri pri-P1">P1</span></td>
        <td class="c-src"  data-l="Source">Analytics, Aug</td>
      </tr>
    </tbody>
  </table>
</div>
```

Every `<td>` carries `data-l` matching its column header. That attribute is what the
card view prints as a label, so the table stays readable on a phone without a second
markup path.

### Table rules that apply to all three

- Left-aligned and top-aligned. Never center a cell.
- Numbers get `font-variant-numeric: tabular-nums`.
- No vertical rules and no zebra striping by default. Banding is for grouping, not decoration.
- Row label is `<th scope="row">` at weight 600, cell text at 400 in `--ink-2`.
- Head is always mono, 11.5px, `--muted`, over a hard `--ink` rule.
- A table with more than five columns needs the card restack. Horizontal scroll alone is not enough.

---

## 6. Small marks

All of them sit at 11.5px, 1px `--rule` border, 2px radius, and the odd
`4px 6px 3px` padding, which optically centers text that sits high in its box.

```css
.ref, .sow, .pri, .chip {
  display: inline-block; font-size: 11.5px; line-height: 1;
  border: 1px solid var(--rule); border-radius: 2px; white-space: nowrap;
  font-family: var(--mono); font-variation-settings: 'wdth' 87.5;
}
.ref  { padding: 4px 5px 3px; margin: 0 0.18em; background: var(--sheet); color: var(--ink); text-decoration: none; vertical-align: 0.08em; font-weight: 500; }
.sow  { padding: 4px 6px 3px; }
.pri  { padding: 4px 6px 3px; border-color: var(--ink); }
.chip { padding: 3px 6px; margin: 0 4px 4px 0; line-height: 1.3; background: var(--sheet); color: var(--ink-2); white-space: normal; overflow-wrap: anywhere; }

/* the three states of emphasis, and there are only three */
.pri-P1   { background: var(--ink); color: var(--paper); font-weight: 500; }
.pri-P3   { border-color: var(--rule); color: var(--muted); }
.is-flag  { background: var(--mark); border-color: var(--mark); color: var(--mark-ink); }
.is-part  { border-color: var(--mark); box-shadow: inset 5px 0 0 var(--mark); padding-left: 11px; }

a.ref:hover { background: var(--mark); border-color: var(--mark); color: var(--mark-ink); }
```

The highlighter is a gradient, not a background, so it sits on the text like a marker
pass and survives line breaks:

```css
mark {
  color: var(--mark-ink);
  background: linear-gradient(transparent 12%, var(--mark) 12%, var(--mark) 92%, transparent 92%);
  padding: 0 0.06em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
```

Big numbers are mono at weight 300, opened to `wdth 100`, tracked to -0.06em. The
highlighter behind one of them is how a stat gets called out.

```css
.stat {
  font: 300 clamp(40px, 4.4vw, 56px)/0.95 var(--mono);
  font-variation-settings: 'wdth' 100;
  letter-spacing: -0.06em;
  width: max-content;      /* or justify-self: start, inside a grid */
}
.stat.hot { background: linear-gradient(transparent 58%, var(--mark) 58%, var(--mark) 90%, transparent 90%); }
```

The width constraint matters. Without it the element fills its column and the highlighter
runs on past the last digit as a loose bar, which reads as a progress meter.

Links are underlined in `--rule` at 1px with a 3px offset, darkening to `--ink` on hover.
Focus is a 2px `--ink` outline at 2px offset. Selection is the highlighter.

### The inverted block

One block per page may flip to solid ink, for the thing you want read differently from
everything around it. It is the only large filled surface in the system.

```css
.working { background: var(--invert-bg); color: var(--invert-ink); padding: 40px clamp(22px, 5vw, 64px) 44px; }
.working .lbl { color: inherit; opacity: 0.7; }
.working .ref { background: transparent; color: inherit; border-color: color-mix(in srgb, currentColor 40%, transparent); }
```

Anything drawn with a color token rather than `currentColor` disappears inside it. The
usual casualties are the dash on a bullet list and a badge border, both of which reference
`--ink` and become invisible on ink. Draw small marks with `currentColor` so they invert
with their container:

```css
.bullets li { position: relative; padding-left: 26px; }
.bullets li::before { content: ''; position: absolute; left: 2px; top: 0.78em; width: 12px; border-top: 1px solid currentColor; }
```

---

## 7. Motion

One curve, `cubic-bezier(0.23, 1, 0.32, 1)`, on everything that moves. Durations: 120ms
for hover and press, 140–200ms for a tooltip or appearance, 260ms for a panel opening,
420–560ms only for something being explained.

Every pressable element gets `transform: scale(0.97)` on `:active`. Hover effects are
wrapped in `@media (hover: hover) and (pointer: fine)` so they never fire on touch.
Everything animated has a `prefers-reduced-motion` branch that cuts to a fade or nothing.

---

## 8. Which register, and why they stay apart

There are two registers and they do not blend. Pick one per project, at the start.

| | Document register | Site register |
| --- | --- | --- |
| **Where** | `/aleph/audit` and work like it: client audits, decks, specs, data-dense reads | jonschafer.com: `/`, `/work`, `/play`, `/advising`, case studies |
| **Ground** | Paper `#F2F3EF`, ink `#131516` | Green `#435938` with cream `#FAFAFA`; mustard `#F8DB79` with charcoal `#333333` on `/advising` and case studies |
| **Type** | Geist, with Martian Mono for labels | Mondwest for display, Haas Grot Disp for body and UI |
| **Feel** | Neutral, evidentiary, gets out of the way of the data | Warm, personal, emoji-tolerant |
| **Defined in** | Sections 1-7 above | The site itself, not this file |

**Everything in sections 1 through 7 is the document register only.** Do not carry its
tokens, its type or its table CSS onto a site page, and do not carry the site's green and
Mondwest into an audit. They were built for different jobs and each one is weaker diluted.

The separation was tested rather than assumed. The whole site was rebuilt once in the
document register to see what it bought (`public/_register-mockup.html`, untracked). The
answer: `/play` got better, `/work` held, and the homepage lost most of its personality,
because a neutral carousel is just a carousel. Not worth the trade. The registers stayed
separate.

### If a site page ever needs a real table

Build it in the site register, not by importing section 5. Keep the structural rules that
are register-independent (left-aligned, top-aligned, no vertical rules, no zebra striping,
group headers over a hard rule, `tabular-nums`, card restack over five columns) and set it
in the site's own palette and type. Mondwest has no tabular figures, so numerals go in
Haas Grot.

Note: the site footer credits PP Neue Montreal, but the file loaded as `Haas_Grot_Disp`
is Haas Grot Display 55 Roman. One of the two needs correcting.

---

## 9. Don'ts

- No drop shadows except on an overlay lifting off the page (tooltip, lightbox).
- No border radius above 3px. Most things are 2px. Pills and rounded cards are out.
- No second accent color. If something needs to stand out and the highlighter is taken,
  use weight, a rule, or an inverted block.
- No centered text, no centered table cells.
- No icon fonts and no icon libraries. Inline SVG at 14px, `currentColor`.
- No filled cards as the default container. Start with a rule and only add `--sheet`
  when the content is genuinely an aside.
- No uppercase sans for labels. Labels are mono.
