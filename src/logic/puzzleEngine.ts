import { CrystalPieceData, Direction } from '../types/game';

/**
 * Checks whether a given piece's exit path is obstructed by any other piece on the board.
 */
export function isPieceBlocked(
  piece: CrystalPieceData,
  allPieces: CrystalPieceData[],
  gridSize: number
): boolean {
  const { row, col, direction } = piece;

  switch (direction) {
    case 'up': {
      // Path from row - 1 down to 0 at column col
      return allPieces.some(
        other => other.id !== piece.id && other.col === col && other.row < row
      );
    }
    case 'down': {
      // Path from row + 1 up to gridSize - 1 at column col
      return allPieces.some(
        other => other.id !== piece.id && other.col === col && other.row > row && other.row < gridSize
      );
    }
    case 'left': {
      // Path from col - 1 down to 0 at row
      return allPieces.some(
        other => other.id !== piece.id && other.row === row && other.col < col
      );
    }
    case 'right': {
      // Path from col + 1 up to gridSize - 1 at row
      return allPieces.some(
        other => other.id !== piece.id && other.row === row && other.col > col && other.col < gridSize
      );
    }
  }
}

/**
 * Returns all pieces that currently have an unobstructed path off the board.
 */
export function getUnblockedPieces(
  pieces: CrystalPieceData[],
  gridSize: number
): CrystalPieceData[] {
  return pieces.filter(p => !isPieceBlocked(p, pieces, gridSize));
}

/**
 * Verifies whether a puzzle level can be 100% cleared.
 * Returns true if solvable, false if there is a deadlock.
 */
export function verifyLevelSolvable(
  initialPieces: Array<{ id: string; row: number; col: number; direction: Direction; shape?: any; color?: any }>,
  gridSize: number
): boolean {
  let remaining = [...initialPieces] as CrystalPieceData[];

  while (remaining.length > 0) {
    const unblocked = remaining.filter(p => !isPieceBlocked(p, remaining, gridSize));
    if (unblocked.length === 0) {
      return false; // Deadlock encountered
    }
    // Remove one unblocked piece
    const toRemove = unblocked[0];
    remaining = remaining.filter(p => p.id !== toRemove.id);
  }

  return true;
}

/**
 * Calculates star rating (1 to 3) based on moves taken vs parMoves.
 * Par moves is typically pieceCount (each tap successfully removes a piece).
 * 3 stars: moves <= parMoves + 1
 * 2 stars: moves <= parMoves + 4
 * 1 star: completed
 */
export function calculateStars(movesTaken: number, parMoves: number): number {
  if (movesTaken <= parMoves + 1) {
    return 3;
  }
  if (movesTaken <= parMoves + 4) {
    return 2;
  }
  return 1;
}
