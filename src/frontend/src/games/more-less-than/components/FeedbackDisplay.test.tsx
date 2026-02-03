/**
 * Unit tests for FeedbackDisplay component
 * Tests progressive feedback system, hint display, and final answer reveal
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { FeedbackDisplay } from './FeedbackDisplay';

describe('FeedbackDisplay', () => {
  describe('correct answer feedback', () => {
    it('renders correct feedback with checkmark', () => {
      render(<FeedbackDisplay attemptNumber={1} isCorrect />);

      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(screen.getByText(/correct/i)).toBeInTheDocument();
    });

    it('applies green styling for correct answer', () => {
      const { container } = render(<FeedbackDisplay attemptNumber={1} isCorrect />);

      const feedbackDiv = container.querySelector('.bg-green-100');
      expect(feedbackDiv).toBeInTheDocument();
      expect(feedbackDiv).toHaveClass('border-green-500');
    });

    it('shows correct feedback on any attempt number', () => {
      const { rerender } = render(<FeedbackDisplay attemptNumber={1} isCorrect />);
      expect(screen.getByText(/correct/i)).toBeInTheDocument();

      rerender(<FeedbackDisplay attemptNumber={2} isCorrect />);
      expect(screen.getByText(/correct/i)).toBeInTheDocument();

      rerender(<FeedbackDisplay attemptNumber={3} isCorrect />);
      expect(screen.getByText(/correct/i)).toBeInTheDocument();
    });

    it('displays large success message', () => {
      render(<FeedbackDisplay attemptNumber={1} isCorrect />);

      const message = screen.getByText(/correct/i);
      expect(message).toHaveClass('text-2xl', 'font-bold', 'text-green-800');
    });
  });

  describe('attempt 1 - generic feedback', () => {
    it('shows generic encouragement on first incorrect attempt', () => {
      render(<FeedbackDisplay attemptNumber={1} isCorrect={false} />);

      expect(screen.getByText(/not quite/i)).toBeInTheDocument();
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });

    it('displays thinking emoji', () => {
      render(<FeedbackDisplay attemptNumber={1} isCorrect={false} />);

      expect(screen.getByText('🤔')).toBeInTheDocument();
    });

    it('applies orange styling for incorrect attempt', () => {
      const { container } = render(<FeedbackDisplay attemptNumber={1} isCorrect={false} />);

      const feedbackDiv = container.querySelector('.bg-orange-100');
      expect(feedbackDiv).toBeInTheDocument();
      expect(feedbackDiv).toHaveClass('border-orange-400');
    });

    it('does not show hint on attempt 1', () => {
      render(
        <FeedbackDisplay
          attemptNumber={1}
          isCorrect={false}
          hint="Remember: more than means add."
        />,
      );

      expect(screen.queryByText(/hint/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/more than means add/i)).not.toBeInTheDocument();
    });

    it('does not show correct answer on attempt 1', () => {
      render(<FeedbackDisplay attemptNumber={1} isCorrect={false} correctAnswer={8} />);

      expect(screen.queryByText(/the answer is/i)).not.toBeInTheDocument();
      expect(screen.queryByText('8')).not.toBeInTheDocument();
    });
  });

  describe('attempt 2 - hint feedback', () => {
    it('shows hint label on second incorrect attempt', () => {
      render(
        <FeedbackDisplay
          attemptNumber={2}
          isCorrect={false}
          hint="Remember: more than means add."
        />,
      );

      expect(screen.getByText(/hint/i)).toBeInTheDocument();
    });

    it('displays provided hint message', () => {
      const hintMessage = 'Start with 5, then add 3.';
      render(<FeedbackDisplay attemptNumber={2} isCorrect={false} hint={hintMessage} />);

      expect(screen.getByText(hintMessage)).toBeInTheDocument();
    });

    it('displays lightbulb emoji for hint', () => {
      render(
        <FeedbackDisplay
          attemptNumber={2}
          isCorrect={false}
          hint="Remember: more than means add."
        />,
      );

      expect(screen.getByText('💡')).toBeInTheDocument();
    });

    it('applies orange styling for hint', () => {
      const { container } = render(
        <FeedbackDisplay
          attemptNumber={2}
          isCorrect={false}
          hint="Remember: more than means add."
        />,
      );

      const feedbackDiv = container.querySelector('.bg-orange-100');
      expect(feedbackDiv).toBeInTheDocument();
      expect(feedbackDiv).toHaveClass('border-orange-400');
    });

    it('does not show correct answer on attempt 2', () => {
      render(
        <FeedbackDisplay
          attemptNumber={2}
          isCorrect={false}
          hint="Try counting."
          correctAnswer={10}
        />,
      );

      expect(screen.queryByText(/the answer is/i)).not.toBeInTheDocument();
    });

    it('handles empty hint string gracefully', () => {
      render(<FeedbackDisplay attemptNumber={2} isCorrect={false} hint="" />);

      // Should not render feedback when hint is empty
      expect(screen.queryByText(/hint/i)).not.toBeInTheDocument();
    });

    it('handles undefined hint gracefully', () => {
      render(<FeedbackDisplay attemptNumber={2} isCorrect={false} />);

      // Should not render feedback when hint is undefined
      expect(screen.queryByText(/hint/i)).not.toBeInTheDocument();
    });
  });

  describe('attempt 3 - answer reveal', () => {
    it('shows answer reveal message on third incorrect attempt', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={12} />);

      expect(screen.getByText(/the answer is 12/i)).toBeInTheDocument();
    });

    it('displays book emoji for learning moment', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={7} />);

      expect(screen.getByText('📚')).toBeInTheDocument();
    });

    it('shows encouragement message', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={15} />);

      expect(screen.getByText(/let's try a new one/i)).toBeInTheDocument();
    });

    it('applies blue styling for answer reveal', () => {
      const { container } = render(
        <FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={9} />,
      );

      const feedbackDiv = container.querySelector('.bg-blue-100');
      expect(feedbackDiv).toBeInTheDocument();
      expect(feedbackDiv).toHaveClass('border-blue-400');
    });

    it('displays correct answer prominently', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={20} />);

      const answerText = screen.getByText(/the answer is 20/i);
      expect(answerText).toHaveClass('text-xl', 'font-semibold', 'text-blue-800');
    });

    it('handles single-digit answers', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={5} />);

      expect(screen.getByText(/the answer is 5/i)).toBeInTheDocument();
    });

    it('handles two-digit answers', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={42} />);

      expect(screen.getByText(/the answer is 42/i)).toBeInTheDocument();
    });

    it('handles large numbers', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={100} />);

      expect(screen.getByText(/the answer is 100/i)).toBeInTheDocument();
    });

    it('does not render if correctAnswer is undefined on attempt 3', () => {
      const { container } = render(<FeedbackDisplay attemptNumber={3} isCorrect={false} />);

      // Should return null when correctAnswer is undefined
      expect(container.firstChild).toBeNull();
    });
  });

  describe('conditional rendering', () => {
    it('returns null when no appropriate feedback to show', () => {
      const { container } = render(
        <FeedbackDisplay attemptNumber={2} isCorrect={false} hint={undefined} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('prioritizes correct feedback over incorrect', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect hint="Some hint" correctAnswer={10} />);

      expect(screen.getByText(/correct/i)).toBeInTheDocument();
      expect(screen.queryByText(/hint/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/the answer is/i)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('uses semantic HTML for correct feedback', () => {
      const { container } = render(<FeedbackDisplay attemptNumber={1} isCorrect />);

      const feedbackDiv = container.querySelector('.bg-green-100');
      expect(feedbackDiv?.tagName).toBe('DIV');
    });

    it('maintains readable contrast for success message', () => {
      render(<FeedbackDisplay attemptNumber={1} isCorrect />);

      const message = screen.getByText(/correct/i);
      expect(message).toHaveClass('text-green-800');
    });

    it('maintains readable contrast for hint message', () => {
      render(<FeedbackDisplay attemptNumber={2} isCorrect={false} hint="Test hint" />);

      const hint = screen.getByText(/test hint/i);
      expect(hint).toHaveClass('text-orange-700');
    });

    it('maintains readable contrast for answer reveal', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={5} />);

      const message = screen.getByText(/the answer is/i);
      expect(message).toHaveClass('text-blue-800');
    });
  });

  describe('styling', () => {
    it('applies consistent padding and borders', () => {
      const { container } = render(<FeedbackDisplay attemptNumber={1} isCorrect />);

      const feedbackDiv = container.querySelector('.bg-green-100');
      expect(feedbackDiv).toHaveClass('border-4', 'rounded-xl', 'p-6', 'text-center');
    });

    it('uses consistent emoji size', () => {
      const { container: container1 } = render(<FeedbackDisplay attemptNumber={1} isCorrect />);
      const { container: container2 } = render(
        <FeedbackDisplay attemptNumber={2} isCorrect={false} hint="hint" />,
      );
      const { container: container3 } = render(
        <FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={5} />,
      );

      const emoji1 = container1.querySelector('.text-4xl');
      const emoji2 = container2.querySelector('.text-2xl');
      const emoji3 = container3.querySelector('.text-2xl');

      expect(emoji1).toBeInTheDocument();
      expect(emoji2).toBeInTheDocument();
      expect(emoji3).toBeInTheDocument();
    });
  });

  describe('progressive feedback flow', () => {
    it('shows different feedback for each attempt', () => {
      const { rerender } = render(<FeedbackDisplay attemptNumber={1} isCorrect={false} />);
      expect(screen.getByText(/try again/i)).toBeInTheDocument();

      rerender(
        <FeedbackDisplay
          attemptNumber={2}
          isCorrect={false}
          hint="Remember: more than means add."
        />,
      );
      expect(screen.getByText(/hint/i)).toBeInTheDocument();

      rerender(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={8} />);
      expect(screen.getByText(/the answer is 8/i)).toBeInTheDocument();
    });

    it('maintains visual consistency across attempts', () => {
      const { container: container1, rerender } = render(
        <FeedbackDisplay attemptNumber={1} isCorrect={false} />,
      );
      const feedback1 = container1.querySelector('.bg-orange-100');
      expect(feedback1).toHaveClass('border-4', 'rounded-xl', 'p-6');

      rerender(
        <FeedbackDisplay
          attemptNumber={2}
          isCorrect={false}
          hint="Remember: more than means add."
        />,
      );
      const feedback2 = container1.querySelector('.bg-orange-100');
      expect(feedback2).toHaveClass('border-4', 'rounded-xl', 'p-6');
    });
  });

  describe('edge cases', () => {
    it('handles correctAnswer of 0', () => {
      render(<FeedbackDisplay attemptNumber={3} isCorrect={false} correctAnswer={0} />);

      expect(screen.getByText(/the answer is 0/i)).toBeInTheDocument();
    });

    it('handles very long hint text', () => {
      const longHint =
        'This is a very long hint that contains a lot of text to help the student understand the concept and solve the problem correctly.';
      render(<FeedbackDisplay attemptNumber={2} isCorrect={false} hint={longHint} />);

      expect(screen.getByText(longHint)).toBeInTheDocument();
    });

    it('handles hint with special characters', () => {
      const specialHint = "Remember: 'more than' means add (+).";
      render(<FeedbackDisplay attemptNumber={2} isCorrect={false} hint={specialHint} />);

      expect(screen.getByText(specialHint)).toBeInTheDocument();
    });
  });
});
