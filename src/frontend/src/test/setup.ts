/**
 * Test setup file for Vitest
 * Configures testing-library matchers and mocks
 */
import '@testing-library/jest-dom';

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock AudioContext for useGameAudio hook
class MockAudioContext {
  state = 'running';

  currentTime = 0;

  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime: () => {},
      },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
  }

  resume() {
    return Promise.resolve();
  }

  get destination() {
    return {};
  }
}

// @ts-expect-error - Mock AudioContext
globalThis.AudioContext = MockAudioContext;

// jsdom provides localStorage - no mock needed
