'use client'

import Link from 'next/link'

const projects = [
  {
    id: 'music-blog',
    name: 'Sounds',
    description: 'A music blog. YouTube audio playback with links to Spotify, Apple Music, Tidal. Brutalist design, random colors on hover.',
    date: '2026.02.05',
    type: 'MUSIC',
    tags: ['React', 'Next.js'],
    path: '/play/music-blog'
  },
  {
    id: 'spina',
    name: 'Spina',
    description: 'Helping a friend with her illustration side hustle. A straightforward guide for selling art online without being tech savvy.',
    date: '2026.01.24',
    type: 'HTML/CSS',
    tags: ['HTML/CSS'],
    path: '/play/prototypes/spina'
  },
  {
    id: 'vibe-coding-setup',
    name: 'Vibes',
    description: 'Complete guide to setting up your environment for vibe coding with Figma designs, Cursor, GitHub, Vercel, and Supabase. Step-by-step instructions to create a seamless workflow from design to deployment.',
    date: '2026.01.15',
    type: 'TUTORIAL',
    tags: ['Tutorial', 'Next.js'],
    path: '/play/vibe-coding-setup'
  },
  {
    id: 'sourdough',
    name: 'Sourdough',
    description: 'Complete guide to baking sourdough weekly at home. Includes recipes, starter maintenance, glossary, troubleshooting, FAQ, and equipment recommendations. Everything you need to master the art of sourdough.',
    date: '2025.11.15',
    type: 'REACT',
    tags: ['React', 'Food'],
    path: '/play/prototypes/sourdough'
  },
  {
    id: 'campsite-reporter',
    name: 'Campsite Reporter',
    description: 'Making the process of reporting a campsite easier (hopefully). A simple form-based tool that helps campers document and share campsite conditions, availability, and amenities with the community.',
    date: '2025.12.10',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'Claude', 'Portland'],
    path: '/play/prototypes/campsite-reporter'
  },
  {
    id: 'vacation-planner',
    name: 'Vacation planner',
    description: 'Interactive travel planning tool with destination cards, cost breakdowns, detailed itineraries, and comparison mode. Helps travelers organize trips, compare options, and visualize their journey from start to finish.',
    date: '2025.11.15',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'Travel'],
    path: '/play/prototypes/vacation-planner'
  },
  {
    id: 'mouse-repel',
    name: 'Mouse repel',
    description: 'Photos and message pills that subtly move away from your cursor while maintaining collective drift movement. An interactive experience that creates organic, fluid motion as users explore the interface.',
    date: '2025.10.20',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'JavaScript'],
    path: '/play/prototypes/mouse-repel'
  },
  {
    id: 'pull-ups',
    name: 'Get yer first pull-up',
    description: 'He owns two pull up bars. Isn\'t time he can do a pull up? Let\'s find out. A progressive training guide with video demonstrations, workout tracking, and personalized routines to build strength.',
    date: '2025.09.05',
    type: 'REACT',
    tags: ['React', 'JavaScript'],
    path: '/play/prototypes/pull-ups/v2'
  },
  {
    id: 'ocean-viewer',
    name: 'Ocean views',
    description: 'Tried to create a page of randomized ocean views by using publicly-available web cams but....no dice. An experimental interface exploring live feeds and ambient visual experiences for relaxation.',
    date: '2025.08.12',
    type: 'YOUTUBE',
    tags: ['HTML/CSS', 'JavaScript'],
    path: '/play/prototypes/ocean-viewer'
  }
]

// Helper function to format date from YYYY.MM.DD to "Month YYYY"
function formatDate(dateString) {
  const [year, month] = dateString.split('.')
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

export default function PlayPage() {

  return (
    <div className="font-mono bg-white text-black min-h-screen text-[13px] leading-[1.6]">
      {/* Headline Block */}
      <div className="bg-white w-full">
        <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[60px] pb-[40px]">
          <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
            <p className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] lg:text-[31px] text-black leading-[1.2] tracking-[0.31px] max-w-[335px] md:max-w-[648px] lg:max-w-[747px] whitespace-pre-wrap">
              A small, growing collection of vibed coded projects just 'cause.{' '}
              <span>👉 </span>
              <a 
                className="[text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer decoration-solid underline hover:opacity-80 transition-opacity"
                href="https://github.com/jonaschafer"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
              <span> if'n you're curious.</span>
            </p>
          </div>
        </section>
      </div>

      <div className="min-h-screen max-w-[1440px] mx-auto">
        {/* Content */}
        <div className="pt-5 pb-5 md:pt-8 md:pb-8 px-5 md:px-[60px] lg:px-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => {
              // Extract tech stack from tags (HTML/CSS, JavaScript, React, Next.js, Claude)
              const techStack = project.tags.filter(tag => 
                ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'Claude'].includes(tag)
              )
              
              return (
                <Link
                  key={project.id}
                  href={project.path}
                  className="flex flex-col gap-[28px] text-inherit no-underline transition-opacity hover:opacity-80"
                >
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex flex-col gap-[8px] pb-[10px]">
                      <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-black leading-[37.20px] tracking-[0.31px]">
                        {project.name}
                      </h2>
                      <div className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] leading-[18.20px] tracking-[0.13px] text-black/70">
                        {formatDate(project.date)}
                      </div>
                    </div>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] text-black tracking-[0.17px]">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Tech Stack Bubbles */}
                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {techStack.map((tech, index) => (
                        <div
                          key={index}
                          className="px-[10px] py-[4px] rounded-[4px] border border-black/70 text-[13px] font-['Haas_Grot_Disp',_sans-serif] leading-[18.20px] tracking-[0.13px] text-black/70 bg-white inline-flex items-center justify-center h-fit"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
