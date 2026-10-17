# site.md

**The site register.** Six themes dealt like cards, MD Nichrome and ABC Social Condensed,
hairline rules, color that moves on hover.

This is one of two systems. It covers jonschafer.com: `/` (the work page), `/play`,
`/about`. The other is the document register in `design.md`, which covers `/aleph/audit`
and work like it. They stay separate.

Rebuilt October 2026 on Francine Thompson's layout, replacing the green-field and
Mondwest system. Source of truth is the running code: `lib/themes.js`, `app/globals.css`,
and `components/`. If this file and the code disagree, the code wins.

**Two things to know before using this.** The typefaces are unlicensed trial files, and
several pages were left behind by the redesign. Both are in section 9.

---

## 1. The idea

1. **The page has no fixed color.** Six themes, one dealt per page load. Every surface
   on a page takes the same pair, footer included. The site is recognizable by its
   behavior rather than by one hue.
2. **Two faces, three voices.** Nichrome Regular states things, Nichrome Ultra shouts,
   Social Condensed handles everything else. Nothing else is loaded for the site.
3. **Rules, not boxes.** A hairline top rule in the theme ink at 25% opens a card. There
   are no filled containers and no shadows.
4. **Color is an event.** Links and rows take a random theme pair on hover. It is the
   main piece of interaction design on the site, and it is why the palette is a list
   rather than a hierarchy.

---

## 2. Themes

Six sets in `lib/themes.js`, from Figma (Website, Oct 26, node 7:235). Four tokens each:
`bg` is the page field, `ink` is all type and outlines, `hmu` and `hmuInk` are the email
button.

| | bg | ink | hmu | hmuInk |
| --- | --- | --- | --- | --- |
| Gold | `#D5B800` | `#19180E` | `#19180E` | `#F2F2F2` |
| White | `#FFFFFF` | `#2E2E2E` | `#FF000F` | `#FFFFFF` |
| Sage | `#9FAE79` | `#3E3C32` | `#FFFFFF` | `#3E3C32` |
| Orange | `#FF4B00` | `#511A07` | `#FFFFFF` | `#511A07` |
| Bone | `#F2F2F2` | `#130EA8` | `#130EA8` | `#F2F2F2` |
| Blue | `#0F50C8` | `#FF69B4` | `#FF69B4` | `#0F50C8` |

Every ink is drawn from its own field rather than being neutral: near-black olive on
gold, burnt umber on orange, hot pink on blue. That is what stops the set reading as six
wallpapers behind the same black text.

There is no dark mode and no neutral default. The themes are the identity.

### Dealing

`components/useRandomTheme.js` deals them like a shuffled deck rather than rolling dice.

- A shuffled order lives in `localStorage` under `site-theme-deck`
- Each page load takes the next card, so six loads show all six before any repeat
- When the deck runs out it reshuffles, and if the new first card matches the one just
  shown it moves to the back
- One pick per page view, held in a module-level `view` object so React's dev double-run
  does not deal twice
- `ready` stays false until the pick lands. Callers set `visibility: hidden` until then,
  so the default never flashes
- `animate` turns on 80ms later, so hover transitions do not animate the initial swap
- Pass `enabled = false` when a parent already picked, so the deck advances once per load

A page picks once at the top and hands the theme down. `Footer` takes a `theme` prop for
exactly this reason, so page and footer always match.

---

## 3. Type

```css
@font-face { font-family: 'Nichrome';        src: url('/fonts/trial/MDNichromeTest-Regular.otf')        format('opentype'); font-weight: 400; }
@font-face { font-family: 'Nichrome';        src: url('/fonts/trial/MDNichromeTest-Ultra.otf')          format('opentype'); font-weight: 900; }
@font-face { font-family: 'Nichrome';        src: url('/fonts/trial/MDNichromeTest-RegularOblique.otf') format('opentype'); font-weight: 400; font-style: italic; }
@font-face { font-family: 'Social Condensed'; src: url('/fonts/trial/ABCSocialCondensed-Regular-Trial.woff2') format('woff2'); font-weight: 400; }
```

Declared at the bottom of `app/globals.css`. **These are trial files.** See section 9.

