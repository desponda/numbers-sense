import type { JSX } from 'react';

/**
 * Block colors from game-mechanics.md specification
 */
const BLOCK_COLORS = {
  unit: '#4ECDC4', // Teal for unit cubes
  ten: '#FF6B6B', // Coral Red for ten rods
  hundred: '#95E1D3', // Mint Green for hundred flats
} as const;

/**
 * Props for the BlockRepresentation component
 */
export interface BlockRepresentationProps {
  /** The number value to represent with blocks */
  value: number;
  /** Whether to show the number value below the blocks */
  showValue?: boolean;
  /** Optional size scale factor (default 1.0) */
  scale?: number;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Renders a single unit cube (value = 1)
 */
const UnitCubeVisual = ({ scale = 1 }: { scale?: number }): JSX.Element => {
  const size = 20 * scale;
  return (
    <div
      className="rounded-sm"
      style={{
        width: `${String(size)}px`,
        height: `${String(size)}px`,
        backgroundColor: BLOCK_COLORS.unit,
        boxShadow: `
          inset 1px 1px 2px rgba(255, 255, 255, 0.3),
          inset -1px -1px 1px rgba(0, 0, 0, 0.1)
        `,
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Renders a ten rod (value = 10) as a horizontal strip of 10 segments
 */
const TenRodVisual = ({ scale = 1 }: { scale?: number }): JSX.Element => {
  const segmentSize = 20 * scale;
  const gap = 1 * scale;

  return (
    <div
      className="flex rounded-sm"
      style={{
        height: `${String(segmentSize)}px`,
        backgroundColor: BLOCK_COLORS.ten,
        padding: `${String(gap)}px`,
        gap: `${String(gap)}px`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: `${String(segmentSize - 2 * gap)}px`,
            height: '100%',
            backgroundColor: BLOCK_COLORS.ten,
            boxShadow: `
              inset 1px 1px 2px rgba(255, 255, 255, 0.3),
              inset -1px -1px 1px rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Renders a hundred flat (value = 100) as a 10x10 grid
 */
const HundredFlatVisual = ({ scale = 1 }: { scale?: number }): JSX.Element => {
  const cellSize = 16 * scale;
  const gap = 1 * scale;

  return (
    <div
      className="rounded-md"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(10, ${String(cellSize)}px)`,
        gap: `${String(gap)}px`,
        padding: `${String(2 * scale)}px`,
        backgroundColor: BLOCK_COLORS.hundred,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: `${String(cellSize)}px`,
            height: `${String(cellSize)}px`,
            backgroundColor: BLOCK_COLORS.hundred,
            boxShadow: `
              inset 1px 1px 1px rgba(255, 255, 255, 0.3),
              inset -0.5px -0.5px 0.5px rgba(0, 0, 0, 0.08)
            `,
            border: '0.5px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
    </div>
  );
};

/**
 * BlockRepresentation - Visual representation of a number using base-10 blocks.
 *
 * This component displays a number using the canonical base-10 block representation:
 * - Hundred flats (10x10 grids) for hundreds place
 * - Ten rods (horizontal strips) for tens place
 * - Unit cubes (small squares) for ones place
 *
 * Used in Phase 1 of the Sort the Numbers game where children sort
 * visual representations before transitioning to numeric sorting.
 *
 * Design follows game-mechanics.md specification:
 * - Maintains proportional relationships between block types
 * - Uses consistent colors from the spec
 * - Read-only visualization (not draggable)
 *
 * @example
 * ```tsx
 * <BlockRepresentation value={35} showValue />
 * // Renders: 3 ten rods + 5 unit cubes with "35" below
 * ```
 */
export const BlockRepresentation = ({
  value,
  showValue = false,
  scale = 1,
  className = '',
}: BlockRepresentationProps): JSX.Element => {
  // Decompose the number into hundreds, tens, and ones
  const hundreds = Math.floor(value / 100);
  const tens = Math.floor((value % 100) / 10);
  const ones = value % 10;

  // Generate aria-label for accessibility
  const getAriaLabel = (): string => {
    const parts: string[] = [];
    if (hundreds > 0) {
      parts.push(`${String(hundreds)} hundred${hundreds > 1 ? 's' : ''}`);
    }
    if (tens > 0) {
      parts.push(`${String(tens)} ten${tens > 1 ? 's' : ''}`);
    }
    if (ones > 0) {
      parts.push(`${String(ones)} one${ones > 1 ? 's' : ''}`);
    }
    return `Number ${String(value)} shown as blocks: ${parts.join(', ')}`;
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 ${className}`}
      role="img"
      aria-label={getAriaLabel()}
    >
      {/* Block visualization container */}
      <div className="flex flex-col items-start gap-2 p-2">
        {/* Hundred flats */}
        {Array.from({ length: hundreds }, (_, i) => (
          <HundredFlatVisual key={`hundred-${String(i)}`} scale={scale * 0.5} />
        ))}

        {/* Ten rods */}
        {Array.from({ length: tens }, (_, i) => (
          <TenRodVisual key={`ten-${String(i)}`} scale={scale} />
        ))}

        {/* Unit cubes - arranged in rows of 5 for easier counting */}
        {ones > 0 && (
          <div className="flex flex-wrap gap-1" style={{ maxWidth: `${String(110 * scale)}px` }}>
            {Array.from({ length: ones }, (_, i) => (
              <UnitCubeVisual key={`unit-${String(i)}`} scale={scale} />
            ))}
          </div>
        )}
      </div>

      {/* Optional value label */}
      {showValue && (
        <div
          className="text-text-primary font-semibold text-center"
          style={{ fontSize: `${String(16 * scale)}px` }}
        >
          = {value}
        </div>
      )}
    </div>
  );
};

export default BlockRepresentation;
