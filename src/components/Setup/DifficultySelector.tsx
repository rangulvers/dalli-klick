import { useGameStore } from '../../store/gameStore'
import { useLanguage } from '../../i18n/LanguageContext'
import { DifficultyLevel } from '../../types/game.types'

export function DifficultySelector() {
  const { difficulty, setDifficulty } = useGameStore()
  const { t } = useLanguage()

  const difficulties: { level: DifficultyLevel; tiles: number }[] = [
    { level: 'easy', tiles: 10 },
    { level: 'medium', tiles: 25 },
    { level: 'hard', tiles: 50 },
  ]

  return (
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-white mb-4">{t.setup.difficulty.title}</h2>

      <div className="space-y-3">
        {difficulties.map(({ level, tiles }) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              difficulty === level
                ? 'border-blue-500 bg-blue-600/20'
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-white font-bold text-lg">{t.setup.difficulty[level]}</p>
                <p className="text-gray-400 text-sm">{t.setup.difficulty[`${level}Desc` as keyof typeof t.setup.difficulty]}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{tiles}</p>
                <p className="text-gray-500 text-xs">tiles</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
