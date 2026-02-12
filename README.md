# Dalli-Klick Party Game

A digital version of the German game show "Dalli-Klick" for party use. The game reveals hidden images progressively through hexagonal tiles - players guess what the image shows, earning more points for earlier correct guesses.

## Features

- **Hexagonal reveal system**: Images are covered by ~60 hexagonal tiles that disappear one by one in random order
- **Score tracking**: Add multiple players/teams and track scores with quick keyboard shortcuts
- **Fullscreen mode**: Perfect for projector/TV display at parties
- **Simple setup**: Drop images in a folder, select it, and start playing
- **Keyboard shortcuts**: Fast host controls for smooth gameplay
- **Cross-platform**: Works on macOS and Windows

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

```bash
npm run dev
```

### Build for distribution

```bash
# macOS
npm run build:mac

# Windows
npm run build:win
```

## How to Play

1. **Setup**:
   - Launch the app
   - Select a folder containing images (JPG, PNG, WEBP, GIF)
   - Add player names (optional)

2. **Gameplay**:
   - Image appears covered with hexagonal tiles
   - Click anywhere or press Space to reveal tiles one by one
   - Players guess what the image shows
   - Award points when someone guesses correctly
   - Press Enter to reveal the full image
   - Navigate to next/previous images with arrow keys

3. **Scoring**:
   - Click +1, +2, +3 buttons on player cards
   - Or press 1-9 on keyboard for quick +1 point to players 1-9
   - Earlier guesses = more points!

## Keyboard Shortcuts

- **Space**: Reveal next hex
- **Enter**: Show full image
- **→/←**: Next/previous image
- **F**: Toggle fullscreen
- **1-9**: Award +1 point to player 1-9
- **S**: Toggle scoreboard

## Project Structure

```
dalli-klick/
├── electron/          # Electron main process
├── src/
│   ├── components/    # React components
│   ├── store/         # Zustand state management
│   ├── utils/         # Hex calculations & utilities
│   └── hooks/         # React hooks
├── images/            # Default image folder
└── package.json
```

## Technologies

- Electron 28+ - Desktop framework
- React 18 + TypeScript - UI
- Zustand - State management
- Tailwind CSS - Styling
- Framer Motion - Animations
- Vite - Build tool

## License

MIT
