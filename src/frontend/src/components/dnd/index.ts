/**
 * Drag and Drop Components
 *
 * This module exports reusable drag-and-drop components built on @dnd-kit.
 * These components are designed for the NumberSense K-3 math education app
 * with a focus on touch-friendly interactions and accessibility.
 *
 * @example
 * ```tsx
 * import { DndProvider, Draggable, Droppable } from '@/components/dnd';
 *
 * function Game() {
 *   return (
 *     <DndProvider onDragEnd={handleDrop}>
 *       <Draggable id="item-1" data={{ type: 'number', value: 5 }}>
 *         <NumberTile>5</NumberTile>
 *       </Draggable>
 *       <Droppable id="answer" accepts={['number']}>
 *         <AnswerZone />
 *       </Droppable>
 *     </DndProvider>
 *   );
 * }
 * ```
 */

export { DndProvider } from './DndProvider';
export type { DndProviderProps, DragData, DndContextValue } from './DndProvider';

export { Draggable } from './Draggable';
export type { DraggableProps, DraggableData } from './Draggable';

export { Droppable } from './Droppable';
export type { DroppableProps } from './Droppable';

// Re-export commonly used types from @dnd-kit/core for convenience
export type { DragEndEvent, DragStartEvent, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core';
