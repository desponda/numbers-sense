import { useEffect, useState, type JSX } from 'react';

import { Icon } from '../ui/Icon';

export interface StreakCounterProps {
  /** Current streak count */
  streak: number;
  /** Maximum streak to display (default: 5) */
  maxDisplay?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the label */
  showLabel?: boolean;
}

const sizeConfig = {
  sm: {
    container: 'gap-1 px-2 py-1',
    star: 'sm' as const,
    text: 'text-xs',
  },
  md: {
    container: 'gap-2 px-3 py-2',
    star: 'md' as const,
    text: 'text-sm',
  },
  lg: {
    container: 'gap-2 px-4 py-3',
    star: 'lg' as const,
    text: 'text-base',
  },
};

/**
 * StreakCounter - Displays current answer streak
 *
 * Shows filled stars for the current streak count,
 * encouraging children to maintain their progress.
 *
 * Features:
 * - Stars animate when streak increases
 * - Warm, encouraging colors
 * - Configurable max display
 * - Optional text label
 *
 * @example
 * ```tsx
 * <StreakCounter streak={3} maxDisplay={5} showLabel />
 * ```
 */
export const StreakCounter = ({
  streak,
  maxDisplay = 5,
  size = 'md',
  showLabel = true,
}: StreakCounterProps): JSX.Element => {
  const [previousStreak, setPreviousStreak] = useState(streak);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const config = sizeConfig[size];
  const displayStreak = Math.min(streak, maxDisplay);

  useEffect(() => {
    if (streak > previousStreak && streak <= maxDisplay) {
      // Animate the newly filled star
      setAnimatingIndex(streak - 1);
      const timer = setTimeout(() => {
        setAnimatingIndex(null);
      }, 300);
      setPreviousStreak(streak);
      return (): void => {
        clearTimeout(timer);
      };
    }
    setPreviousStreak(streak);
    return undefined;
  }, [streak, previousStreak, maxDisplay]);

  const getStreakLabel = (): string => {
    if (streak === 1) {
      return '1 in a row!';
    }
    return `${String(streak)} in a row!`;
  };

  return (
    <div
      className={`
        inline-flex items-center
        bg-warning-light/50 rounded-full
        ${config.container}
      `}
      role="status"
      aria-label={`Current streak: ${String(streak)} correct answers in a row`}
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxDisplay }, (_, i) => {
          const isFilled = i < displayStreak;
          const isAnimating = i === animatingIndex;

          return (
            <span
              key={i}
              className={`
                transition-all duration-normal
                ${isFilled ? 'text-warning' : 'text-warning/30'}
                ${isAnimating ? 'animate-pop scale-125' : ''}
              `}
              aria-hidden="true"
            >
              <Icon name="star" size={config.star} />
            </span>
          );
        })}
      </div>

      {/* Streak count for numbers above max display */}
      {streak > maxDisplay && (
        <span className={`font-bold text-warning-600 ${config.text}`}>
          +{String(streak - maxDisplay)}
        </span>
      )}

      {/* Label */}
      {showLabel && (
        <span className={`font-medium text-text-secondary ${config.text}`}>{getStreakLabel()}</span>
      )}
    </div>
  );
};
