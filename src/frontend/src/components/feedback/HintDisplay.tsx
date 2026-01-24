import { useEffect, useState, type JSX, type ReactNode } from 'react';

import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export interface HintDisplayProps {
  /** Whether to show the hint */
  isVisible: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Hint content - can be text or block visualization */
  children: ReactNode;
  /** Title for the hint (default: "Hint") */
  title?: string;
}

/**
 * Block visualization component for Build the Number hints
 */
export interface BlockVisualizationProps {
  /** Target number to visualize */
  targetNumber: number;
}

/**
 * BlockVisualization - Shows a number as base-10 blocks
 *
 * Used in hints to show children how to represent a number
 * with hundred flats, ten rods, and unit cubes.
 */
export const BlockVisualization = ({ targetNumber }: BlockVisualizationProps): JSX.Element => {
  const hundreds = Math.floor(targetNumber / 100);
  const tens = Math.floor((targetNumber % 100) / 10);
  const ones = targetNumber % 10;

  return (
    <div className="flex flex-col gap-4">
      {/* Number display */}
      <div className="text-center">
        <span className="text-3xl font-bold text-text-primary">{targetNumber}</span>
        <span className="text-lg text-text-secondary ml-2">can be built with:</span>
      </div>

      {/* Block representation */}
      <div className="flex flex-wrap justify-center gap-6">
        {/* Hundreds */}
        {hundreds > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: hundreds }, (_, i) => (
                <div
                  key={`hundred-${String(i)}`}
                  className={`
                    w-12 h-12 rounded-lg
                    bg-blocks-hundred
                    border-2 border-blocks-hundred/80
                    shadow-soft
                    grid grid-cols-2 grid-rows-2 gap-px p-1
                  `}
                  aria-hidden="true"
                >
                  <div className="bg-white/30 rounded-sm" />
                  <div className="bg-white/30 rounded-sm" />
                  <div className="bg-white/30 rounded-sm" />
                  <div className="bg-white/30 rounded-sm" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-text-secondary">
              {hundreds} hundred{hundreds !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Tens */}
        {tens > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: tens }, (_, i) => (
                <div
                  key={`ten-${String(i)}`}
                  className={`
                    w-4 h-12 rounded-md
                    bg-blocks-ten
                    border-2 border-blocks-ten/80
                    shadow-soft
                    flex flex-col gap-px p-0.5
                  `}
                  aria-hidden="true"
                >
                  {Array.from({ length: 5 }, (__, j) => (
                    <div key={j} className="flex-1 bg-white/30 rounded-sm" />
                  ))}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-text-secondary">
              {tens} ten{tens !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Ones */}
        {ones > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1 flex-wrap justify-center max-w-[80px]">
              {Array.from({ length: ones }, (_, i) => (
                <div
                  key={`one-${String(i)}`}
                  className={`
                    w-5 h-5 rounded
                    bg-blocks-unit
                    border-2 border-blocks-unit/80
                    shadow-soft
                  `}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-text-secondary">
              {ones} one{ones !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Show message if number is 0 */}
        {hundreds === 0 && tens === 0 && ones === 0 && (
          <span className="text-text-muted">No blocks needed for zero!</span>
        )}
      </div>
    </div>
  );
};

/**
 * HintDisplay - Shows hints when requested
 *
 * Displays helpful information to guide the child without
 * giving away the answer directly.
 *
 * Features:
 * - Subtle entrance animation
 * - Dismissible with button
 * - Supports text or block visualization
 * - Warm, non-distracting design
 *
 * @example
 * ```tsx
 * // Text hint
 * <HintDisplay isVisible={showHint} onDismiss={() => setShowHint(false)}>
 *   <p>Try counting by tens first!</p>
 * </HintDisplay>
 *
 * // Block visualization hint
 * <HintDisplay isVisible={showHint} onDismiss={() => setShowHint(false)}>
 *   <BlockVisualization targetNumber={23} />
 * </HintDisplay>
 * ```
 */
export const HintDisplay = ({
  isVisible,
  onDismiss,
  children,
  title = 'Hint',
}: HintDisplayProps): JSX.Element | null => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleDismiss = (): void => {
    setIsAnimating(false);
    setTimeout(() => {
      onDismiss?.();
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      handleDismiss();
    }
  };

  if (!isVisible && !isAnimating) {
    return null;
  }

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-primary-100/30
        transition-opacity duration-fast
        ${isAnimating && isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-title"
    >
      {/* Click outside to dismiss */}
      <div
        className="absolute inset-0"
        onClick={handleDismiss}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Close hint"
      />

      {/* Hint card */}
      <div
        className={`
          relative
          bg-white rounded-2xl shadow-lift
          px-6 py-5
          max-w-md mx-4
          animate-pop
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-primary-500">
              <Icon name="hint" size="md" />
            </div>
            <h2 id="hint-title" className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
          </div>

          <Button variant="ghost" size="sm" onClick={handleDismiss} aria-label="Close hint">
            <Icon name="close" size="sm" />
          </Button>
        </div>

        {/* Hint content */}
        <div className="text-text-secondary">{children}</div>

        {/* Got it button */}
        <div className="mt-4 flex justify-center">
          <Button variant="primary" size="md" onClick={handleDismiss}>
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
};
