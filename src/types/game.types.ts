export interface ImageMetadata {
  path: string
  filename: string
  width: number
  height: number
}

export interface HexTile {
  id: string
  x: number
  y: number
  revealOrder: number
  revealed: boolean
}

export interface Player {
  id: string
  name: string
  score: number
  color: string
}

export type GamePhase = 'setup' | 'playing' | 'revealed' | 'finished'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface DifficultySettings {
  easy: number
  medium: number
  hard: number
}

export interface ElectronAPI {
  selectFolder: () => Promise<string | null>
  loadImages: (folderPath: string) => Promise<ImageMetadata[]>
  toggleFullscreen: () => void
  getImagePath: (imagePath: string) => Promise<string>
  readImageAsDataUrl: (imagePath: string) => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
