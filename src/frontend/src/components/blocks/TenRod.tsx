import type { JSX } from 'react';

import { Draggable } from '../dnd';

/**
 * Block colors from game-mechanics.md specification
 */
const BLOCK_COLORS = {
  ten: '#FF6B6B', // Coral Red for ten rods
} as const;

/**
 * Props for the TenRod component
 */
export interface TenRodProps {
  /** Unique identifier for the block */
  id: string;
  /** Whether the block is disabled (not draggable) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * TenRod - Ten rod block representing the value 10.
 *
 * Design specifications:
 * - Visual size: 480x48px (10 unit cubes wide)
 * - Color: #FF6B6B (Coral Red)
 * - Shows 10 segments to reinforce "10 ones = 1 ten"
 * - Draggable using @dnd-kit
 * - Smooth animation (0.15s ease-out)
 *
 * Based on game-mechanics.md:
 * - Value: 10
 * - Visual: Shows 10 segments
 * - Tap behavior: Optional counting animation (1, 2, 3... 10)
 * - Long-press: Breaks into 10 individual units (decomposition)
 *
 * @example
 * ```tsx
 * <TenRod id="ten-1" />
 * ```
 */
export const TenRod = ({ id, disabled = false, className = '' }: TenRodProps): JSX.Element => {
  // Generate 10 segment elements
  const segments = Array.from({ length: 10 }, (_, index) => index);

  return (
    <Draggable id={id} data={{ type: 'ten', value: 10 }} disabled={disabled} className={className}>
      <div
        className={`
          h-12
          min-h-touch-lg
          flex items-center justify-center
          rounded-lg
          shadow-soft
          select-none
          transition-transform duration-150 ease-out
          ${disabled ? 'opacity-50' : 'hover:scale-[1.02]'}
        `}
        style={{
          width: '480px',
          backgroundColor: BLOCK_COLORS.ten,
          padding: '4px',
        }}
        role="img"
        aria-label="Ten rod, value 10"
        data-block-type="ten"
        data-block-value={10}
      >
        {/* Container for 10 segment visualization */}
        <div className="flex gap-[2px] w-full h-full">
          {segments.map((index) => (
            <div
              key={index}
              className="flex-1 rounded-sm"
              style={{
                backgroundColor: BLOCK_COLORS.ten,
                boxShadow: `
                  inset 1px 1px 2px rgba(255, 255, 255, 0.3),
                  inset -1px -1px 1px rgba(0, 0, 0, 0.1)
                `,
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export default TenRod;
