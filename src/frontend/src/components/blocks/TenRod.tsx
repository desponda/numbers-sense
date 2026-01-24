import type { JSX } from 'react';

import { Draggable } from '../dnd';

/**
 * Block colors - pedagogically aligned with learning-science-principles.md
 * The ten rod uses a cohesive teal color with subtle segment markers
 */
const BLOCK_COLORS = {
  rod: '#4ECDC4', // Teal - consistent with unit cubes
  rodDark: '#3BB5AD', // Darker teal for segment lines
  highlight: 'rgba(255, 255, 255, 0.4)', // 3D highlight effect
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
 * - Single unified bar with subtle segment markers (like real Dienes blocks)
 * - 10 segments indicated by subtle vertical lines
 * - Same teal color as UnitCube to show connection
 * - Sleek, proportional design (10x width of unit cube)
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
  return (
    <Draggable id={id} data={{ type: 'ten', value: 10 }} disabled={disabled} className={className}>
      <div
        className={`
          flex items-center justify-center
          select-none
          transition-transform duration-150 ease-out
          ${disabled ? 'opacity-50' : 'hover:scale-[1.02]'}
        `}
        style={{
          width: '200px',
          height: '32px',
          backgroundColor: BLOCK_COLORS.rod,
          borderRadius: '2px',
          position: 'relative',
          boxShadow: `
            inset 0 2px 4px ${BLOCK_COLORS.highlight},
            inset 0 -2px 4px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.15)
          `,
          border: `1px solid ${BLOCK_COLORS.rodDark}`,
        }}
        role="img"
        aria-label="Ten rod: 10 ones grouped together, value 10"
        data-block-type="ten"
        data-block-value={10}
      >
        {/* Segment lines - evenly spaced */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          aria-hidden="true"
        >
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={i}
              x1={`${String((i + 1) * 10)}%`}
              y1="0"
              x2={`${String((i + 1) * 10)}%`}
              y2="100%"
              stroke={BLOCK_COLORS.rodDark}
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          ))}
        </svg>
        {/* Value label */}
        <span
          className="font-bold text-white drop-shadow-sm"
          style={{
            fontSize: '14px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          10
        </span>
      </div>
    </Draggable>
  );
};

export default TenRod;
