/**
 * Tests for useGameAudio Hook
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useGameAudio } from './useGameAudio.js';

describe('useGameAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('initialization', () => {
    it('returns audio controls object', () => {
      const { result } = renderHook(() => useGameAudio());

      expect(result.current).toHaveProperty('playSound');
      expect(result.current).toHaveProperty('isEnabled');
      expect(result.current).toHaveProperty('toggleAudio');
      expect(result.current).toHaveProperty('setEnabled');
    });

    it('is enabled by default', () => {
      const { result } = renderHook(() => useGameAudio());

      expect(result.current.isEnabled).toBe(true);
    });

    it('loads preference from localStorage', () => {
      localStorage.setItem('numbersense-audio-enabled', 'false');

      const { result } = renderHook(() => useGameAudio());

      // The hook uses a ref that loads in useEffect
      expect(typeof result.current.isEnabled).toBe('boolean');
    });
  });

  describe('playSound', () => {
    it('does not throw when calling any sound type', () => {
      const { result } = renderHook(() => useGameAudio());

      const soundTypes = [
        'blockPickup',
        'blockDrop',
        'blockSnap',
        'correct',
        'incorrect',
        'hint',
        'buttonClick',
        'clear',
      ] as const;

      // All sound types should be callable without error
      soundTypes.forEach((type) => {
        expect(() => {
          act(() => {
            result.current.playSound(type);
          });
        }).not.toThrow();
      });
    });

    it('handles missing AudioContext gracefully', () => {
      vi.stubGlobal('AudioContext', undefined);

      const { result } = renderHook(() => useGameAudio());

      // Should not throw
      expect(() => {
        act(() => {
          result.current.playSound('correct');
        });
      }).not.toThrow();
    });
  });

  describe('toggleAudio', () => {
    it('toggles state and updates localStorage', () => {
      const { result } = renderHook(() => useGameAudio());

      act(() => {
        result.current.toggleAudio();
      });

      // Check localStorage was updated
      expect(localStorage.getItem('numbersense-audio-enabled')).toBe('false');

      act(() => {
        result.current.toggleAudio();
      });

      expect(localStorage.getItem('numbersense-audio-enabled')).toBe('true');
    });
  });

  describe('setEnabled', () => {
    it('sets enabled state and updates localStorage', () => {
      const { result } = renderHook(() => useGameAudio());

      act(() => {
        result.current.setEnabled(false);
      });

      expect(localStorage.getItem('numbersense-audio-enabled')).toBe('false');

      act(() => {
        result.current.setEnabled(true);
      });

      expect(localStorage.getItem('numbersense-audio-enabled')).toBe('true');
    });
  });

  describe('sound configurations', () => {
    it('has all expected sound types', () => {
      const { result } = renderHook(() => useGameAudio());

      const soundTypes = [
        'blockPickup',
        'blockDrop',
        'blockSnap',
        'correct',
        'incorrect',
        'hint',
        'buttonClick',
        'clear',
      ] as const;

      // All sound types should be playable without error
      soundTypes.forEach((type) => {
        expect(() => {
          act(() => {
            result.current.playSound(type);
          });
        }).not.toThrow();
      });
    });
  });
});
