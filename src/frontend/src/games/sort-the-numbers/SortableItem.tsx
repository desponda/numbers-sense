import type { JSX, ReactNode } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Props for the SortableItem component
 */
export interface SortableItemProps {
  /** Unique identifier for the sortable item */
  id: string;
  /** Child content to render inside the sortable container */
  children: ReactNode;
  /** Whether the item is disabled (not sortable) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * SortableItem - Draggable wrapper component for sortable items.
 *
 * Uses @dnd-kit/sortable to provide:
 * - Touch and mouse drag support
 * - Keyboard accessibility (Tab, Space/Enter to pick up, Arrow keys to move)
 * - Visual feedback during drag operations
 * - Smooth animations for position changes
 *
 * Accessibility features:
 * - Full keyboard navigation support
 * - Screen reader announcements via DndProvider
 * - Focus indicators for keyboard users
 * - ARIA attributes for drag state
 *
 * @example
 * ```tsx
 * <SortableItem id="item-1">
 *   <NumberCard value={42} />
 * </SortableItem>
 * ```
 */
export const SortableItem = ({
  id,
  children,
  disabled = false,
  className = '',
}: SortableItemProps): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } =
    useSortable({
      id,
      disabled,
    });

  // Determine cursor based on state
  const getCursor = (): string => {
    if (disabled) {
      return 'not-allowed';
    }
    if (isDragging) {
      return 'grabbing';
    }
    return 'grab';
  };

  // Transform styles for drag operations
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Visual feedback during drag
    opacity: isDragging ? 0.5 : 1,
    // Elevate dragged item
    zIndex: isDragging ? 1000 : 'auto',
    // Touch optimization
    touchAction: 'none',
    // Cursor states
    cursor: getCursor(),
    // Prevent layout shift
    position: 'relative',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        sortable-item
        outline-none
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        rounded-xl
        ${isDragging ? 'sortable-item--dragging shadow-lift' : ''}
        ${isSorting ? 'sortable-item--sorting' : ''}
        ${disabled ? 'sortable-item--disabled' : ''}
        ${className}
      `}
      {...attributes}
      {...listeners}
      aria-disabled={disabled}
      aria-roledescription="sortable item"
      data-sortable-id={id}
    >
      {children}
    </div>
  );
};

export default SortableItem;
