import React, { useCallback, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  Announcements,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * Data attached to draggable items
 */
export interface DragData {
  type: string;
  [key: string]: unknown;
}

/**
 * Context value for tracking drag state
 */
export interface DndContextValue {
  activeId: UniqueIdentifier | null;
  activeData: DragData | null;
  overId: UniqueIdentifier | null;
}

/**
 * Props for the DndProvider component
 */
export interface DndProviderProps {
  /** Child components to render within the DnD context */
  children: React.ReactNode;
  /** Callback fired when a drag operation ends with a successful drop */
  onDragEnd?: (event: DragEndEvent) => void;
  /** Callback fired when a drag operation starts */
  onDragStart?: (event: DragStartEvent) => void;
  /** Callback fired when a dragged item is over a droppable zone */
  onDragOver?: (event: DragOverEvent) => void;
  /** Callback fired when a drag operation is cancelled */
  onDragCancel?: () => void;
  /** Optional content to render in the drag overlay */
  dragOverlayContent?: React.ReactNode;
}

// Accessibility announcements for screen readers
const announcements: Announcements = {
  onDragStart({ active }) {
    return `Picked up draggable item ${String(active.id)}. Use arrow keys to move, space to drop.`;
  },
  onDragOver({ active, over }) {
    if (over) {
      return `Draggable item ${String(active.id)} is over droppable area ${String(over.id)}.`;
    }
    return `Draggable item ${String(active.id)} is no longer over a droppable area.`;
  },
  onDragEnd({ active, over }) {
    if (over) {
      return `Draggable item ${String(active.id)} was dropped over droppable area ${String(over.id)}.`;
    }
    return `Draggable item ${String(active.id)} was dropped.`;
  },
  onDragCancel({ active }) {
    return `Dragging was cancelled. Draggable item ${String(active.id)} was returned to its starting position.`;
  },
};

/**
 * DndProvider - Wrapper component that provides DnD context for the application.
 *
 * Features:
 * - Touch-friendly sensors with configurable activation distance
 * - Keyboard accessibility support for navigation
 * - Screen reader announcements for accessibility
 * - Tracks active drag state for visual feedback
 *
 * @example
 * ```tsx
 * <DndProvider onDragEnd={handleDrop}>
 *   <Draggable id="item-1">Drag me</Draggable>
 *   <Droppable id="zone-1">Drop here</Droppable>
 * </DndProvider>
 * ```
 */
export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  onDragEnd,
  onDragStart,
  onDragOver,
  onDragCancel,
  dragOverlayContent,
}) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Configure sensors for touch-friendly drag operations
  // Minimum distance prevents accidental drags on touch devices
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Minimum distance before drag starts (touch-optimized)
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // Delay before drag starts on touch (prevents scroll interference)
        delay: 150,
        // Tolerance for movement during delay
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
      onDragStart?.(event);
    },
    [onDragStart],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      onDragEnd?.(event);
    },
    [onDragEnd],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    onDragCancel?.();
  }, [onDragCancel]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            'To pick up a draggable item, press space or enter. While dragging, use the arrow keys to move the item. Press space or enter again to drop the item in its new position, or press escape to cancel.',
        },
      }}
    >
      {children}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {activeId !== null ? dragOverlayContent : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DndProvider;
