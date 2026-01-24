import type { JSX } from 'react';

import { Draggable } from '../dnd';

/**
 * Block colors - consistent with all base-10 blocks
 * Unit cubes use the primary teal color that appears in all blocks
 */
const BLOCK_COLORS = {
  unit: '#4ECDC4', // Teal for unit cubes
} as const;

/**
 * Props for the UnitCube component
 */
export interface UnitCubeProps {
  /** Unique identifier for the block */
  id: string;
  /** Whether the block is disabled (not draggable) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * UnitCube - Single unit block representing the value 1.
 *
 * Design specifications (based on learning-science-principles.md):
 * - Represents 1 unit - the building block of our number system
 * - Same teal color (#4ECDC4) appears in TenRod segments and HundredFlat cells
 *   to show visual consistency: 10 of these = 1 ten rod, 100 = 1 hundred flat
 * - Child-friendly rounded corners and satisfying 3D effect
 *
 * Pedagogical rationale:
 * - Base unit that children can see repeated in tens and hundreds
 * - Supports the CRA (Concrete-Representational-Abstract) approach
 *
 * @example
 * ```tsx
 * <UnitCube id="unit-1" />
 * ```
 */
export const UnitCube = ({ id, disabled = false, className = '' }: UnitCubeProps): JSX.Element => {
  return (
    <Draggable id={id} data={{ type: 'unit', value: 1 }} disabled={disabled} className={className}>
      <div
        className={`
          flex items-center justify-center
          rounded-lg
          shadow-md
          select-none
          transition-transform duration-150 ease-out
          ${disabled ? 'opacity-50' : 'hover:scale-105'}
        `}
        style={{
          width: '40px',
          height: '40px',
          minWidth: '40px',
          minHeight: '40px',
          backgroundColor: BLOCK_COLORS.unit,
          boxShadow: `
            inset 3px 3px 6px rgba(255, 255, 255, 0.5),
            inset -2px -2px 4px rgba(0, 0, 0, 0.15),
            0 2px 4px rgba(0, 0, 0, 0.15)
          `,
          border: '2px solid rgba(255, 255, 255, 0.4)',
        }}
        role="img"
        aria-label="One block, value 1"
        data-block-type="unit"
        data-block-value={1}
      >
        {/* Small number indicator for youngest learners */}
        <span
          className="text-white font-bold text-sm select-none"
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            opacity: 0.9,
          }}
          aria-hidden="true"
        >
          1
        </span>
      </div>
    </Draggable>
  );
};

export default UnitCube;
