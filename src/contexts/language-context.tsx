'use client'

import { createContext, useContext, useState, ReactNode, Suspense } from 'react'
import { useQueryState } from 'nuqs'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  ru: {
    nav_home: 'Главная',
    nav_about: 'Обо мне',
    nav_skills: 'Навыки',
    nav_contact: 'Контакты',
    hero_greeting: 'Привет, я Daytona',
    hero_description: 'Создаю низкопроизводительный бред и глупые решения с страстью к ментальному срыву. Специализируюсь на C++, Rust и Haskell для создания абсолютного дерьма. JS/TS энтузиаст, известен тем, что превращаю 10 строк кода в 500 без прироста производительности. Эксперт по возвращению современного веба в 2006 год, пишу шедевры, работающие под IE7. Мастер баз данных в PostgreSQL, Oracle, MongoDB, MySQL. Изобретатель первой в мире однопоточной микросервисной архитектуры. Патент ожидается.',
    about_title: 'Обо мне',
    about_description_1: 'Я программист с удивительно низкой квалификацией и впечатляющей способностью создавать сложные решения для простых проблем. Мой путь в программировании начался, когда я случайно выпил кофе и решил, что смогу написать собственную операционную систему (которая до сих пор не работает).',
    about_description_2: 'Мои коллеги описывают меня как "технически живого" и "удивительно упорного, несмотря на полное отсутствие таланта". Я горжусь своей способностью превращать требования клиентов в совершенно другой продукт, который никому не нужен.',
    skills_title: 'Мои технические навыки',
    skills_languages: 'Языки программирования',
    skills_databases: 'Базы данных',
    skills_breaking: 'Ломание рабочего кода',
    skills_overcomplicating: 'Усложнение простых решений',
    skills_misunderstanding: 'Непонимание технических требований',
    contact_title: 'Свяжитесь со мной',
    contact_description: 'Готов к новым вызовам и интересным проектам',
    footer_text: '© 2024 Daytona. Все права защищены.',
    terminal_career: 'моя_карьера.sh',
    terminal_empty: 'Файл пуст или содержит невидимый текст.',
    terminal_error: 'Фатальная ошибка: Переполнение кофе. Система упала.',
    highlight_bullshit: 'низкопроизводительного дерьма',
    highlight_lines: '10 строк кода в 500',
    highlight_architecture: 'однопоточную микросервисную архитектуру',
  },
  en: {
    nav_home: 'Home',
    nav_about: 'About',
    nav_skills: 'Skills',
    nav_contact: 'Contact',
    hero_greeting: 'Hi, I\'m Daytona',
    hero_description: 'Crafting low-performance bullshit and silly solutions with a passion for mental breakdown. Specialized in C++, Rust, and Haskell for building absolute shit. JS/TS enthusiast, known for turning 10 lines of code into 500 with zero performance gain. Expert in dragging the modern web back to 2006 by writing masterpieces that run under IE7. Master of database honorea across PostgreSQL, Oracle, MongoDB, MySQL. Inventor of the world\'s first single-threaded microservice architecture. Patent pending.',
    about_title: 'About Me',
    about_description_1: 'I\'m a programmer with amazingly low qualifications and an impressive ability to create complex solutions for simple problems. My journey in programming began when I accidentally drank coffee and decided I could write my own operating system (which still doesn\'t work).',
    about_description_2: 'My colleagues describe me as "technically alive" and "surprisingly persistent despite a complete lack of talent". I take pride in my ability to transform client requirements into a completely different product that no one needs.',
    skills_title: 'My Technical Skills',
    skills_languages: 'Programming Languages',
    skills_databases: 'Databases',
    skills_breaking: 'Breaking Working Code',
    skills_overcomplicating: 'Overcomplicating Simple Solutions',
    skills_misunderstanding: 'Misunderstanding Technical Requirements',
    contact_title: 'Get In Touch',
    contact_description: 'Ready for new challenges and interesting projects',
    footer_text: '© 2024 Daytona. All rights reserved.',
    terminal_career: 'my_career.sh',
    terminal_empty: 'File is empty or contains invisible text.',
    terminal_error: 'Fatal error: Coffee overflow. System crashed.',
    highlight_bullshit: 'low-performance bullshit',
    highlight_lines: '10 lines of code into 500',
    highlight_architecture: 'single-threaded microservice architecture',
  },
  pl: {
    nav_home: 'Strona główna',
    nav_about: 'O mnie',
    nav_skills: 'Umiejętności',
    nav_contact: 'Kontakt',
    hero_greeting: 'Cześć, jestem Daytona',
    hero_description: 'Tworzę niskowydajne bzdury i głupie rozwiązania z pasją do załamania psychicznego. Specjalizuję się w C++, Rust i Haskell do budowania absolutnego gówna. Entuzjasta JS/TS, znany z przekształcania 10 linii kodu w 500 bez wzrostu wydajności. Ekspert w cofaniu nowoczesnego webu do 2006 roku, piszę arcydzieła działające pod IE7. Mistrz baz danych w PostgreSQL, Oracle, MongoDB, MySQL. Wynalazca pierwszej na świecie jednowątkowej architektury mikrousług. Patent w toku.',
    about_title: 'O mnie',
    about_description_1: 'Jestem programistą o zadziwiająco niskich kwalifikacjach i imponującej zdolności tworzenia skomplikowanych rozwiązań dla prostych problemów. Moja przygoda z programowaniem zaczęła się, gdy przypadkowo wypiłem kawę i zdecydowałem, że mogę napisać własny system operacyjny (który nadal nie działa).',
    about_description_2: 'Moi koledzy opisują mnie jako "technicznie żywego" i "zaskakująco uporczywego pomimo całkowitego braku talentu". Jestem dumny ze swojej zdolności przekształcania wymagań klientów w zupełnie inny produkt, którego nikt nie potrzebuje.',
    skills_title: 'Moje umiejętności techniczne',
    skills_languages: 'Języki programowania',
    skills_databases: 'Bazy danych',
    skills_breaking: 'Łamanie działającego kodu',
    skills_overcomplicating: 'Komplikowanie prostych rozwiązań',
    skills_misunderstanding: 'Niezrozumienie wymagań technicznych',
    contact_title: 'Skontaktuj się',
    contact_description: 'Gotowy na nowe wyzwania i ciekawe projekty',
    footer_text: '© 2024 Daytona. Wszystkie prawa zastrzeżone.',
    terminal_career: 'moja_kariera.sh',
    terminal_empty: 'Plik jest pusty lub zawiera niewidoczny tekst.',
    terminal_error: 'Błąd krytyczny: Przepełnienie kawy. System się zawiesił.',
    highlight_bullshit: 'niskowydajnych bzdur',
    highlight_lines: '10 linii kodu w 500',
    highlight_architecture: 'jednowątkową architekturę mikrousług',
  },
}

function LanguageProviderContent({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useQueryState('lang', {
    defaultValue: 'ru',
    parse: (value: string) => ['ru', 'en', 'pl'].includes(value) ? value : 'ru',
  })

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.ru] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LanguageProviderContent>{children}</LanguageProviderContent>
    </Suspense>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
