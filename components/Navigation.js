'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation({ 
  backgroundColor = '#435938', 
  textColor = '#FAFAFA',
  underlineColor = 'white',
  arrowColor = null
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Use arrowColor if provided, otherwise default to textColor
  const arrowStrokeColor = arrowColor !== null ? arrowColor : textColor

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  const ArrowIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M4.25 13.4583L13.4583 4.24997M13.4583 4.24997V13.09M13.4583 4.24997H4.61833" stroke={arrowStrokeColor} strokeWidth="1.0625" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div className="w-full relative" style={{ backgroundColor }}>
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <nav className="flex items-center justify-between pb-[60px] pt-[30px] px-[20px] md:px-[60px]">
          <p className="font-['Inter',_sans-serif] font-normal leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap" style={{ color: textColor }}>
            Jon Schafer
          </p>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-[20px] md:gap-[30px]">
            <Link 
              href="/" 
              className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity ${pathname === '/' ? 'underline underline-offset-1' : ''}`}
              style={{ color: textColor, textDecorationColor: underlineColor }}
            >
              Work
            </Link>
            <Link 
              href="/play" 
              className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity ${pathname?.startsWith('/play') ? 'underline underline-offset-1' : ''}`}
              style={{ color: textColor, textDecorationColor: underlineColor }}
            >
              Play
            </Link>
            <a 
              href="https://www.are.na/jon-schafer/blocks" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity flex items-center gap-1"
              style={{ color: textColor }}
            >
              Vibes <ArrowIcon size={17} />
            </a>
            <a 
              href="mailto:hello@jonschafer.com?subject=Hello%20from%20MCP!%20" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
              style={{ color: textColor }}
            >
              👋
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={toggleMenu}
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          >
            {isMenuOpen ? (
              /* X Icon */
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute w-6 h-0.5 transform rotate-45" style={{ backgroundColor: textColor }}></div>
                <div className="absolute w-6 h-0.5 transform -rotate-45" style={{ backgroundColor: textColor }}></div>
              </div>
            ) : (
              /* Hamburger Icon */
              <>
                <div className="w-6 h-0.5" style={{ backgroundColor: textColor }}></div>
                <div className="w-6 h-0.5" style={{ backgroundColor: textColor }}></div>
                <div className="w-6 h-0.5" style={{ backgroundColor: textColor }}></div>
              </>
            )}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-0 left-0 w-full h-screen z-50 flex flex-col justify-start pt-[140px] px-[20px]" style={{ backgroundColor }}>
            {/* Close button in overlay */}
            <div className="absolute top-[30px] right-[20px]">
              <button 
                onClick={toggleMenu}
                className="w-8 h-8 flex items-center justify-center"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div className="absolute w-6 h-0.5 transform rotate-45" style={{ backgroundColor: textColor }}></div>
                  <div className="absolute w-6 h-0.5 transform -rotate-45" style={{ backgroundColor: textColor }}></div>
                </div>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-8">
              <Link 
                href="/" 
                className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] hover:opacity-80 transition-opacity ${pathname === '/' ? 'underline underline-offset-1' : ''}`}
                style={{ color: textColor, textDecorationColor: underlineColor }}
                onClick={toggleMenu}
              >
                Work
              </Link>
              <Link 
                href="/play" 
                className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] hover:opacity-80 transition-opacity ${pathname?.startsWith('/play') ? 'underline underline-offset-1' : ''}`}
                style={{ color: textColor, textDecorationColor: underlineColor }}
                onClick={toggleMenu}
              >
                Play
              </Link>
              <a 
                href="https://www.are.na/jon-schafer/blocks" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] hover:opacity-80 transition-opacity flex items-center gap-2"
                style={{ color: textColor }}
                onClick={toggleMenu}
              >
                Vibes <ArrowIcon size={17} />
              </a>
              <a 
                href="mailto:hello@jonschafer.com?subject=Hello%20from%20MCP!%20" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] hover:opacity-80 transition-opacity"
                style={{ color: textColor }}
                onClick={toggleMenu}
              >
                👋
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
