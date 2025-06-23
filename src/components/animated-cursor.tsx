'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function AnimatedCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    document.addEventListener('mousemove', updateMousePosition)

    const interactiveElements = document.querySelectorAll('a, button, [data-interactive]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <motion.div
      className={`fixed w-6 h-6 border-2 border-primary rounded-full pointer-events-none z-50 mix-blend-difference ${
        isHovering ? 'scale-150 bg-primary' : 'scale-100'
      }`}
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
        backgroundColor: isHovering ? '#64ffda' : 'transparent',
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    />
  )
}
