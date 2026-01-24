import type { JSX } from 'react';

import { Draggable } from '../dnd';

/**
 * Block colors - pedagogically aligned with learning-science-principles.md
 * The ten rod uses unit cube color (#4ECDC4) for segments to show "10 ones = 1 ten"
 * with a subtle coral frame (#FF6B6B) to indicate grouping
 */
const BLOCK_COLORS = {
  unitCube: '#4ECDC4', // Teal - same as unit cubes to show connection
  tenFrame: '#FF6B6B', // Coral - subtle frame showing they're grouped
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
 * Design specifications (based on learning-science-principles.md):
 * - Shows 10 clearly visible unit cubes in a row
 * - Each segment uses the SAME color as UnitCube (#4ECDC4) to reinforce
 *   the connection that "10 ones = 1 ten"
 * - Subtle coral frame indicates grouping
 * - Proportional to unit cubes (10x wider)
 *
 * Pedagogical rationale:
 * - "Proportional materials help children understand the multiplicative
 *   relationship between place values" - Fuson & Briars (1990)
 * - Visual consistency helps children see that a ten rod IS 10 unit cubes
 *
 * @example
 * ```tsx
 * <TenRod id="ten-1" />
 * ```
 */
export const TenRod = ({ id, disabled = false, className = '' }: TenRodProps): JSX.Element => {
  // Generate 10 segment elements - each visually matching a unit cube
  const segments = Array.from({ length: 10 }, (_, index) => index);

  return (
    <Draggable id={id} data={{ type: 'ten', value: 10 }} disabled={disabled} className={className}>
      <div
        className={`
          min-h-touch-lg
          flex items-center justify-center
          rounded-lg
          shadow-md
          select-none
          transition-transform duration-150 ease-out
          ${disabled ? 'opacity-50' : 'hover:scale-[1.02]'}
        `}
        style={{
          width: 'fit-content',
          backgroundColor: BLOCK_COLORS.tenFrame,
          padding: '3px',
          border: `2px solid ${BLOCK_COLORS.tenFrame}`,
          borderRadius: '10px',
        }}
        role="img"
        aria-label="Ten rod: 10 ones grouped together, value 10"
        data-block-type="ten"
        data-block-value={10}
      >
        {/* 10 unit cubes in a row - each looks like a mini unit cube */}
        <div className="flex gap-[3px]">
          {segments.map((index) => (
            <div
              key={index}
              className="rounded-md"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: BLOCK_COLORS.unitCube,
                boxShadow: `
                  inset 2px 2px 4px rgba(255, 255, 255, 0.4),
                  inset -1px -1px 2px rgba(0, 0, 0, 0.15),
                  0 1px 2px rgba(0, 0, 0, 0.1)
                `,
                border: '1px solid rgba(255, 255, 255, 0.3)',
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
