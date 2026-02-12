import { create } from 'zustand'
import { GamePhase, HexTile, ImageMetadata, DifficultyLevel } from '../types/game.types'
import { calculateOptimalHexSize, generateHexGrid } from '../utils/hexCalculations'
import { generateRevealSequence } from '../utils/revealSequence'
import { logger } from '../utils/logger'

// Difficulty settings: target number of hexagons
const DIFFICULTY_TILE_COUNTS = {
  easy: 10,
  medium: 25,
  hard: 50,
}

interface GameState {
  // Phase management
  phase: GamePhase

  // Image management
  imageFolder: string | null
  allImages: ImageMetadata[]
  currentImageIndex: number
  currentImageDimensions: {
    fileWidth: number
    fileHeight: number
    renderedWidth: number
    renderedHeight: number
  } | null

  // Hex grid state
  hexTiles: HexTile[]
  currentRevealIndex: number
  hexSize: number

  // Settings
  isFullscreen: boolean
  difficulty: DifficultyLevel

  // Actions
  setImageFolder: (path: string, images: ImageMetadata[]) => void
  setDifficulty: (difficulty: DifficultyLevel) => void
  startGame: () => void
  startRound: () => void
  setRenderedDimensions: (width: number, height: number) => void
  revealNextHex: () => void
  revealTileById: (tileId: string) => void
  revealAllHexes: () => void
  nextImage: () => void
  previousImage: () => void
  restartFromFirstImage: () => void
  resetToSetup: () => void
  toggleFullscreen: () => void
  setPhase: (phase: GamePhase) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  phase: 'setup',
  imageFolder: null,
  allImages: [],
  currentImageIndex: 0,
  currentImageDimensions: null,
  hexTiles: [],
  currentRevealIndex: 0,
  hexSize: 60,
  isFullscreen: false,
  difficulty: 'medium',

  // Set image folder and load images
  setImageFolder: (path, images) => {
    set({
      imageFolder: path,
      allImages: images,
      currentImageIndex: 0,
    })
  },

  // Set difficulty level
  setDifficulty: (difficulty) => {
    set({ difficulty })
  },

  // Start the game (transition from setup to playing)
  startGame: () => {
    set({ phase: 'playing' })
    get().startRound()
  },

  // Initialize a new round with hex grid
  startRound: () => {
    const { allImages, currentImageIndex, difficulty, currentImageDimensions } = get()
    if (allImages.length === 0) return

    const currentImage = allImages[currentImageIndex]

    // Use rendered dimensions if available, fallback to file dimensions
    const width = currentImageDimensions?.renderedWidth || currentImage.width
    const height = currentImageDimensions?.renderedHeight || currentImage.height

    logger.log(`Starting round for image ${currentImageIndex + 1}: ${currentImage.filename}`)
    logger.log(`Using dimensions: ${width.toFixed(0)}x${height.toFixed(0)}`)
    logger.log(`Difficulty: ${difficulty}`)

    // Get target tile count based on difficulty
    const targetTileCount = DIFFICULTY_TILE_COUNTS[difficulty]

    // Calculate hex size using RENDERED dimensions
    const hexSize = calculateOptimalHexSize(width, height, targetTileCount)

    // Generate hex grid using RENDERED dimensions
    const baseTiles = generateHexGrid(width, height, hexSize)

    logger.log(`Generated ${baseTiles.length} hex tiles`)

    // Generate random reveal sequence
    const revealSequence = generateRevealSequence(baseTiles.length)

    // Create hex tiles with reveal order
    const hexTiles: HexTile[] = baseTiles.map((tile, index) => ({
      ...tile,
      revealOrder: revealSequence.indexOf(index),
      revealed: false,
    }))

    set({
      hexTiles,
      hexSize,
      currentRevealIndex: 0,
      currentImageDimensions: currentImageDimensions || {
        fileWidth: currentImage.width,
        fileHeight: currentImage.height,
        renderedWidth: width,
        renderedHeight: height,
      },
      phase: 'playing',
    })
  },

