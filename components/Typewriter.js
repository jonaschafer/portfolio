'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Typewriter({
  text,
  speed = 50,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className = '',
  cursorChar = '|',
}) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const texts = Array.isArray(text) ? text : [text]

  useEffect(() => {
    let timeout

    const currentText = texts[currentTextIndex]

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false)
        if (currentTextIndex === texts.length - 1 && !loop) return
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        setCurrentIndex(0)
        timeout = setTimeout(() => {}, waitTime)
      } else {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1))
        }, deleteSpeed)
      }
    } else {
      if (currentIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev + currentText[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }, speed)
      } else if (texts.length > 1) {
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, waitTime)
      }
    }

    return () => clearTimeout(timeout)
  }, [currentIndex, displayText, isDeleting, texts, currentTextIndex, loop, speed, deleteSpeed, waitTime])

  return (
    <span className={className}>
      <span>{displayText}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.01,
            repeat: Infinity,
            repeatDelay: 0.4,
            repeatType: 'reverse',
          },
        }}
        className="ml-1"
      >
        {cursorChar}
      </motion.span>
    </span>
  )
}