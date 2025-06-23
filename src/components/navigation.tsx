'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { key: 'nav_home', href: '#home' },
    { key: 'nav_about', href: '#about' },
    { key: 'nav_skills', href: '#skills' },
    { key: 'nav_contact', href: '#contact' },
  ]

  const languages = [
    { code: 'ru', name: 'RU' },
    { code: 'en', name: 'EN' },
    { code: 'pl', name: 'PL' },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-dark/90 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="text-2xl font-bold text-primary"
            whileHover={{ scale: 1.05 }}
          >
            DAYTONA
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.key}
                href={item.href}
                className="text-secondary hover:text-primary transition-colors duration-300 relative group"
                whileHover={{ scale: 1.05 }}
                data-interactive
              >
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button
                className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors duration-300"
                data-interactive
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 bg-dark/90 backdrop-blur-md rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`block w-full px-4 py-2 text-left hover:bg-primary/20 transition-colors duration-300 first:rounded-t-lg last:rounded-b-lg ${
                      language === lang.code ? 'text-primary' : 'text-secondary'
                    }`}
                    data-interactive
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary hover:text-primary transition-colors duration-300"
              data-interactive
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className={`md:hidden bg-dark/95 backdrop-blur-md ${
          isOpen ? 'block' : 'hidden'
        }`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="block text-secondary hover:text-primary transition-colors duration-300"
              onClick={() => setIsOpen(false)}
              data-interactive
            >
              {t(item.key)}
            </a>
          ))}
          <div className="border-t border-secondary/20 pt-4">
            <div className="flex space-x-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                    language === lang.code
                      ? 'bg-primary text-dark'
                      : 'text-secondary hover:text-primary'
                  }`}
                  data-interactive
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  )
}
