'use client'

import Navigation from '../../components/Navigation'

export default function OverviewPage() {
  const components = [
    { name: 'Navigation', path: 'components/Navigation.js', description: 'Main navigation with mobile menu support' },
    { name: 'IntroSection', path: 'components/IntroSection.js', description: 'Introduction section with bio text' },
    { name: 'ProjectCarousel', path: 'components/ProjectCarousel.js', description: 'Interactive project carousel with image/video support' },
    { name: 'TestimonialsSection', path: 'components/TestimonialsSection.js', description: 'Testimonials grid display' },
    { name: 'Footer', path: 'components/Footer.js', description: 'Footer with scroll-to-top button' },
    { name: 'Hero', path: 'components/Hero.js', description: 'Hero section component' },
    { name: 'Typewriter', path: 'components/Typewriter.js', description: 'Typewriter effect component' },
    { name: 'WallOfSoundNavigation', path: 'components/WallOfSoundNavigation.js', description: 'Navigation for Wall of Sound section' },
  ]

  const wallOfSoundComponents = [
    { name: 'MusicWall', path: 'app/wall-of-sound/components/MusicWall.js', description: 'Main music wall display component' },
    { name: 'AlbumCard', path: 'app/wall-of-sound/components/AlbumCard.js', description: 'Individual album/track card component' },
    { name: 'Player', path: 'app/wall-of-sound/components/Player.js', description: 'Music player component' },
    { name: 'AddTrackModal', path: 'app/wall-of-sound/components/AddTrackModal.js', description: 'Modal for adding new tracks' },
  ]

  const pages = [
    { path: '/', name: 'Home', description: 'Main portfolio page with project carousels' },
    { path: '/play', name: 'Play', description: 'Collection of vibe-coded projects' },
    { path: '/play/vibe-coding-setup', name: 'Vibe Coding Setup', description: 'Tutorial page for setting up development environment' },
    { path: '/wall-of-sound', name: 'Wall of Sound', description: 'Music wall application with Spotify integration' },
    { path: '/wall-of-sound/login', name: 'Wall of Sound Login', description: 'Login page for Wall of Sound' },
  ]

  const techStack = {
    framework: [
      { name: 'Next.js', version: '14.0.0', description: 'React framework for production', category: 'Framework' },
      { name: 'React', version: '^18', description: 'UI library', category: 'Framework' },
      { name: 'React DOM', version: '^18', description: 'React DOM renderer', category: 'Framework' },
    ],
    styling: [
      { name: 'Tailwind CSS', version: '^3.3.0', description: 'Utility-first CSS framework', category: 'Styling' },
      { name: 'PostCSS', version: '^8', description: 'CSS post-processor', category: 'Styling' },
      { name: 'Autoprefixer', version: '^10.0.1', description: 'CSS vendor prefixer', category: 'Styling' },
    ],
    database: [
      { name: 'Supabase', version: '^2.58.0', description: 'Backend-as-a-Service for database and auth', category: 'Database' },
    ],
    icons: [
      { name: 'Lucide React', version: '^0.544.0', description: 'Icon library', category: 'Icons' },
    ],
    dev: [
      { name: 'TypeScript', version: '5.9.3', description: 'Type-safe JavaScript', category: 'Development' },
      { name: '@types/node', version: '24.6.2', description: 'TypeScript types for Node.js', category: 'Development' },
      { name: '@types/react', version: '19.2.0', description: 'TypeScript types for React', category: 'Development' },
      { name: 'baseline-browser-mapping', version: '^2.9.14', description: 'Browser compatibility mapping', category: 'Development' },
    ],
  }

  const colors = {
    main: [
      { name: 'Background Green', hex: '#435938', usage: 'Primary background color for main portfolio pages' },
      { name: 'Text White', hex: '#FAFAFA', usage: 'Primary text color on dark backgrounds' },
      { name: 'White', hex: '#FFFFFF', usage: 'Pure white for cards and backgrounds' },
      { name: 'Black', hex: '#000000', usage: 'Pure black for text and accents' },
    ],
    wallOfSound: [
      { name: 'Background Pink', hex: '#FFDAD9', usage: 'Primary background for Wall of Sound section' },
      { name: 'Text Dark', hex: '#2D1F0F', usage: 'Dark brown text color' },
      { name: 'Text Secondary', hex: '#1E2939', usage: 'Secondary dark text' },
      { name: 'Text Dark Alt', hex: '#1e1e1e', usage: 'Alternative dark text color' },
      { name: 'Shelf Top', hex: '#8B7355', usage: 'Top shelf color for album display' },
      { name: 'Shelf Bottom', hex: '#6B5644', usage: 'Bottom shelf color' },
      { name: 'Shelf Mid', hex: '#A0826D', usage: 'Middle shelf color' },
    ],
    play: [
      { name: 'Hero Yellow', hex: '#ebac1e', usage: 'Hero section background (unused component)' },
    ],
    vibeCoding: [
      { name: 'Light BG Primary', hex: '#ffffff', usage: 'Light mode background' },
      { name: 'Light BG Secondary', hex: '#f8f9fa', usage: 'Light mode secondary background' },
      { name: 'Light Text Primary', hex: '#1a1a1a', usage: 'Light mode primary text' },
      { name: 'Light Text Secondary', hex: '#666666', usage: 'Light mode secondary text' },
      { name: 'Light Accent', hex: '#5e6ad2', usage: 'Light mode accent color' },
      { name: 'Dark BG Primary', hex: '#0d1117', usage: 'Dark mode background' },
      { name: 'Dark BG Secondary', hex: '#161b22', usage: 'Dark mode secondary background' },
      { name: 'Dark Text Primary', hex: '#c9d1d9', usage: 'Dark mode primary text' },
      { name: 'Dark Accent', hex: '#58a6ff', usage: 'Dark mode accent color' },
    ],
  }

  const typefaces = [
    { 
      name: 'Mondwest', 
      source: 'Local font file (/fonts/Mondwest-Regular.woff2)', 
      usage: 'Display font for headings and titles',
      weights: ['normal (400)'],
      examples: ['Project titles (31px)', 'Section headings (31px)', 'Counters (31px)']
    },
    { 
      name: 'Haas Grot Disp', 
      source: 'Local font file (/fonts/HaasGrotDisp-55Roman.otf)', 
      usage: 'Body text and navigation',
      weights: ['normal (400)'],
      examples: ['Body text (13.4px, 16px, 19.4px)', 'Navigation links (16px)', 'Descriptions (13.4px)']
    },
    { 
      name: 'Inter', 
      source: 'Google Fonts', 
      usage: 'Secondary text and labels',
      weights: ['400', '500', '600', '700'],
      examples: ['Name labels (16px)', 'Small text']
    },
    { 
      name: 'Geist', 
      source: 'Google Fonts', 
      usage: 'Wall of Sound section typography',
      weights: ['400', '500', '600', '700', '800', '900'],
      examples: ['Wall of Sound UI elements']
    },
  ]

  const typeScale = [
    { size: '31px', lineHeight: '1.2', tracking: '0.31px', usage: 'Project titles, section headings (Mondwest)' },
    { size: '20px', lineHeight: '1.2', tracking: '0.31px', usage: 'Mobile intro text (Mondwest)' },
    { size: '19.4px', lineHeight: '1.2', tracking: '0.167px', usage: 'Large body text (Haas Grot Disp)' },
    { size: '16px', lineHeight: '1.4', tracking: '0.16px', usage: 'Navigation, footer text (Haas Grot Disp, Inter)' },
    { size: '14px', lineHeight: '1.2', tracking: '0.167px', usage: 'Testimonial text (Haas Grot Disp)' },
    { size: '13.4px', lineHeight: '16.44px', tracking: '0.167px', usage: 'Project descriptions, body copy (Haas Grot Disp)' },
    { size: '13px', lineHeight: '18.20px', tracking: '0.13px', usage: 'Play page dates (Haas Grot Disp)' },
  ]

  const projects = [
    {
      title: 'Novo',
      description: 'Novo is a financial platform for small businesses, offering banking features and AI-powered bookkeeping. Despite a brand refresh, their site lacked engagement and clarity. Partnering with →Dawn and →Work Is Play, we redesigned 10 pages, created 50+ illustrations, and built a mini design system in 7 weeks.',
    },
    {
      title: 'Lineage',
      description: 'Lineage is a boutique consultancy turning brands into cultural icons with over 20 years of experience. They came to Work is Play to craft a site that signals a major shift from agency to methodology. Partnering with Dawn, we built a complete design system, 4 interactive Next.js + WebGL pages, and 40+ CMS templates.',
    },
    {
      title: 'Prism',
      description: 'Clockwise reinvented scheduling with Prism, an AI-powered calendar you talk with. Need to clear your day or meet the CEO? Just ask. Over 2 months we launched an ambitious campaign including a 3D animated video with our friends at →Yatta, and a slew of marketing surfaces: social, paid media, email, 4 pages, blog posts and in-product flows.',
    },
    {
      title: 'Clockwise Rebrand',
      description: 'Clockwise grew from a Chrome extension into a must-have productivity tool—but the brand was stuck in the past. I led a full identity refresh: a scalable identity, 40+ redesigned pages, 20+ product surfaces—all in 3 months. The result? A brand as seamless and intuitive as the product itself.',
    },
    {
      title: 'Growlers',
      description: 'Friend projects are the best projects. That\'s why I was thrilled to help my friend Mickey — Coach Mickey — build up a identity for Chill N Fill\'s softball team. With →Lael Tyler and →Linh Triu, and inspired by the bar\'s growler-fill roots, we created Juggy the mascot, an anthropomorphic jug ready for catch.',
    },
    {
      title: 'Zapier',
      description: 'At Zapier, I built the brand design team from 0 to 1, creating scalable design systems across email, social, and web while driving brand advocacy and education. Highlights include collaborating with Instrument on a rebrand, partnering with Hobbes on a motion toolkit, and leading an in-house rebrand that later aligned with the official launch.',
    },
    {
      title: 'Scheduling Links',
      description: 'Group scheduling is a nightmare—group emails, Doodle polls, and so much back and forth. But Clockwise Links makes it effortless. We teamed up with →Third Coast Films to produce 15, 30, and 60-second paid media spots, handling everything from scriptwriting to remote art direction. Fast, scrappy, and no wasted motion—just like the product itself.',
    },
  ]

  const playProjects = [
    {
      name: 'Campsite Reporter',
      description: 'Making the process of reporting a campsite easier (hopefully). A simple form-based tool that helps campers document and share campsite conditions, availability, and amenities with the community.',
      date: '2024.12.10',
      tags: ['HTML/CSS', 'Claude', 'Portland'],
    },
    {
      name: 'Vacation planner',
      description: 'Interactive travel planning tool with destination cards, cost breakdowns, detailed itineraries, and comparison mode. Helps travelers organize trips, compare options, and visualize their journey from start to finish.',
      date: '2024.11.15',
      tags: ['HTML/CSS', 'Travel'],
    },
    {
      name: 'Mouse repel',
      description: 'Photos and message pills that subtly move away from your cursor while maintaining collective drift movement. An interactive experience that creates organic, fluid motion as users explore the interface.',
      date: '2024.10.20',
      tags: ['HTML/CSS', 'JavaScript'],
    },
    {
      name: 'Get yer first pull-up',
      description: 'He owns two pull up bars. Isn\'t time he can do a pull up? Let\'s find out. A progressive training guide with video demonstrations, workout tracking, and personalized routines to build strength.',
      date: '2024.09.05',
      tags: ['React', 'JavaScript'],
    },
    {
      name: 'Ocean views',
      description: 'Tried to create a page of randomized ocean views by using publicly-available web cams but....no dice. An experimental interface exploring live feeds and ambient visual experiences for relaxation.',
      date: '2024.08.12',
      tags: ['HTML/CSS', 'JavaScript'],
    },
    {
      name: 'Sourdough Reference Guide',
      description: 'Complete guide to baking sourdough weekly at home. Includes recipes, starter maintenance, glossary, troubleshooting, FAQ, and equipment recommendations. Everything you need to master the art of sourdough.',
      date: '2024.07.22',
      tags: ['React', 'Food'],
    },
    {
      name: 'Vibe Coding Setup',
      description: 'Complete guide to setting up your environment for vibe coding with Figma designs, Cursor, GitHub, Vercel, and Supabase. Step-by-step instructions to create a seamless workflow from design to deployment.',
      date: '2024.06.30',
      tags: ['Tutorial', 'Next.js'],
    },
  ]

  return (
    <div className="bg-[#435938] min-h-screen">
      <Navigation />
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] py-[60px]">
        <h1 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[60px]">
          Portfolio Overview
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px]">
          {/* Left Column */}
          <div className="flex flex-col gap-[60px]">
            {/* Components */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Components
              </h2>
              <div className="flex flex-col gap-[20px]">
                <div>
                  <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA] mb-[12px] font-medium">
                    Main Components
                  </h3>
                  <div className="flex flex-col gap-[12px]">
                    {components.map((comp, i) => (
                      <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] mb-[4px]">
                          <span className="font-medium">{comp.name}</span> — {comp.path}
                        </p>
                        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                          {comp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA] mb-[12px] font-medium">
                    Wall of Sound Components
                  </h3>
                  <div className="flex flex-col gap-[12px]">
                    {wallOfSoundComponents.map((comp, i) => (
                      <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] mb-[4px]">
                          <span className="font-medium">{comp.name}</span> — {comp.path}
                        </p>
                        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                          {comp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Pages */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Pages
              </h2>
              <div className="flex flex-col gap-[12px]">
                {pages.map((page, i) => (
                  <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] mb-[4px]">
                      <span className="font-medium">{page.name}</span> — <code className="text-[12px]">{page.path}</code>
                    </p>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                      {page.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech Stack */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Tech Stack
              </h2>
              <div className="flex flex-col gap-[20px]">
                {Object.entries(techStack).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA] mb-[12px] font-medium">
                      {items[0].category}
                    </h3>
                    <div className="flex flex-col gap-[12px]">
                      {items.map((item, i) => (
                        <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] mb-[4px]">
                            <span className="font-medium">{item.name}</span> {item.version && <span className="text-[#FAFAFA]/70">({item.version})</span>}
                          </p>
                          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech Stack Relationships */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Tech Stack Relationships
              </h2>
              <div className="bg-white/5 p-[16px] rounded-[8px]">
                <div className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] space-y-[12px]">
                  <p>
                    <strong>Next.js</strong> serves as the React framework, providing server-side rendering, routing, and API routes. It integrates with <strong>React</strong> and <strong>React DOM</strong> for component rendering.
                  </p>
                  <p>
                    <strong>Tailwind CSS</strong> handles styling through utility classes, processed by <strong>PostCSS</strong> and <strong>Autoprefixer</strong> for browser compatibility.
                  </p>
                  <p>
                    <strong>Supabase</strong> provides backend services (database, authentication) for the Wall of Sound feature, accessed via API routes in Next.js.
                  </p>
                  <p>
                    <strong>TypeScript</strong> adds type safety across the codebase, with type definitions from <strong>@types/node</strong> and <strong>@types/react</strong>.
                  </p>
                  <p>
                    <strong>Lucide React</strong> supplies icon components used throughout the UI.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-[60px]">
            {/* Colors */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Colors
              </h2>
              <div className="flex flex-col gap-[20px]">
                {Object.entries(colors).map(([category, colorList]) => (
                  <div key={category}>
                    <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA] mb-[12px] font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="flex flex-col gap-[12px]">
                      {colorList.map((color, i) => (
                        <div key={i} className="bg-white/5 p-[16px] rounded-[8px] flex items-center gap-[12px]">
                          <div 
                            className="w-[40px] h-[40px] rounded-[4px] border border-white/20 flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex-1">
                            <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] mb-[4px]">
                              <span className="font-medium">{color.name}</span> — <code className="text-[12px]">{color.hex}</code>
                            </p>
                            <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                              {color.usage}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Typefaces */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Typefaces
              </h2>
              <div className="flex flex-col gap-[12px]">
                {typefaces.map((typeface, i) => (
                  <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] mb-[4px]">
                      <span className="font-medium">{typeface.name}</span>
                    </p>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px] mb-[8px]">
                      {typeface.source}
                    </p>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px] mb-[4px]">
                      <strong className="text-[#FAFAFA]">Usage:</strong> {typeface.usage}
                    </p>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px] mb-[4px]">
                      <strong className="text-[#FAFAFA]">Weights:</strong> {typeface.weights.join(', ')}
                    </p>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                      <strong className="text-[#FAFAFA]">Examples:</strong> {typeface.examples.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Type Scale */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Type Scale
              </h2>
              <div className="flex flex-col gap-[12px]">
                {typeScale.map((scale, i) => (
                  <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA] leading-[16.44px] mb-[4px]">
                      <span className="font-medium">{scale.size}</span> / Line-height: {scale.lineHeight} / Tracking: {scale.tracking}
                    </p>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                      {scale.usage}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[30px]">
                Projects
              </h2>
              <div className="flex flex-col gap-[20px]">
                <div>
                  <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA] mb-[12px] font-medium">
                    Main Portfolio Projects
                  </h3>
                  <div className="flex flex-col gap-[12px]">
                    {projects.map((project, i) => (
                      <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                        <p className="font-['Mondwest',_sans-serif] text-[20px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[8px]">
                          {project.title}
                        </p>
                        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA] mb-[12px] font-medium">
                    Play Projects
                  </h3>
                  <div className="flex flex-col gap-[12px]">
                    {playProjects.map((project, i) => (
                      <div key={i} className="bg-white/5 p-[16px] rounded-[8px]">
                        <p className="font-['Mondwest',_sans-serif] text-[20px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] mb-[4px]">
                          {project.name}
                        </p>
                        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[12px] text-[#FAFAFA]/60 leading-[16.44px] mb-[8px]">
                          {project.date} • {project.tags.join(', ')}
                        </p>
                        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] text-[#FAFAFA]/70 leading-[16.44px]">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
