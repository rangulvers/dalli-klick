import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  loadImages: (folderPath: string) => ipcRenderer.invoke('load-images', folderPath),
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen'),
  getImagePath: (imagePath: string) => ipcRenderer.invoke('get-image-path', imagePath),
  readImageAsDataUrl: (imagePath: string) => ipcRenderer.invoke('read-image-as-data-url', imagePath),
})
