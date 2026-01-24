import type { JSX } from 'react';

import { Draggable } from '../dnd';

/**
 * Block colors from game-mechanics.md specification
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
 * Design specifications:
 * - Visual size: 48x48px
 * - Touch target: 64x64px minimum
 * - Color: #4ECDC4 (Teal)
 * - Draggable using @dnd-kit
 * - Gentle bounce animation on drop (0.15s ease-out)
 *
 * Based on game-mechanics.md:
 * - Value: 1
 * - Drag behavior: Individual placement
 * - Sound: Soft "click" on placement
 * - Animation: Gentle bounce on drop
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
          w-12 h-12
          min-w-touch-lg min-h-touch-lg
          flex items-center justify-center
          rounded-lg
          shadow-soft
          select-none
          transition-transform duration-150 ease-out
          ${disabled ? 'opacity-50' : 'hover:scale-105'}
        `}
        style={{
          backgroundColor: BLOCK_COLORS.unit,
          // Inner visual box
          padding: '8px',
        }}
        role="img"
        aria-label="One block, value 1"
        data-block-type="unit"
        data-block-value={1}
      >
        {/* Inner cube visualization with subtle 3D effect */}
        <div
          className="w-full h-full rounded-md"
          style={{
            backgroundColor: BLOCK_COLORS.unit,
            boxShadow: `
              inset 2px 2px 4px rgba(255, 255, 255, 0.3),
              inset -1px -1px 2px rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      </div>
    </Draggable>
  );
};

export default UnitCube;
