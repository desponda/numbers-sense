import { useState, useCallback, useMemo } from 'react';

import type { DragStartEvent, DragEndEvent, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core';

/**
 * Data attached to a dragged item
 */
export interface DragItemData {
  type: string;
  [key: string]: unknown;
}

/**
 * Current drag state
 */
export interface DragState {
  /** ID of the currently dragging item, or null if nothing is being dragged */
  activeId: UniqueIdentifier | null;
  /** Data attached to the currently dragging item */
  activeData: DragItemData | null;
  /** ID of the drop zone currently being hovered over */
  overId: UniqueIdentifier | null;
  /** Whether a drag operation is currently in progress */
  isDragging: boolean;
}

/**
 * Handlers returned by the hook
 */
export interface DragHandlers {
  /** Handler for when a drag operation starts */
  handleDragStart: (event: DragStartEvent) => void;
  /** Handler for when a dragged item moves over a droppable zone */
  handleDragOver: (event: DragOverEvent) => void;
  /** Handler for when a drag operation ends */
  handleDragEnd: (event: DragEndEvent) => void;
  /** Handler for when a drag operation is cancelled */
  handleDragCancel: () => void;
  /** Reset the drag state manually */
  resetDragState: () => void;
}

/**
 * Options for the useDragAndDrop hook
 */
export interface UseDragAndDropOptions {
  /** Callback fired when a drag starts */
  onDragStart?: (id: UniqueIdentifier, data: DragItemData | null) => void;
  /** Callback fired when hovering over a valid drop zone */
  onDragOver?: (activeId: UniqueIdentifier, overId: UniqueIdentifier | null) => void;
  /** Callback fired when a successful drop occurs */
  onDrop?: (
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    activeData: DragItemData | null,
    overData: unknown,
  ) => void;
  /** Callback fired when drag is cancelled */
  onDragCancel?: () => void;
}

/**
 * Return type for the useDragAndDrop hook
 */
export interface UseDragAndDropReturn extends DragState, DragHandlers {}

/**
 * useDragAndDrop - Custom hook for managing drag and drop state.
 *
 * This hook provides a unified interface for tracking drag operations,
 * including the currently dragging item, hovered drop zones, and
 * handlers for all drag events.
 *
 * Features:
 * - Tracks currently dragging item with associated data
 * - Tracks which drop zone is being hovered
 * - Provides handlers for DndProvider integration
 * - Supports callbacks for custom logic
 *
 * @example
 * ```tsx
 * function GameBoard() {
 *   const {
 *     isDragging,
 *     activeId,
 *     overId,
 *     handleDragStart,
 *     handleDragOver,
 *     handleDragEnd,
 *   } = useDragAndDrop({
 *     onDrop: (activeId, overId, activeData) => {
 *       console.log(`Dropped ${activeId} onto ${overId}`);
 *     },
 *   });
 *
 *   return (
 *     <DndProvider
 *       onDragStart={handleDragStart}
 *       onDragOver={handleDragOver}
 *       onDragEnd={handleDragEnd}
 *     >
 *       {isDragging && <div>Dragging item {activeId}</div>}
 *       {overId && <div>Over zone {overId}</div>}
 *       <GameContent />
 *     </DndProvider>
 *   );
 * }
 * ```
 */
export function useDragAndDrop(options: UseDragAndDropOptions = {}): UseDragAndDropReturn {
  const { onDragStart, onDragOver, onDrop, onDragCancel } = options;

  // State for tracking the currently dragging item
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeData, setActiveData] = useState<DragItemData | null>(null);

  // State for tracking the hovered drop zone
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  // Derived state
  const isDragging = activeId !== null;

  // Reset all drag state
  const resetDragState = useCallback(() => {
    setActiveId(null);
    setActiveData(null);
    setOverId(null);
  }, []);

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const data = (active.data.current as DragItemData | undefined) ?? null;

      setActiveId(active.id);
      setActiveData(data);

      onDragStart?.(active.id, data);
    },
    [onDragStart],
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      const newOverId = over?.id ?? null;

      setOverId(newOverId);

      onDragOver?.(active.id, newOverId);
    },
    [onDragOver],
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over) {
        const overData = over.data.current ?? null;
        onDrop?.(active.id, over.id, activeData, overData);
      }

      resetDragState();
    },
    [activeData, onDrop, resetDragState],
  );

  // Handle drag cancel
  const handleDragCancel = useCallback(() => {
    onDragCancel?.();
    resetDragState();
  }, [onDragCancel, resetDragState]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // State
      activeId,
      activeData,
      overId,
      isDragging,
      // Handlers
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      handleDragCancel,
      resetDragState,
    }),
    [
      activeId,
      activeData,
      overId,
      isDragging,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      handleDragCancel,
      resetDragState,
    ],
  );
}

export default useDragAndDrop;
