import type { JSX } from 'react';

export interface ProgressIndicatorProps {
  /** Number of problems completed */
  completed: number;
  /** Total problems in session */
  total: number;
  /** Visual variant */
  variant?: 'dots' | 'bar';
  /** Size variant */
  size?: 'sm' | 'md';
  /** Whether to show the count label */
  showLabel?: boolean;
}

const dotSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
};

const barHeightClasses = {
  sm: 'h-2',
  md: 'h-3',
};

/**
 * ProgressIndicator - Shows session progress
 *
 * Displays how many problems the child has completed in the current session.
 * Non-stressful design that celebrates progress without pressure.
 *
 * Features:
 * - Two visual variants: dots or progress bar
 * - Subtle animations on completion
 * - Warm, encouraging colors
 * - Accessible with proper ARIA
 *
 * @example
 * ```tsx
 * // Dots variant
 * <ProgressIndicator completed={3} total={10} variant="dots" />
 *
 * // Bar variant
 * <ProgressIndicator completed={3} total={10} variant="bar" showLabel />
 * ```
 */
export const ProgressIndicator = ({
  completed,
  total,
  variant = 'dots',
  size = 'md',
  showLabel = false,
}: ProgressIndicatorProps): JSX.Element => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (variant === 'bar') {
    return (
      <div
        className="flex flex-col gap-1"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Progress: ${String(completed)} of ${String(total)} completed`}
      >
        {showLabel && (
          <div className="flex justify-between items-center text-sm text-text-secondary">
            <span>Progress</span>
            <span className="font-medium">
              {completed}/{total}
            </span>
          </div>
        )}

        {/* Progress bar track */}
        <div
          className={`
            w-full rounded-full
            bg-background-warm
            overflow-hidden
            ${barHeightClasses[size]}
          `}
        >
          {/* Progress bar fill */}
          <div
            className={`
              h-full rounded-full
              bg-gradient-to-r from-primary-400 to-primary-500
              transition-all duration-slow ease-out
            `}
            style={{ width: `${String(percentage)}%` }}
          />
        </div>
      </div>
    );
  }

  // Dots variant
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Progress: ${String(completed)} of ${String(total)} completed`}
    >
      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const isCompleted = i < completed;
          const isCurrent = i === completed;

          const getDotClass = (): string => {
            if (isCompleted) {
              return 'bg-primary-500';
            }
            if (isCurrent) {
              return 'bg-primary-200 ring-2 ring-primary-300';
            }
            return 'bg-background-warm';
          };

          return (
            <span
              key={i}
              className={`
                rounded-full
                transition-all duration-normal
                ${dotSizeClasses[size]}
                ${getDotClass()}
                ${isCompleted && i === completed - 1 ? 'animate-pop' : ''}
              `}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Label */}
      {showLabel && (
        <span className="text-sm font-medium text-text-secondary">
          {completed}/{total}
        </span>
      )}
    </div>
  );
};
