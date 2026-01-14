'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const projects = [
  {
    id: 'campsite-reporter',
    name: 'Campsite Reporter',
    description: 'Making the process of reporting a campsite easier (hopefully).',
    date: '2024.12.10',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'Claude', 'Portland'],
    path: '/play/prototypes/campsite-reporter'
  },
  {
    id: 'vacation-planner',
    name: 'Vacation planner',
    description: 'Interactive travel planning tool with destination cards, cost breakdowns, detailed itineraries, and comparison mode.',
    date: '2024.11.15',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'Travel'],
    path: '/play/prototypes/vacation-planner'
  },
  {
    id: 'mouse-repel',
    name: 'Mouse repel',
    description: 'Photos and message pills that subtly move away from your cursor while maintaining collective drift movement.',
    date: '2024.10.20',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'JavaScript'],
    path: '/play/prototypes/mouse-repel'
  },
  {
    id: 'pull-ups',
    name: 'Get yer first pull-up',
    description: 'He owns two pull up bars. Isn\'t time he can do a pull up? Let\'s find out.',
    date: '2024.09.05',
    type: 'REACT',
    tags: ['React', 'JavaScript'],
    path: '/play/prototypes/pull-ups/v2'
  },
  {
    id: 'ocean-viewer',
    name: 'Ocean views',
    description: 'Tried to create a page of randomized ocean views by using publicly-available web cams but....no dice.',
    date: '2024.08.12',
    type: 'YOUTUBE',
    tags: ['HTML/CSS', 'JavaScript'],
    path: '/play/prototypes/ocean-viewer'
  },
  {
    id: 'sourdough',
    name: 'Sourdough Reference Guide',
    description: 'Complete guide to baking sourdough weekly at home. Includes recipes, starter maintenance, glossary, troubleshooting, FAQ, and equipment recommendations.',
    date: '2024.07.22',
    type: 'REACT',
    tags: ['React', 'Food'],
    path: '/play/prototypes/sourdough'
  },
  {
    id: 'vibe-coding-setup',
    name: 'Vibe Coding Setup',
    description: 'Complete guide to setting up your environment for vibe coding with Figma designs, Cursor, GitHub, Vercel, and Supabase.',
    date: '2024.06.30',
    type: 'TUTORIAL',
    tags: ['Tutorial', 'HTML/CSS'],
    path: '/play/vibe-coding-setup'
  }
]

