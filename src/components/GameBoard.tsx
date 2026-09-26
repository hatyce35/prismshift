import React from 'react';
import { CrystalPieceData } from '../types/game';
import { CrystalPiece } from './CrystalPiece';

interface GameBoardProps {
  gridSize: number;
  pieces: CrystalPieceData[];
  hintedPieceId: string | null;
  onPieceTap: (piece: CrystalPieceData) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize,
  pieces,
  hintedPieceId,
  onPieceTap,
}) => {
  // Map coordinates to piece
  const pieceMap = React.useMemo(() => {
    const map = new Map<string, CrystalPieceData>();
    pieces.forEach((p) => {
      map.set(`${p.row},${p.col}`, p);
    });
    return map;
  }, [pieces]);

  // Generate grid cells
  const cells = React.useMemo(() => {
    const items = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        items.push({ row: r, col: c, key: `${r}-${c}` });
      }
    }
    return items;
  }, [gridSize]);

  return (
    <div className="w-full max-w-[390px] aspect-square relative flex items-center justify-center p-3 select-none touch-manipulation">
      {/* Outer ambient glow frame */}
      <div className="absolute inset-2 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-rose-500/10 blur-xl pointer-events-none" />

      {/* Main Board Container */}
      <div className="relative w-full h-full rounded-2xl p-2.5 bg-slate-950/80 border border-slate-800/80 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-visible">
        {/* Subtle grid perimeter marks */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 h-12 w-[2px] bg-gradient-to-b from-transparent via-violet-400/50 to-transparent" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-12 w-[2px] bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent" />

        {/* Grid of Cells */}
        <div
          className="w-full h-full grid gap-1.5 sm:gap-2 relative"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell) => {
            const piece = pieceMap.get(`${cell.row},${cell.col}`);
            const isHinted = piece ? piece.id === hintedPieceId : false;

            return (
              <div
                key={cell.key}
                className="relative rounded-xl bg-slate-900/60 border border-slate-800/40 flex items-center justify-center transition-colors duration-200"
              >
                {/* Subtle cell center dot guide */}
                <div className="w-1 h-1 rounded-full bg-slate-800/80 pointer-events-none" />

                {/* If cell has a piece, render it */}
                {piece && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <CrystalPiece
                      piece={piece}
                      isHinted={isHinted}
                      onTap={onPieceTap}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
