'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Send, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function ContactSection() {
  const { t } = useLanguage()

  const contacts = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/biscuitov',
      color: 'hover:text-white'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/polanski-aleksy/',
      color: 'hover:text-blue-400'
    },
    {
      icon: Send,
      label: 'Telegram',
      href: 'https://t.me/dddttt133',
      color: 'hover:text-blue-500'
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:polanski.aleksy@gmail.com',
      color: 'hover:text-red-400'
    }
  ]

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 relative inline-block">
            {t('contact_title')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></span>
          </h2>

          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">
            {t('contact_description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center p-6 bg-dark/50 backdrop-blur-sm border border-primary/30 rounded-xl transition-all duration-300 hover:border-primary/50 hover:bg-dark/70 ${contact.color}`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              data-interactive
            >
              <contact.icon className="w-8 h-8 mb-3 text-secondary group-hover:text-current transition-colors duration-300" />
              <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors duration-300">
                {contact.label}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
