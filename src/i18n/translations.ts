export type Language = 'en' | 'de'

export interface Translations {
  // Setup phase
  setup: {
    title: string
    subtitle: string
    selectFolder: string
    folderSelected: string
    imagesFound: string
    difficulty: {
      title: string
      easy: string
      easyDesc: string
      medium: string
      mediumDesc: string
      hard: string
      hardDesc: string
    }
    players: {
      title: string
      addPlayer: string
      playerName: string
      skip: string
      startGame: string
    }
    back: string
    continue: string
  }
  // Game phase
  game: {
    imageCounter: string // "{current} / {total}"
    clickHint: string
    scoreboard: {
      title: string
      quickPoint: string
      addPlayer: string
      newPlayerName: string
    }
    controls: {
      progress: string
      hexes: string // "{revealed} / {total} hexes"
      nextHex: string
      showImage: string
      previous: string
      next: string
      shortcuts: {
        fullscreen: string
        allShortcuts: string
      }
    }
  }
  // Common
  common: {
    language: string
    settings: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    setup: {
      title: 'Dalli-Klick',
      subtitle: 'Party Game Edition',
      selectFolder: 'Select Image Folder',
      folderSelected: 'Folder selected',
      imagesFound: '{count} images found',
      difficulty: {
        title: 'Select Difficulty',
        easy: 'Easy',
        easyDesc: '10 large hexagons - Perfect for quick rounds',
        medium: 'Medium',
        mediumDesc: '25 medium hexagons - Balanced challenge',
        hard: 'Hard',
        hardDesc: '50 small hexagons - Expert mode',
      },
      players: {
        title: 'Add Players',
        addPlayer: 'Add Player',
        playerName: 'Player name',
        skip: 'Skip (play without scoreboard)',
        startGame: 'Start Game',
      },
      back: 'Back',
      continue: 'Continue',
    },
    game: {
      imageCounter: '{current} / {total}',
      clickHint: 'Click on a tile or press Space to reveal',
      scoreboard: {
        title: 'Scoreboard',
        quickPoint: 'Press 1-{max} for quick +1 point',
        addPlayer: 'Add player',
        newPlayerName: 'New player name',
      },
      controls: {
        progress: 'Progress',
        hexes: '{revealed} / {total} hexes',
        nextHex: 'Next Hex',
        showImage: 'Show Image',
        previous: 'Previous',
        next: 'Next',
        shortcuts: {
          fullscreen: 'Press F for fullscreen',
          allShortcuts: 'Press ? for all shortcuts',
        },
      },
    },
    common: {
      language: 'Language',
      settings: 'Settings',
    },
  },
  de: {
    setup: {
      title: 'Dalli-Klick',
      subtitle: 'Party-Spiel Edition',
      selectFolder: 'Bildordner auswählen',
      folderSelected: 'Ordner ausgewählt',
      imagesFound: '{count} Bilder gefunden',
      difficulty: {
        title: 'Schwierigkeit wählen',
        easy: 'Einfach',
        easyDesc: '10 große Sechsecke - Perfekt für schnelle Runden',
        medium: 'Mittel',
        mediumDesc: '25 mittlere Sechsecke - Ausgewogene Herausforderung',
        hard: 'Schwer',
        hardDesc: '50 kleine Sechsecke - Expertenmodus',
      },
      players: {
        title: 'Spieler hinzufügen',
        addPlayer: 'Spieler hinzufügen',
        playerName: 'Spielername',
        skip: 'Überspringen (ohne Punktetafel spielen)',
        startGame: 'Spiel starten',
      },
      back: 'Zurück',
      continue: 'Weiter',
    },
    game: {
      imageCounter: '{current} / {total}',
      clickHint: 'Klicke auf ein Sechseck oder drücke Leertaste zum Aufdecken',
      scoreboard: {
        title: 'Punktetafel',
        quickPoint: 'Drücke 1-{max} für schnellen +1 Punkt',
        addPlayer: 'Spieler hinzufügen',
        newPlayerName: 'Neuer Spielername',
      },
      controls: {
        progress: 'Fortschritt',
        hexes: '{revealed} / {total} Sechsecke',
        nextHex: 'Nächstes Sechseck',
        showImage: 'Bild zeigen',
        previous: 'Zurück',
        next: 'Weiter',
        shortcuts: {
          fullscreen: 'Drücke F für Vollbild',
          allShortcuts: 'Drücke ? für alle Tastenkürzel',
        },
      },
    },
    common: {
      language: 'Sprache',
      settings: 'Einstellungen',
    },
  },
}

// Helper function to replace placeholders in translation strings
export function interpolate(str: string, params: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''))
}
