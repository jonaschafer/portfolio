// Build write-ups on /play: short articles about things I made, each at
// /play/<slug>. The body lives in app/play/[slug]/content/<slug>.md.
// Media files live in public/play/builds/<slug>/.
//
// hero.type: 'image' | 'video' | 'iframe' | 'diagram'
//   image   { src, alt }
//   video   { src, poster, alt }  autoplays muted and loops, like a gif
//   iframe  { src, title, height } an interactive piece from public/, given
//                                  the page theme as ?bg=&ink=
//   diagram { src }                a component in PlayArticle's DIAGRAMS,
//                                  drawn in the page's ink
export const BUILDS = [
  {
    slug: 'brand-studio',
    name: 'Brand Studio',
    dek: 'The front door for ClassDojo’s brand team. An intake that coaches you through the brief, plus a gallery of everything we’ve shipped.',
    card: 'Home base for ClassDojo’s brand team. The intake tells you what your brief is missing while you write it, then files it in Asana and Slack for you. Plus guidelines, tools and a gallery of the work.',
    date: '2026.01.21',
    tags: ['Next.js', 'Claude'],
    hero: { type: 'video', src: '/play/builds/brand-studio/gallery.mp4', poster: '/play/builds/brand-studio/gallery.jpg', alt: 'Scrolling the Brand Studio gallery' },
  },
  {
    slug: 'dojo-brief',
    name: 'Dojo brief',
    dek: 'Paste a messy Slack thread, get back a brief that drops straight into the intake form.',
    card: 'A Claude skill that turns a messy Slack thread into a real creative brief, then fills in the intake form for you.',
    date: '2026.03.19',
    tags: ['Claude'],
    hero: { type: 'diagram', src: 'dojo-brief' },
  },
  {
    slug: 'tutor-thumbnails',
    name: 'Tutor thumbnails',
    dek: 'Describe the class, pick a style, get an on-brand thumbnail back.',
    card: 'Thumbnails for Dojo Tutor classes that actually look like they belong together. Two house styles, a stack of reference art, and Gemini doing the drawing.',
    date: '2026.04.07',
    tags: ['Next.js', 'Claude', 'Gemini'],
    hero: { type: 'image', src: '/play/builds/tutor-thumbnails/cards.webp', alt: 'Tutor class cards with generated thumbnails, Risograph on top and Iridescent below' },
  },
  {
    slug: 'tutor-ads',
    name: 'Tutor ad builder',
    dek: 'Paid social for Dojo Tutor. The model makes the picture, code sets everything that has to be exact.',
    card: 'An art-director skill that makes the scene, and a builder that puts the real logo, type and button on top in a dozen ad sizes.',
    date: '2026.09.09',
    tags: ['Next.js', 'Claude'],
    hero: { type: 'video', src: '/play/builds/tutor-ads/builder.mp4', poster: '/play/builds/tutor-ads/builder.jpg', alt: 'Clicking through the Tutor ad builder templates' },
  },
  {
    slug: 'brand-guidelines',
    name: 'Brand guidelines',
    dek: 'Seven Dojo brands, one set of guideline pages that people actually open.',
    card: 'Guideline pages for every Dojo brand, with copyable colors, a download kit, and an endpoint so agents can read the rules too.',
    date: '2026.04.27',
    tags: ['Next.js', 'Claude'],
    hero: { type: 'video', src: '/play/builds/brand-guidelines/scroll.mp4', poster: '/play/builds/brand-guidelines/scroll.jpg', alt: 'Scrolling the Dojo Tutor guidelines' },
  },
  {
    slug: 'homelab',
    name: 'Homelab',
    dek: 'A Mac mini that runs a private AI model and our media. I plugged things in, Claude did the Terminal stuff.',
    card: 'A private AI model I can ask about my own files from my phone, plus Plex and audiobooks for the house. Set up by Claude over SSH.',
    date: '2026.09.22',
    tags: ['Claude'],
    hero: { type: 'diagram', src: 'homelab' },
  },
  {
    slug: 'ascii',
    name: 'ASCII generator',
    dek: 'Drop in a photo, get it back as type or dots.',
    card: 'Turns any photo into ASCII or a halftone dot pattern, right in your browser. Go ahead, try yours.',
    date: '2025.09.26',
    tags: ['HTML/CSS', 'JavaScript'],
    hero: { type: 'iframe', src: '/play/prototypes/ascii/index.html', title: 'ASCII and dot pattern generator', height: 560 },
  },
]

export const BUILD_PATHS = BUILDS.map((b) => `/play/${b.slug}`)
export const getBuild = (slug) => BUILDS.find((b) => b.slug === slug)
