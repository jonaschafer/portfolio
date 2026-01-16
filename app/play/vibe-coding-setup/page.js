'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { sections, navLabels, nestedSections } from './content'

export default function VibeCodingSetupPage() {
  const [theme, setTheme] = useState('light')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [prerequisitesExpanded, setPrerequisitesExpanded] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  useEffect(() => {
    // Setup scroll spy
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = sections.filter(section => {
      const title = section.title.toLowerCase()
      return title.includes(query.toLowerCase())
    })

    setSearchResults(results)
  }

  useEffect(() => {
    if (isSearchOpen) {
      performSearch(searchQuery)
    }
  }, [searchQuery, isSearchOpen])

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setSearchQuery('')
      setSearchResults([])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const result = searchResults[selectedIndex]
      document.getElementById(result.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsSearchOpen(false)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setSidebarOpen(false)
  }

  const copyLink = (id) => {
    const url = window.location.origin + window.location.pathname + '#' + id
    navigator.clipboard.writeText(url).then(() => {
      // Show toast notification
      const toast = document.createElement('div')
      toast.className = 'toast show'
      toast.textContent = 'URL copied to clipboard'
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => toast.remove(), 300)
      }, 2000)
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]" data-theme={theme}>
      <style jsx global>{`
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8f9fa;
          --text-primary: #1a1a1a;
          --text-secondary: #666666;
          --text-tertiary: #999999;
          --border-color: #e5e5e5;
          --accent-color: #5e6ad2;
          --accent-hover: #4c56c0;
          --code-bg: #f6f8fa;
          --code-border: #e1e4e8;
          --sidebar-bg: #fafbfc;
          --sidebar-active: #e8ecf0;
        }

        [data-theme="dark"] {
          --bg-primary: #0d1117;
          --bg-secondary: #161b22;
          --text-primary: #c9d1d9;
          --text-secondary: #8b949e;
          --text-tertiary: #6e7681;
          --border-color: #30363d;
          --accent-color: #58a6ff;
          --accent-hover: #79c0ff;
          --code-bg: #161b22;
          --code-border: #30363d;
          --sidebar-bg: #0d1117;
          --sidebar-active: #1c2128;
        }

        .vibe-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 100;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .vibe-sidebar {
          width: 240px;
          background-color: var(--sidebar-bg);
          border-right: 1px solid var(--border-color);
          position: fixed;
          top: 60px;
          left: 0;
          height: calc(100vh - 60px);
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px 0;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .vibe-main {
          margin-left: 240px;
          margin-top: 60px;
          padding: 48px;
          max-width: 900px;
          width: 100%;
        }

        .vibe-section h1 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .vibe-section h2 {
          font-size: 28px;
          font-weight: 600;
          margin-top: 48px;
          margin-bottom: 16px;
          color: var(--text-primary);
          padding-top: 48px;
          scroll-margin-top: 80px;
          position: relative;
          cursor: pointer;
        }

        .vibe-section h2:first-of-type {
          margin-top: 0;
          padding-top: 0;
        }

        .vibe-section h2 .link-icon {
          opacity: 0;
          transition: opacity 0.2s ease;
          margin-left: 8px;
          font-size: 20px;
        }

        .vibe-section h2:hover .link-icon {
          opacity: 1;
        }

        .vibe-section h3 {
          font-size: 20px;
          font-weight: 600;
          margin-top: 32px;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .vibe-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin-top: 16px;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .vibe-section p {
          margin-bottom: 16px;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .vibe-section ul, .vibe-section ol {
          margin-bottom: 16px;
          padding-left: 24px;
          color: var(--text-secondary);
        }

        .vibe-section li {
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .vibe-section code {
          background-color: var(--code-bg);
          border: 1px solid var(--code-border);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', monospace;
          font-size: 0.9em;
          color: var(--text-primary);
        }

        .vibe-section pre {
          background-color: var(--code-bg);
          border: 1px solid var(--code-border);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          margin-bottom: 24px;
          margin-top: 16px;
        }

        .vibe-section pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 14px;
          line-height: 1.6;
        }

        .vibe-section a {
          color: var(--accent-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .vibe-section a:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }

        .sidebar-nav {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sidebar-nav li {
          margin: 0;
        }

        .sidebar-nav a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 24px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          cursor: pointer;
        }

        .sidebar-nav a:hover {
          color: var(--text-primary);
          background-color: var(--bg-secondary);
        }

        .sidebar-nav a.active {
          color: var(--accent-color);
          background-color: var(--sidebar-active);
          border-left-color: var(--accent-color);
          font-weight: 500;
        }

        .sidebar-nav .nested {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .sidebar-nav .nested.expanded {
          max-height: 1000px;
        }

        .sidebar-nav .nested a {
          padding: 6px 24px 6px 48px;
          font-size: 13px;
          color: var(--text-tertiary);
          border-left: none;
        }

        .sidebar-nav .nested a:hover {
          color: var(--text-secondary);
        }

        .sidebar-nav .nested a.active {
          color: var(--accent-color);
          background-color: var(--sidebar-active);
        }

        .chevron {
          opacity: 0.5;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .chevron svg {
          width: 100%;
          height: 100%;
          stroke: currentColor;
        }

        .expanded .chevron {
          transform: rotate(90deg);
        }

        .tech-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .tech-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .tech-icon {
          width: 24px;
          height: 24px;
          margin-right: 12px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tech-details {
          flex: 1;
        }

        .tech-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .tech-description {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
        }

        .cost-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        .cost-table th,
        .cost-table td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .cost-table th {
          font-weight: 600;
          color: var(--text-primary);
          background-color: var(--bg-secondary);
        }

        .cost-table td {
          color: var(--text-secondary);
        }

        .cost-free {
          color: #28a745;
          font-weight: 500;
        }

        .color-info {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .color-name {
          font-weight: 500;
          margin-right: 8px;
          min-width: 120px;
        }

        .color-swatch {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          margin-right: 8px;
          vertical-align: middle;
        }

        .color-value {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', monospace;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 1000;
          pointer-events: none;
          font-size: 14px;
          color: var(--text-primary);
        }

        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .vibe-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .vibe-sidebar.open {
            transform: translateX(0);
          }
          .vibe-main {
            margin-left: 0;
          }
        }
      `}</style>

      <header className="vibe-header">
        <Link href="/play" className="text-lg font-semibold text-[var(--text-primary)] cursor-pointer hover:opacity-70 transition-opacity">
          〰️VIBES〰️
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="bg-transparent border border-[var(--border-color)] rounded-md px-3 py-2 cursor-pointer text-sm text-[var(--text-primary)] transition-all hover:bg-[var(--bg-secondary)] flex items-center justify-center"
            aria-label="Search"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <button
            onClick={toggleTheme}
            className="bg-transparent border border-[var(--border-color)] rounded-md px-3 py-2 cursor-pointer text-sm text-[var(--text-primary)] transition-all hover:bg-[var(--bg-secondary)] flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] backdrop-blur-sm flex items-start justify-center pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchOpen(false)
              setSearchQuery('')
              setSearchResults([])
            }
          }}
        >
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg w-[90%] max-w-[640px] max-h-[70vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-[var(--border-color)] relative">
              <div className="relative flex items-center">
                <div className="absolute left-3 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full py-2.5 px-9 text-[15px] border-none rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none transition-colors focus:bg-[var(--bg-primary)]"
                  placeholder="Search..."
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-1">
              {searchResults.length === 0 && searchQuery ? (
                <div className="py-10 px-5 text-center text-[var(--text-secondary)] text-sm">No results found</div>
              ) : (
                searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className={`flex items-start gap-3 p-2 rounded-md cursor-pointer transition-colors mb-0.5 ${
                      index === selectedIndex ? 'bg-[var(--sidebar-active)]' : 'hover:bg-[var(--bg-secondary)]'
                    }`}
                    onClick={() => {
                      scrollToSection(result.id)
                      setIsSearchOpen(false)
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                  >
                    <div className="text-[var(--text-secondary)] text-sm">{result.title}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className={`vibe-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav>
            <ul className="sidebar-nav">
              {sections
                .filter(s => s.id !== 'intro' && s.id !== 'overview')
                .map((section) => {
                  const isPrerequisites = section.id === 'prerequisites'
                  const isNested = nestedSections.includes(section.id)
                  const label = navLabels[section.id] || section.title

                  if (isPrerequisites) {
                    return (
                      <li key={section.id}>
                        <a
                          onClick={() => {
                            setPrerequisitesExpanded(!prerequisitesExpanded)
                            scrollToSection(section.id)
                          }}
                          className={activeSection === section.id ? 'active' : ''}
                        >
                          <span>{label}</span>
                          <span className={`chevron ${prerequisitesExpanded ? 'expanded' : ''}`}>
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </span>
                        </a>
                        <ul className={`nested ${prerequisitesExpanded ? 'expanded' : ''}`}>
                          {nestedSections.map(nestedId => {
                            const nestedSection = sections.find(s => s.id === nestedId)
                            if (!nestedSection) return null
                            const nestedLabel = navLabels[nestedId] || nestedSection.title
                            return (
                              <li key={nestedId}>
                                <a
                                  onClick={() => scrollToSection(nestedId)}
                                  className={activeSection === nestedId ? 'active' : ''}
                                >
                                  {nestedLabel}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    )
                  } else if (!isNested) {
                    return (
                      <li key={section.id}>
                        <a
                          onClick={() => scrollToSection(section.id)}
                          className={activeSection === section.id ? 'active' : ''}
                        >
                          {label}
                        </a>
                      </li>
                    )
                  }
                  return null
                })}
              {/* Overview at the end */}
              {sections
                .filter(s => s.id === 'overview')
                .map(section => (
                  <li key={section.id}>
                    <a
                      onClick={() => scrollToSection(section.id)}
                      className={activeSection === section.id ? 'active' : ''}
                    >
                      {navLabels[section.id] || section.title}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </aside>

        <main className="vibe-main">
          <div className="vibe-section">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={section.id === 'intro' ? 'mb-12' : ''}
              >
                {section.id === 'intro' ? (
                  <h1>{section.title}</h1>
                ) : (
                  <h2 onClick={() => copyLink(section.id)}>
                    {section.title}
                    <span className="link-icon">🔗</span>
                  </h2>
                )}
                <div>{section.content}</div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