  // Set rendered dimensions and regenerate hex grid
  setRenderedDimensions: (width, height) => {
    const { allImages, currentImageIndex } = get()
    if (allImages.length === 0) return

    const currentImage = allImages[currentImageIndex]

    set({
      currentImageDimensions: {
        fileWidth: currentImage.width,
        fileHeight: currentImage.height,
        renderedWidth: width,
        renderedHeight: height,
      }
    })

    // Regenerate hex grid with new dimensions
    get().startRound()
  },

  // Reveal next hex in random order
  revealNextHex: () => {
    const { hexTiles } = get()

    // Find all unrevealed tiles
    const unrevealedTiles = hexTiles.filter(tile => !tile.revealed)

    if (unrevealedTiles.length === 0) return // All tiles already revealed

    // Pick a RANDOM unrevealed tile
    const randomIndex = Math.floor(Math.random() * unrevealedTiles.length)
    const nextTile = unrevealedTiles[randomIndex]

    const updatedTiles = hexTiles.map(tile =>
      tile.id === nextTile.id ? { ...tile, revealed: true } : tile
    )

    const revealedCount = updatedTiles.filter(t => t.revealed).length

    set({
      hexTiles: updatedTiles,
      currentRevealIndex: revealedCount,
      phase: revealedCount >= hexTiles.length ? 'revealed' : 'playing',
    })
  },

  // Reveal a specific tile by ID (for click-to-reveal)
  revealTileById: (tileId: string) => {
    const { hexTiles, phase } = get()

    // Only allow revealing tiles during playing phase
    if (phase !== 'playing') return

    // Check if tile is already revealed
    const tile = hexTiles.find(t => t.id === tileId)
    if (!tile || tile.revealed) return

    const updatedTiles = hexTiles.map(tile =>
      tile.id === tileId ? { ...tile, revealed: true } : tile
    )

    const revealedCount = updatedTiles.filter(t => t.revealed).length

    set({
      hexTiles: updatedTiles,
      currentRevealIndex: revealedCount,
      phase: revealedCount >= hexTiles.length ? 'revealed' : 'playing',
    })
  },

  // Reveal all hexes at once
  revealAllHexes: () => {
    const { hexTiles } = get()
    const updatedTiles = hexTiles.map(tile => ({ ...tile, revealed: true }))

    set({
      hexTiles: updatedTiles,
      currentRevealIndex: hexTiles.length,
      phase: 'revealed',
    })
  },

  // Move to next image
  nextImage: () => {
    const { allImages, currentImageIndex } = get()
    if (allImages.length === 0) return

    const nextIndex = (currentImageIndex + 1) % allImages.length

    set({
      currentImageIndex: nextIndex,
      currentImageDimensions: null  // Clear dimensions so startRound waits for new image
    })
  },

  // Move to previous image
  previousImage: () => {
    const { allImages, currentImageIndex } = get()
    if (allImages.length === 0) return

    const prevIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1

    set({
      currentImageIndex: prevIndex,
      currentImageDimensions: null  // Clear dimensions so startRound waits for new image
    })
  },

  // Restart game from first image (keep all settings and players)
  restartFromFirstImage: () => {
    set({
      currentImageIndex: 0,
      currentImageDimensions: null,
      hexTiles: [],
      currentRevealIndex: 0,
      phase: 'playing',
    })
    get().startRound()
  },

  // Reset to setup screen (clear everything)
  resetToSetup: () => {
    set({
      phase: 'setup',
      imageFolder: null,
      allImages: [],
      currentImageIndex: 0,
      currentImageDimensions: null,
      hexTiles: [],
      currentRevealIndex: 0,
      hexSize: 60,
      difficulty: 'medium',
    })
  },

  // Toggle fullscreen mode
  toggleFullscreen: () => {
    window.electronAPI?.toggleFullscreen()
    set(state => ({ isFullscreen: !state.isFullscreen }))
  },

  // Set phase directly
  setPhase: (phase) => {
    set({ phase })
  },
}))
