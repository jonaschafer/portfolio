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
    dek: 'The front door for ClassDojo’s brand team. An intake that coaches the brief, and a gallery of everything we’ve shipped.',
    card: 'The internal home for ClassDojo’s brand team: intake that coaches the brief as you write it, Asana and Slack handoff, guidelines, tools, and a gallery of the work.',
    date: '2026.01.21',
    tags: ['Next.js', 'Claude'],
    hero: { type: 'video', src: '/play/builds/brand-studio/gallery.mp4', poster: '/play/builds/brand-studio/gallery.jpg', alt: 'Scrolling the Brand Studio gallery' },
  },
  {
    slug: 'dojo-brief',
    name: 'Dojo brief',
    dek: 'Paste a messy Slack thread, get back a brief that drops straight into the intake form.',
    card: 'A Claude skill that turns Slack threads and half-notes into a structured creative brief, then hands the form a JSON file to import.',
    date: '2026.03.19',
    tags: ['Claude'],
    hero: { type: 'diagram', src: 'dojo-brief' },
  },
  {
    slug: 'tutor-thumbnails',
    name: 'Tutor thumbnails',
    dek: 'Describe a class, pick a house style, get a 16:9 illustration back.',
    card: 'A thumbnail generator for Dojo Tutor classes. Two illustration styles written up as prompt contracts, a stack of reference art, and Gemini doing the drawing.',
    date: '2026.04.07',
    tags: ['Next.js', 'Claude', 'Gemini'],
    hero: { type: 'image', src: '/play/builds/tutor-thumbnails/tool.jpg', alt: 'The Tutor thumbnail creator, with Iridescent, Risograph and Doodle styles' },
  },
  {
    slug: 'tutor-ads',
    name: 'Tutor ad builder',
    dek: 'Paid social for Dojo Tutor, laid out by the brand rules so nobody has to guess.',
    card: 'An art-director skill that generates the scene, and a builder that sets the real logo, type and button over it in twelve ad sizes.',
    date: '2026.09.09',
    tags: ['Next.js', 'Claude'],
    hero: { type: 'video', src: '/play/builds/tutor-ads/builder.mp4', poster: '/play/builds/tutor-ads/builder.jpg', alt: 'Clicking through the Tutor ad builder templates' },
  },
  {
    slug: 'brand-guidelines',
    name: 'Brand guidelines',
    dek: 'Seven Dojo brands, one set of guideline pages people actually open.',
    card: 'Living guideline pages for every Dojo brand. Strategy, logos, color, type, illustration and photo, with copyable values and a download kit.',
    date: '2026.04.27',
    tags: ['Next.js', 'Claude'],
    hero: { type: 'video', src: '/play/builds/brand-guidelines/scroll.mp4', poster: '/play/builds/brand-guidelines/scroll.jpg', alt: 'Scrolling the Dojo Tutor guidelines' },
  },
  {
    slug: 'homelab',
    name: 'Homelab',
    dek: 'A Mac mini that runs a private AI model and our media, set up by Claude over SSH.',
    card: 'A local LLM I can ask about my own files from my phone, plus Plex and audiobooks for the house. I plugged things in, Claude did the terminal work.',
    date: '2026.09.22',
    tags: ['Claude'],
    hero: { type: 'diagram', src: 'homelab' },
  },
  {
    slug: 'ascii',
    name: 'ASCII generator',
    dek: 'Drop in a photo, get it back as type or dots.',
    card: 'Turns any image into ASCII characters or a halftone dot pattern, right in the browser. Try it with your own photo.',
    date: '2025.09.26',
    tags: ['HTML/CSS', 'JavaScript'],
    hero: { type: 'iframe', src: '/play/prototypes/ascii/index.html', title: 'ASCII and dot pattern generator', height: 560 },
  },
]

export const BUILD_PATHS = BUILDS.map((b) => `/play/${b.slug}`)
export const getBuild = (slug) => BUILDS.find((b) => b.slug === slug)
