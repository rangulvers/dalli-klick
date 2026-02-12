import fs from 'node:fs/promises'
import path from 'node:path'
import sizeOf from 'image-size'
import { ImageMetadata } from '../../src/types/game.types'

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

/**
 * Load all supported images from a folder
 * Returns array of image metadata with dimensions
 */
export async function loadImagesFromFolder(
  folderPath: string
): Promise<ImageMetadata[]> {
  try {
    const files = await fs.readdir(folderPath)

    // Filter for supported image formats
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return SUPPORTED_EXTENSIONS.includes(ext)
    })

    // Load metadata for each image
    const imageMetadata: ImageMetadata[] = []

    for (const filename of imageFiles) {
      const fullPath = path.join(folderPath, filename)

      try {
        // Get image dimensions
        const dimensions = await new Promise<{ width: number; height: number }>(
          (resolve, reject) => {
            sizeOf(fullPath, (err, dimensions) => {
              if (err || !dimensions) {
                reject(err || new Error('Could not get image dimensions'))
              } else {
                resolve({
                  width: dimensions.width || 0,
                  height: dimensions.height || 0,
                })
              }
            })
          }
        )

        imageMetadata.push({
          path: fullPath,
          filename,
          width: dimensions.width,
          height: dimensions.height,
        })
      } catch (error) {
        console.warn(`Could not load image ${filename}:`, error)
        // Skip this image and continue
      }
    }

    // Sort alphabetically by filename
    imageMetadata.sort((a, b) => a.filename.localeCompare(b.filename))

    return imageMetadata
  } catch (error) {
    console.error('Error reading folder:', error)
    throw new Error(`Could not read folder: ${folderPath}`)
  }
}
