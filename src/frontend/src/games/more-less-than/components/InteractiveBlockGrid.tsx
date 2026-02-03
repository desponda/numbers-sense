import { useState } from 'react';
import type { JSX } from 'react';

import { TenRod } from '../../../components/blocks/TenRod';
import { UnitCube } from '../../../components/blocks/UnitCube';

export interface InteractiveBlockGridProps {
  /** Starting number to display as blocks */
  startingNumber: number;
  /** How many blocks should be removed */
  targetRemovalCount: number;
  /** Operation type - determines instruction text */
  operation: 'more' | 'less';
  /** Callback when user successfully removes/adds correct number of blocks */
  onComplete: (remainingNumber: number) => void;
  /** Optional callback when user clicks skip */
  onSkip?: () => void;
}

/**
 * InteractiveBlockGrid - Hands-on block manipulation for learning "more than" / "less than"
 *
 * Child actively taps blocks to mark them for addition/removal, then confirms.
 * This concrete interaction reinforces the abstract concept of addition/subtraction.
 *
 * Pedagogical approach (CRA framework):
 * 1. Concrete: Child physically selects blocks
 * 2. Representational: Sees visual feedback
 * 3. Abstract: Identifies resulting number
 */
export const InteractiveBlockGrid = ({
  startingNumber,
  targetRemovalCount,
  operation,
  onComplete,
  onSkip,
}: InteractiveBlockGridProps): JSX.Element => {
  // For "less": tracks indices of blocks marked for removal
  // For "more": tracks indices of new blocks that have been added
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // For "less" operation: decompose starting number
  // For "more" operation: decompose starting number + show additional empty blocks
  const totalBlocksToShow =
    operation === 'less' ? startingNumber : startingNumber + targetRemovalCount;
  const tens = Math.floor(totalBlocksToShow / 10);
  const units = totalBlocksToShow % 10;

  const toggleBlock = (index: number): void => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else if (newSelected.size < targetRemovalCount) {
      // Only allow selecting up to target count
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const handleDone = (): void => {
    if (selectedIndices.size === targetRemovalCount) {
      // Calculate resulting number
      const result =
        operation === 'less'
          ? startingNumber - targetRemovalCount
          : startingNumber + targetRemovalCount;
      onComplete(result);
    }
  };

  const isCorrectCount = selectedIndices.size === targetRemovalCount;
  const currentCount = selectedIndices.size;

  // Calculate current number of blocks based on operation
  const currentBlockCount =
    operation === 'less'
      ? startingNumber - currentCount // Removing blocks
      : startingNumber + currentCount; // Adding blocks

  const blockPlural = targetRemovalCount > 1 ? 's' : '';
  const instructionText =
    operation === 'less'
      ? `Take away ${String(targetRemovalCount)} block${blockPlural}`
      : `Add ${String(targetRemovalCount)} block${blockPlural}`;

  // Helper to determine if a block is part of the starting set or a new block to be added
  const isNewBlock = (index: number): boolean => {
    if (operation === 'less') {
      return false; // All blocks are original in "less" mode
    }
    // In "more" mode, blocks beyond startingNumber are new blocks to be added
    return index >= startingNumber;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-sm">
      {/* Instruction */}
      <h3 className="text-2xl font-semibold text-gray-800">{instructionText}</h3>

      {/* Current Block Count - Large and Prominent */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl font-bold text-teal-600">{String(currentBlockCount)}</div>
        <div className="text-lg text-gray-600">current blocks</div>
      </div>

      {/* Progress Counter */}
      <div
        className={`text-xl font-bold ${((): string => {
          if (isCorrectCount) {
            return 'text-green-600';
          }
          if (currentCount > targetRemovalCount) {
            return 'text-red-500';
          }
          return 'text-gray-600';
        })()}`}
      >
        {String(currentCount)} of {String(targetRemovalCount)}{' '}
        {operation === 'less' ? 'removed' : 'added'}
        {isCorrectCount && ' ✓'}
      </div>

      {/* Block Grid */}
      <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
        {/* Render ten rods */}
        {Array.from({ length: tens }).map((_, index) => {
          const isSelected = selectedIndices.has(index);
          const isNew = isNewBlock(index);

          // For "more" operation: new blocks start as outlines and become solid when selected
          // For "less" operation: all blocks start solid and become marked when selected
          const shouldShowOutline = operation === 'more' && isNew && !isSelected;
          const shouldShowStrikethrough = operation === 'less' && isSelected;

          return (
            <button
              key={`ten-${String(index)}`}
              type="button"
              onClick={() => {
                // Only allow clicking new blocks in "more" mode, or any block in "less" mode
                if (operation === 'more' && !isNew) {
                  return; // Can't select original blocks in add mode
                }
                toggleBlock(index);
              }}
              className={`
                relative transition-all duration-200
                min-w-[64px] min-h-[64px]
                ${shouldShowOutline ? 'opacity-30 border-2 border-dashed border-gray-400' : ''}
                ${shouldShowStrikethrough ? 'opacity-40 scale-95' : 'opacity-100 hover:opacity-80 scale-100'}
                ${operation === 'more' && !isNew ? 'cursor-default' : 'cursor-pointer'}
              `}
              aria-label={`Ten rod ${String(index + 1)}, ${isSelected ? 'selected' : 'not selected'}${isNew ? ', new block' : ''}`}
            >
              <TenRod
                id={`ten-${String(index)}`}
                disabled
                className={shouldShowStrikethrough ? 'grayscale' : ''}
              />
              {shouldShowStrikethrough && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-red-500 rotate-45" />
                  <div className="w-full h-1 bg-red-500 -rotate-45 absolute" />
                </div>
              )}
              {shouldShowOutline && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-4xl text-gray-400 font-bold">+</div>
                </div>
              )}
            </button>
          );
        })}

        {/* Render unit cubes */}
        {Array.from({ length: units }).map((_, index) => {
          const blockIndex = tens + index;
          const isSelected = selectedIndices.has(blockIndex);
          const isNew = isNewBlock(blockIndex);

          const shouldShowOutline = operation === 'more' && isNew && !isSelected;
          const shouldShowStrikethrough = operation === 'less' && isSelected;

          return (
            <button
              key={`unit-${String(index)}`}
              type="button"
              onClick={() => {
                // Only allow clicking new blocks in "more" mode, or any block in "less" mode
                if (operation === 'more' && !isNew) {
                  return; // Can't select original blocks in add mode
                }
                toggleBlock(blockIndex);
              }}
              className={`
                relative transition-all duration-200
                min-w-[64px] min-h-[64px]
                ${shouldShowOutline ? 'opacity-30 border-2 border-dashed border-gray-400 rounded-lg' : ''}
                ${shouldShowStrikethrough ? 'opacity-40 scale-95' : 'opacity-100 hover:opacity-80 scale-100'}
                ${operation === 'more' && !isNew ? 'cursor-default' : 'cursor-pointer'}
              `}
              aria-label={`Unit cube ${String(index + 1)}, ${isSelected ? 'selected' : 'not selected'}${isNew ? ', new block' : ''}`}
            >
              <UnitCube
                id={`unit-${String(blockIndex)}`}
                disabled
                className={shouldShowStrikethrough ? 'grayscale' : ''}
              />
              {shouldShowStrikethrough && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-1 bg-red-500 rotate-45" />
                  <div className="w-3/4 h-1 bg-red-500 -rotate-45 absolute" />
                </div>
              )}
              {shouldShowOutline && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-2xl text-gray-400 font-bold">+</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleDone}
          disabled={!isCorrectCount}
          className={`
            px-8 py-4 min-h-[64px] min-w-[200px]
            text-xl font-bold rounded-xl
            transition-all duration-200
            ${
              isCorrectCount
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Done {operation === 'less' ? 'Removing' : 'Adding'} ✓
        </button>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="
              px-6 py-4 min-h-[64px]
              text-lg font-semibold rounded-xl
              bg-gray-200 hover:bg-gray-300 text-gray-700
              transition-colors duration-200
            "
          >
            Skip to Question
          </button>
        )}
      </div>

      {/* Help text */}
      {currentCount > targetRemovalCount && (
        <p className="text-orange-500 font-medium">
          That&apos;s too many! Tap blocks again to unselect them.
        </p>
      )}
    </div>
  );
};
