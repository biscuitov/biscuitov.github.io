'use client'

import { motion } from 'framer-motion'

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div
        className="absolute w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"
        style={{ top: '10%', left: '10%' }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-accent opacity-10 rounded-full blur-3xl"
        style={{ top: '60%', right: '10%' }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-accent-alt opacity-10 rounded-full blur-3xl"
        style={{ bottom: '20%', left: '50%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 10,
        }}
      />
    </div>
  )
}
