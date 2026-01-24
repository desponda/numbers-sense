/**
 * Tests for Build The Number Game
 *
 * Note: This component has complex dependencies (DnD, Zustand store, audio).
 * These tests verify the component renders without error and accepts props correctly.
 * Integration tests should cover the full game flow.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { BuildTheNumberGame } from './BuildTheNumberGame.js';

describe('BuildTheNumberGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<BuildTheNumberGame />)).not.toThrow();
    });

    it('displays progress indicator', () => {
      render(<BuildTheNumberGame />);

      // Should show problem X of Y
      expect(screen.getByText(/problem/i)).toBeInTheDocument();
    });

    it('has accessible role and label', () => {
      render(<BuildTheNumberGame />);

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Build the Number game');
    });
  });

  describe('difficulty prop', () => {
    it('accepts easy difficulty', () => {
      expect(() => render(<BuildTheNumberGame difficulty="easy" />)).not.toThrow();
    });

    it('accepts medium difficulty', () => {
      expect(() => render(<BuildTheNumberGame difficulty="medium" />)).not.toThrow();
    });

    it('accepts hard difficulty', () => {
      expect(() => render(<BuildTheNumberGame difficulty="hard" />)).not.toThrow();
    });

    it('accepts challenge difficulty', () => {
      expect(() => render(<BuildTheNumberGame difficulty="challenge" />)).not.toThrow();
    });
  });

  describe('callbacks', () => {
    it('accepts onSessionEnd callback', () => {
      const onSessionEnd = vi.fn();
      expect(() => render(<BuildTheNumberGame onSessionEnd={onSessionEnd} />)).not.toThrow();
    });

    it('accepts onProblemComplete callback', () => {
      const onProblemComplete = vi.fn();
      expect(() =>
        render(<BuildTheNumberGame onProblemComplete={onProblemComplete} />),
      ).not.toThrow();
    });
  });

  describe('styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<BuildTheNumberGame className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
