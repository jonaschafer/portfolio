'use client';

import Link from 'next/link';
import BlogHeader from '@/components/BlogHeader';
import { ArrowRight } from '@/components/Icons';

export default function HomePage() {
  return (
      <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--bg-color, #2E1165)' }}>
      <BlogHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Intro */}
        <div className="max-w-4xl mb-20">
          <h1 className="text-[59.9px] font-bold mb-6 leading-[67.2px] transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)', letterSpacing: '-1.28px' }}>
            Carving out creative territories
          </h1>
          <p className="text-[18px] leading-[25.2px] transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }}>
            Case studies and insights from building tools that transform how creative teams work. 
            By Jon Schafer, Design Lead at ClassDojo.
          </p>
        </div>

        {/* Featured Article */}
        <article className="mb-20 pb-16 border-b transition-colors duration-500" style={{ borderColor: 'var(--border-color, #4a2d8f)' }}>
          <Link href="/intake-case-study" className="block group">
            {/* Tags */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--text-color, #ffffff)' }}>
                Case Study
              </span>
              <span className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--text-color, #ffffff)' }}>
                Design Systems
              </span>
              <span className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--text-color, #ffffff)' }}>
                Operations
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold mb-5 group-hover:opacity-70 transition-opacity leading-tight" style={{ color: 'var(--text-color, #ffffff)', letterSpacing: '-0.02em' }}>
              Building an AI-Powered Creative Intake System
            </h2>

            {/* Excerpt */}
            <p className="text-[18px] mb-6 leading-[25.2px] transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }}>
              How we transformed Brand Studio operations by solving 25+ problems across 8 categories—from dual submission confusion to workload visibility. A designer's journey building production software with AI assistance.
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }}>
              <span>Jon Schafer</span>
              <span>·</span>
              <span>February 2026</span>
              <span>·</span>
              <span>6 min read</span>
            </div>
          </Link>
        </article>

        {/* Coming Soon */}
        <div className="pt-4">
          <h3 className="text-2xl font-semibold mb-4 tracking-tight transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }}>More articles coming soon</h3>
          <p className="text-[18px] leading-[25.2px] max-w-2xl transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }}>
            Working on more case studies covering design systems at scale, 
            AI-assisted prototyping, and building internal tools.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 transition-colors duration-500" style={{ borderColor: 'var(--border-color, #4a2d8f)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 text-sm">
            <div>
              <p className="transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }}>
                © 2026 Jon Schafer
              </p>
            </div>
            <div className="flex gap-8 font-medium">
              <a 
                href="https://www.classdojo.com/careers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-color, #ffffff)' }}
              >
                Careers
              </a>
              <a 
                href="mailto:jon@example.com" 
                className="hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-color, #ffffff)' }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
