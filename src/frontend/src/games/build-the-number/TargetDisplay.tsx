import { useEffect, useState, type JSX } from 'react';

import { Card } from '../../components/ui';

/**
 * Props for the TargetDisplay component
 */
export interface TargetDisplayProps {
  /** The target number to display */
  target: number;
  /** Whether to show visual hint (block representation) */
  showVisualHint?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Generates dots pattern for numbers 1-10 (dice-like patterns)
 */
const getDotPattern = (value: number): JSX.Element | null => {
  if (value < 1 || value > 10) {
    return null;
  }

  // Dice-style dot patterns for numbers 1-6
  const dotPatterns: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [
      [0, 0],
      [2, 2],
    ],
    3: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    4: [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ],
    5: [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ],
    6: [
      [0, 0],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
    ],
  };

  // For 7-10, use a simpler row pattern
  if (value >= 7 && value <= 10) {
    const topRow = Math.min(5, value);
    const bottomRow = value - topRow;

    return (
      <div className="flex flex-col items-center gap-2" aria-hidden="true">
        <div className="flex gap-1.5">
          {Array.from({ length: topRow }).map((_, i) => (
            <div key={`top-${String(i)}`} className="w-3 h-3 rounded-full bg-primary" />
          ))}
        </div>
        {bottomRow > 0 && (
          <div className="flex gap-1.5">
            {Array.from({ length: bottomRow }).map((_, i) => (
              <div key={`bottom-${String(i)}`} className="w-3 h-3 rounded-full bg-primary" />
            ))}
          </div>
        )}
      </div>
    );
  }

  const pattern = dotPatterns[value];
  if (pattern === undefined) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-12 h-12" aria-hidden="true">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const hasDot = pattern.some(([r, c]) => r === row && c === col);
          return (
            <div
              key={`${String(row)}-${String(col)}`}
              className={`w-3 h-3 rounded-full ${hasDot ? 'bg-primary' : 'bg-transparent'}`}
            />
          );
        }),
      )}
    </div>
  );
};

/**
 * TargetDisplay - Shows the target number to build with child-friendly styling
 *
 * Features:
 * - Large, clear number display
 * - Optional visual hint (dot pattern for numbers 1-10)
 * - Animated entrance effect
 * - Accessible with screen reader support
 *
 * Based on game-mechanics.md Easy Mode specs:
 * - Numbers 1-10 only
 * - Shows visual representation (dice pattern)
 * - Child-friendly, encouraging presentation
 *
 * @example
 * ```tsx
 * <TargetDisplay target={5} showVisualHint />
 * ```
 */
export const TargetDisplay = ({
  target,
  showVisualHint = true,
  className = '',
}: TargetDisplayProps): JSX.Element => {
  const [isAnimating, setIsAnimating] = useState(true);

  // Trigger entrance animation when target changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return (): void => {
      clearTimeout(timer);
    };
  }, [target]);

  return (
    <Card
      variant="elevated"
      padding="lg"
      className={`
        text-center
        ${isAnimating ? 'animate-bounce-in' : ''}
        ${className}
      `}
      role="region"
      aria-label={`Target number: ${String(target)}`}
    >
      {/* Instruction text */}
      <div className="text-text-secondary text-lg font-medium mb-2">Build this number:</div>

      {/* Large target number */}
      <div
        className={`
          text-6xl font-bold text-text-primary
          transition-all duration-300
          ${isAnimating ? 'scale-110' : 'scale-100'}
        `}
        aria-hidden="true"
      >
        {target}
      </div>

      {/* Visual hint - dot pattern */}
      {showVisualHint && <div className="mt-4 flex justify-center">{getDotPattern(target)}</div>}

      {/* Screen reader text */}
      <span className="sr-only">
        Build the number {target} using blocks. Drag blocks from the tray to the workspace.
      </span>
    </Card>
  );
};

export default TargetDisplay;
