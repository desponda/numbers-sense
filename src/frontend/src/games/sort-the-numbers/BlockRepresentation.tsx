import type { JSX } from 'react';

/**
 * Block colors from game-mechanics.md specification
 */
const BLOCK_COLORS = {
  unit: '#4ECDC4', // Teal for unit cubes
  unitDark: '#3BB5AD', // Darker teal for segment lines
  ten: '#4ECDC4', // Same teal for ten rods (they're made of units)
  tenDark: '#3BB5AD', // Darker teal for segment lines
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
  const size = 16 * scale;
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
        border: `1px solid ${BLOCK_COLORS.unitDark}`,
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Renders a vertical ten rod (value = 10) - compact vertical bar with segment lines
 */
const TenRodVisual = ({ scale = 1 }: { scale?: number }): JSX.Element => {
  const width = 16 * scale;
  const height = 80 * scale; // 5x height for compactness while showing value

  return (
    <div
      className="rounded-md relative"
      style={{
        width: `${String(width)}px`,
        height: `${String(height)}px`,
        backgroundColor: BLOCK_COLORS.ten,
        boxShadow: `
          inset 2px 2px 4px rgba(255, 255, 255, 0.4),
          inset -1px -1px 2px rgba(0, 0, 0, 0.1),
          0 2px 4px rgba(0, 0, 0, 0.15)
        `,
        border: `1px solid ${BLOCK_COLORS.tenDark}`,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Horizontal segment lines showing 10 parts */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        aria-hidden="true"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={i}
            x1="15%"
            y1={`${String((i + 1) * 10)}%`}
            x2="85%"
            y2={`${String((i + 1) * 10)}%`}
            stroke={BLOCK_COLORS.tenDark}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        ))}
      </svg>
    </div>
  );
};

/**
 * Renders a hundred flat (value = 100) as a compact square
 */
const HundredFlatVisual = ({ scale = 1 }: { scale?: number }): JSX.Element => {
  const size = 80 * scale; // Same height as ten rod for visual alignment

  return (
    <div
      className="rounded-md relative"
      style={{
        width: `${String(size)}px`,
        height: `${String(size)}px`,
        backgroundColor: BLOCK_COLORS.hundred,
        boxShadow: `
          inset 2px 2px 4px rgba(255, 255, 255, 0.4),
          inset -1px -1px 2px rgba(0, 0, 0, 0.1),
          0 2px 4px rgba(0, 0, 0, 0.15)
        `,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* 10x10 grid lines */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        aria-hidden="true"
      >
        {/* Vertical lines */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`v-${String(i)}`}
            x1={`${String((i + 1) * 10)}%`}
            y1="5%"
            x2={`${String((i + 1) * 10)}%`}
            y2="95%"
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth="0.5"
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`h-${String(i)}`}
            x1="5%"
            y1={`${String((i + 1) * 10)}%`}
            x2="95%"
            y2={`${String((i + 1) * 10)}%`}
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth="0.5"
          />
        ))}
      </svg>
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

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      role="img"
      aria-label={getAriaLabel()}
    >
      {/* Block visualization - horizontal row layout */}
      <div className="flex items-end gap-1" style={{ minHeight: `${String(84 * scale)}px` }}>
        {/* Hundred flats */}
        {Array.from({ length: hundreds }, (_, i) => (
          <HundredFlatVisual key={`hundred-${String(i)}`} scale={scale} />
        ))}

        {/* Ten rods - vertical bars side by side */}
        {tens > 0 && (
          <div className="flex gap-[2px]">
            {Array.from({ length: tens }, (_, i) => (
              <TenRodVisual key={`ten-${String(i)}`} scale={scale} />
            ))}
          </div>
        )}

        {/* Unit cubes - compact 2-column grid */}
        {ones > 0 && (
          <div
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(2, ${String(16 * scale)}px)`,
              alignSelf: 'end',
            }}
          >
            {Array.from({ length: ones }, (_, i) => (
              <UnitCubeVisual key={`unit-${String(i)}`} scale={scale} />
            ))}
          </div>
        )}
      </div>

      {/* Optional value label */}
      {showValue && (
        <div
          className="text-text-primary font-bold text-center mt-1"
          style={{ fontSize: `${String(14 * scale)}px` }}
        >
          = {value}
        </div>
      )}
    </div>
  );
};

export default BlockRepresentation;
