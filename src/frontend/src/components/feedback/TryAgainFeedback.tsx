import { useEffect, useState, type JSX } from 'react';

import { Button } from '../ui/Button';

/**
 * Encouraging messages for when the answer is incorrect
 * Warm and supportive, never discouraging
 */
const ENCOURAGEMENT_MESSAGES = [
  'Almost! Try again',
  'So close! Give it another try',
  'Keep going! You can do it',
  'Not quite - try once more',
  "You're learning! Try again",
];

export interface TryAgainFeedbackProps {
  /** Whether to show the feedback */
  isVisible: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Callback when hint is requested */
  onHintRequest?: () => void;
  /** Whether to show the hint button */
  showHintButton?: boolean;
  /** Custom message (uses random if not provided) */
  message?: string;
}

/**
 * TryAgainFeedback - Encouraging retry prompt
 *
 * Shows a warm, supportive message when the child's answer is incorrect.
 * Uses orange (secondary color) instead of red to avoid negative associations.
 *
 * Features:
 * - Warm, non-discouraging design
 * - Optional hint button
 * - Gentle wiggle animation
 * - Large touch targets
 *
 * @example
 * ```tsx
 * <TryAgainFeedback
 *   isVisible={isIncorrect}
 *   onDismiss={() => setIsIncorrect(false)}
 *   onHintRequest={showHint}
 *   showHintButton={hintsAvailable > 0}
 * />
 * ```
 */
export const TryAgainFeedback = ({
  isVisible,
  onDismiss,
  onHintRequest,
  showHintButton = false,
  message,
}: TryAgainFeedbackProps): JSX.Element | null => {
  const [displayMessage, setDisplayMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const randomIndex = Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length);
      const randomMessage = ENCOURAGEMENT_MESSAGES[randomIndex] ?? 'Almost! Try again';
      setDisplayMessage(message ?? randomMessage);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, message]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-secondary-100/30
        transition-opacity duration-fast
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Feedback card */}
      <div
        className={`
          relative
          bg-white rounded-2xl shadow-lift
          px-8 py-6
          flex flex-col items-center gap-4
          max-w-sm mx-4
          ${isAnimating ? 'animate-wiggle' : ''}
        `}
      >
        {/* Encouraging icon - warm circle */}
        <div
          className={`
            w-16 h-16 rounded-full
            bg-secondary-100
            flex items-center justify-center
            text-secondary-600
          `}
        >
          {/* Friendly face icon using simple SVG */}
          <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" />
            <path
              d="M8 14.5c1.5 1.5 6.5 1.5 8 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Message */}
        <p className="text-lg font-semibold text-secondary-700 text-center">{displayMessage}</p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            size="md"
            onClick={onDismiss}
            fullWidth
            aria-label="Try again"
          >
            Try Again
          </Button>

          {showHintButton && (
            <Button
              variant="ghost"
              size="md"
              onClick={onHintRequest}
              fullWidth
              aria-label="Get a hint"
            >
              Need a Hint?
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
