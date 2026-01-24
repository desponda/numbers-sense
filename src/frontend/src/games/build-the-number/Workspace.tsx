import { useCallback, type JSX } from 'react';

import { UnitCube } from '../../components/blocks';
import { Droppable } from '../../components/dnd';

import type { Block } from '../../game-engine';

/**
 * Props for the Workspace component
 */
export interface WorkspaceProps {
  /** Unique identifier for the workspace droppable area */
  id: string;
  /** Array of blocks currently in the workspace */
  blocks: Block[];
  /** Current total value of blocks in workspace */
  currentValue: number;
  /** Target value for comparison (used for visual feedback) */
  targetValue?: number;
  /** Callback when a block is clicked/tapped for removal */
  onBlockRemove?: (blockId: string) => void;
  /** Whether the workspace is in a correct state */
  isCorrect?: boolean;
  /** Whether the workspace is in an incorrect state */
  isIncorrect?: boolean;
  /** Whether the workspace is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Workspace - Drop zone for building numbers with base-10 blocks
 *
 * Features:
 * - Droppable area using @dnd-kit
 * - Shows placed blocks visually
 * - Live counter showing current total
 * - Visual feedback for correct/incorrect states
 * - Blocks can be removed by clicking/tapping
 *
 * Based on game-mechanics.md:
 * - Building workspace shows current value
 * - Visual feedback when correct (green glow)
 * - Visual feedback when incorrect (orange highlight)
 *
 * @example
 * ```tsx
 * <Workspace
 *   id="workspace"
 *   blocks={workspaceBlocks}
 *   currentValue={5}
 *   targetValue={7}
 *   onBlockRemove={handleRemoveBlock}
 * />
 * ```
 */
export const Workspace = ({
  id,
  blocks,
  currentValue,
  targetValue,
  onBlockRemove,
  isCorrect = false,
  isIncorrect = false,
  disabled = false,
  className = '',
}: WorkspaceProps): JSX.Element => {
  const handleBlockClick = useCallback(
    (blockId: string) => {
      if (!disabled && onBlockRemove) {
        onBlockRemove(blockId);
      }
    },
    [disabled, onBlockRemove],
  );

  // Determine comparison indicator
  const getComparisonIndicator = (): JSX.Element | null => {
    if (targetValue === undefined || currentValue === 0) {
      return null;
    }

    const difference = targetValue - currentValue;

    if (difference === 0) {
      return <span className="text-success font-semibold">Perfect!</span>;
    }

    if (difference > 0) {
      return <span className="text-text-secondary">Need {difference} more</span>;
    }

    return <span className="text-secondary">{Math.abs(difference)} too many</span>;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Workspace header with live counter */}
      <div className="flex items-center justify-between px-2">
        <div className="text-text-secondary text-sm font-medium">Your blocks:</div>
        <div className="flex items-center gap-2">
          <span
            className={`
              text-2xl font-bold
              transition-colors duration-200
              ${isCorrect ? 'text-success' : ''}
              ${isIncorrect ? 'text-secondary' : ''}
              ${!isCorrect && !isIncorrect ? 'text-text-primary' : ''}
            `}
            aria-live="polite"
            aria-atomic="true"
          >
            {currentValue}
          </span>
          {targetValue !== undefined && (
            <span className="text-sm text-text-light">{getComparisonIndicator()}</span>
          )}
        </div>
      </div>

      {/* Droppable workspace area */}
      <Droppable
        id={id}
        accepts={['unit', 'ten', 'hundred']}
        disabled={disabled}
        className={`
          relative
          min-h-[160px]
          bg-white
          border-2 border-dashed
          rounded-2xl
          p-content-lg
          transition-all duration-200
          ${isCorrect ? 'border-success bg-success/5 shadow-glow-success' : ''}
          ${isIncorrect ? 'border-secondary bg-secondary/5' : ''}
          ${!isCorrect && !isIncorrect ? 'border-text-light' : ''}
          ${disabled ? 'opacity-50' : ''}
        `}
        styles={{
          default: {
            minHeight: '160px',
          },
          over: {
            borderColor: isCorrect ? 'rgb(125, 206, 130)' : 'rgb(107, 154, 232)',
            backgroundColor: isCorrect ? 'rgba(125, 206, 130, 0.1)' : 'rgba(107, 154, 232, 0.05)',
          },
          accepting: {
            borderColor: 'rgba(107, 154, 232, 0.5)',
          },
        }}
      >
        {/* Empty state message */}
        {blocks.length === 0 && (
          <div
            className="
              absolute inset-0
              flex items-center justify-center
              text-text-light text-lg
              pointer-events-none
            "
            aria-hidden="true"
          >
            Drop blocks here
          </div>
        )}

        {/* Placed blocks */}
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          role="region"
          aria-label={`Workspace with ${String(blocks.length)} blocks, total value ${String(currentValue)}`}
        >
          {blocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => {
                handleBlockClick(block.id);
              }}
              disabled={disabled}
              className={`
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                rounded-lg
                transition-transform duration-150
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
              `}
              aria-label={`Remove ${block.type} block with value ${String(block.value)}`}
            >
              {/* For Easy Mode, only unit cubes are used */}
              {block.type === 'unit' && <UnitCube id={block.id} disabled />}
            </button>
          ))}
        </div>

        {/* Screen reader live region for changes */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Current total is {currentValue}.
          {targetValue !== undefined && currentValue === targetValue && ' That matches the target!'}
          {targetValue !== undefined &&
            currentValue < targetValue &&
            ` Need ${String(targetValue - currentValue)} more.`}
          {targetValue !== undefined &&
            currentValue > targetValue &&
            ` That's ${String(currentValue - targetValue)} too many.`}
        </div>
      </Droppable>

      {/* Instruction hint */}
      <div className="text-center text-text-light text-sm">Tap a block to remove it</div>
    </div>
  );
};

export default Workspace;
