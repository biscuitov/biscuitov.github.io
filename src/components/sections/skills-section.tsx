'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { TechIcon } from '@/components/ui/tech-icon'
import { SkillBar } from '@/components/ui/skill-bar'

export function SkillsSection() {
  const { t } = useLanguage()

  const programmingLanguages = [
    { name: 'C++', color: '#00599C' },
    { name: 'Rust', color: '#CE422B' },
    { name: 'Haskell', color: '#5D4F85' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Go', color: '#00ADD8' },
  ]

  const databases = [
    { name: 'PostgreSQL', color: '#336791' },
    { name: 'Oracle', color: '#F80000' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'MySQL', color: '#4479A1' },
    { name: 'MariaDB', color: '#003545' },
    { name: 'Redis', color: '#DC382D' },
  ]

  const skills = [
    { name: t('skills_breaking'), level: 98 },
    { name: t('skills_overcomplicating'), level: 95 },
    { name: t('skills_misunderstanding'), level: 97 },
  ]

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 relative inline-block">
            {t('skills_title')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></span>
          </h2>
        </motion.div>

        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-primary mb-8 text-center">
              {t('skills_languages')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {programmingLanguages.map((tech, index) => (
                <TechIcon
                  key={tech.name}
                  name={tech.name}
                  color={tech.color}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-primary mb-8 text-center">
              {t('skills_databases')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {databases.map((tech, index) => (
                <TechIcon
                  key={tech.name}
                  name={tech.name}
                  color={tech.color}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
