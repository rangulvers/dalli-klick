import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useScoreStore } from '../store/scoreStore'

export function useKeyboardShortcuts(onToggleHelp?: () => void) {
  const {
    revealNextHex,
    revealAllHexes,
    nextImage,
    previousImage,
    restartFromFirstImage,
    resetToSetup,
    toggleFullscreen,
    phase,
  } = useGameStore()
  const { incrementScore, players } = useScoreStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Global shortcuts (work in all phases)
      switch (e.code) {
        case 'Slash':
          if (e.shiftKey) {
            // ? key (Shift + /)
            e.preventDefault()
            onToggleHelp?.()
            return
          }
          break

        case 'Escape':
          e.preventDefault()
          if (phase === 'playing' || phase === 'revealed') {
            resetToSetup()
          }
          return

        case 'KeyF':
          e.preventDefault()
          toggleFullscreen()
          return
      }

      // Only allow game shortcuts during playing/revealed phases
      if (phase !== 'playing' && phase !== 'revealed') {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (phase === 'playing') {
            revealNextHex()
          }
          break

        case 'Enter':
          e.preventDefault()
          if (phase === 'playing') {
            revealAllHexes()
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          nextImage()
          break

        case 'ArrowLeft':
          e.preventDefault()
          previousImage()
          break

        case 'KeyR':
          e.preventDefault()
          restartFromFirstImage()
          break

        // Quick score: press 1-9 to award point to corresponding player
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
          const index = parseInt(e.code.replace('Digit', '')) - 1
          if (players[index]) {
            e.preventDefault()
            incrementScore(players[index].id, 1)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    phase,
    players,
    revealNextHex,
    revealAllHexes,
    nextImage,
    previousImage,
    restartFromFirstImage,
    resetToSetup,
    toggleFullscreen,
    incrementScore,
    onToggleHelp,
  ])
}
