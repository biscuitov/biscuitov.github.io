'use client'

import { motion } from 'framer-motion'

interface TechIconProps {
  name: string
  color: string
  delay?: number
}

export function TechIcon({ name, color, delay = 0 }: TechIconProps) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      data-interactive
    >
      <div
        className="relative bg-dark/50 backdrop-blur-sm border border-primary/30 rounded-xl p-6 text-center transition-all duration-300 group-hover:border-primary/50 group-hover:bg-dark/70 tilt-card"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative z-10">
          <div
            className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl font-bold text-white transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: color }}
          >
            {name.charAt(0)}
          </div>
          <p className="text-sm font-medium text-secondary group-hover:text-primary transition-colors duration-300">
            {name}
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 rounded-xl shine-effect" />
      </div>
    </motion.div>
  )
}
