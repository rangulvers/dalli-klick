import { useGameStore } from '../../store/gameStore'
import { useLanguage } from '../../i18n/LanguageContext'

export function GameControls() {
  const {
    revealNextHex,
    revealAllHexes,
    nextImage,
    previousImage,
    hexTiles,
    phase,
    difficulty,
  } = useGameStore()

  const { t, interpolate } = useLanguage()

  const revealedCount = hexTiles.filter((t) => t.revealed).length
  const totalHexes = hexTiles.length

  const difficultyLabels = {
    easy: t.setup.difficulty.easy,
    medium: t.setup.difficulty.medium,
    hard: t.setup.difficulty.hard,
  }

  return (
    <div className="bg-black/80 rounded-lg p-4 space-y-3 w-full">
      <div className="text-white text-center mb-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{difficultyLabels[difficulty]}</p>
        <p className="text-sm text-gray-300">{t.game.controls.progress}</p>
        <p className="text-lg font-bold">
          {interpolate(t.game.controls.hexes, { revealed: String(revealedCount), total: String(totalHexes) })}
        </p>
      </div>

      <div className="space-y-2">
        {phase === 'playing' && (
          <>
            <button
              onClick={revealNextHex}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              {t.game.controls.nextHex} <span className="text-sm text-blue-200">(Space)</span>
            </button>
            <button
              onClick={revealAllHexes}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              {t.game.controls.showImage} <span className="text-sm text-green-200">(Enter)</span>
            </button>
          </>
        )}

        <div className="flex gap-2">
          <button
            onClick={previousImage}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            ← {t.game.controls.previous}
          </button>
          <button
            onClick={nextImage}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            {t.game.controls.next} →
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-700">
        <p>{t.game.controls.shortcuts.fullscreen}</p>
        <p>{t.game.controls.shortcuts.allShortcuts}</p>
      </div>
    </div>
  )
}