Fallback stacks, used verbatim in the components:

```
font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal        statements, quotes
font-['Nichrome','Arial_Black',sans-serif] font-black            headings, giant footer
font-['Social_Condensed','Haas_Grot_Disp',sans-serif]            everything else
```

Haas Grot Disp survives as the fallback for Nichrome Regular and Social Condensed.
Arial Black backs the black weight, because Haas Grot ships one weight and cannot fake it.

**Nichrome Regular** sets statements: the h1 on `/` and `/play`, the `Role:` and `With:`
labels in italic, testimonial quotes in italic, the Lael pull quote on `/about`.

**Nichrome Ultra** sets section headings and the giant footer word. Only ever a few words.

**Social Condensed** sets everything else: nav, project copy, titles, footer, lists,
dates, chips.

### Scale

| Role | Size | Leading | Tracking | Face |
| --- | --- | --- | --- | --- |
| Page statement (h1) | 24 / 40 / 54px | 1.15 | 0.2px | Nichrome Regular |
| About pull quote | 24 / 36px | 1.2 | 0.36px | Nichrome Regular |
| Section heading | 26 / 30px | none | 0.3px | Nichrome Ultra |
| Giant footer | `min(100cqw / 5.36, 252px)` | 0.78 | 0.01em | Nichrome Ultra |
| Testimonial quote | 18 / 21px | 1.45 | 0.2px | Nichrome Regular italic |
| Project title, play title | 20 / 21px | 1.2 | 0.21px | Social Condensed |
| Nav | 18 / 19px | none | 0.19px | Nichrome (name) + Social (links) |
| About list row | 18 / 21px | 1.15 | — | Social Condensed |
| Footer bottom line | 18 / 29px | 1.15 | — | Social Condensed |
| Footer blurb, buttons | 17 / 22px | 1.15 | 0.22px | Social Condensed |
| Body, project copy | 16 / 17px | 1.3 | 0.17px | Social Condensed |
| Play chip | 14px | 1.2 | — | Social Condensed |

Sizes step at breakpoints rather than scaling fluidly. The one exception is the giant
footer, which is sized in container units so it always fills its width.

The h1 takes a third step at the custom `desktop: 1200px` breakpoint, defined in
`tailwind.config.js`.

Numerals that line up (dates, the clock, years) carry `tabular-nums`.

---

## 4. Layout

```
padding: 0 20px        mobile, every page
padding: 0 26px        md and up, on / and /play
max-width: 1440px      /about and the footer only
```

The 26px gutter is narrow on purpose. Work sits almost edge to edge, which is most of the
reason the redesign feels different from the old 60px shell.

| Page | Shell |
| --- | --- |
| `/` and `/play` | No max width. `px-20` / `px-26` md |
| `/about` | `max-w-1440 mx-auto`, `px-20` / `px-60` md / `px-100` desktop |
| Footer | `max-w-1440 mx-auto`, `px-20` / `px-42` md |

### Rhythm

| Section | Padding |
| --- | --- |
| Statement (h1) | `pt-32 pb-48`, `pt-100 pb-80` md |
| Project list, play grid | `pb-80`, `pb-120` md |
| Between projects | `gap-72`, `gap-104` md |
| Grid gutters | `gap-x-48`, `gap-y-48` / `gap-y-64` md |
| Card rule to content | `pt-16`, `pt-20` md |
| Footer | `pt-40 pb-28`, `pt-48 pb-40` md |

### Grids

- **Work project**: `lg:grid-cols-12`. Slideshow spans 9, text spans 3, `gap-x-48`
- **Play**: 1 / 2 / 3 columns at base / md / lg
- **Testimonials**: 1 / 2 columns at base / lg
- **About**: `desktop:grid-cols-[minmax(0,867px)_auto]`, `gap-x-80`
- **Footer top**: `md:grid-cols-[minmax(0,381px)_auto]`, ordered so both blurbs top-align
  and both button rows share a baseline however far the left blurb wraps

---

## 5. Components

### Navigation (`components/Navigation.js`)

