'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const colorSchemes = [
  { 
    background: '#f8daec', 
    text: '#000000', 
    border: '#000000',
    blockquoteBg: 'rgba(0, 0, 0, 0.1)',
    tableHeaderBg: '#e0c4d9'
  },
  { 
    background: '#007015', 
    text: '#ffffff', 
    border: '#ffffff',
    blockquoteBg: 'rgba(255, 255, 255, 0.15)',
    tableHeaderBg: '#005a11'
  },
  { 
    background: '#2E1165', 
    text: '#ffffff', 
    border: '#4a2d8f',
    blockquoteBg: 'rgba(255, 255, 255, 0.1)',
    tableHeaderBg: '#4a2d8f'
  },
  { 
    background: '#d95d6f', 
    text: '#000000', 
    border: '#000000',
    blockquoteBg: 'rgba(0, 0, 0, 0.15)',
    tableHeaderBg: '#c14a5f'
  },
  { 
    background: '#6a410a', 
    text: '#ffffff', 
    border: '#ffffff',
    blockquoteBg: 'rgba(255, 255, 255, 0.15)',
    tableHeaderBg: '#533208'
  },
  { 
    background: '#d5c4af', 
    text: '#000000', 
    border: '#000000',
    blockquoteBg: 'rgba(0, 0, 0, 0.1)',
    tableHeaderBg: '#c0ad95'
  },
];

export default function BlogHeader() {
  const [currentScheme, setCurrentScheme] = useState(colorSchemes[2]); // Start with purple
  const [currentIndex, setCurrentIndex] = useState(2); // Track current index

  const randomizeColors = () => {
    // Get a random index that's different from current
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * colorSchemes.length);
    } while (randomIndex === currentIndex && colorSchemes.length > 1);
    
    const newScheme = colorSchemes[randomIndex];
    setCurrentScheme(newScheme);
    setCurrentIndex(randomIndex);
    
    // Update CSS variables for global color changes
    document.documentElement.style.setProperty('--bg-color', newScheme.background);
    document.documentElement.style.setProperty('--text-color', newScheme.text);
    document.documentElement.style.setProperty('--border-color', newScheme.border);
    document.documentElement.style.setProperty('--blockquote-bg', newScheme.blockquoteBg);
    document.documentElement.style.setProperty('--table-header-bg', newScheme.tableHeaderBg);
  };

  // Set initial colors on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', currentScheme.background);
    document.documentElement.style.setProperty('--text-color', currentScheme.text);
    document.documentElement.style.setProperty('--border-color', currentScheme.border);
    document.documentElement.style.setProperty('--blockquote-bg', currentScheme.blockquoteBg);
    document.documentElement.style.setProperty('--table-header-bg', currentScheme.tableHeaderBg);
  }, []);

  return (
    <header className="border-b sticky top-0 z-50 transition-colors duration-500" style={{ backgroundColor: currentScheme.background, borderColor: currentScheme.border }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold hover:opacity-70 transition-opacity" style={{ color: currentScheme.text }}>
          Brand Studio
        </Link>
        
        <nav className="flex items-center gap-8 text-sm font-medium">
          <button
            onClick={randomizeColors}
            className="text-[11px] font-medium hover:opacity-70 transition-opacity cursor-pointer px-2 py-1 rounded-full border font-mono"
            style={{ 
              color: currentScheme.text, 
              borderColor: currentScheme.text,
              fontFamily: '"IBM Plex Mono", monospace'
            }}
          >
            Randomize
          </button>
          <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: currentScheme.text }}>
            Articles
          </Link>
          <a 
            href="https://www.classdojo.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
            style={{ color: currentScheme.text }}
          >
            ClassDojo
          </a>
        </nav>
      </div>
    </header>
  );
}
