import { describe, it, expect } from 'vitest'
import { generateRevealSequence } from '../revealSequence'

describe('revealSequence', () => {
  describe('generateRevealSequence', () => {
    it('should generate a sequence of correct length', () => {
      const length = 25
      const sequence = generateRevealSequence(length)
      expect(sequence).toHaveLength(length)
    })

    it('should contain all numbers from 0 to length-1', () => {
      const length = 10
      const sequence = generateRevealSequence(length)

      for (let i = 0; i < length; i++) {
        expect(sequence).toContain(i)
      }
    })

    it('should not have duplicates', () => {
      const length = 50
      const sequence = generateRevealSequence(length)
      const uniqueValues = new Set(sequence)
      expect(uniqueValues.size).toBe(length)
    })

    it('should be randomized (not sequential)', () => {
      const length = 20
      const sequence = generateRevealSequence(length)

      // Check if it's not just [0, 1, 2, 3, ...]
      const isSequential = sequence.every((val, idx) => val === idx)
      expect(isSequential).toBe(false)
    })

    it('should handle edge cases', () => {
      // Empty
      expect(generateRevealSequence(0)).toHaveLength(0)

      // Single item
      const single = generateRevealSequence(1)
      expect(single).toHaveLength(1)
      expect(single[0]).toBe(0)

      // Two items
      const two = generateRevealSequence(2)
      expect(two).toHaveLength(2)
      expect(new Set(two).size).toBe(2)
    })

    it('should generate different sequences on multiple calls', () => {
      const length = 20
      const seq1 = generateRevealSequence(length)
      const seq2 = generateRevealSequence(length)

      // Very unlikely to generate identical sequences
      expect(seq1).not.toEqual(seq2)
    })
  })
})
