/**
 * Generate random reveal sequence using Fisher-Yates shuffle
 * Returns array of indices representing the order hexes should be revealed
 */
export function generateRevealSequence(totalTiles: number): number[] {
  const sequence = Array.from({ length: totalTiles }, (_, i) => i)

  // Fisher-Yates shuffle
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[sequence[i], sequence[j]] = [sequence[j], sequence[i]]
  }

  return sequence
}
