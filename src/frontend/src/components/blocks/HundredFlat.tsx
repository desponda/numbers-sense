import type { JSX } from 'react';

import { Draggable } from '../dnd';

/**
 * Block colors - pedagogically aligned with learning-science-principles.md
 * Shows 100 teal unit cubes in a 10x10 grid with mint frame
 */
const BLOCK_COLORS = {
  unitCube: '#4ECDC4', // Teal - same as unit cubes to show "100 ones = 1 hundred"
  hundredFrame: '#95E1D3', // Mint Green - subtle frame showing grouping
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
 * Design specifications (based on learning-science-principles.md):
 * - Shows 10x10 = 100 clearly visible unit cubes
 * - Each cell uses the SAME color as UnitCube (#4ECDC4) to reinforce
 *   the connection that "100 ones = 1 hundred" or "10 tens = 1 hundred"
 * - Subtle mint frame indicates grouping
 *
 * Pedagogical rationale:
 * - "Proportional materials help children understand the multiplicative
 *   relationship between place values" - Fuson & Briars (1990)
 * - Visual consistency shows that a hundred flat IS 100 unit cubes
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
  // Generate 10x10 grid (100 cells) - each visually matching a unit cube
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
          shadow-md
          select-none
          transition-transform duration-150 ease-out
          ${disabled ? 'opacity-50' : 'hover:scale-[1.01]'}
        `}
        style={{
          width: 'fit-content',
          backgroundColor: BLOCK_COLORS.hundredFrame,
          padding: '6px',
          border: `3px solid ${BLOCK_COLORS.hundredFrame}`,
          borderRadius: '12px',
        }}
        role="img"
        aria-label="Hundred flat: 100 ones grouped together, value 100"
        data-block-type="hundred"
        data-block-value={100}
      >
        {/* 10x10 grid - each cell looks like a mini unit cube */}
        <div className="flex flex-col gap-[2px]">
          {rows.map((rowIndex) => (
            <div key={rowIndex} className="flex gap-[2px]">
              {cols.map((colIndex) => (
                <div
                  key={`${String(rowIndex)}-${String(colIndex)}`}
                  className="rounded-sm"
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: BLOCK_COLORS.unitCube,
                    boxShadow: `
                      inset 1px 1px 2px rgba(255, 255, 255, 0.4),
                      inset -0.5px -0.5px 1px rgba(0, 0, 0, 0.1)
                    `,
                    border: '0.5px solid rgba(255, 255, 255, 0.25)',
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