Fixed, `z-50`, on the page's own field. Name left in Nichrome Regular, `Play` and `About`
right in Social Condensed at the same size. `px-20` / `px-26` md, `py-20` / `py-24` md,
`items-baseline`. Renders a 60px / 68px spacer unless transparent. Active link is
`opacity-100`, inactive `opacity-70`. The name links to `/`, which is the work page.

No mobile menu. Two links do not need one.

### Giant footer (`components/Footer.js`)

The signature element. `Footer` takes `colophon` to render it, and `theme` to inherit the
page's pick.

- The word "Giant footer" in Nichrome Ultra, sized to fill its container:
  `container-type: inline-size` on the wrapper, `font-size: min(100cqw / 5.36, 252px)` on
  the type. 5.36 is the measured width of the word in ems, so it fits at any width with or
  without a scrollbar
- `leading-0.78`, `tracking-0.01em`, `whitespace-nowrap`, `select-none`
- Theme lands as CSS variables on the footer element: `--f-bg`, `--f-ink`, `--f-hmu`,
  `--f-hmu-ink`, so the buttons can be plain CSS
- A live Portland clock, 24 hour, ticking each second, `tabular-nums`, blank until mounted
  so server and client markup match

Buttons are `.fbtn` in `globals.css`: `border-radius: 4px`, `padding: 7px 10px`
(`8px 10px` md), `active: scale(0.97)`, focus ring `2px solid var(--f-ink)` at `3px`
offset. The solid email button flips to an outline on hover; the outline link pills fill
on hover. Transitions only apply under `.f-anim`, which turns on after the theme lands.

### Hover highlight (`components/HoverHighlight.js`, `.hl` / `.hl-row`)

Mounted once in the root layout. On `mouseover` of a `.hl` or `.hl-row` it picks a random
pair from the six themes, skipping any pair whose background matches the field the element
sits on (walked up the DOM via `getComputedStyle`), and never repeating the last pick. The
pair lands as `--hl-bg` and `--hl-fg`.

```css
.hl { text-decoration: underline; text-decoration-skip-ink: none; text-underline-position: from-font;
      border-radius: 2px; padding: 0 0.12em; margin: 0 -0.12em; box-decoration-break: clone;
      transition: background-color 120ms ease-out, color 120ms ease-out; }
```

Only active under `(hover: hover) and (pointer: fine)`. Touch keeps the plain underline.
`.hl-row` is the same idea for a whole row on `/about`, bleeding 10px past each side with
`box-shadow: -10px 0 0 var(--hl-bg), 10px 0 0 var(--hl-bg)` so the text and rules do not
move.

### Media and loading (`components/WorkMedia.js`)

Media sits on a faint checkerboard and fades in once loaded, a nod to Elana Schlenker.

```css
.load-checker { background-color: rgba(0,0,0,0.03);
  background-image: conic-gradient(rgba(0,0,0,0.05) 25%, transparent 0 50%, rgba(0,0,0,0.05) 0 75%, transparent 0);
  background-size: 16px 16px; }
.load-fade { opacity: 0; transition: opacity 500ms cubic-bezier(0.23, 1, 0.32, 1); }
.load-fade[data-loaded='true'] { opacity: 1; }
```

### Project slideshow (`components/ProjectSlideshow.js`)

`aspect-[1300/731]`, `rounded-4`, `overflow-hidden`. Slides translate at 500ms on the
house curve. Arrows are 36px circles, `bg-white/70` with `backdrop-blur-sm`, going opaque
on hover. The frame is `cursor-zoom-in` and opens `Lightbox`.

### Cards (`/play`, testimonials)

One pattern both places: a hairline top rule in the theme ink at 25%, then content.

```jsx
<li className="border-t pt-[16px]" style={{ borderColor: `${theme.ink}40` }}>
```

Play titles underline on hover via `decoration-transparent` going to
`group-hover:decoration-current`. Play chips are `rounded-4`, `border` in theme ink,
`px-8 py-3`, 14px, `opacity-80`.

Testimonial faces are 56px / 64px circles filled with the theme ink, holding the photo or
falling back to initials in the theme bg.

---

## 6. Motion

One curve for movement, `cubic-bezier(0.23, 1, 0.32, 1)`:

