// Single source for /work. Grid view shows every image from projects that
// have `images`; list view shows every row, and rows with `soon: true` (no
// page or images yet) render greyed out, Aino-style. Years marked TODO are
// best guesses from the bio dates; confirm before shipping.

const ext = (href, label) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
    {label}
  </a>
)

export const PROJECTS = [
  { slug: 'dojo-rebrand', title: 'Dojo rebrand', role: 'ClassDojo, Head of Brand', year: '2025–26', soon: true,
    // Draft copy and shot list, moved from the old /work carousels.
    draftDescription:
      "ClassDojo reaches 50 million families in 180 countries, but its brand had grown up product by product: some robust, some with almost nothing. I pitched and led the brand strategy, rebrand, and site overhaul without a budget. That meant new logos, characters, and color systems for four products, an endorsed-brand model that put all six under one foundation, and 76 pages rebuilt from a system of reusable blocks. The site has shipped page by page since April 2026, and when engineering got stretched I moved into the code myself, using AI tools to QA, fix, and deploy pages. After relaunch, time on the Sparks and Plus pages rose 36% and 42%, against 6% across the site.",
    shotList: [
      'New homepage — hero and key blocks, desktop and/or mobile.',
      'Global nav and footer — desktop, showing all products as one family.',
      'Tutor — Nova character, color system, and/or key landing page.',
      'Dojo Sparks — logo and product or web frame showing distinct expression.',
      'Dojo Islands — product or web frame showing its expression within the system.',
      'ClassDojo for districts — landing page or deck frame showing restrained, pro tone.',
      'Design system — type scale, color, and 2–3 components showing scale and reusability.',
      'Tone framework — audience/product/medium (playful vs. professional).',
    ],
  },
  { slug: 'bts-2026', title: 'Back to school 2026', role: 'ClassDojo, Head of Brand', year: '2026', soon: true,
    // Draft copy and shot list, moved from the old /work carousels.
    draftDescription:
      "Back to school 2025 leaned on emotional storytelling and the lift came in flat. For 2026 I set the campaign identity and creative direction: one visual system and one story across email, web, video, push, in-app, LinkedIn, and sales enablement, reaching 193K school leaders. With Lorna's team running the sends, emails opened at 39-42% against a 30-34% norm, click-to-open doubled, and schoolwide decisions rose 48% year over year. On the refreshed school leaders page, bounce fell 10 points and the average visit went from 80 to 118 seconds, while the rest of the site held flat.",
    shotList: [
      'Hero video, 60s, made with Peter Skov Nielsen. Autoplay loop of the strongest 6-8 seconds: gradient, simplified UI, feature moments.',
      'The campaign system on one board: gradient treatment, simplified product UI, textured photography, and type.',
      '/school-leaders landing page. Hero plus 2-3 key blocks on desktop, with a mobile frame alongside.',
      'Email grid: 6-8 of the 47 sends side by side, one template flexing across four school leader segments.',
      'One story everywhere school leaders touch us: in-app banner, launch modal, and push notification in a single composition.',
      'LinkedIn organic posts from ClassDojo and ClassDojo Districts, three up.',
      'Families landing page: hero plus the connect, learn, and play sections.',
      "Teacher What's New page and Mentor BTS kit, showing the system stretching to teachers.",
      'Results slide, typeset clean: 39-42% opens vs. a 30-34% norm, 2x click-to-open, +48% schoolwide decisions year over year.',
    ],
  },
  { slug: 'tutor-group-classes', title: 'Tutor group classes', role: 'ClassDojo, Creative lead', year: '2026', soon: true,
    // Draft copy and shot list, moved from the old /work carousels.
    draftDescription:
      "Dojo Tutor only offered 1:1 sessions at $30-39 a class, which priced out a lot of families. Group classes at $10 were the answer, and the launch was the first major campaign to put Tutor's new identity to work. Elizabeth Slavitt led the launch and I led the creative, starting with two landing pages that tested affordability against enrichment messaging, a class card aligned with the product, and a thumbnail generator the team kept using after launch. Weekly group sessions grew from about 50 to 460 in two months.",
    shotList: [
      'The two launch landing pages side by side: affordability (lp1) and enrichment (lp2).',
      "New Tutor identity in use: Nova, logo, and color on the group classes hero.",
      'Class card: the marketing card next to the in-product card, showing how they were aligned.',
      'Thumbnail generator output: a grid of 9-12 class thumbnails.',
      'Paid social: 3-4 Facebook and Instagram ads from the launch.',
      'Launch email to one of the six segments (e.g. churned subscribers), desktop and mobile.',
      'Sticker packs summer retention campaign.',
      'Growth slide: weekly group sessions from about 50 to 460, early April to early June 2026.',
    ],
  },
  {
    slug: 'novo',
    title: 'Novo',
    role: 'Work is Play, Creative Director',
    year: '2025', // TODO confirm
    folder: '02 Novo',
    images: ['novo-stina-compressed.mp4', 'novo-1.png', 'novo-2.png', 'novo-3.png', 'novo-4.png', 'novo-5.png', 'novo-6.png', 'novo-7.png', 'novo-8.png'],
    description: (
      <>
        Novo is a financial platform for small businesses, offering banking features and AI-powered bookkeeping. Despite a brand refresh, their site lacked engagement and clarity. Partnering with {ext('https://dawn.la/', 'Dawn')} and {ext('https://workisplay.studio/', 'Work Is Play')}, we redesigned 10 pages, created 50+ illustrations, and built a mini design system in 7 weeks.
      </>
    ),
  },
  {
    slug: 'lineage',
    title: 'Lineage',
    role: 'Work is Play, Creative Director',
    year: '2024', // TODO confirm
    folder: '03 Lineage',
    images: ['lineage-7.gif', 'lineage-1.png', 'lineage-2.png', 'lineage-3.png', 'lineage-4.png', 'lineage-5.png', 'lineage-6.png', 'lineage-8.png', 'lineage-9.png'],
    description: (
      <>
        Lineage is a boutique consultancy turning brands into cultural icons with over 20 years of experience. They came to Work is Play to craft a site that signals a major shift from agency to methodology. Partnering with {ext('https://dawn.la/', 'Dawn')}, we built a complete design system, 4 interactive Next.js + WebGL pages, and 40+ CMS templates.
      </>
    ),
  },
  {
    slug: 'prism',
    title: 'Prism',
    role: 'Clockwise, Lead Brand Designer',
    year: '2024', // TODO confirm
    folder: '04 Prism',
    images: ['prism-9.mp4', 'prism-10-yatta.mp4', 'prism-1.png', 'prism-2.png', 'prism-3.png', 'prism-4.png', 'prism-5.png', 'prism-6.png', 'prism-7.png', 'prism-8.png'],
    description: (
      <>
        Clockwise reinvented scheduling with Prism, an AI-powered calendar you talk with. Need to clear your day or meet the CEO? Just ask. Over 2 months we launched an ambitious campaign including a 3D animated video with our friends at {ext('https://yatta.studio/', 'Yatta')}, and a slew of marketing surfaces: social, paid media, email, 4 pages, blog posts and in-product flows.
      </>
    ),
  },
  {
    slug: 'clockwise-rebrand',
    title: 'Clockwise rebrand',
    role: 'Clockwise, Lead Brand Designer',
    year: '2023', // TODO confirm
    folder: '05 Clockwise Rebrand',
    images: ['cw-rebrand-14.gif', 'cw-rebrand-5.gif', 'cw-rebrand-1.png', 'cw-rebrand-2.png', 'cw-rebrand-3.png', 'cw-rebrand-4.png', 'cw-rebrand-6.png', 'cw-rebrand-7.png', 'cw-rebrand-8.png', 'cw-rebrand-9.png', 'cw-rebrand-10.png', 'cw-rebrand-11.png', 'cw-rebrand-12.png', 'cw-rebrand-13.png'],
    description:
      'Clockwise grew from a Chrome extension into a must-have productivity tool, but the brand was stuck in the past. I led a full identity refresh: a scalable identity, 40+ redesigned pages, and 20+ product surfaces, all in 3 months.',
  },
  {
    slug: 'scheduling-links',
    title: 'Scheduling Links',
    role: 'Clockwise, Lead Brand Designer',
    year: '2023', // TODO confirm
    folder: '08 Scheduling Links',
    images: ['links-8.gif', 'links-6.gif', 'links-1.png', 'links-2.png', 'links-3.png', 'links-4.png', 'links-5.png', 'links-7.png'],
    description: (
      <>
        Group scheduling is a nightmare of group emails, Doodle polls, and back and forth. Clockwise Links makes it effortless. We teamed up with {ext('https://www.thirdcoastfilms.com/', 'Third Coast Films')} to produce 15, 30, and 60-second paid media spots, handling everything from scriptwriting to remote art direction.
      </>
    ),
  },
  {
    slug: 'growlers',
    title: 'Growlers',
    role: 'Friend project',
    year: '2023', // TODO confirm
    folder: '06 Growlers',
    images: ['all sketches.gif', 'growlers-1.png', 'growlers-2.png', 'growlers-3.png', 'growlers-4.png', 'growlers-5.png'],
    description: (
      <>
        Friend projects are the best projects. I helped Coach Mickey build an identity for Chill N Fill&apos;s softball team. With {ext('https://castironcoding.com/', 'Lael Tyler')} and {ext('https://www.trieuberry.com/', 'Linh Triu')}, and inspired by the bar&apos;s growler-fill roots, we created Juggy the mascot, an anthropomorphic jug ready for catch.
      </>
    ),
  },
  {
    slug: 'zapier',
    title: 'Zapier',
    role: 'Zapier, Founding Brand Designer',
    year: '2017–21',
    folder: '07 Zapier',
    images: ['zapier-1.png', 'zapier-2.png', 'zapier-3.png', 'zapier-4.png', 'zapier-5.png', 'zapier-6.png', 'zapier-7.png', 'zapier-8.png', 'zapier-9.png', 'zapier-10.png'],
    description:
      'At Zapier, I built the brand design team from 0 to 1, creating scalable design systems across email, social, and web. Highlights include collaborating with Instrument on a rebrand, partnering with Hobbes on a motion toolkit, and leading an in-house rebrand that later aligned with the official launch.',
  },
  { slug: 'nike', title: 'Nike', role: 'AKQA, Art Director', year: '2015', soon: true },
  { slug: 'xbox-surface', title: 'Xbox and Surface', role: 'Razorfish, Art Director', year: '2012–14', soon: true },
]

export const mediaSrc = (project, file) => encodeURI(`/images/${project.folder}/${file}`)
export const isVideo = (file) => file.toLowerCase().endsWith('.mp4')
export const isGif = (file) => file.toLowerCase().endsWith('.gif')
