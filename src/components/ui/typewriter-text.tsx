'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
}

export function TypewriterText({ text, speed = 100, delay = 1000 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setDisplayText('')
    setIsTyping(false)

    const startTyping = setTimeout(() => {
      setIsTyping(true)
      let index = 0

      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
        }
      }, speed)

      return () => clearInterval(typeInterval)
    }, delay)

    return () => clearTimeout(startTyping)
  }, [text, speed, delay])

  return (
    <span className="relative">
      {displayText}
      <span
        className={`ml-1 animate-blink ${isTyping ? 'opacity-100' : 'opacity-0'}`}
      >
        |
      </span>
    </span>
  )
}
