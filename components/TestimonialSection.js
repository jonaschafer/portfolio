'use client'

import { useState } from 'react'

export default function TestimonialSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorType, setCursorType] = useState('default')

  const testimonials = [
    {
      category: "Friends",
      quote: "Jon is an extremely talented visual thinker and designer. He is fast, focused and capable of handling multiple projects simultaneously while moving them forward and meeting client objectives. Jon's positive attitude and energy were a real asset to our small studio dynamic. He is a thoughtful, generous person, and a very gifted designer and problem solver.",
      author: "Lael Tyler",
      title: "Creative Director, Cast Iron Coding"
    },
    {
      category: "Friends", 
      quote: "Jon has a knack for creating visual stories that stand out—a talent worth its weight in gold. He's always one to offer a fresh perspective, to challenge the status quo, and to riff on ideas big & small. In short: everything he touches packs the right amount of punch (and has a hint of sparkle). He's an amazing collaborator and curious problem solver, always looking to find the right balance between a variety of needs. We've been so lucky to have him on the team at Clockwise and his impact will last for a very long time.",
      author: "Kacy Boone",
      title: "VP of Marketing, Clockwise"
    },
    {
      category: "Growlers",
      quote: "Friend projects are the best projects. That's why I was thrilled to help my friend Mickey — Coach Mickey — build up a identity for Chill N Fill's softball team. With —Lael Tyler and —Linh Triu, and inspired by the bar's growler-fill roots, we created Juggy the mascot, an anthropomorphic jug ready for catch.",
      author: "",
      title: ""
    }
  ]

  const totalTestimonials = testimonials.length

  const handleMouseMove = (e, containerRef) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const width = rect.width
    
    setCursorPosition({ x, y })
    
    // Determine cursor type based on position
    if (x < width * 0.4) {
      setCursorType('left')
    } else if (x > width * 0.6) {
      setCursorType('right')
    } else {
      setCursorType('center')
    }
  }

  const handleClick = (e, containerRef) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    
    if (x < width * 0.5) {
      // Left side - previous
      setCurrentTestimonial(prev => prev > 0 ? prev - 1 : totalTestimonials - 1)
    } else {
      // Right side - next  
      setCurrentTestimonial(prev => prev < totalTestimonials - 1 ? prev + 1 : 0)
    }
  }

  const containerRef = { current: null }

  return (
    <div className="bg-[#435938] w-full py-[80px]">
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px]">
        {/* Section Title */}
        <h2 className="font-['Mondwest',_sans-serif] text-[31px] md:text-[40px] text-[#FAFAFA] leading-[1.2] mb-[60px]">
          {testimonials[currentTestimonial].category}
        </h2>

        {/* Testimonial Content */}
        <div 
          ref={containerRef}
          className="relative bg-white rounded-[10px] p-[40px] md:p-[60px] cursor-none"
          onMouseMove={(e) => handleMouseMove(e, containerRef)}
          onMouseLeave={() => setCursorType('default')}
          onClick={(e) => handleClick(e, containerRef)}
        >
          {/* Custom Cursor */}
          {cursorType !== 'default' && (
            <div 
              className="fixed pointer-events-none z-50 w-12 h-12 rounded-full bg-black bg-opacity-20 flex items-center justify-center text-white text-2xl transition-all duration-200"
              style={{
                left: cursorPosition.x - 24,
                top: cursorPosition.y - 24,
                transform: `scale(3)`,
              }}
            >
              {cursorType === 'left' ? '←' : cursorType === 'right' ? '→' : ''}
            </div>
          )}

          <div className="space-y-[40px]">
            <p className="font-['Haas_Grot_Disp',_sans-serif] text-[18px] md:text-[20px] text-[#435938] leading-[1.4] tracking-[0.2px]">
              {testimonials[currentTestimonial].quote}
            </p>
            
            {testimonials[currentTestimonial].author && (
              <div className="space-y-1">
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#435938] font-medium">
                  {testimonials[currentTestimonial].author}
                </p>
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] text-[#435938] opacity-70">
                  {testimonials[currentTestimonial].title}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="text-center mt-[30px]">
          <span className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] text-[#FAFAFA] tracking-[0.16px]">
            {currentTestimonial + 1}/{totalTestimonials}
          </span>
        </div>
      </div>
    </div>
  )
}
