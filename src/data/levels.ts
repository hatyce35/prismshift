import { CrystalColor, CrystalShape, Direction, LevelData } from '../types/game';
import { verifyLevelSolvable } from '../logic/puzzleEngine';

const SHAPES: CrystalShape[] = ['diamond', 'hexagon', 'rounded', 'triangle', 'rectangle'];
const COLORS: CrystalColor[] = ['cyan', 'magenta', 'emerald', 'amber', 'violet', 'blue'];

/**
 * Backward-construction generator for guaranteed-solvable full-board procedural levels.
 * Starting after Level 10:
 * - Level 11–25: Full 5x5 board (all 25 cells completely filled with intricate interlocking crystals).
 * - Level 26+: Full 6x6 board (all 36 cells packed with deep multi-step dependency chains).
 */
export function generateSolvableLevel(levelId: number): LevelData {
  let gridSize = 4;
  let targetPieces = 10;
  let chapter = 1;

  if (levelId <= 10) {
    gridSize = 4;
    targetPieces = Math.min(10, 2 + levelId);
    chapter = 1;
  } else if (levelId <= 25) {
    gridSize = 5;
    targetPieces = 25; // Completely full 5x5 board
    chapter = 2;
  } else {
    gridSize = 6;
    targetPieces = 36; // Completely full 6x6 board
    chapter = 3;
  }

  const directions: Direction[] = ['up', 'down', 'left', 'right'];

  // Multi-attempt reverse generation with center-first heuristic to ensure 100% full board and 100% solvability
  let bestBoard: Array<{ row: number; col: number; direction: Direction }> = [];

  for (let attempt = 0; attempt < 80; attempt++) {
    let seed = levelId * 10007 + attempt * 7919;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const board: Array<{ row: number; col: number; direction: Direction }> = [];
    const occupied = new Set<string>();
    let failed = false;

    for (let step = 0; step < targetPieces; step++) {
      const candidates: Array<{
        row: number;
        col: number;
        dir: Direction;
        distFromCenter: number;
      }> = [];

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const key = `${r},${c}`;
          if (occupied.has(key)) continue;

          for (const dir of directions) {
            let isClear = true;
            if (dir === 'up') {
              for (let rCheck = 0; rCheck < r; rCheck++) {
                if (occupied.has(`${rCheck},${c}`)) {
                  isClear = false;
                  break;
                }
              }
            } else if (dir === 'down') {
              for (let rCheck = r + 1; rCheck < gridSize; rCheck++) {
                if (occupied.has(`${rCheck},${c}`)) {
                  isClear = false;
                  break;
                }
              }
            } else if (dir === 'left') {
              for (let cCheck = 0; cCheck < c; cCheck++) {
                if (occupied.has(`${r},${cCheck}`)) {
                  isClear = false;
                  break;
                }
              }
            } else if (dir === 'right') {
              for (let cCheck = c + 1; cCheck < gridSize; cCheck++) {
                if (occupied.has(`${r},${cCheck}`)) {
                  isClear = false;
                  break;
                }
              }
            }

            if (isClear) {
              const distFromCenter =
                Math.abs(r - (gridSize - 1) / 2) + Math.abs(c - (gridSize - 1) / 2);
              candidates.push({ row: r, col: c, dir, distFromCenter });
            }
          }
        }
      }

      if (candidates.length === 0) {
        failed = true;
        break;
      }

      // Prioritize filling inner cells first in reverse order, ensuring outer walls can still be filled
      candidates.sort(
        (a, b) => a.distFromCenter - b.distFromCenter + (pseudoRandom() - 0.5) * 1.5
      );
      const pickIdx = Math.floor(
        pseudoRandom() * Math.min(candidates.length, 3)
      );
      const chosen = candidates[pickIdx];
      board.push({ row: chosen.row, col: chosen.col, direction: chosen.dir });
      occupied.add(`${chosen.row},${chosen.col}`);
    }

    if (!failed && board.length === targetPieces) {
      bestBoard = board;
      break;
    }

    if (board.length > bestBoard.length) {
      bestBoard = board;
    }
  }

  // Create pieces with rich color and shape variety
  const pieces = bestBoard.map((p, idx) => {
    // Spatial color/shape variation so adjacent cells don't have identical colors
    const colorIdx = (p.row * 3 + p.col * 2 + levelId) % COLORS.length;
    const shapeIdx = (p.row * 2 + p.col * 3 + idx) % SHAPES.length;

    return {
      id: `l${levelId}_r${p.row}_c${p.col}`,
      row: p.row,
      col: p.col,
      direction: p.direction,
      shape: SHAPES[shapeIdx],
      color: COLORS[colorIdx],
    };
  });

  return {
    id: levelId,
    title: `Level ${levelId}`,
    chapter,
    gridSize,
    parMoves: pieces.length,
    pieces,
  };
}

