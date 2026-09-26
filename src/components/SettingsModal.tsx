import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  RotateCcw,
  ArrowLeft,
  HelpCircle,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { GameSettings } from '../types/game';
import { soundService } from '../services/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const toggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    onUpdateSettings(updated);
    soundService.setSoundEnabled(updated.soundEnabled);
    if (updated.soundEnabled) soundService.playButton();
  };

  const toggleMusic = () => {
    const updated = { ...settings, musicEnabled: !settings.musicEnabled };
    onUpdateSettings(updated);
    soundService.setMusicEnabled(updated.musicEnabled);
    if (settings.soundEnabled) soundService.playButton();
  };

  const toggleVibration = () => {
    const updated = { ...settings, vibrationEnabled: !settings.vibrationEnabled };
    onUpdateSettings(updated);
    soundService.setVibrationEnabled(updated.vibrationEnabled);
    if (settings.soundEnabled) soundService.playButton();
    if (updated.vibrationEnabled) soundService.vibrate(25);
  };

  return (
    <div className="w-full h-full flex flex-col py-6 px-4 max-w-md mx-auto relative select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => {
            soundService.playButton();
            onClose();
          }}
          className="w-10 h-10 rounded-xl glass-button flex items-center justify-center text-slate-300 active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold tracking-tight text-white font-display">
          SETTINGS
        </h2>

        <div className="w-10" />
      </div>

      {/* Settings List */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Audio & Haptic Toggles */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 border border-slate-800">
          <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-1">
            Audio & Feedback
          </div>

          {/* Sound FX */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-cyan-400">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Sound Effects</div>
                <div className="text-xs text-slate-400">Taps, slides, clear fanfare</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="w-full h-[1px] bg-slate-800/60" />

          {/* Ambient Music */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-purple-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Ambient Synth</div>
                <div className="text-xs text-slate-400">Atmospheric generative drone</div>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                settings.musicEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="w-full h-[1px] bg-slate-800/60" />

          {/* Haptic Vibration */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-emerald-400">
                <Vibrate className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Vibration Haptics</div>
                <div className="text-xs text-slate-400">Tactile responses on tap</div>
              </div>
            </div>
            <button
              onClick={toggleVibration}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                settings.vibrationEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* How to Play Guide Accordion */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <button
            onClick={() => {
              soundService.playButton();
              setShowGuide(!showGuide);
            }}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">How to Play</div>
                <div className="text-xs text-slate-400">Rules & directional mechanics</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-cyan-400">
              {showGuide ? 'Hide' : 'View'}
            </span>
          </button>

          {showGuide && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  1
                </span>
                <p>
                  Look at each crystal’s glowing light mark. The sharp light beacon and trail point in the direction it wants to slide.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  2
                </span>
                <p>
                  Tap a crystal. If the path ahead is clear to the board edge, it smoothly escapes!
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  3
                </span>
                <p>
                  If another crystal blocks its path, it stays. Find the domino order of moves to free them one by one!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reset Progress Section */}
        <div className="glass-panel rounded-2xl p-4 border border-rose-950/40 mt-auto">
          {!showConfirmReset ? (
            <button
              onClick={() => {
                soundService.playButton();
                setShowConfirmReset(true);
              }}
              className="w-full py-3 px-4 rounded-xl text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 active:scale-95 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Game Progress</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Reset all stars and unlocked levels?</span>
              </div>
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    soundService.playButton();
                    onResetProgress();
                    setShowConfirmReset(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold active:scale-95 cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
