import React, { useState, useEffect } from 'react';
import { GameProgressData, GameScreen, GameSettings, LevelData } from './types/game';
import { storageService } from './services/storage';
import { soundService } from './services/audio';
import { getLevelById, TOTAL_LEVELS_COUNT } from './data/levels';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { GameplayScreen } from './components/GameplayScreen';
import { SettingsModal } from './components/SettingsModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { AmbientBackground } from './components/AmbientBackground';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [progress, setProgress] = useState<GameProgressData>(() => storageService.loadProgress());
  const [settings, setSettings] = useState<GameSettings>(() => storageService.loadSettings());
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [completedLevelData, setCompletedLevelData] = useState<{
    levelId: number;
    moves: number;
    stars: number;
    parMoves: number;
    isNewBest: boolean;
  } | null>(null);

  // Sync audio service with initial settings
  useEffect(() => {
    soundService.setSoundEnabled(settings.soundEnabled);
    soundService.setVibrationEnabled(settings.vibrationEnabled);
    // User gesture needed for audioContext, will activate smoothly on first tap
  }, [settings]);

  // Load level data
  const currentLevel: LevelData = React.useMemo(() => {
    return getLevelById(currentLevelId);
  }, [currentLevelId]);

  // Start / Continue Game from Menu
  const handleStartPlay = () => {
    const targetLevel = progress.highestUnlockedLevel || 1;
    setCurrentLevelId(targetLevel);
    setCurrentScreen('gameplay');
  };

  // Select specific level from Level Select
  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setCurrentScreen('gameplay');
  };

  // Level Complete Event
  const handleLevelComplete = (moves: number, stars: number) => {
    const existing = progress.completedLevels[currentLevelId];
    const isNewBest = !existing || moves < existing.bestMoves;

    const updatedProgress = storageService.recordLevelComplete(currentLevelId, moves, stars);
    setProgress(updatedProgress);

    setCompletedLevelData({
      levelId: currentLevelId,
      moves,
      stars,
      parMoves: currentLevel.parMoves,
      isNewBest,
    });
  };

  // Next level after completion
  const handleNextLevel = () => {
    setCompletedLevelData(null);
    const nextId = currentLevelId + 1;
    setCurrentLevelId(nextId);
  };

  // Replay current level
  const handleReplayLevel = () => {
    setCompletedLevelData(null);
    // Force re-render of current level by setting state
    setCurrentLevelId(currentLevelId);
  };

  // Use hint
  const handleUseHint = (): boolean => {
    const result = storageService.useHint();
    if (result.success) {
      setProgress((prev) => ({ ...prev, hintsRemaining: result.remaining }));
      return true;
    }
    return false;
  };

  // Refill hints
  const handleRefillHints = () => {
    const newCount = storageService.addHints(3);
    setProgress((prev) => ({ ...prev, hintsRemaining: newCount }));
  };

  // Settings update
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  // Reset progress
  const handleResetProgress = () => {
    const freshProgress = storageService.resetProgress();
    setProgress(freshProgress);
    setCurrentLevelId(1);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-[#070a13] font-sans">
      {/* Dynamic Ambient Background */}
      <AmbientBackground />

      {/* Screen Routing */}
      <div className="w-full h-full max-w-lg mx-auto relative flex flex-col">
        {currentScreen === 'menu' && (
          <MainMenu
            progress={progress}
            onPlay={handleStartPlay}
            onOpenLevels={() => setCurrentScreen('level_select')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        )}

        {currentScreen === 'level_select' && (
          <LevelSelect
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onBackToMenu={() => setCurrentScreen('menu')}
          />
        )}

        {currentScreen === 'gameplay' && (
          <GameplayScreen
            key={currentLevelId} // Re-mounts on level change
            level={currentLevel}
            hintsRemaining={progress.hintsRemaining}
            onLevelComplete={handleLevelComplete}
            onUseHint={handleUseHint}
            onRefillHints={handleRefillHints}
            onBack={() => setCurrentScreen('level_select')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onClose={() => setCurrentScreen('menu')}
          />
        )}

        {/* Level Complete Celebration Overlay */}
        {completedLevelData && (
          <LevelCompleteModal
            levelId={completedLevelData.levelId}
            moves={completedLevelData.moves}
            parMoves={completedLevelData.parMoves}
            stars={completedLevelData.stars}
            isNewBest={completedLevelData.isNewBest}
            onNextLevel={handleNextLevel}
            onReplay={handleReplayLevel}
            onLevelSelect={() => {
              setCompletedLevelData(null);
              setCurrentScreen('level_select');
            }}
          />
        )}
      </div>
    </main>
  );
}
