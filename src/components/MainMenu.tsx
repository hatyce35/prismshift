import React from 'react';
import { Play, Grid, Settings, Sparkles, Award } from 'lucide-react';
import { GameProgressData } from '../types/game';
import { soundService } from '../services/audio';

interface MainMenuProps {
  progress: GameProgressData;
  onPlay: () => void;
  onOpenLevels: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onPlay,
  onOpenLevels,
  onOpenSettings,
}) => {
  const completedCount = Object.keys(progress.completedLevels).length;
  const totalStars = Object.values(progress.completedLevels).reduce(
    (sum, item) => sum + item.stars,
    0
  );

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-8 px-6 max-w-md mx-auto relative select-none">
      {/* Brand Header */}
      <div className="w-full flex flex-col items-center mt-6">
        {/* Crystal Logo Glyph */}
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-xl animate-pulse" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
            <polygon
              points="50,10 88,32 88,68 50,90 12,68 12,32"
              fill="rgba(15, 23, 42, 0.8)"
              stroke="#06b6d4"
              strokeWidth="3"
            />
            <polygon points="50,10 88,32 50,50" fill="rgba(34, 211, 238, 0.35)" />
            <polygon points="88,32 88,68 50,50" fill="rgba(6, 182, 212, 0.2)" />
            <polygon points="88,68 50,90 50,50" fill="rgba(34, 211, 238, 0.4)" />
            <polygon points="50,90 12,68 50,50" fill="rgba(8, 145, 178, 0.3)" />
            <polygon points="12,68 12,32 50,50" fill="rgba(6, 182, 212, 0.5)" />
            {/* Center neon diamond */}
            <polygon
              points="50,30 65,50 50,70 35,50"
              fill="#ffffff"
              opacity="0.9"
              style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }}
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 font-display text-center">
          NEON ESCAPE
        </h1>
        <p className="text-xs uppercase tracking-widest text-cyan-300/70 font-semibold mt-1">
          Directional Crystal Puzzle
        </p>
      </div>

      {/* Progress Card */}
      <div className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between border border-cyan-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Current Progress</div>
            <div className="text-base font-bold text-white">
              Level {progress.highestUnlockedLevel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-1">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-sm font-bold text-amber-300 font-mono">{totalStars} ★</span>
          </div>
        </div>
      </div>

      {/* Menu Action Buttons */}
      <div className="w-full flex flex-col gap-3 my-auto py-6">
        {/* Play / Continue Button */}
        <button
          onClick={() => {
            soundService.playButton();
            onPlay();
          }}
          className="w-full py-4 px-6 rounded-2xl font-bold text-lg text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>{completedCount > 0 ? `CONTINUE (LEVEL ${progress.highestUnlockedLevel})` : 'PLAY'}</span>
        </button>

        {/* Levels Button */}
        <button
          onClick={() => {
            soundService.playButton();
            onOpenLevels();
          }}
          className="w-full py-3.5 px-6 rounded-2xl font-semibold text-base text-slate-200 glass-button hover:bg-slate-800/80 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Grid className="w-5 h-5 text-cyan-400" />
          <span>LEVELS ({completedCount} Cleared)</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            soundService.playButton();
            onOpenSettings();
          }}
          className="w-full py-3.5 px-6 rounded-2xl font-semibold text-base text-slate-200 glass-button hover:bg-slate-800/80 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span>SETTINGS</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-500 tracking-wider uppercase font-medium">
        Tap pieces to guide their escape
      </div>
    </div>
  );
};