export default function PlayPage() {
  const [selectedTypes, setSelectedTypes] = useState(new Set())
  const [selectedTopics, setSelectedTopics] = useState(new Set())

  // Extract unique types and topics
  const allTypes = useMemo(() => {
    const types = new Set()
    projects.forEach(project => {
      project.tags.forEach(tag => {
        if (['HTML/CSS', 'JavaScript', 'React', 'Claude'].includes(tag)) {
          types.add(tag)
        }
      })
    })
    return Array.from(types)
  }, [])

  const allTopics = useMemo(() => {
    const topics = new Set()
    projects.forEach(project => {
      project.tags.forEach(tag => {
        if (['Travel', 'Food', 'Fitness', 'Tutorial'].includes(tag)) {
          topics.add(tag)
        }
      })
    })
    return Array.from(topics)
  }, [])

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const projectTypes = new Set(project.tags.filter(tag => 
        ['HTML/CSS', 'JavaScript', 'React', 'Claude'].includes(tag)
      ))
      const projectTopics = new Set(project.tags.filter(tag => 
        ['Travel', 'Food', 'Fitness', 'Tutorial'].includes(tag)
      ))

      const typeMatch = selectedTypes.size === 0 || 
        Array.from(selectedTypes).some(type => projectTypes.has(type))
      const topicMatch = selectedTopics.size === 0 || 
        Array.from(selectedTopics).some(topic => projectTopics.has(topic))

      return typeMatch && topicMatch
    })
  }, [selectedTypes, selectedTopics])

  // Count projects for each filter
  const getTypeCount = (type) => {
    return projects.filter(project => 
      project.tags.includes(type)
    ).length
  }

  const getTopicCount = (topic) => {
    return projects.filter(project => 
      project.tags.includes(topic)
    ).length
  }

  const toggleType = (type) => {
    const newSet = new Set(selectedTypes)
    if (newSet.has(type)) {
      newSet.delete(type)
    } else {
      newSet.add(type)
    }
    setSelectedTypes(newSet)
  }

  const toggleTopic = (topic) => {
    const newSet = new Set(selectedTopics)
    if (newSet.has(topic)) {
      newSet.delete(topic)
    } else {
      newSet.add(topic)
    }
    setSelectedTopics(newSet)
  }

  const clearFilters = () => {
    setSelectedTypes(new Set())
    setSelectedTopics(new Set())
  }

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

      <div className="flex min-h-screen max-w-[1400px] mx-auto">
        {/* Left Column - Filters */}
        <div className="w-[280px] border-r border-[#e0e0e0] p-5 bg-[#fafafa]">
          <div className="flex justify-between items-center pb-3 border-b border-[#e0e0e0] mb-5 font-semibold">
            <div className="text-black">/ FILTER</div>
            <div 
              className="text-[#666] cursor-pointer font-normal text-xs hover:text-black"
              onClick={clearFilters}
            >
              CLEAR FILTERS
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-3 font-medium cursor-pointer select-none">
              <div className="w-3 h-3 border border-black relative">
                <div className="absolute top-[1px] right-[1px] w-1 h-1 border-t border-r border-black"></div>
              </div>
              <span className="flex-1">Type</span>
            </div>
            {allTypes.map(type => (
              <div
                key={type}
                className="flex items-center gap-2 py-1.5 pl-5 cursor-pointer hover:bg-[#f0f0f0]"
                onClick={() => toggleType(type)}
              >
                <div className={`w-3.5 h-3.5 border border-black relative flex-shrink-0 ${selectedTypes.has(type) ? 'after:content-["✓"] after:absolute after:top-[-2px] after:left-[1px] after:text-xs' : ''}`}></div>
                <span className="flex-1 text-black">{type}</span>
                <span className="text-[#666] text-xs">({getTypeCount(type)})</span>
              </div>
            ))}
          </div>

          {/* Topic Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-3 font-medium cursor-pointer select-none">
              <div className="w-3 h-3 border border-black relative">
                <div className="absolute top-[1px] right-[1px] w-1 h-1 border-t border-r border-black"></div>
              </div>
              <span className="flex-1">Topic</span>
            </div>
            {allTopics.map(topic => (
              <div
                key={topic}
                className="flex items-center gap-2 py-1.5 pl-5 cursor-pointer hover:bg-[#f0f0f0]"
                onClick={() => toggleTopic(topic)}
              >
                <div className={`w-3.5 h-3.5 border border-black relative flex-shrink-0 ${selectedTopics.has(topic) ? 'after:content-["✓"] after:absolute after:top-[-2px] after:left-[1px] after:text-xs' : ''}`}></div>
                <span className="flex-1 text-black">{topic}</span>
                <span className="text-[#666] text-xs">({getTopicCount(topic)})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 p-5 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => {
              // Extract tech stack from tags (HTML/CSS, JavaScript, React, Claude)
              const techStack = project.tags.filter(tag => 
                ['HTML/CSS', 'JavaScript', 'React', 'Claude'].includes(tag)
              )
              
              return (
                <Link
                  key={project.id}
                  href={project.path}
                  className="flex flex-col gap-[28px] text-inherit no-underline transition-opacity hover:opacity-80"
                >
                  <div className="flex flex-col gap-[8px]">
                    <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-black leading-[1.2] tracking-[0.31px]">
                      {project.name}
                    </h2>
                    <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] text-black tracking-[0.167px]">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {/* Tech Stack Bubbles */}
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((tech, index) => (
                          <div
                            key={index}
                            className="inline-block px-2.5 py-1 border border-[#d0d0d0] rounded text-xs text-black bg-white"
                          >
                            {tech}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Date */}
                    <div className="text-black text-[13px] font-mono">
                      {project.date}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
