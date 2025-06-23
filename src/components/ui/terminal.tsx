'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function Terminal() {
  const { t } = useLanguage()
  const [currentLine, setCurrentLine] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const terminalLines = [
    'cd ~/career',
    'ls -la',
    'drwxr-xr-x projects',
    'drwxr-xr-x skills',
    '-rw-r--r-- resume.pdf',
    '-rw-r--r-- reasons_to_hire_me.txt (empty)',
    'cat reasons_to_hire_me.txt',
    t('terminal_empty'),
    './make_coffee.sh',
    t('terminal_error'),
  ]

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1)
        setIsTyping(false)
      }, currentLine === 0 ? 1000 : 1500)

      return () => clearTimeout(timer)
    }
  }, [currentLine, terminalLines.length])

  return (
    <motion.div
      className="bg-dark/80 backdrop-blur-md rounded-lg border border-primary/30 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <div className="w-3 h-3 bg-accent-alt rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
        <div className="text-primary font-mono text-sm">
          {t('terminal_career')}
        </div>
      </div>

      <div className="p-6 font-mono text-sm space-y-2 min-h-[300px]">
        {terminalLines.slice(0, currentLine).map((line, index) => (
          <motion.div
            key={index}
            className={`flex ${
              line.startsWith('drwxr-xr-x') || line.startsWith('-rw-r--r--')
                ? 'text-secondary'
                : line.includes('error') || line.includes('Error') || line.includes('crashed')
                ? 'text-accent'
                : 'text-primary'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {!line.startsWith('drwxr-xr-x') && !line.startsWith('-rw-r--r--') && !line.includes('empty') && !line.includes('error') && !line.includes('Error') && (
              <span className="text-accent mr-2">$</span>
            )}
            <span>{line}</span>
          </motion.div>
        ))}

        {currentLine < terminalLines.length && (
          <motion.div
            className="flex text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-accent mr-2">$</span>
            <span className="animate-blink">_</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
