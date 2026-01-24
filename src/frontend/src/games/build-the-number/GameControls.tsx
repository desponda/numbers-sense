import type { JSX } from 'react';

import { Button, Icon } from '../../components/ui';

/**
 * Props for the GameControls component
 */
export interface GameControlsProps {
  /** Callback when Check Answer button is clicked */
  onCheckAnswer: () => void;
  /** Callback when Clear Workspace button is clicked */
  onClear: () => void;
  /** Callback when Hint button is clicked */
  onHint?: () => void;
  /** Whether the Check Answer button is disabled */
  checkDisabled?: boolean;
  /** Whether the Clear button is disabled */
  clearDisabled?: boolean;
  /** Whether hints are available */
  hintsEnabled?: boolean;
  /** Whether the controls are in a loading state */
  loading?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * GameControls - Game action buttons for Build the Number
 *
 * Features:
 * - Check Answer button (primary, large)
 * - Clear Workspace button (secondary)
 * - Optional Hint button (ghost)
 * - Fully accessible with keyboard navigation
 * - Touch-friendly large targets
 *
 * Based on game-mechanics.md:
 * - Check button validates current answer
 * - Clear button resets workspace
 * - Hints are optional and encouraging
 *
 * @example
 * ```tsx
 * <GameControls
 *   onCheckAnswer={handleCheck}
 *   onClear={handleClear}
 *   onHint={handleHint}
 *   hintsEnabled
 * />
 * ```
 */
export const GameControls = ({
  onCheckAnswer,
  onClear,
  onHint,
  checkDisabled = false,
  clearDisabled = false,
  hintsEnabled = true,
  loading = false,
  className = '',
}: GameControlsProps): JSX.Element => {
  return (
    <div
      className={`
        flex flex-col sm:flex-row items-center justify-center gap-4
        ${className}
      `}
      role="group"
      aria-label="Game controls"
    >
      {/* Hint button (ghost, left side) */}
      {hintsEnabled && onHint !== undefined && (
        <Button
          variant="ghost"
          size="lg"
          onClick={onHint}
          disabled={loading}
          leftIcon={<Icon name="hint" size="md" />}
          className="order-2 sm:order-1"
          aria-label="Get a hint"
        >
          Hint
        </Button>
      )}

      {/* Clear button (secondary) */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onClear}
        disabled={clearDisabled || loading}
        leftIcon={<Icon name="close" size="md" />}
        className="order-3 sm:order-2"
        aria-label="Clear all blocks from workspace"
      >
        Clear
      </Button>

      {/* Check Answer button (primary, most prominent) */}
      <Button
        variant="primary"
        size="lg"
        onClick={onCheckAnswer}
        disabled={checkDisabled || loading}
        loading={loading}
        leftIcon={!loading ? <Icon name="check" size="md" /> : undefined}
        className="order-1 sm:order-3 min-w-[200px]"
        aria-label="Check your answer"
      >
        Check Answer
      </Button>
    </div>
  );
};

export default GameControls;
