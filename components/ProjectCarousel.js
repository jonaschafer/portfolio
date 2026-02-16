'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProjectCarousel({ title, description, images, folder }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showArrows, setShowArrows] = useState(false)

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerPoint = rect.width / 2
    
    if (x < centerPoint) {
      setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
    } else {
      setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
    }
  }

  const handleMouseMove = (e) => {
    setShowArrows(true)
  }

  const handleMouseLeave = () => {
    setShowArrows(false)
  }

  const isVideo = (filename) => {
    return filename.toLowerCase().endsWith('.mp4')
  }

  return (
    <div className="bg-[#435938] w-full">
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <div className="px-[20px] md:px-[60px] pt-[50px] pb-[60px]">
          <div className="flex flex-col gap-[46px]">
            {/* Project Info */}
            <div className="flex flex-col gap-[28px] max-w-[345px]">
              <div className="flex flex-col gap-[8px]">
                <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px]">
                  {title}
                </h2>
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] leading-[1.4] text-[#FAFAFA] tracking-[0.16px]">
                  {description}
                </p>
              </div>
              
              {/* Counter */}
              <p className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] leading-[1.4] text-[#FAFAFA] tracking-[0.16px]">
                {currentIndex + 1}/{images.length}
              </p>
            </div>

            {/* Image/Video Container */}
            <div 
              className="w-full aspect-[1300/731] bg-white rounded-[10px] overflow-hidden cursor-pointer relative"
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {isVideo(images[currentIndex]) ? (
                <video 
                  key={`${folder}-${currentIndex}`}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={(e) => console.log('Video error:', e)}
                >
                  <source src={`/images/${folder}/${images[currentIndex]}`} type="video/mp4" />
                  Video not supported
                </video>
              ) : (
                <Image 
                  src={`/images/${folder}/${images[currentIndex]}`}
                  alt={`${title} project`}
                  width={1300}
                  height={731}
                  className="w-full h-full object-cover"
                  quality={90}
                  priority
                />
              )}
              
              {/* Black Cursor Arrows */}
              {showArrows && (
                <>
                  {/* Left Arrow */}
                  <div className="absolute left-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                      <path 
                        d="M3 3L21 12L3 21V3Z" 
                        fill="black" 
                        transform="rotate(180 12 12)"
                      />
                    </svg>
                  </div>
                  
                  {/* Right Arrow */}
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                      <path 
                        d="M3 3L21 12L3 21V3Z" 
                        fill="black"
                      />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
