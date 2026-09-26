export type Direction = 'up' | 'down' | 'left' | 'right';

export type CrystalShape = 
  | 'diamond' 
  | 'hexagon' 
  | 'rounded' 
  | 'triangle' 
  | 'rectangle';

export type CrystalColor = 
  | 'cyan' 
  | 'magenta' 
  | 'emerald' 
  | 'amber' 
  | 'violet' 
  | 'blue';

export interface CrystalPieceData {
  id: string;
  row: number; // 0-indexed row
  col: number; // 0-indexed col
  direction: Direction;
  shape: CrystalShape;
  color: CrystalColor;
  // Animation state
  exiting?: boolean;
  exitDirection?: Direction;
  blocked?: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  chapter: number;
  gridSize: number; // e.g. 4 for 4x4, 5 for 5x5, 6 for 6x6
  parMoves: number; // For 3-star rating
  pieces: Array<{
    id: string;
    row: number;
    col: number;
    direction: Direction;
    shape: CrystalShape;
    color: CrystalColor;
  }>;
}

export interface LevelProgress {
  completed: boolean;
  stars: number; // 1, 2, or 3
  bestMoves: number;
  completedAt?: string;
}

export interface GameProgressData {
  completedLevels: Record<number, LevelProgress>;
  highestUnlockedLevel: number;
  hintsRemaining: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}

export type GameScreen = 'menu' | 'level_select' | 'gameplay' | 'settings';
