import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, Undo2, Star } from 'lucide-react';
import { CrystalPieceData, LevelData } from '../types/game';
import { GameBoard } from './GameBoard';
import { isPieceBlocked, getUnblockedPieces, calculateStars } from '../logic/puzzleEngine';
import { soundService } from '../services/audio';

interface GameplayScreenProps {
  level: LevelData;
  hintsRemaining: number;
  onLevelComplete: (moves: number, stars: number) => void;
  onUseHint: () => boolean;
  onRefillHints: () => void;
  onBack: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  level,
  hintsRemaining,
  onLevelComplete,
  onUseHint,
  onRefillHints,
  onBack,
}) => {
  const [pieces, setPieces] = useState<CrystalPieceData[]>([]);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [hintedPieceId, setHintedPieceId] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<CrystalPieceData[]>>([]);
  const [showHintRefillPrompt, setShowHintRefillPrompt] = useState<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  // Initialize level pieces
  useEffect(() => {
    setPieces(level.pieces.map((p) => ({ ...p, exiting: false, blocked: false })));
    setMovesCount(0);
    setComboCount(0);
    setHintedPieceId(null);
    setHistory([]);
    isTransitioningRef.current = false;
  }, [level]);

  // Handle piece click
  const handlePieceTap = (tappedPiece: CrystalPieceData) => {
    if (tappedPiece.exiting) return;

    // Check if path is blocked
    const blocked = isPieceBlocked(tappedPiece, pieces, level.gridSize);

    if (blocked) {
      soundService.playBlocked();
      // Trigger blocked shake animation
      setPieces((prev) =>
        prev.map((p) => (p.id === tappedPiece.id ? { ...p, blocked: true } : p))
      );
      setTimeout(() => {
        setPieces((prev) =>
          prev.map((p) => (p.id === tappedPiece.id ? { ...p, blocked: false } : p))
        );
      }, 350);
      return;
    }

    // Path is CLEAR! Successful escape!
    soundService.playMove(comboCount);
    setComboCount((prev) => prev + 1);

    // Save previous state for Undo
    setHistory((prev) => [...prev, pieces]);

    // Animate piece exit
    setPieces((prev) =>
      prev.map((p) =>
        p.id === tappedPiece.id ? { ...p, exiting: true, exitDirection: p.direction } : p
      )
    );

    // After exit animation finishes, remove from active pieces
    setTimeout(() => {
      setPieces((prev) => {
        const nextPieces = prev.filter((p) => p.id !== tappedPiece.id);
        const newMoves = movesCount + 1;
        setMovesCount(newMoves);

        // Check if level is cleared!
        if (nextPieces.length === 0 && !isTransitioningRef.current) {
          isTransitioningRef.current = true;
          const stars = calculateStars(newMoves, level.parMoves);
          setTimeout(() => {
            onLevelComplete(newMoves, stars);
          }, 300);
        }

        return nextPieces;
      });
    }, 320);

    // Clear hint if player moved the hinted piece
    if (hintedPieceId === tappedPiece.id) {
      setHintedPieceId(null);
    }
  };

  // Restart level
  const handleRestart = () => {
    soundService.playButton();
    setPieces(level.pieces.map((p) => ({ ...p, exiting: false, blocked: false })));
    setMovesCount(0);
    setComboCount(0);
    setHintedPieceId(null);
    setHistory([]);
    isTransitioningRef.current = false;
  };

  // Undo move
  const handleUndo = () => {
    if (history.length === 0) return;
    soundService.playButton();
    const prevHistory = [...history];
    const previousState = prevHistory.pop();
    if (previousState) {
      setPieces(previousState.map((p) => ({ ...p, exiting: false, blocked: false })));
      setHistory(prevHistory);
      setMovesCount((prev) => Math.max(0, prev - 1));
      setHintedPieceId(null);
    }
  };

  // Hint action
  const handleHint = () => {
    if (hintsRemaining <= 0) {
      setShowHintRefillPrompt(true);
      return;
    }

    const unblocked = getUnblockedPieces(pieces, level.gridSize);
    if (unblocked.length === 0) return;

    const success = onUseHint();
    if (success) {
      soundService.playHint();
      // Pick first unblocked candidate
      const target = unblocked[0];
      setHintedPieceId(target.id);

      // Auto-clear hint after 3.5s
      setTimeout(() => {
        setHintedPieceId((current) => (current === target.id ? null : current));
      }, 3500);
    }
  };

  const currentEstimatedStars = calculateStars(movesCount, level.parMoves);

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-4 px-3 max-w-md mx-auto relative select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <button
          onClick={() => {
            soundService.playButton();
            onBack();
          }}
          className="w-10 h-10 rounded-xl glass-button flex items-center justify-center text-slate-300 active:scale-95 cursor-pointer"
          aria-label="Back to level select"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-cyan-400">
            {level.title}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-3.5 h-3.5 ${
                  starIdx <= currentEstimatedStars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-10 h-10 rounded-xl glass-button flex items-center justify-center text-slate-300 active:scale-95 cursor-pointer"
          title="Restart Level"
          aria-label="Restart level"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Info Card: Moves and Target */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-xl glass-panel border border-slate-800 text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Moves:</span>
          <span className="text-white font-bold font-mono text-sm">{movesCount}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Target: <span className="font-semibold text-slate-200">{level.parMoves}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Remaining: <span className="font-semibold text-cyan-300">{pieces.length}</span>
        </div>
      </div>

      {/* Main Responsive Square Board */}
      <div className="flex-1 w-full flex items-center justify-center my-auto min-h-0">
        <GameBoard
          gridSize={level.gridSize}
          pieces={pieces}
          hintedPieceId={hintedPieceId}
          onPieceTap={handlePieceTap}
        />
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full flex items-center justify-between gap-3 pt-2">
        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className={`flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
            history.length > 0
              ? 'glass-button text-slate-200 hover:text-white active:scale-95 cursor-pointer'
              : 'bg-slate-900/40 border border-slate-800/40 text-slate-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
          <span>Undo</span>
        </button>

        {/* Hint Button */}
        <button
          onClick={handleHint}
          className="flex-1 py-3 px-3 rounded-2xl glass-button text-amber-300 border border-amber-500/30 hover:bg-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>Hint ({hintsRemaining})</span>
        </button>
      </div>

      {/* Hint Refill Modal if hints are 0 */}
      {showHintRefillPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-2xl glass-panel p-5 border border-amber-500/30 text-center flex flex-col items-center">
            <Lightbulb className="w-10 h-10 text-amber-400 mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Need More Hints?</h3>
            <p className="text-xs text-slate-300 mb-4">
              Here are 3 free bonus hints to help guide your crystals through tricky stages!
            </p>
            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => {
                  soundService.playButton();
                  onRefillHints();
                  setShowHintRefillPrompt(false);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                Claim +3 Hints
              </button>
              <button
                onClick={() => setShowHintRefillPrompt(false)}
                className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                I’ll solve it myself
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