/**
 * Handcrafted initial 10 tutorial and early levels designed for gentle learning
 */
const HANDCRAFTED_LEVELS: LevelData[] = [
  {
    id: 1,
    title: 'First Light',
    chapter: 1,
    gridSize: 4,
    parMoves: 2,
    pieces: [
      { id: '1_1', row: 1, col: 1, direction: 'left', shape: 'diamond', color: 'cyan' },
      { id: '1_2', row: 2, col: 2, direction: 'right', shape: 'hexagon', color: 'magenta' },
    ],
  },
  {
    id: 2,
    title: 'Opposing Flow',
    chapter: 1,
    gridSize: 4,
    parMoves: 3,
    pieces: [
      { id: '2_1', row: 1, col: 1, direction: 'up', shape: 'diamond', color: 'cyan' },
      { id: '2_2', row: 2, col: 1, direction: 'up', shape: 'rounded', color: 'amber' },
      { id: '2_3', row: 1, col: 2, direction: 'right', shape: 'triangle', color: 'emerald' },
    ],
  },
  {
    id: 3,
    title: 'Domino Chain',
    chapter: 1,
    gridSize: 4,
    parMoves: 4,
    pieces: [
      { id: '3_1', row: 0, col: 2, direction: 'up', shape: 'diamond', color: 'cyan' },
      { id: '3_2', row: 1, col: 2, direction: 'up', shape: 'hexagon', color: 'magenta' },
      { id: '3_3', row: 2, col: 2, direction: 'up', shape: 'rounded', color: 'amber' },
      { id: '3_4', row: 3, col: 2, direction: 'up', shape: 'rectangle', color: 'violet' },
    ],
  },
  {
    id: 4,
    title: 'Prism Cross',
    chapter: 1,
    gridSize: 4,
    parMoves: 4,
    pieces: [
      { id: '4_1', row: 1, col: 2, direction: 'right', shape: 'diamond', color: 'cyan' },
      { id: '4_2', row: 1, col: 1, direction: 'right', shape: 'triangle', color: 'blue' },
      { id: '4_3', row: 2, col: 1, direction: 'down', shape: 'hexagon', color: 'magenta' },
      { id: '4_4', row: 2, col: 2, direction: 'down', shape: 'rounded', color: 'emerald' },
    ],
  },
  {
    id: 5,
    title: 'Corner Carousel',
    chapter: 1,
    gridSize: 4,
    parMoves: 5,
    pieces: [
      { id: '5_1', row: 0, col: 1, direction: 'up', shape: 'diamond', color: 'cyan' },
      { id: '5_2', row: 1, col: 3, direction: 'right', shape: 'hexagon', color: 'magenta' },
      { id: '5_3', row: 1, col: 1, direction: 'left', shape: 'triangle', color: 'amber' },
      { id: '5_4', row: 2, col: 2, direction: 'down', shape: 'rounded', color: 'emerald' },
      { id: '5_5', row: 3, col: 1, direction: 'down', shape: 'rectangle', color: 'violet' },
    ],
  },
  {
    id: 6,
    title: 'The Enclosure',
    chapter: 1,
    gridSize: 4,
    parMoves: 6,
    pieces: [
      { id: '6_1', row: 0, col: 0, direction: 'left', shape: 'diamond', color: 'cyan' },
      { id: '6_2', row: 0, col: 3, direction: 'up', shape: 'hexagon', color: 'blue' },
      { id: '6_3', row: 1, col: 2, direction: 'right', shape: 'rounded', color: 'magenta' },
      { id: '6_4', row: 1, col: 1, direction: 'right', shape: 'triangle', color: 'amber' },
      { id: '6_5', row: 2, col: 1, direction: 'down', shape: 'rectangle', color: 'emerald' },
      { id: '6_6', row: 3, col: 2, direction: 'down', shape: 'diamond', color: 'violet' },
    ],
  },
  {
    id: 7,
    title: 'Tangled Rays',
    chapter: 1,
    gridSize: 4,
    parMoves: 7,
    pieces: [
      { id: '7_1', row: 0, col: 1, direction: 'up', shape: 'rounded', color: 'cyan' },
      { id: '7_2', row: 1, col: 1, direction: 'left', shape: 'hexagon', color: 'magenta' },
      { id: '7_3', row: 1, col: 2, direction: 'right', shape: 'diamond', color: 'emerald' },
      { id: '7_4', row: 2, col: 1, direction: 'down', shape: 'triangle', color: 'amber' },
      { id: '7_5', row: 2, col: 2, direction: 'right', shape: 'rectangle', color: 'blue' },
      { id: '7_6', row: 3, col: 0, direction: 'left', shape: 'diamond', color: 'violet' },
      { id: '7_7', row: 3, col: 3, direction: 'down', shape: 'rounded', color: 'cyan' },
    ],
  },
  {
    id: 8,
    title: 'Prism Matrix',
    chapter: 1,
    gridSize: 4,
    parMoves: 8,
    pieces: [
      { id: '8_1', row: 0, col: 0, direction: 'up', shape: 'diamond', color: 'cyan' },
      { id: '8_2', row: 0, col: 3, direction: 'right', shape: 'hexagon', color: 'magenta' },
      { id: '8_3', row: 1, col: 0, direction: 'left', shape: 'triangle', color: 'amber' },
      { id: '8_4', row: 1, col: 2, direction: 'up', shape: 'rounded', color: 'blue' },
      { id: '8_5', row: 2, col: 1, direction: 'down', shape: 'rectangle', color: 'emerald' },
      { id: '8_6', row: 2, col: 3, direction: 'right', shape: 'diamond', color: 'violet' },
      { id: '8_7', row: 3, col: 1, direction: 'down', shape: 'hexagon', color: 'cyan' },
      { id: '8_8', row: 3, col: 2, direction: 'down', shape: 'rounded', color: 'magenta' },
    ],
  },
  {
    id: 9,
    title: 'Neon Vortex',
    chapter: 1,
    gridSize: 4,
    parMoves: 9,
    pieces: [
      { id: '9_1', row: 0, col: 2, direction: 'up', shape: 'diamond', color: 'cyan' },
      { id: '9_2', row: 1, col: 0, direction: 'left', shape: 'hexagon', color: 'magenta' },
      { id: '9_3', row: 1, col: 2, direction: 'right', shape: 'rounded', color: 'emerald' },
      { id: '9_4', row: 1, col: 3, direction: 'up', shape: 'triangle', color: 'blue' },
      { id: '9_5', row: 2, col: 0, direction: 'down', shape: 'rectangle', color: 'amber' },
      { id: '9_6', row: 2, col: 1, direction: 'left', shape: 'diamond', color: 'violet' },
      { id: '9_7', row: 2, col: 2, direction: 'down', shape: 'hexagon', color: 'cyan' },
      { id: '9_8', row: 3, col: 1, direction: 'down', shape: 'rounded', color: 'magenta' },
      { id: '9_9', row: 3, col: 3, direction: 'right', shape: 'triangle', color: 'emerald' },
    ],
  },
  {
    id: 10,
    title: 'Genesis Finale',
    chapter: 1,
    gridSize: 4,
    parMoves: 10,
    pieces: [
      { id: '10_1', row: 0, col: 1, direction: 'up', shape: 'diamond', color: 'cyan' },
      { id: '10_2', row: 0, col: 2, direction: 'up', shape: 'hexagon', color: 'magenta' },
      { id: '10_3', row: 1, col: 0, direction: 'left', shape: 'rounded', color: 'amber' },
      { id: '10_4', row: 1, col: 1, direction: 'up', shape: 'triangle', color: 'blue' },
      { id: '10_5', row: 1, col: 3, direction: 'right', shape: 'rectangle', color: 'emerald' },
      { id: '10_6', row: 2, col: 0, direction: 'left', shape: 'diamond', color: 'violet' },
      { id: '10_7', row: 2, col: 2, direction: 'right', shape: 'hexagon', color: 'cyan' },
      { id: '10_8', row: 2, col: 3, direction: 'down', shape: 'rounded', color: 'magenta' },
      { id: '10_9', row: 3, col: 1, direction: 'down', shape: 'triangle', color: 'amber' },
      { id: '10_10', row: 3, col: 2, direction: 'down', shape: 'rectangle', color: 'blue' },
    ],
  },
];

/**
 * Precomputes 40 guaranteed-solvable levels
 */
const ALL_LEVELS: LevelData[] = (() => {
  const list: LevelData[] = [];

  for (let i = 1; i <= 40; i++) {
    if (i <= HANDCRAFTED_LEVELS.length) {
      const hc = HANDCRAFTED_LEVELS[i - 1];
      if (verifyLevelSolvable(hc.pieces, hc.gridSize)) {
        list.push(hc);
        continue;
      }
    }
    // Generate full-board procedural level for Level 11+
    const lvl = generateSolvableLevel(i);
    list.push(lvl);
  }

  return list;
})();

export function getLevelById(id: number): LevelData {
  if (id >= 1 && id <= ALL_LEVELS.length) {
    return ALL_LEVELS[id - 1];
  }
  // Infinite level support if player passes level 40!
  return generateSolvableLevel(id);
}

export function getAllLevels(): LevelData[] {
  return ALL_LEVELS;
}

export const TOTAL_LEVELS_COUNT = ALL_LEVELS.length;
