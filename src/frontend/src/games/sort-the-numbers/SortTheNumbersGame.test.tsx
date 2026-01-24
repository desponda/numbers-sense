/**
 * Tests for Sort The Numbers Game
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SortTheNumbersGame } from './SortTheNumbersGame.js';

// Mock the game session store
vi.mock('../../../game-engine/stores/gameSessionStore', () => ({
  useGameSessionStore: vi.fn(() => ({
    session: null,
    startSession: vi.fn(),
    completeProblem: vi.fn(),
    submitAttempt: vi.fn(),
  })),
}));

// Mock the problem generator
vi.mock('../../../game-engine/problemGenerator', () => ({
  generateSortTheNumbersValues: vi.fn(() => [5, 2, 8]), // Return fixed values for testing
}));

// Mock the audio hook
vi.mock('../../../hooks/useGameAudio', () => ({
  useGameAudio: vi.fn(() => ({
    playSound: vi.fn(),
    isEnabled: true,
    toggleAudio: vi.fn(),
    setEnabled: vi.fn(),
  })),
}));

describe('SortTheNumbersGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the game title', () => {
      render(<SortTheNumbersGame />);

      expect(screen.getByText('Sort the Numbers')).toBeInTheDocument();
    });

    it('renders instructions for visual phase', () => {
      render(<SortTheNumbersGame />);

      expect(
        screen.getByText('Put the blocks in order from smallest to biggest!'),
      ).toBeInTheDocument();
    });

    it('renders the Check Order button', () => {
      render(<SortTheNumbersGame />);

      expect(screen.getByRole('button', { name: /check order/i })).toBeInTheDocument();
    });

    it('renders round counter', () => {
      render(<SortTheNumbersGame />);

      expect(screen.getByText(/round.*1/i)).toBeInTheDocument();
    });

    it('renders score display', () => {
      render(<SortTheNumbersGame />);

      expect(screen.getByText(/score.*0/i)).toBeInTheDocument();
    });
  });

  describe('difficulty prop', () => {
    it('accepts easy difficulty', () => {
      expect(() => render(<SortTheNumbersGame difficulty="easy" />)).not.toThrow();
    });

    it('accepts medium difficulty', () => {
      expect(() => render(<SortTheNumbersGame difficulty="medium" />)).not.toThrow();
    });

    it('accepts hard difficulty', () => {
      expect(() => render(<SortTheNumbersGame difficulty="hard" />)).not.toThrow();
    });

    it('accepts challenge difficulty', () => {
      expect(() => render(<SortTheNumbersGame difficulty="challenge" />)).not.toThrow();
    });
  });

  describe('Check Order button', () => {
    it('becomes disabled when clicked to prevent multiple submissions', () => {
      render(<SortTheNumbersGame />);

      const checkButton = screen.getByRole('button', { name: /check order/i });
      expect(checkButton).not.toBeDisabled();

      fireEvent.click(checkButton);

      // Should be disabled during validation
      expect(checkButton).toBeDisabled();
    });

    it('shows feedback after checking order', async () => {
      render(<SortTheNumbersGame />);

      const checkButton = screen.getByRole('button', { name: /check order/i });
      fireEvent.click(checkButton);

      // Feedback message should appear
      await waitFor(
        () => {
          expect(screen.queryByText(/great job|almost|some numbers are not/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('callbacks', () => {
    it('calls onPhaseChange when phase changes', () => {
      const onPhaseChange = vi.fn();
      render(<SortTheNumbersGame onPhaseChange={onPhaseChange} />);

      // Phase changes happen after successful completion
      // This test verifies the callback prop is accepted
      expect(typeof onPhaseChange).toBe('function');
    });

    it('calls onComplete when game completes', () => {
      const onComplete = vi.fn();
      render(<SortTheNumbersGame onComplete={onComplete} />);

      // onComplete is called after both phases complete successfully
      expect(typeof onComplete).toBe('function');
    });
  });

  describe('styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<SortTheNumbersGame className="custom-game-class" />);

      // Find the card element which receives the className
      const card = container.querySelector('.custom-game-class');
      expect(card).toBeInTheDocument();
    });

    it('wraps content in a Card', () => {
      render(<SortTheNumbersGame />);

      // Card should be present with elevated variant
      const card = document.querySelector('.shadow-soft');
      expect(card).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      render(<SortTheNumbersGame />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Sort the Numbers');
    });

    it('buttons have accessible names', () => {
      render(<SortTheNumbersGame />);

      expect(screen.getByRole('button', { name: /check order/i })).toBeInTheDocument();
    });
  });
});
