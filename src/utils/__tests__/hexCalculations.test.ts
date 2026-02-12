import { describe, it, expect } from 'vitest'
import {
  calculateOptimalHexSize,
  generateHexGrid,
  getHexPath,
} from '../hexCalculations'

describe('hexCalculations', () => {
  describe('calculateOptimalHexSize', () => {
    it('should return a positive hex size', () => {
      const size = calculateOptimalHexSize(1000, 1000, 25)
      expect(size).toBeGreaterThan(0)
    })

    it('should generate approximately the target number of hexagons', () => {
      const targetCount = 25
      const width = 1000
      const height = 1000

      const hexSize = calculateOptimalHexSize(width, height, targetCount)
      const grid = generateHexGrid(width, height, hexSize)

      // Allow ±20% tolerance
      expect(grid.length).toBeGreaterThanOrEqual(targetCount * 0.8)
      expect(grid.length).toBeLessThanOrEqual(targetCount * 1.2)
    })

    it('should handle portrait images', () => {
      const size = calculateOptimalHexSize(500, 1000, 25)
      expect(size).toBeGreaterThan(0)
      expect(size).toBeLessThan(500) // Should fit within narrower dimension
    })

    it('should handle landscape images', () => {
      const size = calculateOptimalHexSize(1000, 500, 25)
      expect(size).toBeGreaterThan(0)
      expect(size).toBeLessThan(500)
    })

    it('should return smaller hex size for more tiles', () => {
      const size10 = calculateOptimalHexSize(1000, 1000, 10)
      const size50 = calculateOptimalHexSize(1000, 1000, 50)

      expect(size50).toBeLessThan(size10)
    })
  })

  describe('generateHexGrid', () => {
    it('should generate hex tiles within image bounds', () => {
      const width = 1000
      const height = 800
      const hexSize = 100

      const tiles = generateHexGrid(width, height, hexSize)

      // All tiles should have coordinates
      tiles.forEach((tile) => {
        expect(tile.x).toBeGreaterThanOrEqual(0)
        expect(tile.y).toBeGreaterThanOrEqual(0)
        expect(tile.id).toBeTruthy()
      })
    })

    it('should generate at least one tile', () => {
      const tiles = generateHexGrid(100, 100, 50)
      expect(tiles.length).toBeGreaterThan(0)
    })

    it('should generate unique tile IDs', () => {
      const tiles = generateHexGrid(500, 500, 50)
      const ids = new Set(tiles.map((t) => t.id))
      expect(ids.size).toBe(tiles.length)
    })

    it('should not generate tiles far outside bounds', () => {
      const width = 1000
      const height = 1000
      const hexSize = 100

      const tiles = generateHexGrid(width, height, hexSize)

      // Allow some margin but tiles shouldn't be 2x outside bounds
      tiles.forEach((tile) => {
        expect(tile.x).toBeLessThan(width + hexSize * 2)
        expect(tile.y).toBeLessThan(height + hexSize * 2)
      })
    })
  })

  describe('getHexPath', () => {
    it('should return a valid SVG path string', () => {
      const path = getHexPath(50)
      expect(path).toContain('M')
      expect(path).toContain('L')
      expect(path).toContain('Z')
    })

    it('should scale with size', () => {
      const smallPath = getHexPath(10)
      const largePath = getHexPath(100)

      // Larger size should have larger coordinates
      expect(largePath.length).toBeGreaterThan(smallPath.length)
    })

    it('should handle different sizes', () => {
      const sizes = [20, 50, 100, 200]
      sizes.forEach((size) => {
        const path = getHexPath(size)
        expect(path).toBeTruthy()
        expect(path).toContain('M')
      })
    })
  })
})
