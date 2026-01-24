import React from 'react';

import { useDraggable, UniqueIdentifier, DraggableAttributes } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

/**
 * Data that can be attached to a draggable item
 */
export interface DraggableData {
  type: string;
  [key: string]: unknown;
}

/**
 * Props for the Draggable component
 */
export interface DraggableProps {
  /** Unique identifier for the draggable item */
  id: UniqueIdentifier;
  /** Data to attach to the draggable item (used for type checking on drop) */
  data?: DraggableData;
  /** Child elements to render as the draggable content */
  children: React.ReactNode;
  /** Whether the draggable is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Render prop for custom rendering with drag state */
  render?: (props: {
    isDragging: boolean;
    attributes: DraggableAttributes;
    listeners: Record<string, unknown> | undefined;
  }) => React.ReactNode;
}

/**
 * Draggable - Generic wrapper component for draggable elements.
 *
 * Features:
 * - Touch-optimized with minimum drag distance (configured in DndProvider)
 * - Visual feedback during drag (opacity, scale, shadow)
 * - Accessible with keyboard support
 * - Supports custom data for type checking on drop
 *
 * UX Guidelines followed:
 * - Touch targets should be 48-64px minimum (apply to children)
 * - Immediate visual feedback (<200ms) via CSS transitions
 * - Smooth animations (150-300ms) for transform effects
 *
 * @example
 * ```tsx
 * <Draggable id="number-5" data={{ type: 'number', value: 5 }}>
 *   <NumberTile value={5} />
 * </Draggable>
 * ```
 */
export const Draggable: React.FC<DraggableProps> = ({
  id,
  data,
  children,
  disabled = false,
  className = '',
  render,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
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

  // Apply transform styles during drag
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    // Visual feedback during drag
    opacity: isDragging ? 0.5 : 1,
    // Scale slightly when dragging for visual prominence
    scale: isDragging ? '1.05' : '1',
    // Smooth transition for immediate visual feedback (<200ms)
    transition: isDragging
      ? 'opacity 100ms ease, scale 150ms ease'
      : 'opacity 150ms ease, scale 150ms ease, transform 200ms ease',
    // Elevate dragged item visually
    boxShadow: isDragging
      ? '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)'
      : 'none',
    // Ensure proper cursor
    cursor: getCursor(),
    // Touch optimization
    touchAction: 'none',
    // Prevent text selection during drag
    userSelect: 'none',
    WebkitUserSelect: 'none',
    // Ensure z-index during drag
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative',
  };

  // Support render prop pattern for advanced customization
  if (render) {
    return (
      <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
        {render({ isDragging, attributes, listeners })}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable ${isDragging ? 'draggable--dragging' : ''} ${
        disabled ? 'draggable--disabled' : ''
      } ${className}`}
      {...attributes}
      {...listeners}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};

export default Draggable;
