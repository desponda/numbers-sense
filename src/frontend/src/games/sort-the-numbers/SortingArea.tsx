import type { JSX, ReactNode } from 'react';

import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

/**
 * Layout orientation for the sorting area
 */
export type SortingLayout = 'horizontal' | 'vertical';

/**
 * Position indicator labels
 */
const POSITION_LABELS: Record<number, string> = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
  6: '6th',
  7: '7th',
  8: '8th',
  9: '9th',
  10: '10th',
};

/**
 * Props for the SortingArea component
 */
export interface SortingAreaProps {
  /** Array of item IDs in their current order */
  items: string[];
  /** Child elements (sortable items) */
  children: ReactNode;
  /** Layout orientation */
  layout?: SortingLayout;
  /** Whether to show position indicators (1st, 2nd, 3rd...) */
  showPositions?: boolean;
  /** Label for the smallest end */
  smallestLabel?: string;
  /** Label for the biggest end */
  biggestLabel?: string;
  /** Validation results for each position (true = correct, false = incorrect, null = not validated) */
  validationResults?: (boolean | null)[];
  /** Additional CSS class names */
  className?: string;
}

/**
 * SortingArea - Drop zone container for the sorting game.
 *
 * Provides:
 * - Sortable context for @dnd-kit
 * - Visual position indicators (1st, 2nd, 3rd...)
 * - Labels for smallest/biggest ends
 * - Visual feedback for correct/incorrect positions
 * - Support for horizontal and vertical layouts
 *
 * Design follows game-mechanics.md:
 * - Clear visual hierarchy
 * - Non-overstimulating feedback colors
 * - Touch-friendly spacing
 *
 * @example
 * ```tsx
 * <SortingArea
 *   items={['item-1', 'item-2', 'item-3']}
 *   showPositions
 *   smallestLabel="smallest"
 *   biggestLabel="biggest"
 * >
 *   {items.map(item => (
 *     <SortableItem key={item.id} id={item.id}>
 *       <NumberCard value={item.value} />
 *     </SortableItem>
 *   ))}
 * </SortingArea>
 * ```
 */
export const SortingArea = ({
  items,
  children,
  layout = 'horizontal',
  showPositions = true,
  smallestLabel = 'smallest',
  biggestLabel = 'biggest',
  validationResults,
  className = '',
}: SortingAreaProps): JSX.Element => {
  const isHorizontal = layout === 'horizontal';
  const strategy = isHorizontal ? horizontalListSortingStrategy : verticalListSortingStrategy;

  // Get validation state class for a position
  const getPositionStateClass = (index: number): string => {
    if (validationResults === undefined || validationResults[index] === null) {
      return 'text-text-muted bg-background-warm';
    }
    if (validationResults[index] === true) {
      return 'text-success-600 bg-success-100';
    }
    return 'text-secondary-600 bg-secondary-100';
  };

  return (
    <div
      className={`
        flex flex-col gap-3
        p-4
        bg-background-cream
        rounded-2xl
        border-2 border-dashed border-background-warm
        ${className}
      `}
      role="region"
      aria-label="Sorting area - arrange numbers from smallest to biggest"
    >
      {/* Direction labels */}
      <div
        className={`
          flex items-center justify-between
          text-sm text-text-muted font-medium
          ${isHorizontal ? 'flex-row' : 'flex-col'}
        `}
      >
        <span className="px-2 py-1 bg-background-warm rounded-lg">{smallestLabel}</span>
        <span className="flex-1 text-center text-xs text-text-light">drag to sort</span>
        <span className="px-2 py-1 bg-background-warm rounded-lg">{biggestLabel}</span>
      </div>

      {/* Position indicators */}
      {showPositions && (
        <div
          className={`
            flex gap-2
            ${isHorizontal ? 'flex-row justify-center' : 'flex-col items-center'}
          `}
        >
          {items.map((_, index) => (
            <div
              key={`position-${String(index)}`}
              className={`
                w-20 h-6
                flex items-center justify-center
                text-xs font-medium
                rounded-lg
                transition-colors duration-fast
                ${getPositionStateClass(index)}
              `}
              aria-label={`Position ${String(index + 1)}`}
            >
              {POSITION_LABELS[index + 1] ?? `${String(index + 1)}th`}
            </div>
          ))}
        </div>
      )}

      {/* Sortable items container */}
      <SortableContext items={items} strategy={strategy}>
        <div
          className={`
            flex gap-3 p-3
            min-h-[100px]
            bg-white
            rounded-xl
            shadow-soft
            ${isHorizontal ? 'flex-row flex-wrap justify-center items-center' : 'flex-col items-center'}
          `}
          role="list"
          aria-label="Sortable numbers"
        >
          {children}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortingArea;
