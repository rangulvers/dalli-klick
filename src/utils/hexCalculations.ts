import { HexTile } from '../types/game.types'
import { logger } from './logger'

/**
 * Calculate optimal hexagon size for image dimensions
 * @param width Image width
 * @param height Image height
 * @param targetHexCount Desired number of hexagons (default: 60)
 */
export function calculateOptimalHexSize(
  width: number,
  height: number,
  targetHexCount: number = 60
): number {
  // Start with reasonable bounds based on image size
  let minSize = 20
  let maxSize = Math.min(Math.max(width, height) / 2, 500)  // Cap at reasonable maximum
  let bestSize = (minSize + maxSize) / 2
  let bestDiff = Infinity

  logger.log(`Calculating hex size for ${width.toFixed(0)}x${height.toFixed(0)}, target: ${targetHexCount} tiles`)

  for (let i = 0; i < 40; i++) {
    const testSize = (minSize + maxSize) / 2
    const count = estimateHexCount(width, height, testSize)
    const diff = Math.abs(count - targetHexCount)

    if (diff < bestDiff) {
      bestDiff = diff
      bestSize = testSize
    }

    // CORRECTED LOGIC:
    if (count > targetHexCount) {
      // Too many tiles → hexagons too small → increase minimum size
      minSize = testSize
    } else {
      // Too few tiles → hexagons too large → decrease maximum size
      maxSize = testSize
    }

    // Early exit if we found a good match
    if (diff <= 1) {
      logger.log(`Converged early at iteration ${i}`)
      break
    }
  }

  const finalCount = estimateHexCount(width, height, bestSize)
  logger.log(`Selected hex size: ${bestSize.toFixed(1)}px, generating ${finalCount} tiles (target: ${targetHexCount})`)

  return bestSize
}

/**
 * Estimate how many hexagons will be generated for given dimensions and size
 */
function estimateHexCount(width: number, height: number, hexSize: number): number {
  const hexWidth = Math.sqrt(3) * hexSize
  const hexHeight = 2 * hexSize
  const verticalSpacing = hexHeight * 0.75

  const cols = Math.ceil(width / hexWidth) + 1
  const rows = Math.ceil(height / verticalSpacing) + 1

  return rows * cols
}

/**
 * Generate hexagonal grid layout for given image dimensions
 * Uses pointy-top hexagon orientation
 */
export function generateHexGrid(
  imageWidth: number,
  imageHeight: number,
  hexSize: number
): Omit<HexTile, 'revealOrder' | 'revealed'>[] {
  const hexWidth = Math.sqrt(3) * hexSize
  const hexHeight = 2 * hexSize
  const verticalSpacing = hexHeight * 0.75

  const tiles: Omit<HexTile, 'revealOrder' | 'revealed'>[] = []

  // Calculate how many rows and columns we need (NO +1 padding)
  const cols = Math.ceil(imageWidth / hexWidth)
  const rows = Math.ceil(imageHeight / verticalSpacing)

  // Add 1 extra to each to ensure coverage at edges
  const totalCols = cols + 1
  const totalRows = rows + 1

  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < totalCols; col++) {
      // Offset every other row by half hex width
      const xOffset = row % 2 === 0 ? 0 : hexWidth / 2
      const x = col * hexWidth + xOffset
      const y = row * verticalSpacing

      // Only add tile if its bounds overlap with the image
      // Hex extends hexSize in all directions from center
      const hexLeft = x - hexSize
      const hexTop = y - hexSize
      const hexRight = x + hexSize
      const hexBottom = y + hexSize

      // Check if hex overlaps with image bounds [0, imageWidth] x [0, imageHeight]
      const overlapsX = hexRight >= 0 && hexLeft <= imageWidth
      const overlapsY = hexBottom >= 0 && hexTop <= imageHeight

      if (overlapsX && overlapsY) {
        tiles.push({
          id: `hex-${row}-${col}`,
          x,
          y,
        })
      }
    }
  }

  logger.log(`Generated ${tiles.length} hex tiles for ${imageWidth.toFixed(0)}x${imageHeight.toFixed(0)} image`)

  return tiles
}

/**
 * Generate SVG path for a pointy-top hexagon
 * Returns path string for use in <path d="...">
 */
export function getHexPath(size: number): string {
  const angles = [30, 90, 150, 210, 270, 330]
  const points = angles.map(angle => {
    const rad = (angle * Math.PI) / 180
    const x = size * Math.cos(rad)
    const y = size * Math.sin(rad)
    return `${x},${y}`
  })

  return `M ${points[0]} L ${points.slice(1).join(' L ')} Z`
}
