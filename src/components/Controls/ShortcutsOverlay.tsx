import { useLanguage } from '../../i18n/LanguageContext'
import { X } from 'lucide-react'

interface ShortcutsOverlayProps {
  onClose: () => void
}

export function ShortcutsOverlay({ onClose }: ShortcutsOverlayProps) {
  const { language } = useLanguage()

  const shortcuts = {
    en: {
      title: 'Keyboard Shortcuts',
      sections: [
        {
          title: 'Game Controls',
          shortcuts: [
            { key: 'Space', description: 'Reveal next hex' },
            { key: 'Enter', description: 'Show full image' },
            { key: '← →', description: 'Previous / Next image' },
          ],
        },
        {
          title: 'Quick Actions',
          shortcuts: [
            { key: 'R', description: 'Restart from first image' },
            { key: 'Esc', description: 'Return to setup screen' },
            { key: 'F', description: 'Toggle fullscreen' },
          ],
        },
        {
          title: 'Scoring',
          shortcuts: [
            { key: '1-9', description: 'Award +1 point to player 1-9' },
          ],
        },
        {
          title: 'Help',
          shortcuts: [
            { key: '?', description: 'Show/hide this help' },
          ],
        },
      ],
    },
    de: {
      title: 'Tastaturkürzel',
      sections: [
        {
          title: 'Spielsteuerung',
          shortcuts: [
            { key: 'Leertaste', description: 'Nächstes Sechseck aufdecken' },
            { key: 'Enter', description: 'Vollständiges Bild zeigen' },
            { key: '← →', description: 'Vorheriges / Nächstes Bild' },
          ],
        },
        {
          title: 'Schnellaktionen',
          shortcuts: [
            { key: 'R', description: 'Vom ersten Bild neu starten' },
            { key: 'Esc', description: 'Zurück zum Setup-Bildschirm' },
            { key: 'F', description: 'Vollbild umschalten' },
          ],
        },
        {
          title: 'Punktevergabe',
          shortcuts: [
            { key: '1-9', description: '+1 Punkt an Spieler 1-9 vergeben' },
          ],
        },
        {
          title: 'Hilfe',
          shortcuts: [
            { key: '?', description: 'Diese Hilfe ein-/ausblenden' },
          ],
        },
      ],
    },
  }

  const content = shortcuts[language]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.shortcuts.map((shortcut, sidx) => (
                  <div
                    key={sidx}
                    className="flex items-center gap-3 text-sm"
                  >
                    <kbd className="px-2 py-1 bg-gray-700 text-white rounded font-mono text-xs min-w-[60px] text-center">
                      {shortcut.key}
                    </kbd>
                    <span className="text-gray-300">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            {language === 'en'
              ? 'Press ? or Esc to close this help'
              : 'Drücke ? oder Esc, um diese Hilfe zu schließen'}
          </p>
        </div>
      </div>
    </div>
  )
}
