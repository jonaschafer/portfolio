# site.md

**The site register.** Colored fields, Mondwest for display, Haas Grot for everything
else, emoji welcome.

This is one of two systems. It covers jonschafer.com: `/`, `/work`, `/play`, `/advising`,
`/case-studies/*`. The other is the document register in `design.md`, which covers
`/aleph/audit` and work like it. They stay separate. Aleph audit is one style, the site
is the rest.

Source of truth is the running code: `components/` and the page files under `app/`. If
this file and the code disagree, the code wins and this file needs updating.

**The live style guide at `/overview` has drifted** and should not be trusted over this
file. See section 8.

---

## 1. The idea

Three things carry the character:

1. **The page is a field, not a canvas.** Each section sets a full-bleed background color
   edge to edge. Content sits on the field. There are no page-level containers with
   visible edges.
2. **One display face, one workhorse.** Mondwest does titles and headings and nothing
   else. Haas Grot does body, navigation, captions, labels, everything.
3. **Warm and first person.** Emoji belong here. So does "Beam me up, Scotty ↑" in the
   footer. This register is allowed to sound like a person.

---

## 2. Fields

Three fields, one per area. A page picks one and commits to it.

| Field | Background | Type on it | Where |
| --- | --- | --- | --- |
| **Green** | `#435938` | `#FAFAFA` | `/work` nav, intro, project blocks, testimonials, footer |
| **Mustard** | `#F8DB79` | `#333333` | `/advising`, `/case-studies/*` |
| **White** | `#FFFFFF` | `#000000` | `/play` |
| **Media** | the image itself | `#FAFAFA` with a scrim | `/` homepage carousel |

Supporting values, all derived rather than new colors:

```
rgba(51,51,51,0.85)     body copy on mustard
rgba(51,51,51,0.7)      eyebrows, read times on mustard
rgba(51,51,51,0.2)      blockquote border on mustard
rgba(51,51,51,0.1)      card borders on mustard
rgba(51,51,51,0.05)     card fills on mustard
rgba(120,120,120,0.7)   dates on /play
rgba(250,250,250,0.8)   secondary type on green
```

The homepage scrim, which is the only gradient in the system:

```css
background: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.15) 40%, transparent);
text-shadow: 0 1px 3px rgba(0,0,0,0.4);
```

There is no dark mode. The fields are the identity, so they do not invert.

---

## 3. Type

```css
@font-face { font-family: 'Mondwest';       src: url('/fonts/Mondwest-Regular.woff2') format('woff2'); font-display: swap; }
@font-face { font-family: 'Haas_Grot_Disp'; src: url('/fonts/HaasGrotDisp-55Roman.otf') format('opentype'); font-display: swap; }
```

Both are self-hosted from `public/fonts/` and ship one weight each, regular. Inter loads
from Google Fonts and is used for exactly one thing, the name link in the nav.

**Mondwest is display only.** Titles and section headings. Never body, never a label,
never a number that needs to line up, because it has no tabular figures.

**Haas Grot does everything else.** Body, nav, descriptions, captions, dates, buttons.

### Scale

Positive tracking throughout, which is the opposite of the document register and a large
part of why the two cannot be mixed.

| Role | Size | Leading | Tracking | Face |
| --- | --- | --- | --- | --- |
| Project title, section heading | 31px | 1.2 | 0.31px | Mondwest |
| Case study h1 | 28px / 36px md | tight | 0.31px | Mondwest |
| Play card title | 24px | 28.8px | 0.31px | Mondwest |
| Case study h2 | 20px / 24px md | tight | 0.31px | Mondwest, semibold |
| Mobile intro, advising card title | 20px | 1.2 | 0.31px | Mondwest |
| Case study h3 | 18px / 20px md | tight | — | Mondwest, semibold |
| Large body, case study prose | 19.4px | 1.2–1.35 | 0.167px | Haas Grot |
| Nav, footer, project description | 16px | 1.4 | 0.16px | Haas Grot |
| Mobile nav menu | 32px | 1.4 | 0.16px | Haas Grot |
| Testimonial (mobile → desktop) | 14 / 16 / 19.4px | 1.2 | 0.167px | Haas Grot |
| Small body, descriptions | 13.4px | 16.44px | 0.167px | Haas Grot |
| Play dates | 13px | 18.2px | 0.13px | Haas Grot |
| Eyebrow (`/advising`) | 11px | — | 0.14em, uppercase | Haas Grot |

