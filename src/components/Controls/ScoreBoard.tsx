import { useState } from 'react'
import { useScoreStore } from '../../store/scoreStore'
import { useLanguage } from '../../i18n/LanguageContext'
import { Trash2, Plus } from 'lucide-react'

export function ScoreBoard() {
  const { players, incrementScore, removePlayer, addPlayer } = useScoreStore()
  const { t, interpolate } = useLanguage()
  const [isCollapsed, setIsCollapsed] = useState(false)
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

  if (players.length === 0) {
    return null
  }

  return (
    <div className="bg-black/80 rounded-lg overflow-hidden w-full">
      {/* Header */}
      <div
        className="bg-gray-800 px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-white font-bold text-lg">{t.game.scoreboard.title}</h2>
        <button className="text-gray-400 hover:text-white">
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
          {/* Player list */}
          {players.map((player, index) => (
            <div
              key={player.id}
              className="bg-gray-900/50 rounded-lg p-3 flex items-center gap-3"
            >
              {/* Player color indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: player.color }}
              />

              {/* Player name and number */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {index + 1}. {player.name}
                </p>
                <p className="text-2xl font-bold" style={{ color: player.color }}>
                  {player.score}
                </p>
              </div>

              {/* Score buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => incrementScore(player.id, 1)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  +1
                </button>
                <button
                  onClick={() => incrementScore(player.id, 2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  +2
                </button>
                <button
                  onClick={() => incrementScore(player.id, 3)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  +3
                </button>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removePlayer(player.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
                title={t.game.scoreboard.addPlayer}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {/* Add player */}
          <div className="flex gap-2 pt-2 border-t border-gray-700">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.game.scoreboard.newPlayerName}
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAddPlayer}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
              title={t.game.scoreboard.addPlayer}
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="text-xs text-gray-400 text-center pt-2">
            {interpolate(t.game.scoreboard.quickPoint, { max: String(Math.min(players.length, 9)) })}
          </div>
        </div>
      )}
    </div>
  )
}
