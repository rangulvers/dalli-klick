import { useState } from 'react'
import { useScoreStore } from '../../store/scoreStore'
import { useLanguage } from '../../i18n/LanguageContext'
import { Trash2 } from 'lucide-react'

interface PlayerSetupProps {
  onComplete: () => void
}

export function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const { players, addPlayer, removePlayer } = useScoreStore()
  const { t } = useLanguage()
  const [newPlayerName, setNewPlayerName] = useState('')

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName)
      setNewPlayerName('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer()
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-white mb-4">{t.setup.players.title}</h2>

      {/* Player list */}
      {players.length > 0 && (
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-3"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: player.color }}
              />
              <span className="text-white font-medium flex-1">
                {index + 1}. {player.name}
              </span>
              <button
                onClick={() => removePlayer(player.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add player input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.setup.players.playerName}
          className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleAddPlayer}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          {t.setup.players.addPlayer}
        </button>
      </div>

      {/* Continue button */}
      <button
        onClick={onComplete}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors font-bold text-lg"
      >
        {players.length > 0 ? t.setup.players.startGame : t.setup.players.skip}
      </button>
    </div>
  )
}
