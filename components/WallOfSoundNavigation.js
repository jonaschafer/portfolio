'use client'

import { useState } from 'react'

export default function WallOfSoundNavigation({ user, onAddTrack, onLogin, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="bg-[#FFDAD9] w-full relative">
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <nav className="flex items-center justify-between pb-[60px] pt-[30px] px-[20px] md:px-[60px]">
          <p className="font-['Inter',_sans-serif] font-normal leading-[1.4] text-[16px] text-[#1e1e1e] tracking-[0.16px] whitespace-nowrap">
            Jon Schafer
          </p>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-[20px] md:gap-[30px]">
            <a 
              href="/" 
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#1e1e1e] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              Work
            </a>
            <a 
              href="https://figma-experiments.vercel.app" 
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#1e1e1e] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              Play
            </a>
            <a 
              href="mailto:hello@jonschafer.com?subject=Hello%20from%20Wall%20of%20Sound!" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#1e1e1e] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              👋
            </a>
            <a 
              href="https://www.are.na/jon-schafer/blocks" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#1e1e1e] tracking-[0.16px] whitespace-nowrap border border-[#1e1e1e] rounded-full px-[20px] py-[10px] hover:bg-[#1e1e1e] hover:text-[#FFDAD9] transition-all"
            >
              Vibes
            </a>
                {user ? (
                  <>
                    <button
                      onClick={onAddTrack}
                      className="border border-[#1e1e1e] rounded-full px-5 py-2.5 text-[#1e1e1e] text-base hover:bg-[#1e1e1e] hover:text-[#FFDAD9] transition-colors"
                    >
                      Add a track
                    </button>
                    <button
                      onClick={onLogout}
                      className="text-[#1e1e1e] text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onLogin}
                    className="border border-[#1e1e1e] rounded-full px-5 py-2.5 text-[#1e1e1e] text-base hover:bg-[#1e1e1e] hover:text-[#FFDAD9] transition-colors"
                  >
                    Log in
                  </button>
                )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={toggleMenu}
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          >
            {isMenuOpen ? (
              /* X Icon */
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute w-6 h-0.5 bg-[#1e1e1e] transform rotate-45"></div>
                <div className="absolute w-6 h-0.5 bg-[#1e1e1e] transform -rotate-45"></div>
              </div>
            ) : (
              /* Hamburger Icon */
              <>
                <div className="w-6 h-0.5 bg-[#1e1e1e]"></div>
                <div className="w-6 h-0.5 bg-[#1e1e1e]"></div>
                <div className="w-6 h-0.5 bg-[#1e1e1e]"></div>
              </>
            )}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-0 left-0 w-full h-screen bg-[#FFDAD9] z-50 flex flex-col justify-start pt-[140px] px-[20px]">
            {/* Close button in overlay */}
            <div className="absolute top-[30px] right-[20px]">
              <button 
                onClick={toggleMenu}
                className="w-8 h-8 flex items-center justify-center"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div className="absolute w-6 h-0.5 bg-[#1e1e1e] transform rotate-45"></div>
                  <div className="absolute w-6 h-0.5 bg-[#1e1e1e] transform -rotate-45"></div>
                </div>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-8">
              <a 
                href="/" 
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] text-[#1e1e1e] tracking-[0.16px] hover:opacity-80 transition-opacity"
                onClick={toggleMenu}
              >
                Work
              </a>
              <a 
                href="https://figma-experiments.vercel.app" 
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] text-[#1e1e1e] tracking-[0.16px] hover:opacity-80 transition-opacity"
                onClick={toggleMenu}
              >
                Play
              </a>
              <a 
                href="mailto:hello@jonschafer.com?subject=Hello%20from%20Wall%20of%20Sound!" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] text-[#1e1e1e] tracking-[0.16px] hover:opacity-80 transition-opacity"
                onClick={toggleMenu}
              >
                👋
              </a>
              <a 
                href="https://www.are.na/jon-schafer/blocks" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[32px] text-[#1e1e1e] tracking-[0.16px] hover:opacity-80 transition-opacity"
                onClick={toggleMenu}
              >
                Vibes
              </a>
                  {user ? (
                    <>
                      <button
                        onClick={() => { onAddTrack(); toggleMenu(); }}
                        className="border border-[#1e1e1e] rounded-full px-5 py-2.5 text-[#1e1e1e] text-base hover:bg-[#1e1e1e] hover:text-[#FFDAD9] transition-colors w-fit"
                      >
                        Add a track
                      </button>
                      <button
                        onClick={() => { onLogout(); toggleMenu(); }}
                        className="text-[#1e1e1e] text-sm opacity-60 hover:opacity-100 transition-opacity w-fit"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { onLogin(); toggleMenu(); }}
                      className="border border-[#1e1e1e] rounded-full px-5 py-2.5 text-[#1e1e1e] text-base hover:bg-[#1e1e1e] hover:text-[#FFDAD9] transition-colors w-fit"
                    >
                      Log in
                    </button>
                  )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
