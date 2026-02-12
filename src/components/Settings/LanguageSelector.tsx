import { useLanguage } from '../../i18n/LanguageContext'
import { Language } from '../../i18n/translations'
import { Languages } from 'lucide-react'

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <div className="bg-black/80 rounded-lg p-4 w-full">
      <div className="flex items-center gap-2 mb-3">
        <Languages size={18} className="text-gray-400" />
        <h3 className="text-white font-semibold text-sm">{t.common.language}</h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`flex-1 py-2 px-3 rounded-lg transition-colors font-medium text-sm ${
            language === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange('de')}
          className={`flex-1 py-2 px-3 rounded-lg transition-colors font-medium text-sm ${
            language === 'de'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Deutsch
        </button>
      </div>
    </div>
  )
}
