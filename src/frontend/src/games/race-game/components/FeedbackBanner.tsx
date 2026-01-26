import type { JSX } from 'react';

import type { FeedbackEntry } from '../types';

/**
 * Props for the FeedbackBanner component
 */
export interface FeedbackBannerProps {
  /** Feedback entry to display */
  entry: FeedbackEntry;
  /** Callback when dismiss button is clicked */
  onDismiss: () => void;
}

/**
 * FeedbackBanner - Persistent corrective feedback display
 *
 * Shows what the user picked vs. the correct answer after an incorrect response.
 * Positioned between the race track and question drawer to provide continuous
 * learning feedback without blocking game flow.
 *
 * Features:
 * - Persistent visibility (doesn't auto-dismiss)
 * - Manual dismiss button
 * - Clear visual separation from current question
 * - Accessible with screen readers
 * - Responsive layout (mobile and desktop)
 *
 * Design based on UX research for K-3 educational games:
 * - Warm orange background (not harsh red)
 * - Child-friendly language
 * - Clear visual hierarchy
 * - Large touch targets (48px minimum)
 *
 * @example
 * ```tsx
 * <FeedbackBanner
 *   entry={{
 *     id: '123',
 *     questionText: '3 × 7 = ?',
 *     userAnswer: 24,
 *     correctAnswer: 21,
 *     wasCorrect: false,
 *     timestamp: Date.now(),
 *     lane: 7
 *   }}
 *   onDismiss={() => clearFeedback()}
 * />
 * ```
 */
export const FeedbackBanner = ({ entry, onDismiss }: FeedbackBannerProps): JSX.Element => {
  // Extract fact from question text (remove " = ?")
  const fact = entry.questionText.replace(' = ?', '');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="
        fixed z-30 inset-x-0 bottom-[25vh]
        max-h-[15vh] overflow-y-auto
        md:bottom-0 md:left-0 md:right-[40vw] md:max-h-[20vh]
        bg-orange-50 border-t-2 border-orange-300
        p-4
        animate-slide-up
        transition-all duration-300
      "
    >
      {/* Screen reader announcement */}
      <div className="sr-only">
        Your answer of {entry.userAnswer} was not quite right. The correct answer is{' '}
        {entry.correctAnswer}. Try the next question.
      </div>

      {/* Visual content */}
      <div className="flex items-start gap-3 max-w-4xl mx-auto" aria-hidden="true">
        {/* Warning icon */}
        <span className="text-2xl flex-shrink-0">⚠️</span>

        {/* Feedback text */}
        <div className="flex-1 min-w-0">
          {/* User's answer (de-emphasized) */}
          <p className="text-lg text-text-secondary mb-1">
            You picked:{' '}
            <span className="font-semibold">
              {fact} = {entry.userAnswer}
            </span>
          </p>

          {/* Correct answer (emphasized) */}
          <p className="text-xl text-success font-bold">
            ✅ Correct answer: {fact} = {entry.correctAnswer}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="
            flex-shrink-0 p-2 min-w-[48px] min-h-[48px]
            text-text-secondary hover:text-text-primary
            rounded-lg hover:bg-orange-100
            transition-colors
          "
          aria-label="Dismiss feedback"
          type="button"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>
    </div>
  );
};
