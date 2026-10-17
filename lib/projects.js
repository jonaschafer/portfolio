// Single source for /work. Grid view shows every image from projects that
// have `images`; list view shows every row, and rows with `soon: true` (no
// page or images yet) render greyed out, Aino-style. Any `images`
// entry that isn't a media filename is a shot description; WorkMedia renders
// it as a labeled card until the real file goes in `folder`.

const ext = (href, label) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="hl">
    {label}
  </a>
)

export const PROJECTS = [
  { slug: 'dojo-rebrand', title: 'Dojo rebrand', role: 'Head of Brand', org: 'ClassDojo', year: '2025–26', folder: '01 Dojo Rebrand',
    // Shot descriptions render as placeholder slides until real files land.
    description:
      "ClassDojo reaches 50 million families across an astounding 180 countries (!), but its brand identity had grown in silos rather than as a cohesive system. I pitched and led a rebrand with no budget: new architecture, new identities including logos, characters, and design systems for four products. Best of all? A completely rethought marketing site with over 70 pages on a new tech stack.",
    images: [
      'New homepage: hero and key blocks, desktop and/or mobile.',
      'Global nav and footer: desktop, showing all products as one family.',
      'Tutor: Nova character, color system, and/or key landing page.',
      'Dojo Sparks: logo and product or web frame showing distinct expression.',
      'Dojo Islands: product or web frame showing its expression within the system.',
      'ClassDojo for districts: landing page or deck frame showing restrained, pro tone.',
      'Design system: type scale, color, and 2-3 components showing scale and reusability.',
      'Tone framework: audience/product/medium (playful vs. professional).',
    ],
  },
  { slug: 'bts-2026', title: 'Back to school 2026', role: 'Head of Brand', org: 'ClassDojo', year: '2026', folder: '09 BTS 2026',
    // Shot descriptions render as placeholder slides until real files land.
    partners: [{ name: 'Peter Skov Nielsen', href: 'https://www.linkedin.com/in/peterskovnielsen/' }],
    description:
      "Back-to-school is ClassDojo's highest-stakes period, but the previous year's campaign had flatlined. For the 2026 campaign, I unified the narrative and visual system across email, web, video, push, and in-app, reaching 193K school leaders. A central 60-second spot—directed by Peter Skov—tied the entire ecosystem together.",
    images: [
      'bts-2026-loop.mp4',
      'bts-2026-hero.webp',
      'bts-2026-families.mp4',
      'bts-2026-emails.mp4',
      'bts-2026-canva.mp4',
      'bts-2026-teachers.mp4',
      'bts-2026-school-leaders.mp4',
      'bts-2026-floats.mp4',
      'bts-2026-newsletters.mp4',
      'bts-2026-messaging.mp4',
      'bts-2026-older-students.mp4',
    ],
  },
  { slug: 'tutor-group-classes', title: 'Tutor group classes', role: 'Creative lead', org: 'ClassDojo', year: '2026', folder: '10 Tutor Group Classes',
    // Shot descriptions render as placeholder slides until real files land.
    description:
      "Dojo Tutor only offered 1:1 sessions at $30-39, pricing out families. Group classes at $10 opened it up, and I led creative for the launch—the first major test of Tutor’s new identity. I flexed the brand across landing pages, ads, email, push, and in-app, building a custom thumbnail system that stayed on-brand while dodging AI slop. Weekly sessions grew from 50 to 460 in two months.",
    images: [
      'tutor-stickers.mp4',
      'tutor-lp1.mp4',
      'tutor-lp2.mp4',
      'tutor-cards-compare.png',
      'tutor-classcards.mp4',
      'tutor-subjects.png',
      'tutor-card-grid.png',
      'tutor-ads.webp',
      'tutor-thumbs.png',
      'tutor-modal.png',
    ],
  },
  {
    slug: 'novo',
    title: 'Novo',
    role: 'Creative Director',
    org: 'Work is Play',
    year: '2024',
    partners: [
      { name: 'Dawn', href: 'https://dawn.la/' },
      { name: 'Work is Play', href: 'https://workisplay.studio/' },
    ],
    folder: '02 Novo',
    images: ['novo-stina-compressed.mp4', 'novo-1.png', 'novo-2.png', 'novo-3.png', 'novo-4.png', 'novo-5.png', 'novo-6.png', 'novo-7.png', 'novo-8.png'],
    description: (
      <>
        Novo gives small businesses banking and AI bookkeeping. A brand refresh had landed, but the site still wasn&apos;t pulling its weight. With {ext('https://dawn.la/', 'Dawn')} and {ext('https://workisplay.studio/', 'Work is Play')}, we redesigned 10 pages, drew 50+ illustrations, and built a mini design system in 7 weeks.
      </>
    ),
  },
  {
    slug: 'lineage',
    title: 'Lineage',
    role: 'Creative Director',
    org: 'Work is Play',
    year: '2024–25',
    partners: [{ name: 'Dawn', href: 'https://dawn.la/' }],
    folder: '03 Lineage',
    images: ['lineage-reel.mp4', 'lineage-7.gif', 'lineage-1.png', 'lineage-2.png', 'lineage-3.png', 'lineage-4.png', 'lineage-5.png', 'lineage-6.png', 'lineage-8.png', 'lineage-9.png'],
    description: (
      <>
        Lineage has spent 20 years turning brands into cultural icons, and it wanted a site that showed its move from agency to methodology. With {ext('https://dawn.la/', 'Dawn')}, we built the design system, 4 interactive Next.js and WebGL pages, and 40+ CMS templates.
      </>
    ),
  },
  {
    slug: 'prism',
    title: 'Prism',
    role: 'Lead Brand Designer',
    org: 'Clockwise',
    year: '2024',
    partners: [{ name: 'Yatta', href: 'https://yatta.studio/' }],
    folder: '04 Prism',
    images: ['prism-9.mp4', 'prism-10-yatta.mp4', 'prism-1.png', 'prism-2.png', 'prism-3.png', 'prism-4.png', 'prism-5.png', 'prism-6.png', 'prism-7.png', 'prism-8.png'],
    description: (
      <>
        Prism is the Clockwise calendar you talk to. Ask it to clear your day and it does. We launched it in 2 months with a 3D film made with {ext('https://yatta.studio/', 'Yatta')}, plus social, paid, email, 4 pages, blog posts, and in-product flows.
      </>
    ),
  },
  {
    slug: 'clockwise-rebrand',
    title: 'Clockwise rebrand',
    role: 'Lead Brand Designer',
    org: 'Clockwise',
    year: '2022',
    folder: '05 Clockwise Rebrand',
    images: ['cw-rebrand-14.gif', 'cw-rebrand-5.gif', 'cw-rebrand-1.png', 'cw-rebrand-2.png', 'cw-rebrand-3.png', 'cw-rebrand-4.png', 'cw-rebrand-6.png', 'cw-rebrand-7.png', 'cw-rebrand-8.png', 'cw-rebrand-9.png', 'cw-rebrand-10.png', 'cw-rebrand-11.png', 'cw-rebrand-12.png', 'cw-rebrand-13.png'],
    description:
      'Clockwise had grown from a Chrome extension into a productivity tool people depended on, and the brand hadn’t kept up. I led the refresh: a new identity, 40+ pages, and 20+ product surfaces in 3 months.',
  },
  {
    slug: 'scheduling-links',
    title: 'Scheduling Links',
    role: 'Lead Brand Designer',
    org: 'Clockwise',
    year: '2022',
    partners: [{ name: 'Third Coast Films', href: 'https://www.thirdcoastfilms.com/' }],
    folder: '08 Scheduling Links',
    images: ['links-8.gif', 'links-6.gif', 'links-1.png', 'links-2.png', 'links-3.png', 'links-4.png', 'links-5.png', 'links-7.png'],
    description: (
      <>
        Group scheduling usually means reply-all threads and Doodle polls. Clockwise Links skips all that. With {ext('https://www.thirdcoastfilms.com/', 'Third Coast Films')}, we made 15, 30, and 60-second paid spots, and I handled everything from the scripts to remote art direction.
      </>
    ),
  },
  {
    slug: 'growlers',
    title: 'Growlers',
    role: 'Designer',
    org: 'Friend project',
    year: '2023',
    partners: [
      { name: 'Lael Tyler', href: 'https://castironcoding.com/' },
      { name: 'Linh Triu', href: 'https://www.trieuberry.com/' },
    ],
    folder: '06 Growlers',
    images: ['all sketches.gif', 'growlers-1.png', 'growlers-2.png', 'growlers-3.png', 'growlers-4.png', 'growlers-5.png'],
    description: (
      <>
        Friend projects are the best projects. Coach Mickey needed an identity for Chill N Fill&apos;s softball team, so {ext('https://castironcoding.com/', 'Lael Tyler')}, {ext('https://www.trieuberry.com/', 'Linh Triu')} and I made Juggy, a growler with arms, ready for catch.
      </>
    ),
  },
  {
    slug: 'zapier',
    title: 'Zapier',
    role: 'Founding Brand Designer',
    org: 'Zapier',
    year: '2017–21',
    partners: [
      { name: 'Instrument', href: 'https://www.instrument.com/' },
      { name: 'Hobbes', href: null },
    ],
    folder: '07 Zapier',
    images: ['zapier-1.png', 'zapier-2.png', 'zapier-3.png', 'zapier-4.png', 'zapier-5.png', 'zapier-6.png', 'zapier-7.png', 'zapier-8.png', 'zapier-9.png', 'zapier-10.png'],
    description:
      'I joined Zapier as its first brand designer and built the brand team from there, with systems for email, social, and web. Along the way I worked with Instrument on a rebrand, with Hobbes on a motion toolkit, and led the in-house rebrand that fed the official launch.',
  },
  { slug: 'nike', title: 'Nike', role: 'Art Director', org: 'AKQA', year: '2015', soon: true },
  { slug: 'xbox-surface', title: 'Xbox and Surface', role: 'Art Director', org: 'Razorfish', year: '2012–14', soon: true },
]

export const WITH_PAGES = PROJECTS.filter((p) => !p.soon && p.images?.length)

// A shot description stands in for any file that isn't real media yet.
export const isPlaceholder = (file) => !/\.(png|jpe?g|gif|webp|mp4)$/i.test(file)
export const mediaSrc = (project, file) => encodeURI(`/images/${project.folder}/${file}`)
export const isVideo = (file) => file.toLowerCase().endsWith('.mp4')
export const isGif = (file) => file.toLowerCase().endsWith('.gif')
