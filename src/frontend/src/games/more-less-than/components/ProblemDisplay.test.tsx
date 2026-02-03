/**
 * Unit tests for ProblemDisplay component
 * Tests rendering, accessibility, and content display
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ProblemDisplay } from './ProblemDisplay';

import type { MoreLessThanProblem } from '../../../game-engine/types';

describe('ProblemDisplay', () => {
  const createMockProblem = (
    operation: 'more' | 'less',
    delta: number,
    startingNumber: number,
  ): MoreLessThanProblem => ({
    id: 'test-problem-1',
    gameId: 'more-less-than',
    difficulty: 'easy',
    startingNumber,
    operation,
    delta,
    targetValue: operation === 'more' ? startingNumber + delta : startingNumber - delta,
    createdAt: Date.now(),
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const problem = createMockProblem('more', 3, 5);
      expect(() => render(<ProblemDisplay problem={problem} />)).not.toThrow();
    });

    it('displays the complete question', () => {
      const problem = createMockProblem('more', 3, 5);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/what is/i)).toBeInTheDocument();
      expect(screen.getByText(/3 more than/i)).toBeInTheDocument();
      expect(screen.getByText(/5/i)).toBeInTheDocument();
    });

    it('renders as a heading', () => {
      const problem = createMockProblem('more', 3, 5);
      render(<ProblemDisplay problem={problem} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('operation types', () => {
    it('displays "more than" for more operation', () => {
      const problem = createMockProblem('more', 4, 6);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/4 more than/i)).toBeInTheDocument();
      expect(screen.getByText(/6/i)).toBeInTheDocument();
    });

    it('displays "less than" for less operation', () => {
      const problem = createMockProblem('less', 2, 8);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/2 less than/i)).toBeInTheDocument();
      expect(screen.getByText(/8/i)).toBeInTheDocument();
    });
  });

  describe('number ranges', () => {
    it('handles single-digit numbers', () => {
      const problem = createMockProblem('more', 1, 3);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/1 more than/i)).toBeInTheDocument();
      expect(screen.getByText(/3/i)).toBeInTheDocument();
    });

    it('handles teen numbers', () => {
      const problem = createMockProblem('less', 3, 15);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/3 less than/i)).toBeInTheDocument();
      expect(screen.getByText(/15/i)).toBeInTheDocument();
    });

    it('handles two-digit numbers', () => {
      const problem = createMockProblem('more', 10, 23);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/10 more than/i)).toBeInTheDocument();
      expect(screen.getByText(/23/i)).toBeInTheDocument();
    });

    it('handles large deltas', () => {
      const problem = createMockProblem('less', 20, 50);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/20 less than/i)).toBeInTheDocument();
      expect(screen.getByText(/50/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper aria-label for screen readers', () => {
      const problem = createMockProblem('more', 3, 5);
      render(<ProblemDisplay problem={problem} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('aria-label', 'What is 3 more than 5?');
    });

    it('generates correct aria-label for less operation', () => {
      const problem = createMockProblem('less', 4, 9);
      render(<ProblemDisplay problem={problem} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('aria-label', 'What is 4 less than 9?');
    });

    it('aria-label includes all numeric values', () => {
      const problem = createMockProblem('more', 10, 25);
      render(<ProblemDisplay problem={problem} />);

      const heading = screen.getByRole('heading', { level: 2 });
      const ariaLabel = heading.getAttribute('aria-label') ?? '';

      expect(ariaLabel).toContain('10');
      expect(ariaLabel).toContain('25');
    });
  });

  describe('styling', () => {
    it('highlights delta and operation with special styling', () => {
      const problem = createMockProblem('more', 3, 5);
      const { container } = render(<ProblemDisplay problem={problem} />);

      // Check for highlighted span (should have text-orange-500 class)
      const highlightedSpan = container.querySelector('.text-orange-500');
      expect(highlightedSpan).toBeInTheDocument();
      expect(highlightedSpan).toHaveClass('font-bold', 'underline');
    });

    it('applies consistent text formatting', () => {
      const problem = createMockProblem('less', 2, 7);
      render(<ProblemDisplay problem={problem} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-3xl', 'font-semibold', 'text-gray-800');
    });
  });

  describe('problem updates', () => {
    it('updates when problem changes', () => {
      const problem1 = createMockProblem('more', 3, 5);
      const { rerender } = render(<ProblemDisplay problem={problem1} />);

      expect(screen.getByText(/3 more than/i)).toBeInTheDocument();

      const problem2 = createMockProblem('less', 4, 10);
      rerender(<ProblemDisplay problem={problem2} />);

      expect(screen.getByText(/4 less than/i)).toBeInTheDocument();
      expect(screen.queryByText(/3 more than/i)).not.toBeInTheDocument();
    });

    it('maintains accessibility when problem updates', () => {
      const problem1 = createMockProblem('more', 2, 6);
      const { rerender } = render(<ProblemDisplay problem={problem1} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('aria-label', 'What is 2 more than 6?');

      const problem2 = createMockProblem('less', 3, 8);
      rerender(<ProblemDisplay problem={problem2} />);

      expect(heading).toHaveAttribute('aria-label', 'What is 3 less than 8?');
    });
  });

  describe('edge cases', () => {
    it('handles delta of 1', () => {
      const problem = createMockProblem('more', 1, 5);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/1 more than/i)).toBeInTheDocument();
    });

    it('handles starting number of 1', () => {
      const problem = createMockProblem('more', 2, 1);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/1\?$/i)).toBeInTheDocument();
    });

    it('handles delta equal to starting number', () => {
      const problem = createMockProblem('less', 5, 5);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/5 less than/i)).toBeInTheDocument();
      expect(screen.getByText(/5\?$/i)).toBeInTheDocument();
    });

    it('handles large numbers (100+)', () => {
      const problem = createMockProblem('more', 10, 100);
      render(<ProblemDisplay problem={problem} />);

      expect(screen.getByText(/10 more than/i)).toBeInTheDocument();
      expect(screen.getByText(/100/i)).toBeInTheDocument();
    });
  });
});
