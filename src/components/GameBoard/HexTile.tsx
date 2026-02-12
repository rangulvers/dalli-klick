import { motion } from 'framer-motion'
import { memo } from 'react'
import { getHexPath } from '../../utils/hexCalculations'

interface HexTileProps {
  id: string
  x: number
  y: number
  size: number
  revealed: boolean
  onClick: (tileId: string) => void
}

/**
 * HexTile component - Memoized for performance
 * Only re-renders when revealed state or id changes
 */
export const HexTile = memo(({ id, x, y, size, revealed, onClick }: HexTileProps) => {
  const path = getHexPath(size)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the background click handler
    if (!revealed) {
      onClick(id)
    }
  }

  return (
    <motion.path
      d={path}
      transform={`translate(${x}, ${y})`}
      fill="#1f2937"
      stroke="#374151"
      strokeWidth="2"
      initial={{ opacity: 1 }}
      animate={{ opacity: revealed ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      style={{
        pointerEvents: revealed ? 'none' : 'auto',
        cursor: revealed ? 'default' : 'pointer',
      }}
      onClick={handleClick}
      whileHover={!revealed ? { fill: '#374151' } : {}}
    />
  )
}, (prev, next) => {
  // Custom comparison function - only re-render if revealed changes
  return prev.revealed === next.revealed && prev.id === next.id
})
