'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const projects = [
    { image: "/images/novo/novo-1.jpg" },
    { image: "/images/novo/novo-2.jpg" },
    { image: "/images/novo/novo-3.jpg" },
    { image: "/images/novo/novo-4.jpg" },
    { image: "/images/novo/novo-5.jpg" },
    { image: "/images/novo/novo-6.jpg" },
    { image: "/images/novo/novo-7.jpg" },
    { image: "/images/novo/novo-8.jpg" }
  ]

const handleImageClick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const centerPoint = rect.width / 2
  
  if (x < centerPoint) {
    // Left side - go to previous (or wrap to last)
    setCurrentIndex(currentIndex === 0 ? projects.length - 1 : currentIndex - 1)
  } else {
    // Right side - go to next (or wrap to first)
    setCurrentIndex(currentIndex === projects.length - 1 ? 0 : currentIndex + 1)
  }
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
                  Novo
                </h2>
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] text-[#FAFAFA] tracking-[0.167px]">
                  Novo is a financial platform for small businesses, offering banking features and AI-powered bookkeeping. Despite a brand refresh, their site lacked engagement and clarity. Partnering with →Dawn and →Work Is Play, we redesigned 10 pages, created 50+ illustrations, and built a mini design system in 7 weeks.
                </p>
              </div>
              
              {/* Counter */}
              <p className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px]">
                {currentIndex + 1}/{projects.length}
              </p>
            </div>

            {/* Image Container */}
            <div 
              className="w-full aspect-[1300/731] bg-white rounded-[10px] overflow-hidden cursor-pointer relative"
              onClick={handleImageClick}
            >
              <Image 
                src={projects[currentIndex].image}
                alt="Novo project"
                width={1300}
                height={731}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
