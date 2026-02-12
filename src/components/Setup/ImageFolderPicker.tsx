import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { logger } from '../../utils/logger'
import { Folder } from 'lucide-react'

interface ImageFolderPickerProps {
  onFolderSelected: (path: string, imageCount: number) => void
}

export function ImageFolderPicker({ onFolderSelected }: ImageFolderPickerProps) {
  const { t, interpolate } = useLanguage()
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [imageCount, setImageCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectFolder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if Electron API is available
      if (!window.electronAPI) {
        setError('Electron API not available. Please restart the app.')
        setIsLoading(false)
        return
      }

      const folderPath = await window.electronAPI.selectFolder()

      if (!folderPath) {
        setIsLoading(false)
        return
      }

      const images = await window.electronAPI.loadImages(folderPath)

      if (images.length === 0) {
        setError('No images found in selected folder')
        setSelectedPath(null)
        setImageCount(0)
      } else {
        setSelectedPath(folderPath)
        setImageCount(images.length)
        onFolderSelected(folderPath, images.length)
      }
    } catch (err) {
      setError('Failed to load images from folder')
      logger.error('Image loading error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-white mb-4">{t.setup.selectFolder}</h2>

      <button
        onClick={handleSelectFolder}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-4 px-6 rounded-lg transition-colors font-medium flex items-center justify-center gap-3 mb-4"
      >
        <Folder size={24} />
        {isLoading ? 'Loading...' : t.setup.selectFolder}
      </button>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {selectedPath && imageCount > 0 && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
          <p className="font-medium mb-1">✓ {t.setup.folderSelected}</p>
          <p className="text-sm text-green-300 break-all mb-2">{selectedPath}</p>
          <p className="text-lg font-bold">{interpolate(t.setup.imagesFound, { count: String(imageCount) })}</p>
        </div>
      )}
    </div>
  )
}
