import type { JSX } from 'react';

import { Draggable } from '../dnd';

/**
 * Block colors from game-mechanics.md specification
 */
const BLOCK_COLORS = {
  hundred: '#95E1D3', // Mint Green for hundred flats
} as const;

/**
 * Props for the HundredFlat component
 */
export interface HundredFlatProps {
  /** Unique identifier for the block */
  id: string;
  /** Whether the block is disabled (not draggable) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * HundredFlat - Hundred flat block representing the value 100.
 *
 * Design specifications:
 * - Visual size: 480x480px
 * - Color: #95E1D3 (Mint Green)
 * - Shows 10x10 grid pattern
 * - Draggable using @dnd-kit
 * - Smooth animation (0.15s ease-out)
 *
 * Based on game-mechanics.md:
 * - Value: 100
 * - Visual: 10x10 grid pattern visible
 * - Tap behavior: Shows row highlighting with counting
 * - Long-press: Breaks into 10 ten-rods
 *
 * @example
 * ```tsx
 * <HundredFlat id="hundred-1" />
 * ```
 */
export const HundredFlat = ({
  id,
  disabled = false,
  className = '',
}: HundredFlatProps): JSX.Element => {
  // Generate 10x10 grid (100 cells)
  const rows = Array.from({ length: 10 }, (_, index) => index);
  const cols = Array.from({ length: 10 }, (_, index) => index);

  return (
    <Draggable
      id={id}
      data={{ type: 'hundred', value: 100 }}
      disabled={disabled}
      className={className}
    >
      <div
        className={`
          flex items-center justify-center
          rounded-xl
          shadow-soft
          select-none
          transition-transform duration-150 ease-out
          ${disabled ? 'opacity-50' : 'hover:scale-[1.01]'}
        `}
        style={{
          width: '480px',
          height: '480px',
          backgroundColor: BLOCK_COLORS.hundred,
          padding: '8px',
        }}
        role="img"
        aria-label="Hundred flat, value 100"
        data-block-type="hundred"
        data-block-value={100}
      >
        {/* 10x10 grid visualization */}
        <div className="flex flex-col gap-[2px] w-full h-full">
          {rows.map((rowIndex) => (
            <div key={rowIndex} className="flex gap-[2px] flex-1">
              {cols.map((colIndex) => (
                <div
                  key={`${String(rowIndex)}-${String(colIndex)}`}
                  className="flex-1 rounded-sm"
                  style={{
                    backgroundColor: BLOCK_COLORS.hundred,
                    boxShadow: `
                      inset 1px 1px 2px rgba(255, 255, 255, 0.3),
                      inset -1px -1px 1px rgba(0, 0, 0, 0.08)
                    `,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export default HundredFlat;
