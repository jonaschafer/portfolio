'use client'

import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="bg-[#435938] w-full relative">
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <nav className="flex items-center justify-between pb-[60px] pt-[30px] px-[20px] md:px-[60px]">
          <p className="font-['Inter',_sans-serif] font-normal leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap">
            Jon Schafer
          </p>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-[20px] md:gap-[30px]">
            <a 
              href="/wall-of-sound" 
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              Jams
            </a>
            <a 
              href="mailto:hello@jonschafer.com?subject=Hello%20from%20MCP!%20" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              Say 'ello
            </a>
            <a 
              href="https://www.are.na/jon-schafer/blocks" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap border border-white rounded-full px-[20px] py-[10px] hover:bg-white hover:text-[#435938] transition-all"
            >
              Vibes
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
                <div className="absolute w-6 h-0.5 bg-white transform rotate-45"></div>
                <div className="absolute w-6 h-0.5 bg-white transform -rotate-45"></div>
              </div>
            ) : (
              /* Hamburger Icon */
              <>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </>
            )}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-0 left-0 w-full h-screen bg-[#435938] z-50 flex flex-col justify-start pt-[140px] px-[20px]">
            {/* Close button in overlay */}
            <div className="absolute top-[30px] right-[20px]">
              <button 
                onClick={toggleMenu}
                className="w-8 h-8 flex items-center justify-center"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div className="absolute w-6 h-0.5 bg-white transform rotate-45"></div>
                  <div className="absolute w-6 h-0.5 bg-white transform -rotate-45"></div>
                </div>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-8">
              <a 
                href="/wall-of-sound" 
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] text-[#FAFAFA] tracking-[0.16px] hover:opacity-80 transition-opacity"
                onClick={toggleMenu}
              >
                Jams
              </a>
              <a 
                href="mailto:hello@jonschafer.com?subject=Hello%20from%20MCP!%20" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] text-[#FAFAFA] tracking-[0.16px] hover:opacity-80 transition-opacity"
                onClick={toggleMenu}
              >
                Say 'ello
              </a>
              <a 
                href="https://www.are.na/jon-schafer/blocks" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] text-[#FAFAFA] tracking-[0.16px] hover:opacity-80 transition-opacity"
                onClick={toggleMenu}
              >
                Vibes
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
