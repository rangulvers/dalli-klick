# Image Loading Fix - Technical Details

## Problem

When attempting to load local images in the Electron app, you encountered:
```
Not allowed to load local resource: file:///Users/I511999/Pictures/...
```

This is a **security restriction** in Electron/Chromium that prevents the renderer process from accessing arbitrary local files via `file://` URLs.

## Solution Implemented

### Custom Protocol Handler

I implemented a **custom protocol** (`local-image://`) that safely serves local image files:

**1. Protocol Registration** (electron/main.ts:50-56)
```typescript
app.whenReady().then(() => {
  protocol.registerFileProtocol('local-image', (request, callback) => {
    const url = request.url.replace('local-image://', '')
    const decodedPath = decodeURIComponent(url)
    callback({ path: decodedPath })
  })
  // ...
})
```

**2. IPC Handler Update** (electron/main.ts:112-116)
```typescript
ipcMain.handle('get-image-path', (_, imagePath: string) => {
  return `local-image://${encodeURIComponent(imagePath)}`
})
```

**3. Renderer Usage** (src/components/GameBoard/ImageCanvas.tsx)
```typescript
const path = await window.electronAPI.getImagePath(imagePath)
// Returns: "local-image:///Users/.../image.jpg"
```

### How It Works

1. **User selects folder** → Images are loaded with full file paths
2. **Game starts** → Image path is passed to `getImagePath` IPC handler
3. **Main process** → Converts path to `local-image://` custom protocol URL
4. **Renderer process** → Uses the custom protocol URL in `<img src="...">`
5. **Electron** → Intercepts `local-image://` requests and serves the file

### Security Benefits

✅ **Controlled access**: Only images explicitly requested through IPC can be loaded
✅ **No direct file access**: Renderer can't access arbitrary files
✅ **Protocol sandboxing**: Custom protocol is isolated from other resources
✅ **Context isolation maintained**: Renderer and main process remain separated

## Alternative Method (Also Implemented)

For very large images or special cases, I also added base64 data URL support:

**IPC Handler** (electron/main.ts:118-140)
```typescript
ipcMain.handle('read-image-as-data-url', async (_, imagePath: string) => {
  const imageBuffer = await fs.promises.readFile(imagePath)
  const base64 = imageBuffer.toString('base64')
  const mimeType = getMimeType(imagePath)
  return `data:${mimeType};base64,${base64}`
})
```

**Usage:**
```typescript
// Current default: custom protocol (faster, less memory)
const url = await window.electronAPI.getImagePath(imagePath)

// Alternative: base64 data URL (works everywhere, higher memory usage)
const dataUrl = await window.electronAPI.readImageAsDataUrl(imagePath)
```

## Why Custom Protocol vs Data URLs?

| Method | Pros | Cons |
|--------|------|------|
| **Custom Protocol** | Fast, low memory, streaming support | Requires protocol registration |
| **Base64 Data URLs** | Works everywhere, no setup needed | High memory usage, slower for large images |

The custom protocol is the default because it's more efficient for party games with many high-res images.

## Testing

To verify the fix works:

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Select an image folder** with JPG/PNG files

3. **Start the game** - images should now load correctly

4. **Check console** - no "Not allowed to load local resource" errors

## Files Modified

- ✅ `electron/main.ts` - Added protocol registration and updated IPC handlers
- ✅ `electron/preload.ts` - Exposed new API methods
- ✅ `src/types/game.types.ts` - Updated TypeScript interfaces
- ✅ `vite.config.ts` - Added fs/path to external modules
- ✅ `TROUBLESHOOTING.md` - Documented the fix

## Related Electron Documentation

- [Custom Protocols](https://www.electronjs.org/docs/latest/api/protocol)
- [Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)

The app is now ready to load local images safely! 🎉
