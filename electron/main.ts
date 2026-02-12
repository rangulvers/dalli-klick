import { app, BrowserWindow, ipcMain, dialog, protocol } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadImagesFromFolder } from './utils/fileLoader'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure:
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC!, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }
}

// Register custom protocol for loading local images
app.whenReady().then(() => {
  // Register a custom protocol to serve local images
  protocol.registerFileProtocol('local-image', (request, callback) => {
    const url = request.url.replace('local-image://', '')
    const decodedPath = decodeURIComponent(url)
    callback({ path: decodedPath })
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers

// Select folder dialog
ipcMain.handle('select-folder', async () => {
  if (!win) return null

  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    title: 'Select Image Folder',
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

// Helper function to validate file paths
function validatePath(filePath: string): boolean {
  // Must be absolute path
  if (!path.isAbsolute(filePath)) {
    return false
  }

  // Must not contain path traversal attempts
  if (filePath.includes('..')) {
    return false
  }

  return true
}

// Load images from folder
ipcMain.handle('load-images', async (_, folderPath: string) => {
  try {
    // Validate input
    if (!validatePath(folderPath)) {
      throw new Error('Invalid folder path')
    }

    return await loadImagesFromFolder(folderPath)
  } catch (error) {
    console.error('Error loading images:', error)
    throw error
  }
})

// Toggle fullscreen
ipcMain.on('toggle-fullscreen', () => {
  if (!win) return

  if (win.isFullScreen()) {
    win.setFullScreen(false)
  } else {
    win.setFullScreen(true)
  }
})

// Get image path (convert to custom protocol URL)
ipcMain.handle('get-image-path', (_, imagePath: string) => {
  // Validate input
  if (!validatePath(imagePath)) {
    throw new Error('Invalid image path')
  }

  // Use custom protocol that allows loading local files
  return `local-image://${encodeURIComponent(imagePath)}`
})

// Read image as base64 data URL (alternative method)
ipcMain.handle('read-image-as-data-url', async (_, imagePath: string) => {
  try {
    // Validate input
    if (!validatePath(imagePath)) {
      throw new Error('Invalid image path')
    }

    const imageBuffer = await fs.promises.readFile(imagePath)
    const base64 = imageBuffer.toString('base64')
    const ext = path.extname(imagePath).toLowerCase()

    // Determine MIME type
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    }

    const mimeType = mimeTypes[ext] || 'image/jpeg'
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Error reading image:', error)
    throw error
  }
})
