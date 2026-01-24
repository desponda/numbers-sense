import React, { useCallback } from 'react';

import { useDroppable, UniqueIdentifier } from '@dnd-kit/core';

/**
 * Props for the Droppable component
 */
export interface DroppableProps {
  /** Unique identifier for the droppable zone */
  id: UniqueIdentifier;
  /** Array of item types that this zone accepts */
  accepts?: string[];
  /** Child elements to render within the droppable zone */
  children: React.ReactNode;
  /** Callback fired when an acceptable item is dropped */
  onDrop?: (itemId: UniqueIdentifier, itemData: unknown) => void;
  /** Whether the droppable zone is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Custom styles for different states */
  styles?: {
    default?: React.CSSProperties;
    over?: React.CSSProperties;
    accepting?: React.CSSProperties;
  };
  /** Render prop for custom rendering with drop state */
  render?: (props: {
    isOver: boolean;
    isAccepting: boolean;
    setNodeRef: (node: HTMLElement | null) => void;
  }) => React.ReactNode;
}

/**
 * Droppable - Generic component for droppable zones.
 *
 * Features:
 * - Accepts filtering by item type
 * - Visual feedback when item is hovering (highlight)
 * - Accessible with screen reader announcements
 * - Customizable styles for different states
 *
 * UX Guidelines followed:
 * - Immediate visual feedback (<200ms) when item hovers
 * - Clear visual distinction for valid drop targets
 * - Smooth animations (150-300ms) for state transitions
 *
 * @example
 * ```tsx
 * <Droppable
 *   id="answer-zone"
 *   accepts={['number']}
 *   onDrop={(id, data) => handleAnswer(data)}
 * >
 *   <DropZoneContent />
 * </Droppable>
 * ```
 */
export const Droppable: React.FC<DroppableProps> = ({
  id,
  accepts = [],
  children,
  onDrop,
  disabled = false,
  className = '',
  styles = {},
  render,
}) => {
  const { isOver, active, setNodeRef } = useDroppable({
    id,
    disabled,
    data: {
      accepts,
      onDrop,
    },
  });

  // Check if the currently dragged item is acceptable
  const isAccepting = useCallback(() => {
    const currentData = active?.data.current;
    if (currentData === undefined) {
      return false;
    }
    if (accepts.length === 0) {
      return true;
    }

    const itemType = currentData.type as string | undefined;
    if (typeof itemType === 'string' && itemType.length > 0) {
      return accepts.includes(itemType);
    }
    return false;
  }, [active, accepts]);

  const accepting = isAccepting();

  // Determine styles based on state
  const getStateStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      // Smooth transition for visual feedback (<200ms)
      transition:
        'background-color 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease',
      // Minimum touch target size (48-64px)
      minWidth: '48px',
      minHeight: '48px',
      // Visual container
      position: 'relative',
      ...styles.default,
    };

    if (isOver && accepting) {
      return {
        ...baseStyles,
        // Highlight valid drop target
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // green-500 with opacity
        borderColor: 'rgb(34, 197, 94)', // green-500
        boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.3)',
        transform: 'scale(1.02)',
        ...styles.over,
      };
    }

    if (isOver && !accepting) {
      return {
        ...baseStyles,
        // Indicate invalid drop
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-500 with opacity
        borderColor: 'rgb(239, 68, 68)', // red-500
        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.3)',
        ...styles.over,
      };
    }

    if (active && accepting) {
      return {
        ...baseStyles,
        // Subtle highlight when dragging a compatible item
        backgroundColor: 'rgba(59, 130, 246, 0.05)', // blue-500 with low opacity
        borderColor: 'rgba(59, 130, 246, 0.5)', // blue-500 with opacity
        ...styles.accepting,
      };
    }

    return baseStyles;
  };

  // Support render prop pattern for advanced customization
  if (render) {
    return <>{render({ isOver, isAccepting: accepting, setNodeRef })}</>;
  }

  return (
    <div
      ref={setNodeRef}
      style={getStateStyles()}
      className={`droppable ${isOver ? 'droppable--over' : ''} ${
        accepting ? 'droppable--accepting' : ''
      } ${disabled ? 'droppable--disabled' : ''} ${className}`}
      role="region"
      aria-label={`Drop zone ${String(id)}`}
      data-droppable-id={id}
      data-is-over={isOver}
      data-is-accepting={accepting}
    >
      {children}
    </div>
  );
};

export default Droppable;