Intro paragraphs step 20px mobile → 31px desktop. Body steps 13.4px → 19.4px. Those two
jumps are the responsive type system; there is no fluid `clamp()` anywhere.

---

## 4. Layout

```
min-width: 375px        every page
max-width: 1440px       the shell, centered
padding: 0 20px         mobile
padding: 0 60px         md and up
```

Narrower columns for reading:

| Column | Width | Gutters |
| --- | --- | --- |
| Advising | 900px | 20px / 40px md |
| Case study article | 747px | 20px / 60px md |
| Intro and headline copy | 335px / 648px / 747px by breakpoint | inside the shell |
| Project info block | 345px | inside the shell |

Breakpoints are Tailwind defaults plus one custom: `desktop: 1200px` in
`tailwind.config.js`.

### Section rhythm

| Section | Padding |
| --- | --- |
| Intro, play headline | `pt-60 pb-40` |
| Project block | `pt-50 pb-60`, internal gap 46px |
| Testimonials | header `pt-60 pb-30`, grid `pb-60` |
| Footer | `pt-30 pb-60` |
| Advising section | `pt-40 pb-50`, `pt-48 pb-60` md |
| Case study header | `pt-40 pb-40`, `pt-60 pb-48` md |

---

## 5. Components

### Navigation (`components/Navigation.js`)

Fixed, full width, `z-50`. Props are `backgroundColor`, `textColor`, `underlineColor`,
`arrowColor`, so each field passes its own pair. `backgroundColor="transparent"` overlays
it on the homepage carousel.

- `py-30`, `px-20` / `px-60` md, inside the 1440 shell
- Renders an 82px spacer below itself unless transparent
- **Hides on scroll down, returns on scroll up**, with a 60px threshold at the top where
  it always shows. `translateY(-100%)`, 300ms
- Name link is Inter 16px. Section links are Haas Grot 16px
- Active section is `opacity-100`, the others `opacity-50`. On the homepage, or on any
  page with no active section, all links are `opacity-100`
- Under `sm`, a hamburger opens a full-screen overlay: links at 32px, `space-y-8`,
  `pt-140`. Over a transparent nav the overlay is `rgba(0,0,0,0.92)`
- The email link carries a 17px arrow glyph, stroke `1.0625`

### Footer (`components/Footer.js`)

Same `backgroundColor` / `textColor` props. Typeface credit left, a scroll-to-top button
right reading "Beam me up, Scotty ↑", both Haas Grot 16px. Stacks and centers under `sm`.
`minimal` renders the bar empty.

### Project block (`components/ProjectCarousel.js`)

The signature layout of `/work`: a narrow text column above a wide frame.

```
section          pt-50 pb-60
  stack          gap-46
    info         max-w-345, gap-28
      head       gap-8
        h2       Mondwest 31px
        p        Haas Grot 16px/1.4
      counter    Haas Grot 16px, "1/9"
    frame        aspect-[1300/731], bg white, rounded-10, overflow hidden
```

The frame advances on click: left half goes back, right half goes forward, wrapping at
both ends. Arrows appear on `mousemove` and hide on `mouseleave`, as black SVG triangles
inset 32px, `pointer-events: none`. Video slides autoplay muted and loop.

### Testimonials (`components/TestimonialsSection.js`)

Heading "Friends" in Mondwest 31px. One column, two at `md`, gap 30px / 40px. Each entry
is quote, then name at `font-medium`, then title at `opacity-80`.

