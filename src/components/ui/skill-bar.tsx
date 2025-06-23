'use client'

import { motion } from 'framer-motion'

interface SkillBarProps {
  name: string
  level: number
  delay?: number
}

export function SkillBar({ name, level, delay = 0 }: SkillBarProps) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-medium text-primary group-hover:text-accent transition-colors duration-300">
          {name}
        </span>
        <span className="text-sm font-bold text-accent">
          {level}%
        </span>
      </div>

      <div className="relative h-3 bg-dark/50 rounded-full overflow-hidden border border-primary/20">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.5, delay: delay + 0.3, ease: 'easeOut' }}
          viewport={{ once: true }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  )
}
