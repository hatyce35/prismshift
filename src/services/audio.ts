/**
 * Pure Web Audio API Sound Synthesizer & Haptics Engine for Neon Escape
 * Zero external audio assets ensures 100% reliability offline and on mobile.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private vibrationEnabled: boolean = true;
  
  // Ambient Music Nodes
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientFilter: BiquadFilterNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  public vibrate(pattern: number | number[]) {
    if (this.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe ignore
      }
    }
  }

  /**
   * Crisp crystal tap sound
   */
  public playTap() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);

      this.vibrate(10);
    } catch {
      // Ignore audio failure
    }
  }

  /**
   * Satisfying sliding crystal move sound with pitch scaling by combo count
   */
  public playMove(comboIndex: number = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Pentatonic scale base frequencies (E major / neon serene)
      const baseFreqs = [329.63, 369.99, 415.30, 493.88, 554.37, 659.25, 739.99, 830.61];
      const freq = baseFreqs[comboIndex % baseFreqs.length];

      // Primary tone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.22);

      // Shimmer overtone
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc2.frequency.exponentialRampToValueAtTime(freq * 3, now + 0.2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);

      this.vibrate(20);
    } catch {
      // Ignore
    }
  }

  /**
   * Subtle soft bump/deflection sound when blocked
   */
  public playBlocked() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);

      this.vibrate([20, 30, 20]);
    } catch {
      // Ignore
    }
  }

  /**
   * Gentle UI button click
   */
  public playButton() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);

      this.vibrate(10);
    } catch {
      // Ignore
    }
  }

  /**
   * Hint activation resonance
   */
  public playHint() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.linearRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.linearRampToValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.linearRampToValueAtTime(1046.50, now + 0.35); // C6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);

      this.vibrate([15, 30, 25]);
    } catch {
      // Ignore
    }
  }

  /**
   * Triumphant crystal fanfare when clearing a level
   */
  public playLevelComplete() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chords = [
        [440, 554.37, 659.25], // A major
        [493.88, 622.25, 739.99], // B major
        [554.37, 698.46, 830.61], // C# major
        [659.25, 830.61, 987.77, 1318.51], // E major shimmer
      ];

      chords.forEach((chord, step) => {
        chord.forEach((freq, noteIdx) => {
          if (!this.ctx) return;
          const startTime = this.ctx.currentTime + (step * 0.12) + (noteIdx * 0.03);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = noteIdx === chord.length - 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.14 / (chord.length * 0.6), startTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.75);
        });
      });

      this.vibrate([40, 60, 40, 80, 100]);
    } catch {
      // Ignore
    }
  }

  /**
   * Ambient atmospheric neon synth pad
   */
  public startAmbientMusic() {
    if (!this.musicEnabled || this.isAmbientPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.stopAmbientMusic();

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const frequencies = [110, 164.81, 220, 277.18]; // A2, E3, A3, C#4 warm ambient neon drone
      const oscs: OscillatorNode[] = [];

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (idx * 0.5), this.ctx.currentTime); // Subtle detune chorus

        osc.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      this.ambientGain = masterGain;
      this.ambientFilter = filter;
      this.ambientOscillators = oscs;
      this.isAmbientPlaying = true;
    } catch {
      // Safe fallback
    }
  }

  public stopAmbientMusic() {
    if (!this.isAmbientPlaying) return;
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
      }
      setTimeout(() => {
        this.ambientOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        this.ambientOscillators = [];
        this.ambientGain = null;
        this.ambientFilter = null;
        this.isAmbientPlaying = false;
      }, 1000);
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundService = new AudioEngine();
