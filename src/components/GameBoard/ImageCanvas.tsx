import { useEffect, useState } from 'react'
import { logger } from '../../utils/logger'

interface ImageCanvasProps {
  imagePath: string
  onLoad: (width: number, height: number) => void
}

export function ImageCanvas({ imagePath, onLoad }: ImageCanvasProps) {
  const [displayPath, setDisplayPath] = useState<string>('')

  useEffect(() => {
    // Convert path to file:// URL for Electron
    const loadPath = async () => {
      if (window.electronAPI) {
        const path = await window.electronAPI.getImagePath(imagePath)
        setDisplayPath(path)
      } else {
        setDisplayPath(imagePath)
      }
    }
    loadPath()
  }, [imagePath])

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight
    const containerWidth = img.clientWidth
    const containerHeight = img.clientHeight

    // Calculate the actual rendered dimensions after object-fit: contain
    const imageAspectRatio = naturalWidth / naturalHeight
    const containerAspectRatio = containerWidth / containerHeight

    let renderedWidth: number
    let renderedHeight: number

    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider - constrained by width
      renderedWidth = containerWidth
      renderedHeight = containerWidth / imageAspectRatio
    } else {
      // Image is taller - constrained by height
      renderedHeight = containerHeight
      renderedWidth = containerHeight * imageAspectRatio
    }

    logger.log(`Image rendered: ${renderedWidth.toFixed(0)}x${renderedHeight.toFixed(0)} (original: ${naturalWidth}x${naturalHeight})`)
    onLoad(renderedWidth, renderedHeight)
  }

  if (!displayPath) return null

  return (
    <img
      src={displayPath}
      alt="Game image"
      className="w-full h-full object-contain"
      onLoad={handleImageLoad}
      draggable={false}
    />
  )
}
