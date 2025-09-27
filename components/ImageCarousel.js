'use client'

import { useState } from 'react'

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Sample project data - you can replace with real data
  const projects = [
    {
      title: "Novo",
      description: "Novo is a financial platform for small businesses, offering banking features and AI-powered bookkeeping. Despite a brand refresh, their site lacked engagement and clarity. Partnering with →Dawn and →Work Is Play, we redesigned 10 pages, created 50+ illustrations, and built a mini design system in 7 weeks.",
      image: "https://via.placeholder.com/1320x733/ffffff/000000?text=Project+1"
    },
    {
      title: "Project Two",
      description: "Description for project two goes here with details about the work done.",
      image: "https://via.placeholder.com/1320x733/ffffff/000000?text=Project+2"
    },
    {
      title: "Project Three", 
      description: "Description for project three goes here with details about the work done.",
      image: "https://via.placeholder.com/1320x733/ffffff/000000?text=Project+3"
    },
    {
      title: "Project Four",
      description: "Description for project four goes here with details about the work done.",
      image: "https://via.placeholder.com/1320x733/ffffff/000000?text=Project+4"
    },
    {
      title: "Project Five",
      description: "Description for project five goes here with details about the work done.", 
      image: "https://via.placeholder.com/1320x733/ffffff/000000?text=Project+5"
    },
    {
      title: "Project Six",
      description: "Description for project six goes here with details about the work done.",
      image: "https://via.placeholder.com/1320x733/ffffff/000000?text=Project+6"
    },
    {
      title: "Project Seven",
      description: "Description for project seven goes here with details about the work done.",
      image: "https://via.placeholder.com/1320x733/ffffff/000000?text=Project+7"
    }
  ]

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCursorPosition({ x, y })
  }

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerPoint = rect.width / 2
    
    if (x < centerPoint && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (x > centerPoint && currentIndex < projects.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const getCursorRotation = (x, imageWidth) => {
    const centerPoint = imageWidth / 2
    const leftThird = imageWidth / 3
    const rightThird = (imageWidth * 2) / 3
    
    if (x < leftThird) return -45 // Left arrow
    if (x > rightThird) return 45  // Right arrow
    return 0 // Center cursor
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
                  {projects[currentIndex].title}
                </h2>
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] text-[#FAFAFA] tracking-[0.167px]">
                  {projects[currentIndex].description}
                </p>
              </div>
              
              {/* Counter */}
              <p className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px]">
                {currentIndex + 1}/{projects.length}
              </p>
            </div>

            {/* Image Container */}
            <div 
              className="relative w-full h-[300px] md:h-[500px] lg:h-[733px] bg-white rounded-[10px] overflow-hidden cursor-none"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleImageClick}
            >
              <img 
                src={projects[currentIndex].image}
                alt={projects[currentIndex].title}
                className="w-full h-full object-cover"
              />
              
              {/* Custom Cursor */}
              {isHovering && (
                <div 
                  className="absolute pointer-events-none z-10 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
                  style={{
                    left: cursorPosition.x,
                    top: cursorPosition.y,
                    transform: `translate(-50%, -50%) rotate(${getCursorRotation(cursorPosition.x, 1320)}deg) scale(3)`
                  }}
                >
                  <div className="w-full h-full bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
