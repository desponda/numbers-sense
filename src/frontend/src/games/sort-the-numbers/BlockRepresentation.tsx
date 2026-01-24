import type { JSX } from 'react';

/**
 * Block colors - distinct colors for quick visual discrimination
 * while maintaining proportional SIZE relationships per research
 */
const BLOCK_COLORS = {
  unit: '#4ECDC4', // Teal for unit cubes
  ten: '#FF8C6B', // Coral/salmon for ten rods
  hundred: '#95E1D3', // Mint Green for hundred flats
} as const;

/**
 * Unit cube size - the foundational unit
 * Ten rods are literally 10 of these stacked
 * Hundred flats are 10x10 of these
 */
const UNIT_SIZE = 14; // pixels
const UNIT_GAP = 2; // pixels between units

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
  const size = UNIT_SIZE * scale;
  return (
    <div
      className="rounded-sm"
      style={{
        width: `${String(size)}px`,
        height: `${String(size)}px`,
        backgroundColor: BLOCK_COLORS.unit,
        boxShadow: `
          inset 1px 1px 2px rgba(255, 255, 255, 0.4),
          inset -1px -1px 1px rgba(0, 0, 0, 0.1),
          0 1px 2px rgba(0, 0, 0, 0.1)
        `,
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Renders a vertical ten rod (value = 10) - PROPORTIONAL: 10 unit-sized cubes stacked
 * This is critical per learning-science-principles.md:
 * "Proportional materials help children understand the multiplicative relationship"
 */
const TenRodVisual = ({ scale = 1 }: { scale?: number }): JSX.Element => {
  const size = UNIT_SIZE * scale;
  const gap = UNIT_GAP * scale;

  return (
    <div className="flex flex-col" style={{ gap: `${String(gap)}px` }} aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: `${String(size)}px`,
            height: `${String(size)}px`,
            backgroundColor: BLOCK_COLORS.ten,
            boxShadow: `
              inset 1px 1px 2px rgba(255, 255, 255, 0.4),
              inset -1px -1px 1px rgba(0, 0, 0, 0.1),
              0 1px 2px rgba(0, 0, 0, 0.1)
            `,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Renders a hundred flat (value = 100) - PROPORTIONAL: 10x10 unit-sized cubes
 */
const HundredFlatVisual = ({ scale = 1 }: { scale?: number }): JSX.Element => {
  const size = UNIT_SIZE * scale;
  const gap = UNIT_GAP * scale;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(10, ${String(size)}px)`,
        gap: `${String(gap)}px`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: `${String(size)}px`,
            height: `${String(size)}px`,
            backgroundColor: BLOCK_COLORS.hundred,
            boxShadow: `
              inset 1px 1px 1px rgba(255, 255, 255, 0.4),
              inset -0.5px -0.5px 0.5px rgba(0, 0, 0, 0.1)
            `,
          }}
        />
      ))}
    </div>
  );
};

/**
 * BlockRepresentation - Visual representation of a number using base-10 blocks.
 *
 * Uses a VERTICAL layout optimized for small screens:
 * - Hundred flats as compact 10x10 squares
 * - Ten rods as vertical bars (arranged side-by-side)
 * - Unit cubes in a compact grid
 *
 * This layout eliminates horizontal scrolling while maintaining
 * proportional relationships between block types.
 *
 * @example
 * ```tsx
 * <BlockRepresentation value={35} showValue />
 * // Renders: 3 vertical ten rods + 5 unit cubes with "35" below
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

  // Calculate container height based on ten rod (10 units stacked)
  const tenRodHeight = (UNIT_SIZE * 10 + UNIT_GAP * 9) * scale;

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      role="img"
      aria-label={getAriaLabel()}
    >
      {/* Value label above blocks */}
      {showValue && (
        <div
          className="text-text-primary font-bold text-center mb-2"
          style={{ fontSize: `${String(16 * scale)}px` }}
        >
          {value}
        </div>
      )}

      {/* Block visualization - horizontal row layout */}
      <div className="flex items-end gap-1" style={{ minHeight: `${String(tenRodHeight)}px` }}>
        {/* Hundred flats */}
        {Array.from({ length: hundreds }, (_, i) => (
          <HundredFlatVisual key={`hundred-${String(i)}`} scale={scale} />
        ))}

        {/* Ten rods - vertical stacks of 10 unit cubes side by side */}
        {tens > 0 && (
          <div className="flex gap-[3px]">
            {Array.from({ length: tens }, (_, i) => (
              <TenRodVisual key={`ten-${String(i)}`} scale={scale} />
            ))}
          </div>
        )}

        {/* Unit cubes - single column for clear comparison to ten rods */}
        {ones > 0 && (
          <div className="flex flex-col gap-[2px]" style={{ alignSelf: 'end' }}>
            {Array.from({ length: ones }, (_, i) => (
              <UnitCubeVisual key={`unit-${String(i)}`} scale={scale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockRepresentation;
