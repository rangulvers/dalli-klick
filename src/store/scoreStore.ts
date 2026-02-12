import { create } from 'zustand'
import { Player } from '../types/game.types'

interface ScoreState {
  players: Player[]

  // Actions
  addPlayer: (name: string) => void
  removePlayer: (id: string) => void
  updatePlayerName: (id: string, name: string) => void
  incrementScore: (playerId: string, points: number) => void
  resetScores: () => void
}

// Predefined color palette for easy visual identification
const PLAYER_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#F97316', // orange
  '#EC4899', // pink
  '#14B8A6', // teal
]

export const useScoreStore = create<ScoreState>((set) => ({
  players: [],

  addPlayer: (name) => {
    set((state) => {
      const newPlayer: Player = {
        id: `player-${Date.now()}-${Math.random()}`,
        name: name.trim() || `Player ${state.players.length + 1}`,
        score: 0,
        color: PLAYER_COLORS[state.players.length % PLAYER_COLORS.length],
      }

      return {
        players: [...state.players, newPlayer],
      }
    })
  },

  removePlayer: (id) => {
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    }))
  },

  updatePlayerName: (id, name) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, name: name.trim() || p.name } : p
      ),
    }))
  },

  incrementScore: (playerId, points) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + points } : p
      ),
    }))
  },

  resetScores: () => {
    set((state) => ({
      players: state.players.map((p) => ({ ...p, score: 0 })),
    }))
  },
}))
