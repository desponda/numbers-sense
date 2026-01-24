/**
 * useGameAudio - Audio feedback hook for educational games
 *
 * Based on game-mechanics.md Audio Specifications:
 * - Non-annoying: Sounds parents can tolerate repeatedly
 * - Informative: Distinct sounds for different feedback types
 * - Calming: Reduces anxiety, not increases it
 * - Optional: Can be muted; visual feedback always available
 *
 * Uses Web Audio API for synthesized sounds (no external files needed)
 */

import { useCallback, useRef, useEffect } from 'react';

// Audio context singleton (created on first user interaction)
let audioContext: AudioContext | null = null;

/**
 * Get or create the audio context
 * Must be called after user interaction (browser policy)
 */
const getAudioContext = (): AudioContext | null => {
  if (audioContext === null) {
    try {
      audioContext = new AudioContext();
    } catch {
      console.warn('Web Audio API not supported');
      return null;
    }
  }

  // Resume if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {
      // Ignore resume errors
    });
  }

  return audioContext;
};

/**
 * Sound configurations based on game-mechanics.md
 */
const SOUND_CONFIG = {
  // Block interactions
  blockPickup: {
    frequency: 800,
    duration: 0.08,
    type: 'sine' as OscillatorType,
    volume: 0.3,
  },
  blockDrop: {
    frequency: 400,
    duration: 0.12,
    type: 'sine' as OscillatorType,
    volume: 0.4,
  },
  blockSnap: {
    frequency: 600,
    duration: 0.1,
    type: 'triangle' as OscillatorType,
    volume: 0.35,
  },

  // Feedback sounds
  correct: {
    // Pleasant ascending chime (C5, E5, G5)
    notes: [523, 659, 784],
    duration: 0.15,
    type: 'sine' as OscillatorType,
    volume: 0.5,
  },
  incorrect: {
    // Gentle descending tone (E4, D4) - NOT a buzzer
    notes: [330, 294],
    duration: 0.2,
    type: 'sine' as OscillatorType,
    volume: 0.35,
  },
  hint: {
    // Soft single chime (G4)
    notes: [392],
    duration: 0.2,
    type: 'sine' as OscillatorType,
    volume: 0.3,
  },

  // UI sounds
  buttonClick: {
    frequency: 500,
    duration: 0.05,
    type: 'sine' as OscillatorType,
    volume: 0.25,
  },
  clear: {
    frequency: 300,
    duration: 0.15,
    type: 'triangle' as OscillatorType,
    volume: 0.3,
  },
};

type SoundType = keyof typeof SOUND_CONFIG;

/**
 * Play a single tone
 */
const playTone = (
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  startTime: number = ctx.currentTime,
): void => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // Envelope: quick attack, smooth decay
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.1);
};

/**
 * Play a sequence of notes (for correct/incorrect feedback)
 */
const playNotes = (
  ctx: AudioContext,
  notes: number[],
  noteDuration: number,
  type: OscillatorType,
  volume: number,
): void => {
  const startTime = ctx.currentTime;
  notes.forEach((note, index) => {
    playTone(ctx, note, noteDuration, type, volume, startTime + index * (noteDuration * 0.8));
  });
};

/**
 * Hook return type
 */
export interface GameAudioControls {
  /** Play a sound effect */
  playSound: (type: SoundType) => void;
  /** Whether audio is enabled */
  isEnabled: boolean;
  /** Toggle audio on/off */
  toggleAudio: () => void;
  /** Set audio enabled state */
  setEnabled: (enabled: boolean) => void;
}

/**
 * useGameAudio - Hook for game audio feedback
 *
 * @example
 * ```tsx
 * const { playSound, isEnabled, toggleAudio } = useGameAudio();
 *
 * // Play sounds on events
 * playSound('blockDrop');
 * playSound('correct');
 *
 * // Toggle in settings
 * <button onClick={toggleAudio}>
 *   {isEnabled ? 'Mute' : 'Unmute'}
 * </button>
 * ```
 */
export const useGameAudio = (): GameAudioControls => {
  const isEnabledRef = useRef(true);
  const forceUpdate = useRef(0);

  // Load preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('numbersense-audio-enabled');
    if (stored !== null) {
      isEnabledRef.current = stored === 'true';
    }
  }, []);

  const playSound = useCallback((type: SoundType): void => {
    if (!isEnabledRef.current) {
      return;
    }

    const ctx = getAudioContext();
    if (ctx === null) {
      return;
    }

    const config = SOUND_CONFIG[type];

    if ('notes' in config) {
      // Multi-note sound (correct, incorrect, hint)
      playNotes(ctx, config.notes, config.duration, config.type, config.volume);
    } else {
      // Single tone sound
      playTone(ctx, config.frequency, config.duration, config.type, config.volume);
    }
  }, []);

  const toggleAudio = useCallback((): void => {
    isEnabledRef.current = !isEnabledRef.current;
    localStorage.setItem('numbersense-audio-enabled', String(isEnabledRef.current));
    forceUpdate.current += 1;
  }, []);

  const setEnabled = useCallback((enabled: boolean): void => {
    isEnabledRef.current = enabled;
    localStorage.setItem('numbersense-audio-enabled', String(enabled));
  }, []);

  return {
    playSound,
    isEnabled: isEnabledRef.current,
    toggleAudio,
    setEnabled,
  };
};

export default useGameAudio;
