# Dalli-Klick Party Game

A digital version of the German game show "Dalli-Klick" for party use. The game reveals hidden images progressively through hexagonal tiles - players guess what the image shows, earning more points for earlier correct guesses.

## ✨ Features

### Core Gameplay
- **Interactive hexagonal reveal system**: Click individual tiles or use spacebar for random reveals
- **Difficulty levels**: Easy (10 tiles), Medium (25 tiles), Hard (50 tiles)
- **Smart image scaling**: Automatically handles portrait, landscape, and square images
- **Random reveal sequence**: Unpredictable tile removal for fair gameplay

### Player Experience
- **Multilingual UI**: English/German with automatic system language detection
- **Score tracking**: Add multiple players/teams and track scores with quick keyboard shortcuts
- **Fullscreen mode**: Perfect for projector/TV display at parties
- **Comprehensive keyboard shortcuts**: Fast host controls for smooth gameplay (Space, Enter, R, Esc, ?, Arrow keys, 1-9)

### Technical Excellence
- **Production-ready**: Error boundaries, input validation, CSP security headers
- **Performance optimized**: React.memo optimization, efficient re-rendering
- **Type-safe**: 100% TypeScript with strict mode
- **Tested**: 18 unit tests covering core utilities
- **Cross-platform**: macOS and Windows builds

## 📦 Installation

### Download Pre-built Binaries
Check the [Releases](https://github.com/rangulvers/dalli-klick/releases) page for:
- macOS: `.dmg` installer (Apple Silicon)
- Windows: `.exe` installer + portable version

### Build from Source

1. Clone this repository:
   ```bash
   git clone https://github.com/rangulvers/dalli-klick.git
   cd dalli-klick
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development:
   ```bash
   npm run dev
   ```

4. Build for distribution:
   ```bash
   # macOS
   npm run build:mac

   # Windows (can build from Mac)
   npm run build:win
   ```

## 🎮 How to Play

### Setup
1. Launch the app
2. Select a folder containing images (JPG, PNG, WEBP, GIF)
3. Choose difficulty level (Easy/Medium/Hard)
4. Add player names (optional)
5. Start game!

### Gameplay
1. Image appears covered with hexagonal tiles
2. **Click individual tiles** to reveal specific areas OR **press Space** for random reveals
3. Players guess what the image shows
4. Award points when someone guesses correctly (+1, +2, +3 buttons)
5. Press **Enter** to reveal the full image
6. Navigate to next/previous images with **Arrow keys**
7. Press **?** to see all keyboard shortcuts

### Scoring Strategy
- Earlier guesses = more points!
- Use **1-9 keys** for quick +1 point to players 1-9
- Track scores on the right sidebar

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Reveal random hex tile |
| `Enter` | Show full image |
| `← →` | Navigate images |
| `R` | Restart from first image |
| `Esc` | Return to setup screen |
| `F` | Toggle fullscreen |
| `?` | Show shortcuts help |
| `1-9` | Award +1 point to player 1-9 |

## 🏗️ Project Structure

```
dalli-klick/
├── electron/                    # Electron main process
│   ├── main.ts                 # Main process & IPC handlers
│   ├── preload.ts              # Secure IPC bridge
│   └── utils/
│       └── fileLoader.ts       # Image loading utilities
│
├── src/
│   ├── components/
│   │   ├── GameBoard/          # Game rendering
│   │   ├── Controls/           # Controls & scoreboard
│   │   ├── Setup/              # Setup wizard
│   │   ├── Settings/           # Settings components
│   │   └── ErrorBoundary.tsx  # Error handling
│   │
│   ├── store/                  # Zustand state management
│   │   ├── gameStore.ts        # Game state
│   │   └── scoreStore.ts       # Player scores
│   │
│   ├── i18n/                   # Internationalization
│   │   ├── LanguageContext.tsx # Language provider
│   │   └── translations.ts     # EN/DE translations
│   │
│   ├── utils/                  # Utilities
│   │   ├── hexCalculations.ts # Hex grid math
│   │   ├── revealSequence.ts  # Randomization
│   │   ├── logger.ts           # Logging system
│   │   └── __tests__/          # Unit tests
│   │
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript definitions
│
├── images/                     # Sample images folder
└── package.json
```

## 🛠️ Technologies

- **Electron 28** - Desktop framework with security hardening
- **React 18 + TypeScript** - UI framework (strict mode)
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Vite** - Lightning-fast build tool
- **Vitest** - Unit testing framework

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test:run

# Run tests with UI
npm test:ui
```

**Current coverage**: 18 tests covering hexagon calculations, grid generation, and reveal sequences.

## 🔒 Security

- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ IPC input validation
- ✅ Content Security Policy (CSP)
- ✅ No eval or unsafe code execution

## 🌍 Internationalization

- **Supported languages**: English, German
- **Auto-detection**: Uses system language on first launch
- **Manual switching**: Language selector in setup screen
- **Persistent**: Language preference saved to localStorage

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Inspired by the German TV game show "Dalli Dalli" hosted by Hans Rosenthal (1971-1986).
