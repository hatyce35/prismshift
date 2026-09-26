import React, { useState } from 'react';
import { ArrowLeft, Lock, Star } from 'lucide-react';
import { GameProgressData, LevelData } from '../types/game';
import { getAllLevels } from '../data/levels';
import { soundService } from '../services/audio';

interface LevelSelectProps {
  progress: GameProgressData;
  onSelectLevel: (levelId: number) => void;
  onBackToMenu: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  progress,
  onSelectLevel,
  onBackToMenu,
}) => {
  const levels = getAllLevels();
  const [selectedChapter, setSelectedChapter] = useState<number>(1);

  // Chapters: 1 (Levels 1-10), 2 (Levels 11-25), 3 (Levels 26-40)
  const chapters = [
    { id: 1, title: 'Genesis', subtitle: '4x4 Intro', range: [1, 10] },
    { id: 2, title: 'Lattice', subtitle: 'Full 5x5', range: [11, 25] },
    { id: 3, title: 'Radiance', subtitle: 'Full 6x6', range: [26, 40] },
  ];

  const filteredLevels = levels.filter((lvl) => {
    const ch = chapters.find((c) => c.id === selectedChapter);
    if (!ch) return true;
    return lvl.id >= ch.range[0] && lvl.id <= ch.range[1];
  });

  return (
    <div className="w-full h-full flex flex-col py-6 px-4 max-w-md mx-auto relative select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundService.playButton();
            onBackToMenu();
          }}
          className="w-10 h-10 rounded-xl glass-button flex items-center justify-center text-slate-300 active:scale-95 cursor-pointer"
          aria-label="Back to main menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold tracking-tight text-white font-display">
          SELECT LEVEL
        </h2>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Chapter Filter Tabs */}
      <div className="w-full grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-5">
        {chapters.map((ch) => {
          const isActive = selectedChapter === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => {
                soundService.playButton();
                setSelectedChapter(ch.id);
              }}
              className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs uppercase tracking-wider">{ch.title}</div>
              <div className="text-[10px] text-slate-500">{ch.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Levels Grid Container (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-1 pb-4 min-h-0">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {filteredLevels.map((lvl: LevelData) => {
            const isUnlocked = lvl.id <= progress.highestUnlockedLevel;
            const completedInfo = progress.completedLevels[lvl.id];
            const isCompleted = !!completedInfo;
            const stars = completedInfo?.stars || 0;
            const isCurrent = lvl.id === progress.highestUnlockedLevel;

            return (
              <button
                key={lvl.id}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    soundService.playButton();
                    onSelectLevel(lvl.id);
                  }
                }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 relative transition-all duration-200 ${
                  !isUnlocked
                    ? 'bg-slate-950/40 border border-slate-800/30 text-slate-600 opacity-60 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-2 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 cursor-pointer'
                    : isCompleted
                    ? 'glass-button border border-slate-700/80 text-white active:scale-95 cursor-pointer'
                    : 'glass-panel border border-slate-700/50 text-slate-200 active:scale-95 cursor-pointer'
                }`}
              >
                {!isUnlocked ? (
                  <Lock className="w-5 h-5 text-slate-600 mb-1" />
                ) : (
                  <>
                    <span className="text-lg font-bold font-mono tracking-tight">
                      {lvl.id}
                    </span>

                    {/* Star Indicators */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-2.5 h-2.5 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700 fill-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Subtle current badge */}
                {isCurrent && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
