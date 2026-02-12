import { useGameStore } from '../../store/gameStore'
import { useLanguage } from '../../i18n/LanguageContext'
import { ImageCanvas } from './ImageCanvas'
import { HexGrid } from './HexGrid'

export function GameBoard() {
  const {
    allImages,
    currentImageIndex,
    currentImageDimensions,
    revealNextHex,
    phase,
    setRenderedDimensions,
  } = useGameStore()

  const { t, interpolate } = useLanguage()

  if (allImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-xl">No images loaded</p>
      </div>
    )
  }

  const currentImage = allImages[currentImageIndex]

  const handleClick = () => {
    if (phase === 'playing') {
      revealNextHex()
    }
  }

  const handleImageLoad = (width: number, height: number) => {
    // Update store with rendered dimensions and regenerate hex grid
    setRenderedDimensions(width, height)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
      {/* Main game area - clickable to reveal */}
      <div
        className="relative max-w-full max-h-full cursor-pointer select-none"
        onClick={handleClick}
        style={{ width: '95%', height: '95%' }}
      >
        <div className="relative w-full h-full">
          <ImageCanvas
            imagePath={currentImage.path}
            onLoad={handleImageLoad}
          />

          {currentImageDimensions && (
            <HexGrid
              imageWidth={currentImageDimensions.renderedWidth}
              imageHeight={currentImageDimensions.renderedHeight}
            />
          )}
        </div>
      </div>

      {/* Image counter - top left, minimal */}
      <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
        <p className="text-white text-sm font-medium">
          {interpolate(t.game.imageCounter, { current: String(currentImageIndex + 1), total: String(allImages.length) })}
        </p>
      </div>

      {/* Click hint - bottom center, only when playing */}
      {phase === 'playing' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-lg">
          <p className="text-white text-xs">
            {t.game.clickHint}
          </p>
        </div>
      )}
    </div>
  )
}