### Play card (`app/play/page.js`)

Grid of 1 / 2 / 3 columns, gap 32px. Card is `gap-28`: title 24px Mondwest, date 13px in
`rgba(120,120,120,0.7)`, description 13.4px, then tech chips. Chips are `px-10 py-4`,
`rounded-4`, `border-black/70`, `text-black/70`, white fill, 13px. Only these tags become
chips: HTML/CSS, JavaScript, React, Next.js, Claude.

### Advising card (`app/advising/page.js`)

`px-20 py-14` (`py-16` md), `rounded-10`, border `#333333/10`, fill `#333333/5`. Hover
raises both to `/20` and `/10` over 200ms. Title Mondwest 18/20px, description Haas Grot
13.4/16px, read time 12px at `opacity-70`.

List bullets on that page are a 6px circle, `rounded-full`, 1px border in `#333333`, no
fill, offset `mt-8` with a 10px gap.

### Case study prose (`app/case-studies/*/page.js`)

A `prose` map passed to `react-markdown`. Headings Mondwest, body Haas Grot 13.4/19.4px in
`rgba(51,51,51,0.85)`, lists keep native discs and numbers at `pl-6 space-y-2`,
blockquotes take a 4px left border in `rgba(51,51,51,0.2)` and go italic.

---

## 6. Motion

Restrained and almost entirely opacity.

- Links and buttons: `hover:opacity-80`, `transition-opacity`, Tailwind default 150ms
- Inactive nav links sit at `opacity-50` and return to 100 on hover
- Nav show/hide: `translateY`, 300ms
- Carousel slide: `transform 0.5s ease-out`, with the transition disabled for the
  wrap-around jump so the loop is seamless
- Advising cards: `transition-all duration-200`

Anything beyond this in the repo (`mma-btn-press`, the `git-*` keyframes in
`app/globals.css`) belongs to `/mma` and `/play/git`, not to the site register.

---

## 7. Voice

Covered fully in `~/.claude/CLAUDE.md`, but the parts that show up in the layouts:

- First name only, "Jon"
- Emoji are part of the register, not decoration to strip
- No em dashes, sentence case always, no antithesis, no copywriter parallelism
- Don't open a bio with a title list, and don't frame work as "the brief was X"
- Lead with decisions, not deliverables

---

## 8. Known drift

Real inconsistencies in the running code. Listed so they get fixed rather than copied.

1. **The footer credits the wrong typeface.** `components/Footer.js:11` says "PP Mondwest,
   PP Neue Montreal", but the loaded file reports internally as "Haas Grot Disp 55 Roman".
   Either the credit or the font file is wrong.
2. **`/overview` is stale.** It has no mustard field, its page list is missing `/work`,
   `/advising` and `/case-studies`, and it documents an unused `#ebac1e`. Treat this file
   as the source of truth until `/overview` is rebuilt from it.
3. **Inter earns one line.** It loads from Google Fonts for a single nav link. Either
   move that link to Haas Grot and drop the import, or use Inter deliberately.
4. **Fraunces loads globally and is used only by `/mma`.** It costs every page a font
   request for a route most visitors never hit.
5. **`daisyUI` loads sitewide** for `/mma/map` alone, with `base: false` to stop its
   resets leaking. Worth scoping if the site register ever grows components.

---

## 9. The other register

`design.md`, in this folder. Paper and ink, Geist and Martian Mono, hairline rules, one
highlighter. It covers `/aleph/audit` and standalone documents, audits, decks and
data-dense tables.

Do not mix them. Negative tracking and neutral paper against positive tracking and a
colored field will read as two sites. If a site page ever needs a genuinely dense table,
build it here and borrow only the register-independent rules: left- and top-aligned, no
vertical rules, no zebra striping, group headers over a hard rule, tabular figures, and a
card restack past five columns. Numerals go in Haas Grot, since Mondwest has none.
