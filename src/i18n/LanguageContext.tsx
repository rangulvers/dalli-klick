import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, Translations, interpolate } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  interpolate: typeof interpolate
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Detect system language
function getSystemLanguage(): Language {
  const systemLang = navigator.language.toLowerCase()
  if (systemLang.startsWith('de')) {
    return 'de'
  }
  return 'en' // Default to English
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize from localStorage or system language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('dalli-klick-language') as Language | null
    return saved || getSystemLanguage()
  })

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('dalli-klick-language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    interpolate,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
