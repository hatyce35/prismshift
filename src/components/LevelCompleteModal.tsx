import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, Grid } from 'lucide-react';
import { soundService } from '../services/audio';

interface LevelCompleteModalProps {
  levelId: number;
  moves: number;
  parMoves: number;
  stars: number;
  isNewBest: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelId,
  moves,
  parMoves,
  stars,
  isNewBest,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  useEffect(() => {
    soundService.playLevelComplete();

    // Burst neon crystal confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#a855f7'],
        disableForReducedMotion: true,
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#06b6d4', '#38bdf8', '#a855f7'],
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f43f5e', '#f59e0b', '#10b981'],
        });
      }, 250);

      return () => clearTimeout(timer);
    } catch {
      // Safe fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900/95 border border-slate-700/60 p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Level Complete Title */}
        <span className="text-xs uppercase tracking-widest font-semibold text-cyan-400 mb-1">
          Level {levelId}
        </span>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4">
          LEVEL CLEAR!
        </h2>

        {/* Animated Stars */}
        <div className="flex items-center justify-center gap-3 my-2">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className="transition-all duration-500 transform"
                style={{
                  transitionDelay: `${starIdx * 150}ms`,
                  transform: isEarned ? 'scale(1.15)' : 'scale(0.9)',
                }}
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    isEarned
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Moves & Score Stats */}
        <div className="w-full grid grid-cols-2 gap-2 my-5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Moves</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5">{moves}</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Target</span>
            <span className="text-xl font-bold text-slate-300 font-mono mt-0.5">{parMoves}</span>
          </div>
        </div>

        {isNewBest && (
          <div className="text-xs font-semibold text-emerald-400 mb-4 animate-pulse">
            ★ New Personal Best!
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundService.playButton();
              onNextLevel();
            }}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>NEXT LEVEL</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="w-full grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                soundService.playButton();
                onReplay();
              }}
              className="py-3 px-4 rounded-xl font-semibold text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>

            <button
              onClick={() => {
                soundService.playButton();
                onLevelSelect();
              }}
              className="py-3 px-4 rounded-xl font-semibold text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Grid className="w-4 h-4" />
              <span>Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
