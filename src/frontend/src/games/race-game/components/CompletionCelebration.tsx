import { type JSX } from 'react';

import { Button, Card } from '../../../components/ui';

import type { GameStats } from '../types';

/**
 * Props for the CompletionCelebration component
 */
export interface CompletionCelebrationProps {
  /** Game statistics to display */
  stats: GameStats;
  /** Callback when "Play Again" is clicked */
  onPlayAgain: () => void;
  /** Callback when "Back to Menu" is clicked */
  onBackToMenu: () => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Format time in seconds to MM:SS format
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins)}:${secs.toString().padStart(2, '0')}`;
};

/**
 * CompletionCelebration - Victory screen shown when all lanes finish
 *
 * Features:
 * - Celebration animation (confetti or similar)
 * - Display game statistics
 * - Accuracy percentage
 * - Total time
 * - Total questions answered
 * - "Play Again" and "Back to Menu" buttons
 *
 * Design:
 * - Full-screen overlay
 * - Large, celebratory heading
 * - Clear statistics display
 * - Prominent action buttons
 *
 * Accessibility:
 * - Dialog role with aria-modal
 * - Clear heading hierarchy
 * - Keyboard navigable buttons
 * - Screen reader announces completion
 *
 * @example
 * ```tsx
 * <CompletionCelebration
 *   stats={{
 *     totalCorrect: 200,
 *     totalAttempts: 215,
 *     accuracy: 93,
 *     timeElapsed: 780,
 *     completedAt: Date.now()
 *   }}
 *   onPlayAgain={() => startNewGame()}
 *   onBackToMenu={() => navigate('/games')}
 * />
 * ```
 */
export const CompletionCelebration = ({
  stats,
  onPlayAgain,
  onBackToMenu,
  className = '',
}: CompletionCelebrationProps): JSX.Element => {
  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-gradient-to-br from-primary-100 via-success-100 to-secondary-100
        p-4
        ${className}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      {/* Celebration card */}
      <div className="w-full max-w-2xl animate-pop">
        <Card variant="elevated" padding="lg" className="shadow-lift">
          {/* Celebration header */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-celebrate" aria-hidden="true">
              🎉
            </div>
            <h1 id="celebration-title" className="text-5xl font-extrabold text-primary mb-2">
              Congratulations!
            </h1>
            <p className="text-2xl text-text-secondary">You finished the race!</p>
          </div>

          {/* Statistics grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Accuracy */}
            <div className="bg-success-50 rounded-xl p-6 text-center">
              <div className="text-5xl font-extrabold text-success mb-2">
                {Math.round(stats.accuracy * 100)}%
              </div>
              <div className="text-lg font-semibold text-text-secondary">Accuracy</div>
            </div>

            {/* Time */}
            <div className="bg-primary-50 rounded-xl p-6 text-center">
              <div className="text-5xl font-extrabold text-primary mb-2">
                {formatTime(stats.timeElapsed / 1000)}
              </div>
              <div className="text-lg font-semibold text-text-secondary">Time</div>
            </div>

            {/* Questions answered */}
            <div className="bg-secondary-50 rounded-xl p-6 text-center col-span-2">
              <div className="text-5xl font-extrabold text-secondary mb-2">
                {stats.totalCorrect}
              </div>
              <div className="text-lg font-semibold text-text-secondary">
                Questions Answered Correctly
                {stats.totalAttempts > stats.totalCorrect && (
                  <span className="block text-sm text-text-muted mt-1">
                    ({stats.totalAttempts} total attempts)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onPlayAgain}
              className="flex-1 sm:flex-initial sm:min-w-[200px]"
            >
              Play Again
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onBackToMenu}
              className="flex-1 sm:flex-initial sm:min-w-[200px]"
            >
              Back to Menu
            </Button>
          </div>

          {/* Encouraging message */}
          <div className="text-center mt-6 text-lg text-text-secondary">
            {stats.accuracy >= 90 && '🌟 Outstanding performance!'}
            {stats.accuracy >= 80 && stats.accuracy < 90 && '⭐ Great job!'}
            {stats.accuracy >= 70 && stats.accuracy < 80 && '👍 Nice work!'}
            {stats.accuracy < 70 && '💪 Keep practicing!'}
          </div>
        </Card>
      </div>
    </div>
  );
};
