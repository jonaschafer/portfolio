'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_HEIGHT = 82

export default function Navigation({ 
  backgroundColor = '#435938', 
  textColor = '#FAFAFA',
  underlineColor = 'white',
  arrowColor = null
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      if (current < 60) {
        setNavVisible(true)
      } else if (current > lastScrollY.current) {
        setNavVisible(false)
      } else {
        setNavVisible(true)
      }
      lastScrollY.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  
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

  const isTransparent = backgroundColor === 'transparent'
  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
        style={{
          transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
          ...(isTransparent ? {} : { backgroundColor }),
        }}
      >
        <div className="min-w-[375px] max-w-[1440px] mx-auto">
          <nav className="flex items-center justify-between py-[30px] px-[20px] md:px-[60px]">
          <Link
            href="/"
            className="font-['Inter',_sans-serif] font-normal leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            style={{ color: textColor }}
          >
            Jon Schafer
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-[20px] md:gap-[30px]">
            <Link 
              href="/" 
              className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-100 transition-opacity ${pathname === '/' ? 'opacity-100' : 'opacity-50'}`}
              style={{ color: textColor }}
            >
              Work
            </Link>
            <Link 
              href="/play" 
              className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-100 transition-opacity ${pathname?.startsWith('/play') ? 'opacity-100' : 'opacity-50'}`}
              style={{ color: textColor }}
            >
              Play
            </Link>
            <Link 
              href="/advising" 
              className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-100 transition-opacity ${pathname?.startsWith('/advising') ? 'opacity-100' : 'opacity-50'}`}
              style={{ color: textColor }}
            >
              Advising
            </Link>
            <a 
              href="mailto:hello@jonschafer.com?subject=Hello%20from%20portfolio" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity inline-flex items-center gap-[6px]"
              style={{ color: textColor }}
            >
              Email me
              <ArrowIcon size={17} />
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
          <div className="sm:hidden absolute top-0 left-0 w-full h-screen z-50 flex flex-col justify-start pt-[140px] px-[20px]" style={{ backgroundColor: isTransparent ? 'rgba(0,0,0,0.92)' : backgroundColor }}>
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
                className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] hover:opacity-100 transition-opacity ${pathname === '/' ? 'opacity-100' : 'opacity-50'}`}
                style={{ color: textColor }}
                onClick={toggleMenu}
              >
                Work
              </Link>
              <Link 
                href="/play" 
                className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] hover:opacity-100 transition-opacity ${pathname?.startsWith('/play') ? 'opacity-100' : 'opacity-50'}`}
                style={{ color: textColor }}
                onClick={toggleMenu}
              >
                Play
              </Link>
              <Link 
                href="/advising" 
                className={`font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] hover:opacity-100 transition-opacity ${pathname?.startsWith('/advising') ? 'opacity-100' : 'opacity-50'}`}
                style={{ color: textColor }}
                onClick={toggleMenu}
              >
                Advising
              </Link>
              <a 
                href="mailto:hello@jonschafer.com?subject=Hello%20from%20portfolio" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] tracking-[0.16px] opacity-50 hover:opacity-100 transition-opacity inline-flex items-center gap-[8px]"
                style={{ color: textColor }}
                onClick={toggleMenu}
              >
                Email me
                <ArrowIcon size={24} />
              </a>
            </div>
          </div>
        )}
        </div>
      </div>
      <div aria-hidden style={{ height: NAV_HEIGHT }} />
    </>
  )
}
