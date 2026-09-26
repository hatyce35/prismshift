import { GameProgressData, GameSettings } from '../types/game';

const STORAGE_KEYS = {
  PROGRESS: 'neon_escape_progress_v1',
  SETTINGS: 'neon_escape_settings_v1',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
};

const DEFAULT_PROGRESS: GameProgressData = {
  completedLevels: {},
  highestUnlockedLevel: 1,
  hintsRemaining: 5,
};

export const storageService = {
  loadProgress(): GameProgressData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          completedLevels: parsed.completedLevels || {},
          highestUnlockedLevel: parsed.highestUnlockedLevel || 1,
          hintsRemaining: parsed.hintsRemaining ?? 5,
        };
      }
    } catch {
      // Ignore error
    }
    return DEFAULT_PROGRESS;
  },

  saveProgress(progress: GameProgressData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch {
      // Ignore error
    }
  },

  recordLevelComplete(levelId: number, moves: number, stars: number): GameProgressData {
    const progress = this.loadProgress();
    const existing = progress.completedLevels[levelId];

    const bestMoves = existing ? Math.min(existing.bestMoves, moves) : moves;
    const bestStars = existing ? Math.max(existing.stars, stars) : stars;

    progress.completedLevels[levelId] = {
      completed: true,
      stars: bestStars,
      bestMoves,
      completedAt: new Date().toISOString(),
    };

    if (levelId >= progress.highestUnlockedLevel) {
      progress.highestUnlockedLevel = levelId + 1;
    }

    this.saveProgress(progress);
    return progress;
  },

  useHint(): { success: boolean; remaining: number } {
    const progress = this.loadProgress();
    if (progress.hintsRemaining > 0) {
      progress.hintsRemaining -= 1;
      this.saveProgress(progress);
      return { success: true, remaining: progress.hintsRemaining };
    }
    return { success: false, remaining: 0 };
  },

  addHints(count: number = 3): number {
    const progress = this.loadProgress();
    progress.hintsRemaining += count;
    this.saveProgress(progress);
    return progress.hintsRemaining;
  },

  loadSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  },

  resetProgress(): GameProgressData {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    } catch {
      // Ignore
    }
    return DEFAULT_PROGRESS;
  },
};
