# Troubleshooting Guide

## Fixed Issues

### 1. Preload Script Not Loading ✅ FIXED
**Error:** `Unable to load preload script: preload.js`

**Cause:** The Vite build was outputting `preload.mjs` but main.ts was looking for `preload.js`

**Fix:** Updated `electron/main.ts` line 29 to load `preload.mjs` instead of `preload.js`

### 2. ElectronAPI Undefined ✅ FIXED
**Error:** `Cannot read properties of undefined (reading 'selectFolder')`

**Cause:** Preload script wasn't loading, so `window.electronAPI` wasn't being exposed

**Fix:**
- Fixed preload script loading (see above)
- Added safety check in `ImageFolderPicker.tsx` to show helpful error if API isn't available

### 3. Local Image Loading Blocked ✅ FIXED
**Error:** `Not allowed to load local resource: file:///Users/.../Pictures/...`

**Cause:** Electron's security policy blocks loading local files via `file://` URLs in the renderer process

**Fix:** Implemented custom protocol handler `local-image://`
- Registered custom protocol in main process (line 52-56 in main.ts)
- Protocol safely serves local image files to renderer
- Updated `getImagePath` IPC handler to use custom protocol
- Alternative: `readImageAsDataUrl` converts images to base64 data URLs

### 4. Build Configuration ✅ IMPROVED
**Updated:** `vite.config.ts` to properly configure Electron builds

**Changes:**
- Explicitly set output directory for both main and preload
- Added external dependency handling for electron, image-size, fs, path modules
- Set server port to 5173

## Common Issues & Solutions

### App Won't Start
```bash
# Clean build and restart
rm -rf dist-electron dist node_modules
npm install
npm run dev
```

### "Electron API not available" Error
1. Make sure you're running the app through `npm run dev` (not opening index.html directly)
2. Check that `dist-electron/preload.mjs` exists
3. Restart the dev server

### Images Not Loading
1. Make sure image folder contains supported formats: JPG, PNG, WEBP, GIF
2. Check file permissions on the folder
3. Try selecting a different folder
4. Check console for specific error messages

### Keyboard Shortcuts Not Working
1. Make sure you're not typing in an input field
2. Game must be in 'playing' or 'revealed' phase (not setup)
3. Check browser console for JavaScript errors

### GPU Process Warnings
These warnings are harmless and can be ignored:
```
ERROR:command_buffer_proxy_impl.cc
ERROR:gpu_process_host.cc
ERROR:ax_tree.cc
```
They don't affect app functionality.

### Content Security Policy Warning
This warning only shows in development mode and won't appear in the packaged app. It's safe to ignore during development.

## Dev Server Commands

```bash
# Start development server
npm run dev

# Kill all running instances (if app hangs)
pkill -f "vite|electron"

# Clean build
rm -rf dist-electron dist
npm run dev

# Build for production
npm run build:mac  # macOS
npm run build:win  # Windows
```

## Testing Checklist

After fixing issues, test these:
- [ ] App starts without errors
- [ ] "Select Folder" button works
- [ ] Images load from selected folder
- [ ] Hex grid appears over image
- [ ] Click reveals hexagons
- [ ] Space key reveals hexagons
- [ ] Enter key shows full image
- [ ] Arrow keys navigate between images
- [ ] Can add players
- [ ] Score buttons work
- [ ] Number keys (1-9) award points
- [ ] F key toggles fullscreen

## Getting Help

If you encounter issues:
1. Check the browser console (F12 in Electron window)
2. Check the terminal where you ran `npm run dev`
3. Review this troubleshooting guide
4. Check `IMPLEMENTATION.md` for technical details

## Current Status

✅ All critical issues have been fixed
✅ App should now start properly
✅ Electron API should be available
✅ Image loading should work
✅ All features should be functional

Run `npm run dev` to test!