- Slideshow slides, 500ms
- Media fade in, 500ms
- About portrait tilt, 300ms, `hover:rotate-2`

Short ease-out for color:

- Hover highlight, 120ms
- Footer buttons, 140ms background, color and border; 100ms transform

Press feedback is `scale(0.97)` on every button. Hover effects are wrapped in
`@media (hover: hover) and (pointer: fine)`. Every animated rule has a
`prefers-reduced-motion` branch, and the portrait and slideshow use `motion-reduce:`
variants inline.

---

## 7. Voice

Covered in `~/.claude/CLAUDE.md`. What shows up in these layouts:

- First person, in Jon's voice, for case studies, work cards and project pages
- Emoji are part of the register
- No em dashes, sentence case always, no antithesis, no copywriter parallelism
- Don't open with a title list, don't frame work as "the brief was X"
- Lead with decisions, not deliverables

The footer copy sets the tone: "Building a brand, or want to swap notes on design? My
inbox is (figuratively) open." and "The unusual suspects" over the link pills.

---

## 8. What the redesign changed

For anyone reading an older commit or the stale `/overview`:

| Then | Now |
| --- | --- |
| Green `#435938` and mustard `#F8DB79` fields | Six themes dealt per load |
| Mondwest display, Haas Grot body | Nichrome and Social Condensed |
| `/work` as a page, `/` a photo carousel | `/` **is** the work page |
| Project carousels with a 345px text column | 9-column slideshow beside a 3-column text block |
| `/advising` | Removed |
| `/bio` | `/about`, with History rows and Faves |
| Small typeface-credit footer | Giant footer with buttons and a live clock |
| 60px gutters | 26px gutters |
| Positive tracking, Mondwest | Still positive tracking, tighter leading |

`components/ProjectCarousel.js`, `HomeCarousel.js` and `Hero.js` are still in the repo.
No live route imports them. `ProjectCarousel` and `Hero` are referenced only by
`/overview`, which is itself stale, so retiring that page clears all three.

---

## 9. Known drift

1. **The typefaces are unlicensed trial files.** `MDNichromeTest-*.otf` and
   `ABCSocialCondensed-Regular-Trial.woff2` are in `public/fonts/trial/` and committed.
   They carry trial restrictions and are served publicly on every page load. License MD
   Nichrome and ABC Social Condensed and swap the files before this is promoted anywhere.
   This is the one item on this list that is a real exposure rather than tidying.
2. **`globals.css` still sets `body { background-color: #435938 }`.** Dead green from the
   old system. Every page now paints its own field over it, so it only shows if a page
   forgets to, but it should go or become a theme-neutral value.
3. **The legacy footer credits the wrong typefaces.** `components/Footer.js:108` says
   "PP Mondwest, Neue Haas Grotesk Display", which is now wrong twice over. That branch
   still renders wherever `colophon` is not passed.
4. **`/case-studies/*` was left behind.** Both articles still run mustard `#F8DB79` and
   Mondwest, and `/advising`, which was the only thing linking to them, is gone. They are
   live and unreachable.
5. **`/overview` is further out of date than before.** It documents the green system, has
   no themes, and lists routes that no longer exist. Treat this file as the source of
   truth and rebuild or retire that page.
6. **Four typefaces load that the site no longer sets.** Mondwest, Inter and Fraunces come
   in through `globals.css` for `/mma`, `/play/git` and legacy components. Haas Grot Disp
   is still a real fallback and should stay.
7. **daisyUI still loads sitewide** for `/mma/map` alone, with `base: false`.

---

## 10. The other register

`design.md`, in this folder. Paper and ink, Geist and Martian Mono, hairline rules, one
highlighter. It covers `/aleph/audit`, audits, decks and data-dense tables.

Do not mix them. The tell is color behavior: this register deals a field per load and
flashes random pairs on hover, the document register holds one neutral paper and one
highlighter. Side by side they read as two sites, which is the point.

If a site page ever needs a dense table, build it here and borrow only the
register-independent rules: left- and top-aligned, no vertical rules, no zebra striping,
group headers over a hard rule, tabular figures, and a card restack past five columns.
Both site faces have tabular figures, so numerals can stay in Social Condensed.
