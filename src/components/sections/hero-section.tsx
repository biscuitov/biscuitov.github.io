'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { TypewriterText } from '@/components/ui/typewriter-text'

export function HeroSection() {
  const { t } = useLanguage()

  const socialLinks = [
    { icon: Github, href: 'https://github.com/biscuitov', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/polanski-aleksy/', label: 'LinkedIn' },
    { icon: Send, href: 'https://t.me/dddttt133', label: 'Telegram' },
  ]

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <motion.div
        className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full animate-float"
        style={{ animationDelay: '0s' }}
      />
      <motion.div
        className="absolute top-40 right-32 w-6 h-6 bg-accent rounded-full animate-float"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-3 h-3 bg-accent-alt rounded-full animate-float"
        style={{ animationDelay: '4s' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-48 h-48 mx-auto mb-8 group">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 animate-pulse-glow"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.8 }}
            />
            <img
              src="https://github.com/biscuitov.png?size=220"
              alt="Daytona Avatar"
              className="relative z-10 w-full h-full rounded-full object-cover border-4 border-primary/50 group-hover:border-primary transition-all duration-300"
            />
          </div>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-6xl font-bold text-primary mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          DAYTONA
        </motion.h2>

        <motion.h1
          className="text-2xl md:text-4xl font-light mb-8 h-16 flex items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <TypewriterText text={t('hero_greeting')} />
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {t('hero_description').split(' ').map((word, index) => {
            const isHighlight =
              word.includes(t('highlight_bullshit')) ||
              word.includes(t('highlight_lines')) ||
              word.includes(t('highlight_architecture'))

            return (
              <span
                key={index}
                className={isHighlight ? 'text-accent font-semibold' : ''}
              >
                {word}{' '}
              </span>
            )
          })}
        </motion.p>

        <motion.div
          className="flex justify-center space-x-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-dark/50 border border-primary/30 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-dark transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              data-interactive
            >
              <link.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
