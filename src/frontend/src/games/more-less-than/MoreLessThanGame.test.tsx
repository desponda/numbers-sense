/**
 * Unit tests for MoreLessThanGame main component
 * Tests game rendering, difficulty modes, and integration
 */
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { MoreLessThanGame } from './MoreLessThanGame';

// Mock the game engine store
vi.mock('../../game-engine/stores/gameSessionStore', () => ({
  useGameSessionStore: vi.fn(() => ({
    session: {
      id: 'test-session',
      gameId: 'more-less-than',
      difficulty: 'easy',
      status: 'playing',
      startedAt: Date.now(),
      currentProblem: null,
      problemsCompleted: 5,
      problemsAttempted: 7,
      correctStreak: 3,
      longestStreak: 5,
    },
    setProblem: vi.fn(),
    completeProblem: vi.fn(),
    startSession: vi.fn(),
  })),
}));

// Mock the problem generator
vi.mock('../../game-engine/problemGenerator', () => ({
  generateProblem: vi.fn(() => ({
    id: 'test-problem-1',
    gameId: 'more-less-than',
    difficulty: 'easy',
    startingNumber: 5,
    operation: 'more',
    delta: 3,
    targetValue: 8,
    createdAt: Date.now(),
  })),
}));

describe('MoreLessThanGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<MoreLessThanGame difficulty="easy" />)).not.toThrow();
    });
  });

  describe('difficulty modes', () => {
    it('accepts easy difficulty', () => {
      expect(() => render(<MoreLessThanGame difficulty="easy" />)).not.toThrow();
    });

    it('accepts medium difficulty', () => {
      expect(() => render(<MoreLessThanGame difficulty="medium" />)).not.toThrow();
    });

    it('accepts hard difficulty', () => {
      expect(() => render(<MoreLessThanGame difficulty="hard" />)).not.toThrow();
    });

    it('accepts challenge difficulty', () => {
      expect(() => render(<MoreLessThanGame difficulty="challenge" />)).not.toThrow();
    });
  });

  describe('callbacks', () => {
    it('accepts onExit callback', () => {
      const onExit = vi.fn();
      expect(() => render(<MoreLessThanGame difficulty="easy" onExit={onExit} />)).not.toThrow();
    });
  });

  describe('styling', () => {
    it('renders in a container', () => {
      const { container } = render(<MoreLessThanGame difficulty="easy" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
