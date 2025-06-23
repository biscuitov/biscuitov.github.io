'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="py-8 border-t border-primary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-secondary">
            {t('footer_text')}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
