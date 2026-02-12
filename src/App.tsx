import { useState, useCallback } from 'react'
import { useGameStore } from './store/gameStore'
import { ImageFolderPicker } from './components/Setup/ImageFolderPicker'
import { DifficultySelector } from './components/Setup/DifficultySelector'
import { PlayerSetup } from './components/Setup/PlayerSetup'
import { GameBoard } from './components/GameBoard/GameBoard'
import { GameControls } from './components/Controls/GameControls'
import { ScoreBoard } from './components/Controls/ScoreBoard'
import { ShortcutsOverlay } from './components/Controls/ShortcutsOverlay'
import { LanguageSelector } from './components/Settings/LanguageSelector'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useLanguage } from './i18n/LanguageContext'

function App() {
  const { phase, setImageFolder, startGame } = useGameStore()
  const { t } = useLanguage()
  const [setupStep, setSetupStep] = useState<'folder' | 'difficulty' | 'players'>('folder')
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Enable keyboard shortcuts with help toggle
  useKeyboardShortcuts(() => setShowShortcuts(prev => !prev))

  const handleFolderSelected = useCallback(async (path: string, _imageCount: number) => {
    const images = await window.electronAPI.loadImages(path)
    setImageFolder(path, images)
    setSetupStep('difficulty')
  }, [setImageFolder])

  const handleDifficultySelected = useCallback(() => {
    setSetupStep('players')
  }, [])

  const handlePlayerSetupComplete = useCallback(() => {
    startGame()
  }, [startGame])

  // Setup phase
  if (phase === 'setup') {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl font-bold text-white mb-4">{t.setup.title}</h1>
          <p className="text-xl text-gray-300 mb-12">
            {t.setup.subtitle}
          </p>

          {setupStep === 'folder' && (
            <ImageFolderPicker onFolderSelected={handleFolderSelected} />
          )}

          {setupStep === 'difficulty' && (
            <>
              <DifficultySelector />
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => setSetupStep('folder')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← {t.setup.back}
                </button>
                <button
                  onClick={handleDifficultySelected}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-bold"
                >
                  {t.setup.continue} →
                </button>
              </div>
            </>
          )}

          {setupStep === 'players' && (
            <>
              <PlayerSetup onComplete={handlePlayerSetupComplete} />
              <button
                onClick={() => setSetupStep('difficulty')}
                className="mt-4 text-gray-400 hover:text-white transition-colors"
              >
                ← {t.setup.back}
              </button>
            </>
          )}

          {/* Language selector in setup */}
          <div className="mt-8 flex justify-center">
            <div className="w-64">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Game phase
  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Main game area - full height, takes remaining space */}
      <div className="flex-1 relative overflow-hidden">
        <GameBoard />
      </div>

      {/* Right sidebar - all controls */}
      <div className="w-80 bg-black/50 flex flex-col gap-4 p-4 overflow-y-auto">
        <ScoreBoard />
        <GameControls />
      </div>

      {/* Shortcuts overlay */}
      {showShortcuts && (
        <ShortcutsOverlay onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  )
}

export default App
