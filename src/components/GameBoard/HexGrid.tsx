import { useGameStore } from '../../store/gameStore'
import { HexTile } from './HexTile'

interface HexGridProps {
  imageWidth: number
  imageHeight: number
}

export function HexGrid({ imageWidth, imageHeight }: HexGridProps) {
  const { hexTiles, hexSize, currentImageIndex, revealTileById } = useGameStore()

  if (hexTiles.length === 0) return null

  return (
    <svg
      key={`hex-grid-${currentImageIndex}-${imageWidth}-${imageHeight}`}
      className="absolute inset-0 m-auto pointer-events-none"
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        pointerEvents: 'auto', // Enable pointer events for the SVG
      }}
    >
      {hexTiles.map((tile) => (
        <HexTile
          key={tile.id}
          id={tile.id}
          x={tile.x}
          y={tile.y}
          size={hexSize}
          revealed={tile.revealed}
          onClick={revealTileById}
        />
      ))}
    </svg>
  )
}
