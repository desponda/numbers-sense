/**
 * Sort the Numbers Game
 *
 * A game for teaching number ordering and comparison skills.
 * Children sort numbers from smallest to biggest using:
 * - Phase 1: Visual block representations
 * - Phase 2: Numeric representations only
 *
 * Components:
 * - SortTheNumbersGame: Main game container
 * - SortableItem: Draggable wrapper for sortable items
 * - SortingArea: Drop zone with position indicators
 * - BlockRepresentation: Visual block display for numbers
 * - NumberCard: Simple number display card
 */

// Main game component
export { SortTheNumbersGame } from './SortTheNumbersGame';
export type { SortTheNumbersGameProps } from './SortTheNumbersGame';

// Sortable components
export { SortableItem } from './SortableItem';
export type { SortableItemProps } from './SortableItem';

export { SortingArea } from './SortingArea';
export type { SortingAreaProps, SortingLayout } from './SortingArea';

// Display components
export { BlockRepresentation } from './BlockRepresentation';
export type { BlockRepresentationProps } from './BlockRepresentation';

export { NumberCard } from './NumberCard';
export type { NumberCardProps } from './NumberCard';
