import type { JSX } from 'react';

/**
 * Props for the NumberCard component
 */
export interface NumberCardProps {
  /** The number value to display */
  value: number;
  /** Whether the card is currently being dragged */
  isDragging?: boolean;
  /** Whether the card is in the correct position */
  isCorrect?: boolean | null;
  /** Whether the card is in an incorrect position */
  isIncorrect?: boolean;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * NumberCard - Simple number display card for Phase 2 of Sort the Numbers.
 *
 * Features:
 * - Large, clear number display optimized for young learners
 * - Visual feedback states for dragging, correct, and incorrect positions
 * - Touch-optimized sizing (64px minimum touch target)
 * - Accessible with proper ARIA attributes
 *
 * Design principles from game-mechanics.md:
 * - Clear, readable typography
 * - Non-overstimulating colors
 * - Immediate visual feedback
 *
 * @example
 * ```tsx
 * <NumberCard value={42} />
 * <NumberCard value={15} isCorrect />
 * <NumberCard value={8} isDragging />
 * ```
 */
export const NumberCard = ({
  value,
  isDragging = false,
  isCorrect = null,
  isIncorrect = false,
  disabled = false,
  className = '',
}: NumberCardProps): JSX.Element => {
  // Determine card background color based on state
  const getBackgroundColor = (): string => {
    if (isCorrect === true) {
      return 'bg-success-100 border-success';
    }
    if (isIncorrect) {
      return 'bg-secondary-100 border-secondary';
    }
    if (isDragging) {
      return 'bg-primary-100 border-primary';
    }
    return 'bg-white border-background-warm';
  };

  // Determine text color based on state
  const getTextColor = (): string => {
    if (isCorrect === true) {
      return 'text-success-700';
    }
    if (isIncorrect) {
      return 'text-secondary-700';
    }
    if (isDragging) {
      return 'text-primary-700';
    }
    return 'text-text-primary';
  };

  return (
    <div
      className={`
        flex items-center justify-center
        min-w-touch-lg min-h-touch-lg
        w-20 h-20
        rounded-xl
        border-2
        shadow-soft
        select-none
        transition-all duration-fast
        ${getBackgroundColor()}
        ${isDragging ? 'scale-105 shadow-lift' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}
        ${isCorrect === true ? 'ring-2 ring-success ring-offset-2' : ''}
        ${isIncorrect ? 'animate-wiggle' : ''}
        ${className}
      `}
      aria-label={`Number ${String(value)}${disabled ? ', disabled' : ''}`}
    >
      <span
        className={`
          font-bold font-math
          text-math-lg
          ${getTextColor()}
        `}
      >
        {value}
      </span>
    </div>
  );
};

export default NumberCard;
