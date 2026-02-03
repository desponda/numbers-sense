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
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Decompose starting number into tens and units
  const tens = Math.floor(startingNumber / 10);
  const units = startingNumber % 10;

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
      // Calculate remaining number
      const remaining =
        operation === 'less'
          ? startingNumber - targetRemovalCount
          : startingNumber + targetRemovalCount;
      onComplete(remaining);
    }
  };

  const isCorrectCount = selectedIndices.size === targetRemovalCount;
  const currentCount = selectedIndices.size;

  const blockPlural = targetRemovalCount > 1 ? 's' : '';
  const instructionText =
    operation === 'less'
      ? `Take away ${String(targetRemovalCount)} block${blockPlural}`
      : `Add ${String(targetRemovalCount)} block${blockPlural}`;

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-sm">
      {/* Instruction */}
      <h3 className="text-2xl font-semibold text-gray-800">{instructionText}</h3>

      {/* Counter */}
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
          return (
            <button
              key={`ten-${String(index)}`}
              type="button"
              onClick={() => {
                toggleBlock(index);
              }}
              className={`
                relative transition-all duration-200
                min-w-[64px] min-h-[64px]
                ${isSelected ? 'opacity-40' : 'opacity-100 hover:opacity-80'}
                ${isSelected ? 'scale-95' : 'scale-100'}
              `}
              aria-label={`Ten rod ${String(index + 1)}, ${isSelected ? 'selected' : 'not selected'}`}
            >
              <TenRod
                id={`ten-${String(index)}`}
                disabled
                className={isSelected ? 'grayscale' : ''}
              />
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-red-500 rotate-45" />
                  <div className="w-full h-1 bg-red-500 -rotate-45 absolute" />
                </div>
              )}
            </button>
          );
        })}

        {/* Render unit cubes */}
        {Array.from({ length: units }).map((_, index) => {
          const blockIndex = tens + index;
          const isSelected = selectedIndices.has(blockIndex);
          return (
            <button
              key={`unit-${String(index)}`}
              type="button"
              onClick={() => {
                toggleBlock(blockIndex);
              }}
              className={`
                relative transition-all duration-200
                min-w-[64px] min-h-[64px]
                ${isSelected ? 'opacity-40' : 'opacity-100 hover:opacity-80'}
                ${isSelected ? 'scale-95' : 'scale-100'}
              `}
              aria-label={`Unit cube ${String(index + 1)}, ${isSelected ? 'selected' : 'not selected'}`}
            >
              <UnitCube
                id={`unit-${String(blockIndex)}`}
                disabled
                className={isSelected ? 'grayscale' : ''}
              />
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-1 bg-red-500 rotate-45" />
                  <div className="w-3/4 h-1 bg-red-500 -rotate-45 absolute" />
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
