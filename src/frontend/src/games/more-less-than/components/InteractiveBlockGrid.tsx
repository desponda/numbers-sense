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
  // Track which blocks are selected by their indices
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // For "less" operation: decompose starting number
  // For "more" operation: decompose starting number + show additional empty blocks
  const totalBlocksToShow =
    operation === 'less' ? startingNumber : startingNumber + targetRemovalCount;
  const tens = Math.floor(totalBlocksToShow / 10);
  const units = totalBlocksToShow % 10;

  // Helper to get the value of a block by its index
  const getBlockValue = (index: number): number => {
    if (index < tens) {
      return 10; // Ten rod
    }
    return 1; // Unit cube
  };

  // Calculate total VALUE of selected blocks (not count!)
  const selectedValue = Array.from(selectedIndices).reduce((sum, index) => {
    return sum + getBlockValue(index);
  }, 0);

  const toggleBlock = (index: number): void => {
    const blockValue = getBlockValue(index);
    const newSelected = new Set(selectedIndices);

    if (newSelected.has(index)) {
      // Deselect
      newSelected.delete(index);
    } else {
      // Check if adding this block would exceed target VALUE
      const currentValue = Array.from(newSelected).reduce((sum, idx) => {
        return sum + getBlockValue(idx);
      }, 0);
      if (currentValue + blockValue <= targetRemovalCount) {
        newSelected.add(index);
      }
    }
    setSelectedIndices(newSelected);
  };

  const handleDone = (): void => {
    if (selectedValue === targetRemovalCount) {
      // Calculate resulting number
      const result =
        operation === 'less'
          ? startingNumber - targetRemovalCount
          : startingNumber + targetRemovalCount;
      onComplete(result);
    }
  };

  const isCorrectValue = selectedValue === targetRemovalCount;

  // Calculate current number based on selected VALUE
  const currentBlockCount =
    operation === 'less'
      ? startingNumber - selectedValue // Removing VALUE
      : startingNumber + selectedValue; // Adding VALUE

  // Instruction text - NO "blocks" word, just the number
  const instructionText =
    operation === 'less'
      ? `Take away ${String(targetRemovalCount)}`
      : `Add ${String(targetRemovalCount)}`;

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

      {/* Progress Counter - Shows VALUE not block count */}
      <div
        className={`text-xl font-bold ${((): string => {
          if (isCorrectValue) {
            return 'text-green-600';
          }
          if (selectedValue > targetRemovalCount) {
            return 'text-red-500';
          }
          return 'text-gray-600';
        })()}`}
      >
        {String(selectedValue)} of {String(targetRemovalCount)}{' '}
        {operation === 'less' ? 'taken away' : 'added'}
        {isCorrectValue && ' ✓'}
      </div>

      {/* Block Grid */}
      <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
        {/* Render ten rods */}
        {Array.from({ length: tens }).map((_, index) => {
          const isSelected = selectedIndices.has(index);
          const isNew = isNewBlock(index);
          const blockValue = getBlockValue(index);

          // Check if selecting this block would exceed target
          const wouldExceedTarget = !isSelected && selectedValue + blockValue > targetRemovalCount;

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
                if (wouldExceedTarget) {
                  return; // Would exceed target value
                }
                toggleBlock(index);
              }}
              disabled={wouldExceedTarget}
              className={`
                relative transition-all duration-200
                min-w-[64px] min-h-[64px]
                ${shouldShowOutline ? 'opacity-30 border-2 border-dashed border-gray-400' : ''}
                ${shouldShowStrikethrough ? 'opacity-40 scale-95' : 'opacity-100 hover:opacity-80 scale-100'}
                ${operation === 'more' && !isNew ? 'cursor-default opacity-100' : ''}
                ${wouldExceedTarget ? 'opacity-20 cursor-not-allowed' : ''}
              `}
              aria-label={`Ten rod ${String(index + 1)}, value 10, ${isSelected ? 'selected' : 'not selected'}${isNew ? ', new block' : ''}${wouldExceedTarget ? ', would exceed target' : ''}`}
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
          const blockValue = getBlockValue(blockIndex);

          // Check if selecting this block would exceed target
          const wouldExceedTarget = !isSelected && selectedValue + blockValue > targetRemovalCount;

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
                if (wouldExceedTarget) {
                  return; // Would exceed target value
                }
                toggleBlock(blockIndex);
              }}
              disabled={wouldExceedTarget}
              className={`
                relative transition-all duration-200
                min-w-[64px] min-h-[64px]
                ${shouldShowOutline ? 'opacity-30 border-2 border-dashed border-gray-400 rounded-lg' : ''}
                ${shouldShowStrikethrough ? 'opacity-40 scale-95' : 'opacity-100 hover:opacity-80 scale-100'}
                ${operation === 'more' && !isNew ? 'cursor-default opacity-100' : ''}
                ${wouldExceedTarget ? 'opacity-20 cursor-not-allowed' : ''}
              `}
              aria-label={`Unit cube ${String(index + 1)}, value 1, ${isSelected ? 'selected' : 'not selected'}${isNew ? ', new block' : ''}${wouldExceedTarget ? ', would exceed target' : ''}`}
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
          disabled={!isCorrectValue}
          className={`
            px-8 py-4 min-h-[64px] min-w-[200px]
            text-xl font-bold rounded-xl
            transition-all duration-200
            ${
              isCorrectValue
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Done {operation === 'less' ? 'Taking Away' : 'Adding'} ✓
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
      {selectedValue > targetRemovalCount && (
        <p className="text-orange-500 font-medium">
          That&apos;s too much! Tap blocks again to unselect them.
        </p>
      )}
      {selectedValue > 0 && selectedValue < targetRemovalCount && (
        <p className="text-blue-500 font-medium">
          Keep going! You need {String(targetRemovalCount - selectedValue)} more.
        </p>
      )}
    </div>
  );
};
