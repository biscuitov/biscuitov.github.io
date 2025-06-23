'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Terminal } from '@/components/ui/terminal'

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 relative inline-block">
            {t('about_title')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-secondary leading-relaxed">
              {t('about_description_1')}
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              {t('about_description_2')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Terminal />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
